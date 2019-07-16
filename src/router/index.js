import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const RouterMap = [
  // 登入
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    name: 'Authredirect',
    component: () =>
      import('@/views/login/authredirect'),
    hidden: true
  },
  // 网页报错404
  {
    path: '/404',
    name: 'Respond',
    component: () =>
      import('@/views/errorPage/404'),
    hidden: true
  },
  // 登入报错401
  {
    path: '/401',
    name: 'Brace',
    component: () =>
      import('@/views/errorPage/401'),
    hidden: true
  },
  // 主页
  {
    path: '/',
    name: 'Layout',
    component: () =>
      import('@/views/layout/index'),
    redirect: '/homepage',
    children: [{
      level: '0',
      path: '/homepage',
      name: '主页',
      component: () =>
        import('@/views/homepage/index'),
      hidden: true
    }, {
      level: '1',
      path: '/userinfo',
      name: '客户信息',
      component: () =>
        import('@/views/userinfo/index'),
      children: [{
        path: '/userinfo/carinfo',
        name: '车辆信息',
        component: () =>
          import('@/views/userinfo/carInfo/index'),
        hidden: true
      }, {
        path: '/userinfo/moneyinfo',
        name: '流水信息',
        component: () =>
          import('@/views/userinfo/moneyInfo/index'),
        hidden: true
      }, {
        path: '/userinfo/threatened',
        name: '出险历史',
        component: () =>
          import('@/views/userinfo/threatened/index'),
        hidden: true
      }, {
        path: '/userinfo/particular',
        name: '详细信息',
        component: () =>
          import('@/views/userinfo/particular/index'),
        hidden: true
      }]
    }, {
      path: '/vehicle',
      name: '车辆信息',
      component: () =>
        import('@/views/vehicle/index'),
      children: [{
        path: '/vehicle/bindinghistory',
        name: '绑定历史',
        component: () =>
          import('@/views/vehicle/bindingHistory/index'),
        hidden: true
      }, {
        path: '/vehicle/threatened',
        name: '出险记录',
        component: () =>
          import('@/views/vehicle/threatened/index'),
        hidden: true
      }, {
        path: '/vehicle/regulations',
        name: '违章查询',
        component: () =>
          import('@/views/vehicle/regulations/index'),
        hidden: true
      }]
    }, {
      level: '1',
      path: '/moneyflow',
      name: '流水管理',
      component: () =>
        import('@/views/moneyflow/index'),
      hidden: true
    }, {
      level: '2',
      path: '/finance',
      name: '财务管理',
      component: () =>
        import('@/views/finance/index'),
      children: [{
        path: '/finance/client',
        name: '客户',
        component: () =>
          import('@/views/finance/client/index'),
        children: [{
          path: '/finance/client/carinfo',
          name: '车辆信息',
          component: () =>
            import('@/views/userinfo/carInfo/index'),
          hidden: true
        }, {
          path: '/finance/client/moneyinfo',
          name: '流水信息',
          component: () =>
            import('@/views/finance/client/moneyInfo/index'),
          hidden: true
        }, {
          path: '/finance/client/particular',
          name: '详细信息',
          component: () =>
            import('@/views/finance/client/particular/index'),
          hidden: true
        }]
      }, {
        path: '/finance/vehicle',
        name: '车辆',
        component: () =>
          import('@/views/finance/vehicle/index'),
        children: [{
          path: '/finance/vehicle/bindinghistory',
          name: '绑定历史',
          component: () =>
            import('@/views/finance/vehicle/bindingHistory/index'),
          hidden: true
        }, {
          path: '/finance/vehicle/threatened',
          name: '出险记录',
          component: () =>
            import('@/views/finance/vehicle/threatened/index'),
          hidden: true
        }, {
          path: '/finance/vehicle/regulations',
          name: '违章查询',
          component: () =>
            import('@/views/finance/vehicle/regulations/index'),
          hidden: true
        }]
      }, {
        path: '/finance/running',
        name: '流水',
        component: () =>
          import('@/views/finance/running/index'),
        hidden: true
      }, {
        path: '/finance/deposit',
        name: '提现',
        component: () =>
          import('@/views/finance/deposit/index'),
        children: [{
          path: '/finance/deposit/periodinfo',
          name: '绑定历史',
          component: () =>
            import('@/views/finance/deposit/periodInfo/index'),
          hidden: true
        }]
      }, {
        path: '/finance/userrent',
        name: '客户租金',
        component: () =>
          import('@/views/finance/UserRent/index'),
        children: [{
          path: '/finance/userrent/history',
          name: '租金历史',
          component: () =>
            import('@/views/finance/UserRent/history/index'),
          hidden: true
        }]
      }, {
        path: '/finance/catrent',
        name: '车辆租金',
        component: () =>
          import('@/views/finance/CatRent/index'),
          children: [{
          path: '/finance/catrent/history',
          name: '租金历史',
          component: () =>
            import('@/views/finance/CatRent/history/index'),
          hidden: true
        }]
      }]
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: RouterMap
})
