import type { MapTileInfo } from '@/client/data-map.api.types'
import type { GeoJsonFeatureStyle } from './types'

const TILE_KEY = import.meta.env.VITE_TILE_KEY ?? ''

const URL_TEMPLATE_LAYERS = `//{s}.tempsreel.infoclimat.net/directTiles/m:{mkey}:{pl}/{pkey}/{py}/{pm}/{pd}/{ph}/v:{pi}.png?key=${TILE_KEY}`
const URL_TEMPLATE_SATELLITE = `//{s}.tempsreel.infoclimat.net/secure/m:{mkey}/{pkey}/{py}/{pm}/{pd}/{ph}/v:{pi}/{z}/{x}/{y}?md5={k}`
const URL_TEMPLATE_MAPBOX = `//{s}.tempsreel.infoclimat.net/t-mapbox/{mkey}/{z}/{x}/{y}`

// ── WMS defaults ──────────────────────────────────────────────

export const DEFAULT_WMS_PARAMS = {
  service: 'WMS',
  version: '1.3.0',
  request: 'GetMap',
  format: 'image/png',
  transparent: true,
  width: 256,
  height: 256,
  tiled: true,
} as const

// ── Layer descriptions ────────────────────────────────────────

export const LAYER_DESCRIPTIONS: Record<string, string> = {
  radaric: 'Radar',
  foudre: 'Foudre',
  'foudre-live': 'Foudre LIVE',
  clouds: 'Satellite',
  mCanalysis: 'Isobares',
  MCanalysis: 'Isobares',
  vigilance: 'Vigilance',
  vis: 'Satellite VIS',
  irA: 'Satellite IR',
  frT: 'Fronts',
  estofex: 'Estofex',
  colorac60radaric: 'Accumulation sur 1h',
  ac3hradaric: 'Accumulation sur 3h',
  ac6hradaric: 'Accumulation sur 6h',
  ac24hradaric: 'Accumulation sur 24h',
  ac72hradaric: 'Accumulation sur 72h',
  ac24hradaricval: 'Accumulation sur 24h (valeurs)',
  ac72hradaricval: 'Accumulation sur 72h (valeurs)',
  villes: 'Villes (OpenStreetMap)',
  cities: 'Villes (OpenStreetMap)',
  vishdbtrans: 'Satellite VIS',
  vishdb: 'Satellite VIS',
  irAhdbtrans: 'Satellite IR',
  irAhdb: 'Satellite IR',
}

// ── GeoJSON styles (estofex) ──────────────────────────────────

export const GEOJSON_PROP_TO_STYLE: Record<string, GeoJsonFeatureStyle> = {
  '50thunder': { color: '#FFFF00', weight: 3, fill: false },
  '15thunder': { color: '#FFFF00', weight: 1, fill: false },
  'level 1': { color: '#FF9900', weight: 2, fill: false },
  'level 2': { color: '#FF0000', weight: 2, fill: false },
  'level 3': { color: '#FF00FF', weight: 2, fill: false },
}

// ── Param sets by URL template type ───────────────────────────

const SATELLITE_PARAMS = new Set(['vis', 'irA', 'frT'])

const LAYER_PARAMS = new Set([
  'temperature',
  'pression',
  'ac24hradaricval',
  'ac72hradaricval',
  'foudre',
  'MCanalysis',
  'mCanalysis',
  'vigilance',
  'vishdbtrans',
  'vishdb',
  'irAhdb',
  'irAhdbtrans',
  'clouds',
  'radaric',
  'nexrad',
  'colorac60radaric',
  'ac3hradaric',
  'ac6hradaric',
  'ac12hradaric',
  'ac24hradaric',
  'ac72hradaric',
])

// ── Param → GeoWebCache name ─────────────────────────────────

