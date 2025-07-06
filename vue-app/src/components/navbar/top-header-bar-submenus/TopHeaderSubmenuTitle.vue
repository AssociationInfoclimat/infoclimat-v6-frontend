<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="font-exo uppercase text-sm text-ic-blue-dark border-b border-ic-blue-dark p-[2px] mb-[2px]">
    {{ title }}
  </div>
</template>
