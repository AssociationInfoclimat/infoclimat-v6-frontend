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
        'block whitespace-nowrap cursor-pointer bg-ic-red text-white',
        icon && !label ? 'h-8 w-8 items-center justify-center flex' : 'px-4 py-2',
        {
          uppercase: uppercase,
          'rounded-full': rounded === 'full',
          rounded: rounded !== 'full',
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
    <Icon v-if="icon" :icon="icon" />
    {{ label }}
  </a>
</template>

<style scoped></style>