// prettier-ignore
const PARAM_TO_GEOCACHE: ReadonlyMap<string, string> = new Map([
  ['temperature',      'temperatureHDnoSST'],
  ['pression',         'temperatureHD'],
  ['vis',              'sat'],
  ['irA',              'sat'],
  ['frT',              'sat'],
  ['vishdbtrans',      'cloudsauto'],
  ['vishdb',           'cloudsauto'],
  ['irAhdb',           'cloudsauto'],
  ['irAhdbtrans',      'cloudsauto'],
  ['clouds',           'clouds'],
  ['radaric',          'clouds'],
  ['nexrad',           'clouds'],
  ['colorac60radaric', 'clouds'],
  ['ac3hradaric',      'clouds'],
  ['ac6hradaric',      'clouds'],
  ['ac12hradaric',     'clouds'],
  ['ac24hradaric',     'clouds'],
  ['ac72hradaric',     'clouds'],
  ['ac24hradaricval',  'values4326'],
  ['ac72hradaricval',  'values4326'],
  ['MCanalysis',       'iso'],
  ['mCanalysis',       'iso'],
])

function toGeoCacheName(param: string): string {
  return PARAM_TO_GEOCACHE.get(param) ?? param
}

// ── GeoWebCache name → layer list ─────────────────────────────

// prettier-ignore
const GEOCACHE_TO_LAYERS: ReadonlyMap<string, string> = new Map([
  ['meteoalerte',        'temperatures,relief,landsea,countries,departements'],
  ['meteoalerteli',      'temperatures,relief,landsea,countries,departements'],
  ['osmoverlay',         'default'],
  ['temperature',        'temperatures,relief,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements'],
  ['values4326',         'contourd'],
  ['MDLraster',          'temperaturesb,temperatures,relief'],
  ['MDLrasteroverlay',   'temperaturesb,temperatures'],
  ['MDLvector',          'contourc,contourb'],
  ['MDLvectorvalues',    'contourd,contourc,contourb'],
  ['MDLvertvector',      'contourd,contourc,contourb'],
  ['MDLvalues',          'contourd,contourc,contourb'],
  ['MDLiso',             'contourd,contourc,contourb'],
  ['MDLisob',            'contourd,contourc,contourb'],
  ['MDLisoc',            'contourd,contourc,contourb'],
  ['MDLisod',            'contourd,contourc,contourb'],
  ['temperatureHDnoSST', 'temperatures,temperaturesHD,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements'],
  ['temperatureHD',      'temperatures,temperaturesHD,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements'],
  ['clouds',             'clouds'],
  ['cloudsauto',         'clouds'],
  ['iso',                'contourb'],
  ['sat',                'temperatures,relief,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements'],
  ['foudre',             'foudre'],
  ['coastlines',         'landsea,countries,rivers1,rivers2,rivers3,riversfr,departements'],
  ['singleMDLraster',          'temperaturesc,relief'],
  ['singleMDLrasteroverlay',   'temperaturesc'],
  ['singleMDLvector',          'contourd'],
  ['singleMDLvectorvalues',    'contourd'],
  ['singleMDLvertvector',      'contourd'],
  ['singleMDLvalues',          'contourd'],
  ['singleMDLiso',             'contourd'],
  ['singleMDLisob',            'contourd'],
  ['singleMDLisoc',            'contourd'],
  ['singleMDLisod',            'contourd'],
  ['singleMDLisob_restricted', 'contourd'],
])

const DEFAULT_LAYERS =
  'temperatures,temperaturesHD,relief,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements'

// ── GeoWebCache name → map file name ──────────────────────────

