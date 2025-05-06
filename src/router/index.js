import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/pages/Index.vue'),
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('@/pages/Form.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/Settings.vue'),
    },
  ],
})

export default router
