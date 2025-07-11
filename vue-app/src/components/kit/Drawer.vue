<script setup lang="ts">
import cx from 'classnames'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: [show: boolean]
}>()
</script>

<template>
  <div :class="cx('drawer-overlay', { 'is-open': isOpen })" @click="emit('toggle', !isOpen)"></div>
  <div :class="cx('drawer', { 'is-open': isOpen })">
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
  z-index: 1000;
  display: none;
  &.is-open {
    display: block;
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
}
</style>
