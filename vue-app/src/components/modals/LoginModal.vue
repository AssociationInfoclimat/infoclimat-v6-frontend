<script setup lang="ts">
import Heading from '../kit/Heading.vue'
import Modal from '../kit/Modal.vue'
import Button from '../kit/Button.vue'
import { useI18n } from 'vue-i18n'
import TextField from '../kit/TextField.vue'

const { open } = defineProps<{
  open: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
</script>

<template>
  <Modal :is-open="open" @hide="() => emit('close')">
    <div class="login-modal-content">
      <Heading hx="1" class="text-center">{{ t('header.topmenu.account.login') }}</Heading>

      <div class="flex flex-col gap-2">
        <TextField
          :label="t('forms.labels.email')"
          :placeholder="t('forms.placeholders.email')"
        />
        <TextField
          :label="t('forms.labels.password')"
          :placeholder="t('forms.placeholders.password')"
        />
      </div>
    </div>

    <template #footer>
      <Button variant="primary" @click="() => emit('close')">{{
        t('header.topmenu.account.login')
      }}</Button>
    </template></Modal
  >
</template>
