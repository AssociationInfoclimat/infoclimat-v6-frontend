/**
 * @typedef {Object} Station
 * @property {string} id
 * @property {string} genre
 * @property {string} id_station
 * @property {string} libelle
 * @property {string} altitude
 * @property {string} temperature
 * @property {string} temperature_couleur
 * @property {string} humidite
 * @property {string} humidite_couleur
 * @property {string} pression
 * @property {string} pression_couleur
 * @property {string} vent_moyen
 * @property {string} vent_rafales
 * @property {string} pluie_1h
 * @property {string} temperature_eau
 * @property {string} temperature_eau_couleur
 * @property {string} hauteur_vagues
 * @property {string} temps
 * @property {string} pictogramme
 * @property {string} _wcam
 */

/**
 * @typedef {Object} Picto
 * @property {string} text
 * @property {string} value
 * @property {string} unit
 * @property {string} picto
 */

/**
 * @typedef {Object} User
 * @property {string} type
 * @property {string} photo
 * @property {Picto[]} pictos
 * @property {string} date
 * @property {string} city
 * @property {string} departement
 * @property {string} country
 * @property {string} elevation
 * @property {string} text
 * @property {string} user
 */

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
};

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
};

const KEY = `6GB5rCxV7DZaV8mHdLcyhw`;
const urlTemplate = `//{s}.tempsreel.infoclimat.net/directTiles/m:{mkey}/{pkey}/{py}/{pm}/{pd}/{ph}/v:{pi}.png?key=${KEY}`;
const urlTemplateLayers = `//{s}.tempsreel.infoclimat.net/directTiles/m:{mkey}:{pl}/{pkey}/{py}/{pm}/{pd}/{ph}/v:{pi}.png?key=${KEY}`;
const urlTemplateSatellite = `//{s}.tempsreel.infoclimat.net/secure/m:{mkey}/{pkey}/{py}/{pm}/{pd}/{ph}/v:{pi}/{z}/{x}/{y}?md5={k}`;
const urlTemplateMapbox = `//{s}.tempsreel.infoclimat.net/t-mapbox/{mkey}/{z}/{x}/{y}`;

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
];

const PARAMS_USING_URL_TEMPLATE_SATELLITE = [`vis`, `irA`, `frT`];

function getTemplate(/** @type {string} */ param) {
    if (param == `hillshade`) {
        return urlTemplateMapbox.replace(`{mkey}`, `hillshade`);
    }
    if (param == `cities`) {
        //return `http://{s}.modeles.infoclimat.net/t-cache/hyb/{z}/{x}/{y}`;
        //return `//{s}.tempsreel.infoclimat.net/t-osm/ovl/{z}/{x}/{y}`;
        // return `http://{s}.www.toolserver.org/tiles/osm-labels-fr/{z}/{x}/{y}.png`;
        return `https://{s}.tempsreel.infoclimat.net/t-mapbox/ovl/{z}/{x}/{y}`;
    }
    if (param == `meteoalerteli`) {
        return `//{s}.tempsreel.infoclimat.net/secureHD/m:meteoalerteli/{z}/{x}/{y}.jpeg`;
    }
    if (param == `sat`) {
        return `//{s}.tempsreel.infoclimat.net/secureHD/m:sat/{z}/{x}/{y}.jpeg`;
    }
    if (param == `coastlines`) {
        return `//{s}.tempsreel.infoclimat.net/secureHD/m:coastlines/{z}/{x}/{y}.png`;
    }
    if (PARAMS_USING_URL_TEMPLATE_SATELLITE.includes(param)) {
        return urlTemplateSatellite.replace(`{mkey}`, getMapFileName(param));
    }
    if (PARAMS_USING_URL_TEMPLATE_LAYERS.includes(param)) {
        return urlTemplateLayers
            .replace(`{mkey}`, getMapFileName(param))
            .replace(`{pl}`, getLayers(param));
    }
    param = `temperature`;
    return urlTemplateLayers
        .replace(`{mkey}`, param)
        .replace(`{pl}`, getLayers(param));
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
    return PARAM_TO_GEOWEBCACHE_NAME_MAP.get(param) ?? param;
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
    const layers = GEOWEBCACHE_PARAM_TO_LAYER_MAP.get(
        translateParamFromJSToGeoWebCache(param)
    );
    if (!layers) {
        console.error(`This param '${param}' is not known.`);
        return `temperatures,temperaturesHD,relief,landsea,countries,rivers1,rivers2,rivers3,riversfr,departements`;
    }
    return layers;
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
        return `satMO`;
    }
    const name = GEOWEBCACHE_PARAM_TO_MAP_FILE_NAME_MAP.get(
        translateParamFromJSToGeoWebCache(param)
    );
    if (!name) {
        throw new Error(`This param '${param}' is not known.`);
    }
    return name;
}

