<script setup lang="ts">
import TopHeaderBar from '@/components/navbar/TopHeaderBar.vue'
import SubHeaderBar from '@/components/navbar/SubHeaderBar.vue'
import { useBrowserAgentStore } from '@/stores/browser-agent'
import { computed } from 'vue'

const browserAgentStore = useBrowserAgentStore()
const isMobile = computed(() => browserAgentStore.isMobile)
</script>

<template>
  <div v-if="!isMobile" class="top-bar">
    <TopHeaderBar />
  </div>
  <header>
    <SubHeaderBar />
  </header>
</template>
