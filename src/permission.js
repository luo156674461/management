import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import api from './api/http'
import * as types from './store/mutation-types'
Vue.prototype.$api = api
import des from './tools'
Vue.prototype.$des = des
// const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  // 登入清除信息
  if (to.path === '/login') {
    sessionStorage.removeItem('labelArr')
    sessionStorage.removeItem('mass')
    sessionStorage.removeItem('key')
    sessionStorage.removeItem('rowInfo')
    sessionStorage.removeItem('arrNum')
    sessionStorage.removeItem('tallyOneKey')
    store.commit('OFFGAINTALLONE')
    // store.commit('navDis')
    next()
  } else {
    // store.commit('navApp')
  }
  if (to.path === '/userinfo' || to.path === '/vehicle' || to.path === '/moneyflow' || to.path === '/finance' || to.path === '/homepage' || to.path === '/login') {
    store.commit('OFFGAINTALLWEN')
  } else {
    store.commit('OPENGAINTALLWEN')
  }
  if (to.path === '/homepage' || to.path === '/' || to.path === '/login') {
    store.commit('OFFGAINTALLONE')
  } else {
    store.commit('OPENGAINTALLONE')
  }
  if (to.path === '/finance/client' || to.path === '/finance/vehicle' || to.path === '/finance/running' || to.path === '/finance/deposit' || to.path === '/finance/userrent' || to.path === '/finance/catrent' || to.path === '/homepage' || to.path === '/finance' || to.path === '/userinfo' || to.path === '/vehicle' || to.path === '/moneyflow' || to.path === '/login' || to.path === '/userinfo/carinfo' || to.path === '/userinfo/moneyinfo' || to.path === '/userinfo/particular' || to.path === '/userinfo/threatened' || to.path === '/vehicle/bindinghistory' || to.path === '/vehicle/threatened' || to.path === '/vehicle/regulations') {
    store.commit('OFFGAINTALLTHREE')
  } else {
    store.commit('OPENGAINTALLTHREE')
  }
  if (to.path === '/finance') {
    store.commit('GAINTALLONE', 4)
    if (to.path === '/finance/client') {
      store.commit('GAINTALLWEN', 0)
    } else if (to.path === '/finance/vehicle') {
      store.commit('GAINTALLWEN', 1)
    } else if (to.path === '/finance/running') {
      store.commit('GAINTALLWEN', 2)
    } else if (to.path === '/finance/deposit') {
      store.commit('GAINTALLWEN', 3)
    } else if (to.path === '/finance/userrent') {
      store.commit('GAINTALLWEN', 4)
    } else if (to.path === '/finance/catrent') {
      store.commit('GAINTALLWEN', 5)
    }
  }
  if (to.path === '/finance/vehicle/bindinghistory') {
    store.commit('GAINTALLONE', 4)
    store.commit('GAINTALLWEN', 1)
    store.commit('GAINTALLTHREE', 0)
  } else if (to.path === '/finance/vehicle/threatened') {
    store.commit('GAINTALLONE', 4)
    store.commit('GAINTALLWEN', 1)
    store.commit('GAINTALLTHREE', 1)
  } else if (to.path === '/finance/vehicle/regulations') {
    store.commit('GAINTALLONE', 4)
    store.commit('GAINTALLWEN', 1)
    store.commit('GAINTALLTHREE', 2)
  }
  if (to.path === '/finance/client/carinfo') {
    store.commit('GAINTALLONE', 4)
    store.commit('GAINTALLWEN', 0)
    store.commit('GAINTALLTHREE', 0)
  } else if (to.path === '/finance/client/moneyinfo') {
    store.commit('GAINTALLONE', 4)
    store.commit('GAINTALLWEN', 0)
    store.commit('GAINTALLTHREE', 1)
  } else if (to.path === '/finance/client/particular') {
    store.commit('GAINTALLONE', 4)
    store.commit('GAINTALLWEN', 0)
    store.commit('GAINTALLTHREE', 2)
  }
  if (to.path === '/finance/deposit/periodinfo') {
    store.commit('GAINTALLONE', 4)
    store.commit('GAINTALLWEN', 3)
    store.commit('GAINTALLTHREE', 0)
  }
  if (to.path === '/finance/userrent/history') {
    store.commit('GAINTALLONE', 4)
    store.commit('GAINTALLWEN', 4)
    store.commit('GAINTALLTHREE', 0)
  }
 if (to.path === '/finance/catrent/history') {
    store.commit('GAINTALLONE', 4)
    store.commit('GAINTALLWEN', 5)
    store.commit('GAINTALLTHREE', 0)
  }
  if (to.path === '/vehicle') {
    store.commit('GAINTALLONE', 2)
  }
  if (to.path === '/moneyflow') {
    store.commit('GAINTALLONE', 3)
  }
  if (to.path === '/userinfo') {
    store.commit('GAINTALLONE', 1)
  }
  // 提取相关用户信息和主token、随机token
  let mass = JSON.parse(sessionStorage.getItem('mass'))
  // 判断是否是分享注册
  // if (!to.path.indexOf('/qcode')) {
  next()
  // 判断mess是否为空和不是在登入页面
  // } else
  if (!mass && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    // 判断是否拿到相关用户信息和主token、随机token和不是在登入页面
    // if (mass !== null) {
    //   let user_name = mass.user
    //   let random = mass.random
    //   let time = new Date().getTime()
    //   let cache = des.encrypt(`${user_name}:${random}:${time}`)
    //   // 判断主token是否超时
    //   api.router_check(`cache_deny/?cache=${cache}`, {}, r => {
    //     if (r.state === 200) {
    //       next()
    //     } else if (r.state === 400) {
    //       sessionStorage.removeItem('mess') // 清除数据
    //       store.dispatch('inchange') // 弹出超时页面
    //     } else if (r.state === 500) {
    //       api.router_check(`cache_deny/?cache=${cache}`, {}, r => {})
    //       next()
    //     }
    //   })
    // }
    next()
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
