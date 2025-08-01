<script setup lang="ts">
import type { VignetteCrue } from '@/client/user.api.types'

const props = defineProps<{
  crue: VignetteCrue
}>()
</script>

<template>
  <div class="boite_station div-inner-station" v-html="crue.content_as_html"></div>
</template>
