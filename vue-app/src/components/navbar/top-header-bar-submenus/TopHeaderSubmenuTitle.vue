<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div
    class="font-exo uppercase text-sm leading-tight text-ic-blue-dark border-b border-ic-blue-dark p-[0] mb-[5px]"
  >
    <span style="font-size: 112%">{{ title[0] }}</span
    ><span>{{ title.slice(1) }}</span>
  </div>
</template>
