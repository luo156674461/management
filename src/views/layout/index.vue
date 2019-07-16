<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <Menu :active-name="navActive" theme="dark" width="auto" :class="menuitemClasses" @on-select="skip" v-if="level === '1' ? true : false">
          <MenuItem :name="index" v-for="(i, index) in $router.options.routes[4].children" :key="index" :to="i.path" v-if="i.level === level ? true : false">
          <Icon type="ios-navigate"></Icon>
          <span>{{i.name}}</span>
          </MenuItem>
        </Menu>
        <Menu :active-name="navActive" theme="dark" width="auto" :class="menuitemClasses" @on-select="skip" v-if="level === '2' ? true : false">
          <MenuItem :name="index" v-for="(i, index) in $router.options.routes[4].children" :key="index" :to="i.path" v-if="i.level === level ? true : false">
          <Icon type="ios-navigate"></Icon>
          <span>{{i.name}}</span>
          </MenuItem>
        </Menu>
        <Menu :active-name="navActive" theme="dark" width="auto" :class="menuitemClasses" @on-select="skip" v-if="level === '3' ? true : false">
          <MenuItem :name="index" v-for="(i, index) in $router.options.routes[4].children" :key="index" :to="i.path" v-if="i.level !== '0' ? true : false">
          <Icon type="ios-navigate"></Icon>
          <span>{{i.name}}</span>
          </MenuItem>
        </Menu>
        <Menu :active-name="navActive" theme="dark" width="auto" :class="menuitemClasses" @on-select="skip" v-if="level === '4' ? true : false">
          <MenuItem :name="index" v-for="(i, index) in $router.options.routes[4].children" :key="index" :to="i.path" v-if="i.level !== '0' ? true : false">
          <Icon type="ios-navigate"></Icon>
          <span>{{i.name}}</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24" class="navIcon"></Icon>
          <Breadcrumb>
            <BreadcrumbItem to="/">主页</BreadcrumbItem>
            <BreadcrumbItem :to="`${i.path}`" v-for="(i, index) in tallyOne" :key="index" v-if="tallyOneShow"><span @click="offTallyWen">{{i.name}}</span></BreadcrumbItem>
            <BreadcrumbItem v-if="tallyWenShow" :to="tallyWen[0].path">{{tallyWen[0].name}}</BreadcrumbItem>
            <BreadcrumbItem v-if="tallyThreeShow" :to="tallyThree[0].path">{{tallyThree[0].name}}</BreadcrumbItem>
          </Breadcrumb>
          <div class="quit">
            <Dropdown placement="bottom-end">
              <a href="javascript:void(0)" style="margin-right: 40px">
            设置
        </a>
              <DropdownMenu slot="list">
                <DropdownItem>
                  <Button type="text" size='small' shape="circle" class="exitBut" @click="revamp">密码修改</Button>
                </DropdownItem>
                <DropdownItem>
                  <Button type="text" size='small' shape="circle" class="exitBut" @click="exit">退出</Button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Header>
        <Content :style="{margin: '10px', background: '#fff', position: 'relative'}">
          <router-view class="router" v-if="routerShow"></router-view>
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="modal" title="密码修改" @on-ok="ok">
      <Input v-model="password" @input="remind" />
      <span class="rem" style="display:block; text-align:center; color: red; margin-top: 10px;" v-if="remShow">{{remText}}</span>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import BScroll from 'better-scroll'
