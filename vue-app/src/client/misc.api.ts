import { get } from './common.api'
import type { GetLexiqueWordsResponse } from './misc.api.types'

export const getLexiqueWords = async () => {
  const response = await get<GetLexiqueWordsResponse['responseData']>({
    provider: 'nestjs-v2',
    url: `/dico/random`,
    options: {},
  })
  return response
}
