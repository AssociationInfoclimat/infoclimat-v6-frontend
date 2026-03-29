import axios from 'axios'
import { get } from './common.api'
import type {
  DataMapBackendAnimFrame,
  DataMapBackendTileConfig,
  DataMapBackendTileInfo,
  DataMapConfigResponseData,
  DefaultMapConf,
  GetDataMapDataResponse,
  GetDataMapTokenResponse,
  IcMapConfigApiResponse,
  LieuPref,
  MapTileInfo,
  ObservationMarkerData,
  ObservationsApiResponse,
  ObservationDetailApiResponse,
} from './data-map.api.types'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const normalizeLegacyLayerKey = (
  key: keyof DataMapConfigResponseData['ltiles'],
): keyof IcMapConfigApiResponse['ltiles'] => {
  // Since we sankified the backend, we need to normalize the keys to the new format.
  if (key === 'ir_ahdbtrans') {
    return 'irAhdbtrans'
  }
  if (key === 'm_canalysis') {
    return 'mCanalysis'
  }
  if (key === 'point_de_rosee') {
    return 'pointDeRosee'
  }
  // ------------------------------------------------------------

  if (key === 'ir_a') {
    return 'irA'
  }
  if (key === 'fr_t') {
    return 'frT'
  }
  return key
}

const toNumber = (value: number | string | undefined, fallback = 0) => {
  if (value === undefined) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeTileInfo = (
  info: DataMapBackendTileInfo,
): MapTileInfo & { last_stroke?: number } => {
  const normalized: MapTileInfo & { last_stroke?: number } = {
    year: info.year,
    month: info.month,
    day: info.day,
    hour: info.hour,
    minute: info.minute,
  }
  if (info.last_stroke !== undefined) {
    normalized.last_stroke = toNumber(info.last_stroke)
  }
  return normalized
}

const normalizeAnimFrame = (frame: DataMapBackendAnimFrame) => {
  return {
    ...normalizeTileInfo(frame),
    ...(frame.k ? { k: frame.k } : {}),
  }
}

const normalizeIcMapConfig = (
  responseData: GetDataMapDataResponse['responseData'],
): IcMapConfigApiResponse => {
  const ltilesEntries = Object.entries(responseData.ltiles).map(([key, tile]) => {
    const originalKey = key as keyof DataMapConfigResponseData['ltiles']
    const normalizedKey = normalizeLegacyLayerKey(originalKey)
    return [
      normalizedKey,
      {
        info: normalizeTileInfo(tile.info),
        key: tile.key ?? false,
      },
    ] as const
  })

  const lanimEntries = Object.entries(responseData.lanim).map(([key, frames]) => {
    const normalizedKey = normalizeLegacyLayerKey(key)
    return [normalizedKey, frames.map(normalizeAnimFrame)] as const
  })

  return {
    isNightTime: responseData.is_night_time,
    ltiles: Object.fromEntries(ltilesEntries),
    lanim: Object.fromEntries(lanimEntries),
  }
}

export const getDataMapConfig = async () => {
  const response = await get<GetDataMapDataResponse['responseData']>({
    provider: 'nestjs-v2',
    url: '/homepage-map-data',
    options: {},
  })
  return normalizeIcMapConfig(response)
}

export const getDataMapToken = async () => {
  const response = await get<GetDataMapTokenResponse['responseData']>({
    provider: 'nestjs-v2',
    url: '/homepage-map-token',
    options: {},
  })
  return response
}

export const getDataMapDefaultConf = async (): Promise<DefaultMapConf> => {
  await wait(50)

  //var DEFAULT_CONF = {"base":"meteoalerte","overlays":["SAT_AUTO","radaric"]};
  return {
    base: 'meteoalerte',
    overlays: ['SAT_AUTO', 'radaric'],
  }
}

export const getDataMapLieuxPrefs = async (): Promise<LieuPref[]> => {
  await wait(50)
  return [
    { lat: 48.8566, lon: 2.3522, lieu: 'Paris' },
    { lat: 43.2965, lon: 5.3698, lieu: 'Marseille' },
  ]
}

// ── Observation markers API (mobile-api) ─────────────────

export const getObservationMarkers = async (
  params: {
    north: number
    south: number
    east: number
    west: number
    zoom: number
    year: string
    month: string
    day: string
    hour: string
    token: string
    webcams?: boolean
  },
  signal?: AbortSignal,
): Promise<ObservationMarkerData[]> => {
  const response = await get<ObservationsApiResponse>({
    provider: 'nestjs-v2',
    url: '/carte-observations',
    options: {
      params: {
        north: params.north,
        south: params.south,
        east: params.east,
        west: params.west,
        z: params.zoom,
        year: params.year,
        month: params.month,
        day: params.day,
        hour: params.hour,
        unique_token: params.token,
        webcams: params.webcams ? 1 : 0,
        intelligent_cluster: 1,
        shadow: 1,
      },
      signal,
    },
  })
  return response.DATA
}

const mobileApi = axios.create({
  baseURL: 'https://mobile-api.infoclimat.fr/v1.0/internal/-/get',
})

export const getObservationDetail = async (
  params: {
    id: string
    token: string
  },
  signal?: AbortSignal,
): Promise<Record<string, unknown>> => {
  const { data } = await mobileApi.get<ObservationDetailApiResponse>('/observation', {
    params: {
      thumb_width: 200,
      thumb_height: 100,
      id: params.id,
      unique_token: params.token,
    },
    signal,
  })
  return data.DATA
}
