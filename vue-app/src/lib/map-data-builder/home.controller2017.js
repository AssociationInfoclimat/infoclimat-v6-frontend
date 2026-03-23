/**
 * A décommenter uniquement pour le dev
 */

/**
 * jQuery fallback (vanilla JS)
 * Keep legacy API shape used in this file without requiring jQuery at runtime.
 */
(function initLegacyJQueryFallback(global) {
    if (global.$ && global.jQuery) {
        return;
    }

    function normalizeElements(input) {
        if (!input) {
            return [];
        }
        if (input instanceof VanillaCollection) {
            return input.elements;
        }
        if (typeof input === `string`) {
            return Array.from(document.querySelectorAll(input));
        }
        if (input instanceof Element || input === window || input === document) {
            return [input];
        }
        if (Array.isArray(input) || input instanceof NodeList) {
            return Array.from(input);
        }
        return [];
    }

    function toCssValue(value) {
        if (typeof value === `number`) {
            return `${value}px`;
        }
        return value;
    }

    function serializeQuery(data) {
        if (!data) {
            return ``;
        }
        return Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join(`&`);
    }

    function attachJsonp(url, callbackName) {
        if (url.includes(`callback=?`)) {
            return url.replace(`callback=?`, `callback=${callbackName}`);
        }
        const sep = url.includes(`?`) ? `&` : `?`;
        return `${url}${sep}callback=${callbackName}`;
    }

    function getNumericStyle(el, prop) {
        if (!el) {
            return 0;
        }
        const computed = window.getComputedStyle(el);
        const value = parseFloat(computed[prop]);
        return Number.isNaN(value) ? 0 : value;
    }

    class VanillaCollection {
        constructor(elements) {
            this.elements = elements.filter(Boolean);
            this.length = this.elements.length;
        }

        each(callback) {
            this.elements.forEach((el, index) => callback.call(el, index, el));
            return this;
        }

        html(value) {
            if (value === undefined) {
                return this.elements[0]?.innerHTML ?? ``;
            }
            this.elements.forEach((el) => {
                el.innerHTML = value;
            });
            return this;
        }

        css(prop, value) {
            if (typeof prop === `string` && value === undefined) {
                const el = this.elements[0];
                if (!el) {
                    return ``;
                }
                return window.getComputedStyle(el)[prop];
            }

            if (typeof prop === `string`) {
                const cssValue = toCssValue(value);
                this.elements.forEach((el) => {
                    el.style[prop] = cssValue;
                });
                return this;
            }

            this.elements.forEach((el) => {
                Object.entries(prop).forEach(([k, v]) => {
                    el.style[k] = toCssValue(v);
                });
            });
            return this;
        }

        addClass(className) {
            this.elements.forEach((el) => el.classList.add(...className.split(/\s+/).filter(Boolean)));
            return this;
        }

        removeClass(className) {
            this.elements.forEach((el) => el.classList.remove(...className.split(/\s+/).filter(Boolean)));
            return this;
        }

        hide() {
            this.elements.forEach((el) => {
                el.style.display = `none`;
            });
            return this;
        }

        show() {
            this.elements.forEach((el) => {
                if (el.style.display === `none`) {
                    el.style.display = ``;
                }
                if (window.getComputedStyle(el).display === `none`) {
                    el.style.display = `block`;
                }
            });
            return this;
        }

        fadeIn() {
            return this.show();
        }

        fadeOut() {
            return this.hide();
        }

        find(selector) {
            const found = this.elements.flatMap((el) =>
                Array.from(el.querySelectorAll(selector))
            );
            return new VanillaCollection(found);
        }

        parent() {
            const parents = this.elements
                .map((el) => el.parentElement)
                .filter(Boolean);
            return new VanillaCollection([...new Set(parents)]);
        }

        width(value) {
            if (value === undefined) {
                const el = this.elements[0];
                if (!el) {
                    return 0;
                }
                return el.getBoundingClientRect().width;
            }
            this.elements.forEach((el) => {
                el.style.width = toCssValue(value);
            });
            return this;
        }

        height(value) {
            if (value === undefined) {
                const el = this.elements[0];
                if (!el) {
                    return 0;
                }
                return el.getBoundingClientRect().height;
            }
            this.elements.forEach((el) => {
                el.style.height = toCssValue(value);
            });
            return this;
        }

        outerWidth() {
            const el = this.elements[0];
            if (!el) {
                return 0;
            }
            const rect = el.getBoundingClientRect();
            const ml = getNumericStyle(el, `marginLeft`);
            const mr = getNumericStyle(el, `marginRight`);
            return rect.width + ml + mr;
        }

        position() {
            const el = this.elements[0];
            if (!el) {
                return { top: 0, left: 0 };
            }
            return {
                top: el.offsetTop,
                left: el.offsetLeft,
            };
        }

        offset() {
            const el = this.elements[0];
            if (!el) {
                return { top: 0, left: 0 };
            }
            const rect = el.getBoundingClientRect();
            return {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
            };
        }

        data(key, value) {
            const el = this.elements[0];
            if (!el) {
                return value === undefined ? undefined : this;
            }
            const dataKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            if (value === undefined) {
                const rawValue = el.dataset[dataKey];
                if (rawValue === undefined) {
                    return undefined;
                }
                const asNumber = Number(rawValue);
                return Number.isNaN(asNumber) ? rawValue : asNumber;
            }
            this.elements.forEach((node) => {
                node.dataset[dataKey] = String(value);
            });
            return this;
        }

        attr(name, value) {
            const el = this.elements[0];
            if (!el) {
                return value === undefined ? undefined : this;
            }
            if (value === undefined) {
                return el.getAttribute(name);
            }
            this.elements.forEach((node) => node.setAttribute(name, value));
            return this;
        }

        remove() {
            this.elements.forEach((el) => el.remove());
            return this;
        }

        prepend(content) {
            this.elements.forEach((el) => {
                if (typeof content === `string`) {
                    el.insertAdjacentHTML(`afterbegin`, content);
                } else if (content instanceof Element) {
                    el.prepend(content);
                }
            });
            return this;
        }

        append(content) {
            this.elements.forEach((el) => {
                if (typeof content === `string`) {
                    el.insertAdjacentHTML(`beforeend`, content);
                } else if (content instanceof Element) {
                    el.append(content);
                }
            });
            return this;
        }

        mouseleave(handler) {
            this.elements.forEach((el) => el.addEventListener(`mouseleave`, handler));
            return this;
        }

        animate(properties) {
            Object.entries(properties).forEach(([key, val]) => this.css(key, val));
            return this;
        }

        slider() {
            return this;
        }

        sortable(arg) {
            if (arg === `toArray`) {
                const container = this.elements[0];
                if (!container) {
                    return [];
                }
                return Array.from(container.children)
                    .map((child) => child.id)
                    .filter(Boolean);
            }
            return this;
        }

        disableSelection() {
            return this;
        }

        tipsy() {
            return this;
        }
    }

    function $(input) {
        return new VanillaCollection(normalizeElements(input));
    }

    $.each = function each(collection, callback) {
        if (!collection) {
            return collection;
        }
        if (Array.isArray(collection)) {
            collection.forEach((value, index) => callback.call(value, index, value));
            return collection;
        }
        Object.keys(collection).forEach((key) =>
            callback.call(collection[key], key, collection[key])
        );
        return collection;
    };

    $.ajax = function ajax(options) {
        const method = (options.type || options.method || `GET`).toUpperCase();
        const dataType = options.dataType || `json`;

        if (dataType === `jsonp`) {
            const callbackName = options.jsonpCallback || `__jsonp_${Date.now()}`;
            const script = document.createElement(`script`);
            script.src = attachJsonp(options.url, callbackName);

            global[callbackName] = function onJsonp(payload) {
                try {
                    options.success?.(payload);
                } finally {
                    delete global[callbackName];
                    script.remove();
                }
            };

            script.onerror = function onJsonpError(error) {
                options.error?.(error);
                delete global[callbackName];
                script.remove();
            };

            document.head.appendChild(script);
            return;
        }

        let url = options.url;
        if (method === `GET` && options.data) {
            const query = serializeQuery(options.data);
            if (query) {
                url += (url.includes(`?`) ? `&` : `?`) + query;
            }
        }

        fetch(url, {
            method,
            headers:
                method !== `GET`
                    ? {
                        'Content-Type': `application/x-www-form-urlencoded;charset=UTF-8`,
                    }
                    : undefined,
            body:
                method !== `GET` && options.data
                    ? serializeQuery(options.data)
                    : undefined,
        })
            .then((res) => {
                if (dataType === `text`) {
                    return res.text();
                }
                return res.json();
            })
            .then((payload) => options.success?.(payload))
            .catch((error) => options.error?.(error));
    };

    $.getJSON = function getJSON(url, data, callback) {
        let payload = data;
        let cb = callback;
        if (typeof data === `function`) {
            cb = data;
            payload = undefined;
        }

        if (url.includes(`callback=?`)) {
            $.ajax({
                url,
                type: `GET`,
                data: payload,
                dataType: `jsonp`,
                success: cb,
            });
            return;
        }

        let finalUrl = url;
        const query = serializeQuery(payload);
        if (query) {
            finalUrl += (url.includes(`?`) ? `&` : `?`) + query;
        }
        fetch(finalUrl)
            .then((res) => res.json())
            .then((json) => cb?.(json))
            .catch((error) => console.error(error));
    };

    global.$ = $;
    global.jQuery = $;
})(window);

