import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  // 导入弹窗提示框组件
  Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message需要全局挂载到vue上
Vue.prototype.$message = Message
