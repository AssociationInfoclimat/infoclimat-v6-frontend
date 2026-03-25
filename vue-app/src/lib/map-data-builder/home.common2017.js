const GeoJSON_prop_to_style = {
  '50thunder': {
    color: `#FFFF00`,
    weight: 3,
    fill: false,
  },
  '15thunder': {
    color: `#FFFF00`,
    weight: 1,
    fill: false,
  },
  'level 1': {
    color: `#FF9900`,
    weight: 2,
    fill: false,
  },
  'level 2': {
    color: `#FF0000`,
    weight: 2,
    fill: false,
  },
  'level 3': {
    color: `#FF00FF`,
    weight: 2,
    fill: false,
  },
}

const DESC = {
  radaric: `Radar`,
  foudre: `Foudre`,
  'foudre-live': `Foudre LIVE`,
  clouds: `Satellite`,
  MCanalysis: `Isobares`,
  vigilance: `Vigilance`,
  vis: `Satellite VIS`,
  irA: `Satellite IR`,
  frT: `Fronts`,
  estofex: `Estofex`,
  colorac60radaric: `Accumulation sur 1h`,
  ac3hradaric: `Accumulation sur 3h`,
  ac6hradaric: `Accumulation sur 6h`,
  ac24hradaric: `Accumulation sur 24h`,
  ac72hradaric: `Accumulation sur 72h`,
  ac24hradaricval: `Accumulation sur 24h (valeurs)`,
  ac72hradaricval: `Accumulation sur 72h (valeurs)`,
  villes: `Villes (OpenStreetMap)`,
  cities: `Villes (OpenStreetMap)`,
  vishdbtrans: `Satellite VIS`,
  vishdb: `Satellite VIS`,
  irAhdbtrans: `Satellite IR`,
  irAhdb: `Satellite IR`,
}

const KEY = `6GB5rCxV7DZaV8mHdLcyhw`
const urlTemplate = `//{s}.tempsreel.infoclimat.net/directTiles/m:{mkey}/{pkey}/{py}/{pm}/{pd}/{ph}/v:{pi}.png?key=${KEY}`
const urlTemplateLayers = `//{s}.tempsreel.infoclimat.net/directTiles/m:{mkey}:{pl}/{pkey}/{py}/{pm}/{pd}/{ph}/v:{pi}.png?key=${KEY}`
const urlTemplateSatellite = `//{s}.tempsreel.infoclimat.net/secure/m:{mkey}/{pkey}/{py}/{pm}/{pd}/{ph}/v:{pi}/{z}/{x}/{y}?md5={k}`
const urlTemplateMapbox = `//{s}.tempsreel.infoclimat.net/t-mapbox/{mkey}/{z}/{x}/{y}`

const PARAMS_USING_URL_TEMPLATE_LAYERS = [
  `temperature`,
  `pression`,
  `ac24hradaricval`,
  `ac72hradaricval`,
  `foudre`,
  `MCanalysis`,
  `vigilance`,
  `vishdbtrans`,
  `vishdb`,
  `irAhdb`,
  `irAhdbtrans`,
  `clouds`,
  `radaric`,
  `nexrad`,
  `colorac60radaric`,
  `ac3hradaric`,
  `ac6hradaric`,
  `ac12hradaric`,
  `ac24hradaric`,
  `ac72hradaric`,
]

const PARAMS_USING_URL_TEMPLATE_SATELLITE = [`vis`, `irA`, `frT`]

