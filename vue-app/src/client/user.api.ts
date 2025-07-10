import { get } from './common.api'
import type { GetUserApiMeResponse } from './user.api.types'

export const getMe = async () => {
  const response = await get<GetUserApiMeResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/auth/me`,
    options: {},
  })
  return response
}
