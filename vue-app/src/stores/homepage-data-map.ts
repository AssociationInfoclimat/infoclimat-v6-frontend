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
  const icMapToken = ref<string>('')
  const defaultConf = ref<DefaultMapConf | null>(null)
  const lieuxPrefs = ref<LieuPref[]>([])

  const mapDataMenuSelected = ref<AvailableMenu>('observations')

  const setMapDataMenuSelected = (menu: AvailableMenu) => {
    console.log('setMapDataMenuSelected', menu)
    mapDataMenuSelected.value = menu
  }

  const loadBootstrapData = async () => {
    if (isBootstrapLoading.value) {
      return
    }
    if (bootstrapReady.value) {
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
    isBootstrapLoading,
    bootstrapReady,
    bootstrapError,
    icMapConfig,
    icMapToken,
    defaultConf,
    lieuxPrefs,
    mapDataMenuSelected,
    setMapDataMenuSelected,
    loadBootstrapData,
  }
})
