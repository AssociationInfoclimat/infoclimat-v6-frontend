<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="account-menu">
    {{ t('header.topmenu.account.login') }}
  </div>
</template>
