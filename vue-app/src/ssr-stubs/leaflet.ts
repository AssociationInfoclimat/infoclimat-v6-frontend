const noop = () => ({})
const noopChain = () => proxy
const proxy: any = new Proxy(noop, {
  get: () => noopChain,
  apply: () => proxy,
})

export default proxy
export const tileLayer = proxy
export const marker = proxy
export const map = proxy
export const icon = proxy
export const featureGroup = proxy
export const latLngBounds = proxy
