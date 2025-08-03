<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import Button from '../kit/Button.vue'
import { ref } from 'vue'
import AccountMenuDrawerContent from './AccountMenuDrawerContent.vue'
import Drawer from '../kit/Drawer.vue'
import LoginModal from '../modals/LoginModal.vue'
const { t } = useI18n()

const user = useUserStore()

const isLoginModalOpen = ref(false)
</script>

<template>
  <div class="account-menu">
    <div v-if="user.loading">
      <div class="w-6 h-6 bg-ic-grey-light rounded-full animate-pulse"></div>
    </div>
    <div v-else-if="user.user">
      <Drawer :is-open="isLoginModalOpen" @toggle="isLoginModalOpen = !isLoginModalOpen">
        <AccountMenuDrawerContent />
      </Drawer>
      <Button variant="transparent-blue-dark" @click="isLoginModalOpen = !isLoginModalOpen">
        {{ user.user?.pseudo }}
      </Button>
    </div>
    <div v-else>
      <Button variant="transparent-blue-dark" @click="() => (isLoginModalOpen = true)">{{
        t('header.topmenu.account.login')
      }}</Button>
      <LoginModal :open="isLoginModalOpen" @close="() => (isLoginModalOpen = false)" />
    </div>
  </div>
</template>