/** @type {L.Map} */
// var map;
/** @type {L.LayerGroup} */
// var layerGroup;
/** @type {L.LayerGroup} */
// var overlayGroup;
/** @type {L.FeatureGroup} */
// var _lprefGroup;
/** @type {ICMAPConfig & Record<string, any>} */
// var ICMAPconfig = {};
/** @type {Record<string, Style>} */
// var GeoJSON_prop_to_style = {};
/** @type {DESCInterface} */
// var DESC;
/** @type {number} */
// var _init_zoom;
/** @type {string} */
// var ICMAPtoken;
// var getTemplate = (/** @type {string} */ param) => param;
// var stationDataToHTML = (/** @type {string} */ station) => station;
// var userDataToHTML = (/** @type {string} */ user) => user;
// var MAobsModerated = [];
/** @type {RaphaelLeaflet} */
// var R;

// class Pulse extends L.Layer {
//     constructor(...args) {
//         super();
//     }
// }

// class StrokeLayerInterface extends L.Layer {
//     constructor(...args) {
//         super();
//     }
//     addPoint({ slat, slon }) {}
//     removeData() {}
//     p_init() {}
//     addLayerTo(/** @type {L.Map} */ map) {}
//     redraw() {}
// }

/**
 * @typedef {Object} ICMAPConfig
 * @property {Record<string, any>} ltiles
 * @property {Record<string, any>} lanim
 * @property {boolean} isNightTime
 */

/**
 * @typedef {Object} DESCInterface
 * @property {string} radaric
 * @property {string} foudre
 * @property {string} `foudre-live`
 * @property {string} clouds
 * @property {string} MCanalysis
 * @property {string} vigilance
 * @property {string} vis
 * @property {string} irA
 * @property {string} frT
 * @property {string} estofex
 * @property {string} colorac60radaric
 * @property {string} ac3hradaric
 * @property {string} ac6hradaric
 * @property {string} ac24hradaric
 * @property {string} ac72hradaric
 * @property {string} ac24hradaricval
 * @property {string} ac72hradaricval
 * @property {string} villes
 * @property {string} cities
 * @property {string} vishdbtrans
 * @property {string} vishdb
 * @property {string} irAhdbtrans
 * @property {string} irAhdb
 */

/**
 * @typedef {Object} Style
 * @property {string} color
 * @property {number} weight
 * @property {boolean} fill
 */

/**
 * @typedef {Object} RaphaelLeaflet
 * @property {typeof Pulse} Pulse
 */

const DEFAULT_WMS_PARAMS = {
    service: `WMS`,
    version: `1.3.0`,
    request: `GetMap`,
    format: `image/png`,
    transparent: true,
    width: 256,
    height: 256,
    tiled: true,
};

/** @type {string|null} */
let _currentparam = null;
const _currentpjson = false;
/** @type {L.TileLayer} */
let parameterLayer;
/** @type {string} */
let _template;
const _maplimits = {
    temperature: [-180, 180, -90, 90],
    meteoalerte: [-180, 180, -90, 90],
    radaric: [-15, 15, 40, 55],
    foudre: [-180, 180, -90, 90],
    pression: [-180, 180, -90, 90],
    clouds: [-80, 80, 0, 90],
    nexrad: [-127, -60, 20, 55],
};
let _overlays = {};
let _noverlays = 0;

/* default layers */
const cities_layer = L.tileLayer(getTemplate(`cities`), {
    attribution: `OpenStreetMaps`,
    maxZoom: 9,
    minZoom: 7,
});

const hillshadeLayer = L.tileLayer(getTemplate(`hillshade`), {
    maxZoom: 11,
    minZoom: 1,
    useCache: true,
});

const backgroundLayer = L.tileLayer(getTemplate(`meteoalerteli`), {
    maxZoom: 11,
    minZoom: 1,
    useCache: true,
});

const bgsat_layer = L.tileLayer(getTemplate(`sat`), {
    ...DEFAULT_WMS_PARAMS,
    layers: getLayers(`sat`),
    maxZoom: 11,
    minZoom: 1,
    useCache: true,
});

const osm_layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    ...DEFAULT_WMS_PARAMS,
    maxZoom: 20,
    minZoom: 1,
    useCache: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

const coastlines_overlay = L.tileLayer(getTemplate(`coastlines`), {
    ...DEFAULT_WMS_PARAMS,
    layers: getLayers(`coastlines`),
    maxZoom: 11,
    minZoom: 1,
    useCache: true,
    opacity: 0.6,
});

console.log(ICMAPconfig, 'ICMAPconfig')

ICMAPconfig.ltiles[`cities`] = ICMAPconfig.ltiles[`meteoalerte`];
/* events */
let _currentMapBounds = [
    map.getBounds().getSouthWest(),
    map.getBounds().getNorthEast(),
];
map.addEventListener(`moveend`, function () {
    const b = map.getBounds();

    const sw = b.getSouthWest();
    const ne = b.getNorthEast();
    const z = map.getZoom();
    _currentMapBounds = [sw, ne];

    if (_displayMarkers && _currentparam != `meteoalerte` && _currentparam != `webcams`) {
        getStationData(ne.lat, sw.lat, ne.lng, sw.lng, z);
    }

    if (_currentparam == `meteoalerte`) {
        getUserData(ne.lat, sw.lat, ne.lng, sw.lng, z);
    }

    if (_currentparam === `foudre`) {
        updateStrokeData(map);
    }

    if (_currentparam === `webcams`) {
        getUserDataAuto(false, true);
    }

    // display cities?
    /*if(z >= 7 && z <= 9)
    cities_layer.addTo(map).bringToFront();
    else
    map.removeLayer(cities_layer);*/
});

// Update size of Photolive divicons
map.addEventListener(`zoomend`, function () {
	let zoom = map.getZoom();
	photoliveGroup.eachLayer(function(layer){
		if (!layer._icon) {
            return;
        }
        let icon = layer._icon;
        icon.classList.forEach(cls => {
            if (cls.startsWith('zoom')) {
                icon.classList.remove(cls);
            }
        });
        icon.classList.add(`zoom${zoom}`);
	});
});
// Click on DivIcon
document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("clickable-photo")) {
        return;
    }
    let title = event.target.dataset.title;
    let img = event.target.dataset.img;
    let place = event.target.dataset.place;
    let date = event.target.dataset.date;
    let link = event.target.dataset.link;
    let pseudo = event.target.dataset.pseudo;
    let content = `
        <div id="photolive-popup">
            <div id="photolive-popup-header">
                <span id="photolive-popup-name">${title}</span>
                <div id="photolive-popup-author">par ${pseudo}</div>
            </div>
            <div id="photolive-popup-img"><img src="${img}"/></div>
            <div id="photolive-popup-comm"><div><span id="photolive-popup-commune-name"> ${place}</span></div></div>
            <div id="photolive-popup-footer">
                <div><span>${date}</span></div>
                <div><a target="_blank" href="${link}"><span id="photolive-popup-more">En savoir +</span></a></div>
            </div>
        </div>
    `;
    let clickLatLng = map.mouseEventToLatLng(event);
    map.openPopup(content, clickLatLng);
});

// Improving moving photolive popup
map.on('popupopen', function (e) {
    setTimeout(() => { // wait for rendering popup
        let popup = e.popup;
        let popupContainer = popup._container;
        let latlng = popup.getLatLng();
        let popupHeight = popupContainer.getBoundingClientRect().height;
		let selectbarContainerHeight = document.querySelector('.selectbar-container').getBoundingClientRect().height;
        let marginTop = selectbarContainerHeight + 15; // Margin for top div
        let containerPoint = map.latLngToContainerPoint(latlng);
        // Check if the popup exceeds the top
        let overflow = marginTop - (containerPoint.y - popupHeight);
        if (overflow > 0) { // If the popup actually exceeds
			// Pixel offset in Y (down)
            let pixelShift = [0, -overflow]; // Move only in Y
            map.panBy(pixelShift, { animate: true });
        }
    }, 50); // Wait 50ms to allow time for rendering
});

/*cities_layer.addTo(map).bringToFront();*/

const StrokeLayer = L.FullCanvas.extend({
    drawSource: function (point) {
        const ctx = strokeLayer.getCanvas().getContext(`2d`);
        ctx.beginPath();
        ctx.moveTo(point.x - 3, point.y + 0.5);
        ctx.lineTo(point.x + 3.5, point.y + 0.5);

        ctx.moveTo(point.x + 0.5, point.y + 3.5);
        ctx.lineTo(point.x + 0.5, point.y - 3);
        //ctx.strokeStyle = `rgb(255,255,255)`;
        ctx.strokeStyle = `rgb(228,0,255)`;
        ctx.stroke();
    },
});
// const strokeLayer = new StrokeLayer();
// strokeLayer.p_init();
/** @type {StrokeLayerInterface|null} */
let strokeLayer = null;

