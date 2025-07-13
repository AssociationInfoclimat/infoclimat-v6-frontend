<script setup lang="ts">
import type { VignetteStation } from '@/client/user.api.types'
import { computed } from 'vue';

const props = defineProps<{
  station: VignetteStation
}>()

const processedHtml = computed(() => {
  return props.station.content_as_html.replace('/images/pictos_vent/S.png', 'https://infoclimat.fr/images/pictos_vent/S.png')
})
</script>

<template>
  <div class="boite_station div-inner-station" v-html="processedHtml"></div>
</template>

<style>
/* I just took back the legacy css. We should clean this. */
.vignettes {
  background: url(//static.infoclimat.net/images/fond_vignette_station.png);
  background-repeat: no-repeat;
  width: 100px;
  height: 70px;
  margin: 0px;
  padding: 0px;
  font-size: 9px;
  text-align: center;
  color: white;
  font-size: 11px;
  text-shadow: 0px 0px 1px #000;
  -moz-text-shadow: 0px 0px 1px #000;
  -webkit-text-shadow: 0px 0px 1px #000;
}
.vignettes a.station {
    display: block;
    text-decoration: none;
    font-weight: bold;
    margin-bottom: 5px;
}
</style>
