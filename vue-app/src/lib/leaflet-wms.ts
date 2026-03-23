/**
 * Plugin [leaflet.wms](https://github.com/heigeo/leaflet.wms) — couches WMS (tuilé, single-tile, source partagée, GetFeatureInfo).
 *
 * Exemples :
 * ```ts
 * import { wms } from '@/lib/leaflet-wms'
 * wms.tileLayer('https://example.com/mapserv', { layers: 'layer1', transparent: true }).addTo(map)
 * const source = wms.source('https://example.com/mapserv', { transparent: true })
 * source.getLayer('layer1').addTo(map)
 * ```
 */
import wms from 'leaflet.wms'

export { wms }
