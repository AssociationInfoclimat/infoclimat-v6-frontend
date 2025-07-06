<script setup lang="ts">
import type { IconName, IconPrefix, IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps<{
  icon: [IconPrefix, IconName] | IconProp
}>()
</script>

<template>
  <FontAwesomeIcon :icon="icon" />
</template>
