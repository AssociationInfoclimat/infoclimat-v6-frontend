<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import Button from '../kit/Button.vue'
import { ref } from 'vue'
import Modal from '../kit/Modal.vue'
import Heading from '../kit/Heading.vue'
import AccountMenuDrawerContent from './AccountMenuDrawerContent.vue'
import Drawer from '../kit/Drawer.vue'
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
      <Button variant="transparent" @click="isLoginModalOpen = !isLoginModalOpen">
        {{ user.user?.pseudo }}
      </Button>
    </div>
    <div v-else>
      <Button variant="transparent" href="/include/connexion.php">{{
        t('header.topmenu.account.login')
      }}</Button>
      <!-- 
      <Modal :is-open="isLoginModalOpen" @toggle="isLoginModalOpen = !isLoginModalOpen">
        <template>
          <Heading hx="1" class="text-center">{{ t('header.topmenu.account.login') }}</Heading>
        </template>
        <template #footer>
          <Button variant="primary" @click="isLoginModalOpen = !isLoginModalOpen">{{
            t('header.topmenu.account.login')
          }}</Button>
        </template>
      </Modal>
      -->
    </div>
  </div>
</template>
