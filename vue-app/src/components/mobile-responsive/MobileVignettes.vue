<script setup lang="ts">
import type { GetUserApiUserVignettesResponse } from '@/client/user.api.types'
import { getUserVignettes } from '@/client/user.api'
import { onMounted, ref } from 'vue'
import VignetteVigilance from '@/components/vignettes/VignetteVigilance.vue'
import VignetteStation from '@/components/vignettes/VignetteStation.vue'

// In mobile, we only show the 's' (station) and 'v' (vigilance) vignettes
const vignettes = ref<GetUserApiUserVignettesResponse['responseData']>({
  vignettes: [],
  photos_sprite_url: '',
})
onMounted(async () => {
  // TODO:
  // We could use a store for this to avoid to re-fetch it each time
  vignettes.value = await getUserVignettes()
})
</script>

<template>
  <div class="flex flex-row gap-2 h-full items-center">
    <template v-for="(vignette, index) in vignettes.vignettes" :key="index">
      <VignetteStation v-if="vignette.type === 'station'" :station="vignette" />
      <VignetteVigilance v-if="vignette.type === 'vigilance'" :vigilance="vignette" />
    </template>
  </div>
</template>
