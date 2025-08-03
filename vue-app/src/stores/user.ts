import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import type { Me } from '@/client/user.api.types'
import { UserStatus } from '@/client/user.api.types'
import { getCookie, removeCookie } from '@/shared/utils'
import { getMe } from '@/client/user.api'

export const useUserStore = defineStore('user', () => {
  const user = ref<Me | null>(null)
  const hasCookie = ref<boolean>(!!getCookie('f_r_cookie'))
  const loading = ref<boolean>(true)

  const setUser = (userData: Me | null) => {
    user.value = userData
    loading.value = false
  }

  const logout = () => {
    loading.value = true
    user.value = null
    hasCookie.value = false
    removeCookie('f_r_cookie')

    location.reload()
  }

  onMounted(async () => {
    if (hasCookie.value) {
      const me = await getMe()
      setUser(me)
    } else {
      setUser(null)
    }
    loading.value = false
  })

  return {
    user,
    // est adhérent?:
    isPayingMember: computed(() => user.value?.statuses.includes(UserStatus.ADHERENT)),
    hasCookie,
    loading,
    setUser,
    logout,
  }
})