function getTemplate(/** @type {string} */ param) {
  if (param == `hillshade`) {
    return urlTemplateMapbox.replace(`{mkey}`, `hillshade`)
  }
  if (param == `cities`) {
    //return `http://{s}.modeles.infoclimat.net/t-cache/hyb/{z}/{x}/{y}`;
    //return `//{s}.tempsreel.infoclimat.net/t-osm/ovl/{z}/{x}/{y}`;
    // return `http://{s}.www.toolserver.org/tiles/osm-labels-fr/{z}/{x}/{y}.png`;
    return `https://{s}.tempsreel.infoclimat.net/t-mapbox/ovl/{z}/{x}/{y}`
  }
  if (param == `meteoalerteli`) {
    return `//{s}.tempsreel.infoclimat.net/secureHD/m:meteoalerteli/{z}/{x}/{y}.jpeg`
  }
  if (param == `sat`) {
    return `//{s}.tempsreel.infoclimat.net/secureHD/m:sat/{z}/{x}/{y}.jpeg`
  }
  if (param == `coastlines`) {
    return `//{s}.tempsreel.infoclimat.net/secureHD/m:coastlines/{z}/{x}/{y}.png`
  }
  if (PARAMS_USING_URL_TEMPLATE_SATELLITE.includes(param)) {
    return urlTemplateSatellite.replace(`{mkey}`, getMapFileName(param))
  }
  if (PARAMS_USING_URL_TEMPLATE_LAYERS.includes(param)) {
    return urlTemplateLayers
      .replace(`{mkey}`, getMapFileName(param))
      .replace(`{pl}`, getLayers(param))
  }
  param = `temperature`
  return urlTemplateLayers.replace(`{mkey}`, param).replace(`{pl}`, getLayers(param))
}

// prettier-ignore
const PARAM_TO_GEOWEBCACHE_NAME_MAP = new Map([
    [`temperature`,      `temperatureHDnoSST`],
    [`pression`,         `temperatureHD`],
    [`vis`,              `sat`],
    [`irA`,              `sat`],
    [`frT`,              `sat`],
    [`vishdbtrans`,      `cloudsauto`],
    [`vishdb`,           `cloudsauto`],
    [`irAhdb`,           `cloudsauto`],
    [`irAhdbtrans`,      `cloudsauto`],
    [`clouds`,           `clouds`],
    [`radaric`,          `clouds`],
    [`nexrad`,           `clouds`],
    [`colorac60radaric`, `clouds`],
    [`ac3hradaric`,      `clouds`],
    [`ac6hradaric`,      `clouds`],
    [`ac12hradaric`,     `clouds`],
    [`ac24hradaric`,     `clouds`],
    [`ac72hradaric`,     `clouds`],
    [`ac24hradaricval`,  `values4326`],
    [`ac72hradaricval`,  `values4326`],
    [`MCanalysis`,       `iso`],
]);

function translateParamFromJSToGeoWebCache(/** @type {string} */ param) {
  return PARAM_TO_GEOWEBCACHE_NAME_MAP.get(param) ?? param
}

/**
 * These values come from `geowebcache.xml`
 */
// prettier-ignore
const GEOWEBCACHE_PARAM_TO_LAYER_MAP = new Map([
    [`meteoalerte`,              `temperatures,relief,landsea,countries,departements`],
    [`meteoalerteli`,            `temperatures,relief,landsea,countries,departements`],
    [`osmoverlay`,               `default`],
    [`temperature`,              `temperatures,relief,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements`],
    [`values4326`,               `contourd`],
    [`MDLraster`,                `temperaturesb,temperatures,relief`],
    [`MDLrasteroverlay`,         `temperaturesb,temperatures`],
    [`MDLvector`,                `contourc,contourb`],
    [`MDLvectorvalues`,          `contourd,contourc,contourb`],
    [`MDLvertvector`,            `contourd,contourc,contourb`],
    [`MDLvalues`,                `contourd,contourc,contourb`],
    [`MDLiso`,                   `contourd,contourc,contourb`],
    [`MDLisob`,                  `contourd,contourc,contourb`],
    [`MDLisoc`,                  `contourd,contourc,contourb`],
    [`MDLisod`,                  `contourd,contourc,contourb`],
    [`temperature`,              `temperatures,relief,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements`],
    [`temperatureHDnoSST`,       `temperatures,temperaturesHD,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements`],
    [`temperatureHD`,            `temperatures,temperaturesHD,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements`],
    [`clouds`,                   `clouds`],
    [`cloudsauto`,               `clouds`],
    [`iso`,                      `contourb`],
    [`sat`,                      `temperatures,relief,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements`],
    [`foudre`,                   `foudre`],
    [`coastlines`,               `landsea,countries,rivers1,rivers2,rivers3,riversfr,departements`],
    [`singleMDLraster`,          `temperaturesc,relief`],
    [`singleMDLrasteroverlay`,   `temperaturesc`],
    [`singleMDLvector`,          `contourd`],
    [`singleMDLvectorvalues`,    `contourd`],
    [`singleMDLvertvector`,      `contourd`],
    [`singleMDLvalues`,          `contourd`],
    [`singleMDLiso`,             `contourd`],
    [`singleMDLisob`,            `contourd`],
    [`singleMDLisoc`,            `contourd`],
    [`singleMDLisod`,            `contourd`],
    [`singleMDLisob_restricted`, `contourd`],
]);