/** @type {string|number} */
let _homeInitialHeight = 726;
function setHomeToFullscreen() {
    const elm = $(`#accueil-cartedynamique-container`);

    if (elm.css(`position`) == `fixed`) {
        // fin du full screen
        $(`#fullscreen-button`).removeClass(`quitfullscreen`);
        elm.css({
            position: `relative`,
            top: `auto`,
            bottom: `auto`,
            left: `auto`,
            width: `100%`,
            height: _homeInitialHeight,
            right: `auto`,
            zIndex: 10,
        });
        map.invalidateSize();
        map.scrollWheelZoom.disable();
        map.gestureHandling.enable();
    } else {
        // début du full screen
        $(`#fullscreen-button`).addClass(`quitfullscreen`);
        _homeInitialHeight = elm.css(`height`);

        elm.css({
            position: `fixed`,
            top: `0px`,
            bottom: `0px`,
            left: `0px`,
            width: `auto`,
            height: `auto`,
            right: `0px`,
            zIndex: 500,
        });
        map.invalidateSize();
        map.scrollWheelZoom.enable();
        map.gestureHandling.disable();
    }
    return false;
}

function displayHideFavoritesPlaces() {
    if (_lprefGroup) {
        if (map.hasLayer(_lprefGroup)) {
            map.removeLayer(_lprefGroup);
        } else {
            map.addLayer(_lprefGroup);
            _lprefGroup.bringToFront();
        }
        $(`#params-button-menu`).hide();
    }
    return false;
}

function displaySubMenu(
    /** @type {JQuery} */ elm,
    /** @type {string} */ position,
    param
) {
    //if(param === _currentparam) return false;

    $(`#selectmenu-hidden`).html(elm.parent().find(`ul`).html());

    if (position === `bottom`) {
        $(`#selectmenu-hidden`).css({
            //top: elm.parent().parent().offset().top - $('#selectmenu-hidden').height(),
            //left:elm.offset().left + elm.parent().width() - $('#selectmenu-hidden').width()
            bottom: elm.parent().height(),
            left:
                elm.position().left -
                $(`#selectmenu-hidden`).width() +
                elm.outerWidth(),
            top: `auto`,
        });
    } else {
        $(`#selectmenu-hidden`).css({
            //top: elm.parent().parent().offset().top + elm.parent().parent().height(),
            //left:elm.parent().offset().left
            top: elm.parent().parent().height(),
            left: elm.parent().position().left,
            bottom: `auto`,
        });
    }

    $(`#selectmenu-hidden`).fadeIn(500);

    return false;
}

// leaving submenu
$(`#accueil-cartedynamique-container,#selectmenu-hidden`).mouseleave(
    function () {
        const e = $(`#selectmenu-hidden`);
        if (e.css(`display`) !== `none`) {
            e.css(`display`, `none`);
        }
    }
);

function hideSubMenu() {
    $(`#selectmenu-hidden`).css(`display`, `none`);
    return false;
}

/**
 * @typedef {Object} Config
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number} hour
 * @property {number} minute
 */

function updateDateTime(
    /** @type {Config} */ config,
    /** @type {boolean} */ display_minutes
) {
    const d = new Date();
    d.setUTCFullYear(config.year);
    d.setUTCMonth(config.month - 1);
    d.setUTCDate(config.day);
    d.setUTCHours(config.hour);

    if (display_minutes === true) {
        d.setUTCMinutes(config.minute);
    } else {
        d.setUTCMinutes(0);
    }

    /** @type {string|number} */
    let tz = (-1 * d.getTimezoneOffset()) / 60;
    if (tz > 0) {
        tz = `+${tz}`;
    } else if (tz == 0) {
        tz = ``;
    }

    let min = d.getMinutes().toString().padStart(2, `0`);

    $(`.datetime-chgid`).html(`${d.getHours()}:${min}`);
    $(`.datetime-small`).html(`UTC${tz}`);

    if (_currentparam === `foudre`) {
        $(`#echelle-foudre-cartedyna div`).each(function () {
            const tmpd = new Date(
                d.getTime() - 60 * 1000 * $(this).data(`offset`)
            );
            const min = tmpd.getMinutes().toString().padStart(2, `0`);
            $(this).html(`${tmpd.getHours()}:${min}`);
        });
    }

    return true;
}

function getDateTime(
    /** @type {Config} */ config,
    /** @type {boolean} */ display_minutes
) {
    const d = new Date();
    d.setUTCFullYear(config.year);
    d.setUTCMonth(config.month - 1);
    d.setUTCDate(config.day);
    d.setUTCHours(parseInt(config.hour.toString(), 10));

    if (display_minutes === true) {
        d.setUTCMinutes(config.minute);
    } else {
        d.setUTCMinutes(0);
    }

    /** @type {string|number} */
    let tz = (-1 * d.getTimezoneOffset()) / 60;
    if (tz > 0) {
        tz = `+${tz}`;
    } else if (tz == 0) {
        tz = ``;
    }

    const min = d.getMinutes().toString().padStart(2, `0`);

    return `${d.getHours()}:${min}`;
}

function updateZoomFromMap(
    /** @type {number} */ lat,
    /** @type {number} */ lon,
    /** @type {number} */ z,
    /** @type {JQuery} */ elm
) {
    if (_maplimits[_currentparam]) {
        const [lonMin, lonMax, latMin, latMax] = _maplimits[_currentparam];
        if (lon < lonMin || lon > lonMax || lat < latMin || lat > latMax) {
            alert(
                "D\351sol\351, cette carte n'est pas (encore) disponible sur cette zone g\351ographique."
            );
            return false;
        }
    }

    map.setView([lat, lon], z);
    $(`.selectbar-bottom-selected`).removeClass(`selectbar-bottom-selected`);
    elm.addClass(`selectbar-bottom-selected`);

    try {
        localStorage.setItem(`home.mapview`, `${lat}|${lon}|${z}`);
    } catch (e) {}

    return false;
}

function getICBounds(
    /** @type {number[]} */ [lngWest, lngEast, latSouth, latNorth]
) {
    return L.latLngBounds(
        { lng: lngWest, lat: latSouth },
        { lng: lngEast, lat: latNorth }
    );
}

