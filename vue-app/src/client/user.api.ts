import { get } from './common.api'
import type { GetUserApiMeResponse, GetUserApiUserVignettesResponse } from './user.api.types'

export const getMe = async () => {
  const response = await get<GetUserApiMeResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/auth/me`,
    options: {},
  })
  return response
}

export const getUserVignettes = async () => {
  const response = await get<GetUserApiUserVignettesResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/vignettes`,
    options: {},
  })
  return response
}
