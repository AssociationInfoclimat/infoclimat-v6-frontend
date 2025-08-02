<script setup lang="ts">
import { getMobileNews } from '@/client/chroniques.api'
import type { GetMobileNewsResponse } from '@/client/chroniques.api.types'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'

const news = ref<GetMobileNewsResponse['responseData']>([])

onMounted(async () => {
  news.value = await getMobileNews()
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <template v-for="item in news" :key="item.id">
      <div class="flex flex-row gap-2 p-1 bg-gray-100 shadow">
        <div class="w-20">
          <img :src="item.thumbnail" alt="thumbnail" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 leading-tight">
          <div class="flex flex-row gap-2 items-center">
            <div class="text-sm font-bold">{{ item.title }}</div>
            <div class="text-xs bg-ic-blue-dark text-white p-1 rounded">
              {{ item.published_at }}
            </div>
          </div>
          <div class="text-xs mt-1">{{ item.summary }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