/** @type {number} */
let iteration;
/** @type {NodeJS.Timeout|null} */
let cTimeout = null;
function updateParamFromMap(
    /** @type {string} */ param,
    /** @type {boolean} */ force_update,
    /** @type {boolean} */ is_default
) {
    if (ICMAPconfig.isNightTime && param == `vis`) {
        param = `irA`;
    }
    if (ICMAPconfig.isNightTime && param == `vishdbtrans`) {
        param = `irAhdbtrans`;
    }

    if (cTimeout) {
        clearTimeout(cTimeout);
        iteration = 0;
        $(`.datetime-anim-bar div`).width(`100%`);
        _currentparam = null; // maybe a better way?
    }

    if (param === _currentparam && force_update !== true) {
        return false;
    }

    $(`.selectbar-selected`).removeClass(`selectbar-selected`);
    $(`#homelink_${param}`).addClass(`selectbar-selected`);
    $(`.superpose-radaric`).html(`Superposer &agrave; cette carte`);

    $(`#stroke-data-container`).fadeOut(500);
    $(`.blitzortung-note`).fadeOut(500);
    $(`.blitzortung-note-btn`).fadeOut(500);
    $(`.echelles-cartedyna`).fadeOut(500);

    // clearing current layers
    layerGroup.clearLayers();
    map.removeLayer(layerGroup);
    map.removeLayer(photoliveGroup);
    bgsat_layer.setOpacity(1);
	map.gestureHandling.enable();
	map.setMaxZoom(11);

    // clearing overlays
    _noverlays = 0;
    jQuery.each(_overlays, function (k, v) {
        if (k !== `cities`){
            overlayGroup.removeLayer(v);
            delete _overlays[k];
        }
    });
    //_overlays = {};
    $(`#all-layers-container`).hide().find(`ul`).html(``);

    if (_init_zoom) {
        map.setZoom(_init_zoom);
    }

    /* if (is_default !== true) {
        saveMapParams(param);
    } */

    if (param != `foudre` && strokeLayer && map.hasLayer(strokeLayer)) {
        map.removeLayer(strokeLayer);
        stopStrokeLive();
    }

    _currentparam = param;
    if (param === `meteoalerte`) {
        if (!map.hasLayer(backgroundLayer)) {
            layerGroup.addLayer(backgroundLayer);
            layerGroup.addTo(map);
        }

        _displayMarkers = true;

        overlayGroup.addLayer(coastlines_overlay);

        // updating markers
        getUserDataAuto(false);
        updateDateTime(ICMAPconfig.ltiles[`meteoalerte`].info, true);
    } else if (param === `webcams`) {
        if (!map.hasLayer(backgroundLayer)) {
            layerGroup.addLayer(backgroundLayer);
            layerGroup.addTo(map);
        }

        _displayMarkers = true;

        // updating markers
        getUserDataAuto(false, true);
    } else if (param === `photolive`) {
        photoliveGroup = L.featureGroup();
        // remove gesturehandling
		map.gestureHandling.disable();
        // update maxzoom
		map.setMaxZoom(14);
		// adding osm
		layerGroup.addLayer(osm_layer);
		osm_layer.setOpacity(0.5);
		// adding sat
        if (!map.hasLayer(bgsat_layer)) {
            layerGroup.addLayer(bgsat_layer);
            layerGroup.addTo(map);
        }
		// update opacity & maxZoom to sat
		bgsat_layer.setOpacity(0.6);
        bgsat_layer.options.maxZoom = 14
		// removing coastlines
		overlayGroup.removeLayer(coastlines_overlay);
		// removing markers
        _displayMarkers = false;
        removeAllMarkers();
		// positionning photolives
        getPhotolives().then(photolives24h => {
			let photoliveUpdated = adjustDuplicateCoordinates(photolives24h);
            let zIndexPhotolives = 1000;
			// add photolives to group
			for (let photo of photoliveUpdated) {
				let lat = photo.latitude;
				let lon = photo.longitude;
				let myIcon = L.divIcon({
					html: `
                        <img
                            src="${photo.img}"
                            class="clickable-photo"
                            data-lat="${lat}"
                            data-lon="${lon}"
                            data-title="${photo.title}"
                            data-img="${photo.img}"
                            data-place="${photo.place}"
                            data-date="${photo.date}"
                            data-link="${photo.link}"
                            data-pseudo="${photo.pseudo}"
                        />
                    `,
					className: 'imgdivIcon zoom' + map.getZoom()
				});
                let markerPhotolive = L.marker([lat, lon], { icon: myIcon});
				markerPhotolive.setZIndexOffset(zIndexPhotolives);
				zIndexPhotolives += 100;
				markerPhotolive.addTo(photoliveGroup);
			}
			// add photolives to map
			photoliveGroup.addTo(map);
		});
    } else if (param === `temperature` || param === `temperature_eau`) {
        _template = getTemplate(param);

        if (!ICMAPconfig.ltiles[param]) {
            alert(`Une erreur est survenue.`);
            return false;
        }

        const i = ICMAPconfig.ltiles[param].info;
        const u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[param].key)
            .replace(`.png`, `.jpeg`);
        updateDateTime(i);

        parameterLayer = L.WMS.tileLayer(u, {
            ...DEFAULT_WMS_PARAMS,
            format: `image/jpeg`,
            NOTRANSPARENCY: 1,
            layers: getLayers(param),
            maxZoom: 11,
            minZoom: 1,
        });
        layerGroup.addLayer(parameterLayer);
        layerGroup.addLayer(hillshadeLayer);
        overlayGroup.removeLayer(coastlines_overlay);
        layerGroup.addTo(map);
        hillshadeLayer.bringToFront();

        _displayMarkers = true;

        // updating markers
        getStationDataAuto();
    } else if (param === `pression`) {
        _template = getTemplate(param);

        if (!ICMAPconfig.ltiles[param]) {
            alert(`Une erreur est survenue.`);
            return false;
        }

        const i = ICMAPconfig.ltiles[param].info;
        const u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[param].key)
            .replace(`.png`, `.jpeg`);
        updateDateTime(i);

        parameterLayer = L.WMS.tileLayer(u, {
            ...DEFAULT_WMS_PARAMS,
            format: `image/jpeg`,
            layers: getLayers(param),
            maxZoom: 11,
            minZoom: 1,
        });
        layerGroup.addLayer(parameterLayer);
        layerGroup.addLayer(hillshadeLayer);
        layerGroup.addTo(map);
        hillshadeLayer.bringToFront();

        _displayMarkers = true;

        // updating markers
        getStationDataAuto();
    } else if (
        param === `clouds` ||
        param == `goesei7` ||
        param == `goesergb` ||
        param == `goeswv1` ||
        param == `goeswi4` ||
        param == `himawarirgb`
    ) {
        _template = getTemplate(param);

        if (!ICMAPconfig.ltiles[param]) {
            alert(`Une erreur est survenue.`);
            return false;
        }

        if (map.getZoom() > 5) {
            _init_zoom = map.getZoom();
            map.setZoom(5);
        }

        const i = ICMAPconfig.ltiles[param].info;
        const u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[param].key);
        updateDateTime(i, true);

        parameterLayer = L.WMS.tileLayer(u, {
            ...DEFAULT_WMS_PARAMS,
            layers: getLayers(param),
            maxZoom: 11,
            minZoom: 1,
        });
        layerGroup.addLayer(bgsat_layer);
        layerGroup.addLayer(parameterLayer);
        layerGroup.addTo(map);

        // removing markers
        _displayMarkers = false;
        removeAllMarkers();
    } else if (param === `vis` || param === `vishdbtrans`) {
        param = 'vishdbtrans';
        _template = getTemplate(param);

        if (!ICMAPconfig.ltiles[param]) {
            alert(`Une erreur est survenue.`);
            return false;
        }

        if (map.getZoom() > 6) {
            _init_zoom = map.getZoom();
            map.setZoom(6);
        }

        const i = ICMAPconfig.ltiles[param].info;
        const u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[param].key);
        updateDateTime(i, true);

        parameterLayer = L.tileLayer(u, {
            maxZoom: 11,
            minZoom: 1,
            opacity: 0.75,
        });
        layerGroup.addLayer(bgsat_layer);
        layerGroup.addLayer(parameterLayer);
        layerGroup.addLayer(coastlines_overlay);
        layerGroup.addTo(map);

        // removing markers
        _displayMarkers = false;
        removeAllMarkers();
    } else if (param === `irA` || param === `irAhdbtrans`) {
        param = 'irAhdbtrans';
        _template = getTemplate(param);

        if (!ICMAPconfig.ltiles[param]) {
            alert(`Une erreur est survenue.`);
            return false;
        }

        if (map.getZoom() > 6) {
            _init_zoom = map.getZoom();
            map.setZoom(6);
        }

        const i = ICMAPconfig.ltiles[param].info;
        const u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[param].key);
        updateDateTime(i, true);

        parameterLayer = L.WMS.tileLayer(u, {
            ...DEFAULT_WMS_PARAMS,
            layers: getLayers(param),
            maxZoom: 11,
            minZoom: 1,
            opacity: 1,
        });
        layerGroup.addLayer(bgsat_layer);
        layerGroup.addLayer(parameterLayer);
        layerGroup.addLayer(coastlines_overlay);
        layerGroup.addTo(map);

        // removing markers
        _displayMarkers = false;
        removeAllMarkers();
    } else if (param === `radaric`) {
        _template = getTemplate(param);

        if (!ICMAPconfig.ltiles[param]) {
            alert(`Une erreur est survenue.`);
            return false;
        }

        const i = ICMAPconfig.ltiles[param].info;
        const u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[param].key);
        const i2 = ICMAPconfig.ltiles[`nexrad`].info;
        const u2 = getTemplate(`nexrad`)
            .replace(`{pkey}`, `nexrad`)
            .replace(`{py}`, i2.year)
            .replace(`{pm}`, i2.month)
            .replace(`{pd}`, i2.day)
            .replace(`{ph}`, i2.hour)
            .replace(`{pi}`, i2.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[`nexrad`].key);
        updateDateTime(i, true);

        parameterLayer = L.WMS.tileLayer(u, {
            ...DEFAULT_WMS_PARAMS,
            layers: getLayers(param),
            maxZoom: 11,
            minZoom: 1,
            bounds: getICBounds(_maplimits[`radaric`]),
        });
        const nexrad = L.WMS.tileLayer(u2, {
            ...DEFAULT_WMS_PARAMS,
            layers: getLayers(param),
            maxZoom: 11,
            minZoom: 1,
            bounds: getICBounds(_maplimits[`nexrad`]),
        });
        layerGroup.addLayer(bgsat_layer);
        layerGroup.addLayer(parameterLayer);
        layerGroup.addLayer(nexrad);
        layerGroup.addTo(map);

        // removing markers
        _displayMarkers = false;
        removeAllMarkers();
    } else if (
        param === `colorac60radaric` ||
        param == `ac3hradaric` ||
        param == `ac6hradaric` ||
        param == `ac12hradaric` ||
        param == `ac24hradaric` ||
        param == `ac72hradaric` ||
        param == `ac24hradaricval` ||
        param == `ac72hradaricval`
    ) {
        _template = getTemplate(param);
        const _mapNameToPalName = {
            colorac60radaric: `radar1h`,
            ac3hradaric: `radar3h`,
            ac6hradaric: `radar6h`,
            ac12hradaric: `radar12h`,
            ac24hradaric: `radar24h`,
            ac72hradaric: `radar72h`,
        };

        let ltilename = param;
        if (param == `ac24hradaricval`) {
            ltilename = `ac24hradaric`;
        }
        if (param == `ac72hradaricval`) {
            ltilename = `ac72hradaric`;
        }

        if (!ICMAPconfig.ltiles[ltilename]) {
            alert(`Une erreur est survenue.`);
            return false;
        }

        const i = ICMAPconfig.ltiles[ltilename].info;
        const u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[ltilename].key);
        updateDateTime(i, true);

        parameterLayer = L.WMS.tileLayer(u, {
            ...DEFAULT_WMS_PARAMS,
            layers: getLayers(param),
            maxZoom: 11,
            minZoom: 1,
            bounds: getICBounds(_maplimits[`radaric`]),
        });
        layerGroup.addLayer(bgsat_layer);
        layerGroup.addLayer(parameterLayer);
        layerGroup.addTo(map);

        $(`#echelle-${_mapNameToPalName[param]}-cartedyna`).show(0);

        // removing markers
        _displayMarkers = false;
        removeAllMarkers();
    } else if (param === `foudre`) {
        _template = getTemplate(param);

        if (!ICMAPconfig.ltiles[param]) {
            alert(`Une erreur est survenue.`);
            return false;
        }

        const i = ICMAPconfig.ltiles[param].info;
        const u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[param].key);
        updateDateTime(i, true);

        parameterLayer = L.WMS.tileLayer(u, {
            ...DEFAULT_WMS_PARAMS,
            layers: getLayers(param),
            maxZoom: 11,
            minZoom: 1,
        });
        layerGroup.addLayer(bgsat_layer);
        layerGroup.addLayer(parameterLayer);
        layerGroup.addTo(map);

        // adding canvas layer for realtime data
        //strokeLayer.addLayerTo(map);
        strokeLayer = null;
        launchStrokeLive();

        // removing markers
        _displayMarkers = false;
        removeAllMarkers();

        $(`#stroke-data-container`).show(0);
        $(`.blitzortung-note`).show(0);
        $(`.blitzortung-note-btn`).show(0);
        $(`#echelle-foudre-cartedyna`).show(0);
        updateStrokeData(map);
    } else {
        _template = getTemplate(param);

        if (!ICMAPconfig.ltiles[param]) {
            alert(`Une erreur est survenue.`);
            return false;
        }

        const i = ICMAPconfig.ltiles[param].info;
        const u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[param].key);
        updateDateTime(i);

        parameterLayer = L.WMS.tileLayer(u, {
            ...DEFAULT_WMS_PARAMS,
            layers: getLayers(param),
            maxZoom: 11,
            minZoom: 1,
        });
        layerGroup.addLayer(parameterLayer);
        layerGroup.addTo(map);

        _displayMarkers = true;

        // updating markers
        getStationDataAuto();
    }

    // Workaround for https://github.com/elmarquis/Leaflet.GestureHandling/issues/75
    map.whenReady(() => map.gestureHandling?._handleMouseOver?.());
    return false;
}

