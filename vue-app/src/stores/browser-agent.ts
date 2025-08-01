import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'

export const useBrowserAgentStore = defineStore('browser-agent', () => {
  const isMobile = ref(false)

  onMounted(() => {
    isMobile.value = window.innerWidth < 1024
  })

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 1024
  })

  return { isMobile }
})
