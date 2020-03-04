import Vue from 'vue'
import Router from 'vue-router'

import Index from './pages/index'
import Incomes from './pages/Incomes/incomes'
import Expenses from './pages/expenses/expenses'
import HowItsWork from './pages/about/howItsWork'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        name: "login",
        path: '/login',
        component: Login
      },
      {
        name: "incomes",
        path: '/incomes',
        component: Incomes
      },
      {
        name: "register",
        path: '/register',
        component: Register
      },
      {
        name: "expenses",
        path: '/expenses',
        component: Expenses
      },
      {
        name: "howItsWork",
        path: '/howItsWork',
        component: HowItsWork
      },
      {
        name: "home",
        path: '/',
        component: Index
      }
    ]
  })
}