function stationDataToHTML(/** @type {{DATA: Station}} */ d) {
    const data = d.DATA;

    const _w = 100;
    let html = ``;
    if (data.genre == `bouees`) {
        html += /*html*/ `
            <b
                class="degrade-vertical-gris"
                style="color: black; text-shadow: none; margin: 0 -4px 0 -4px; display: block; padding: 0 4px;"
            >
                Bou&eacute;e/bateau ${data.id_station}
            </b>
        `;
    } else {
        html += /*html*/ `
            <b
                class="degrade-vertical-gris"
                style="color: black; text-shadow: none; margin: 0 -4px 0 -4px; display: block; padding: 0 4px;"
            >
                ${data.libelle}
        `;
        if (data.altitude !== undefined) {
            html += /*html*/ `
                [${data.altitude}m]
            `;
        }
        html += /*html*/ `
            </b>
        `;
    }

    if (data.temperature !== undefined) {
        html += /*html*/ `
            <b style="display: inline-block; width: ${_w}px;">Temp&eacute;rature:</b>
            <span
                class="square-colored"
                style="background: ${data.temperature_couleur}"
            ></span>
            ${data.temperature}&deg;C
        `;
    }
    if (data.humidite !== undefined) {
        html += /*html*/ `
            <br />
            <b style="display: inline-block; width: ${_w}px;">Humidit&eacute;:</b>
            <span
                class="square-colored"
                style="background: ${data.humidite_couleur}"
            ></span>
            ${data.humidite}%
        `;
    }
    if (data.pression !== undefined) {
        html += /*html*/ `
            <br />
            <b style="display: inline-block; width: ${_w}px;">Pression:</b>
            <span
                class="square-colored"
                style="background: ${data.pression_couleur}"
            ></span>
            ${data.pression}hPa
        `;
    }
    if (data.vent_moyen !== undefined) {
        html += /*html*/ `
            <br />
            <b style="display: inline-block; width: ${_w}px;">Vent moyen:</b>
            <span class="square-colored"></span>
            ${data.vent_moyen} km/h
        `;
    }
    if (data.vent_rafales !== undefined) {
        html += /*html*/ `
            <br />
            <b style="display: inline-block; width: ${_w}px;">Rafales:</b>
            <span class="square-colored"></span>
            ${data.vent_rafales} km/h
        `;
    }
    if (data.pluie_1h !== undefined) {
        html += /*html*/ `
            <br />
            <b style="display: inline-block; width: ${_w}px;">Pluie sur 1h:</b>
            <span class="square-colored"></span>
            ${data.pluie_1h} mm
        `;
    }
    if (data.temperature_eau !== undefined) {
        html += /*html*/ `
            <br />
            <b style="display: inline-block; width: ${_w}px;">Temp&eacute;. eau:</b>
            <span
                class="square-colored"
                style="background: ${data.temperature_eau_couleur}"
            ></span>
            ${data.temperature_eau}&deg;C
        `;
    }
    if (data.hauteur_vagues !== undefined) {
        html += /*html*/ `
            <br />
            <b style="display: inline-block; width: ${_w}px;">Hauteur vagues:</b>
            <span class="square-colored"></span>
            ${data.hauteur_vagues}m
        `;
    }
    if (data.temps) {
        html += /*html*/ `
            <div style="max-width: 150px; font-size: 9px;">
                <i>${data.temps}</i>
            </div>
        `;
    }

    if (data.pictogramme) {
        html += /*html*/ `
            <span
                class="degrade-vertical-gris"
                style="position: absolute; top: -7px; right: -7px; box-shadow: 0 0 3px #333; border-radius: 5px; padding: 2px;"
            >
                <img src="${data.pictogramme}" alt="" />
            </span>
        `;
    }

    if (data.genre == `static` || data.genre == `synop` || data.genre == `mf`) {
        html += /*html*/ `
            <img
                style="display: block; width: 200px; height: 100px; margin: 0 -4px 0 -4px;"
                src="//www.infoclimat.fr/stations-meteo/images/static/${data.id_station}_temperature.gif" alt=""
            />
        `;

        if (data._wcam) {
            html += /*html*/ `
                <div style="display: block; width: 200px; height: 100px; margin: 0 -4px 0 -4px; background-size: cover; background-image: url(${data._wcam}); background-position: 50% 50%;"></div>
            `;
        }
    }

    return html;
}

