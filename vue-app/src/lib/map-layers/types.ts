import type { IcMapConfigApiResponse } from '@/client/data-map.api.types'

export type ApiTileLayerKey = keyof IcMapConfigApiResponse['ltiles']

export type GeoJsonFeatureStyle = {
  color: string
  weight: number
  fill: boolean
}
