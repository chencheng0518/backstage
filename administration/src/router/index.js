import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
const Login = () => import(/* webpackChunkName: "login-home-welcome" */'../pages/login/login.vue')
const Home = () => import(/* webpackChunkName: "login-home-welcome" */'../pages/home/home.vue')
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */'../components/welcome.vue')

// 商品管理
const Categories = () => import(/* webpackChunkName: "categories-goods-params-AddItem" */'../components/commodity/categories.vue')
const Goods = () => import(/* webpackChunkName: "categories-goods-params-AddItem" */'../components/commodity/goods.vue')
const Params = () => import(/* webpackChunkName: "categories-goods-params-AddItem" */'../components/commodity/params.vue')
const AddItem = () => import(/* webpackChunkName: "categories-goods-params-AddItem" */'../components/commodity/AddItem/AddItem.vue')

// 权限管理
const Rights = () => import(/* webpackChunkName: "jurisdiction" */'../components/jurisdiction/rights.vue')
const Roles = () => import(/* webpackChunkName: "jurisdiction" */'../components/jurisdiction/roles.vue')

// 订单管理
const Orders = () => import(/* webpackChunkName: "order" */'../components/order/orders.vue')

// 用户管理
const User = () => import(/* webpackChunkName: "user" */'../components/user/user.vue')

// 数据统计
const Reports = () => import(/* webpackChunkName: "reports" */'../components/Statistics/reports.vue')

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
      },
      {
        path: '/addItem',
        component: AddItem
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
