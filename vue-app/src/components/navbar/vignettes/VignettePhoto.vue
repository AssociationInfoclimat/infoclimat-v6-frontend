<script setup lang="ts">
import type { VignettePhoto } from '@/client/user.api.types'

const props = defineProps<{
  photo: VignettePhoto
  bgSpriteUrl: string
}>()

/*
var JSON_PL = [];
$(function () {
    $.getJSON('/photolive/vignettes/infos.json', {dt: new Date().getTime()}, function (d) {
        JSON_PL = d;
    });
    $('.lien_photolive_UKSQ').mouseleave(function () {
        $(this).find('div').fadeOut(400);
    });
});
onmouseover="$(this).find('div').show().find('div').html(`${JSON_PL['v<?= $nb_photolive ?>v']||''}<br />${JSON_PL['l<?= $nb_photolive ?>l']||''}`).show();"
onclick="$(this).attr('href',JSON_PL['photourl'.$nb_photolive.'x']);"
*/
</script>

<template>
  <a
    :href="`/accueil/pass.php?a=${photo.photo_index}`"
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
    <div class="itphoto_info" style="background-color: rgba(0, 0, 0, 0.7)">
      <div style="padding: 5px"></div>
    </div>
  </a>
</template>
