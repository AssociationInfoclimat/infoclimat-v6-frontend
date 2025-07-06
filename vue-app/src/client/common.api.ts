import axios, { type AxiosRequestConfig } from 'axios'

export const axiosLegacyBase = axios.create({
  baseURL: 'https://www.infoclimat.fr/api',
})

export const axiosNestjsBase = axios.create({
  baseURL: 'http://localhost:3000/api', // TODO: move in .env
})

// Throws an error if the response is not 200
export const get = async <Response>({
  url,
  options,
  provider = 'legacy',
}: {
  url: string
  options?: AxiosRequestConfig
  provider?: 'legacy' | 'nestjs-v2'
}): Promise<Response> => {
  const axiosInstance = provider === 'legacy' ? axiosLegacyBase : axiosNestjsBase
  const response = await axiosInstance.get(url, options)
  if (provider === 'nestjs-v2') {
    return (response.data as { success: boolean; data: Response })['data']
  }
  return response.data as Response
}

// Throws an error if the response is not 200
export const post = async <Payload, Response>({
  url,
  data,
  options,
  provider = 'legacy',
}: {
  url: string
  data: Payload
  options?: AxiosRequestConfig
  provider?: 'legacy' | 'nestjs-v2'
}): Promise<Response> => {
  const axiosInstance = provider === 'legacy' ? axiosLegacyBase : axiosNestjsBase
  const response = await axiosInstance.post(url, data, options)
  if (provider === 'nestjs-v2') {
    return (response.data as { success: boolean; data: Response })['data']
  }
  return response.data as Response
}
