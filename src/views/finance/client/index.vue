<template>
  <div class="client">
    <div class="sumUp">
      <div class="sun_1">
        <Tag color="cyan" @click.native="whole">
          <span class="txt">全部客户</span>
          <span class="num">{{userHeadNum}}人</span>
        </Tag>
      </div>
      <div class="sun_2">
        <Tag color="blue" @click.native="chainStore">
          <span class="txt">直营客户</span>
          <span class="num">{{chainStoreNum}}人</span>
        </Tag>
      </div>
      <div class="sun_3">
        <Tag color="geekblue" @click.native="rentCar">
          <span class="txt">租车客户</span>
          <span class="num">{{rentCarNum}}人</span>
        </Tag>
      </div>
      <div class="sun_4">
        <Tag color="purple" @click.native="hirePurchase">
          <span class="txt">以租代购客户</span>
          <span class="num">{{hirePurchaseNum}}人</span>
        </Tag>
      </div>
      <div class="sun_5">
        <Tag color="purple" @click.native="carDack">
          <span class="txt">退车客户</span>
          <span class="num">{{carDackeNum}}人</span>
        </Tag>
      </div>
    </div>
    <div class="band"></div>
    <div class="search">
      <Input :placeholder="placeholder" style="width: auto" v-model="searchNuse" @input="refresh">
      <Select v-model="select" slot="prepend" style="width: 80px" @on-change="sel">
        <Option value="realName">用户名</Option>
        <Option value="phone">手机号</Option>
      </Select>
      </Input>
      <Icon type="ios-search" slot="suffix" class="icon" />
      <Button type="primary" @click="search" class="but">搜索</Button>
      <Button type="primary" @click="add" class="butAdd">新增</Button>
    </div>
    <div class="band_1"></div>
    <Table border :columns="columns" :data="userdata" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="band_1"></div>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
    <Modal v-model="modal" :title="remText" @on-ok="ok">
      <p style="display:block; text-align:center; margin-top: 10px; font-size: 16px;" v-if="eliminateNum === 2? true : false">是否删除该用户</p>
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" v-if="eliminateNum === 1? true : false">
        <FormItem label="客户名" prop="user">
          <Input type="text" v-model="formCustom.user" placeholder="请输入客户名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="cell">
          <Input type="text" v-model="formCustom.cell" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="类型" prop="character">
          <Select v-model="formCustom.character">
            <Option v-for="item in characterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="押金分期" prop="has_deposit_loan">
          <Select v-model="formCustom.has_deposit_loan">
            <Option v-for="item in loabCityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="分期押金" prop="deposit_amount" v-if="formCustom.has_deposit_loan === 'Y' ? true : false">
          <Input type="text" v-model="formCustom.deposit_amount" placeholder="请输入数量"></Input>
        </FormItem>
      </Form>
      <Form ref="alterCustom" :model="alterCustom" :rules="alterRuleCustom" :label-width="80" v-if="eliminateNum === 4? true : false">
        <FormItem label="客户名" prop="user">
          <Input type="text" v-model="alterCustom.user" placeholder="请输入客户名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="cell">
          <Input type="text" v-model="alterCustom.cell" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="类型" prop="character">
          <Select v-model="alterCustom.character">
            <Option v-for="item in characterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="押金分期" prop="has_deposit_loan">
          <Select v-model="alterCustom.has_deposit_loan">
            <Option v-for="item in loabCityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="每日提现" prop="can_cashout_onMon">
          <Select v-model="alterCustom.can_cashout_onMon">
            <Option v-for="item in loabCityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="分期押金" prop="deposit_amount">
          <Input type="text" v-model="alterCustom.deposit_amount" placeholder="请输入数量"></Input>
        </FormItem>
        <FormItem label="司机等级" prop="position">
          <Select v-model="alterCustom.position">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="续约" prop="renewal">
          <Select v-model="alterCustom.renewal">
            <Option value="Y">是</Option>
            <Option value="N">否</Option>
          </Select>
        </FormItem>
        <FormItem label="合约期" prop="contract" v-if="alterCustom.renewal === 'Y'? true : false">
          <Input type="text" v-model="alterCustom.contract" placeholder="请输入合约期"></Input>
        </FormItem>
        <FormItem label="续约日期" prop="activeDate" v-if="alterCustom.renewal === 'Y'? true : false">
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 250px" @on-change="active" v-model="alterCustom.activeDate"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <router-view class="router_user" v-if="sonRouter"></router-view>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  inject: ['reloadRouter'],
  created() {
    this.userSum()
    this.alterNumberPages()
    this.pageUserInfo(this.currentPage)
  },
  mounted() {
    this.$nextTick(() => {})
  },
  updated() {

  },
  provide() {
    return {
      sonReloadRouter: this.sonReloadRouter
    }
  },
  data() {
    const cellValidate = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('手机号码只能是数字'))
      } else {
        callback()
      }
    }
    return {
      formCustom: {
        user: '',
        cell: '',
        character: '',
        has_deposit_loan: '',
        deposit_amount: ''
      },
      ruleCustom: {
        user: [
          // eslint-disable-next-line
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          // { validator: userValidate, trigger: 'blur' }
        ],
        cell: [
          // eslint-disable-next-line
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          // eslint-disable-next-line
          { type: 'string', len: 11, message: '手机号为11位', trigger: 'blur' },
          // eslint-disable-next-line
          { validator: cellValidate, trigger: 'blur' }
        ],
        character: [
          // eslint-disable-next-line
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        has_deposit_loan: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' },
          // { validator: userValidate, trigger: 'blur' }
        ],
        deposit_amount: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' },
        ]
      },
      loabCityList: [{
          value: 'Y',
          label: '是'
        },
        {
          value: 'N',
          label: '否'
        }
      ],
      alterCustom: {
        user: '',
        cell: '',
        character: '',
        has_deposit_loan: '',
        deposit_amount: '',
        position: '',
        can_cashout_onMon: '',
        renewal: '',
        contract: '',
        alterCustom: ''
      },
      alterRuleCustom: {
        user: [
          // eslint-disable-next-line
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          // { validator: userValidate, trigger: 'blur' }
        ],
        cell: [
          // eslint-disable-next-line
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          // eslint-disable-next-line
          { type: 'string', len: 11, message: '手机号为11位', trigger: 'blur' },
          // eslint-disable-next-line
          { validator: cellValidate, trigger: 'blur' }
        ],
        character: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        position: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        deposit_amount: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        has_deposit_loan: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' },
          // { validator: userValidate, trigger: 'blur' }
        ],
        can_cashout_onMon: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' },
          // { validator: userValidate, trigger: 'blur' }
        ],
        renewal: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' },
          // { validator: userValidate, trigger: 'blur' }
        ],
        contract: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' },
          // { validator: userValidate, trigger: 'blur' }
        ],
        alterCustom: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' },
          // { validator: userValidate, trigger: 'blur' }
        ]
      },
      withdraw_date: '',
      cityList: [{
          value: 'lever1',
          label: '等级1'
        },
        {
          value: 'lever2',
          label: '等级2'
        }
      ],
      characterList: [{
          value: 'direct',
          label: '直营'
        },
        {
          value: 'rent',
          label: '租车'
        },
        {
          value: 'leasing',
          label: '以租代购'
        },
        {
          value: 'withdraw',
          label: '退车'
        }
      ],
      columns: [{
          title: '用户Id',
          key: 'objectId',
          width: 120,
          fixed: 'left'
        },
        {
          title: '姓名',
          key: 'realName'
        },
        {
          title: '省份证',
          key: 'identity_card'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '类型',
          key: 'character'
        },
        {
          title: '司机等级',
          key: 'position',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', params.column.title),
              h('Tooltip', {
                props: {
                  content: `司机等级说明
等级1--4500基本分成
等级2--5000基本分成
`,
                  transfer: true,
                  maxWidth: '220',
                  theme: 'light'
                }
              }, [
                h('Icon', {
                  props: {
                    type: 'ios-help-circle-outline',
                    color: '#c8c8c8',
                    size: '16'
                  },
                  style: {
                    marginLeft: '5px'
                  },
                  class: { iconClass: true }
                })
              ])
            ])
          }
        },
        {
          title: '是否押金分期',
          key: 'has_deposit_loan'
        },
        {
          title: '分期押金',
          key: 'deposit_amount'
        },
        {
          title: '是否每天提现',
          key: 'can_cashout_onMon'
        },
        {
          title: '是否续约',
          key: 'renewal'
        },
        {
          title: '详情',
          key: 'action',
          fixed: 'right',
          width: 185,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: this.carinfo
                }
              }, '车辆信息'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: this.moneyinfo
                }
              }, '流水信息'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: this.particular
                }
              }, '详细'),
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
                  click: this.delete
                }
              }, '删除')
            ])
          }
        }
      ],
      userdata: [],
      sun: 0, // 用户总数
      currentPage: 1,
      // 搜索
      searchNuse: '',
      select: 'realName',
      placeholder: '请输入用户名',
      loading: false,
      taHeight: 0,
      enrollModal: true,
      eliminateNum: 0,
      revampJudge: false,
      password: '',
      remText: '',
      remShow: false,
      modal: false,
      userHeadNum: 0, // 全部客户
      chainStoreNum: 0, // 直营客户
      rentCarNum: 0, // 租车客户
      hirePurchaseNum: 0, // 以租代购客户
      carDackeNum: 0, // 退车客户
      optFor: 0, // 标签的选中
      optWhole: true, // 全部标签选中
      optDirect: true, // 直营标签选中
      optRent: true, // 租车标签选中
      optLeasing: true, // 以租代购标签选中
      optDack: true, // 退车标签选中
      pageShow: true,
      sonRouter: true,
      trim: 1
    }
  },
  computed: {
    ...mapState(['mass'])
  },
  methods: {
    ...mapMutations(['GAINMASS', 'GAINTALLTHREE']),
    sonReloadRouter() {
      this.sonRouter = false
      this.$nextTick(function() {
        this.sonRouter = true
      })
    },
    // 选择搜索
    sel(v) {
      if (v === 'realName') {
        this.placeholder = `请输入用户名`
      } else if (v === 'phone') {
        this.placeholder = `请输入手机号`
      }
    },
    // 搜索
    search() {
      switch (this.select) {
        // eslint-disable-next-line
        case 'realName':
          this.loading = true
          // eslint-disable-next-line
          let query = Bmob.Query('_User')
          query.equalTo(this.select, '==', this.searchNuse)
          query.find().then(res => {
            for (let i = 0, max = res.length; i < max; i++) {
              if (res[i].position.slice(5, 6) === '1') {
                res[i].position = '等级1'
              } else if (res[i].position.slice(5, 6) === '2') {
                res[i].position = '等级2'
              }
              if (res[i].character === 'direct') {
                res[i].character = '直营'
              } else if (res[i].character === 'rent') {
                res[i].character = '租车'
              } else if (res[i].character === 'leasing') {
                res[i].character = '以租代购'
              } else if (res[i].character === 'withdraw') {
                res[i].character = '退车'
              }
              if (res[i].has_deposit_loan === 'Y') {
                res[i].has_deposit_loan = '是'
              } else {
                res[i].has_deposit_loan = '否'
              }
              if (res[i].can_cashout_onMon === 'Y') {
                res[i].can_cashout_onMon = '是'
              } else {
                res[i].can_cashout_onMon = '否'
              }
              if (res[i].renewal === 'Y') {
                res[i].renewal = '是'
              } else {
                res[i].renewal = '否'
              }
            }
            this.pageShow = false
            this.userdata = res
            this.loading = false
          })
          break
          // eslint-disable-next-line
        case 'phone':
          if (!/^[1-9]\d*$/.test(this.searchNuse)) {
            this.$Message.error({
              content: '只能是数字'
            })
          } else if (!/^1\d{10}$/.test(this.searchNuse)) {
            this.$Message.error({
              content: '手机号码格式为11位'
            })
          } else {
            this.loading = true
            // eslint-disable-next-line
            let query = Bmob.Query('_User')
            query.equalTo(this.select, '==', this.searchNuse)
            query.find().then(res => {
              for (let i = 0, max = res.length; i < max; i++) {
                if (res[i].position.slice(5, 6) === '1') {
                  res[i].position = '等级1'
                } else if (res[i].position.slice(5, 6) === '2') {
                  res[i].position = '等级2'
                }
                if (res[i].character === 'direct') {
                  res[i].character = '直营'
                } else if (res[i].character === 'rent') {
                  res[i].character = '租车'
                } else if (res[i].character === 'leasing') {
                  res[i].character = '以租代购'
                } else if (res[i].character === 'withdraw') {
                  res[i].character = '退车'
                }
                if (res[i].has_deposit_loan === 'Y') {
                  res[i].has_deposit_loan = '是'
                } else {
                  res[i].has_deposit_loan = '否'
                }
                if (res[i].can_cashout_onMon === 'Y') {
                  res[i].can_cashout_onMon = '是'
                } else {
                  res[i].can_cashout_onMon = '否'
                }
                if (res[i].renewal === 'Y') {
                  res[i].renewal = '是'
                } else {
                  res[i].renewal = '否'
                }
              }
              this.userdata = res
              this.loading = false
            })
          }
          break
      }
    },
    // 搜索后刷新
    refresh() {
      if (this.searchNuse.length === 0) {
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
      }
    },
    // 数据总数
    userSum() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.count().then(res => {
        this.sun = res
        this.userNumber()
        this.directNumber()
        this.rentNumber()
        this.leasingNumber()
        this.carDackNumber()
      })
    },
    // 客户总数
    userNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.count().then(res => {
        this.userHeadNum = res
      })
    },
    // 总数标签
    whole() {
      if (this.optWhole) {
        this.optFor = 1
        this.pageUserInfo(1)
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
      }
      this.userSum()
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optWhole = !this.optWhole
      this.optDirect = true
      this.optRent = true
      this.optLeasing = true
    },
    // 直营总数
    directNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('character', '==', 'direct')
      query.count().then(res => {
        this.chainStoreNum = res
      })
    },
    // 直营标签
    chainStore() {
      if (this.optDirect) {
        this.optFor = 2
        this.pageUserInfo(1)
        this.sun = this.chainStoreNum
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
        this.userSum()
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optDirect = !this.optDirect
      this.optWhole = true
      this.optRent = true
      this.optLeasing = true
    },
    // 租车总数
    rentNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('character', '==', 'rent')
      query.count().then(res => {
        this.rentCarNum = res
      })
    },
    // 租车标签
    rentCar() {
      if (this.optRent) {
        this.optFor = 3
        this.pageUserInfo(1)
        this.sun = this.rentCarNum
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
        this.userSum()
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optRent = !this.optRent
      this.optDirect = true
      this.optWhole = true
      this.optLeasing = true
    },
    // 以租代购总数
    leasingNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('character', '==', 'leasing')
      query.count().then(res => {
        this.hirePurchaseNum = res
      })
    },
    // 以租代购标签
    hirePurchase() {
      if (this.optLeasing) {
        this.optFor = 4
        this.pageUserInfo(1)
        this.sun = this.hirePurchaseNum
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
        this.userSum()
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optLeasing = !this.optLeasing
      this.optRent = true
      this.optDirect = true
      this.optWhole = true
      this.optLeasing = true
    },
    // 退车总数
    carDackNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('character', '==', 'withdraw')
      query.count().then(res => {
        this.carDackeNum = res
      })
    },
    // 退车标签
    carDack() {
      if (this.optDack) {
        this.optFor = 5
        this.pageUserInfo(1)
        this.sun = this.carDackeNum
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
        this.userSum()
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optDack = !this.optDack
      this.optRent = true
      this.optDirect = true
      this.optWhole = true
      this.optLeasing = true
    },
    // 每一页用户信息
    pageUserInfo(v) {
      // 没选标签
      if (this.optFor === 0) {
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            if (res[i].position.slice(5, 6) === '1') {
              res[i].position = '等级1'
            } else if (res[i].position.slice(5, 6) === '2') {
              res[i].position = '等级2'
            }
            if (res[i].character === 'direct') {
              res[i].character = '直营'
            } else if (res[i].character === 'rent') {
              res[i].character = '租车'
            } else if (res[i].character === 'leasing') {
              res[i].character = '以租代购'
            } else if (res[i].character === 'withdraw') {
              res[i].character = '退车'
            }
            if (res[i].has_deposit_loan === 'Y') {
              res[i].has_deposit_loan = '是'
            } else {
              res[i].has_deposit_loan = '否'
            }
            if (res[i].can_cashout_onMon === 'Y') {
              res[i].can_cashout_onMon = '是'
            } else {
              res[i].can_cashout_onMon = '否'
            }
            if (res[i].renewal === 'Y') {
              res[i].renewal = '是'
            } else {
              res[i].renewal = '否'
            }
          }
          this.pageShow = true
          this.userdata = res
          this.loading = false
        })
        sessionStorage.setItem('currentPage', JSON.stringify(v))
        // 选全部
      } else if (this.optFor === 1) {
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            if (res[i].position.slice(5, 6) === '1') {
              res[i].position = '等级1'
            } else if (res[i].position.slice(5, 6) === '2') {
              res[i].position = '等级2'
            }
            if (res[i].character === 'direct') {
              res[i].character = '直营'
            } else if (res[i].character === 'rent') {
              res[i].character = '租车'
            } else if (res[i].character === 'leasing') {
              res[i].character = '以租代购'
            } else if (res[i].character === 'withdraw') {
              res[i].character = '退车'
            }
            if (res[i].has_deposit_loan === 'Y') {
              res[i].has_deposit_loan = '是'
            } else {
              res[i].has_deposit_loan = '否'
            }
            if (res[i].can_cashout_onMon === 'Y') {
              res[i].can_cashout_onMon = '是'
            } else {
              res[i].can_cashout_onMon = '否'
            }
            if (res[i].renewal === 'Y') {
              res[i].renewal = '是'
            } else {
              res[i].renewal = '否'
            }
          }
          this.pageShow = true
          this.userdata = res
          this.loading = false
        })
        sessionStorage.setItem('currentPage', JSON.stringify(v))
        // 选直营
      } else if (this.optFor === 2) {
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        query.statTo('where', { 'character': 'direct' })
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            if (res[i].position.slice(5, 6) === '1') {
              res[i].position = '等级1'
            } else if (res[i].position.slice(5, 6) === '2') {
              res[i].position = '等级2'
            }
            if (res[i].character === 'direct') {
              res[i].character = '直营'
            } else if (res[i].character === 'rent') {
              res[i].character = '租车'
            } else if (res[i].character === 'leasing') {
              res[i].character = '以租代购'
            } else if (res[i].character === 'withdraw') {
              res[i].character = '退车'
            }
            if (res[i].has_deposit_loan === 'Y') {
              res[i].has_deposit_loan = '是'
            } else {
              res[i].has_deposit_loan = '否'
            }
            if (res[i].can_cashout_onMon === 'Y') {
              res[i].can_cashout_onMon = '是'
            } else {
              res[i].can_cashout_onMon = '否'
            }
            if (res[i].renewal === 'Y') {
              res[i].renewal = '是'
            } else {
              res[i].renewal = '否'
            }
          }
          this.pageShow = true
          this.userdata = res
          this.loading = false
        })
        sessionStorage.setItem('chainPage', JSON.stringify(v))
        // 选租车
      } else if (this.optFor === 3) {
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        query.statTo('where', { 'character': 'rent' })
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            if (res[i].position.slice(5, 6) === '1') {
              res[i].position = '等级1'
            } else if (res[i].position.slice(5, 6) === '2') {
              res[i].position = '等级2'
            }
            if (res[i].character === 'direct') {
              res[i].character = '直营'
            } else if (res[i].character === 'rent') {
              res[i].character = '租车'
            } else if (res[i].character === 'leasing') {
              res[i].character = '以租代购'
            } else if (res[i].character === 'withdraw') {
              res[i].character = '退车'
            }
            if (res[i].has_deposit_loan === 'Y') {
              res[i].has_deposit_loan = '是'
            } else {
              res[i].has_deposit_loan = '否'
            }
            if (res[i].can_cashout_onMon === 'Y') {
              res[i].can_cashout_onMon = '是'
            } else {
              res[i].can_cashout_onMon = '否'
            }
            if (res[i].renewal === 'Y') {
              res[i].renewal = '是'
            } else {
              res[i].renewal = '否'
            }
          }
          this.pageShow = true
          this.userdata = res
          this.loading = false
        })
        sessionStorage.setItem('rentPage', JSON.stringify(v))
        // 以租代购
      } else if (this.optFor === 4) {
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        query.statTo('where', { 'character': 'leasing' })
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            if (res[i].position.slice(5, 6) === '1') {
              res[i].position = '等级1'
            } else if (res[i].position.slice(5, 6) === '2') {
              res[i].position = '等级2'
            }
            if (res[i].character === 'direct') {
              res[i].character = '直营'
            } else if (res[i].character === 'rent') {
              res[i].character = '租车'
            } else if (res[i].character === 'leasing') {
              res[i].character = '以租代购'
            } else if (res[i].character === 'withdraw') {
              res[i].character = '退车'
            }
            if (res[i].has_deposit_loan === 'Y') {
              res[i].has_deposit_loan = '是'
            } else {
              res[i].has_deposit_loan = '否'
            }
            if (res[i].can_cashout_onMon === 'Y') {
              res[i].can_cashout_onMon = '是'
            } else {
              res[i].can_cashout_onMon = '否'
            }
            if (res[i].renewal === 'Y') {
              res[i].renewal = '是'
            } else {
              res[i].renewal = '否'
            }
          }
          this.pageShow = true
          this.userdata = res
          this.loading = false
        })
        sessionStorage.setItem('hirePage', JSON.stringify(v))
      } else if (this.optFor === 5) {
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        query.statTo('where', { 'character': 'withdraw' })
        if (v === 1) {
          query.limit(10)
        } else if (v > 1) {
          let num = (v - 1) * 10
          query.skip(num)
          query.limit(10)
        }
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            if (res[i].position.slice(5, 6) === '1') {
              res[i].position = '等级1'
            } else if (res[i].position.slice(5, 6) === '2') {
              res[i].position = '等级2'
            }
            if (res[i].character === 'direct') {
              res[i].character = '直营'
            } else if (res[i].character === 'rent') {
              res[i].character = '租车'
            } else if (res[i].character === 'leasing') {
              res[i].character = '以租代购'
            } else if (res[i].character === 'withdraw') {
              res[i].character = '退车'
            }
            if (res[i].has_deposit_loan === 'Y') {
              res[i].has_deposit_loan = '是'
            } else {
              res[i].has_deposit_loan = '否'
            }
            if (res[i].can_cashout_onMon === 'Y') {
              res[i].can_cashout_onMon = '是'
            } else {
              res[i].can_cashout_onMon = '否'
            }
            if (res[i].renewal === 'Y') {
              res[i].renewal = '是'
            } else {
              res[i].renewal = '否'
            }
          }
          this.pageShow = true
          this.userdata = res
          this.loading = false
        })
        sessionStorage.setItem('backPage', JSON.stringify(v))
      }
    },
    // 改变页数
    alterNumberPages() {
      if (JSON.parse(sessionStorage.getItem('optFor')) !== null) {
        this.optFor = JSON.parse(sessionStorage.getItem('optFor'))
      }
      if (this.optFor === 0 || this.optFor === 1) {
        if (JSON.parse(sessionStorage.getItem('currentPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('currentPage'))
        }
      } else if (this.optFor === 2) {
        if (JSON.parse(sessionStorage.getItem('chainPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('chainPage'))
        }
      } else if (this.optFor === 3) {
        if (JSON.parse(sessionStorage.getItem('rentPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('rentPage'))
        }
      } else if (this.optFor === 4) {
        if (JSON.parse(sessionStorage.getItem('hirePage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('hirePage'))
        }
      } else if (this.optFor === 5) {
        if (JSON.parse(sessionStorage.getItem('backPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('backPage'))
        }
      }
    },
    inRowInfo(data) {
      // this.ADDLABEL({ arr: this.tallyWen[0], user: data.user })
      // sessionStorage.setItem('labelArr', JSON.stringify(this.labelArr))
      sessionStorage.setItem('rowInfo', JSON.stringify(data))
      sessionStorage.removeItem('arrNum')
      if (this.trim === 1) {
        this.alterCustom.user = data.realName
        this.alterCustom.deposit_amount = data.deposit_amount
        this.alterCustom.cell = data.phone
        if (data.character === '直营') {
          this.alterCustom.character = 'direct'
        } else if (data.character === '租车') {
          this.alterCustom.character = 'rent'
        } else if (data.character === '以租代购') {
          this.alterCustom.character = 'leasing'
        } else if (data.character === '退车') {
          this.alterCustom.character = 'withdraw'
        }
        if (data.position === '等级1') {
          this.alterCustom.position = 'lever1'
        } else {
          this.alterCustom.position = 'lever2'
        }
        if (data.has_deposit_loan === '是') {
          this.alterCustom.has_deposit_loan = 'Y'
        } else if (data.has_deposit_loan === '否') {
          this.alterCustom.has_deposit_loan = 'N'
        }
        if (data.can_cashout_onMon === '是') {
          this.alterCustom.can_cashout_onMon = 'Y'
        } else if (data.can_cashout_onMon === '否') {
          this.alterCustom.can_cashout_onMon = 'N'
        }
        if (data.renewal === '是') {
          this.alterCustom.renewal = 'Y'
        } else if (data.renewal === '否') {
          this.alterCustom.renewal = 'N'
        }
      }
    },
    // 删除
    delete() {
      this.modal = true
      this.remText = '提示'
      this.eliminateNum = 2
    },
    // 修改
    amend() {
      this.modal = true
      this.remText = '客户修改'
      this.eliminateNum = 4
      this.trim = 1
    },
    // 续约时间
    active(v) {
      this.alterCustom.activeDate = v
      let M = Number(v.split('-')[1]) + Number(this.alterCustom.contract)
      let Y = Number(v.split('-')[0])
      if (M > 12) {
        Y = Y + 1
        M = M - 12
      }
      if (M < 10) {
        this.withdraw_date = `${Y}-0${M}-${v.split('-')[2]}`
      } else {
        this.withdraw_date = `${Y}-${M}-${v.split('-')[2]}`
      }
    },
    // 新增
    add() {
      this.modal = true
      this.remText = '新增客户'
      this.eliminateNum = 1
      this.trim = 2
    },
    ok() {
      this.modal = false
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      let _this = this
      if (this.eliminateNum === 2) {
        let objectId = JSON.parse(sessionStorage.getItem('rowInfo')).objectId
        query.destroy(objectId).then(res => {
          this.$Modal.warning({
            title: '删除成功',
            onOk() {
              _this.reloadRouter()
              _this.eliminateNum = 0
            }
          })
          // eslint-disable-next-line
        }).catch(err => {
          this.$Modal.warning({
            title: '删除失败'
          })
        })
      } else if (this.eliminateNum === 1 && this.trim === 2) {
        if (this.formCustom.has_deposit_loan === 'N') {
          this.formCustom.deposit_amount = '0'
        }
        this.handleSubmit('formCustom')
      } else if (this.eliminateNum === 4 && this.trim === 1) {
        this.alterSubmit('alterCustom')
      }
    },
    // 用户新增
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          // eslint-disable-next-line
          let query = Bmob.Query('_User')
          query.set('realName', this.formCustom.user)
          query.set('phone', this.formCustom.cell)
          query.set('username', this.formCustom.cell)
          query.set('character', this.formCustom.character)
          query.set('has_deposit_loan', this.formCustom.has_deposit_loan)
          query.set('deposit_amount', this.formCustom.deposit_amount)
          query.set('password', '123456')
          query.set('position', 'lever2')
          query.set('status', 'user')
          // eslint-disable-next-line
          query.save().then(res => {
            this.$Modal.warning({
              title: '添加成功',
              onOk() {
                _this.reloadRouter()
                _this.eliminateNum = 0
                _this.trim = 0
              }
            })
            // eslint-disable-next-line
          }).catch(err => {
            this.$Modal.warning({
              // eslint-disable-next-line
              title: '添加失败'
            })
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    // 客户修改
    alterSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          let objectId = JSON.parse(sessionStorage.getItem('rowInfo')).objectId
          // eslint-disable-next-line
          let query = Bmob.Query('_User')
          query.set('id', objectId)
          query.set('realName', this.alterCustom.user)
          query.set('phone', this.alterCustom.cell)
          query.set('username', this.alterCustom.cell)
          query.set('character', this.alterCustom.character)
          query.set('position', this.alterCustom.position)
          query.set('has_deposit_loan', this.alterCustom.has_deposit_loan)
          query.set('can_cashout_onMon', this.alterCustom.can_cashout_onMon)
          query.set('deposit_amount', this.alterCustom.deposit_amount)
          query.set('renewal', this.alterCustom.renewal)
          if (this.alterCustom.renewal === 'Y') {
            query.set('contract_duration', this.alterCustom.contract)
            query.set('active_date', {
              '__type': 'Date',
              'iso': `${this.alterCustom.activeDate} 00:00:00`
            })
            query.set('withdraw_date', {
              '__type': 'Date',
              'iso': `${this.withdraw_date} 00:00:00`
            })
            query.equalTo('objectId', '==', objectId)
            query.find().then(res => {
              // 把现在用户的信息复制带history_user数据库中
              // eslint-disable-next-line
              let history_user_query = Bmob.Query('history_user')
              for (let k in res.results[0]) {
                if (k !== 'objectId' && k !== 'cash_out' && k !== 'history_relate' && k !== 'credit' && k !== 'commission_relate' && k !== 'relate' && k !== 'createdAt' && k !== 'updatedAt' && k !== 'renewal' && k !== 'user_rent' && k !== 'history_user') {
                  history_user_query.set(k, res.results[0][k])
                }
              }
              history_user_query.set('renewal', this.alterCustom.renewal)
              history_user_query.save().then(resU => {
                // 把history_relate绑至现用户
                // eslint-disable-next-line
                let add_relation_bind = Bmob.Relation('history_user')
                let add_relID_bind = add_relation_bind.add(resU.objectId)
                // eslint-disable-next-line
                let user_query_bind = Bmob.Query('_User')
                user_query_bind.get(objectId).then(resH => {
                  resH.set('history_user', add_relID_bind)
                  resH.save()
                })
              })
            })
          } else if (this.alterCustom.renewal === 'N' && this.alterCustom.character === 'withdraw') {
            query.equalTo('objectId', '==', objectId)
            query.find().then(res => {
              // 把现在用户的信息复制带history_user数据库中
              // eslint-disable-next-line
              let history_user_query = Bmob.Query('history_user')
              for (let k in res.results[0]) {
                if (k !== 'objectId' && k !== 'cash_out' && k !== 'history_relate' && k !== 'credit' && k !== 'commission_relate' && k !== 'relate' && k !== 'createdAt' && k !== 'updatedAt' && k !== 'renewal' && k !== 'user_rent' && k !== 'history_user') {
                  history_user_query.set(k, res.results[0][k])
                }
              }
              history_user_query.set('renewal', this.alterCustom.renewal)
              history_user_query.save().then(resU => {
                // 把history_relate绑至现用户
                // eslint-disable-next-line
                let add_relation_bind = Bmob.Relation('history_user')
                let add_relID_bind = add_relation_bind.add(resU.objectId)
                // eslint-disable-next-line
                let user_query_bind = Bmob.Query('_User')
                user_query_bind.get(objectId).then(resH => {
                  resH.set('history_user', add_relID_bind)
                  resH.save()
                })
              })
            })
          }
          // eslint-disable-next-line
          query.save().then(res => {
            this.$Modal.warning({
              title: '修改成功',
              onOk() {
                _this.reloadRouter()
                _this.eliminateNum = 0
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
    },
    // 车辆信息
    carinfo() {
      this.GAINTALLTHREE(0)
      sessionStorage.setItem('keyT', JSON.stringify(0))
      this.$router.push({ path: '/finance/client/carinfo' })
      this.eliminateNum = 0
    },
    // 流水信息
    moneyinfo() {
      this.eliminateNum = 0
      this.GAINTALLTHREE(1)
      sessionStorage.setItem('keyT', JSON.stringify(1))
      this.$router.push({ path: '/finance/client/moneyinfo' })
    },
    // 详细
    particular() {
      this.eliminateNum = 0
      this.GAINTALLTHREE(2)
      sessionStorage.setItem('keyT', JSON.stringify(2))
      this.$router.push({ path: '/finance/client/particular' })
    }
    // // 现额信息
    // forehead() {
    //   this.eliminateNum = 0
    //   this.GAINTALLWEN(2)
    //   sessionStorage.setItem('key', JSON.stringify(2))
    //   this.$router.push({ path: '/finance/moneyflow' })
    // }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.client {
  position: relative;

  // .icon {
  //   position: absolute;
  //   top: 8%;
  //   left: 70%;
  //   z-index: 100;
  // }
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
      top: 10px;
      left: 220px;
      z-index: 100;
      font-size: 16px;
    }

    .but {
      position: absolute;
      top: 0;
      left: 250px;
      z-index: 100;
    }

    .butAdd {
      position: absolute;
      top: 0;
      left: 320px;
      z-index: 100;
    }
  }

  .router_user {
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
