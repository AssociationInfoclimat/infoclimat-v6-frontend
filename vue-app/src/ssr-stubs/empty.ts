const noop = () => ({})
const proxy: any = new Proxy(noop, {
  get: () => proxy,
  apply: () => proxy,
})

export default proxy
export const GestureHandling = proxy
