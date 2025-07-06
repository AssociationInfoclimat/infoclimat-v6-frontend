<script setup lang="ts">
import cx from 'classnames'

const props = defineProps<{
  label: string
  selected?: boolean
  href?: string
}>()

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <a
    :class="cx('text-white cursor-pointer font-exo', selected ? 'selected' : '')"
    :href="href"
    @click="
      ($event) => {
        if (!href) {
          $event.preventDefault()
          emit('click', $event)
        }
      }
    "
  >
    {{ label }}
  </a>
</template>

<style scoped>
/*  
 Since latest tailwind, when @apply, 
 we need to use `@reference "tailwindcss";` (https://tailwindcss.com/docs/functions-and-directives#apply-directive) 
*/
@reference "@/assets/base.css";

a {
  @apply px-6 whitespace-nowrap py-[6px] border-r border-ic-blue;
  font-size: var(--font-size-menu-xl);
  text-shadow: 1px 1px 2px var(--color-black);

  &.selected,
  &:hover {
    @apply text-shadow-none text-ic-blue-dark;
    background: linear-gradient(
      to right,
      rgba(34, 34, 34, 1) 0%,
      rgba(238, 238, 238, 1) 5%,
      rgba(238, 238, 238, 1) 95%,
      rgba(34, 34, 34, 1) 100%
    );
  }
}
</style>
