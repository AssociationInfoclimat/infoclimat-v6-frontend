const DEFAULT_WMS_PARAMS = {
  service: `WMS`,
  version: `1.3.0`,
  request: `GetMap`,
  format: `image/png`,
  transparent: true,
  width: 256,
  height: 256,
  tiled: true,
}

/** @type {string|null} */
let _currentparam = null
const _currentpjson = false
/** @type {L.TileLayer} */
let parameterLayer
/** @type {string} */
let _template
const _maplimits = {
  temperature: [-180, 180, -90, 90],
  meteoalerte: [-180, 180, -90, 90],
  radaric: [-15, 15, 40, 55],
  foudre: [-180, 180, -90, 90],
  pression: [-180, 180, -90, 90],
  clouds: [-80, 80, 0, 90],
  nexrad: [-127, -60, 20, 55],
}
let _overlays = {}
let _noverlays = 0

const backgroundLayer = L.tileLayer(getTemplate(`meteoalerteli`), {
  maxZoom: 11,
  minZoom: 1,
  useCache: true,
})

const bgsat_layer = L.tileLayer(getTemplate(`sat`), {
  ...DEFAULT_WMS_PARAMS,
  layers: getLayers(`sat`),
  maxZoom: 11,
  minZoom: 1,
  useCache: true,
})

const osm_layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  ...DEFAULT_WMS_PARAMS,
  maxZoom: 20,
  minZoom: 1,
  useCache: true,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})

const coastlines_overlay = L.tileLayer(getTemplate(`coastlines`), {
  ...DEFAULT_WMS_PARAMS,
  layers: getLayers(`coastlines`),
  maxZoom: 11,
  minZoom: 1,
  useCache: true,
  opacity: 0.6,
})

console.log(ICMAPconfig, 'ICMAPconfig')

ICMAPconfig.ltiles[`cities`] = ICMAPconfig.ltiles[`meteoalerte`]

let _currentMapBounds = [map.getBounds().getSouthWest(), map.getBounds().getNorthEast()]

let strokeLayer = null

function updateDateTime(/** @type {Config} */ config, /** @type {boolean} */ display_minutes) {
  const d = new Date()
  d.setUTCFullYear(config.year)
  d.setUTCMonth(config.month - 1)
  d.setUTCDate(config.day)
  d.setUTCHours(config.hour)

  if (display_minutes === true) {
    d.setUTCMinutes(config.minute)
  } else {
    d.setUTCMinutes(0)
  }

  /** @type {string|number} */
  let tz = (-1 * d.getTimezoneOffset()) / 60
  if (tz > 0) {
    tz = `+${tz}`
  } else if (tz == 0) {
    tz = ``
  }

  let min = d.getMinutes().toString().padStart(2, `0`)

  return true
}

function getDateTime(/** @type {Config} */ config, /** @type {boolean} */ display_minutes) {
  const d = new Date()
  d.setUTCFullYear(config.year)
  d.setUTCMonth(config.month - 1)
  d.setUTCDate(config.day)
  d.setUTCHours(parseInt(config.hour.toString(), 10))

  if (display_minutes === true) {
    d.setUTCMinutes(config.minute)
  } else {
    d.setUTCMinutes(0)
  }

  /** @type {string|number} */
  let tz = (-1 * d.getTimezoneOffset()) / 60
  if (tz > 0) {
    tz = `+${tz}`
  } else if (tz == 0) {
    tz = ``
  }

  const min = d.getMinutes().toString().padStart(2, `0`)

  return `${d.getHours()}:${min}`
}

function getICBounds(/** @type {number[]} */ [lngWest, lngEast, latSouth, latNorth]) {
  return L.latLngBounds({ lng: lngWest, lat: latSouth }, { lng: lngEast, lat: latNorth })
}

let iteration

let cTimeout = null
function updateParamFromMap(param, force_update, is_default) {
  if (ICMAPconfig.isNightTime && param == `vis`) {
    param = `irA`
  }
  if (ICMAPconfig.isNightTime && param == `vishdbtrans`) {
    param = `irAhdbtrans`
  }

  if (cTimeout) {
    clearTimeout(cTimeout)
    iteration = 0

    _currentparam = null // maybe a better way?
  }

  if (param === _currentparam && force_update !== true) {
    return false
  }

  // clearing current layers
  layerGroup.clearLayers()
  map.removeLayer(layerGroup)
  map.removeLayer(photoliveGroup)
  bgsat_layer.setOpacity(1)
  map.gestureHandling.enable()
  map.setMaxZoom(11)

  // clearing overlays
  _noverlays = 0

  Object.keys(_overlays).forEach((k) => {
    if (k !== `cities`) {
      const v = _overlays[k]
      overlayGroup.removeLayer(v)
      delete _overlays[k]
    }
  })

  if (_init_zoom) {
    map.setZoom(_init_zoom)
  }

  _currentparam = param
  if (param === `meteoalerte`) {
    if (!map.hasLayer(backgroundLayer)) {
      layerGroup.addLayer(backgroundLayer)
      layerGroup.addTo(map)
    }

    _displayMarkers = true

    overlayGroup.addLayer(coastlines_overlay)

    updateDateTime(ICMAPconfig.ltiles[`meteoalerte`].info, true)
  } else {
    _template = getTemplate(param)

    if (!ICMAPconfig.ltiles[param]) {
      alert(`Une erreur est survenue.`)
      return false
    }

    const i = ICMAPconfig.ltiles[param].info
    const u = _template
      .replace(`{pkey}`, param)
      .replace(`{py}`, i.year)
      .replace(`{pm}`, i.month)
      .replace(`{pd}`, i.day)
      .replace(`{ph}`, i.hour)
      .replace(`{pi}`, i.minute)
      .replace(`{k}`, ICMAPconfig.ltiles[param].key)
    updateDateTime(i)

    parameterLayer = L.WMS.tileLayer(u, {
      ...DEFAULT_WMS_PARAMS,
      layers: getLayers(param),
      maxZoom: 11,
      minZoom: 1,
    })
    layerGroup.addLayer(parameterLayer)
    layerGroup.addTo(map)

    _displayMarkers = true
  }

  // Workaround for https://github.com/elmarquis/Leaflet.GestureHandling/issues/75
  map.whenReady(() => map.gestureHandling?._handleMouseOver?.())
  return false
}

