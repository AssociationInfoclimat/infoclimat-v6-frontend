<script setup lang="ts">
import { getPhotoliveLatest } from '@/client/misc.api'
import type { GetPhotoliveLatestResponse } from '@/client/misc.api.types'
import { onMounted, ref } from 'vue'

const latestPhotos = ref<GetPhotoliveLatestResponse['responseData']>([])

onMounted(async () => {
  latestPhotos.value = await getPhotoliveLatest()
})
</script>

<template>
  <div
    style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
      grid-auto-rows: 50px;
      grid-gap: 2px;
      grid-auto-flow: dense;
    "
  >
    <a
      v-for="(photo, index) in latestPhotos"
      :key="photo.id"
      :href="photo.url"
      class="hoverable"
      :style="photo.is_big ? 'grid-column: span 2; grid-row: span 2;' : ''"
    >
      <div
        :style="{
          width: '100%',
          height: '100%',
          padding: 0,
          display: 'block',
          backgroundSize: 'cover',
          backgroundImage: `url(${photo.photo_url})`,
        }"
      ></div>
    </a>
  </div>
</template>
