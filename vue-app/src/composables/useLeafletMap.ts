import { type Ref, shallowRef, ref, watch, onBeforeUnmount } from 'vue'
import L, { tileLayer, type WMSOptions } from 'leaflet'
import wms from 'leaflet.wms'
import { GestureHandling } from 'leaflet-gesture-handling'
import { useHomepageDataMapStore } from '@/stores/homepage-data-map'
import type { IcMapConfigApiResponse, LieuPref, ObservationMarkerData } from '@/client/data-map.api.types'
import { getObservationMarkers, getObservationDetail } from '@/client/data-map.api'
import type { ApiTileLayerKey } from '@/lib/map-layers/types'
import {
  DEFAULT_WMS_PARAMS,
  getUrlTemplate,
  getLayersString,
  buildTileUrl,
  NEEDS_COASTLINES_SET,
  NEXRAD_BOUNDS,
} from '@/lib/map-layers/layer-config'
import type {
  BaseLayerParamWithNightLayerParam,
  OverlayParam,
} from '@/stores/homepage-data-map.types'

const DEFAULT_CENTER: L.LatLngTuple = [46.5, 2.42 + 7.14 / 2]
const DEFAULT_ZOOM = 6

let gestureHandlingRegistered = false

function ensureGestureHandling() {
  if (gestureHandlingRegistered) return
  ;(L.Map as any).addInitHook('addHandler', 'gestureHandling', GestureHandling)
  gestureHandlingRegistered = true
}

function readSavedMapView(): { lat: number; lon: number; zoom: number } | null {
  try {
    const saved = localStorage.getItem('home.mapviewnew')
    if (!saved) {
      return null
    }
    const [latRaw, lonRaw, zoomRaw] = saved.split('|')
    const lat = Number(latRaw)
    const lon = Number(lonRaw)
    const zoom = Number(zoomRaw)
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(zoom)) return null
    return {
      lat,
      lon,
      zoom,
    }
  } catch {
    return null
  }
}