function userDataToHTML(/** @type {User} */ data) {
    let html = ``;
    if (data.type === `WC`) {
        html += /*html*/ `
            <b
                class="degrade-vertical-gris"
                style="color: black; text-shadow: none; margin: 0 -4px 0 -4px; display: block; padding: 0 4px;"
            >
                Webcam de ${data.city}
            </b>
            <div style="width: 100%; min-width: 200px; height: 150px; background-image: url(${data.photo}); background-size: cover; background-position: 50% 50%;"></div>
        `;
    } else if (data.type === `MA` || data.type === `TC`) {
        html += /*html*/ `
            <div class="meteoalerte-observation-detail">
                <div>
        `;
        // left picto
        if (`pictos` in data && data.pictos[0]) {
            html += /*html*/ `
                    <div class="MA-left-picto">
                        <img src="${data.pictos[0].picto}" alt="" />
            `;
            if (data.pictos[0].value !== null) {
                html += /*html*/ `
                        <br>
                        <span class="MA-left-value">
                            ${data.pictos[0].value} ${data.pictos[0].unit}
                        </span>
                `;
            }
            html += /*html*/ `
                    </div>
            `;
        }

        // date format
        const t = data.date.split(/[- : ]/).map(x => +x);
        const dq = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        let HH = dq.getHours().toString().padStart(2, `0`);
        let MM = dq.getMinutes().toString().padStart(2, `0`);

        let city = data.city;
        if (data.departement && data.departement.length > 0) {
            city += ` (${data.departement})`;
        }
        // right information
        html += /*html*/ `
                    <div class="MA-right-info">
                        <span style="font-size: 12px">${city}</span>
                        <br>
                        <span style="font-size: 9px">
                            ${data.country} - alt. ${data.elevation}m
                        </span>
                        <br>
        `;
        if (data.pictos) {
            html += /*html*/ `
                        <span style="font-size: 14px;">${data.pictos[0].text}</span><br>
            `;
        }
        html += /*html*/ `
                        <span style="font-size: 12px">${HH}:${MM}</span>
        `;
        html += /*html*/ `
                    </div>
        `;
        html += /*html*/ `
                </div>
        `;

        // other values
        data.pictos?.forEach(function (picto) {
            if (picto.picto === data.pictos[0].picto) {
                return;
            }
            html += /*html*/ `
                <span class="livestream-etiq-wrapper">
                <span
                    class="livestream-etiq-img"
                    style="background-size: cover; background-image: url(${picto.picto})"
                >&nbsp;</span>
                <span class="livestream-etiq-desc">
                    ${picto.text}
                </span>
            `;
            if (picto.value !== null) {
                html += /*html*/ `
                    <span class="livestream-etiq-value">
                        ${picto.value} ${picto.unit}
                    </span>
                `;
            }
            html += /*html*/ `
                </span>
            `;
        });

        // bottom information
        html += /*html*/ `
                <div class="MA-bottom-comment">
        `;

        // photo ?
        if (data.photo) {
            html += /*html*/ `
                    <img src="${data.photo}" style="width: 200px; height: 100px; margin: -4px -4px 2px -4px;" />
                    <br>
            `;
        }

        if (data.text != null) {
            html += data.text.replace(/\n/g, `<br>`).replace(
                `Envoyé depuis l'appli mobile`,
                /*html*/ `
                    <img
                        src="//static.infoclimat.net/images/smartphone.png"
                        style="float: left"
                        alt=""
                    />
                `
            );
        }
        html += /*html*/ `
                    <div class="MA-bottom-user">
                        ${data.user}
                    </div>
                </div>
            </div>
        `;
    }
    return html;
}
