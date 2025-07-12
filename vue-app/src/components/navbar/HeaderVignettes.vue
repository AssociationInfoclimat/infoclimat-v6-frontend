<script setup lang="ts">
import { getUserVignettes } from '@/client/user.api'
import { type GetUserApiUserVignettesResponse } from '@/client/user.api.types'
import { onMounted, ref } from 'vue'

import VignettePhoto from './vignettes/VignettePhoto.vue'
import VignetteStation from './vignettes/VignetteStation.vue'
import VignetteCrue from './vignettes/VignetteCrue.vue'
import VignetteVigilance from './vignettes/VignetteVigilance.vue'

const vignettes = ref<GetUserApiUserVignettesResponse['responseData']>({
  vignettes: [],
  photos_sprite_url: '',
})
onMounted(async () => {
  vignettes.value = await getUserVignettes()
})
</script>

<template>
  <div class="flex flex-row gap-2">
    <template v-for="(vignette, index) in vignettes.vignettes" :key="index">
      <VignettePhoto
        v-if="vignette.type === 'photo'"
        :photo="vignette"
        :bgSpriteUrl="vignettes.photos_sprite_url"
      />
      <VignetteStation v-if="vignette.type === 'station'" :station="vignette" />
      <VignetteCrue v-if="vignette.type === 'crue'" :crue="vignette" />
      <VignetteVigilance v-if="vignette.type === 'vigilance'" :vigilance="vignette" />
    </template>
  </div>
</template>

<style></style>
