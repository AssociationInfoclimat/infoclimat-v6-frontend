<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import Button from './kit/Button.vue'

const userStore = useUserStore()
const isPayingMember = computed(() => userStore.isPayingMember)
</script>

<template>
  <div
    class="py-1 px-2 shadow text-center"
    style="
      height: 80px;
      width: 320px;
      background-image: radial-gradient(
        circle 592px at 48.2% 50%,
        rgba(255, 255, 249, 0.6) 0%,
        rgba(160, 199, 254, 1) 74.6%
      );
    "
  >
    <div class="font-exo">100% gratuit • 0% pub • comment ?!</div>
    <div class="text-xs leading-tight">
      <template v-if="isPayingMember">
        Merci infiniment pour votre adhésion.<br />
        Grâce à vous, Infoclimat peut être pérennisé.
      </template>
      <template v-else>
        Grâce à des dizaines de bénévoles, des milliers d'adhérents et de donateurs, Infoclimat est
        rendu possible. Vous aussi, rejoignez-les !
      </template>
    </div>
    <!--
    <div class="flex flex-row gap-2">
        <div
            class="tipsy-trigger"
            style="
            width: 42.394602929838%;
            background: linear-gradient(to left, #1d976c, #93f9b9);
            "
            original-title="Adhésions : 68593€"
        ></div>
        <div
            class="tipsy-trigger"
            style="
            width: 9.3409213569776%;
            background: linear-gradient(to left, #56ab2f, #a8e063);
            "
            original-title="Dons : 19384.28€"
        ></div>
        <span style="right: 0; top: 0">objectif 207.520€ → </span>
    </div>
    -->
    <div class="flex flex-row gap-2 items-center justify-center" v-if="!isPayingMember">
      <Button
        variant="yellow-purple-gradient"
        uppercase
        size="small"
        href="https://asso.infoclimat.fr/infos/formulaire.php"
        >❤️ Adhérer</Button
      >
      <Button
        variant="purple-pink-gradient"
        uppercase
        size="small"
        href="https://asso.infoclimat.fr/infos/don.php"
        >Donner 👍</Button
      >
      <Button
        variant="yellow-purple-gradient"
        size="small"
        href="https://asso.infoclimat.fr/infos/"
        original-title="Pourquoi soutenir ?"
        :icon="['fas', 'circle-question']"
      ></Button>
    </div>
  </div>
</template>
