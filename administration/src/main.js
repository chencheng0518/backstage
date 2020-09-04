import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import '../src/assets/css/global.css'
// 导入字体图标
import '../src/assets/fonts/iconfont.css'
import './plugins/element.js'
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://server.sineava.top/api/private/v1/'
// axios请求拦截器，会在发起axios请求时触发
axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
