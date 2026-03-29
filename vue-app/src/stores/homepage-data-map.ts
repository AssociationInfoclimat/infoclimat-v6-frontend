import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getDataMapConfig,
  getDataMapDefaultConf,
  getDataMapLieuxPrefs,
  getDataMapToken,
} from '@/client/data-map.api'
import type { DefaultMapConf, IcMapConfig, LieuPref } from '@/client/data-map.api.types'

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

  const icMapConfig = ref<IcMapConfig | null>(null)
  const icMapToken = ref('')
  const defaultConf = ref<DefaultMapConf | null>(null)
  const lieuxPrefs = ref<LieuPref[]>([])

  const mapDataMenuSelected = ref<AvailableMenu>('observations')

  const activeBase = ref('')
  const activeOverlays = ref<string[]>([])

  // ── Menu ─────────────────────────────────────────────────

  function setMapDataMenuSelected(menu: AvailableMenu) {
    mapDataMenuSelected.value = menu
  }

  // ── Param resolution helpers ─────────────────────────────

  function normalizeParam(param: string): string {
    if (param === 'MCanalysis') return 'mCanalysis'
    return param
  }

  function resolveNightTime(param: string): string {
    if (!icMapConfig.value?.isNightTime) return param
    if (param === 'vis') return 'irA'
    if (param === 'vishdbtrans') return 'irAhdbtrans'
    return param
  }

  function resolveOverlayKey(key: string): string {
    if (key === 'SAT_AUTO') {
      return icMapConfig.value?.isNightTime ? 'irAhdbtrans' : 'vishdbtrans'
    }
    return normalizeParam(key)
  }

  // ── Layer state management ───────────────────────────────

  function setBaseLayer(key: string) {
    activeBase.value = resolveNightTime(normalizeParam(key))
    const keepCities = activeOverlays.value.includes('cities')
    activeOverlays.value = keepCities ? ['cities'] : []
  }

  function toggleOverlay(key: string) {
    const resolved = resolveOverlayKey(key)
    let overlays = [...activeOverlays.value]
    const idx = overlays.indexOf(resolved)

    if (idx >= 0) {
      overlays.splice(idx, 1)
      if (resolved === 'radaric') {
        overlays = overlays.filter((k) => k !== 'nexrad')
      }
    } else {
      if (resolved === 'frT') {
        overlays = overlays.filter((k) => k !== 'mCanalysis' && k !== 'MCanalysis')
      } else if (resolved === 'mCanalysis') {
        overlays = overlays.filter((k) => k !== 'frT')
      }
      overlays.push(resolved)
      if (resolved === 'radaric' && !overlays.includes('nexrad')) {
        overlays.push('nexrad')
      }
    }

    activeOverlays.value = overlays
  }

  function applyConf(conf: DefaultMapConf) {
    activeBase.value = resolveNightTime(normalizeParam(conf.base))
    activeOverlays.value = conf.overlays.map(resolveOverlayKey)
  }

  // ── Bootstrap ────────────────────────────────────────────

  const loadBootstrapData = async () => {
    if (isBootstrapLoading.value || bootstrapReady.value) return

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
    isBootstrapLoading,
    bootstrapReady,
    bootstrapError,
    icMapConfig,
    icMapToken,
    defaultConf,
    lieuxPrefs,
    mapDataMenuSelected,
    activeBase,
    activeOverlays,
    setMapDataMenuSelected,
    setBaseLayer,
    toggleOverlay,
    applyConf,
    loadBootstrapData,
  }
})
