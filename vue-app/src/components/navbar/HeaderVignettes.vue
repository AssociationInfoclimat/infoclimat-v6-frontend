<script setup lang="ts">
import { getUserVignettes } from '@/client/user.api'
import { type GetUserApiUserVignettesResponse } from '@/client/user.api.types'
import { onMounted, ref } from 'vue'

import VignettePhoto from './vignettes/VignettePhoto.vue'
import VignetteStation from './vignettes/VignetteStation.vue'
import VignetteCrue from './vignettes/VignetteCrue.vue'
import VignetteVigilance from './vignettes/VignetteVigilance.vue'
import type { GetPhotoliveVignettesResponse } from '@/client/misc.api.types'
import { getPhotoliveVignettes } from '@/client/misc.api'

// $.getJSON('/photolive/vignettes/infos.json', {dt: new Date().getTime()}, function (d) {
const vignettePhotosInformation = ref<GetPhotoliveVignettesResponse['responseData'] | null>(null)
const vignettes = ref<GetUserApiUserVignettesResponse['responseData']>({
  vignettes: [],
  photos_sprite_url: '',
})
onMounted(async () => {
  vignettes.value = await getUserVignettes()
  vignettePhotosInformation.value = await getPhotoliveVignettes()
})
</script>

<template>
  <div class="flex flex-row gap-2 items-center">
    <template v-for="(vignette, index) in vignettes.vignettes" :key="index">
      <!-- Used to show "APPEL AU DON" on k=5 -->
      <template v-if="index < 5">
        <VignettePhoto
          v-if="vignette.type === 'photo'"
          :photo="vignette"
          :bgSpriteUrl="vignettes.photos_sprite_url"
          :vignettePhotosInformation="vignettePhotosInformation"
        />
        <VignetteStation v-if="vignette.type === 'station'" :station="vignette" />
        <VignetteCrue v-if="vignette.type === 'crue'" :crue="vignette" />
        <VignetteVigilance v-if="vignette.type === 'vigilance'" :vigilance="vignette" />
      </template>
    </template>
  </div>
</template>

<style></style>
