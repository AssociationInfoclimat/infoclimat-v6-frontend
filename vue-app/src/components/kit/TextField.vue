<script setup lang="ts">
import cx from 'classnames'

const props = defineProps<{
  placeholder: string
  label?: string
  inputClass?: string
}>()
</script>

<template>
  <div :class="cx('flex flex-col gap-0', label ? 'mt-2' : '')">
    <label v-if="label" class="text-sm font-bold">{{ label }}</label>
    <input
      type="text"
      :class="
        cx(
          'p-1 bg-transparent border border-transparent border-b-gray-400 outline-none focus:border-b-gray-900',
          inputClass,
        )
      "
      :placeholder="placeholder"
    />
  </div>
</template>

<style></style>
