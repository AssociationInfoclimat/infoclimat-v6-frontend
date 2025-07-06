<script setup lang="ts">
import TopHeaderSubmenuTitle from '@/components/navbar/top-header-bar-submenus/TopHeaderSubmenuTitle.vue'
import TopHeaderLink from '../TopHeaderLink.vue'
</script>
<template>
  <div class="flex flex-row w-full gap-6">
    <div class="w-1/5 flex flex-col gap-3">
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.climate.reports')" />
        <div class="flex flex-col">LISTE</div>
      </div>
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.climate.events.title')" />
        <div class="flex flex-col">LISTE</div>
        <div class="flex flex-col">
          <TopHeaderLink href="">&rsaquo; {{ $t('header.topmenu.submenus.climate.events.specialReports') }}</TopHeaderLink>
        </div>
      </div>
    </div>
    <div class="w-1/5 px-2 bg-gradient-to-b from-ic-grey-light to-ic-grey">
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.climate.synopticAnalysis')" />
        <div class="flex flex-col">LISTE</div>
      </div>
    </div>
    <div class="w-1/5 flex flex-col gap-3">
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.climate.climatology.title')" />
        <div class="flex flex-col">
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.climatology.links.normalesAndRecords')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.climatology.links.nationalThermicIndicator')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.climatology.links.nationalPrecipitationIndicator')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.climatology.links.globalClimatologyMaps')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.climatology.links.lightningBilans')
          }}</TopHeaderLink>
        </div>
      </div>
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.climate.historical.title')" />
        <div class="flex flex-col">
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.historical.links.thunderstorms')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.historical.links.heavyRain')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.historical.links.cold')
          }}</TopHeaderLink>
        </div>
      </div>
    </div>
    <div class="w-1/5 flex flex-col gap-3">
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.climate.climateData.title')" />
        <div class="flex flex-col">
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.climateData.links.baseClimatology')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.climateData.links.dailyObservations')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.climateData.links.monthlyAnalyses')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.climateData.links.climaticQueries')
          }}</TopHeaderLink>
        </div>
      </div>
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.climate.archiveMaps.title')" />
        <div class="flex flex-col">
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.archiveMaps.links.observations')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.archiveMaps.links.observationsSince')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climate.archiveMaps.links.reanalyses')
          }}</TopHeaderLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
