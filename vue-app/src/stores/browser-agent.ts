import { onMounted, onUnmounted, ref } from 'vue'
import { defineStore } from 'pinia'

export const useBrowserAgentStore = defineStore('browser-agent', () => {
  const isMobile = ref(false)

  const handleResize = () => {
    isMobile.value = window.innerWidth < 1024
  }

  onMounted(() => {
    isMobile.value = window.innerWidth < 1024

    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return { isMobile }
})
