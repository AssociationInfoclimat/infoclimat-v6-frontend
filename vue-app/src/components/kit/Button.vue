<script setup lang="ts">
import type { IconName, IconPrefix, IconProp } from '@fortawesome/fontawesome-svg-core'
import cx from 'classnames'
import Icon from '@/components/kit/Icon.vue'

const props = defineProps<{
  label?: string
  href?: string
  type?: 'a' | 'button' | 'submit-button'
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
  loading?: boolean
}>()

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <component
    :is="type === 'a' ? 'a' : type === 'submit-button' ? 'button' : 'button'"
    :type="type === 'submit-button' ? 'submit' : undefined"
    :href="type === 'a' ? href : undefined"
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
      ($event: MouseEvent) => {
        if (loading) {
          $event.preventDefault()
          $event.stopPropagation()
          return
        }
        if (!href && type !== 'submit-button') {
          $event.preventDefault()
          emit('click', $event)
        }
        // Note: 'submit-button' triggers parent form submit event, so we don't need to prevent default
      }
    "
  >
    <Icon
      v-if="loading"
      :icon="['fas', 'spinner']"
      :class="cx('animate-spin', $slots.default && 'mr-1')"
    />
    <slot v-if="$slots.default" />
    <template v-else>
      <Icon v-if="icon && !loading" :icon="icon" />
      {{ label }}
    </template>
  </component>
</template>

<style scoped></style>
