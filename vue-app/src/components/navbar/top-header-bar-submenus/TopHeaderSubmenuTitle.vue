<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="font-exo uppercase text-sm text-ic-blue-dark border-b border-ic-blue-dark p-[0] mb-[5px]">
    {{ title }}
  </div>
</template>
