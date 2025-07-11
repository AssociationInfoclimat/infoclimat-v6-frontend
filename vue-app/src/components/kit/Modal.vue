<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const slots = useSlots()

const emit = defineEmits<{
  toggle: [show: boolean]
}>()

const isOpen = ref(props.isOpen)

watch(
  () => props.isOpen,
  (newVal: boolean) => {
    isOpen.value = newVal
  },
)

const isModalVisible = computed(() => isOpen.value)

const onToggle = () => {
  isOpen.value = !isOpen.value
  emit('toggle', isOpen.value)
}
</script>

<template>
  <transition name="fade">
    <div v-if="isModalVisible" class="fixed inset-0 z-50 h-full w-full flex items-center justify-center">
      <div @click="onToggle" class="absolute bg-black w-full h-full opacity-50 inset-0 z-0"></div>
      <div class="max-w-lg p-3 relative mx-auto my-auto rounded shadow-lg bg-white min-w-[300px]">
        <div>
          <div class="p-3 flex-auto leading-6">
            <slot />
          </div>
          <div class="p-3 mt-2 text-center space-x-4 md:block border-t border-ic-grey-light">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 500ms ease-out;
}
</style>
