<script setup lang="ts">
import { type AdaptedWeatherForecast } from '@/client/adapters'
import ForecastWidgetDayItem from './ForecastWidgetDayItem.vue'

const props = defineProps<{
  forecast: AdaptedWeatherForecast
}>()

const strpadLeft = (str: string, length: number, pad: string) => {
  return str.padStart(length, pad)
}
</script>
<template>
  <div class="w-[305px] flex flex-row rounded bg-ic-blue-2 p-1">
    <div class="flex-1">
      <div class="text-white text-xs font-bold text-center">
        {{ $t('header.topmenu.submenus.forecast.forecastWeatherWidget.title') }}
        {{ forecast.name }} :
      </div>
      <div class="days">
        <ForecastWidgetDayItem
          v-for="(day, index) in forecast.days"
          :key="day.day"
          :day="day"
          :isToday="index === 0"
        />
      </div>
      <div class="text-white text-xxs text-right italic mt-1">
        {{ $t('header.topmenu.submenus.forecast.forecastWeatherWidget.updatedAt') }}
        {{ strpadLeft(forecast.updatedTodayAt, 2, '0') }}h
      </div>
    </div>
    <div class="flex-shrink-0">
      <img :src="forecast.graph" alt="Graph" />
    </div>
  </div>
</template>
