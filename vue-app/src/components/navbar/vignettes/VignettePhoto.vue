<script setup lang="ts">
import type { GetPhotoliveVignettesResponse } from '@/client/misc.api.types'
import type { VignettePhoto } from '@/client/user.api.types'
import { computed } from 'vue'

const props = defineProps<{
  // Specific to each photo:
  photo: VignettePhoto
  // Common for all photos:
  bgSpriteUrl: string
  vignettePhotosInformation: null | GetPhotoliveVignettesResponse['responseData']
}>()

const photoInformation = computed(() => {
  if (!props.vignettePhotosInformation) {
    return ''
  }
  return `${props.vignettePhotosInformation[`v${props.photo.photo_index}v` as `v${1 | 2 | 3}v`] || ''}<br />${props.vignettePhotosInformation[`l${props.photo.photo_index}l` as `l${1 | 2 | 3}l`] || ''}`
})
const photoUrl = computed(() => {
  if (!props.vignettePhotosInformation) {
    return ''
  }
  return props.vignettePhotosInformation[
    `photourl${props.photo.photo_index}x` as `photourl${1 | 2 | 3}x`
  ]
})

/*
Used to be:
 onmouseover="$(this).find('div').show().find('div').html(`${JSON_PL['v<?= $nb_photolive ?>v']||''}<br />${JSON_PL['l<?= $nb_photolive ?>l']||''}`).show();"
 onclick="$(this).attr('href',JSON_PL['photourl'.$nb_photolive.'x']);"
*/
</script>

<template>
  <a
    :href="`${photoUrl || `/accueil/pass.php?a=${photo.photo_index}`}`"
    :style="{
      overflow: 'hidden',
      boxShadow: '0 0 3px #000',
      width: '90px',
      height: '70px',
      display: 'inline-block',
      backgroundImage: `url(${bgSpriteUrl}?tk${photo.time_key})`,
      backgroundPosition: `-${photo.photo_index * 90 - 90}px 0px`,
      textDecoration: 'none',
      borderRadius: '4px',
    }"
    class="lien_photolive_UKSQ"
  >
    <template v-if="photoInformation">
      <div class="photo-info" v-html="photoInformation"></div>
    </template>
  </a>
</template>

<style scoped>
/*  
 Since latest tailwind, when @apply, 
 we need to use `@reference "tailwindcss";` (https://tailwindcss.com/docs/functions-and-directives#apply-directive) 
*/
@reference "@/assets/base.less";

a {
  @apply relative;
}
.photo-info {
  display: none;
  background-color: rgba(0, 0, 0, 0.7);

  @apply absolute h-full w-full p-2 text-white text-xxs text-center;
}
a:hover {
  .photo-info {
    display: block !important;
  }
}
</style>
