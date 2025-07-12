<script setup lang="ts">
import type { VignetteStation } from '@/client/user.api.types'

const props = defineProps<{
  station: VignetteStation
}>()
</script>

<template>
  <div class="boite_station div-inner-station" v-html="station.content_as_html"></div>
</template>
