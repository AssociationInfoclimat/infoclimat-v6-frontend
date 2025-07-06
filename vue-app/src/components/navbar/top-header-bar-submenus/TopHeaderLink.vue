<script setup lang="ts">
const props = defineProps<{
  href?: string
}>()
</script>

<template>
  <a
    class="pl-2 text-xs hover:bg-white border-l-2 border-transparent hover:border-ic-blue"
    :href="href"
    ><slot
  /></a>
</template>
