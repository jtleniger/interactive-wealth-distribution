import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import GuessCurrent from '../views/GuessCurrent.vue'
import Ideal from '../views/Ideal.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/guess-current',
    name: 'GuessCurrent',
    component: GuessCurrent
  },
  {
    path: '/ideal',
    name: 'Ideal',
    component: Ideal
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
