import { get } from './common.api'
import type { GetLexiqueWordsResponse, GetPhotoliveVignettesResponse } from './misc.api.types'

export const getLexiqueWords = async () => {
  const response = await get<GetLexiqueWordsResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/dico/random`,
    options: {},
  })
  return response
}

export const getPhotoliveVignettes = async () => {
  const response = await get<GetPhotoliveVignettesResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/vignettes/photolive-json`,
    options: {},
  })
  return response
}
