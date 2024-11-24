import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/expenses'
  },
  {
    path: '/folder/:id',
    component: () => import ('../views/FolderPage.vue')
  },
  {
    path: '/trips',
    component: () => import ('../pages/Trips.vue')
  },
  {
    path: '/users',
    component: () => import ('../pages/Users.vue')
  },
  {
    path: '/categories',
    component: () => import ('../pages/Categories.vue')
  },
  {
    path: '/allexpenses',
    component: () => import ('../pages/AllExpenses.vue')
  },
  {
    path: '/expenses',
    component: () => import ('../pages/Expenses.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
