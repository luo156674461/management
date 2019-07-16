import Vue from 'vue'

// A modern alternative to CSS resets
import 'normalize.css/normalize.css'

import 'babel-polyfill'

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// iView
import iView from 'iview'
import 'iview/dist/styles/iview.css'

// global css
import '@/styles/index.scss'

// echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// app
import App from './App'
import router from './router'
import store from './store'

// api
import Bmob from 'hydrogen-js-sdk'
Bmob.initialize('e28e068e28210be6da96477396b61f13', 'e8dcaa830fd939df9079ed0d7a998ea6', 'e5768007486c79a400f34e9fa383ef68')
Vue.prototype.Bmob = Bmob

import api from './api/http'
Vue.prototype.$api = api

//  this.$des.encrypt()   this.$des.decrypt()
import des from './tools'
Vue.prototype.$des = des

// icon
import '@/icons'

// permission
import '@/permission'

// simulation data
// import './mock'

Vue.use(ElementUI, { locale })
Vue.use(iView)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
