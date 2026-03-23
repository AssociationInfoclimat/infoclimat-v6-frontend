import { get } from './common.api'
import type {
  DataMapBackendAnimFrame,
  DataMapBackendTileConfig,
  DataMapBackendTileInfo,
  DataMapConfigResponseData,
  DefaultMapConf,
  GetDataMapTokenResponse,
  IcMapConfig,
  LieuPref,
  MapTileInfo,
} from './data-map.api.types'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// const getBaseTileInfo = (): MapTileInfo => {
//   const now = new Date()
//   return {
//     year: now.getUTCFullYear(),
//     month: now.getUTCMonth() + 1,
//     day: now.getUTCDate(),
//     hour: now.getUTCHours(),
//     minute: now.getUTCMinutes(),
//   }
// }
//
// const mkTile = (
//   baseInfo: MapTileInfo,
//   key: IcMapConfig['ltiles'][string]['key'] = 'mock-key',
// ): IcMapConfig['ltiles'][string] => ({
//   info: { ...baseInfo },
//   key,
// })
//
// const buildMockIcMapConfig = (): IcMapConfig => {
//   const baseInfo = getBaseTileInfo()
//   return {
//     isNightTime: false,
//     ltiles: {
//       meteoalerte: mkTile(baseInfo),
//       radaric: mkTile(baseInfo),
//       nexrad: mkTile(baseInfo),
//       foudre: {
//         info: {
//           ...baseInfo,
//           last_stroke: 0,
//         },
//         key: 'mock-key',
//       },
//       clouds: mkTile(baseInfo),
//       MCanalysis: mkTile(baseInfo),
//       frT: mkTile(baseInfo),
//       estofex: mkTile(baseInfo),
//       vis: mkTile(baseInfo),
//       irA: mkTile(baseInfo),
//       vishdbtrans: mkTile(baseInfo),
//       irAhdbtrans: mkTile(baseInfo),
//       cities: mkTile(baseInfo),
//     },
//     lanim: {},
//   }
// }

const normalizeLegacyLayerKey = (
  key: keyof DataMapConfigResponseData['ltiles'],
): keyof IcMapConfig['ltiles'] => {
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
  responseData: GetDataMapTokenResponse['responseData'],
): IcMapConfig => {
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
  const response = await get<GetDataMapTokenResponse['responseData']>({
    provider: 'nestjs-v2',
    url: '/homepage-map-data',
    options: {},
  })
  return normalizeIcMapConfig(response)
}

export const getDataMapToken = async () => {
  return '<TEST_TOKEN_HERE>'
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
