import type { BaseLayerParam, OverlayParamWithAutoSat } from '@/stores/homepage-data-map.types'

export type MapTileInfo = {
  year: string
  month: string
  day: string
  hour: string
  minute: string
}

export type MapTileConfig = {
  info: MapTileInfo & { last_stroke?: number }
  key: string | false
}

export type IcMapConfigApiResponse = {
  isNightTime: boolean
  ltiles: {
    ac12hradaric: MapTileConfig
    ac24hradaric: MapTileConfig
    ac3hradaric: MapTileConfig
    ac6hradaric: MapTileConfig
    ac72hradaric: MapTileConfig
    clouds: MapTileConfig
    colorac60radaric: MapTileConfig
    estofex: MapTileConfig
    foudre: MapTileConfig
    goesei4: MapTileConfig
    goesei7: MapTileConfig
    goesergb: MapTileConfig
    goesev1: MapTileConfig
    goeswv2: MapTileConfig
    himawarirgb: MapTileConfig
    irAhdbtrans: MapTileConfig
    mCanalysis: MapTileConfig
    nexrad: MapTileConfig
    pointDeRosee: MapTileConfig
    pression: MapTileConfig
    radaric: MapTileConfig
    temperature: MapTileConfig
    temps_omm: MapTileConfig
    vishdbtrans: MapTileConfig
    meteoalerte: MapTileConfig
    webcams: MapTileConfig
    vigilance: MapTileConfig
    vis: MapTileConfig
    irA: MapTileConfig
    frT: MapTileConfig
    modis: MapTileConfig
  }
  lanim: Record<string, (MapTileInfo & { k?: string })[]>
}

export type DefaultMapConf = {
  base: BaseLayerParam
  overlays: OverlayParamWithAutoSat[]
}

export type LieuPref = {
  lat: number
  lon: number
  lieu: string
}

export type DataMapBackendTileInfo = {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  last_stroke?: string
}

export type DataMapBackendTileConfig = {
  info: DataMapBackendTileInfo
  key?: string | false
}

export type DataMapBackendAnimFrame = DataMapBackendTileInfo & {
  k?: string
}

export type DataMapConfigResponseData = {
  ltiles: {
    ac12hradaric: DataMapBackendTileConfig
    ac24hradaric: DataMapBackendTileConfig
    ac3hradaric: DataMapBackendTileConfig
    ac6hradaric: DataMapBackendTileConfig
    ac72hradaric: DataMapBackendTileConfig
    clouds: DataMapBackendTileConfig
    colorac60radaric: DataMapBackendTileConfig
    estofex: DataMapBackendTileConfig
    foudre: DataMapBackendTileConfig
    goesei4: DataMapBackendTileConfig
    goesei7: DataMapBackendTileConfig
    goesergb: DataMapBackendTileConfig
    goesev1: DataMapBackendTileConfig
    goeswv2: DataMapBackendTileConfig
    himawarirgb: DataMapBackendTileConfig
    ir_ahdbtrans: DataMapBackendTileConfig
    m_canalysis: DataMapBackendTileConfig
    nexrad: DataMapBackendTileConfig
    point_de_rosee: DataMapBackendTileConfig
    pression: DataMapBackendTileConfig
    radaric: DataMapBackendTileConfig
    temperature: DataMapBackendTileConfig
    temps_omm: DataMapBackendTileConfig
    vishdbtrans: DataMapBackendTileConfig
    meteoalerte: DataMapBackendTileConfig
    webcams: DataMapBackendTileConfig
    vigilance: DataMapBackendTileConfig
    vis: DataMapBackendTileConfig
    ir_a: DataMapBackendTileConfig
    fr_t: DataMapBackendTileConfig
    modis: DataMapBackendTileConfig
  }
  lanim: Record<string, DataMapBackendAnimFrame[]>
  is_night_time: boolean
}

export type GetDataMapDataResponse = {
  responseData: DataMapConfigResponseData
}

export type GetDataMapTokenResponse = {
  responseData: string
}

// ── Observation markers ──────────────────────────────────

export type ObservationMarkerData = {
  id: string
  lat: number
  lon: number
  icon: string
  size: [number, number]
  anchor: [number, number]
  type: string
  time: string
  stid?: string
}

export type ObservationsApiResponse = {
  DATA: ObservationMarkerData[]
}

export type ObservationDetailApiResponse = {
  DATA: Record<string, unknown>
}
