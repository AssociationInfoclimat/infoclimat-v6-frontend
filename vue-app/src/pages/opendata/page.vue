<script setup lang="ts">
import { useHead } from '@unhead/vue'
import MainLayout from '@/layout/MainLayout.vue'
import OpenDataView from '@/views/OpenData.view.vue'

useHead({
  title: 'Open Data - Infoclimat',
  meta: [
    {
      name: 'description',
      content: "Accédez aux données météorologiques ouvertes d'Infoclimat : observations, relevés et archives climatologiques en libre accès.",
    },
  ],
})
</script>

<template>
  <MainLayout>
    <OpenDataView />
  </MainLayout>
</template>

<style></style>
