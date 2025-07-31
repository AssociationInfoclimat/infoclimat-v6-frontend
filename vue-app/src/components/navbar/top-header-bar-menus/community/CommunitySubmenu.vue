<script setup lang="ts">
import TopHeaderSubmenuTitle from '@/components/navbar/top-header-bar-menus/TopHeaderSectionTitle.vue'
import TopHeaderLink from '../TopHeaderLink.vue'
</script>
<template>
  <div class="flex flex-row w-full gap-3">
    <div class="w-1/6 px-3 flex flex-col gap-3">
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.community.staticNetwork.title')"
          href="/stations/static.php"
        />
        <div class="flex flex-col">
          <TopHeaderLink href="/stations/static.php">
            {{ $t('header.topmenu.submenus.community.staticNetwork.pages.introduction') }}
          </TopHeaderLink>
          <TopHeaderLink href="/stations/inscription.php?type=static">
            {{ $t('header.topmenu.submenus.community.staticNetwork.pages.inscription') }}
          </TopHeaderLink>
        </div>
      </div>
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.community.amateurStations.title')"
        />
        <div class="flex flex-col">
          <TopHeaderLink href="/cartes/stations-amateurs.php">
            {{ $t('header.topmenu.submenus.community.amateurStations.pages.map') }}
          </TopHeaderLink>
          <TopHeaderLink href="/stations/inscription.php?type=amateur">
            {{ $t('header.topmenu.submenus.community.amateurStations.pages.inscription') }}
          </TopHeaderLink>
        </div>
      </div>
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.community.tools.title')"
          href="/outils/calculs.php"
        />
        <div class="flex flex-col">
          <TopHeaderLink href="/electric">
            {{ $t('header.topmenu.submenus.community.tools.pages.electric') }}
          </TopHeaderLink>
          <TopHeaderLink href="/outils/calculs.php">
            {{ $t('header.topmenu.submenus.community.tools.pages.conversions') }}
          </TopHeaderLink>
          <TopHeaderLink href="/outils/webmasters.php">
            {{ $t('header.topmenu.submenus.community.tools.pages.webmasters') }}
          </TopHeaderLink>
        </div>
      </div>
      <div>
        <TopHeaderSubmenuTitle
          :title="$t('header.topmenu.submenus.community.website.title')"
          href="/contact"
        />
        <div class="flex flex-col">
          <TopHeaderLink href="/include/inscription.php">
            {{ $t('header.topmenu.submenus.community.website.pages.inscription') }}
          </TopHeaderLink>
          <TopHeaderLink href="/actualites-infoclimat.html">
            {{ $t('header.topmenu.submenus.community.website.pages.news') }}
          </TopHeaderLink>
          <TopHeaderLink href="/medias">
            {{ $t('header.topmenu.submenus.community.website.pages.press') }}
          </TopHeaderLink>
        </div>
      </div>
    </div>
    <div class="w-1/6 px-3 flex flex-col gap-3 bg-gradient-to-b from-ic-grey-light to-ic-grey">
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.community.plus.title')" />
        <div class="flex flex-col">
          <TopHeaderLink href="/concours">
            {{ $t('header.topmenu.submenus.community.plus.pages.contests') }}
          </TopHeaderLink>
          <TopHeaderLink href="/cartic">
            {{ $t('header.topmenu.submenus.community.plus.pages.cartography') }}
          </TopHeaderLink>
          <TopHeaderLink href="/boutique">
            {{ $t('header.topmenu.submenus.community.plus.pages.shop') }}
          </TopHeaderLink>
        </div>
      </div>
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.community.socials.title')" />
        <div class="flex flex-col">
          <TopHeaderLink href="https://facebook.com/infoclimat">
            {{ $t('header.topmenu.submenus.community.socials.pages.facebook') }}
          </TopHeaderLink>
          <TopHeaderLink href="https://twitter.com/infoclimat">
            {{ $t('header.topmenu.submenus.community.socials.pages.twitter') }}
          </TopHeaderLink>
        </div>
      </div>
    </div>
    <div class="w-1/6 px-3">
      <div>
        <TopHeaderSubmenuTitle :title="$t('header.topmenu.submenus.community.contribute.title')" />
        <div class="flex flex-col">
          <span class="bg-yellow-100 p-3 leading-tight text-xs shadow">
            <p>
              Faites connaissance avec l'équipe bénévole qui travaille dans les coulisses
              d'Infoclimat pour en faire la plus belle communauté météo francophone.
            </p>

            <p>
              Et vous aussi, contribuez à cette initiative lancée en 2001 en rejoignant notre équipe
              !
            </p>

            <a class="btn-small" style="margin-top: 8px" href="/contribuer"> Contribuer </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
