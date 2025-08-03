<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import Heading from '../kit/Heading.vue'
import { useI18n } from 'vue-i18n'
import Button from '../kit/Button.vue'

const { t } = useI18n()

const user = useUserStore()

const logout = () => {
  user.logout()
}
</script>

<template>
  <div class="account-menu-drawer-content">
    <Heading hx="1" class="text-center">{{ user.user?.pseudo }}</Heading>
    <Button variant="transparent" :loading="user.loading" @click="logout">{{
      t('header.topmenu.account.logout')
    }}</Button>
  </div>
</template>
