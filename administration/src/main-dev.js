import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import '../src/assets/css/global.css'
// 导入字体图标
import '../src/assets/fonts/iconfont.css'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 引入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://server.sineava.top/api/private/v1/'
// axios请求拦截器，会在发起axios请求时触发
axios.interceptors.request.use(config => {
  // 在request拦截器中，展示进度条 NProgress.start()
  NProgress.start()
  // 为请求头对象，添加token验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})

// 在response 拦截器中，隐藏进度条  NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.component('tree-table', TreeTable)
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 全局过滤器，年月日时分秒
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  // 年
  const y = dt.getFullYear()
  // 月
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // 日
  const d = (dt.getDate() + 1 + '').padStart(2, '0')
  // 时
  const hh = (dt.getHours() + 1 + '').padStart(2, '0')
  // 分
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
  // 秒
  const ss = (dt.getMinutes() + 1 + '').padStart(2, '0')
  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})

// 在全局注册富文本编辑器
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
