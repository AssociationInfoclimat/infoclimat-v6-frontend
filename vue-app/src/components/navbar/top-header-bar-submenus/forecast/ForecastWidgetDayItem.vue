<script setup lang="ts">
import { type AdaptedWeatherForecast } from '@/client/adapters'

const props = defineProps<{
  day: AdaptedWeatherForecast['days'][0]
  isToday: boolean
}>()

const rainIcon = '//static.infoclimat.net/images/v5.2/Umbrella.png'
</script>

<template>
  <!-- Today -->
  <div class="flex flex-row" v-if="isToday">
    <div class="w-1/4">
      <img :src="`${day.icon}`" />
    </div>
    <div class="w-3/4 text-white">
      <div class="text-xl">
        <span class="text-ic-blue-light-2 font-bold text-shadow">{{
          Math.round(day.temperature.min)
        }}</span
        >/<span class="text-ic-red-2 font-bold text-shadow">{{
          Math.round(day.temperature.max)
        }}</span
        >°C
      </div>
      <div class="text-xxs leading-none">
        <div class="flex flex-row items-center gap-1">
          <img style="width: 10px; height: 10px" :src="rainIcon" />
          <span class="">{{ Math.round(day.rain) }}mm</span>
          <span class="">{{ day.pressure }}hPa</span>
        </div>
        <div class="flex flex-row items-center">
          <img style="width: 12px; height: 12px" :src="day.wind.directionIcon" />
          <span class="">{{ day.wind.directionLetter }} – {{ day.wind.speed }} km/h</span>
        </div>
        <div class="flex flex-row">
          {{ day.description }}
        </div>
      </div>
    </div>
  </div>
  <!-- Other days -->
  <div class="flex flex-row border-t border-white mt-1 pt-1" v-else>
    <div class="w-1/4">
      <div class="flex flex-row items-center text-xxs text-white">
        <img style="width: 12px; height: 12px" :src="day.wind.directionIcon" />
        <span class="">{{ day.wind.speed }}</span>
      </div>
      <div class="">
        <img :src="`${day.icon}`" />
      </div>
    </div>
    <div class="w-3/4">
      <div class="text-white text-xs">
        <strong>{{ day.day }}</strong> –
        <span class="text-ic-blue-light-2 font-bold text-shadow">{{
          Math.round(day.temperature.min)
        }}</span
        >/
        <span class="text-ic-red-2 font-bold text-shadow">{{
          Math.round(day.temperature.max)
        }}</span
        >°C
      </div>
      <div class="text-white text-xs flex flex-row gap-1 items-center text-xxs leading-none">
        <div class="flex flex-row items-center">
          <span class="">{{ day.pressure }} hPa</span>
        </div>
        –
        <div class="flex flex-row items-center gap-1">
          <img style="width: 10px; height: 10px" :src="rainIcon" />
          <span class="">{{ Math.round(day.rain) }}mm</span>
        </div>
      </div>
      <div class="text-xxs text-white">
        {{ day.description }}
      </div>
    </div>
  </div>
</template>