export default {
  created() {
    this.OFFGAINTALLONE()
    this.GAINMASS()
    this.jurisdiction()
    // this.registerInfo()
    // this.integralInfo()
    // 导航一
    // console.log(this.$router.options.routes[5].path)
    if (this.tallyOneShow) {
      this.skip(JSON.parse(sessionStorage.getItem('tallyOneKey')))
    }
    if (this.tallyOne[0] !== undefined) {
      this.GAINTALLONE(JSON.parse(sessionStorage.getItem('tallyOneKey')))
    } else {
      if (this.tallyWenShow) {
        this.GAINTALLONE(JSON.parse(sessionStorage.getItem('tallyOneKey')))
        this.GAINTALLWEN(JSON.parse(sessionStorage.getItem('key')))
      }
    }
    // 导航二显示
    // if (this.tallyWen.length === 0) {
    //   this.OFFGAINTALLWEN()
    // }
    // 导航二
    // this.GAINTALLWEN(JSON.parse(sessionStorage.getItem('key')))

    // 修改日记的显示
  },
  mounted() {
    this.$nextTick(() => {
      // if (!this.labScroll) {
      //   this.labScroll = new BScroll(this.$refs.lab, {
      //     click: true,
      //     scrollX: true,
      //     freeScroll: true,
      //     eventPassthrough: 'horizontal'
      //   })
      // } else {
      //   this.labScroll.refresh()
      // }
    })
  },
  updated() {

  },
  provide() {
    return {
      reloadRouter: this.reloadRouter
    }
  },
  data() {
    return {
      isCollapsed: false,
      navActive: 0,
      total_user: 0,
      total_vip: 0,
      total: 0,
      used: 0,
      judge: false,
      routerShow: true,
      password: '',
      remText: '',
      remShow: false,
      modal: false,
      visible: false,
      level: 0
    }
  },
  computed: {
    ...mapState(['mass', 'tallyOne', 'tallyWen', 'tallyWenShow', 'tallyOneShow', 'labelArr', 'tallyThreeShow', 'tallyThree']),
    rotateIcon() {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses() {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  methods: {
    ...mapMutations(['GAINTALLONE', 'GAINTALLWEN', 'OFFGAINTALLWEN', 'OFFGAINTALLONE', 'OPENGAINTALLWEN', 'OPENGAINTALLONE', 'OPENROUTER', 'SHUTROUTER', 'GAINMASS']),
    reload() {
      this.SHUTROUTER()
      this.$nextTick(function() {
        this.OPENROUTER()
      })
    },
    handleOpen() {
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
    exit() {
      this.$router.push({ path: '/login' })
      sessionStorage.removeItem('labelArr')
      sessionStorage.removeItem('mass')
      sessionStorage.removeItem('key')
      sessionStorage.removeItem('rowInfo')
      sessionStorage.removeItem('arrNum')
      sessionStorage.removeItem('tallyOneKey')
      sessionStorage.removeItem('currentPage')
      sessionStorage.removeItem('total')
      this.OFFGAINTALLONE()
    },
    // 判断权限
    jurisdiction() {
      // eslint-disable-next-line
      let query = Bmob.Query('administrator')
      query.equalTo('admin_name', '==', this.mass.user)
      query.find().then(res => {
        this.level = res[0].level
      })
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse()
    },
    // 导航跳转
    skip(v) {
      sessionStorage.setItem('tallyOneKey', JSON.stringify(v))
      this.navActive = v
      this.GAINTALLONE(v)
      sessionStorage.setItem('labelArr', JSON.stringify(this.labelArr))
    },
    // 清空导航二
    offTallyWen() {
      this.OFFGAINTALLWEN()
      this.GAINTALLONE(JSON.parse(sessionStorage.getItem('tallyOneKey')))
    },
    reloadRouter() {
      this.routerShow = false
      this.$nextTick(function() {
        this.routerShow = true
      })
    },
    // 密码修改
    revamp() {
      this.revampJudge = true
      this.modal = true
    },
    ok() {
      this.GAINMASS()
      let _this = this
      if (this.password.length !== 0) {
        // eslint-disable-next-line
        let query = Bmob.Query('administrator')
        query.equalTo('admin_name', '==', this.mass.user)
        query.find().then(res => {
          query.set('id', res[0].objectId)
          query.set('password', this.password)
          query.save().then(res => {
            this.$Modal.warning({
              title: '修改成功',
              onOk() {
                _this.integralNum = ''
                _this.exit()
              }
            })
            // eslint-disable-next-line
          }).catch(err => {
            this.$Modal.warning({
              // eslint-disable-next-line
              title: '修改失败',
              onOk() {
                _this.integralNum = ''
              }
            })
          })
        })
      }
    },
    remind() {
      if (this.password.length === 0) {
        this.remShow = true
        this.remText = '密码不能为空'
      } else {
        this.remShow = false
      }
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.layout {
  width: 100%;
  height: 100%;
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
}

.ivu-layout {
  width: 100%;
  height: 100%;
}

.sum {
  display: flex;
  position: absolute;
  top: 15px;
  right: 450px;
  z-index: 10;

  div {
    flex: 0 0 1;
    margin-right: 10px;
  }

  span {
    display: inline-block;
  }

  .txt {
    margin-right: 5px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 22px;
    color: rgba(59, 63, 75, 1);
    opacity: 1;
  }

  .num {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 22px;
    color: rgba(59, 63, 75, 1);
    opacity: 1;
  }
}

.layout-header-bar {
  position: relative;

  .quit {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 10px;
    z-index: 10;

    .exitBut {}
  }
}


.label {
  display: block;
  position: absolute;
  top: 20px;
  left: 50px;
  height: 24px;
  margin-top: 20px;
}

.navIcon {
  display: inline-block;
  transform: translateY(-33%);
}

.layout-header-bar {
  display: flex;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);

  .ivu-icon {
    flex: 0 0 24px;
    height: 24px;
    margin-top: 2.5% !important;
    // transform: translateY(84%);
  }
}

.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}

.menu-icon {
  transition: all .3s;
}

.rotate-icon {
  transform: rotate(-90deg);
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 70%;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
  transform: translateY(7%);
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0px;
  transition: width .2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}

.router {
  // width: 100%;
  // height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
}

</style>
