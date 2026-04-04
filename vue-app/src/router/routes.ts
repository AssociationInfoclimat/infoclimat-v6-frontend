import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/homepage/page.vue'),
  },
  {
    path: '/opendata',
    name: 'opendata',
    component: () => import('../pages/opendata/page.vue'),
  },
]
