import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/login/login.vue'
import Home from '../pages/home/home.vue'
import Welcome from '../components/welcome.vue'
import Categories from '../components/commodity/categories.vue'
import Goods from '../components/commodity/goods.vue'
import Params from '../components/commodity/params.vue'
import Rights from '../components/jurisdiction/rights.vue'
import Roles from '../components/jurisdiction/roles.vue'
import Orders from '../components/order/orders.vue'
import User from '../components/user/user.vue'
import Reports from '../components/Statistics/reports.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to：将要访问的路径
  // from：代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行 next('/login) 表示强制跳转到login页面
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
