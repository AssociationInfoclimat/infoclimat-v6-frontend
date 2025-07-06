<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps<{
  value: unknown
  options: {
    label: string
    value: string | number
  }[]
}>()

const emit = defineEmits<{
  change: [value: unknown]
}>()
</script>

<template>
  <select
    :value="value"
    @change="($event) => $event && emit('change', ($event.target as any).value)"
  >
    <option v-for="option in options" :value="option.value" :key="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
