<script setup lang="ts">
import type { IconName, IconPrefix, IconProp } from '@fortawesome/fontawesome-svg-core'
import cx from 'classnames'
import Icon from '@/components/kit/Icon.vue'

const props = defineProps<{
  label?: string
  href?: string
  uppercase?: boolean
  rounded?: 'full'
  icon?: [IconPrefix, IconName] | IconProp
  tooltip?: string
  size?: 'default' | 'small'
  variant?:
    | 'primary'
    | 'transparent'
    | 'transparent-blue-dark'
    | 'yellow-purple-gradient'
    | 'purple-pink-gradient'
    | 'green-dark'
}>()

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <a
    :href="href"
    :title="tooltip"
    :class="
      cx(
        'block whitespace-nowrap cursor-pointer',
        variant === 'primary' && 'bg-ic-red text-white',
        variant === 'transparent' && 'bg-transparent',
        variant === 'transparent-blue-dark' && 'bg-transparent text-white hover:bg-ic-blue-dark',
        variant === 'yellow-purple-gradient' &&
          'bg-gradient-to-r from-ic-yellow-light to-ic-purple-light text-black',
        variant === 'purple-pink-gradient' &&
          'bg-gradient-to-r from-ic-purple-light to-ic-pink-light text-black',
        variant === 'green-dark' && 'bg-ic-green-dark text-white',
        icon && !label
          ? `${size === 'small' ? 'h-6 w-6' : 'h-8 w-8'} items-center justify-center flex`
          : size === 'small'
            ? 'px-3 py-1'
            : 'px-4 py-2',
        {
          uppercase: uppercase,
          'rounded-full': rounded === 'full',
          rounded: rounded !== 'full',
          'text-xs': size === 'small',
        },
      )
    "
    @click="
      ($event) => {
        if (!href) {
          $event.preventDefault()
          emit('click', $event)
        }
      }
    "
  >
    <slot v-if="$slots.default" />
    <template v-else>
      <Icon v-if="icon" :icon="icon" />
      {{ label }}
    </template>
  </a>
</template>

<style scoped></style>
