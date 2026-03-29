import type { IcMapConfig } from '@/client/data-map.api.types'

export type TileLayerKey = keyof IcMapConfig['ltiles']

export type GeoJsonFeatureStyle = {
  color: string
  weight: number
  fill: boolean
}