export function useLeafletMap(mapElementRef: Ref<HTMLElement | null>) {
  const store = useHomepageDataMapStore()

  const leafletMap = shallowRef<L.Map | null>(null)
  const isReady = ref(false)

  let layerGroup: L.LayerGroup
  let overlayGroup: L.LayerGroup
  let favoritesGroup: L.FeatureGroup
  let markersGroup: L.LayerGroup

  let backgroundLayer: L.TileLayer
  let coastlinesOverlay: L.TileLayer

  let currentBaseParam: BaseLayerParamWithNightLayerParam | null = null
  const renderedOverlays = new Map<OverlayParam, L.TileLayer>()
  let coastlinesOnMap = false

  const observationCache = new Map<string, Record<string, unknown>>()
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null
  let markersAbortController: AbortController | null = null

  // ── Legend tooltip ────────────────────────────────────────

  const legendVisible = ref(false)
  const legendX = ref(0)
  const legendY = ref(0)
  const legendHtml = ref('')

  function showLegend(html: string, x: number, y: number) {
    legendHtml.value = html
    legendX.value = x
    legendY.value = y
    legendVisible.value = true
  }

  function hideLegend() {
    legendVisible.value = false
  }

  // ── Observation markers ────────────────────────────────────

  function formatObservationTooltip(data: Record<string, unknown>): string {
    const parts: string[] = []
    if (data.station) parts.push(`<b>${data.station}</b>`)
    if (data.temperature !== undefined) parts.push(`T: ${data.temperature}°C`)
    if (data.humidity !== undefined) parts.push(`H: ${data.humidity}%`)
    if (data.wind_speed !== undefined) parts.push(`Vent: ${data.wind_speed} km/h`)
    if (data.pressure !== undefined) parts.push(`P: ${data.pressure} hPa`)
    if (data.weather !== undefined) parts.push(`${data.weather}`)
    if (typeof data.thumb === 'string') {
      parts.push(`<img src="${data.thumb}" style="max-width:200px;max-height:100px"/>`)
    }
    if (parts.length === 0) {
      for (const [key, value] of Object.entries(data)) {
        if (key === 'type') continue
        if (value !== null && value !== undefined && value !== '') {
          parts.push(`${key}: ${value}`)
        }
      }
    }
    return parts.join('<br/>')
  }

  async function loadObservationMarkers() {
    const map = leafletMap.value
    const config = store.icMapConfig
    if (!map || !config || !store.displayMarkers) return

    if (markersAbortController) {
      markersAbortController.abort()
    }
    markersAbortController = new AbortController()
    const { signal } = markersAbortController

    markersGroup.clearLayers()

    const bounds = map.getBounds()
    const sw = bounds.getSouthWest().wrap()
    const ne = bounds.getNorthEast().wrap()
    const info = config.ltiles.meteoalerte.info

    try {
      const observations = await getObservationMarkers(
        {
          north: ne.lat,
          south: sw.lat,
          east: ne.lng,
          west: sw.lng,
          zoom: map.getZoom(),
          year: info.year,
          month: info.month,
          day: info.day,
          hour: info.hour,
          token: store.icMapToken,
        },
        signal,
      )

      if (signal.aborted) return

      for (const obs of observations) {
        L.marker([obs.lat, obs.lon], {
          riseOnHover: true,
          icon: L.icon({
            iconUrl: obs.icon,
            iconSize: obs.size,
            iconAnchor: obs.anchor,
          }),
        })
          .addTo(markersGroup)
          .on('mouseover', (e: L.LeafletMouseEvent) => {
            const ev = e.originalEvent as MouseEvent
            const cacheKey = `${obs.id}/${obs.type}/${obs.time}`

            if (observationCache.has(cacheKey)) {
              showLegend(
                formatObservationTooltip(observationCache.get(cacheKey)!),
                ev.pageX + 7,
                ev.pageY + 7,
              )
              return
            }

            hoverTimeout = setTimeout(async () => {
              try {
                const detail = await getObservationDetail({
                  id: obs.id,
                  token: store.icMapToken,
                })
                detail.type = obs.type
                observationCache.set(cacheKey, detail)
                showLegend(formatObservationTooltip(detail), ev.pageX + 7, ev.pageY + 7)
              } catch {
                /* tooltip fetch errors are non-critical */
              }
            }, 200)
          })
          .on('mouseout', () => {
            if (hoverTimeout) {
              clearTimeout(hoverTimeout)
              hoverTimeout = null
            }
            hideLegend()
          })
          .on('click', () => {
            if (obs.stid && obs.stid.length > 1) {
              window.open(
                `//www.infoclimat.fr/stations-meteo/?s=${obs.stid}&d=${obs.time.substring(0, 10)}`,
              )
            } else if (obs.type === 'WC') {
              const wcId = obs.id.split(':')[1]
              window.open(`//www.infoclimat.fr/annuaire-webcams-meteo.html#${wcId}`)
            } else {
              window.open('//www.infoclimat.fr/meteo-alerte-temps-reel.html#details')
            }
          })
      }
    } catch (err: unknown) {
      if (signal.aborted) return
      console.error('Failed to load observation markers:', err)
    }
  }

  function clearObservationMarkers() {
    if (markersAbortController) {
      markersAbortController.abort()
      markersAbortController = null
    }
    markersGroup.clearLayers()
  }

  // ── Favourite places ─────────────────────────────────────

  function addFavoritePlaces(prefs: LieuPref[]) {
    prefs.forEach((pref) => {
      L.marker([pref.lat, pref.lon], {
        icon: L.icon({
          iconUrl: 'https://static.infoclimat.net/images/v5.2/marker3.png',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      })
        .addTo(favoritesGroup)
        .on('mouseover', (e: L.LeafletMouseEvent) => {
          const ev = e.originalEvent as MouseEvent
          showLegend(`<b>${pref.lieu}</b>`, ev.pageX + 1, ev.pageY - 201)
        })
        .on('mouseout', () => hideLegend())
    })
  }

  // ── Base layer ───────────────────────────────────────────

  function applyBaseLayer(param: BaseLayerParamWithNightLayerParam) {
    const map = leafletMap.value
    const config = store.icMapConfig
    if (!map || !config) {
      return
    }

    if (param === currentBaseParam) {
      return
    }
    currentBaseParam = param

    layerGroup.clearLayers()
    map.removeLayer(layerGroup)
    ;(map as any).gestureHandling?.enable()
    map.setMaxZoom(11)

    if (param === 'meteoalerte') {
      layerGroup.addLayer(backgroundLayer)
    } else {
      const tileConf = config.ltiles[param as ApiTileLayerKey]
      if (!tileConf) {
        console.error(`Unknown tile layer param: ${param}`)
        return
      }
      const url = buildTileUrl(getUrlTemplate(param), param, tileConf.info, tileConf.key)
      const layer = tileLayer.wms(url, {
        ...DEFAULT_WMS_PARAMS,
        layers: getLayersString(param),
        maxZoom: 11,
        minZoom: 1,
      })
      layerGroup.addLayer(layer)
    }

    layerGroup.addTo(map)
    map.whenReady(() => (map as any).gestureHandling?._handleMouseOver?.())

    if (param === 'meteoalerte') {
      loadObservationMarkers()
    } else {
      clearObservationMarkers()
    }
  }

  // ── Overlay creation ─────────────────────────────────────

  function createOverlayLayer(
    param: OverlayParam,
    config: IcMapConfigApiResponse,
  ): L.TileLayer | null {
    // if (param === 'estofex') return null

    let tileParam = param
    //    if (param === 'ac24hradaricval') {
    //      tileParam = 'ac24hradaric'
    //    }
    //    if (param === 'ac72hradaricval') {
    //      tileParam = 'ac72hradaric'
    //    }

    const tileConf = config.ltiles[tileParam as ApiTileLayerKey]
    if (!tileConf && param !== 'cities') return null

    const template = getUrlTemplate(param)
    let url = buildTileUrl(template, param, tileConf?.info, tileConf?.key)

    //    if (param === 'vis' || param === 'irA') {
    //      url = url.replace(':satMO/', ':satMO2/')
    //    }

    if (param === 'cities') {
      return L.tileLayer(url, { maxZoom: 11, minZoom: 1 })
    }

    const options: WMSOptions = {
      ...DEFAULT_WMS_PARAMS,
      layers: getLayersString(param),
      maxZoom: 11,
      minZoom: 1,
    }

    //    if (param === 'nexrad') {
    //      const [lngW, lngE, latS, latN] = NEXRAD_BOUNDS
    //      options.bounds = L.latLngBounds({ lng: lngW, lat: latS }, { lng: lngE, lat: latN })
    //    }

    return tileLayer.wms(url, options)
  }

  // ── Overlay sync ─────────────────────────────────────────

  function syncOverlays(desired: OverlayParam[]) {
    const map = leafletMap.value
    const config = store.icMapConfig
    if (!map || !config) {
      return
    }

    const desiredSet = new Set<OverlayParam>(desired)

    for (const [key, layer] of renderedOverlays) {
      if (!desiredSet.has(key)) {
        overlayGroup.removeLayer(layer)
        renderedOverlays.delete(key)
      }
    }

    for (const key of desired) {
      if (renderedOverlays.has(key)) continue
      const layer = createOverlayLayer(key, config)
      if (layer) {
        renderedOverlays.set(key, layer)
        overlayGroup.addLayer(layer)
      }
    }

    if (renderedOverlays.size > 0 || coastlinesOnMap) {
      overlayGroup.addTo(map)
    }

    const needsCoast =
      currentBaseParam === 'meteoalerte' || desired.some((k) => NEEDS_COASTLINES_SET.has(k))

    if (needsCoast && !coastlinesOnMap) {
      overlayGroup.addLayer(coastlinesOverlay)
      coastlinesOnMap = true
    } else if (!needsCoast && coastlinesOnMap) {
      overlayGroup.removeLayer(coastlinesOverlay)
      coastlinesOnMap = false
    }

    if (coastlinesOnMap) {
      coastlinesOverlay.bringToFront()
    }
    renderedOverlays.get('cities')?.bringToFront()
  }

  // ── Combined apply ───────────────────────────────────────

  function applyLayers(base: BaseLayerParamWithNightLayerParam, overlays: OverlayParam[]) {
    applyBaseLayer(base)
    syncOverlays(overlays)
  }

  // ── Init / Destroy ───────────────────────────────────────

  function initMap(initialConf?: {
    base: BaseLayerParamWithNightLayerParam
    overlays: OverlayParam[]
  }): boolean {
    const el = mapElementRef.value
    const config = store.icMapConfig
    if (!el || !config) {
      return false
    }

    ensureGestureHandling()

    layerGroup = new L.LayerGroup()
    overlayGroup = new L.LayerGroup()
    favoritesGroup = L.featureGroup()
    markersGroup = new L.LayerGroup()

    const map = L.map(el, {
      markerZoomAnimation: true,
      zoomAnimation: true,
      maxZoom: 11,
      minZoom: 2,
      maxBounds: [
        [-120, -300],
        [120, 300],
      ],
      attributionControl: false,
      zoomControl: false,
      gestureHandling: true,
    } as L.MapOptions & { gestureHandling: boolean })

    map.whenReady(() => (map as any).gestureHandling?._handleMouseOver?.())
    new L.Control.Zoom({ position: 'topleft' }).addTo(map)

    if (!(map as any).gestureHandling) {
      ;(map as any).gestureHandling = {
        enable() {},
        disable() {},
        _handleMouseOver() {},
      }
    }

    leafletMap.value = map

    backgroundLayer = L.tileLayer(getUrlTemplate('meteoalerteli'), {
      maxZoom: 11,
      minZoom: 1,
    })

    coastlinesOverlay = L.tileLayer(getUrlTemplate('coastlines'), {
      ...DEFAULT_WMS_PARAMS,
      layers: getLayersString('coastlines'),
      maxZoom: 11,
      minZoom: 1,
      opacity: 0.6,
    } as L.TileLayerOptions & { layers: string })

    addFavoritePlaces(store.lieuxPrefs)
    favoritesGroup.addTo(map)
    markersGroup.addTo(map)

    const savedView = readSavedMapView()
    if (savedView) {
      map.setView([savedView.lat, savedView.lon], savedView.zoom)
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
    }

    isReady.value = true

    map.on('moveend', () => {
      if (currentBaseParam === 'meteoalerte' && store.displayMarkers) {
        loadObservationMarkers()
      }
    })

    const base = initialConf?.base ?? store.activeBase
    const overlays = initialConf?.overlays ?? [...store.activeOverlays]
    if (base) {
      applyLayers(base, overlays)
    }

    return true
  }

  function destroy() {
    if (markersAbortController) {
      markersAbortController.abort()
      markersAbortController = null
    }
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      hoverTimeout = null
    }
    observationCache.clear()
    if (leafletMap.value) {
      leafletMap.value.remove()
      leafletMap.value = null
    }
    isReady.value = false
    currentBaseParam = null
    renderedOverlays.clear()
    coastlinesOnMap = false
  }

  // ── Watchers ─────────────────────────────────────────────

  watch(
    () => [store.activeBase, store.activeOverlays] as const,
    ([base, overlays]) => {
      if (!isReady.value || !base) return
      applyLayers(base, overlays)
    },
    { deep: true },
  )

  onBeforeUnmount(destroy)

  return {
    leafletMap,
    isReady,
    legendVisible,
    legendX,
    legendY,
    legendHtml,
    initMap,
    destroy,
  }
}
