<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import CentralBarMenuItem from './CentralBarMenuItem.vue'
import { useHomepageDataMapStore } from '@/stores/homepage-data-map'
import { storeToRefs } from 'pinia'

const { setMapDataMenuSelected, setBaseLayer } = useHomepageDataMapStore()
const { mapDataMenuSelected: selectedMenu } = storeToRefs(useHomepageDataMapStore())

type Param =
  | 'meteoalerte' // Précipitations avec nuages
  | 'radaric' // Précipitations
  | 'foudre'
  | 'foudre-live'
  | 'vishdbtrans'
  | 'irAhdbtrans'
  | 'himawarirgb'
  | 'temperature'
  | 'pression'
  | 'MCanalysis'
  | 'frT'
  | 'webcams'
  | 'photolive'
  | 'ac24hradaricval'
  | 'ac72hradaricval'
  | 'ac24hradaric'
  | 'ac72hradaric'
  | 'ac12hradaric'
  | 'ac6hradaric'
  | 'colorac60radaric'
  | 'ac3hradaric'

const emit = defineEmits<{
  (e: 'updateParamFromMap', param: Param): void
}>()

const updateMapData = (param: Param): void => {
  // TODO
  console.log('updateMapData', param)
  switch (param) {
    case 'meteoalerte':
      setMapDataMenuSelected('observations')
      setBaseLayer('meteoalerte')
      break
    case 'radaric':
      setMapDataMenuSelected('precipitations')
      setBaseLayer('radaric')
      break
    case 'temperature':
      setMapDataMenuSelected('temperature')
      setBaseLayer('temperature')
      break
    default:
  }
}

