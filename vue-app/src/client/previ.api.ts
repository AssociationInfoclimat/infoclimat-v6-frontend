import { get, post } from './common.api'
import type {
  ApiTicketData,
  ApiTicketDataEntropy,
  GetPreviApiCommonRegionsDeptsResponse,
  PostPreviApiForecastResponse,
  PostPreviApiTicketResponse,
} from './previ.api.types'

export const getWeatherApiTicket = async ({
  lat,
  lon,
  accuracy,
}: {
  lat?: number
  lon?: number
  accuracy?: number
}) => {
  // They can be undefined (literally, in the endpoint string):
  const response = await post<
    PostPreviApiTicketResponse['payload'],
    PostPreviApiTicketResponse['responseData']
  >({
    provider: 'nestjs-v2',
    url: `/previ/ticket`,
    data: {
      lat,
      lon,
      accuracy,
    },
    options: {},
  })
  console.log(response)
  return response
}

export const getWeatherForecast = async ({
  data,
  entropy,
}: {
  data: ApiTicketData
  entropy: ApiTicketDataEntropy
}) => {
  const response = await post<
    PostPreviApiForecastResponse['payload'],
    PostPreviApiForecastResponse['responseData']
  >({
    provider: 'nestjs-v2',
    url: `/previ/coming-days`,
    data: {
      ticket_data: data,
      entropy,
    },
    options: {},
  })
  return response
}

export const getCommonRegionsDepts = async () => {
  const response = await get<GetPreviApiCommonRegionsDeptsResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/previ/common-regions-depts`,
    options: {},
  })
  return response
}