// prettier-ignore
const GEOCACHE_TO_MAP_FILE: ReadonlyMap<string, string> = new Map([
  ['meteoalerte',        'relief_MA'],
  ['meteoalerteli',      'relief_MA_new'],
  ['osmoverlay',         'osm-google-transparent8'],
  ['temperature',        'temperature'],
  ['values4326',         'values_4326'],
  ['MDLraster',          'MDLraster'],
  ['MDLrasteroverlay',   'MDLrasteroverlay'],
  ['MDLvector',          'MDLvector'],
  ['MDLvectorvalues',    'MDLvectorvalues'],
  ['MDLvertvector',      'MDLvertvector'],
  ['MDLvalues',          'MDLvalues'],
  ['MDLiso',             'MDLiso'],
  ['MDLisob',            'MDLisob'],
  ['MDLisoc',            'MDLisoc'],
  ['MDLisod',            'MDLisod'],
  ['temperatureHDnoSST', 'temperature_HD_nosst'],
  ['temperatureHD',      'temperature_HD'],
  ['clouds',             'clouds'],
  ['cloudsauto',         'cloudsauto'],
  ['iso',                'iso'],
  ['sat',                'bluemarble'],
  ['foudre',             'foudre'],
  ['coastlines',         'coastlines'],
  ['singleMDLraster',          'singleMDLraster'],
  ['singleMDLrasteroverlay',   'singleMDLrasteroverlay'],
  ['singleMDLvector',          'singleMDLvector'],
  ['singleMDLvectorvalues',    'singleMDLvectorvalues'],
  ['singleMDLvertvector',      'singleMDLvertvector'],
  ['singleMDLvalues',          'singleMDLvalues'],
  ['singleMDLiso',             'singleMDLiso'],
  ['singleMDLisob',            'singleMDLisob'],
  ['singleMDLisoc',            'singleMDLisoc'],
  ['singleMDLisod',            'singleMDLisod'],
  ['singleMDLisob_restricted', 'singleMDLisob_restricted'],
])

// ── Nexrad bounds ─────────────────────────────────────────────

export const NEXRAD_BOUNDS: [lngWest: number, lngEast: number, latSouth: number, latNorth: number] =
  [-127, -60, 20, 55]

// ── Overlays that require coastlines ──────────────────────────

export const NEEDS_COASTLINES_SET = new Set([
  'vis',
  'irA',
  'radaric',
  'vishdbtrans',
  'irAhdbtrans',
])

// ── Public helpers ────────────────────────────────────────────

export function getLayersString(param: string): string {
  const name = toGeoCacheName(param)
  return GEOCACHE_TO_LAYERS.get(name) ?? DEFAULT_LAYERS
}

function getMapFileName(param: string): string {
  if (SATELLITE_PARAMS.has(param)) return 'satMO'
  const name = toGeoCacheName(param)
  const file = GEOCACHE_TO_MAP_FILE.get(name)
  if (!file) {
    console.error(`Unknown map file for param "${param}", falling back to temperature`)
    return 'temperature_HD_nosst'
  }
  return file
}

export function getUrlTemplate(param: string): string {
  if (param === 'hillshade') {
    return URL_TEMPLATE_MAPBOX.replace('{mkey}', 'hillshade')
  }
  if (param === 'cities') {
    return 'https://{s}.tempsreel.infoclimat.net/t-mapbox/ovl/{z}/{x}/{y}'
  }
  if (param === 'meteoalerteli') {
    return '//{s}.tempsreel.infoclimat.net/secureHD/m:meteoalerteli/{z}/{x}/{y}.jpeg'
  }
  if (param === 'sat') {
    return '//{s}.tempsreel.infoclimat.net/secureHD/m:sat/{z}/{x}/{y}.jpeg'
  }
  if (param === 'coastlines') {
    return '//{s}.tempsreel.infoclimat.net/secureHD/m:coastlines/{z}/{x}/{y}.png'
  }

  if (SATELLITE_PARAMS.has(param)) {
    return URL_TEMPLATE_SATELLITE.replace('{mkey}', getMapFileName(param))
  }

  if (LAYER_PARAMS.has(param)) {
    return URL_TEMPLATE_LAYERS.replace('{mkey}', getMapFileName(param)).replace(
      '{pl}',
      getLayersString(param),
    )
  }

  return URL_TEMPLATE_LAYERS.replace('{mkey}', getMapFileName('temperature')).replace(
    '{pl}',
    getLayersString('temperature'),
  )
}

export function buildTileUrl(
  template: string,
  param: string,
  info?: MapTileInfo & { last_stroke?: number },
  key?: string | false,
): string {
  return template
    .replace('{pkey}', param)
    .replace('{py}', info?.year ?? '')
    .replace('{pm}', info?.month ?? '')
    .replace('{pd}', info?.day ?? '')
    .replace('{ph}', info?.hour ?? '')
    .replace('{pi}', info?.minute ?? '')
    .replace('{k}', typeof key === 'string' ? key : '')
}
