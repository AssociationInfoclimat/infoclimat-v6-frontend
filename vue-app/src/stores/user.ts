import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { Me } from '@/client/user.api.types'
import { UserStatus } from '@/client/user.api.types'
import { getCookie, removeCookie, setCookie } from '@/shared/utils'
import { getMe } from '@/client/user.api'
import { AUTH_COOKIE_NAME } from '@/client/common.api'

export const useUserStore = defineStore('user', () => {
  const user = ref<Me | null>(null)
  const hasCookie = ref<boolean>(!!getCookie(AUTH_COOKIE_NAME))
  const loading = ref<boolean>(true)

  const setUser = (userData: Me | null) => {
    user.value = userData
    loading.value = false
  }

  const login = async (cookieToken: string) => {
    setCookie({
      name: AUTH_COOKIE_NAME,
      value: cookieToken,
      expiresAt: dayjs().add(30, 'day').toDate(),
      path: '/',
    })
    hasCookie.value = true

    // Fetch current user
    const me = await getMe()
    setUser(me)
  }

  const logout = () => {
    loading.value = true
    user.value = null
    hasCookie.value = false
    removeCookie(AUTH_COOKIE_NAME)

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
    // authentification
    login,
    logout,
  }
})
