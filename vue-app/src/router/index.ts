import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ],
})

export default router
