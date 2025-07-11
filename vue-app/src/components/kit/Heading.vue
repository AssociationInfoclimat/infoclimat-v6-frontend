<script setup lang="ts">
const props = defineProps<{
  hx: '1' | '2' | '3' | '4' | '5' | '6'
}>()
</script>

<template>
  <h1 v-if="hx === '1'" :class="`text-xl font-bold`"><slot /></h1>
  <h2 v-else-if="hx === '2'" :class="`text-lg font-bold`"><slot /></h2>
  <h3 v-else-if="hx === '3'" :class="`text-base font-bold`"><slot /></h3>
  <h4 v-else-if="hx === '4'" :class="`text-sm font-bold`"><slot /></h4>
  <h5 v-else-if="hx === '5'" :class="`text-xs font-bold`"><slot /></h5>
  <h6 v-else-if="hx === '6'" :class="`text-xs font-bold`"><slot /></h6>
</template>

<style scoped></style>