let _hasFoudreLive = false;
let _displayFoudreAnim = true;
let _foudreIsOverlay = false;
const _overlaysOpacity = {};
const JSONP_CALLBACK = function () {};

function overlayLayer(
    /** @type {string} */ param,
    /** @type {boolean} */ _isBaseLayer
) {
    if (param == `foudre-live`) {
        if (_hasFoudreLive) {
            _noverlays--;

            $(`.superpose-${param}`).html(`[DIRECT] Superposer les derniers`);

            $(`#layer-indicator${param}`).remove();
            if (_noverlays === 0) {
                $(`#all-layers-container`).css(`display`, `none`);
            }
            _hasFoudreLive = false;
            _displayFoudreAnim = false;
            _foudreIsOverlay = false;
            stopStrokeLive();
        } else {
            strokeLayer = null;
            launchStrokeLive();
            removeOldStrokes();

            _noverlays++;
            _hasFoudreLive = true;
            _displayFoudreAnim = true;
            _foudreIsOverlay = true;

            // now we update clicked element
            $(`.superpose-${param}`).html(`[DIRECT] Ne plus superposer`);

            // update layer box
            $(`#all-layers-container ul`).prepend(/*html*/ `
                <li id="layer-indicator${param}">
                    Foudre <span id="layer-indicator-live">[DIRECT]</span>
                    <a
                        class="layers-indicator-delete"
                        href="#"
                        onclick="return overlayLayer('${param}')">
                    </a>
                </li>
            `);

            if ($(`#all-layers-container`).css(`display`) != `block`) {
                $(`#all-layers-container`).css(`display`, `block`);
            }
        }
        return false;
    }

    console.log('overlayLayer', param, _overlays)
    if (param in _overlays) {
        // hide layer
        overlayGroup.removeLayer(_overlays[param]);
        delete _overlays[param];
        _noverlays--;

        // update menu element
        $(`.superpose-${param}`).html(
            /*html*/ `Superposer [${DESC[param]}] &agrave; cette carte`
        );

        // update layer box
        $(`#layer-indicator${param}`).remove();
        if (_noverlays === 0) {
            $(`#all-layers-container`).css(`display`, `none`);
        }

        if (param == `vis` || param == `irA` || param == `radaric`) {
            overlayGroup.removeLayer(coastlines_overlay);
        }

        if (param == `radaric`) {
            overlayGroup.removeLayer(_overlays[`nexrad`]);
        }

        return false;
    }

    let i;
    if (param == `frT` && `MCanalysis` in _overlays) {
        // on cache l'un des deux...
        overlayLayer(`MCanalysis`);
    } else if (param == `MCanalysis` && `frT` in _overlays) {
        overlayLayer(`frT`);
    } else if (param == `estofex`) {
        // special geojson
        i = ICMAPconfig.ltiles[`estofex`].info;
        $.ajax({
            type: `GET`,
            url: `//tempsreel.infoclimat.net/tiles/${i.year}/${i.month}/${i.day}/estofex_${i.hour}.json?callback=?`,
            dataType: `jsonp`,
            jsonpCallback: `JSONP_CALLBACK`,
            success: function (data) {
                _overlays[param] = L.geoJSON(data, {
                    style: function (feature) {
                        return GeoJSON_prop_to_style[
                            feature.properties.estofexType
                        ];
                    },
                    filter: function (feature) {
                        if (feature.geometry.type == `Point`) {
                            return false;
                        }
                        return true;
                    },
                });

                overlayGroup.addLayer(_overlays[param]);
                overlayGroup.addTo(map);
                _overlays[param].bringToFront();
            },
        });
    }

    if (param !== `estofex`) {
        let ltileparam = param;
        if (param == `ac24hradaricval`) {
            ltileparam = `ac24hradaric`;
        }
        if (param == `ac72hradaricval`) {
            ltileparam = `ac72hradaric`;
        }
        const _template = getTemplate(param);
        console.log('overlayLayer', param, _template)
        i = ICMAPconfig.ltiles[ltileparam].info;
        let u = _template
            .replace(`{pkey}`, param)
            .replace(`{py}`, i.year)
            .replace(`{pm}`, i.month)
            .replace(`{pd}`, i.day)
            .replace(`{ph}`, i.hour)
            .replace(`{pi}`, i.minute)
            .replace(`{k}`, ICMAPconfig.ltiles[ltileparam].key);

        if (param == `vis` || param == `irA`) {
            u = u.replace(`:satMO/`, `:satMO2/`);
        }

        console.log('overlayLayer', param, u)

        const isParamUsingWMS = param !== `cities`;
        let layer;
        if (isParamUsingWMS) {
            layer = L.WMS.tileLayer(u, {
                ...DEFAULT_WMS_PARAMS,
                layers: getLayers(param),
                maxZoom: 11,
                minZoom: 1,
            });
        } else {
            layer = L.tileLayer(u, {
                maxZoom: 11,
                minZoom: 1,
            });
        }
        _overlays[param] = layer;

        if (param == `radaric`) {
            const i2 = ICMAPconfig.ltiles[`nexrad`].info;
            const u2 = getTemplate(`nexrad`)
                .replace(`{pkey}`, `nexrad`)
                .replace(`{py}`, i2.year)
                .replace(`{pm}`, i2.month)
                .replace(`{pd}`, i2.day)
                .replace(`{ph}`, i2.hour)
                .replace(`{pi}`, i2.minute)
                .replace(`{k}`, ICMAPconfig.ltiles[`nexrad`].key);
            _overlays[`nexrad`] = L.WMS.tileLayer(u2, {
                ...DEFAULT_WMS_PARAMS,
                layers: getLayers(`nexrad`),
                maxZoom: 11,
                minZoom: 1,
                bounds: getICBounds(_maplimits[`nexrad`]),
            });
            overlayGroup.addLayer(_overlays[`nexrad`]);
        }

        overlayGroup.addLayer(_overlays[param]);
        overlayGroup.addTo(map);

        if (_isBaseLayer === true) {
            _overlays[param].bringToBack();
            if (map.hasLayer(backgroundLayer)) {
                backgroundLayer.bringToBack();
            } else if (map.hasLayer(bgsat_layer)) {
                bgsat_layer.bringToBack();
            }
        } else {
            _overlays[param].bringToFront();
        }

        if (
            param == `vis` ||
            param == `irA` ||
            param == `radaric` ||
            param == `vishdbtrans` ||
            param == `irAhdbtrans`
        ) {
            overlayGroup.addLayer(coastlines_overlay);
            coastlines_overlay.bringToFront();
            _overlays['cities']?.bringToFront();
        }
        //coastlines_overlay.bringToFront();
    }

    _noverlays++;

    // now we update clicked element
    $(`.superpose-${param}`).html(`Ne plus superposer`);

    /** @type {string} */ let dt;
    // update layer box
    if (param == `frT`) {
        dt = `${i.hour}Z${i.minute}h`;
    } else {
        dt = getDateTime(i, true);
    }
    $(`#all-layers-container ul`).prepend(/*html*/ `
        <li style="cursor: move" id="layer-indicator${param}">
            &#8691;
            <div
                style="display: inline-block; width: 30px; margin-bottom: -3px; margin-right: 15px"
                class="slider-sel-opacity"
            ></div>
            ${DESC[param]} (${dt})
            <a
                class="layers-indicator-delete"
                href="#"
                onclick="return overlayLayer('${param}')"
            ></a>
        </li>
    `);

    $(`#all-layers-container`)
        .css(`display`, `block`)
        .find(`ul`)
        .width(200)
        .sortable(`refresh`);

    /** @type {number} */ let op;
    if (param in _overlaysOpacity) {
        op = _overlaysOpacity[param];
        _overlays[param].setOpacity(op / 100);
    } else {
        op = 100;
    }
    $(`#layer-indicator${param} .slider-sel-opacity`).slider({
        min: 0,
        max: 100,
        range: `min`,
        value: op,
        slide: function (event, ui) {
            const name = $(this)
                .parent()
                .attr(`id`)
                .replace(`layer-indicator`, ``);
            _overlays[name].setOpacity(ui.value / 100);
            _overlaysOpacity[name] = ui.value;
        },
    });

    return false;
}

