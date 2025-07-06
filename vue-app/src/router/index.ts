import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/opendata',
      name: 'opendata',
      component: () => import('../pages/opendata/page.vue'),
    },
  ],
})

export default router
