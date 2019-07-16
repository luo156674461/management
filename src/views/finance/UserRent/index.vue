<template>
  <div class="userRent">
    <div class="sumUp">
      <div class="sun_0">
        <Tag color="cyan" @click.native="entire">
          <span class="txt">全部</span>
          <span class="num">{{entireNum}}人</span>
        </Tag>
      </div>
      <div class="sun_1">
        <Tag color="cyan" @click.native="completeDelivery">
          <span class="txt">已交租金</span>
          <span class="num">{{completeDeliveryNum}}人</span>
        </Tag>
      </div>
      <div class="sun_2">
        <Tag color="blue" @click.native="unpaid">
          <span class="txt">要交租金</span>
          <span class="num">{{unpaidNum}}人</span>
        </Tag>
      </div>
      <div class="sun_3">
        <Tag color="geekblue" @click.native="overdue">
          <span class="txt">逾期</span>
          <span class="num">{{overdueNum}}人</span>
        </Tag>
      </div>
    </div>
    <div class="band"></div>
    <div class="search">
      <Input placeholder="请输入用户名" style="width: auto" v-model="searchNuse" @input="refresh"></Input>
      <Icon type="ios-search" slot="suffix" class="icon" />
      <Button type="primary" @click="search" class="but">搜索</Button>
      <Select v-model="skymodel" style="width:200px" v-if="optFor === 2 ? true : false" class="sel" @on-change="sky">
        <Option v-for="item in skyDate" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="band_1"></div>
    <Table border :columns="columns" :data="userdata" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="band_1"></div>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
    <Modal v-model="modal" :title="remText" @on-ok="ok">
      <Form ref="alterCustom" :model="alterCustom" :rules="alterRuleCustom" :label-width="80">
        <FormItem label="交租时间" prop="dealDate">
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 250px" @on-change="deal" v-model="alterCustom.dealDate"></DatePicker>
        </FormItem>
        <FormItem label="已交租金" prop="alreadyRent">
          <Input type="text" v-model="alterCustom.alreadyRent" placeholder="请输入租金"></Input>
        </FormItem>
        <FormItem label="逾期天数" prop="overdue">
          <Input type="text" v-model="alterCustom.overdue" placeholder="请输入逾期天数"></Input>
        </FormItem>
        <FormItem label="滞纳金" prop="overdue_fine">
          <Input type="text" v-model="alterCustom.overdue_fine" placeholder="请输入滞纳金"></Input>
        </FormItem>
        <FormItem label="备注" prop="rent_remark">
          <Input type="text" v-model="alterCustom.rent_remark" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
    </Modal>
    <router-view class="router_rent"></router-view>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  created() {
    this.userSum()
    this.thenSun()
    this.notSun()
    this.exceedSun()
    this.alterNumberPages()
    this.pageUserInfo(1)
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      columns: [{
        title: '姓名',
        key: 'realName',
        width: 80
      }, {
        title: '租金',
        key: 'rent'
      }, {
        title: '交租日期',
        key: 'beginDate'
      }, {
        title: '应交租时间',
        key: 'answerDate'
      }, {
        title: '交租时间',
        key: 'dealDate'
      }, {
        title: '已交租金',
        key: 'alreadyRent'
      }, {
        title: '逾期天数',
        key: 'overdue'
      }, {
        title: '滞纳金',
        key: 'overdue_fine'
      }, {
        title: '备注',
        key: 'rent_remark'
      }, {
        title: '详情',
        key: 'action',
        fixed: 'right',
        width: 90,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: this.amend
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: this.rentHistory
              }
            }, '租金历史')
          ])
        }
      }], // 表头
      userdata: [], // 表数据
      loading: false, // 接收数据的过度
      sun: 0, // 数据总数
      currentPage: 1, // 表页数
      pageShow: false, // 页数条的显示
      entireNum: 0, // 要交租金的总人数
      completeDeliveryNum: 0, // 已交租金总人数
      unpaidNum: 0, // 未交租金总人数
      overdueNum: 0, // 逾期总人数
      searchNuse: '', // 搜索输入
      modal: false, // 输入弹窗
      remText: '', // 弹窗的提示
      eliminateNum: 0, // 判断弹窗输入内容
      optFor: 0, // 标签选中判断
      optWhole: true, // 全部标签开关
      optcompleteDelivery: true, // 已交标签开关
      optunpaid: true, // 未交标签开关
      optoverdue: true, // 逾期标签开关
      alterCustom: {
        dealDate: '',
        alreadyRent: '',
        overdue: '',
        overdue_fine: '',
        rent_remark: ''
      },
      alterRuleCustom: {
        dealDate: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        alreadyRent: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        overdue: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        overdue_fine: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        rent_remark: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      skymodel: '前5天', // 租金提醒天数
      skyDate: [{
          value: new Date().getDate() - 5,
          label: '前5天'
        },
        {
          value: new Date().getDate() - 4,
          label: '前4天'
        },
        {
          value: new Date().getDate() - 3,
          label: '前3天'
        },
        {
          value: new Date().getDate() - 2,
          label: '前2天'
        },
        {
          value: new Date().getDate() - 1,
          label: '前1天'
        },
        {
          value: new Date().getDate(),
          label: '当天'
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    ...mapMutations(['GAINTALLTHREE']),
    // 总人数
    userSum() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('character', '==', 'rent')
      query.count().then(res => {
        this.entireNum = res
        if (res > 10) {
          this.pageShow = true
        } else {
          this.pageShow = true
        }
      })
    },
    // 已交人数
    thenSun() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('character', '==', 'rent')
      query.equalTo('alreadyRent', '!=', '0')
      query.equalTo('alreadyRent', '!=', undefined)
      query.count().then(res => {
        this.completeDeliveryNum = res
        if (res > 10) {
          this.pageShow = true
        } else {
          this.pageShow = true
        }
      })
    },
    // 未交人数
    notSun() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('character', '==', 'rent')
      query.equalTo('alreadyRent', '==', '0')
      query.equalTo('alreadyRent', '!=', undefined)
      query.count().then(res => {
        this.unpaidNum = res
        if (res > 10) {
          this.pageShow = true
        } else {
          this.pageShow = true
        }
      })
    },
    // 逾期人数
    exceedSun() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('character', '==', 'rent')
      query.equalTo('overdue', '!=', '0')
      query.equalTo('alreadyRent', '!=', undefined)
      query.count().then(res => {
        this.overdueNum = res
        if (res > 10) {
          this.pageShow = true
        } else {
          this.pageShow = true
        }
      })
    },
    // 表所触发的方法
    inRowInfo(data) {
      sessionStorage.setItem('usetRowInfo', JSON.stringify(data))
    },
    // 改变页数
    alterNumberPages() {
      if (JSON.parse(sessionStorage.getItem('optFor')) !== null) {
        this.optFor = JSON.parse(sessionStorage.getItem('optFor'))
      } else {
        this.optFor = 0
      }
      if (this.optFor === 0) {
        if (JSON.parse(sessionStorage.getItem('totalPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('totalPage'))
        } else {
          this.currentPage = 1
        }
      } else if (this.optFor === 1) {
        if (JSON.parse(sessionStorage.getItem('thenPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('thenPage'))
        } else {
          this.currentPage = 1
        }
      } else if (this.optFor === 2) {
        if (JSON.parse(sessionStorage.getItem('notPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('notPage'))
        } else {
          this.currentPage = 1
        }
      } else if (this.optFor === 3) {
        if (JSON.parse(sessionStorage.getItem('exceedPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('exceedPage'))
        } else {
          this.currentPage = 1
        }
      }
      this.pageUserInfo(this.currentPage)
    },
    // 页所对应表的数据
    pageUserInfo(v) {
      // 没选标签
      if (this.optFor === 0) {
        // 选租车
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        query.equalTo('character', '==', 'rent')
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          let time = new Date()
          let answerDate = ''
          if (res.beginDate !== undefined) {
            let date = res.beginDate.split(' ')[0].split('-')[2]
            if (Number(date) < 10) {
              answerDate = `${time.getFullYear()}-0${time.getMonth() + 1}-0${date}`
            } else {
              answerDate = `${time.getFullYear()}-0${time.getMonth() + 1}-${date}`
            }
            if ((time.getMonth() + 1) < Number(res.withdraw_date.iso.split(' ')[0].split('-')[1])) {
              res.answerDate = answerDate
              query.set('id', res.objectId)
              query.set('answerDate', answerDate)
              res.save()
            } else {
              res.answerDate = '已过期'
            }
          }
          this.loading = false
          this.userdata = res
        })
        query.equalTo('character', '==', 'rent')
        query.count().then(res => {
          this.sun = res
        })
        sessionStorage.setItem('totalPage', JSON.stringify(v))
      } else if (this.optFor === 1) {
        // 已交租金
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        query.equalTo('character', '==', 'rent')
        query.equalTo('alreadyRent', '!=', '0')
        query.equalTo('alreadyRent', '!=', undefined)
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          let time = new Date()
          let answerDate = ''
          if (res.beginDate !== undefined) {
            let date = res.beginDate.split(' ')[0].split('-')[2]
            if (Number(date) < 10) {
              answerDate = `${time.getFullYear()}-0${time.getMonth() + 1}-0${date}`
            } else {
              answerDate = `${time.getFullYear()}-0${time.getMonth() + 1}-${date}`
            }
            if ((new Date().getMonth() + 1) < Number(res.withdraw_date.iso.split(' ')[0].split('-')[1])) {
              res.answerDate = answerDate
              query.set('id', res.objectId)
              query.set('answerDate', answerDate)
              res.save()
            } else {
              res.answerDate = '已过期'
            }
          }
          this.loading = false
          this.userdata = res
        })
        query.count().then(res => {
          this.sun = res
        })
        sessionStorage.setItem('thenPage', JSON.stringify(v))
      } else if (this.optFor === 2) {
        // 未交租金
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        query.equalTo('character', '==', 'rent')
        query.equalTo('alreadyRent', '==', '0')
        query.equalTo('alreadyRent', '!=', undefined)
        // query.equalTo('answerDate', '==', '0')
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          let time = new Date()
          let answerDate = ''
          if (res.beginDate !== undefined) {
            let date = res.beginDate.split(' ')[0].split('-')[2]
            if (Number(date) < 10) {
              answerDate = `${time.getFullYear()}-0${time.getMonth() + 1}-0${date}`
            } else {
              answerDate = `${time.getFullYear()}-0${time.getMonth() + 1}-${date}`
            }
            if ((new Date().getMonth() + 1) < Number(res.withdraw_date.iso.split(' ')[0].split('-')[1])) {
              res.answerDate = answerDate
              query.set('id', res.objectId)
              query.set('answerDate', answerDate)
              res.save()
            } else {
              res.answerDate = '已过期'
            }
          }
          this.loading = false
          this.userdata = res
        })
        query.count().then(res => {
          this.sun = res
        })
        sessionStorage.setItem('notPage', JSON.stringify(v))
      } else if (this.optFor === 3) {
        // 逾期
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        query.equalTo('character', '==', 'rent')
        query.equalTo('overdue', '!=', '0')
        query.equalTo('alreadyRent', '!=', undefined)
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          let time = new Date()
          let answerDate = ''
          if (res.beginDate !== undefined) {
            let date = res.beginDate.split(' ')[0].split('-')[2]
            if (Number(date) < 10) {
              answerDate = `${time.getFullYear()}-0${time.getMonth() + 1}-0${date}`
            } else {
              answerDate = `${time.getFullYear()}-0${time.getMonth() + 1}-${date}`
            }
            if ((new Date().getMonth() + 1) < Number(res.withdraw_date.iso.split(' ')[0].split('-')[1])) {
              res.answerDate = answerDate
              query.set('id', res.objectId)
              query.set('answerDate', answerDate)
              res.save()
            } else {
              res.answerDate = '已过期'
            }
          }
          this.loading = false
          this.userdata = res
        })
        query.count().then(res => {
          this.sun = res
        })
        sessionStorage.setItem('exceedPage', JSON.stringify(v))
      }
    },
    // 总人数
    entire() {
      if (this.optWhole) {
        this.optFor = 0
        this.pageUserInfo(1)
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('totalPage')))
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optWhole = !this.optWhole
      this.optcompleteDelivery = true
      this.optunpaid = true
      this.optoverdue = true
    },
    // 已交租金
    completeDelivery() {
      if (this.optcompleteDelivery) {
        this.optFor = 1
        this.pageUserInfo(1)
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('thenPage')))
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optcompleteDelivery = !this.optcompleteDelivery
      this.optWhole = true
      this.optunpaid = true
      this.optoverdue = true
    },
    // 未交租金
    unpaid() {
      if (this.optunpaid) {
        this.optFor = 2
        this.pageUserInfo(1)
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('notPage')))
      }
      this.userSum()
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optunpaid = !this.optunpaid
      this.optcompleteDelivery = true
      this.optWhole = true
      this.optoverdue = true
    },
    // 未交提醒
    sky(v) {
      let tiem = new Date()
      let Y = tiem.getFullYear()
      let M = tiem.getMonth() + 1
      let D = tiem.getDate()
      if (v < 0 || v === 0) {
        M = M - 1
        D = new Date(Y, M, 0).getDate() + v
      }
      if (M < 10) {
        M = `0${M}`
      }
      if (D < 10) {
        D = `0${D}`
      }
      // 未交租金
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('character', '==', 'rent')
      query.equalTo('alreadyRent', '==', '0')
      query.equalTo('answerDate', '==', `${Y}-${M}-${D}`)
      query.equalTo('alreadyRent', '!=', undefined)
      if (v === 1) {
        query.limit(10)
      } else if (v > 1) {
        let num = (v - 1) * 10
        query.skip(num)
        query.limit(10)
      }
      query.statTo('order', '-createdAt')
      query.find().then(res => {
        this.loading = false
        this.userdata = res
      })
      query.count().then(res => {
        this.sun = res
        if (res > 10) {
          this.pageShow = true
        } else {
          this.pageShow = true
        }
      })
    },
    // 逾期
    overdue() {
      if (this.optoverdue) {
        this.optFor = 3
        this.pageUserInfo(1)
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('exceedPage')))
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optoverdue = !this.optoverdue
      this.optcompleteDelivery = true
      this.optunpaid = true
      this.optWhole = true
    },
    // 租金历史
    rentHistory() {
      this.eliminateNum = 0
      this.GAINTALLTHREE(0)
      sessionStorage.setItem('keyT', JSON.stringify(0))
      this.$router.push({ path: '/finance/userrent/history' })
    },
    // 搜索
    search() {
      // this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('realName', '==', this.searchNuse)
      query.find().then(res => {

      })
    },
    // 搜索后刷新
    refresh() {
      // if (this.searchNuse.length === 0) {
      //   this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
      // }
    },
    // 新增
    add() {
      this.modal = true
      this.remText = '新增客户'
      this.eliminateNum = 1
    },
    // 租金日期
    begin(v) {
      this.formCustom.beginDate = v
    },
    // 应交时间
    answer(v) {
      this.formCustom.answerDate = v
    },
    // 交租时间
    deal(v) {
      this.formCustom.dealDate = v
    },
    // 修改
    amend() {
      this.modal = true
      this.remText = '客户修改'
    },
    // 执行方法
    ok() {
      this.modal = false
      this.alterSubmit('alterCustom')
    },
    // 客户修改
    alterSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          let objectId = JSON.parse(sessionStorage.getItem('usetRowInfo')).objectId
          // 把修改的信息复制到user_rent中
          // eslint-disable-next-line
          let H_user_rent = Bmob.Query('user_rent')
          for (let k in JSON.parse(sessionStorage.getItem('History'))) {
            if (k === 'realName' || k === 'rent' || k === 'beginDate' || k === 'answerDate' || k === 'dealDate' || k === 'overdue' || k === 'overdue_fine' || k === 'rent_remark') {
              H_user_rent.set(k, JSON.parse(sessionStorage.getItem('usetRowInfo'))[k])
            }
          }
          H_user_rent.save().then(resh => {
            // 把user_rent绑至现用户
            // eslint-disable-next-line
            let add_relation_bind = Bmob.Relation('user_rent')
            let add_relID_bind = add_relation_bind.add(resh.objectId)
            // eslint-disable-next-line
            let car_query_bind = Bmob.Query('_User')
            car_query_bind.get(objectId).then(res => {
              res.set('user_rent', add_relID_bind)
              res.save()
            })
          })
          // eslint-disable-next-line
          let query = Bmob.Query('_User')
          query.set('id', objectId)
          query.set('dealDate', this.alterCustom.dealDate)
          query.set('alreadyRent', this.alterCustom.alreadyRent)
          query.set('overdue', this.alterCustom.overdue)
          query.set('overdue_fine', this.alterCustom.overdue_fine)
          query.set('rent_remark', this.alterCustom.rent_remark)
          // eslint-disable-next-line
          query.save().then(res => {
            this.$Modal.warning({
              title: '修改成功',
              onOk() {
                _this.pageUserInfo(1)
                _this.optFor = 2
                _this.thenSun()
                _this.notSun()
                _this.exceedSun()
              }
            })
            // eslint-disable-next-line
          }).catch(err => {
            this.$Modal.warning({
              // eslint-disable-next-line
              title: '修改失败'
            })
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.userRent {
  position: relative;

  .sumUp {
    margin: 5px 0;
    display: flex;

    div {
      flex: 1;
      text-align: center;

      .txt {
        display: block;
      }

      .num {
        display: block;
      }
    }
  }

  .band {
    height: 20px;
    background: #f5f7f9;
  }

  .band_1 {
    height: 5px;
    background: #f5f7f9;
  }

  .search {
    position: relative;

    .icon {
      position: absolute;
      top: 8px;
      left: 135px;
      z-index: 100;
      font-size: 16px;
    }

    .but {
      position: absolute;
      top: 0;
      left: 180px;
      z-index: 100;
    }

    .sel {
      position: absolute;
      top: 0;
      left: 250px;
      z-index: 100;
    }

    .butAdd {
      position: absolute;
      top: 0;
      left: 255px;
      z-index: 100;
    }

    .butRun {
      position: absolute;
      top: 0;
      left: 330px;
      z-index: 100;
    }

    .temBut {
      position: absolute;
      top: 0;
      left: 330px;
      z-index: 100;
      display: inline-block;
    }

    .ivu-upload {
      position: absolute;
      top: 0;
      left: 215px;
      z-index: 100;
      display: inline-block;
    }
  }

  .router_rent {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 1000;
  }
}

</style>