let _hasFoudreLive = false
let _displayFoudreAnim = true
let _foudreIsOverlay = false
const _overlaysOpacity = {}
const JSONP_CALLBACK = function () {}

function overlayLayer(/** @type {string} */ param, /** @type {boolean} */ _isBaseLayer) {
  console.log('overlayLayer', param, _overlays)
  if (param in _overlays) {
    // hide layer
    overlayGroup.removeLayer(_overlays[param])
    delete _overlays[param]
    _noverlays--

    if (param == `vis` || param == `irA` || param == `radaric`) {
      overlayGroup.removeLayer(coastlines_overlay)
    }

    if (param == `radaric`) {
      overlayGroup.removeLayer(_overlays[`nexrad`])
    }

    return false
  }

  let i
  if (param == `frT` && `MCanalysis` in _overlays) {
    // on cache l'un des deux...
    overlayLayer(`MCanalysis`)
  } else if (param == `MCanalysis` && `frT` in _overlays) {
    overlayLayer(`frT`)
  }

  if (param !== `estofex`) {
    let ltileparam = param
    if (param == `ac24hradaricval`) {
      ltileparam = `ac24hradaric`
    }
    if (param == `ac72hradaricval`) {
      ltileparam = `ac72hradaric`
    }
    const _template = getTemplate(param)
    console.log('overlayLayer', param, _template)
    i = ICMAPconfig.ltiles[ltileparam].info
    let u = _template
      .replace(`{pkey}`, param)
      .replace(`{py}`, i.year)
      .replace(`{pm}`, i.month)
      .replace(`{pd}`, i.day)
      .replace(`{ph}`, i.hour)
      .replace(`{pi}`, i.minute)
      .replace(`{k}`, ICMAPconfig.ltiles[ltileparam].key)

    if (param == `vis` || param == `irA`) {
      u = u.replace(`:satMO/`, `:satMO2/`)
    }

    console.log('overlayLayer', param, u)

    const isParamUsingWMS = param !== `cities`
    let layer
    if (isParamUsingWMS) {
      layer = L.WMS.tileLayer(u, {
        ...DEFAULT_WMS_PARAMS,
        layers: getLayers(param),
        maxZoom: 11,
        minZoom: 1,
      })
    } else {
      layer = L.tileLayer(u, {
        maxZoom: 11,
        minZoom: 1,
      })
    }
    _overlays[param] = layer

    if (param == `radaric`) {
      const i2 = ICMAPconfig.ltiles[`nexrad`].info
      const u2 = getTemplate(`nexrad`)
        .replace(`{pkey}`, `nexrad`)
        .replace(`{py}`, i2.year)
        .replace(`{pm}`, i2.month)
        .replace(`{pd}`, i2.day)
        .replace(`{ph}`, i2.hour)
        .replace(`{pi}`, i2.minute)
        .replace(`{k}`, ICMAPconfig.ltiles[`nexrad`].key)
      _overlays[`nexrad`] = L.WMS.tileLayer(u2, {
        ...DEFAULT_WMS_PARAMS,
        layers: getLayers(`nexrad`),
        maxZoom: 11,
        minZoom: 1,
        bounds: getICBounds(_maplimits[`nexrad`]),
      })
      overlayGroup.addLayer(_overlays[`nexrad`])
    }

    overlayGroup.addLayer(_overlays[param])
    overlayGroup.addTo(map)

    if (_isBaseLayer === true) {
      _overlays[param].bringToBack()
      if (map.hasLayer(backgroundLayer)) {
        backgroundLayer.bringToBack()
      } else if (map.hasLayer(bgsat_layer)) {
        bgsat_layer.bringToBack()
      }
    } else {
      _overlays[param].bringToFront()
    }

    if (
      param == `vis` ||
      param == `irA` ||
      param == `radaric` ||
      param == `vishdbtrans` ||
      param == `irAhdbtrans`
    ) {
      overlayGroup.addLayer(coastlines_overlay)
      coastlines_overlay.bringToFront()
      _overlays['cities']?.bringToFront()
    }
    //coastlines_overlay.bringToFront();
  }

  _noverlays++

  /** @type {string} */ let dt
  // update layer box
  if (param == `frT`) {
    dt = `${i.hour}Z${i.minute}h`
  } else {
    dt = getDateTime(i, true)
  }

  return false
}
