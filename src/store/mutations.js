import * as types from './mutation-types'
import router from '../router'
export default ({
  // [types.NEWSDATA](state, news) {
  //   state.data.news = news
  // },
  // 第一个导航
  [types.GAINTALLONE](state, num) {
    state.tallyOne = []
    state.tallyOne.push(router.options.routes[4].children[num])
    if (state.tallyOne[0] !== undefined) {
      state.tallyOneShow = true
    }
  },
  // 第二个导航
  [types.GAINTALLWEN](state, num) {
    state.tallyWen = []
    state.tallyWen.push(state.tallyOne[0].children[num])
    state.tallyWenShow = true
  },
  // 第三个导航
  [types.GAINTALLTHREE](state, num) {
    state.tallyThree = []
    state.tallyThree.push(state.tallyWen[0].children[num])
    state.tallyThreeShow = true
  },
  //  关闭第三导航
  [types.OFFGAINTALLTHREE](state) {
    state.tallyThreeShow = false
  },
  // 开启第三导航
  [types.OPENGAINTALLTHREE](state) {
    state.tallyThreeShow = true
  },
  //  关闭第二导航
  [types.OFFGAINTALLWEN](state) {
    state.tallyWenShow = false
  },
  // 开启第二导航
  [types.OPENGAINTALLWEN](state) {
    state.tallyWenShow = true
  },
  //  开启第一导航
  [types.OPENGAINTALLONE](state) {
    state.tallyOneShow = true
  },
  //  关闭第一导航
  [types.OFFGAINTALLONE](state) {
    state.tallyOneShow = false
  },
  // 获取登录者信息
  [types.GAINMASS](state) {
    state.mass = JSON.parse(sessionStorage.getItem('mass'))
  },
  // 超时开关
  [types.OVERTIMESWITCH](state) {
    state.overtimeShow = !state.overtimeShow
  },
  [types.OPENROUTER](state) {
    state.isRouterAlive = true
  },
  [types.SHUTROUTER](state) {
    state.isRouterAlive = false
  },
  // 获取身份证正面
  [types.GETIDCARDONE](state, imgUrl) {
    state.idcarOne = imgUrl
  },
  // 获取身份证反面
  [types.GETIDCARDWEN](state, imgUrl) {
    state.idcarWen = imgUrl
  },
  // 获取驾驶证正面
  [types.GETLICENCEONE](state, imgUrl) {
    state.licenceOne = imgUrl
  },
  // 获取驾驶证反面
  [types.GETLICENCEWEN](state, imgUrl) {
    state.licenceWen = imgUrl
  }
})
