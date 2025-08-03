<script setup lang="ts">
import cx from 'classnames'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    label?: string
    type?: 'email' | 'password' | 'text'
    inputClass?: string
    required?: boolean

    modelValue?: string
    'onUpdate:modelValue'?: (value: string) => void
  }>(),
  {
    type: 'text',
    placeholder: '',
  },
)
</script>

<template>
  <div :class="cx('flex flex-col gap-0', label ? 'mt-2' : '')">
    <label v-if="label" class="text-sm font-bold">{{ label }}</label>
    <input
      :type="type"
      :class="
        cx(
          'p-1 bg-transparent border border-transparent border-b-gray-400 outline-none focus:border-b-gray-900',
          inputClass,
        )
      "
      :placeholder="placeholder"
      :required="required"
      :value="modelValue"
      @input="($event) => $emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style></style>
