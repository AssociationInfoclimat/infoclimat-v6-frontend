import { get, post } from './common.api'
import type {
  GetUserApiMeResponse,
  GetUserApiUserVignettesResponse,
  PostUserLoginApiResponse,
} from './user.api.types'

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

export const login = async ({ username, password }: { username: string; password: string }) => {
  const response = await post<
    PostUserLoginApiResponse['payload'],
    PostUserLoginApiResponse['responseData']
  >({
    provider: 'nestjs-v2',
    url: `/auth/login`,
    data: {
      username,
      password,
    },
    options: {},
  })
  return response
}