const userStore = useUserStore()
</script>
<template>
  <div class="w-full selectbar-container relative z-2">
    <div class="lg:w-ic-fixed-custom mx-auto">
      <ul class="selectbar flex flex-row gap-0">
        <CentralBarMenuItem
          label="Observations"
          href="#"
          :onclick="() => updateMapData('meteoalerte')"
          id="homelink_meteoalerte"
          :selected="selectedMenu === 'observations'"
        />
        <CentralBarMenuItem
          label="Précipitations"
          href="#"
          id="homelink_radaric"
          link-class="hide-on-small-only"
          :onclick="() => updateMapData('radaric')"
          :selected="selectedMenu === 'precipitations'"
          :submenus="[
            { label: 'Voir la carte seule', href: '#', onclick: () => updateMapData('radaric') },
            {
              label: 'Superposer à cette carte',
              class: 'superpose-radaric',
              href: '#',
              onclick: () => updateMapData('radaric'),
            },
            {
              label: 'Accumulations sur 1h',
              href: '#',
              onclick: () => updateMapData('colorac60radaric'),
            },
            {
              label: 'Superposer accumulations sur 1h',
              class: 'superpose-colorac60radaric',
              href: '#',
              onclick: () => updateMapData('colorac60radaric'),
            },
            {
              label: 'Accumulations sur 3h',
              href: '#',
              onclick: () => updateMapData('ac3hradaric'),
            },
            {
              label: 'Superposer accumulations sur 3h',
              class: 'superpose-ac3hradaric',
              href: '#',
              onclick: () => updateMapData('ac3hradaric'),
            },
            {
              label: 'Accumulations sur 6h',
              href: '#',
              onclick: () => updateMapData('ac6hradaric'),
            },
            {
              label: 'Accumulations sur 12h',
              href: '#',
              onclick: () => updateMapData('ac12hradaric'),
            },
            {
              label: 'Accumulations sur 24h',
              href: '#',
              onclick: () => updateMapData('ac24hradaric'),
            },
            {
              label: 'Accumulations sur 72h',
              href: '#',
              onclick: () => updateMapData('ac72hradaric'),
            },
            ...(userStore.isResponsableTechnique
              ? [{ label: '--Admin seulement--', href: '#' }]
              : []),
            ...(userStore.isResponsableTechnique
              ? [
                  {
                    label: 'Accumulations sur 24h (valeurs)',
                    href: '#',
                    onclick: () => updateMapData('ac24hradaricval'),
                  },
                  {
                    label: 'Accumulations sur 72h (valeurs)',
                    href: '#',
                    onclick: () => updateMapData('ac72hradaricval'),
                  },
                ]
              : []),
          ]"
        />
        <CentralBarMenuItem
          label="Foudre"
          href="#"
          id="homelink_foudre"
          link-class="hide-on-small-only"
          :onclick="() => updateMapData('foudre')"
          :selected="selectedMenu === 'foudre'"
          :submenus="[
            {
              label: 'Voir la carte Blitzortung seule',
              href: '#',
              onclick: () => updateMapData('foudre'),
            },
            {
              label: 'Superposer Blitzortung à cette carte',
              class: 'superpose-foudre',
              href: '#',
              onclick: () => updateMapData('foudre'),
            },
            {
              label: '[DIRECT] Superposer les derniers',
              class: 'superpose-foudre-live',
              href: '#',
              onclick: () => updateMapData('foudre-live'),
            },
            { label: 'Carte gratuite METEORAGE', href: '/meteorage' },
          ]"
        />
        <CentralBarMenuItem
          label="Satellite"
          href="#"
          id="homelink_vis"
          link-class="hide-on-small-only"
          :onclick="() => updateMapData('vishdbtrans')"
          :selected="selectedMenu === 'satellite'"
          :submenus="[
            {
              label: 'Voir la carte seule',
              href: '#',
              onclick: () => updateMapData('vishdbtrans'),
            },
            {
              label: 'Superposer infrarouge à cette carte',
              class: 'superpose-irA',
              href: '#',
              onclick: () => updateMapData('irAhdbtrans'),
            },
            {
              label: 'Superposer visible à cette carte',
              class: 'superpose-vis',
              href: '#',
              onclick: () => updateMapData('vishdbtrans'),
            },
            ...(userStore.isResponsableTechnique
              ? [
                  {
                    label: 'Himawari 8 RGB (admin!)',
                    href: '#',
                    onclick: () => updateMapData('himawarirgb'),
                  },
                ]
              : []),
          ]"
        />
        <CentralBarMenuItem
          label="Température"
          href="#"
          id="homelink_temperature"
          :onclick="() => updateMapData('temperature')"
          :selected="selectedMenu === 'temperature'"
        />
        <CentralBarMenuItem
          label="Pression"
          href="#"
          id="homelink_pression"
          link-class="hide-on-small-only"
          :onclick="() => updateMapData('pression')"
          :selected="selectedMenu === 'pression'"
          :submenus="[
            { label: 'Voir la carte seule', href: '#', onclick: () => updateMapData('pression') },
            {
              label: 'Superposer isobares à cette carte',
              class: 'superpose-MCanalysis',
              href: '#',
              onclick: () => updateMapData('MCanalysis'),
            },
            {
              label: 'Superposer fronts à cette carte',
              class: 'superpose-frT',
              href: '#',
              onclick: () => updateMapData('frT'),
            },
          ]"
        />
        <CentralBarMenuItem
          label="Webcams"
          href="#"
          id="homelink_webcams"
          li-class="hide-on-small-only"
          :onclick="() => updateMapData('webcams')"
          :selected="selectedMenu === 'webcams'"
        />
        <CentralBarMenuItem
          label="Photolive"
          href="#"
          id="homelink_photolive"
          li-class="hide-on-small-only"
          :onclick="() => updateMapData('photolive')"
          :selected="selectedMenu === 'photolive'"
        />
        <li class="hide-on-small-only self-flex-end">
          <a class="text-red" href="/meteoalerte/common.php">participer</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.selectbar-container {
  /*
  width: 100%;
  height: 23px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 12;
  */
  background: #2c2c2c;
  background: rgba(44, 44, 0, 0.85);
}

/*
.selectbar-container-bottom {
  width: 100%;
  height: 23px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
*/

.selectbar {
  width: 100%;
  padding: 0;
  margin: 0;
  /*
  height: 25px;
  */
  text-align: left;
}

.selectbar-participer {
  /*background:rgba(121,0,0,0.7);*/
  /*
  float: right;
  height: 25px;
  */
}
</style>
