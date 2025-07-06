<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adaptWeatherForecast, type AdaptedWeatherForecast } from '@/client/adapters'
import { getWeatherApiTicket, getWeatherForecast } from '@/client/previ.api'
import ForecastWidget from './ForecastWidget.vue'
import TopHeaderSubmenuTitle from '@/components/navbar/top-header-bar-submenus/TopHeaderSubmenuTitle.vue'

const forecast = ref<AdaptedWeatherForecast | null>(null)
onMounted(async () => {
  const ticket = await getWeatherApiTicket({})
  forecast.value = adaptWeatherForecast(
    await getWeatherForecast({
      data: ticket['3'],
      entropy: ticket['4'],
    }),
  )
})
</script>
<template>
  <div class="flex flex-row w-full gap-6">
    <div class="w-1/5 flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <div class="relative">
          <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.forecast.local.title')" />
          <div class="flex flex-col pl-2 text-xs">LISTE</div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="relative">
          <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.forecast.interactiveMaps')" />
          <div class="flex flex-col pl-2 text-xs">LISTE</div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="relative">
          <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.forecast.models')" />
          <div class="flex flex-col pl-2 text-xs">LISTE</div>
        </div>
      </div>
    </div>
    <div class="w-1/5 px-2 bg-gradient-to-b from-ic-grey-light to-ic-grey">
      <div class="flex flex-col gap-2">
        <div class="relative">
          <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.forecast.forecast')" />
          <div class="flex flex-col pl-2 text-xs">LISTE</div>
        </div>
      </div>
    </div>
    <div class="flex-1 flex-grow flex justify-end pb-6">
      <ForecastWidget v-if="forecast" :forecast="forecast" />
    </div>
  </div>
</template>

<style scoped></style>
