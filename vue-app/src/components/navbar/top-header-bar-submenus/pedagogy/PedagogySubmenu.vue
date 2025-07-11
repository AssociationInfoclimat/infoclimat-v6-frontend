<script setup lang="ts">
import TopHeaderSubmenuTitle from '@/components/navbar/top-header-bar-submenus/TopHeaderSubmenuTitle.vue'
import TopHeaderLink from '../TopHeaderLink.vue'
import { onMounted, ref } from 'vue'
import { getLexiqueWords } from '@/client/misc.api'
import type { GetLexiqueWordsResponse } from '@/client/misc.api.types'

const bgImageUrl = 'https://static.infoclimat.net/images/partenaires/logo_mae.png'

const words = ref<GetLexiqueWordsResponse['responseData']['words']>([])
onMounted(async () => {
  words.value = await getLexiqueWords()
})
</script>
<template>
  <div class="flex flex-row w-full gap-6">
    <div class="w-3/5">
      <div class="w-full border-b-4 border-ic-blue-3 flex justify-center pb-2">
        <img :src="bgImageUrl" alt="bg" class="h-16" />
      </div>
      <div class="flex flex-row gap-3">
        <div
          class="w-1/3 px-2 bg-gradient-to-b from-ic-grey-light to-ic-grey flex flex-col gap-3 py-3"
        >
          <div>
            <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.pedagogy.school.title')" />
            <div class="flex flex-col">
              <TopHeaderLink href="/pedagogie/presentation.php">
                Présentation de Météo à l'École</TopHeaderLink
              >
              <TopHeaderLink href="/pedagogie"> Carte et données des stations</TopHeaderLink>
            </div>
          </div>
          <div>
            <TopHeaderSubmenuTitle
              :title="$t('header.topmenu.submenus.pedagogy.highSchool.title')"
            />
            <div class="flex flex-col">
              <TopHeaderLink href="/pedagogie/ressources_pedagogiques.php#lycee">
                Accompagnem<sup>t</sup> personnalisé
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_pedagogiques.php#lycee">
                Seconde MPS
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_pedagogiques.php#lycee">
                Première S
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_pedagogiques.php#lycee">
                2nde Bac Pro / 2nde MPS
              </TopHeaderLink>
            </div>
          </div>
        </div>
        <div class="w-1/3 py-3">
          <div>
            <TopHeaderSubmenuTitle
              :title="$t('header.topmenu.submenus.pedagogy.secondary.title')"
            />
            <div class="flex flex-col">
              <TopHeaderLink href="/pedagogie/ressources_pedagogiques.php">
                Étude des conditions de formation du mistral
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_pedagogiques.php">
                Formation et dissipation d'un brouillard à Chenôve
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_pedagogiques.php">
                Les araignées des Monts d'Arrée
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_pedagogiques.php">
                Différence météo/climato
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_pedagogiques.php">
                Épisode de pollution atmosphérique
              </TopHeaderLink>
            </div>
          </div>
        </div>
        <div class="w-1/3 px-2 bg-gradient-to-b from-ic-grey-light to-ic-grey py-3">
          <div>
            <TopHeaderSubmenuTitle
              :title="$t('header.topmenu.submenus.pedagogy.scientific.title')"
            />
            <div class="flex flex-col">
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources1">
                Situations météo classiques
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources2">
                Concept de perturbation
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources3">
                Phénomènes exceptionnels
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources4">
                Phénomènes brefs
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources6">
                Variations spatiales
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources7">
                Variations locales
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources8">
                Phénomènes classiques
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources9">
                Phénomènes des tropiques
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources10">
                Applications à la météorologie
              </TopHeaderLink>
              <TopHeaderLink href="/pedagogie/ressources_scientifiques.php#ressources11">
                Mesure
              </TopHeaderLink>
              <TopHeaderLink href="https://www.meteorage.com/fr/comprendre-les-orages-et-la-foudre">
                Météorologie des orages
              </TopHeaderLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-2/5 flex flex-row gap-3">
      <div class="w-1/2">
        <div>
          <TopHeaderSubmenuTitle
            :title="$t('header.topmenu.submenus.pedagogy.weatherReports.title')"
          />
          <div class="flex flex-col">
            <TopHeaderLink
              href="/dossiers-meteo-20-approche-multidisciplinaire-pour-la-caracterisation-d-inondations-remarquables.html"
            >
              Caractérisation d'inondations remarquables
            </TopHeaderLink>
            <TopHeaderLink href="/dossiers-meteo-19-inondations-azureennes-du-3-octobre-2015.html">
              Inondations azuréennes (octobre 2015)
            </TopHeaderLink>
            <TopHeaderLink href="/dossiers?sct"> Supercellules et tornades </TopHeaderLink>
            <TopHeaderLink href="/bulletins-quotidiens-de-suivi-search-2009-01-24.html">
              Tempête Klaus
            </TopHeaderLink>
            <TopHeaderLink href="/dossiers-meteo-1-la-tempete-klaus-du-24-janvier-2009.html">
              Tempête Klaus (2)
            </TopHeaderLink>
            <TopHeaderLink href="/bulletins-quotidiens-de-suivi-search-2010-02-28.html">
              Tempête Xynthia
            </TopHeaderLink>
            <TopHeaderLink href="/bulletins-quotidiens-de-suivi-search-2011-12-16.html">
              Tempête Joachim
            </TopHeaderLink>
            <TopHeaderLink
              href="/dossiers-meteo-2-normes-d-installation-d-une-station-meteo-personnelle.html"
            >
              Installation station météo
            </TopHeaderLink>
            <TopHeaderLink href="/dossiers?sto"> Situations orageuses </TopHeaderLink>
            <TopHeaderLink href="/bulletins-quotidiens-de-suivi-search-2009-12-18.html">
              Vague de froid de 2009
            </TopHeaderLink>
            <TopHeaderLink href="/bulletins-quotidiens-de-suivi-search-2010-06-15.html">
              Inondations du Var (juin 2010)
            </TopHeaderLink>
            <TopHeaderLink class="mt-2" href="/dossiers?sto"> Autres dossiers </TopHeaderLink>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <div>
          <TopHeaderSubmenuTitle
            :title="$t('header.topmenu.submenus.pedagogy.weatherVocabulary.title')"
          />
          <div class="flex flex-col">
            <TopHeaderLink
              v-for="word in words"
              :key="word.id"
              :href="`/lexique-definition-${word.id}-${word.slug}.html`"
            >
              {{ word.mot }}
            </TopHeaderLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