$(`#all-layers-container ul`)
    .sortable({
        placeholder: `ui-state-highlight`,
        forcePlaceholderSize: true,
        axis: `y`,
        forceHelperSize: true,
        cursor: `move`,
        update: function (event, ui) {
            const arr = $(this).sortable(`toArray`);
            const copy = {};

            for (let i = arr.length - 1; i >= 0; i--) {
                const k = arr[i].replace(`layer-indicator`, ``);
                if (k != `foudre-live`) {
                    _overlays[k].bringToFront();
                    copy[k] = _overlays[k];
                }
            }
            _overlays = copy;
        },
    })
    .disableSelection();

//const _anim_interval = 2000; // 200
//const _anim_delay = 700; // 700
const _anim_interval = 700;
const _anim_delay = 250;

const _opT = 50;
//const _opI = 0.06;
const _opI = _opT / (_anim_interval / 2);

let _l1opacity = 1;
function fadeInLayer1() {
    if (_l1opacity >= 1) {
        _l1opacity = 1;
        parameterLayer.setOpacity(1);
        return false;
    }
    setTimeout(function () {
        _l1opacity += _opI;
        parameterLayer.setOpacity(_l1opacity);
        fadeInLayer1();
    }, _opT);
}
function fadeOutLayer1() {
    if (_l1opacity <= 0) {
        _l1opacity = 0;
        parameterLayer.setOpacity(0);
        return false;
    }
    setTimeout(function () {
        _l1opacity -= _opI;
        parameterLayer.setOpacity(_l1opacity);
        fadeOutLayer1();
    }, _opT);
}

let _l2opacity = 0;
function fadeInLayer2() {
    if (_l2opacity >= 1) {
        _l2opacity = 1;
        parameterLayer2.setOpacity(1);
        return false;
    }
    setTimeout(function () {
        _l2opacity += _opI;
        parameterLayer2.setOpacity(_l2opacity);
        fadeInLayer2();
    }, _opT);
}
function fadeOutLayer2() {
    if (_l2opacity <= 0) {
        _l2opacity = 0;
        parameterLayer2.setOpacity(0);
        return false;
    }
    setTimeout(function () {
        _l2opacity -= _opI;
        parameterLayer2.setOpacity(_l2opacity);
        fadeOutLayer2();
    }, _opT);
}
/** @type {L.TileLayer|null} */
let parameterLayer2 = null;
function animateParamFromMap(
    /** @type {number|false} */ iteration,
    /** @type {boolean} */ preload
) {
    // stopping animation
    if (iteration === false) {
        updateParamFromMap(_currentparam);
        return false;
    }

    // back to start...
    if (!ICMAPconfig.lanim[_currentparam]) {
        return false;
    }
    if (iteration >= ICMAPconfig.lanim[_currentparam].length) {
        iteration = 0;
    }
    iteration++;

    if (preload === true) {
        // preloading tiles
    }

    const i = ICMAPconfig.lanim[_currentparam][iteration - 1];

    $(`.datetime-anim-bar div`).animate(
        {
            width: `${
                ((iteration - 1) /
                    (ICMAPconfig.lanim[_currentparam].length - 1)) *
                100
            }%`,
        },
        (_anim_interval * 2) / 3
    );

    updateDateTime(i, true);

    const u = _template
        .replace(`{pkey}`, _currentparam)
        .replace(`{py}`, i.year)
        .replace(`{pm}`, i.month)
        .replace(`{pd}`, i.day)
        .replace(`{ph}`, i.hour)
        .replace(`{pi}`, i.minute)
        .replace(`{k}`, i.k);

    if (iteration % 2 !== 0) {
        if (!parameterLayer2) {
            parameterLayer2 = L.WMS.tileLayer(u, {
                ...DEFAULT_WMS_PARAMS,
                layers: getLayers(_currentparam),
                maxZoom: 11,
                minZoom: 1,
                opacity: 0,
            }).addTo(map);
        } else {
            parameterLayer2.setUrl(u).setOpacity(0);
        }

        parameterLayer2.bringToFront();
        fadeInLayer2();
        setTimeout(fadeOutLayer1, _anim_delay);
    } else {
        parameterLayer2.bringToFront().setOpacity(1);
        parameterLayer.setUrl(u) /*.setOpacity(1)*/;
        setTimeout(fadeOutLayer2, _anim_delay);
        fadeInLayer1();
    }

    cTimeout = setTimeout(function () {
        animateParamFromMap(iteration);
    }, _anim_interval);
}

/** @type {NodeJS.Timeout|null} */
let _hover_timeout = null;
let markers = [];
let nmarkers = 0;
let _displayMarkers = true;
function removeAllMarkers() {
    for (let i = 0; i < nmarkers; i++) {
        map.removeLayer(markers[i]);
    }
    nmarkers = 0;
    markers = [];
}

let _bindedMarker = false;
let _markersCache = {};
function getStationData(
    north,
    south,
    east,
    west,
    zoom,
    year,
    month,
    day,
    hour
) {
    if (!_displayMarkers) {
        return false;
    }
    $(`#preloader-loading`).show(0);

    const _lastd = ICMAPconfig.ltiles[_currentparam].info;

    const json = `//mobile-api.infoclimat.fr/v1.0/internal/-/get/carte/station?callback=?`;
    jQuery.getJSON(
        json,
        {
            north: north,
            south: south,
            east: east,
            west: west,
            z: zoom,
            year: _lastd.year,
            month: _lastd.month,
            day: _lastd.day,
            hour: _lastd.hour,
            unique_token: ICMAPtoken,
            param: _currentparam,
        },
        function (jsondata) {
            removeAllMarkers();

            jQuery.each(jsondata.DATA, function (k, v) {
                markers[nmarkers] = L.marker([v.lat, v.lon], {
                    riseOnHover: true,
                    icon: L.icon({
                        iconUrl: v.icon,
                        iconSize: v.size,
                        iconAnchor: v.anchor,
                    }),
                })
                    .addTo(map)
                    .on(`mouseover`, function (e) {
                        const url = `//mobile-api.infoclimat.fr/v1.0/internal/-/get/carte/station/get?year=${_lastd.year}&month=${_lastd.month}&day=${_lastd.day}&hour=${_lastd.hour}&id=${v.id}&unique_token=${ICMAPtoken}&callback=?`;

                        if (`${v.id}/${_lastd.hour}` in _markersCache) {
                            $(`#leaflet-legend`)
                                .css({
                                    display: `block`,
                                    top: e.originalEvent.pageY + 7,
                                    left: e.originalEvent.pageX + 7,
                                })
                                .html(
                                    stationDataToHTML(
                                        _markersCache[`${v.id}/${_lastd.hour}`]
                                    )
                                );
                            _bindedMarker = true;
                            return false;
                        }

                        _hover_timeout = setTimeout(function () {
                            jQuery.getJSON(url, function (d) {
                                $(`#leaflet-legend`)
                                    .css({
                                        display: `block`,
                                        top: e.originalEvent.pageY + 7,
                                        left: e.originalEvent.pageX + 7,
                                    })
                                    .html(stationDataToHTML(d));

                                _markersCache[`${v.id}/${_lastd.hour}`] = d;
                                _bindedMarker = true;
                            });
                        }, 200);
                    })
                    .on(`mouseout`, function () {
                        if (_hover_timeout) {
                            clearTimeout(_hover_timeout);
                        }
                        $(`#leaflet-legend`).css(`display`, `none`);
                        _bindedMarker = false;
                    })
                    .on(`click`, function () {
                        if (v._ty == `bouees`) {
                            window.open(`/mer/bouees.php?id=${v._uid}&jour=${_lastd.year}${_lastd.month}${_lastd.day}#highlight=${_lastd.hour}`, '_blank');
                        } else {
                            window.open(`/stations-meteo/?s=${v._uid}&d=${_lastd.year}-${_lastd.month}-${_lastd.day}#highlight=${_lastd.hour}`, '_blank');
                        }
                    });
                nmarkers++;
            });

            $(`#preloader-loading`).hide(0);
        }
    );
}
map.on(`mousemove`, function (d) {
    if (!_bindedMarker) {
        return false;
    }
    $(`#leaflet-legend`).css({
        top: d.containerPoint.y + 7 + $(`#accueil-cartedynamique`).offset().top,
        left:
            d.containerPoint.x + 7 + $(`#accueil-cartedynamique`).offset().left,
    });
});

