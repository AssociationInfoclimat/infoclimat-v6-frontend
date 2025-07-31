import type { GetBimResponse, GetBs2sResponse, GetChroniquesBqsResponse } from './chroniques.api.types'
import { get } from './common.api'

export const getBqsNews = async () => {
  const response = await get<GetChroniquesBqsResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/chroniques/bqs`,
    options: {},
  })
  return response
}

export const getBs2sNews = async () => {
  const response = await get<GetBs2sResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/chroniques/bs2s`,
    options: {},
  })
  return response
}

export const getBimNews = async () => {
  const response = await get<GetBimResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/chroniques/bim`,
    options: {},
  })
  return response
}