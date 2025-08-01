<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import Button from './kit/Button.vue'

const userStore = useUserStore()
const isPayingMember = computed(() => userStore.isPayingMember)
</script>

<template>
  <div class="p-3 shadow bg-gradient-to-b from-ic-yellow-light to-ic-purple-light">
    <div class="font-exo text-lg">Un petit instant</div>
    <div class="text-xs leading-tight">
      <template v-if="isPayingMember">
        Merci infiniment pour votre adhésion.<br />
        Grâce à vous, Infoclimat peut être pérennisé.
      </template>
      <template v-else>
        <div class="flex flex-col gap-1">
          <p>
            Ce site est développé, maintenu, hébérgé, géré par une association à but non lucratif.
          </p>
          <p>
            <strong
              >100% gratuit, 0% pub, comment ?! : sans votre soutien, ce site ne peut pas
              vivre.</strong
            >
            <a href="https://www.infoclimat.fr/asso/Presentation_Infoclimat_v1.pdf"
              >Comprendre pourquoi</a
            >.
          </p>
          <p>
            Sur 7 millions de visiteurs par an, 2500 nous soutiennent et vous permettent de le
            visiter.
          </p>
        </div>
      </template>
    </div>
    <div class="flex flex-row gap-2 items-center justify-center mt-2" v-if="!isPayingMember">
      <Button
        variant="green-dark"
        uppercase
        size="small"
        href="https://asso.infoclimat.fr/infos/formulaire.php"
        >❤️ Adhérer</Button
      >
      <Button
        variant="green-dark"
        uppercase
        size="small"
        href="https://asso.infoclimat.fr/infos/don.php"
        >Donner 👍</Button
      >
    </div>
  </div>
</template>