const MAmarkersAssoc = [];
function getUserData(
    north,
    south,
    east,
    west,
    zoom,
    year,
    month,
    day,
    hour,
    webcams
) {
    if (!_displayMarkers) {
        return false;
    }

    $(`#preloader-loading`).show(0);
    const _lastd = ICMAPconfig.ltiles[`meteoalerte`].info;

    const json = `//mobile-api.infoclimat.fr/v1.0/internal/-/get/carte/observations?callback=?`;
    jQuery.getJSON(
        json,
        {
            north: north,
            south: south,
            east: east,
            west: west,
            z: zoom,
            year: _lastd.year,
            month: _lastd.month,
            day: _lastd.day,
            hour: _lastd.hour,
            unique_token: ICMAPtoken,
            webcams: webcams,
            intelligent_cluster: 1,
            shadow: 1,
        },
        function (jsondata) {
            for (let i = 0; i < nmarkers; i++) {
                map.removeLayer(markers[i]);
            }
            nmarkers = 0;
            markers = [];

            jQuery.each(jsondata.DATA, function (k, v) {
                const intid = parseInt(v.id.substring(3), 10);
                MAmarkersAssoc[nmarkers] = intid;
                if (window.MAobsModerated) {
                    if (MAobsModerated.indexOf(intid) !== -1) {
                        // obs modérée
                        console.log(`obs moderated from stream`);
                        return;
                    }
                }
                markers[nmarkers] = L.marker([v.lat, v.lon], {
                    riseOnHover: true,
                    icon: L.icon({
                        iconUrl: v.icon,
                        iconSize: v.size,
                        iconAnchor: v.anchor,
                    }),
                })
                    .addTo(map)
                    .on(`mouseover`, function (e) {
                        const url = `//mobile-api.infoclimat.fr/v1.0/internal/-/get/observation?thumb_width=200&thumb_height=100&id=${v.id}&unique_token=${ICMAPtoken}&callback=?`;

                        if (`${v.id}/${v.type}/${v.time}` in _markersCache) {
                            $(`#leaflet-legend`)
                                .css({
                                    display: `block`,
                                    top: e.originalEvent.pageY + 7,
                                    left: e.originalEvent.pageX + 7,
                                })
                                .html(
                                    userDataToHTML(
                                        _markersCache[
                                            `${v.id}/${v.type}/${v.time}`
                                        ]
                                    )
                                );
                            _bindedMarker = true;
                            return false;
                        }

                        _hover_timeout = setTimeout(function () {
                            jQuery.getJSON(url, function (d) {
                                d.DATA[`type`] = v.type;
                                $(`#leaflet-legend`)
                                    .css({
                                        display: `block`,
                                        top: e.originalEvent.pageY + 7,
                                        left: e.originalEvent.pageX + 7,
                                    })
                                    .html(userDataToHTML(d.DATA));

                                _markersCache[`${v.id}/${v.type}/${v.time}`] =
                                    d.DATA;
                                _bindedMarker = true;
                            });
                        }, 200);
                    })
                    .on(`mouseout`, function () {
                        if (_hover_timeout) {
                            clearTimeout(_hover_timeout);
                        }
                        $(`#leaflet-legend`).css(`display`, `none`);
                        _bindedMarker = false;
                    })
                    .on(`click`, function () {
                        if (v.stid && v.stid.length > 1) {
                            // station auto
                            window.open(
                                `//www.infoclimat.fr/stations-meteo/?s=${
                                    v.stid
                                }&d=${v.time.substring(0, 10)}`
                            );
                        } else if (v[`type`] == `WC`) {
                            // webcam
                            const id_wc = v[`id`].split(`:`)[1];
                            window.open(
                                `//www.infoclimat.fr/annuaire-webcams-meteo.html#${id_wc}`
                            );
                        } else {
                            window.open(
                                `//www.infoclimat.fr/meteo-alerte-temps-reel.html#details`
                            );
                        }
                    });
                nmarkers++;
            });

            $(`#preloader-loading`).hide(0);
        }
    );
}

function getStationDataAuto(nothing) {
    const b = map.getBounds();
    const sw = b.getSouthWest().wrap();
    const ne = b.getNorthEast().wrap();
    getStationData(ne.lat, sw.lat, ne.lng, sw.lng, map.getZoom());
}

function getUserDataAuto(und, webcams) {
    const b = map.getBounds();
    const sw = b.getSouthWest().wrap();
    const ne = b.getNorthEast().wrap();
    getUserData(
        ne.lat,
        sw.lat,
        ne.lng,
        sw.lng,
        map.getZoom(),
        2014,
        7,
        11,
        9,
        webcams
    );
}

function pulseLayer(
    /** @type {number} */ lat,
    /** @type {number} */ lng,
    /** @type {number} */ radius
) {
    // const raph = new R.Pulse(
    //     [lat, lng],
    //     radius,
    //     {stroke: '#0000FF', fill: '#FF0033'},
    //     {stroke: '#0000FF', "stroke-width": 2}
    // );
    const raph = new R.Pulse(
        [lat, lng],
        radius,
        { stroke: `#FFFFFF`, fill: `#FF0033` },
        { stroke: `#FFFFFF`, 'stroke-width': 2 }
    );
    map.addLayer(raph);
    setTimeout(function () {
        map.removeLayer(raph);
    }, 2000);

    if (
        lat >= _currentMapBounds[0].lat &&
        lat <= _currentMapBounds[1].lat &&
        lng >= _currentMapBounds[0].lng &&
        lng <= _currentMapBounds[1].lng
    ) {
        newStrokes++;
    }
}

const st_buffers = {};

const _stroke_delay = 60 + 60;
const _utcdecals = new Date().getTimezoneOffset() * 60;

/** @type {number} */
let maxtime_t;
if (ICMAPconfig.ltiles[`foudre`]) {
    maxtime_t = ICMAPconfig.ltiles.foudre.info.last_stroke - _stroke_delay;
} else {
    maxtime_t = ICMAPconfig.ltiles.meteoalerte.info.last_stroke - _stroke_delay;
}

let _reftime =
    Math.floor(new Date().getTime() / 1000) - _stroke_delay + _utcdecals;

let _needredraw = false;
function testBLZ(/** @type {string} */ text, id, channel) {
    const data = JSON.parse(text);
    try {
        if (data.t <= maxtime_t) {
            // stroke already displayed on map
            return false;
        }

        if (data.t <= _reftime) {
            // stroke not displayed in map, but before reference time
            if (strokeLayer) {
                strokeLayer.addPoint({ slat: data.la, slon: data.lo });
            }
            _needredraw = true;
        } else {
            if (st_buffers[data.t] === undefined) {
                st_buffers[data.t] = [{ slat: data.la, slon: data.lo }];
            } else {
                st_buffers[data.t].push({ slat: data.la, slon: data.lo });
            }
        }
    } catch (e) {}
}

