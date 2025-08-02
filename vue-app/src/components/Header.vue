<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBrowserAgentStore } from '@/stores/browser-agent'
import TopHeaderBar from '@/components/navbar/TopHeaderBar.vue'
import SubHeaderBar from '@/components/navbar/SubHeaderBar.vue'
import Icon from './kit/Icon.vue'
import Drawer from './kit/Drawer.vue'
import ResponsiveMobileDrawerContent from './navbar/ResponsiveMobileDrawerContent.vue'

const browserAgentStore = useBrowserAgentStore()
const isMobile = computed(() => browserAgentStore.isMobile)
const isReponsiveMobileMenuOpen = ref(false)

const toggleReponsiveMobileMenu = () => {
  isReponsiveMobileMenuOpen.value = !isReponsiveMobileMenuOpen.value
}
</script>

<template>
  <template v-if="!isMobile">
    <div class="top-bar">
      <TopHeaderBar />
    </div>
    <header>
      <SubHeaderBar />
    </header>
  </template>
  <template v-else>
    <div class="header-placeholder h-12"></div>
    <div
      class="flex flex-row items-center justify-between fixed top-0 left-0 right-0 z-50 w-full bg-ic-blue-2 h-12"
    >
      <div class="p-2 w-full flex flex-row items-center justify-between">
        <Icon
          :icon="['fas', 'bars']"
          @click="toggleReponsiveMobileMenu"
          class="text-xl text-white cursor-pointer"
        />
        <img src="@/assets/logo_IC_5.1.png" alt="Infoclimat" class="h-8" />
        <div class="mobile-right-menu">
          <Icon :icon="['fas', 'user']" class="text-xl text-white cursor-pointer" />
        </div>
      </div>
    </div>
    <Drawer
      :is-open="isReponsiveMobileMenuOpen"
      @toggle="isReponsiveMobileMenuOpen = !isReponsiveMobileMenuOpen"
      side="left"
    >
      <ResponsiveMobileDrawerContent />
    </Drawer>
  </template>
</template>
