<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from '@/components/kit/Select.vue'
import Button from '@/components/kit/Button.vue'
import TopHeaderSubmenuTitle from '@/components/navbar/top-header-bar-submenus/TopHeaderSubmenuTitle.vue'
import MapCard from './MapCard.vue'
import { Zone } from '@/shared/types'
import TopHeaderLink from '../TopHeaderLink.vue'

const URLs = {
  participative: {
    cta: {
      archives: 'https://www.infoclimat.fr/meteoalerte/',
      participate: 'https://www.infoclimat.fr/meteoalerte/common.php',
    },
  },
}

const selectedZone = ref<Zone>(Zone.FRANCE_LG)

const { t } = useI18n()

const hour = ref(21)
const minute = ref<string>('00')
const nowTimeLabel = computed(() => {
  return `${hour.value}:${minute.value}`
})
</script>

<template>
  <div class="flex flex-row w-full gap-6">
    <div class="flex-1/4">
      <div class="flex flex-col gap-2">
        <div class="relative">
          <TopHeaderSubmenuTitle
            :title="t('header.topmenu.submenus.realTime.participative.title')"
          />
          <MapCard type="meteoalerte">
            <div class="absolute z-2 bottom-[-10px] right-2 flex flex-row gap-2">
              <Button
                :href="URLs.participative.cta.archives"
                :tooltip="t('header.topmenu.submenus.realTime.participative.tooltips.archives')"
                rounded="full"
                :icon="['fas', 'calendar-alt']"
              />
              <Button
                :href="URLs.participative.cta.participate"
                :tooltip="t('header.topmenu.submenus.realTime.participative.tooltips.participate')"
                rounded="full"
                :icon="['fas', 'user-plus']"
              />
            </div>
          </MapCard>
        </div>
        <div>
          <TopHeaderSubmenuTitle :title="t('header.topmenu.submenus.realTime.webcams.title')" />
          <MapCard type="webcam" />
          <Button :label="t('header.topmenu.submenus.realTime.webcams.cta')" uppercase />
        </div>
      </div>
    </div>
    <div class="flex-1/4">
      <TopHeaderSubmenuTitle :title="t('header.topmenu.submenus.realTime.live.title')" />
      <div class="flex flex-col gap-2">
        <div class="relative">
          <MapCard
            :hoverCategoryLabel="{
              left: t('header.topmenu.submenus.realTime.live.categories.rain'),
              right: nowTimeLabel,
            }"
            type="liveRain"
            :hour="hour"
            :minute="minute"
            :zone="selectedZone"
          />
        </div>
        <div class="relative">
          <MapCard
            :hoverCategoryLabel="{
              left: t('header.topmenu.submenus.realTime.live.categories.satellite'),
              right: nowTimeLabel,
            }"
            type="liveSatellite"
            :hour="hour"
            :minute="minute"
            :zone="selectedZone"
          />
        </div>
        <div class="relative">
          <MapCard
            :hoverCategoryLabel="{
              left: t('header.topmenu.submenus.realTime.live.categories.storm'),
              right: nowTimeLabel,
            }"
            type="liveStorm"
            :hour="hour"
            :minute="minute"
            :zone="selectedZone"
          />
        </div>
      </div>
    </div>
    <div class="flex-2/5">
      <TopHeaderSubmenuTitle :title="t('header.topmenu.submenus.realTime.observations.title')" />
      <div class="flex flex-row gap-2">
        <div class="flex flex-col gap-2 flex-1/2">
          <div class="relative">
            <MapCard
              :hoverCategoryLabel="{
                left: t('header.topmenu.submenus.realTime.observations.categories.temperature'),
              }"
              type="stationsTemperature"
              :hour="hour"
              :minute="minute"
              :zone="selectedZone"
            />
          </div>
          <div class="relative">
            <MapCard
              :hoverCategoryLabel="{
                left: t('header.topmenu.submenus.realTime.observations.categories.wind'),
              }"
              type="stationsWind"
              :hour="hour"
              :minute="minute"
              :zone="selectedZone"
            />
          </div>
          <div class="relative">
            <MapCard
              :hoverCategoryLabel="{
                left: t('header.topmenu.submenus.realTime.observations.categories.waterTemp'),
              }"
              type="stationsWaterTemp"
              :hour="hour"
              :minute="minute"
              :zone="selectedZone"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2 flex-1/2">
          <div class="relative">
            <MapCard
              :hoverCategoryLabel="{
                left: t('header.topmenu.submenus.realTime.observations.categories.sunshine'),
              }"
              type="stationsSunshine"
              :hour="hour"
              :minute="minute"
              :zone="selectedZone"
            />
          </div>
          <div class="relative">
            <MapCard
              :hoverCategoryLabel="{
                left: t('header.topmenu.submenus.realTime.observations.categories.rain'),
              }"
              type="stationsRain"
              :hour="hour"
              :minute="minute"
              :zone="selectedZone"
            />
          </div>
          <div class="relative">
            <MapCard
              :hoverCategoryLabel="{
                left: t('header.topmenu.submenus.realTime.observations.categories.snow'),
              }"
              type="stationsSnow"
              :hour="hour"
              :minute="minute"
              :zone="selectedZone"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1/5">
      <TopHeaderSubmenuTitle :title="t('header.topmenu.submenus.realTime.liveGallery.title')" />
    </div>
    <div class="flex-1/5 h-full flex flex-col">
      <TopHeaderSubmenuTitle :title="t('header.topmenu.submenus.realTime.more.title')" />
      <div class="flex flex-col">
        <TopHeaderLink href="">{{
          t('header.topmenu.submenus.realTime.more.polls')
        }}</TopHeaderLink>
        <TopHeaderLink href="">{{
          t('header.topmenu.submenus.realTime.more.altitudeData')
        }}</TopHeaderLink>
        <TopHeaderLink href="">{{
          t('header.topmenu.submenus.realTime.more.naoAo')
        }}</TopHeaderLink>
        <TopHeaderLink href="">{{
          t('header.topmenu.submenus.realTime.more.addMeteoStation')
        }}</TopHeaderLink>
        <TopHeaderLink href="">{{
          t('header.topmenu.submenus.realTime.more.openDataMeteo')
        }}</TopHeaderLink>
      </div>
      <div class="mt-auto">
        <label class="text-xs">
          <div class="leading-none">{{ t('header.topmenu.submenus.realTime.settings.label') }}</div>
          <Select
            :value="selectedZone"
            :options="
              Object.values(Zone).map((zone) => ({
                label: t(`header.topmenu.submenus.realTime.settings.zones.${zone}`),
                value: zone,
              }))
            "
            @change="
              (value: unknown) => {
                selectedZone = value as Zone
              }
            "
        /></label>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
