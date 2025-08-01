<script setup lang="ts">
import { getLiveCounters } from '@/client/misc.api'
import { computed, onMounted, ref } from 'vue'
import type { GetLiveCountersResponse } from '@/client/misc.api.types'
import dayjs from '@/shared/dayjs'
import { useBrowserAgentStore } from '@/stores/browser-agent'

const browserAgentStore = useBrowserAgentStore()
const isMobile = computed(() => browserAgentStore.isMobile)

const counters = ref<GetLiveCountersResponse['responseData'] | null>(null)

onMounted(async () => {
  counters.value = await getLiveCounters()
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formattedToday = computed(() => {
  return dayjs().format('dddd D MMMM YYYY')
})
</script>

<template>
  <div class="" v-if="!isMobile">
    <div class="bg-gradient-to-t from-ic-blue-dark to-ic-blue text-white">
      <div class="lg:w-ic-fixed-custom mx-auto flex flex-row justify-center">
        <div class="w-5/12 flex-grow-0 flex flex-row items-center justify-between">
          <div>{{ formattedToday }}</div>
          <div>{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</div>
        </div>
        <div class="w-1/12 flex-shrink-0 flex items-center justify-center">
          <a @click="scrollToTop" href="#" :title="$t('footer.scrollToTop')">
            <img
              src="https://www.infoclimat.fr/images/footer_IClogo.png"
              alt="logo infoclimat"
              style="outline: none"
            />
          </a>
        </div>
        <div class="w-5/12 flex-grow-0 flex flex-row items-center justify-between">
          <div>{{ $t('footer.version') }}</div>
          <div>
            {{
              $t('footer.connectedUsers', {
                nbConnectedUsers: counters?.loggedin_users,
                time: new Date().toLocaleTimeString(),
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gradient-to-b from-ic-grey-light-2 to-white">
      <div class="lg:w-ic-fixed-custom mx-auto flex flex-row justify-center">
        <div class="w-5/12 text-right">
          <ul>
            <li>
              <a href="/contact"
                ><b>{{ $t('footer.contact') }}</b></a
              >
            </li>
            <li>
              <a href="/contribuer">{{ $t('footer.contribute') }}</a>
            </li>
            <li>
              <a href="https://asso.infoclimat.fr/infos">{{ $t('footer.about') }}</a>
            </li>
            <li>
              <a href="/about">{{ $t('footer.legal') }}</a>
            </li>
            <li>&nbsp;∞</li>

            <li>
              <a href="http://www.meteo-temps-reel.fr/"
                >meteo-temps-reel.fr - Weather in real-time</a
              >
            </li>
            <li>
              <a href="http://archives-meteo.fr/">{{ $t('footer.archivesMeteo') }}</a>
            </li>
            <li>
              <a href="http://www.meteo-ventoux.fr/">{{ $t('footer.meteoVentoux') }}</a>
            </li>
          </ul>
        </div>
        <div class="w-1/12">&nbsp;</div>
        <div class="w-5/12">
          <ul>
            <li>
              <a href="http://asso.infoclimat.fr">{{ $t('footer.association') }}</a>
            </li>
            <li>
              <a href="http://forums.infoclimat.fr">{{ $t('footer.forums') }}</a>
            </li>
            <li>
              <a href="https://play.google.com/store/apps/details?id=fr.infoclimat">Android</a>
            </li>
            <li>
              <a
                href="https://itunes.apple.com/fr/app/infoclimat-meteo-en-temps/id901314430?l=fr&amp;mt=8"
                >iOS</a
              >
            </li>
            <li>∞&nbsp;</li>
            <li>
              <a href="/about" class="text-xs">
                Infoclimat est une marque déposée sous le numéro 053372184
              </a>
            </li>
            <li>
              <a href="/about" class="text-xs">
                Site déclaré à la CNIL (875366) | SIRET : 45386074400037
              </a>
            </li>
            <li>
              <a href="/about" class="text-xs">
                Infoclimat est une association loi 1901 à but non lucratif
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
