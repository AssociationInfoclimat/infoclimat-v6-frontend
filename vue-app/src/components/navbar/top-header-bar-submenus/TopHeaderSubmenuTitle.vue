<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="font-exo uppercase text-sm text-ic-blue border-b border-ic-blue p-[2px] mb-[2px]">
    {{ title }}
  </div>
</template>
