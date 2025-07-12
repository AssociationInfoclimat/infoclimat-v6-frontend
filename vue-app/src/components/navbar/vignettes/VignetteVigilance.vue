<script setup lang="ts">
import type { VignetteVigilance } from '@/client/user.api.types'

const props = defineProps<{
  vigilance: VignetteVigilance
}>()
</script>

<template>
  <div v-html="vigilance.content_as_html"></div>
</template>

<style>
.boite_photo_vigilances > a {
  background: rgb(64, 166, 195, 0.5);
  display: inline-block;
  padding: 4px;
  border-radius: 5px;
  box-shadow: 0 0 3px black;
  width: 100px;
  box-sizing: border-box;
}
.boite_photo_vigilances > a > img {
  height: 60px;
  filter: drop-shadow(0px 0px 1px #00000055);
}
.boite_photo_vigilances > a.encelade {
  position: relative;
  display: block;
  top: -100%;
  right: -70%;
  background-color: #153a42;
  color: white;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100vw;
  text-decoration: none;
}
</style>
