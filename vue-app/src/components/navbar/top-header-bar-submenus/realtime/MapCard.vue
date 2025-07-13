<script setup lang="ts">
import { computed } from 'vue'
import type { Zone } from '@/shared/types'

type MapCardType =
  | 'meteoalerte'
  | 'webcam'
  // From here they need zone/hour/minute:
  | 'liveRain'
  | 'liveSatellite'
  | 'liveStorm'
  | 'stationsTemperature'
  | 'stationsSunshine'
  | 'stationsWind'
  | 'stationsRain'
  | 'stationsWaterTemp'
  | 'stationsSnow'

const props = defineProps<{
  type: MapCardType
  // Only used for type==='rain'|...:
  hoverCategoryLabel?: {
    left?: string
    right?: string
  }
  zone?: Zone
  minute?: string // on 2 digits
  hour?: number
}>()

const utcOffset = 2

const snowTempEmbedUrl = computed(() => {
  return 'https://www.infoclimat.fr/cartes/enneigement_iframe.php'
})

const cardImg = computed(() => {
  switch (props.type) {
    case 'meteoalerte':
      return 'https://www.infoclimat.fr/meteoalerte/cache/france.png'
    case 'webcam':
      return 'https://www.infoclimat.fr/webcam/cache/france.png'
  }
  if (props.hour === undefined || props.minute === undefined || !props.zone) {
    throw new Error('hour and minute are required')
  }
  switch (props.type) {
    case 'liveRain':
      return `https://tempsreel.infoclimat.net/secure-staticmaps/mk::temperature/radaric:temperatures,countries,landsea,departements/2025/06/22/${props.hour - utcOffset}/v:${props.minute}/${props.zone}.jpeg?maponly=1`
    case 'liveSatellite':
      return `https://tempsreel.infoclimat.net/secure-staticmaps/mk::temperature_HD_3857/irAhdbtrans:temperatures,countries,departements,landsea/2025/06/22/${props.hour - utcOffset}/v:${props.minute}/${props.zone}.jpeg?maponly=1`
    case 'liveStorm':
      return `https://tempsreel.infoclimat.net/secure-staticmaps/mk:b:foudre2/foudre:foudre,departements/2025/06/22/${props.hour - utcOffset}/v:${props.minute}/${props.zone}.jpeg?maponly=1`
    case 'stationsTemperature':
      return `https://tempsreel.infoclimat.net/secure-staticmaps/mk::temperature_HD_nosst/temperature:temperatures,temperaturesHD,countries,landsea,departements/2025/06/22/${props.hour - utcOffset}/v:${props.minute}/${props.zone}.jpeg?maponly=1`
    case 'stationsSunshine':
      return `https://tempsreel.infoclimat.net/secure-staticmaps/mk::temperature/msgsrad:temperatures,countries,landsea,departements/2025/06/22/${props.hour - utcOffset}/v:${props.minute}/${props.zone}.jpeg?maponly=1`
    case 'stationsWind':
      return `https://tempsreel.infoclimat.net/secure-staticmaps/mk::temperature_HD_nosst/vent_moyen:temperatures,countries,landsea,departements/2025/06/22/${props.hour - utcOffset}/v:${props.minute}/${props.zone}.jpeg?maponly=1`
    case 'stationsRain':
      return `https://tempsreel.infoclimat.net/secure-staticmaps/mk::temperature/ac24hradaric:temperatures,countries,landsea,departements/2025/06/22/${props.hour - utcOffset}/v:${props.minute}/${props.zone}.jpeg?maponly=1`
    case 'stationsWaterTemp':
      return 'https://tempsreel.infoclimat.net/secure-staticmaps/mk::temperature/GHRSSTL4sstrgb:temperatures,countries,landsea,departements/2025/06/21/00/v:00/france_lg.jpeg?maponly=1'
    // TODO: add stationsSnow (for now it's an embed)
    default:
      return ''
  }
})

const href = ''
</script>

<template>
  <div
    v-if="type === 'stationsSnow'"
    class="map-card block relative cursor-pointer w-full h-24 rounded transition-all duration-300"
  >
    <iframe
      :src="snowTempEmbedUrl"
      style="
        border: 0;
        width: 100%;
        height: 96px;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
      "
      scrolling="no"
      frameborder="0"
      allowfullscreen
    ></iframe>
    <div v-if="hoverCategoryLabel && hoverCategoryLabel.left" class="absolute z-2 top-1 left-1">
      <div
        class="inline-block py-0 px-1 text-xs bg-ic-blue-dark text-white rounded"
        v-html="hoverCategoryLabel.left"
      />
    </div>
    <div v-if="hoverCategoryLabel && hoverCategoryLabel.right" class="absolute z-2 top-1 right-1">
      <div class="inline-block y-0 px-1 text-xs bg-ic-blue-dark text-white rounded">
        {{ hoverCategoryLabel.right }}
      </div>
    </div>
    <div class="overlay z-1 absolute top-0 left-0 w-full h-full bg-black/25"></div>
  </div>
  <a
    v-else
    :href="href"
    class="map-card block relative cursor-pointer w-full h-24 rounded transition-all duration-300"
    :style="{
      backgroundImage: `url(${cardImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div v-if="hoverCategoryLabel && hoverCategoryLabel.left" class="absolute z-2 top-1 left-1">
      <div
        class="inline-block py-0 px-1 text-xs bg-ic-blue-dark text-white rounded"
        v-html="hoverCategoryLabel.left"
      />
    </div>
    <div v-if="hoverCategoryLabel && hoverCategoryLabel.right" class="absolute z-2 top-1 right-1">
      <div class="inline-block py-0 px-1 text-xs bg-ic-blue-dark text-white rounded">
        {{ hoverCategoryLabel.right }}
      </div>
    </div>
    <div class="overlay z-1 absolute top-0 left-0 w-full h-full bg-black/25"></div>
    <slot />
  </a>
</template>

<style scoped>
/*  
 Since latest tailwind, when @apply, 
 we need to use `@reference "tailwindcss";` (https://tailwindcss.com/docs/functions-and-directives#apply-directive) 
*/
@reference "@/assets/base.less";

.map-card {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  & > div.overlay {
    @apply hidden;
  }
  &:hover {
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.5);
    > div.overlay {
      @apply block;
    }
  }
}
</style>
