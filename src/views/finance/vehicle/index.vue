<template>
  <div class="vehicle" ref="inte">
    <div class="box">
      <div class="sumUp">
        <div class="sun_1">
          <Tag color="cyan" @click.native="whole">
            <span class="txt">全部车辆</span>
            <span class="num">{{carHeadNum}}台</span>
          </Tag>
        </div>
        <div class="sun_2">
          <Tag color="blue" @click.native="rent">
            <span class="txt">已租车辆</span>
            <span class="num">{{rentOutHeadNum}}台</span>
          </Tag>
        </div>
        <div class="sun_3">
          <Tag color="geekblue" @click.native="bank">
            <span class="txt">待出库车辆</span>
            <span class="num">{{toLetHeadNum}}台</span>
          </Tag>
        </div>
        <div class="sun_4">
          <Tag color="purple" @click.native="ruin">
            <span class="txt">维修中车辆</span>
            <span class="num">{{beInDangerHeadNum}}台</span>
          </Tag>
        </div>
        <div class="sun_5">
          <Tag color="purple" @click.native="quit">
            <span class="txt">退还车辆</span>
            <span class="num">{{retreatHeadNum}}台</span>
          </Tag>
        </div>
        <div class="sun_6">
          <Tag color="purple">
            <span class="txt">租金总和</span>
            <span class="num">{{rentSumNum}}元</span>
          </Tag>
        </div>
      </div>
      <div class="band"></div>
      <div class="search">
        <Input placeholder="请输入车牌号" style="width: auto" v-model="searchNuse" @input="refresh"></Input>
        <Icon type="ios-search" slot="suffix" class="icon" />
        <Button type="primary" @click="search">搜索</Button>
        <Button type="primary" @click="add">新增</Button>
        <Button type="primary" @click="derive">一键导出违章</Button>
      </div>
      <div class="band_1"></div>
      <Table border :columns="columns" :data="vehicledata" @on-row-click="inRowInfo" :loading="loading"></Table>
      <div class="band_1"></div>
      <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
      <Modal v-model="modal" :title="remText" @on-ok="ok">
        <p style="display:block; text-align:center; margin-top: 10px; font-size: 16px;" v-if="eliminateNum === 2? true : false">是否删除该车辆</p>
        <p style="display:block; text-align:center; margin-top: 10px; font-size: 16px;" v-if="eliminateNum === 4? true : false">是否退还该车辆</p>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" v-if="eliminateNum === 1? true : false">
          <FormItem label="车牌" prop="plate">
            <Input type="text" v-model="formCustom.plate" placeholder="请输入车牌号"></Input>
          </FormItem>
          <FormItem label="车型" prop="vehicle_type">
            <Input type="text" v-model="formCustom.vehicle_type" placeholder="请输入车型"></Input>
          </FormItem>
          <FormItem label="车辆颜色" prop="color">
            <Input type="text" v-model="formCustom.color" placeholder="请输入车辆颜色"></Input>
          </FormItem>
          <FormItem label="供应商" prop="belong_to">
            <Input type="text" v-model="formCustom.belong_to" placeholder="请输入供应商"></Input>
          </FormItem>
          <FormItem label="发动机号" prop="engine_num">
            <Input type="text" v-model="formCustom.engine_num" placeholder="请输入发动机号"></Input>
          </FormItem>
          <FormItem label="vin码" prop="vin_num">
            <Input type="text" v-model="formCustom.vin_num" placeholder="请输入vin码"></Input>
          </FormItem>
          <FormItem label="租金" prop="rent_fee">
            <Input type="text" v-model="formCustom.rent_fee" placeholder="请输入租金"></Input>
          </FormItem>
          <FormItem label="运输证" prop="has_trans_certi">
            <Select v-model="formCustom.has_trans_certi" placeholder="请选择是否有运输证">
              <Option value="有">有</Option>
              <Option value="无">无</Option>
            </Select>
          </FormItem>
          <FormItem label="出车类型" prop="car_type">
            <Select v-model="formCustom.car_type" placeholder="请选择出车类型">
              <Option value="02">小型汽车</Option>
              <Option value="52">新能源小车</Option>
            </Select>
          </FormItem>
          <FormItem label="车辆状态" prop="status">
            <Select v-model="formCustom.status" placeholder="请选择车辆状态">
              <Option value="在租">在租</Option>
              <Option value="维修中">维修中</Option>
              <Option value="待出库">待出库</Option>
            </Select>
          </FormItem>
          <FormItem label="续航类型" prop="user">
            <Select v-model="formCustom.battery_type" placeholder="请选择续航类型">
              <Option value="high_battery">高续航</Option>
              <Option value="low_battery">低续航</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
    <router-view class="router_integral" v-if="vehivleRouter"></router-view>
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
    this.quitNumber()
    this.rentSum()
  },
  mounted() {
    this.$nextTick(() => {
      // this.taHeight = this.$refs.inte.offsetHeight - 64
      this.toLead()
    })
  },
  updated() {

  },
  provide() {
    return {
      vehReloadRouter: this.vehReloadRouter,
      pageUser: this.pageUserInfo
    }
  },
  data() {
    return {
      formCustom: {
        plate: '',
        vehicle_type: '',
        color: '',
        belong_to: '',
        engine_num: '',
        vin_num: '',
        rent_fee: '',
        has_trans_certi: '',
        car_type: '',
        status: '',
        battery_type: ''
      },
      ruleCustom: {
        plate: [
          // eslint-disable-next-line
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        vehicle_type: [
          // eslint-disable-next-line
          { required: true, message: '车型不能为空', trigger: 'blur' }
        ],
        color: [
          // eslint-disable-next-line
          { required: true, message: '车辆颜色不能为空', trigger: 'blur' }
        ],
        belong_to: [
          // eslint-disable-next-line
          { required: true, message: '供应商不能为空', trigger: 'blur' }
        ],
        engine_num: [
          // eslint-disable-next-line
          { required: true, message: '发动机号不能为空', trigger: 'blur' }
        ],
        vin_num: [
          // eslint-disable-next-line
          { required: true, message: 'vin码不能为空', trigger: 'blur' }
        ],
        rent_fee: [
          // // eslint-disable-next-line
          { required: true, message: '租金不能为空', trigger: 'blur' }
        ],
        has_trans_certi: [
          // eslint-disable-next-line
          { required: true, message: '运输证不能为空', trigger: 'blur' }
        ],
        status: [
          // eslint-disable-next-line
          { required: true, message: '车辆状态不能为空', trigger: 'blur' }
        ],
        battery_type: [
          // eslint-disable-next-line
          { required: true, message: '续航类型不能为空', trigger: 'blur' }
        ]
      },
      columns: [{
          title: '姓名',
          key: 'realName',
          width: 80
        }, {
          title: '车牌',
          key: 'plate',
          width: 100
        },
        {
          title: '车型',
          key: 'vehicle_type'
        },
        {
          title: '租金',
          key: 'rent_fee'
        },
        {
          title: '车辆状态',
          key: 'status'
        },
        {
          title: '总闲置成本',
          key: 'idle_cost'
        },
        {
          title: '详情',
          key: 'action',
          fixed: 'right',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: this.threatened
                }
              }, '出险记录'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: this.regulations
                }
              }, '违章查询')
            ])
          }
        }
      ],
      vehicledata: [],
      promiseArray: [],
      amount: 0, // 正常车辆总数
      sun: 0, // 车辆总数
      currentPage: 1,
      searchNuse: '',
      loading: false,
      companyIoading: false,
      taHeight: 0,
      modal: false,
      integralNum: '',
      remShow: false,
      remText: '',
      checkNum: 0,
      eliminateNum: 0,
      carHeadNum: 0, // 车辆总数
      rentOutHeadNum: 0, // 出租车辆总数
      toLetHeadNum: 0, // 待租车辆总数
      beInDangerHeadNum: 0, // 出险车辆总数
      retreatHeadNum: 0, // 已退还车辆
      rentSumNum: 0, // 租金总和
      optFor: 0, // 标签的选中
      optWhole: true, // 全部标签选中
      optRent: true, // 已租标签选中
      optDank: true, // 待出库标签选中
      optRuin: true, // 维修中标签选中
      retreatRuin: true, // 退还标签选中
      pageShow: true,
      trim: 0,
      vehivleRouter: true, // 路由显示
      carType: '',
      breakInfo: [],
      user: '',
      arrAcrInfo: [],
      Eheader: ['姓名', '车牌号', '车架号', '发动机号', '处理状态', '缴费状态', '违章时间', '采集机构名称', '违章地点', '违章行为', '违章扣分', '罚款本金'], // Excel的表头
      Eval: ['user', 'plate', 'vin_num', 'engine_num', 'clbjmc', 'jkbjmc', 'wfsj', 'cjjgmc', 'wfdz', 'wfxw', 'wfjfs', 'fkje'] // Excel表所对应的Key
    }
  },
  computed: {
    ...mapState(['mass'])
  },
  methods: {
    ...mapMutations(['GAINTALLWEN', 'GAINMASS', 'GAINTALLTHREE']),
    // 路由刷新
    vehReloadRouter() {
      this.vehivleRouter = false
      this.$nextTick(function() {
        this.vehivleRouter = true
      })
    },
    // 搜索
    search() {
      this.loading = true
      this.promiseArray = []
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.equalTo('plate', '==', this.searchNuse)
      query.find().then(res => {
        for (let i = 0, max = res.length; i < max; i++) {
          if (res[i].battery_type === 'low_battery') {
            res[i].battery_type = '低续航'
          } else if (res[i].battery_type === 'high_battery') {
            res[i].battery_type = '高续航'
          }
          if (res[i].car_type === '02') {
            res[i].car_type = '小型汽车'
          } else if (res[i].car_type === '52') {
            res[i].car_type = '新能源小车'
          }
          query.field('bind_user', res[i].objectId)
          this.promiseArray.push(query.relation('_User'))
        }
        Promise.all(this.promiseArray).then(resp => {
          for (let j = 0, max = resp.length; j < max; j++) {
            if (resp[j].results[0] !== undefined) {
              res[j].realName = resp[j].results[0].realName
            }
            this.vehicledata = res
          }
        })
        this.pageShow = false
        this.loading = false
      })
    },
    // 搜索后刷新
    refresh() {
      if (this.searchNuse.length === 0) {
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
      }
    },
    // 租金总和
    rentSum() {
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.statTo('status', '!=', '已退还')
      query.statTo('sum', 'rent_fee')
      query.find().then(res => {
        this.rentSumNum = res[0]._sumRent_fee
      })
    },
    // 车辆总数
    userSum() {
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.count().then(res => {
        this.sun = res
        this.userNumber()
        this.rentOutNumber()
        this.forOutboundNumber()
        this.inMaintenanceNumber()
      })
    },
    // 车辆总数
    userNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.equalTo('status', '!=', '已退还')
      query.count().then(res => {
        this.carHeadNum = res
        this.sun = res
      })
    },
    // 总数标签
    whole() {
      if (this.optWhole) {
        this.optFor = 1
        this.currentPage = 1
        this.pageUserInfo(1)
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
      }
      this.userSum()
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optWhole = !this.optWhole
      this.optDank = true
      this.optRent = true
      this.optRuin = true
      this.retreatRuin = true
    },
    // 车辆出租总数
    rentOutNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.equalTo('status', '==', '在租')
      query.count().then(res => {
        this.rentOutHeadNum = res
      })
    },
    // 车辆出租标签
    rent() {
      if (this.optRent) {
        this.optFor = 2
        this.currentPage = 1
        this.pageUserInfo(1)
        this.sun = this.rentOutHeadNum
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
        this.userSum()
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optRent = !this.optRent
      this.optWhole = true
      this.optDank = true
      this.optRuin = true
      this.retreatRuin = true
    },
    // 车辆待出库总数
    forOutboundNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.equalTo('status', '==', '待出库')
      query.count().then(res => {
        this.toLetHeadNum = res
      })
    },
    // 车辆待出库标签
    bank() {
      if (this.optDank) {
        this.optFor = 3
        this.currentPage = 1
        this.pageUserInfo(1)
        this.sun = this.toLetHeadNum
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
        this.userSum()
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optDank = !this.optDank
      this.optRent = true
      this.optWhole = true
      this.optRuin = true
      this.retreatRuin = true
    },
    // 车辆维修中总数
    inMaintenanceNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.equalTo('status', '==', '维修中')
      query.count().then(res => {
        this.beInDangerHeadNum = res
      })
    },
    // 车辆维修中标签
    ruin() {
      if (this.optRuin) {
        this.optFor = 4
        this.currentPage = 1
        this.pageUserInfo(1)
        this.sun = this.beInDangerHeadNum
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
        this.userSum()
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.optRuin = !this.optRuin
      this.optDank = true
      this.optRent = true
      this.optWhole = true
      this.retreatRuin = true
    },
    // 车辆退还总数
    quitNumber() {
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.equalTo('status', '==', '已退还')
      query.count().then(res => {
        this.retreatHeadNum = res
      })
    },
    // 车辆退还标签
    quit() {
      if (this.optRuin) {
        this.optFor = 5
        this.currentPage = 1
        this.pageUserInfo(1)
        this.sun = this.retreatHeadNum
      } else {
        this.optFor = 0
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
        this.userSum()
      }
      sessionStorage.setItem('optFor', JSON.stringify(this.optFor))
      this.retreatRuin = !this.retreatRuin
      this.optRuin = true
      this.optDank = true
      this.optRent = true
      this.optWhole = true
    },
    // 每一页用户信息
    pageUserInfo(v) {
      if (this.optFor === 0) {
        this.loading = true
        this.promiseArray = []
        // eslint-disable-next-line
        let query = Bmob.Query('car')
        query.statTo('where', {
          'status': { '$ne': '已退还' }
        })
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
            if (res[i].battery_type === 'low_battery') {
              res[i].battery_type = '低续航'
            } else if (res[i].battery_type === 'high_battery') {
              res[i].battery_type = '高续航'
            }
            if (res[i].car_type === '02') {
              res[i].car_type = '小型汽车'
            } else if (res[i].car_type === '52') {
              res[i].car_type = '新能源小车'
            }
            query.field('bind_user', res[i].objectId)
            this.promiseArray.push(query.relation('_User'))
          }
          Promise.all(this.promiseArray).then(resp => {
            for (let j = 0, max = resp.length; j < max; j++) {
              if (resp[j].results[0] !== undefined) {
                res[j].realName = resp[j].results[0].realName
              }
              this.vehicledata = res
              this.pageShow = true
              this.loading = false
              sessionStorage.setItem('currentPage', JSON.stringify(v))
            }
          })
        })
        // 选全部
      } else if (this.optFor === 1) {
        this.loading = true
        this.promiseArray = []
        // eslint-disable-next-line
        let query = Bmob.Query('car')
        query.statTo('where', {
          'status': { '$ne': '已退还' }
        })
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
            if (res[i].battery_type === 'low_battery') {
              res[i].battery_type = '低续航'
            } else if (res[i].battery_type === 'high_battery') {
              res[i].battery_type = '高续航'
            }
            if (res[i].car_type === '02') {
              res[i].car_type = '小型汽车'
            } else if (res[i].car_type === '52') {
              res[i].car_type = '新能源小车'
            }
            query.field('bind_user', res[i].objectId)
            this.promiseArray.push(query.relation('_User'))
          }
          Promise.all(this.promiseArray).then(resp => {
            for (let j = 0, max = resp.length; j < max; j++) {
              if (resp[j].results[0] !== undefined) {
                res[j].realName = resp[j].results[0].realName
              }
              this.vehicledata = res
              this.pageShow = true
              this.loading = false
              sessionStorage.setItem('currentPage', JSON.stringify(v))
            }
          })
        })
        // 已租
      } else if (this.optFor === 2) {
        this.loading = true
        this.promiseArray = []
        // eslint-disable-next-line
        let query = Bmob.Query('car')
        query.statTo('where', { 'status': '在租' })
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
            if (res[i].battery_type === 'low_battery') {
              res[i].battery_type = '低续航'
            } else if (res[i].battery_type === 'high_battery') {
              res[i].battery_type = '高续航'
            }
            if (res[i].car_type === '02') {
              res[i].car_type = '小型汽车'
            } else if (res[i].car_type === '52') {
              res[i].car_type = '新能源小车'
            }
            query.field('bind_user', res[i].objectId)
            this.promiseArray.push(query.relation('_User'))
          }
          Promise.all(this.promiseArray).then(resp => {
            for (let j = 0, max = resp.length; j < max; j++) {
              if (resp[j].results[0] !== undefined) {
                res[j].realName = resp[j].results[0].realName
              }
              this.vehicledata = res
              this.pageShow = true
              this.loading = false
              sessionStorage.setItem('rentPage', JSON.stringify(v))
            }
          })
        })
        // 待出库
      } else if (this.optFor === 3) {
        this.loading = true
        this.promiseArray = []
        // eslint-disable-next-line
        let query = Bmob.Query('car')
        query.statTo('where', { 'status': '待出库' })
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
            if (res[i].battery_type === 'low_battery') {
              res[i].battery_type = '低续航'
            } else if (res[i].battery_type === 'high_battery') {
              res[i].battery_type = '高续航'
            }
            if (res[i].car_type === '02') {
              res[i].car_type = '小型汽车'
            } else if (res[i].car_type === '52') {
              res[i].car_type = '新能源小车'
            }
            query.field('bind_user', res[i].objectId)
            this.promiseArray.push(query.relation('_User'))
          }
          Promise.all(this.promiseArray).then(resp => {
            for (let j = 0, max = resp.length; j < max; j++) {
              if (resp[j].results[0] !== undefined) {
                res[j].realName = resp[j].results[0].realName
              }
              this.vehicledata = res
              this.pageShow = true
              this.loading = false
              sessionStorage.setItem('bankPage', JSON.stringify(v))
            }
          })
        })
        // 维修中
      } else if (this.optFor === 4) {
        this.loading = true
        this.promiseArray = []
        // eslint-disable-next-line
        let query = Bmob.Query('car')
        query.statTo('where', { 'status': '维修中' })
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
            if (res[i].battery_type === 'low_battery') {
              res[i].battery_type = '低续航'
            } else if (res[i].battery_type === 'high_battery') {
              res[i].battery_type = '高续航'
            }
            if (res[i].car_type === '02') {
              res[i].car_type = '小型汽车'
            } else if (res[i].car_type === '52') {
              res[i].car_type = '新能源小车'
            }
            query.field('bind_user', res[i].objectId)
            this.promiseArray.push(query.relation('_User'))
          }
          Promise.all(this.promiseArray).then(resp => {
            for (let j = 0, max = resp.length; j < max; j++) {
              if (resp[j].results[0] !== undefined) {
                res[j].realName = resp[j].results[0].realName
              }
              this.vehicledata = res
              this.pageShow = true
              this.loading = false
              sessionStorage.setItem('ruinPage', JSON.stringify(v))
            }
          })
        })
        // 已退还
      } else if (this.optFor === 5) {
        this.loading = true
        this.promiseArray = []
        // eslint-disable-next-line
        let query = Bmob.Query('car')
        query.statTo('where', { 'status': '已退还' })
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
            if (res[i].battery_type === 'low_battery') {
              res[i].battery_type = '低续航'
            } else if (res[i].battery_type === 'high_battery') {
              res[i].battery_type = '高续航'
            }
            if (res[i].car_type === '02') {
              res[i].car_type = '小型汽车'
            } else if (res[i].car_type === '52') {
              res[i].car_type = '新能源小车'
            }
            query.field('bind_user', res[i].objectId)
            this.promiseArray.push(query.relation('_User'))
          }
          Promise.all(this.promiseArray).then(resp => {
            for (let j = 0, max = resp.length; j < max; j++) {
              if (resp[j].results[0] !== undefined) {
                res[j].realName = resp[j].results[0].realName
              }
              this.vehicledata = res
              this.pageShow = true
              this.loading = false
              sessionStorage.setItem('retreatPage', JSON.stringify(v))
            }
          })
        })
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
        if (JSON.parse(sessionStorage.getItem('rentPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('rentPage'))
        }
      } else if (this.optFor === 3) {
        if (JSON.parse(sessionStorage.getItem('bankPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('bankPage'))
        }
      } else if (this.optFor === 4) {
        if (JSON.parse(sessionStorage.getItem('ruinPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('ruinPage'))
        }
      } else if (this.optFor === 5) {
        if (JSON.parse(sessionStorage.getItem('retreatPage')) !== null) {
          this.currentPage = JSON.parse(sessionStorage.getItem('retreatPage'))
        }
      }
    },
    inRowInfo(data) {
      sessionStorage.setItem('rowInfo', JSON.stringify(data))
      if (this.trim === 1) {
        this.formCustom.plate = data.plate
        this.formCustom.vehicle_type = data.vehicle_type
        this.formCustom.color = data.color
        this.formCustom.belong_to = data.belong_to
        this.formCustom.engine_num = data.engine_num
        this.formCustom.vin_num = data.vin_num
        this.formCustom.rent_fee = data.rent_fee.toString()
        this.formCustom.has_trans_certi = data.has_trans_certi
        if (data.car_type === '小型汽车') {
          this.formCustom.car_type = '02'
        } else if (data.car_type === '新能源小车') {
          this.formCustom.car_type = '52'
        }
        if (data.battery_type === '低续航') {
          this.formCustom.battery_type = 'low_battery'
        } else if (data.battery_type === '高续航') {
          this.formCustom.battery_type = 'high_battery'
        }
        this.formCustom.status = data.status
      }
    },
    // 绑定历史
    binding() {
      this.GAINTALLTHREE(0)
      sessionStorage.setItem('keyT', JSON.stringify(0))
      this.$router.push({ path: '/finance/vehicle/bindinghistory' })
      this.eliminateNum = 3
    },
    // 出险历史
    threatened() {
      this.GAINTALLTHREE(1)
      sessionStorage.setItem('keyT', JSON.stringify(1))
      this.$router.push({ path: '/finance/vehicle/threatened' })
      this.eliminateNum = 5
    },
    // 违章查询
    regulations() {
      this.GAINTALLTHREE(2)
      sessionStorage.setItem('keyT', JSON.stringify(2))
      this.$router.push({ path: '/finance/vehicle/regulations' })
      this.eliminateNum = 6
    },
    // 退车
    retreat() {
      this.modal = true
      this.remText = '提示'
      this.eliminateNum = 4
    },
    // 修改
    amend() {
      this.modal = true
      this.remText = '车辆修改'
      this.eliminateNum = 1
      this.trim = 1
    },
    // 删除
    delete() {
      this.modal = true
      this.remText = '提示'
      this.eliminateNum = 2
    },
    // 新增
    add() {
      this.modal = true
      this.remText = '新增车辆'
      this.eliminateNum = 1
      this.trim = 2
      this.formCustom.plate = ''
      this.formCustom.vehicle_type = ''
      this.formCustom.color = ''
      this.formCustom.belong_to = ''
      this.formCustom.engine_num = ''
      this.formCustom.vin_num = ''
      this.formCustom.rent_fee = ''
      this.formCustom.has_trans_certi = ''
      this.formCustom.car_type = ''
      this.formCustom.battery_type = ''
      this.formCustom.status = ''
    },
    ok() {
      this.modal = false
      // eslint-disable-next-line
      let query = Bmob.Query('car')
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
        this.handleSubmit('formCustom')
      } else if (this.eliminateNum === 1 && this.trim === 1) {
        this.alterSubmit('formCustom')
      } else if (this.eliminateNum === 4) {
        let objectId = JSON.parse(sessionStorage.getItem('rowInfo')).objectId
        // eslint-disable-next-line
        let query = Bmob.Query('car')
        query.set('id', objectId)
        query.set('status', '已退还')
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
      }
    },
    // 车辆新增
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          // eslint-disable-next-line
          let query = Bmob.Query('car')
          query.set('plate', this.formCustom.plate)
          query.set('vehicle_type', this.formCustom.vehicle_type)
          query.set('color', this.formCustom.color)
          query.set('belong_to', this.formCustom.belong_to)
          query.set('engine_num', this.formCustom.engine_num)
          query.set('vin_num', this.formCustom.vin_num)
          query.set('rent_fee', Number(this.formCustom.rent_fee))
          query.set('has_trans_certi', this.formCustom.has_trans_certi)
          query.set('car_type', this.formCustom.car_type)
          query.set('status', this.formCustom.status)
          query.set('battery_type', this.formCustom.battery_type)
          query.set('car_pic', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539343596624&di=b4e7103115eeee2429ab69a3b83300c8&imgtype=0&src=http%3A%2F%2Fimg1.gtimg.com%2Fauto%2Fpics%2Fhv1%2F151%2F83%2F2148%2F139695016.jpg')
          // eslint-disable-next-line
          query.save().then(res => {
            this.$Modal.warning({
              title: '添加成功',
              onOk() {
                _this.reloadRouter()
                _this.eliminateNum = 0
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
    // 车辆修改
    alterSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          let objectId = JSON.parse(sessionStorage.getItem('rowInfo')).objectId
          // eslint-disable-next-line
          let query = Bmob.Query('car')
          query.set('id', objectId)
          query.set('plate', this.formCustom.plate)
          query.set('vehicle_type', this.formCustom.vehicle_type)
          query.set('color', this.formCustom.color)
          query.set('belong_to', this.formCustom.belong_to)
          query.set('engine_num', this.formCustom.engine_num)
          query.set('vin_num', this.formCustom.vin_num)
          query.set('rent_fee', Number(this.formCustom.rent_fee))
          query.set('has_trans_certi', this.formCustom.has_trans_certi)
          query.set('car_type', this.formCustom.car_type)
          query.set('status', this.formCustom.status)
          query.set('battery_type', this.formCustom.battery_type)
          // eslint-disable-next-line
          query.save().then(res => {
            this.$Modal.warning({
              title: '修改成功',
              onOk() {
                _this.reloadRouter()
                _this.eliminateNum = 0
                _this.trim = 1
                _this.trim = 0
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
    // 一键导出违章表
    derive() {
      this.handleDownload(this.breakInfo)
    },
    // 导入
    toLead() {
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      if (this.sun / 500 > 1) {
        for (let i = 0, max = Math.floor(this.sun / 500); i < max; i++) {
          query.skip(i * 500)
          query.statTo('limit', `500`)
          query.statTo('where', {
            'status': { '$ne': '已退还' }
          })
          query.statTo('order', '-createdAt')
          query.find().then(res => {
            for (let i = 0, max = res.length; i < max; i++) {
              let params = {}
              let resInfo = res[i]
              params.plate_no = res[i].plate
              params.car_type = res[i].car_type
              params.eng_no = res[i].engine_num.slice(-6)
              this.$api.get(`/jmt-api/aladdin/getCarInfo`, params, r => {
                if (r.err_code === 0 && r.errcode === 0) {
                  if (r.result.has_vio) {
                    query.field('bind_user', res[i].objectId)
                    query.statTo('order', 'createdAt')
                    query.relation('_User').then(res => {
                      if (res.results.length === 0) {
                        this.user = '无'
                        for (let j = 0, max = r.result_set.length; j < max; j++) {
                          this.breakInfo.push({ user: this.user, plate: resInfo.plate, vin_num: resInfo.vin_num, engine_num: resInfo.engine_num, clbjmc: r.result_set[j].clbjmc, jkbjmc: r.result_set[j].jkbjmc, wfsj: r.result_set[j].wfsj, cjjgmc: r.result_set[j].cjjgmc, wfdz: r.result_set[j].wfdz, wfxw: r.result_set[j].wfxw, wfjfs: r.result_set[j].wfjfs, fkje: r.result_set[j].fkje })
                        }
                      } else {
                        this.user = res.results[0].realName
                        for (let j = 0, max = r.result_set.length; j < max; j++) {
                          this.breakInfo.push({ user: this.user, plate: resInfo.plate, vin_num: resInfo.vin_num, engine_num: resInfo.engine_num, clbjmc: r.result_set[j].clbjmc, jkbjmc: r.result_set[j].jkbjmc, wfsj: r.result_set[j].wfsj, cjjgmc: r.result_set[j].cjjgmc, wfdz: r.result_set[j].wfdz, wfxw: r.result_set[j].wfxw, wfjfs: r.result_set[j].wfjfs, fkje: r.result_set[j].fkje })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      } else {
        query.statTo('limit', `500`)
        query.statTo('where', {
          'status': { '$ne': '已退还' }
        })
        query.statTo('order', '-createdAt')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            let params = {}
            let resInfo = res[i]
            params.plate_no = res[i].plate
            params.car_type = res[i].car_type
            params.eng_no = res[i].engine_num.slice(-6)
            this.$api.get(`/jmt-api/aladdin/getCarInfo`, params, r => {
              if (r.err_code === 0 && r.errcode === 0) {
                if (r.result.has_vio) {
                  query.field('bind_user', res[i].objectId)
                  query.statTo('order', 'createdAt')
                  query.relation('_User').then(res => {
                    if (res.results.length === 0) {
                      this.user = '无'
                      for (let j = 0, max = r.result_set.length; j < max; j++) {
                        this.breakInfo.push({ user: this.user, plate: resInfo.plate, vin_num: resInfo.vin_num, engine_num: resInfo.engine_num, clbjmc: r.result_set[j].clbjmc, jkbjmc: r.result_set[j].jkbjmc, wfsj: r.result_set[j].wfsj, cjjgmc: r.result_set[j].cjjgmc, wfdz: r.result_set[j].wfdz, wfxw: r.result_set[j].wfxw, wfjfs: r.result_set[j].wfjfs, fkje: r.result_set[j].fkje })
                      }
                    } else {
                      this.user = res.results[0].realName
                      for (let j = 0, max = r.result_set.length; j < max; j++) {
                        this.breakInfo.push({ user: this.user, plate: resInfo.plate, vin_num: resInfo.vin_num, engine_num: resInfo.engine_num, clbjmc: r.result_set[j].clbjmc, jkbjmc: r.result_set[j].jkbjmc, wfsj: r.result_set[j].wfsj, cjjgmc: r.result_set[j].cjjgmc, wfdz: r.result_set[j].wfdz, wfxw: r.result_set[j].wfxw, wfjfs: r.result_set[j].wfjfs, fkje: r.result_set[j].fkje })
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    },
    // 导出数据为Excel
    async handleDownload(tableData) {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('@/vendor/Export2Excel')
        const tHeader = this.Eheader
        const filterVal = this.Eval
        const list = tableData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '车辆违章表')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.vehicle {
  position: relative;

  .box {
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
        top: 10px;
        left: 140px;
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

    .rem {
      display: block;
      text-align: center;
      margin-top: 5px;
    }
  }



  .router_integral {
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
