<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TextField from '@/components/kit/TextField.vue'
import TopHeaderBarMenuItem from './TopHeaderBarMenuItem.vue'
import AccountMenu from './AccountMenu.vue'
import { ref } from 'vue'
import RealTimeSubmenu from './top-header-bar-menus/realtime/RealTimeSubmenu.vue'
const { t } = useI18n()
import cx from 'classnames'
import ForecastSubmenu from './top-header-bar-menus/forecast/ForecastSubmenu.vue'
import ClimatologySubmenu from './top-header-bar-menus/climatology/ClimatologySubmenu.vue'
import PedagogySubmenu from './top-header-bar-menus/pedagogy/PedagogySubmenu.vue'
import CommunitySubmenu from './top-header-bar-menus/community/CommunitySubmenu.vue'

enum LEGACY_MENU {
  HOME = 'HOME',
  REAL_TIME = 'REAL_TIME',
  FORECAST = 'FORECAST',
  CLIMATOLOGY = 'CLIMATOLOGY',
  PEDAGOGY = 'PEDAGOGY',
  COMMUNITY = 'COMMUNITY',
  ASSOCIATION = 'ASSOCIATION',
  FORUMS = 'FORUMS',
}

const LEGACY_MENU_LINKS = {
  [LEGACY_MENU.ASSOCIATION]: 'https://asso.infoclimat.fr/',
  [LEGACY_MENU.FORUMS]: 'https://forums.infoclimat.fr/',
}

const isSubMenuOpen = ref(false)
const selectedMenu = ref<LEGACY_MENU | null>(null)
const openOrClose = (menu: LEGACY_MENU) => {
  // We hide if we click on the same menu:
  if (menu === selectedMenu.value) {
    // in that case we toggle:
    isSubMenuOpen.value = !isSubMenuOpen.value
  } else {
    isSubMenuOpen.value = true
  }
  selectedMenu.value = menu
}
</script>

<template>
  <div class="bg-linear-to-t from-ic-blue-dark to-ic-blue">
    <div class="lg:w-ic-fixed-custom mx-auto flex flex-row">
      <div class="py-1">
        <form id="formsrch" method="get" action="/recherche/sphinx.php" onsubmit="">
          <TextField :placeholder="t('header.topmenu.search')" />
        </form>
      </div>
      <div class="flex-1 flex flex-row">
        <TopHeaderBarMenuItem
          :selected="isSubMenuOpen && selectedMenu === LEGACY_MENU.REAL_TIME"
          @click="() => openOrClose(LEGACY_MENU.REAL_TIME)"
          :label="t('header.topmenu.buttons.realTime')"
        />
        <TopHeaderBarMenuItem
          :selected="isSubMenuOpen && selectedMenu === LEGACY_MENU.FORECAST"
          @click="() => openOrClose(LEGACY_MENU.FORECAST)"
          :label="t('header.topmenu.buttons.forecast')"
        />
        <TopHeaderBarMenuItem
          :selected="isSubMenuOpen && selectedMenu === LEGACY_MENU.CLIMATOLOGY"
          @click="() => openOrClose(LEGACY_MENU.CLIMATOLOGY)"
          :label="t('header.topmenu.buttons.climatology')"
        />
        <TopHeaderBarMenuItem
          :selected="isSubMenuOpen && selectedMenu === LEGACY_MENU.PEDAGOGY"
          @click="() => openOrClose(LEGACY_MENU.PEDAGOGY)"
          :label="t('header.topmenu.buttons.pedagogy')"
        />
        <TopHeaderBarMenuItem
          :selected="isSubMenuOpen && selectedMenu === LEGACY_MENU.COMMUNITY"
          @click="() => openOrClose(LEGACY_MENU.COMMUNITY)"
          :label="t('header.topmenu.buttons.community')"
        />
        <TopHeaderBarMenuItem
          :href="LEGACY_MENU_LINKS[LEGACY_MENU.ASSOCIATION]"
          :label="t('header.topmenu.buttons.association')"
        />
        <TopHeaderBarMenuItem
          :href="LEGACY_MENU_LINKS[LEGACY_MENU.FORUMS]"
          :label="t('header.topmenu.buttons.forums')"
        />
      </div>
      <div class="">
        <AccountMenu />
      </div>
    </div>
  </div>
  <div
    :class="
      cx(
        'bg-ic-grey-light transition-all duration-400 overflow-hidden',
        selectedMenu && isSubMenuOpen ? 'max-h-[400px]' : 'max-h-0',
      )
    "
  >
    <div class="lg:w-ic-fixed-custom mx-auto flex flex-row pt-2">
      <RealTimeSubmenu v-if="selectedMenu === LEGACY_MENU.REAL_TIME" />
      <ForecastSubmenu v-if="selectedMenu === LEGACY_MENU.FORECAST" />
      <ClimatologySubmenu v-if="selectedMenu === LEGACY_MENU.CLIMATOLOGY" />
      <PedagogySubmenu v-if="selectedMenu === LEGACY_MENU.PEDAGOGY" />
      <CommunitySubmenu v-if="selectedMenu === LEGACY_MENU.COMMUNITY" />
    </div>
  </div>
</template>

<style></style>
