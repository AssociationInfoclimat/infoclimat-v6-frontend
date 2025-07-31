<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adaptWeatherForecast, type AdaptedWeatherForecast } from '@/client/adapters'
import { getCommonRegionsDepts, getWeatherApiTicket, getWeatherForecast } from '@/client/previ.api'
import ForecastWidget from './ForecastWidget.vue'
import TopHeaderSubmenuTitle from '@/components/navbar/top-header-bar-menus/TopHeaderSectionTitle.vue'
import TopHeaderLink from '../TopHeaderLink.vue'
import type { GetPreviApiCommonRegionsDeptsResponse } from '@/client/previ.api.types'

const forecast = ref<AdaptedWeatherForecast | null>(null)
const commonRegionsDepts = ref<GetPreviApiCommonRegionsDeptsResponse['responseData']>([])

onMounted(async () => {
  // Widget bleu des prévisions
  const ticket = await getWeatherApiTicket({})
  forecast.value = adaptWeatherForecast(
    await getWeatherForecast({
      data: ticket['3'],
      entropy: ticket['4'],
    }),
  )
  // Liste "Prévisions" par département (Bretagne, Gironde, ...)
  commonRegionsDepts.value = await getCommonRegionsDepts()
})
</script>
<template>
  <div class="flex flex-row w-full gap-6">
    <div class="w-1/5 flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <div class="relative">
          <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.forecast.local.title')" />
          <div class="flex flex-col text-xs">
            <TopHeaderLink :href="forecast?.url">
              {{ forecast?.placeLabel }}
            </TopHeaderLink>
            <TopHeaderLink :href="`/previsions-meteo-par-ville.html`">
              {{ $t('header.topmenu.submenus.forecast.local.cta') }}
            </TopHeaderLink>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="relative">
          <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.forecast.interactiveMaps')" />
          <div class="flex flex-col text-xs">
            <TopHeaderLink href="/modeles/cartes_arome_arpege.php">
              AROME 1.3km
              <br />
              AROME 2.5km
              <br />
              ARPEGE 10km
            </TopHeaderLink>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="relative">
          <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.forecast.models')" />
          <div class="flex flex-col text-xs">
            <!-- They were set statically (just using a PHP constant) -->
            <TopHeaderLink href="/modeles-meteorologiques.html?model=arome/france">
              AROME 2.5km
            </TopHeaderLink>
            <TopHeaderLink href="/modeles-meteorologiques.html?model=gfs/france">
              GFS France 0.5 et 0.2°
            </TopHeaderLink>
            <TopHeaderLink href="/modeles-meteorologiques.html?model=gfs/europe">
              GFS Europe 1.0°
            </TopHeaderLink>
            <TopHeaderLink href="/modeles-meteorologiques.html?model=ecmwf/europe">
              ECMWF-CEP Europe
            </TopHeaderLink>
            <TopHeaderLink href="/modeles-meteorologiques.html?model=gefs/europe">
              Ensemble GEFS
            </TopHeaderLink>
            <TopHeaderLink href="/modeles-meteorologiques.html?model=ecmwf/europe&param=500_moy">
              Ensemble CEP
            </TopHeaderLink>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/5 px-2 bg-gradient-to-b from-ic-grey-light to-ic-grey">
      <div class="flex flex-col gap-2">
        <div class="relative">
          <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.forecast.forecast')" />
          <div class="flex flex-col text-xs">
            <TopHeaderLink v-for="dept in commonRegionsDepts" :key="dept.id" :href="dept.url">
              {{ dept.label }}
            </TopHeaderLink>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 flex-grow flex justify-end pb-6">
      <ForecastWidget v-if="forecast" :forecast="forecast" />
    </div>
  </div>
</template>

<style scoped></style>
