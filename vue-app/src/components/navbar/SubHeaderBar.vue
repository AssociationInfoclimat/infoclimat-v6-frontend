<script setup lang="ts">
import PhotoBoxes from '@/components/navbar/PhotoBoxes.vue'
</script>

<template>
  <div class="bg-linear-to-t from-ic-blue-light to-ic-blue">
    <div class="lg:w-ic-fixed-custom mx-auto flex flex-row">
      <div class="header-logo">
        <img src="@/assets/logo_IC_5.1.png" alt="Infoclimat" />
      </div>
      <div class="header-menu flex-1">
        <PhotoBoxes />
      </div>
      <div class="header-donation w-96">
        <div
          class="card-panel black-text"
          style="
            padding: 2px 4px;
            display: inline-block;
            height: 80px;
            width: 315px;
            margin-top: 0;
            background-image: radial-gradient(
              circle 592px at 48.2% 50%,
              rgba(255, 255, 249, 0.6) 0%,
              rgba(160, 199, 254, 1) 74.6%
            );
            margin-top: -8px;
            position: relative;
            margin-left: 8px;
          "
        >
          <!--<a style="position:absolute; right:0; top:0; padding:2px; text-decoration:none"  href="#" onclick="document.cookie = 'hide_adhesion_bandeau=yes; path=/; max-age=2678400'; document.location.reload(); return false;">&times;</a>-->
          <b style="font-size: 1.2em; font-family: Exo, sans-serif">
            100% gratuit • 0% pub • comment ?! </b
          ><br />
          <div style="margin-bottom: 4px">
            Grâce à des dizaines de bénévoles, des milliers d'adhérents et de donateurs, Infoclimat
            est rendu possible. Vous aussi, rejoignez-les !
          </div>
          <div class="adhCurseur" style="margin-bottom: 10px">
            <div
              class="tipsy-trigger"
              style="
                width: 42.394602929838%;
                background: linear-gradient(to left, #1d976c, #93f9b9);
              "
              original-title="Adhésions : 68593€"
            ></div>
            <!--adh+dons-->
            <div
              class="tipsy-trigger"
              style="
                width: 9.3409213569776%;
                background: linear-gradient(to left, #56ab2f, #a8e063);
              "
              original-title="Dons : 19384.28€"
            ></div>
            <!--dons-->
            <span style="right: 0; top: 0">objectif 207.520€ → </span>
          </div>
          <a
            class="growOnHover btn-small waves-effect waves-light btn white black-text hoverable"
            style="
              height: 26px;
              line-height: 26px;
              background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
            "
            href="https://asso.infoclimat.fr/infos/formulaire.php"
            >❤️ Adhérer</a
          >
          <a
            class="growOnHover btn-small waves-effect waves-light btn white black-text hoverable"
            style="
              height: 26px;
              line-height: 26px;
              margin-left: 12px;
              background-image: linear-gradient(-40deg, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%);
            "
            onclick="return IC_don_affiche_popup();"
            href="https://asso.infoclimat.fr/infos/don.php"
            >Donner 👍</a
          >
          <a
            class="tipsy-trigger growOnHover btn-small waves-effect waves-light btn white black-text hoverable"
            style="
              height: 26px;
              line-height: 26px;
              background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
              padding: 0 6px;
              margin-left: 12px;
            "
            href="https://asso.infoclimat.fr/infos/"
            original-title="Pourquoi soutenir ?"
            ><i class="material-icons">help</i></a
          >
        </div>
      </div>
    </div>
  </div>
</template>
