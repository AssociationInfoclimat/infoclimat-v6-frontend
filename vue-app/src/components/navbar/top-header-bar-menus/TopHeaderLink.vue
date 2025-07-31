<script setup lang="ts">
import cx from 'classnames'
const props = defineProps<{
  href?: string
  size?: 'xxs' | 'xs'
  maxRows?: number
}>()
</script>

<template>
  <a
    :class="
      cx(
        'pl-2 text-xs hover:bg-white border-l-3 border-transparent hover:border-ic-blue-light leading-tight',
        size === 'xxs' && 'text-xxs',
        size === 'xs' && 'text-xs',
        maxRows === 2 && size === 'xxs' && 'max-h-[23px] overflow-hidden',
      )
    "
    :href="href"
    ><slot
  /></a>
</template>
