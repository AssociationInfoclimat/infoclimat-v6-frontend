<script setup lang="ts">
import HeaderVignettes from '@/components/navbar/SubHeaderVignettes.vue'
import AskForDonationDesktopBanner from '../AskForDonationDesktopBanner.vue'
</script>

<template>
  <div class="bg-linear-to-t from-ic-blue-light to-ic-blue">
    <div class="lg:w-ic-fixed-custom mx-auto flex flex-row gap-2">
      <div class="header-logo py-2">
        <img src="@/assets/logo_IC_5.1.png" alt="Infoclimat" />
      </div>
      <div class="header-menu flex-1">
        <HeaderVignettes />
      </div>
      <div class="w-96 py-2">
        <AskForDonationDesktopBanner />
      </div>
    </div>
  </div>
</template>
