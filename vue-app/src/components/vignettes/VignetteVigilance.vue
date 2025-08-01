<script setup lang="ts">
import type { VignetteVigilance } from '@/client/user.api.types'

const props = defineProps<{
  vigilance: VignetteVigilance
}>()
</script>

<template>
  <div class="vigilance-box" v-html="vigilance.content_as_html"></div>
</template>

<style>
/*  
 Since latest tailwind, when @apply, 
 we need to use `@reference "tailwindcss";` (https://tailwindcss.com/docs/functions-and-directives#apply-directive) 
*/
@reference "@/assets/base.less";

/* I just took back the legacy css. We should clean this. */
.vigilance-box {
  position: relative;
  height: 70px;
}
/* Not scoped because it's injected in HTML above */
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
.boite_photo_vigilances > a:first-child {
  position: relative;
  text-align: center;
}
.boite_photo_vigilances > a:first-child img {
  display: inline-block;
}
.boite_photo_vigilances > a.encelade {
  position: absolute;
  display: block;
  top: 5px;
  right: 5px;
  background-color: #153a42;
  color: white;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100vw;
  text-decoration: none;

  @apply flex items-center justify-center;
}
</style>
