<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="max-w-full overflow-x-hidden">
    <Header />
    <div class="main-content min-h-80">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>