/** @type {NodeJS.Timeout|null} */
let _strokeTimeout1 = null;
/** @type {NodeJS.Timeout|null} */
let _strokeTimeout2 = null;
function launchStrokeLive() {
    if (!strokeLayer) {
        strokeLayer = new StrokeLayer();
        strokeLayer.p_init();
        strokeLayer.addLayerTo(map);
    }

    _strokeTimeout1 = setInterval(function () {
        const t =
            Math.floor(new Date().getTime() / 1000) -
            _stroke_delay +
            _utcdecals;
        _reftime = t;
        if (st_buffers[t] !== undefined) {
            st_buffers[t].forEach(function (v) {
                strokeLayer.addPoint(v);
                if (_displayFoudreAnim) {
                    pulseLayer(v.slat, v.slon, 4);
                }
            });
            strokeLayer.redraw();
            _needredraw = false;
            delete st_buffers[t];
        } else if (_needredraw) {
            strokeLayer.redraw();
            _needredraw = false;
        }
    }, 200);
    _strokeTimeout2 = setInterval(function () {
        const t = Math.floor(new Date().getTime() / 1000) - _stroke_delay;
        const d = new Date(t * 1000);

        const min = d.getMinutes().toString().padStart(2, `0`);
        const sec = d.getSeconds().toString().padStart(2, `0`);

        if (_foudreIsOverlay) {
            $(`#layer-indicator-live`).html(`[${d.getHours()}:${min}:${sec}]`);
        } else {
            $(`.datetime-chgid`).html(/*html*/ `
                ${d.getHours()}:${min}<span class="datetime-seconds">:${sec}</span>
            `);
        }

        // update graph foudre
        $(`#stroke-data-count`).html(`${totalstrokes}${newStrokes}/6h`);
        /* let maxValue = 0,
            lastValue = 0;
        $(".stroke-bar-data").each(function () {
            const value = ($(this).height() / 60) * _lastStrokeMax;
            maxValue = Math.max(maxValue, value);
            lastValue = value;
        });
        const oldMaxValue = maxValue * 1.0;
        if (lastValue + newStrokes > maxValue)
            maxValue = lastValue + newStrokes;
        $("#stroke-data .stroke-bar-data:last-child").height(
            Math.round(((lastValue + newStrokes) * 60) / maxValue)
        );

        if (maxValue > oldMaxValue) {
            $(".stroke-bar-data").each(function () {
                const value = ($(this).height() / 60) * _lastStrokeMax;
                if (value == lastValue + newStrokes) return false;
                $(this).height(Math.round((value * 60) / maxValue));
            });
        } */
    }, 1000);
}
function stopStrokeLive() {
    if (_strokeTimeout1 && _strokeTimeout2) {
        clearInterval(_strokeTimeout1);
        clearInterval(_strokeTimeout2);
        _strokeTimeout1 = null;
        _strokeTimeout2 = null;

        if (strokeLayer && map.hasLayer(strokeLayer)) {
            map.removeLayer(strokeLayer);
        }

        map._panes.staticPane = false;
        strokeLayer = null;
    }
}

function removeOldStrokes() {
    // removing some old strokes
    // and cleaning buffers
    if (!strokeLayer) {
        return false;
    }

    strokeLayer.removeData();
    for (const key in st_buffers) {
        if (key <= maxtime_t) {
            // strokes already displayed on map
            delete st_buffers[key];
        } else {
            st_buffers[key].forEach(function (v) {
                strokeLayer.addPoint(v);
            });
        }
    }
    strokeLayer.redraw();
}

const ddd = new Date().getTime() - 5 * 60 * 1000;

// TODO:
// const pushstream2 = new PushStream({
//     host: `tempsreel.infoclimat.net`,
//     //port: `80`,
//     modes: `websocket|eventsource|stream`,
//     urlPrefixLongpolling: `/push-subscribe/lp`,
//     urlPrefixEventsource: `/push-subscribe/ev`,
//     urlPrefixWebsocket: `/push-subscribe/ws`,
//     urlPrefixStream: `/push-subscribe/sub`,
//     messagesPublishedAfter: new Date(ddd),
//     messagesControlByArgument: true,
//     useJSONP: true,
//     timeout: 30000,
//     useSSL: true,
// });
// pushstream2.onmessage = testBLZ;
// pushstream2.addChannel(`foudre-live`);
// pushstream2.connect();

let totalstrokes = 0;
let newStrokes = 0;
let _lastStrokeMax = 0;
function updateStrokeData(/** @type {L.Map} */ map) {
    if (_currentparam !== `foudre`) {
        return false;
    }

    const b = map.getBounds();
    const sw = b.getSouthWest().wrap();
    const ne = b.getNorthEast().wrap();

    $(`#preloader-loading`).show(0);

    $.getJSON(
        `//www.infoclimat.fr/cartes/stats_foudre.php?callback=?`,
        {
            north: ne.lat,
            south: sw.lat,
            east: ne.lng,
            west: sw.lng,
        },
        function (d) {
            _lastStrokeMax = d.meta.max;
            let tmp = ``;
            let c = 0;
            jQuery.each(d.data, function (k, v) {
                const t = new Date(v.tst * 1000 + 60 * 10 * 1000);
                const t10 = new Date(v.tst * 1000);
                tmp += /*html*/ `
                    <div
                        title="<b>sur cette zone</b><br>${
                            v.c
                        } d&eacute;tections<br />entre ${t10.getHours()}h${t10.getMinutes()} et ${t.getHours()}h${t.getMinutes()}"
                        class="stroke-bar-data"
                        style="height: ${Math.round(
                            (v.c / d.meta.max) * 60
                        )}px;"
                    ></div>
                `;
                c += v.c;
            });

            totalstrokes = c;
            newStrokes = 0;
            $(`#stroke-data`).html(tmp);
            $(`#stroke-data-count`).html(`${c}/${d.meta.h}h`);
            $(`.stroke-bar-data`).tipsy({ gravity: `s`, html: true });
            $(`#preloader-loading`).hide(0);
        }
    );
}

function checkUpdates() {
    $.getJSON(
        `//www.infoclimat.fr/accueil/checkupdates.php?callback=?`,
        { token: ICMAPtoken, t: new Date().getTime() },
        function (d) {
            ICMAPconfig.ltiles[`cities`] = ICMAPconfig.ltiles[`meteoalerte`];

            if (ICMAPconfig.ltiles[_currentparam]) {
                if (
                    ICMAPconfig.ltiles[_currentparam].key !==
                        d.ltiles[_currentparam].key ||
                    ICMAPconfig.ltiles[_currentparam].info.minute !==
                        d.ltiles[_currentparam].info.minute ||
                    ICMAPconfig.ltiles[_currentparam].info.hour !==
                        d.ltiles[_currentparam].info.hour
                ) {
                    // needs an update !
                    ICMAPconfig = d;
                    const bakoverlays = [];
                    for (const k in _overlays) {
                        bakoverlays.push(k);
                    }
                    console.log(bakoverlays);
                    updateParamFromMap(_currentparam, true);

                    // on remet les overlays
                    ICMAPconfig.ltiles[`cities`] =
                        ICMAPconfig.ltiles[`meteoalerte`];
                    for (let i = 0; i < bakoverlays.length; i++) {
                        if (
                            bakoverlays[i] === `foudre-live`
                            || bakoverlays[i] == `nexrad`
                            || bakoverlays[i] == `cities`
                        ) {
                            continue;
                        }
                        overlayLayer(bakoverlays[i], false);
                    }

                    // on restart le foudre live
                    if (_foudreIsOverlay) {
                        _hasFoudreLive = false;
                        overlayLayer(`foudre-live`);
                    }
                }
            }

            ICMAPconfig = d;

            ICMAPconfig.ltiles[`cities`] = ICMAPconfig.ltiles[`meteoalerte`];

            // last stroke
            if (ICMAPconfig.ltiles.foudre) {
                const cur_maxtime_t =
                    ICMAPconfig.ltiles.foudre.info.last_stroke - _stroke_delay;
                if (_currentparam === `foudre` && cur_maxtime_t > maxtime_t) {
                    maxtime_t = cur_maxtime_t;
                    removeOldStrokes();
                }
            }

            // clearing marker cache
            _markersCache = {};

            setTimeout(checkUpdates, 20000);
        }
    );
    return true;
}

async function getPhotolives() {
    try {
        let response = await fetch('/photolive/getMapDataAccueil.php');
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return null;
    }
}

function adjustDuplicateCoordinates(photolives) {
	let coordMap = new Map();
	const adjustments = [
		{ lat:  0, lon:  0 },         // 1. Centre
		{ lat:  0.009, lon:  0 },     // 2. Nord
		{ lat: -0.009, lon:  0 },     // 3. Sud
		{ lat:  0,     lon:  0.013 }, // 4. Est
		{ lat:  0,     lon: -0.013 }, // 5. Ouest
		{ lat:  0.009, lon:  0.013 }, // 6. Nord-Est
		{ lat:  0.009, lon: -0.013 }, // 7. Nord-Ouest
		{ lat: -0.009, lon:  0.013 }, // 8. Sud-Est
		{ lat: -0.009, lon: -0.013 }  // 9. Sud-Ouest
	];
	photolives.forEach(point => {
		let key = `${point.latitude},${point.longitude}`;
		if (!coordMap.has(key)) {
			coordMap.set(key, []);
		}
		coordMap.get(key).push(point);
	});
	coordMap.forEach(points => {
        points.reverse(); // most recent photos first
		points.forEach((point, index) => {
			if (index < adjustments.length) {
				point.latitude  += adjustments[index].lat;
				point.longitude += adjustments[index].lon;
			}
		});
	});
	return photolives;
}
