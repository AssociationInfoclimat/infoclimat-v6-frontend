import { type Ref, shallowRef, ref, watch, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import wms from 'leaflet.wms'
import { GestureHandling } from 'leaflet-gesture-handling'
import { useHomepageDataMapStore } from '@/stores/homepage-data-map'
import type { IcMapConfig, LieuPref } from '@/client/data-map.api.types'
import type { TileLayerKey } from '@/lib/map-layers/types'
import {
  DEFAULT_WMS_PARAMS,
  getUrlTemplate,
  getLayersString,
  buildTileUrl,
  NEEDS_COASTLINES_SET,
  NEXRAD_BOUNDS,
} from '@/lib/map-layers/layer-config'

let gestureHandlingRegistered = false

function ensureGestureHandling() {
  if (gestureHandlingRegistered) return
  ;(L.Map as any).addInitHook('addHandler', 'gestureHandling', GestureHandling)
  gestureHandlingRegistered = true
}

const DEFAULT_CENTER: L.LatLngTuple = [46.5, 2.42 + 7.14 / 2]
const DEFAULT_ZOOM = 6

function readSavedMapView(): { lat: number; lon: number; zoom: number } | null {
  try {
    const saved = localStorage.getItem('home.mapviewnew')
    if (!saved) return null
    const [latRaw, lonRaw, zoomRaw] = saved.split('|')
    const lat = Number(latRaw)
    const lon = Number(lonRaw)
    const zoom = Number(zoomRaw)
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(zoom)) return null
    return { lat, lon, zoom }
  } catch {
    return null
  }
}

export function useLeafletMap(
  mapElementRef: Ref<HTMLElement | null>,
  legendElementRef?: Ref<HTMLElement | null>,
) {
  const store = useHomepageDataMapStore()

  const leafletMap = shallowRef<L.Map | null>(null)
  const isReady = ref(false)

  let layerGroup: L.LayerGroup
  let overlayGroup: L.LayerGroup
  let favoritesGroup: L.FeatureGroup

  let backgroundLayer: L.TileLayer
  let coastlinesOverlay: L.TileLayer

  let currentBaseParam: string | null = null
  const renderedOverlays = new Map<string, L.TileLayer>()
  let coastlinesOnMap = false

  // ── Legend tooltip ────────────────────────────────────────

  function showLegend(html: string, x: number, y: number) {
    const el = legendElementRef?.value
    if (!el) return
    el.style.display = 'block'
    el.style.top = `${y}px`
    el.style.left = `${x}px`
    el.innerHTML = html
  }

  function hideLegend() {
    const el = legendElementRef?.value
    if (!el) return
    el.style.display = 'none'
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
          showLegend(`<b>${pref.lieu}</b>`, ev.pageX + 7, ev.pageY + 7)
        })
        .on('mouseout', () => hideLegend())
    })
  }

  // ── Base layer ───────────────────────────────────────────

  function applyBaseLayer(param: string) {
    const map = leafletMap.value
    const config = store.icMapConfig
    if (!map || !config) return

    if (param === currentBaseParam) return
    currentBaseParam = param

    layerGroup.clearLayers()
    map.removeLayer(layerGroup)
    ;(map as any).gestureHandling?.enable()
    map.setMaxZoom(11)

    if (param === 'meteoalerte') {
      layerGroup.addLayer(backgroundLayer)
    } else {
      const tileConf = config.ltiles[param as TileLayerKey]
      if (!tileConf) {
        console.error(`Unknown tile layer param: ${param}`)
        return
      }
      const url = buildTileUrl(getUrlTemplate(param), param, tileConf.info, tileConf.key)
      const layer = (wms as any).tileLayer(url, {
        ...DEFAULT_WMS_PARAMS,
        layers: getLayersString(param),
        maxZoom: 11,
        minZoom: 1,
      })
      layerGroup.addLayer(layer)
    }

    layerGroup.addTo(map)
    map.whenReady(() => (map as any).gestureHandling?._handleMouseOver?.())
  }

  // ── Overlay creation ─────────────────────────────────────

  function createOverlayLayer(param: string, config: IcMapConfig): L.TileLayer | null {
    if (param === 'estofex') return null

    let tileParam = param
    if (param === 'ac24hradaricval') tileParam = 'ac24hradaric'
    if (param === 'ac72hradaricval') tileParam = 'ac72hradaric'

    const tileConf = config.ltiles[tileParam as TileLayerKey]
    if (!tileConf && param !== 'cities') return null

    const template = getUrlTemplate(param)
    let url = buildTileUrl(template, param, tileConf?.info, tileConf?.key)

    if (param === 'vis' || param === 'irA') {
      url = url.replace(':satMO/', ':satMO2/')
    }

    if (param === 'cities') {
      return L.tileLayer(url, { maxZoom: 11, minZoom: 1 })
    }

    const options: Record<string, unknown> = {
      ...DEFAULT_WMS_PARAMS,
      layers: getLayersString(param),
      maxZoom: 11,
      minZoom: 1,
    }

    if (param === 'nexrad') {
      const [lngW, lngE, latS, latN] = NEXRAD_BOUNDS
      options.bounds = L.latLngBounds({ lng: lngW, lat: latS }, { lng: lngE, lat: latN })
    }

    return (wms as any).tileLayer(url, options)
  }

  // ── Overlay sync ─────────────────────────────────────────

  function syncOverlays(desired: string[]) {
    const map = leafletMap.value
    const config = store.icMapConfig
    if (!map || !config) return

    const desiredSet = new Set(desired)

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

    if (coastlinesOnMap) coastlinesOverlay.bringToFront()
    renderedOverlays.get('cities')?.bringToFront()
  }

  // ── Combined apply ───────────────────────────────────────

  function applyLayers(base: string, overlays: string[]) {
    applyBaseLayer(base)
    syncOverlays(overlays)
  }

  // ── Init / Destroy ───────────────────────────────────────

  function initMap(initialConf?: { base: string; overlays: string[] }): boolean {
    const el = mapElementRef.value
    const config = store.icMapConfig
    if (!el || !config) return false

    ensureGestureHandling()

    layerGroup = new L.LayerGroup()
    overlayGroup = new L.LayerGroup()
    favoritesGroup = L.featureGroup()

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
      ...(DEFAULT_WMS_PARAMS as unknown as L.TileLayerOptions),
      layers: getLayersString('coastlines'),
      maxZoom: 11,
      minZoom: 1,
      opacity: 0.6,
    } as L.TileLayerOptions & { layers: string })

    addFavoritePlaces(store.lieuxPrefs)
    favoritesGroup.addTo(map)

    const savedView = readSavedMapView()
    if (savedView) {
      map.setView([savedView.lat, savedView.lon], savedView.zoom)
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
    }

    isReady.value = true

    const base = initialConf?.base ?? store.activeBase
    const overlays = initialConf?.overlays ?? [...store.activeOverlays]
    if (base) {
      applyLayers(base, overlays)
    }

    return true
  }

  function destroy() {
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

  return { leafletMap, isReady, initMap, destroy }
}
