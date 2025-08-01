<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="max-w-full overflow-x-hidden">
    <Header />
    <h1>Main Layout</h1>
    <div class="main-content">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<style></style>
