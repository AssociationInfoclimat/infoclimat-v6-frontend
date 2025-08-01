<script setup lang="ts">
import cx from 'classnames'
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    side?: 'left' | 'right'
  }>(),
  {
    side: 'right',
  },
)

const emit = defineEmits<{
  toggle: [show: boolean]
}>()

const isReady = ref(false)

onMounted(() => {
  if (props.isOpen) {
    isReady.value = true
  }
})

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      isReady.value = true
    } else {
      setTimeout(() => {
        isReady.value = false
      }, 300)
    }
  },
)
</script>

<template>
  <div
    :class="cx('drawer-overlay', { 'is-open': isOpen, 'is-ready': isReady })"
    @click="() => emit('toggle', !isOpen)"
  ></div>
  <div :class="cx('drawer', { 'is-open': isOpen }, `drawer--${side}`)">
    <slot />
  </div>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 1000;
  left: -100%;
  transition: opacity 0.3s ease-in-out;
  &.is-ready {
    left: 0;
  }
  &.is-open {
    opacity: 1;
    left: 0;
  }
}
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: white;
  z-index: 1001;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  &.is-open {
    transform: translateX(0);
  }

  &.drawer--left {
    left: 0;
    right: auto;
    transform: translateX(-100%);

    &.is-open {
      transform: translateX(0);
    }
  }
}
</style>
