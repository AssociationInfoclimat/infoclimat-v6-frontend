<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import wms from 'leaflet.wms'
import { GestureHandling } from 'leaflet-gesture-handling'
import { useHomepageDataMapStore } from '@/stores/homepage-data-map'
import { storeToRefs } from 'pinia'
import homeCommonScript from '@/lib/map-data-builder/home.common2017.js?raw'
import homeControllerScript from '@/lib/map-data-builder/home.controller2017.js?raw'
import type { IcMapConfig, LieuPref } from '@/client/data-map.api.types'

const homepageDataMapStore = useHomepageDataMapStore()
const { mapDataMenuSelected, isBootstrapLoading, bootstrapError } =
  storeToRefs(homepageDataMapStore)

const mapContainer = ref<HTMLDivElement | null>(null)
let isGestureHandlingRegistered = false

type LegacyWindow = Window &
  typeof globalThis & {
    L?: any
    map?: any
    layerGroup?: any
    overlayGroup?: any
    photoliveGroup?: any
    _lprefGroup?: any
    _bindedMarker?: boolean
    _view_blank?: [number, number]
    _init_zoom?: false | number
    dec_long?: number
    ICMAPconfig?: IcMapConfig
    ICMAPtoken?: string
    DEFAULT_CONF?: Record<string, unknown>
    _lieuxPrefs?: Record<string, unknown> | LieuPref[]
    updateParamFromMap?: (...args: any[]) => any
    overlayLayer?: (...args: any[]) => any
    checkUpdates?: (...args: any[]) => any
  }

const getScriptId = (key: string) => `legacy-map-script-${key}`

function loadExternalScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Impossible de charger le script legacy: ${src}`))
    document.head.appendChild(script)
  })
}

function injectInlineScript(code: string, id: string) {
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.type = 'text/javascript'
  script.text = code
  document.body.appendChild(script)
}

function renderLegend(content: string, top: number, left: number) {
  const legend = document.getElementById('leaflet-legend')
  if (!legend) return
  legend.style.display = 'block'
  legend.style.top = `${top}px`
  legend.style.left = `${left}px`
  legend.innerHTML = content
}

function hideLegend() {
  const legend = document.getElementById('leaflet-legend')
  if (!legend) return
  legend.style.display = 'none'
}

function initFavoritesPlaces(legacyWindow: LegacyWindow) {
  const prefs = Array.isArray(legacyWindow._lieuxPrefs) ? legacyWindow._lieuxPrefs : []
  if (prefs.length === 0) return

  prefs.forEach((pref) => {
    const latlng: [number, number] = [pref.lat, pref.lon]
    L.marker(latlng, {
      icon: L.icon({
        iconUrl: 'https://static.infoclimat.net/images/v5.2/marker3.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    })
      .addTo(legacyWindow._lprefGroup)
      .on('mouseover', (e: L.LeafletMouseEvent) => {
        const originalEvent = e.originalEvent as MouseEvent
        renderLegend(`<b>${pref.lieu}</b>`, originalEvent.pageY + 7, originalEvent.pageX + 7)
        legacyWindow._bindedMarker = true
      })
      .on('mouseout', () => {
        hideLegend()
        legacyWindow._bindedMarker = false
      })
  })
}

function applyInitialMapView(legacyWindow: LegacyWindow) {
  const viewBlank: [number, number] = [46.5, 2.42 + 7.14 / 2]
  legacyWindow._view_blank = viewBlank
  legacyWindow._init_zoom = false
  legacyWindow.dec_long = 0

  try {
    const savedView = localStorage.getItem('home.mapviewnew')
    if (!savedView) {
      legacyWindow.map.setView(viewBlank, 6)
      return
    }
    const [latRaw, lonRaw, zoomRaw] = savedView.split('|')
    const lat = Number(latRaw)
    const lon = Number(lonRaw)
    const zoom = Number(zoomRaw)
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(zoom)) {
      legacyWindow.map.setView(viewBlank, 6)
      return
    }
    legacyWindow.map.setView([lat, lon], zoom)
  } catch {
    legacyWindow.map.setView(viewBlank, 6)
  }
}

function runInitialLegacyLayerSelection(legacyWindow: LegacyWindow) {
  const defaultConf = legacyWindow.DEFAULT_CONF as { base?: string; overlays?: string[] } | null

  if (defaultConf?.base && typeof legacyWindow.updateParamFromMap === 'function') {
    legacyWindow.updateParamFromMap(defaultConf.base, defaultConf.overlays, false, true)
    if (Array.isArray(defaultConf.overlays) && typeof legacyWindow.overlayLayer === 'function') {
      defaultConf.overlays.forEach((overlayKey) => {
        const finalKey =
          overlayKey === 'SAT_AUTO'
            ? legacyWindow.ICMAPconfig?.isNightTime
              ? 'irAhdbtrans'
              : 'vishdbtrans'
            : overlayKey
        console.log('runInitialLegacyLayerSelection', finalKey)
        legacyWindow.overlayLayer?.(finalKey)
        console.log('runInitialLegacyLayerSelection after', finalKey)
      })
    }
  } else {
    legacyWindow.updateParamFromMap?.('meteoalerte', false, true)
  }
  // TODO:
  //legacyWindow.checkUpdates?.()
}

onMounted(() => {
  const el = mapContainer.value
  if (!el) return
  ;(async () => {
    try {
      const legacyWindow = window as LegacyWindow
      legacyWindow.L = L as unknown as LegacyWindow['L']
      ;(legacyWindow.L as any).WMS = wms
      ;(legacyWindow.L as any).wms = wms
      if (!isGestureHandlingRegistered) {
        ;(legacyWindow.L as any).Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)
        isGestureHandlingRegistered = true
      }

      // await loadExternalScript(
      //   'https://static.infoclimat.net/include/js/push.js',
      //   getScriptId('push'),
      // )
      await loadExternalScript(
        'https://static.infoclimat.net/include/js/raphael.js',
        getScriptId('raphael'),
      )
      await loadExternalScript(
        'https://static.infoclimat.net/include/js/leaflet-hash.js',
        getScriptId('leaflet-hash'),
      )
      await loadExternalScript(
        'https://static.infoclimat.net/include/js/leaflet.raphael.js',
        getScriptId('leaflet-raphael'),
      )
      await loadExternalScript(
        'https://static.infoclimat.net/include/js/idx_canvas.js',
        getScriptId('idx-canvas'),
      )

      await homepageDataMapStore.loadBootstrapData()

      if (!homepageDataMapStore.icMapConfig) {
        throw new Error('ICMAPconfig manquant')
      }

      legacyWindow.ICMAPconfig = homepageDataMapStore.icMapConfig
      legacyWindow.ICMAPtoken = homepageDataMapStore.icMapToken
      legacyWindow.DEFAULT_CONF = homepageDataMapStore.defaultConf ?? {}
      legacyWindow._lieuxPrefs = homepageDataMapStore.lieuxPrefs ?? []

      legacyWindow.layerGroup = new legacyWindow.L.LayerGroup()
      legacyWindow.overlayGroup = new legacyWindow.L.LayerGroup()
      legacyWindow.photoliveGroup = new legacyWindow.L.LayerGroup()
      legacyWindow._lprefGroup = legacyWindow.L.featureGroup()
      legacyWindow.map = legacyWindow.L.map('accueil-cartedynamique', {
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
      })

      legacyWindow.map.whenReady(() => legacyWindow.map.gestureHandling?._handleMouseOver?.())
      new legacyWindow.L.Control.Zoom({ position: 'topleft' }).addTo(legacyWindow.map)

      if (!legacyWindow.map.gestureHandling) {
        legacyWindow.map.gestureHandling = {
          enable() {},
          disable() {},
          _handleMouseOver() {},
        }
      }

      initFavoritesPlaces(legacyWindow)
      applyInitialMapView(legacyWindow)

      injectInlineScript(homeCommonScript, getScriptId('home-common'))
      injectInlineScript(homeControllerScript, getScriptId('home-controller'))

      runInitialLegacyLayerSelection(legacyWindow)
    } catch (error) {
      console.error(error)
    }
  })()
})

onBeforeUnmount(() => {
  const legacyWindow = window as LegacyWindow
  if (legacyWindow.map) {
    legacyWindow.map.remove()
    legacyWindow.map = null
  }
})
</script>

<template>
  <div class="data-map relative z-0">
    <div v-if="isBootstrapLoading" class="data-map__status">Chargement des donnees de carte...</div>
    <div v-if="bootstrapError" class="data-map__status data-map__status--error">
      {{ bootstrapError }}
    </div>
    <div id="accueil-cartedynamique-container" ref="mapContainer" class="data-map__container">
      <div id="accueil-cartedynamique" class="data-map__leaflet" />
      <div id="leaflet-legend" class="data-map__legend" />
    </div>
  </div>
</template>

<style scoped>
.data-map {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
}

.data-map__leaflet {
  z-index: 0;
  height: 400px;
  width: 100%;
}

.data-map__container {
  position: relative;
}

.data-map__status {
  font-size: 0.875rem;
}

.data-map__status--error {
  color: #b91c1c;
}

.data-map__legend {
  position: absolute;
  display: none;
  z-index: 1000;
  padding: 0.35rem 0.5rem;
  border-radius: 0.25rem;
  background: rgba(17, 24, 39, 0.9);
  color: #f9fafb;
  font-size: 0.75rem;
  pointer-events: none;
}
</style>
