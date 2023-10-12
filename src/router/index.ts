import { createRouter, createWebHistory } from 'vue-router'
import CheckoutView from '../views/CheckoutView.vue'
import SearchView from '../views/SearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'base',
      redirect: 'search',
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/checkout/:guid',
      name: 'checkout',
      component: CheckoutView,
    }
  ]
})

export default router
