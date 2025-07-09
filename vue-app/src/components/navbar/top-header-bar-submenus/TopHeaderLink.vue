<script setup lang="ts">
const props = defineProps<{
  href?: string
}>()
</script>

<template>
  <a
    class="pl-2 text-xs hover:bg-white border-l-3 border-transparent hover:border-ic-blue-light leading-tight"
    :href="href"
    ><slot
  /></a>
</template>
