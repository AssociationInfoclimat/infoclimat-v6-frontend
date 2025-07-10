<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const user = useUserStore()
</script>

<template>
  <div class="account-menu">
    <div v-if="user.loading">
      <div class="w-6 h-6 bg-ic-grey-light rounded-full animate-pulse"></div>
    </div>
    <div v-else-if="user.user">
      {{ user.user?.pseudo }}
    </div>
    <div v-else>
      {{ t('header.topmenu.account.login') }}
    </div>
  </div>
</template>
