<script setup lang="ts">
import { getBs2sNews, getBqsNews, getBimNews } from '@/client/chroniques.api'
import type {
  GetBimResponse,
  GetBs2sResponse,
  GetChroniquesBqsResponse,
} from '@/client/chroniques.api.types'
import TopHeaderSubmenuTitle from '@/components/navbar/top-header-bar-menus/TopHeaderSectionTitle.vue'
import TopHeaderLink from '../TopHeaderLink.vue'
import { onMounted, ref } from 'vue'

const bqsNews = ref<GetChroniquesBqsResponse['responseData']>([])
const bs2sNews = ref<GetBs2sResponse['responseData']>([])
const bimNews = ref<GetBimResponse['responseData']>([])

onMounted(async () => {
  bqsNews.value = await getBqsNews()
  bs2sNews.value = await getBs2sNews()
  bimNews.value = await getBimNews()
})
</script>
<template>
  <div class="flex flex-row w-full gap-6">
    <div class="w-1/5 flex flex-col gap-3">
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.climatology.reportsBqs')" />
        <div class="flex flex-col gap-1">
          <TopHeaderLink
            v-for="chronique in bqsNews"
            :key="chronique.id"
            :href="chronique.url"
            size="xxs"
            :max-rows="2"
          >
            <strong>{{ chronique.published_at }} :</strong>
            {{ chronique.summary }}
          </TopHeaderLink>
        </div>
      </div>
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.climatology.eventsBs2s.title')"
        />
        <div class="flex flex-col gap-1">
          <TopHeaderLink
            v-for="bs2sItem in bs2sNews"
            :key="bs2sItem.id"
            :href="bs2sItem.link"
            size="xxs"
          >
            {{ bs2sItem.date_range }} : {{ bs2sItem.types.join(', ') }}
          </TopHeaderLink>
        </div>
        <div class="flex flex-col mt-1">
          <TopHeaderLink href=""
            >&rsaquo;
            {{ $t('header.topmenu.submenus.climatology.eventsBs2s.specialReports') }}</TopHeaderLink
          >
        </div>
      </div>
    </div>
    <div class="w-1/5 px-2 bg-gradient-to-b from-ic-grey-light to-ic-grey">
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.climatology.synopticAnalysisBim')"
        />
        <div class="flex flex-col gap-1">
          <TopHeaderLink
            v-for="bimItem in bimNews"
            :key="bimItem.id"
            :href="bimItem.url"
            size="xxs"
          >
            <strong>{{ bimItem.published_at }} :</strong>
            {{ bimItem.summary }}
          </TopHeaderLink>
        </div>
      </div>
    </div>
    <div class="w-1/5 flex flex-col gap-3">
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.climatology.climatology.title')"
        />
        <div class="flex flex-col">
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.climatology.links.normalesAndRecords')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.climatology.links.nationalThermicIndicator')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t(
              'header.topmenu.submenus.climatology.climatology.links.nationalPrecipitationIndicator',
            )
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.climatology.links.globalClimatologyMaps')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.climatology.links.lightningBilans')
          }}</TopHeaderLink>
        </div>
      </div>
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.climatology.historical.title')"
        />
        <div class="flex flex-col">
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.historical.links.thunderstorms')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.historical.links.heavyRain')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.historical.links.cold')
          }}</TopHeaderLink>
        </div>
      </div>
    </div>
    <div class="w-1/5 flex flex-col gap-3">
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.climatology.climateData.title')"
        />
        <div class="flex flex-col">
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.climateData.links.baseClimatology')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.climateData.links.dailyObservations')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.climateData.links.monthlyAnalyses')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.climateData.links.climaticQueries')
          }}</TopHeaderLink>
        </div>
      </div>
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.climatology.archiveMaps.title')"
        />
        <div class="flex flex-col">
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.archiveMaps.links.observations')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.archiveMaps.links.observationsSince')
          }}</TopHeaderLink>
          <TopHeaderLink href="">{{
            $t('header.topmenu.submenus.climatology.archiveMaps.links.reanalyses')
          }}</TopHeaderLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