function getLayers(/** @type {string} */ param) {
  const layers = GEOWEBCACHE_PARAM_TO_LAYER_MAP.get(translateParamFromJSToGeoWebCache(param))
  if (!layers) {
    console.error(`This param '${param}' is not known.`)
    return `temperatures,temperaturesHD,relief,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements`
  }
  return layers
}

/**
 * These values come from `geowebcache.xml`
 */
// prettier-ignore
const GEOWEBCACHE_PARAM_TO_MAP_FILE_NAME_MAP = new Map([
    [`meteoalerte`,              `relief_MA`],
    [`meteoalerteli`,            `relief_MA_new`],
    [`osmoverlay`,               `osm-google-transparent8`],
    [`temperature`,              `temperature`],
    [`values4326`,               `values_4326`],
    [`MDLraster`,                `MDLraster`],
    [`MDLrasteroverlay`,         `MDLrasteroverlay`],
    [`MDLvector`,                `MDLvector`],
    [`MDLvectorvalues`,          `MDLvectorvalues`],
    [`MDLvertvector`,            `MDLvertvector`],
    [`MDLvalues`,                `MDLvalues`],
    [`MDLiso`,                   `MDLiso`],
    [`MDLisob`,                  `MDLisob`],
    [`MDLisoc`,                  `MDLisoc`],
    [`MDLisod`,                  `MDLisod`],
    [`temperature`,              `temperature`],
    [`temperatureHDnoSST`,       `temperature_HD_nosst`],
    [`temperatureHD`,            `temperature_HD`],
    [`clouds`,                   `clouds`],
    [`cloudsauto`,               `cloudsauto`],
    [`iso`,                      `iso`],
    [`sat`,                      `bluemarble`],
    [`foudre`,                   `foudre`],
    [`coastlines`,               `coastlines`],
    [`singleMDLraster`,          `singleMDLraster`],
    [`singleMDLrasteroverlay`,   `singleMDLrasteroverlay`],
    [`singleMDLvector`,          `singleMDLvector`],
    [`singleMDLvectorvalues`,    `singleMDLvectorvalues`],
    [`singleMDLvertvector`,      `singleMDLvertvector`],
    [`singleMDLvalues`,          `singleMDLvalues`],
    [`singleMDLiso`,             `singleMDLiso`],
    [`singleMDLisob`,            `singleMDLisob`],
    [`singleMDLisoc`,            `singleMDLisoc`],
    [`singleMDLisod`,            `singleMDLisod`],
    [`singleMDLisob_restricted`, `singleMDLisob_restricted`],
]);

function getMapFileName(/** @type {string} */ param) {
  if ([`vis`, `irA`, `frT`].includes(param)) {
    return `satMO`
  }
  const name = GEOWEBCACHE_PARAM_TO_MAP_FILE_NAME_MAP.get(translateParamFromJSToGeoWebCache(param))
  if (!name) {
    throw new Error(`This param '${param}' is not known.`)
  }
  return name
}
