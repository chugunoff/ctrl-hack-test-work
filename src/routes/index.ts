import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    name: 'without-store',
    path: '/',
    component: () => import('../views/WithoutStoreView.vue'),
  },
  {
    name: 'with-store',
    path: '/with-store',
    component: () => import('../views/WithStoreView.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
