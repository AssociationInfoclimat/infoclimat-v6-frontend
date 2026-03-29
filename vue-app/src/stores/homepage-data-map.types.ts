export type BaseLayerParam =
  | 'meteoalerte' // Précipitations avec nuages
  | 'radaric' // Précipitations
  | 'colorac60radaric' // Précipitations accumulations sur 1h
  | 'ac3hradaric' // Précipitations accumulations sur 3h
  | 'ac6hradaric' // Précipitations accumulations sur 6h
  | 'ac12hradaric' // Précipitations accumulations sur 12h
  | 'ac24hradaric' // Précipitations accumulations sur 24h
  | 'ac72hradaric' // Précipitations accumulations sur 72h
  | 'ac24hradaricval' // Précipitations accumulations sur 24h (valeurs) - ADMIN ONLY
  | 'ac72hradaricval' // Précipitations accumulations sur 72h (valeurs) - ADMIN ONLY
  | 'foudre' // Foudre (Blitzortung)
  | 'vis' // Satellite (désormais -> 'vishdbtrans' ci-dessous)
  | 'vishdbtrans' // Satellite (anciennement 'vis')
  | 'himawarirgb' // Himawari 8 RGB - ADMIN ONLY
  | 'temperature' // Température
  | 'pression' // Pression
  | 'webcams' // Webcams
  | 'photolive' // Photolive

export type BaseLayerParamWithNightLayerParam =
  | BaseLayerParam
  | 'irA' // Satellite IR
  | 'irAhdbtrans' // Satellite IR (après la nuit)

export const AVAILABLE_BASE_LAYER_PARAMS = [
  'meteoalerte',
  'radaric',
  'colorac60radaric',
  'ac3hradaric',
  'ac6hradaric',
  'ac12hradaric',
  'ac24hradaric',
  'ac72hradaric',
  'ac24hradaricval',
  'ac72hradaricval',
  'foudre',
  'vis',
  'vishdbtrans',
  'himawarirgb',
  'temperature',
  'pression',
  'webcams',
  'photolive',
  'irA',
  'irAhdbtrans',
] as const satisfies readonly BaseLayerParamWithNightLayerParam[]

export type OverlayParam =
  | 'cities' // Villes (OpenStreetMap)
  | 'radaric' // Précipitations
  | 'colorac60radaric' // Précipitations accumulations sur 1h
  | 'ac3hradaric' // Précipitations accumulations sur 3h
  | 'ac24hradaricval' // Précipitations accumulations sur 24h (valeurs) - ADMIN ONLY
  | 'ac72hradaricval' // Précipitations accumulations sur 72h (valeurs) - ADMIN ONLY
  | 'foudre' // Foudre (Blitzortung)
  | 'foudre-live' // Foudre LIVE
  | 'irAhdbtrans' // Satellite IR (après la nuit)  (nuages la nuit)
  | 'vishdbtrans' // Satellite VIS (journee)
  | 'MCanalysis' // Pression isobares
  | 'frT' // Pression fronts

export type OverlayParamWithAutoSat = OverlayParam | 'SAT_AUTO' // Satellite automatique (dépend si nuit ou jour)
