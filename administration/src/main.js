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
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
