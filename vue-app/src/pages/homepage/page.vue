<script setup lang="ts">
import { useHead } from '@unhead/vue'
import MainLayout from '@/layout/MainLayout.vue'
import HomepageView from '@/views/Homepage.view.vue'

useHead({
  title: 'Infoclimat - Météo en temps réel',
  meta: [
    {
      name: 'description',
      content:
        "Infoclimat, la météo en France en temps réel - weatherass in realtime - Veritable encyclopédie de la météo et du climat, observations, relevés, prévisions, climatologie et forums de discussion.",
    },
  ],
})
</script>

<template>
  <MainLayout>
    <HomepageView />
  </MainLayout>
</template>

<style></style>
