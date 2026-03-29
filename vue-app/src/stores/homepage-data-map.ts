import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getDataMapConfig,
  getDataMapDefaultConf,
  getDataMapLieuxPrefs,
  getDataMapToken,
} from '@/client/data-map.api'
import type { DefaultMapConf, IcMapConfigApiResponse, LieuPref } from '@/client/data-map.api.types'
import type {
  BaseLayerParam,
  BaseLayerParamWithNightLayerParam,
  OverlayParam,
  OverlayParamWithAutoSat,
} from './homepage-data-map.types'

type AvailableMenu =
  | 'observations'
  | 'precipitations'
  | 'foudre'
  | 'satellite'
  | 'temperature'
  | 'pression'
  | 'webcams'
  | 'photolive'
  | 'participer'

export const useHomepageDataMapStore = defineStore('homepageDataMap', () => {
  const isBootstrapLoading = ref(false)
  const bootstrapReady = ref(false)
  const bootstrapError = ref<string | null>(null)

  const icMapConfig = ref<IcMapConfigApiResponse | null>(null)
  const icMapToken = ref<string>('')
  const defaultConf = ref<DefaultMapConf | null>(null)
  const lieuxPrefs = ref<LieuPref[]>([])

  const mapDataMenuSelected = ref<AvailableMenu>('observations')

  const activeBase = ref<BaseLayerParamWithNightLayerParam | null>(null)
  const activeOverlays = ref<OverlayParam[]>([])
  const displayMarkers = ref(true)

  // ── Menu ─────────────────────────────────────────────────

  function setMapDataMenuSelected(menu: AvailableMenu) {
    mapDataMenuSelected.value = menu
  }

  // ── Param resolution helpers ─────────────────────────────

  //  function normalizeParam(param: string): string {
  //    if (param === 'MCanalysis') {
  //      return 'mCanalysis'
  //    }
  //    return param
  //  }

  function resolveNightTimeBaseLayer(param: BaseLayerParam): BaseLayerParamWithNightLayerParam {
    if (!icMapConfig.value?.isNightTime) {
      return param
    }
    if (param === 'vis') {
      return 'irA'
    }
    if (param === 'vishdbtrans') {
      return 'irAhdbtrans'
    }
    return param
  }

  function resolveOverlayKey(key: OverlayParamWithAutoSat): OverlayParam {
    if (key === 'SAT_AUTO') {
      return icMapConfig.value?.isNightTime ? 'irAhdbtrans' : 'vishdbtrans'
    }
    // return normalizeParam(key)
    return key
  }

  // ── Layer state management ───────────────────────────────

  function setBaseLayer(key: BaseLayerParam): void {
    //
    // If key is sattelite, we return, depending on night time or not,
    //  a base layer with additional keys: irA, irAhdbtrans
    activeBase.value = resolveNightTimeBaseLayer(key) // normalizeParam(key))

    // We keep cities overlay if it is already present
    const keepCities = activeOverlays.value.includes('cities')
    activeOverlays.value = keepCities ? ['cities'] : []
  }

  //  function toggleOverlay(key: string) {
  //    const resolved = resolveOverlayKey(key)
  //    let overlays = [...activeOverlays.value]
  //    const idx = overlays.indexOf(resolved)
  //
  //    if (idx >= 0) {
  //      overlays.splice(idx, 1)
  //      if (resolved === 'radaric') {
  //        overlays = overlays.filter((k) => k !== 'nexrad')
  //      }
  //    } else {
  //      if (resolved === 'frT') {
  //        overlays = overlays.filter((k) => k !== 'mCanalysis' && k !== 'MCanalysis')
  //      } else if (resolved === 'mCanalysis') {
  //        overlays = overlays.filter((k) => k !== 'frT')
  //      }
  //      overlays.push(resolved)
  //      if (resolved === 'radaric' && !overlays.includes('nexrad')) {
  //        overlays.push('nexrad')
  //      }
  //    }
  //
  //    activeOverlays.value = overlays
  //  }

  function applyConf(conf: DefaultMapConf) {
    activeBase.value = resolveNightTimeBaseLayer(conf.base) // normalizeParam(conf.base))
    activeOverlays.value = conf.overlays.map((overlay) => resolveOverlayKey(overlay))
  }

  // ── Bootstrap ────────────────────────────────────────────

  const loadBootstrapData = async () => {
    if (isBootstrapLoading.value || bootstrapReady.value) {
      return
    }

    isBootstrapLoading.value = true
    bootstrapError.value = null

    try {
      const [mapConfig, mapToken, defaultConfiguration, prefs] = await Promise.all([
        getDataMapConfig(),
        getDataMapToken(),
        getDataMapDefaultConf(),
        getDataMapLieuxPrefs(),
      ])

      icMapToken.value = mapToken
      icMapConfig.value = mapConfig
      defaultConf.value = defaultConfiguration
      lieuxPrefs.value = prefs

      bootstrapReady.value = true
    } catch (error) {
      bootstrapError.value = error instanceof Error ? error.message : 'Failed to load map data'
      throw error
    } finally {
      isBootstrapLoading.value = false
    }
  }

  return {
    isBootstrapLoading: isBootstrapLoading,
    bootstrapReady: bootstrapReady,
    bootstrapError: bootstrapError,
    icMapConfig: icMapConfig,
    icMapToken: icMapToken,
    defaultConf: defaultConf,
    lieuxPrefs: lieuxPrefs,
    mapDataMenuSelected: mapDataMenuSelected,
    activeBase: activeBase,
    activeOverlays: activeOverlays,
    displayMarkers: displayMarkers,
    setMapDataMenuSelected: setMapDataMenuSelected,
    setBaseLayer: setBaseLayer,
    //    toggleOverlay,
    applyConf: applyConf,
    loadBootstrapData: loadBootstrapData,
  }
})
