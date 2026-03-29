<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHomepageDataMapStore } from '@/stores/homepage-data-map'
import { useLeafletMap } from '@/composables/useLeafletMap'

const store = useHomepageDataMapStore()
const { isBootstrapLoading, bootstrapError } = storeToRefs(store)

const mapEl = ref<HTMLElement | null>(null)
const legendEl = ref<HTMLElement | null>(null)

const { initMap } = useLeafletMap(mapEl, legendEl)

onMounted(async () => {
  try {
    await store.loadBootstrapData()

    if (!store.icMapConfig) {
      throw new Error('ICMAPconfig manquant')
    }

    if (store.defaultConf) {
      store.applyConf(store.defaultConf)
    }

    initMap({
      base: store.activeBase,
      overlays: [...store.activeOverlays],
    })
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="data-map relative z-0">
    <div v-if="isBootstrapLoading" class="data-map__status">Chargement des donnees de carte...</div>
    <div v-if="bootstrapError" class="data-map__status data-map__status--error">
      {{ bootstrapError }}
    </div>
    <div class="data-map__container">
      <div ref="mapEl" class="data-map__leaflet" />
      <div ref="legendEl" class="data-map__legend" />
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
