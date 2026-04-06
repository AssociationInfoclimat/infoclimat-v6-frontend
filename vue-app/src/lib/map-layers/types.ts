import type { IcMapConfigApiResponse } from '@/client/data-map.api.types'

export type ApiTileLayerKey = keyof IcMapConfigApiResponse['ltiles']

export type GeoJsonFeatureStyle = {
  color: string
  weight: number
  fill: boolean
}

export type LayerType =
  | 'temperature'
  | 'pression'
  | 'ac24hradaricval'
  | 'ac72hradaricval'
  | 'foudre'
  | 'MCanalysis'
  | 'mCanalysis'
  | 'vigilance'
  | 'vishdbtrans'
  | 'vishdb'
  | 'irAhdb'
  | 'irAhdbtrans'
  | 'clouds'
  | 'radaric'
  | 'nexrad'
  | 'colorac60radaric'
  | 'ac3hradaric'
  | 'ac6hradaric'
  | 'ac12hradaric'
  | 'ac24hradaric'
  | 'ac72hradaric'

export type SatelliteLayerType = 'vis' | 'irA' | 'frT'
