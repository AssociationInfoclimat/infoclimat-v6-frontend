<script setup lang="ts">
import Heading from '../kit/Heading.vue'
import Modal from '../kit/Modal.vue'
import Button from '../kit/Button.vue'
import { useI18n } from 'vue-i18n'
import TextField from '../kit/TextField.vue'
import { ref } from 'vue'
import { login } from '@/client/user.api'
import { useUserStore } from '@/stores/user'
import { isAxiosError } from 'axios'

const { open } = defineProps<{
  open: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()

const { login: userStoreLogin } = useUserStore()

const loginLoading = ref(false)
const username = ref('')
const password = ref('')
const error = ref('')
const onSubmit = async (event: Event) => {
  loginLoading.value = true
  event.preventDefault()

  try {
    const loginResponse = await login({ username: username.value, password: password.value })

    try {
      // At that point, we did have a HTTP 200, so we can safely set the cookie:
      await userStoreLogin(loginResponse.cookie_token)

      emit('close')
    } catch (err) {
      // Not supposed to trigger any errors, if we got one, console.error for sentry,
      //  then just print unknown error:
      console.error(err)
      error.value = t('errors.unknown')
    }
  } catch (err) {
    if (isAxiosError(err)) {
      error.value = t(err.response?.data.reason)
    } else {
      error.value = t('errors.unknown')
    }
  } finally {
    loginLoading.value = false
  }
}
</script>

<template>
  <Modal :is-open="open" container-as-form @hide="() => emit('close')" @submit="onSubmit">
    <div class="login-modal-content">
      <Heading hx="1" class="text-center">{{ t('header.topmenu.account.login') }}</Heading>

      <div v-if="error" class="text-red-500 text-center">{{ error }}</div>

      <div class="flex flex-col gap-2">
        <!-- Error because of special characters in the placeholder (ex: "@" for emails)-->
        <!-- https://vue-i18n.intlify.dev/guide/essentials/syntax#special-characters -->
        <TextField
          :label="t('forms.labels.username')"
          :placeholder="t('forms.placeholders.username')"
          type="text"
          required
          v-model="username"
        />
        <TextField
          :label="t('forms.labels.password')"
          :placeholder="t('forms.placeholders.password')"
          type="password"
          required
          v-model="password"
        />
      </div>
    </div>

    <template #footer>
      <Button variant="primary" :loading="loginLoading" type="submit-button">{{
        t('header.topmenu.account.login')
      }}</Button>
    </template>
  </Modal>
</template>
