import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Current from '../views/Current.vue'
import Ideal from '../views/Ideal.vue'
import Compare from '../views/Compare.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/current',
    name: 'Current',
    component: Current
  },
  {
    path: '/ideal',
    name: 'Ideal',
    component: Ideal
  },
  {
    path: '/compare',
    name: 'Compare',
    component: Compare
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
