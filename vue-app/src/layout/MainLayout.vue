<script setup lang="ts">
import SubHeaderBar from '@/components/navbar/SubHeaderBar.vue'
import TopHeaderBar from '@/components/navbar/TopHeaderBar.vue'
</script>

<template>
  <div>
    <div class="top-bar">
      <TopHeaderBar />
    </div>
    <header>
      <SubHeaderBar />
    </header>
    <h1>Main Layout</h1>
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<style></style>
