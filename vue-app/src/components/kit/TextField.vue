<script setup lang="ts">
const props = defineProps<{
  placeholder: string
}>()
</script>

<template>
  <div class="text-field">
    <input
      type="text"
      class="p-1 rounded bg-white"
      :placeholder="placeholder"
    />
  </div>
</template>

<style></style>
