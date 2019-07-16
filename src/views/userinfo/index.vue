<template>
  <div class="userInfo" ref="user">
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
      <Button type="primary" @click="usertemplate" class="temBut" v-if="level === '4' ? true : false">下载模板</Button>
      <Upload ref="upload" :action="action" name="excel-file" :before-upload="catData" :format="['xlsx','xls']" v-if="level === '4' ? true : false">
        <Button type="primary">导入数据</Button>
      </Upload>
      <!-- <Button type="primary" @click="running" class="butRun">一键导出流水</Button> -->
    </div>
    <div class="band_1"></div>
    <Table border :columns="columns" :data="userdata" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="band_1"></div>
    <Page :total="sun" :page-size="30" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
    <Modal v-model="modal" :title="remText" @on-ok="ok">
      <p style="display:block; text-align:center; margin-top: 10px; font-size: 16px;" v-if="eliminateNum === 2? true : false">是否删除该用户</p>
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" v-if="eliminateNum === 1? true : false">
        <FormItem label="客户名" prop="user">
          <Input type="text" v-model="formCustom.user" placeholder="请输入客户名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="cell">
          <Input type="text" v-model="formCustom.cell" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="身份证" prop="identity_card">
          <Input type="text" v-model="formCustom.identity_card" placeholder="请输入身份证号"></Input>
        </FormItem>
        <FormItem label="类型" prop="character">
          <Select v-model="formCustom.character">
            <Option v-for="item in characterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="网约车证" prop="net_around">
          <Select v-model="formCustom.net_around">
            <Option v-for="item in characterNet_around" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="居住证" prop="residence_permit">
          <Select v-model="formCustom.residence_permit">
            <Option value="否">否</Option>
            <Option value="有居住证">有居住证</Option>
            <Option value="本地户口">本地户口</Option>
            <Option value="办理中">办理中</Option>
          </Select>
        </FormItem>
        <FormItem label="经办人" prop="operator">
          <Input type="text" v-model="formCustom.operator" placeholder="请输入经办人姓名"></Input>
        </FormItem>
        <FormItem label="支付方式" prop="payment">
          <Select v-model="formCustom.payment" placeholder="请选择支付方式">
            <Option value="支付宝">支付宝</Option>
            <Option value="微信">微信</Option>
            <Option value="POS">POS</Option>
            <Option value="现金">现金</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="合约期" prop="contract">
  <Input type="text" v-model="formCustom.contract" placeholder="请输入合约期"></Input>
</FormItem>
<FormItem label="提车日期" prop="activeDate">
  <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 250px" @on-change="active" v-model="formCustom.activeDate"></DatePicker>
</FormItem>
 -->
        <FormItem label="交款日期" prop="contributions">
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 250px" @on-change="paymentDate" v-model="formCustom.contributions"></DatePicker>
        </FormItem>
        <FormItem label="紧急联系人" prop="emergency_contact">
          <Input type="text" v-model="formCustom.emergency_contact" placeholder="请输入紧急联系人姓名"></Input>
        </FormItem>
        <FormItem label="联系电话" prop="talk_back">
          <Input type="text" v-model="formCustom.talk_back" placeholder="请输入紧急联系人电话"></Input>
        </FormItem>
        <FormItem label="证件上传">
          <Button type="primary" @click="upload">上传</Button>
        </FormItem>
        <Modal v-model="modal_up" title="上传证件" :closable="false" :footer-hide="true">
          <div style="display: flex;">
            <div style="flex: 1;">
              <IdcardOne :name="formCustom.user"></IdcardOne>
              <span>身份证正面</span>
            </div>
            <div style="flex: 1;">
              <IdcardWen :name="formCustom.user"></IdcardWen>
              <span>身份证反面</span>
            </div>
            <div style="flex: 1;">
              <licenceOne :name="formCustom.user"></licenceOne>
              <span>驾驶证正面</span>
            </div>
            <div style="flex: 1;">
              <licenceWen :name="formCustom.user"></licenceWen>
              <span>驾驶证反面</span>
            </div>
          </div>
        </Modal>
      </Form>
      <Form ref="alterCustom" :model="alterCustom" :rules="alterRuleCustom" :label-width="80" v-if="eliminateNum === 4? true : false">
        <FormItem label="客户名" prop="user">
          <Input type="text" v-model="alterCustom.user" placeholder="请输入客户名"></Input>
        </FormItem>
        <FormItem label="身份证" prop="identity_card">
          <Input type="text" v-model="alterCustom.identity_card" placeholder="请输入身份证号"></Input>
        </FormItem>
        <FormItem label="手机号" prop="cell">
          <Input type="text" v-model="alterCustom.cell" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="类型" prop="character">
          <Select v-model="alterCustom.character">
            <Option v-for="item in characterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="网约车证" prop="net_around">
          <Select v-model="alterCustom.net_around">
            <Option v-for="item in characterNet_around" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="居住证" prop="residence_permit">
          <Select v-model="alterCustom.residence_permit">
            <Option value="否">否</Option>
            <Option value="有居住证">有居住证</Option>
            <Option value="本地户口">本地户口</Option>
            <Option value="办理中">办理中</Option>
          </Select>
        </FormItem>
        <FormItem label="经办人" prop="operator">
          <Input type="text" v-model="alterCustom.operator" placeholder="请输入经办人姓名"></Input>
        </FormItem>
        <FormItem label="支付方式" prop="payment">
          <Select v-model="alterCustom.payment" placeholder="请选择支付方式">
            <Option value="支付宝">支付宝</Option>
            <Option value="微信">微信</Option>
            <Option value="POS">POS</Option>
            <Option value="现金">现金</Option>
          </Select>
        </FormItem>
        <FormItem label="司机等级" prop="position">
          <Select v-model="alterCustom.position">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="交款日期" prop="contributions">
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 250px" @on-change="paymentDate" v-model="alterCustom.contributions"></DatePicker>
        </FormItem>
        <FormItem label="紧急联系人" prop="emergency_contact">
          <Input type="text" v-model="alterCustom.emergency_contact" placeholder="请输入紧急联系人姓名"></Input>
        </FormItem>
        <FormItem label="联系电话" prop="talk_back">
          <Input type="text" v-model="alterCustom.talk_back" placeholder="请输入紧急联系人电话"></Input>
        </FormItem>
      </Form>
      <div class="month" v-if="eliminateNum === 5? true : false" style="margin: 0 125px;">
        <DatePicker type="month" placeholder="请选择时间" style="width: 250px" @on-change="derive"></DatePicker>
      </div>
    </Modal>
    <router-view class="router_user" v-if="sonRouter"></router-view>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import { mapState, mapMutations } from 'vuex'
import IdcardOne from './Upload/IdcardOne'
import IdcardWen from './Upload/IdcardWen'
import licenceOne from './Upload/licenceOne'
import licenceWen from './Upload/licenceWen'
export default {
  inject: ['reloadRouter'],
  created() {
    this.jurisdiction()
    this.userSum()
    this.alterNumberPages()
    this.pageUserInfo(this.currentPage)
  },
  mounted() {},
  updated() {

  },
  provide() {
    return {
      sonReloadRouter: this.sonReloadRouter,
      pageUser: this.pageUserInfo
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
      action: 'https://api2.bmob.cn/2/files/uploading',
      formCustom: {
        user: '',
        cell: '',
        identity_card: '',
        character: '',
        net_around: '',
        residence_permit: '',
        operator: '',
        payment: '',
        contributions: '',
        emergency_contact: '',
        talk_back: ''
      },
      ruleCustom: {
        user: [
          // eslint-disable-next-line
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        cell: [
          // eslint-disable-next-line
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          // eslint-disable-next-line
          { type: 'string', len: 11, message: '手机号为11位', trigger: 'blur' },
          // eslint-disable-next-line
          { validator: cellValidate, trigger: 'blur' }
        ],
        identity_card: [
          // eslint-disable-next-line
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          // eslint-disable-next-line
          { type: 'string', len: 18, message: '身份证号为18位', trigger: 'blur' }
        ],
        character: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        net_around: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        residence_permit: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        operator: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        payment: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        contributions: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        emergency_contact: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        talk_back: [
          // eslint-disable-next-line
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          // eslint-disable-next-line
          { type: 'string', len: 11, message: '手机号为11位', trigger: 'blur' },
          // eslint-disable-next-line
          { validator: cellValidate, trigger: 'blur' }
        ]
      },
      alterCustom: {
        user: '',
        identity_card: '',
        cell: '',
        character: '',
        position: '',
        net_around: '',
        residence_permit: '',
        operator: '',
        payment: '',
        contributions: '',
        emergency_contact: '',
        talk_back: ''
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
        identity_card: [
          // eslint-disable-next-line
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          // eslint-disable-next-line
          { type: 'string', len: 18, message: '身份证号为18位', trigger: 'blur' }
        ],
        character: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        net_around: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        residence_permit: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        operator: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        payment: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        contributions: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        emergency_contact: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        talk_back: [
          // eslint-disable-next-line
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          // eslint-disable-next-line
          { type: 'string', len: 11, message: '手机号为11位', trigger: 'blur' },
          // eslint-disable-next-line
          { validator: cellValidate, trigger: 'blur' }
        ],
        position: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
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
      characterNet_around: [{
          value: 'Y',
          label: '是'
        },
        {
          value: 'N',
          label: '否'
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
          key: 'realName',
          render: (h, params) => {
            if (params.row.withdrawDate !== undefined) {
              if (Number(params.row.withdrawDate.split('-')[2]) < new Date().getDate() + 5) {
                return h('span', {
                  'style': {
                    'color': '#ED5A36',
                    'font-size': '18px'
                  }
                }, params.row.realName)
              } else {
                return h('span', {}, params.row.realName)
              }
            } else {
              return h('span', {}, params.row.realName)
            }
          }
        },
        {
          title: '身份证',
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
          title: '网约车证',
          key: 'Net_around'
        },
        {
          title: '居住证',
          key: 'residence_permit'
        },
        {
          title: '经办人',
          key: 'operator'
        },
        {
          title: '支付方式',
          key: 'mode_of_payment'
        },
        {
          title: '交款日期',
          key: 'contributions'
        },
        {
          title: '紧急联络人',
          key: 'emergency_contact'
        },
        {
          title: '联络电话',
          key: 'talk_back'
        },
        {
          title: '提车时间',
          key: 'activeDate'
        },
        {
          title: '退车时间',
          key: 'withdrawDate'
        },
        {
          title: '详情',
          key: 'action',
          fixed: 'right',
          width: 165,
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
                  click: this.threatened
                }
              }, '出险历史'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: this.particular
                }
              }, '证件查看'),
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
      modal_up: false,
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
      trim: 0,
      time: 0,
      luiShuiMonrhArr: [], // 所选月份的流水
      dateArr: [], // 所选的月份的时间
      sumRunningInfo: [], // 总流水表
      runningWaterInfo: [], // 月份的流水表
      Eheader: ['日期', '流水', '平均收入', '消费', '备注'], // Excel表头
      Eval: ['date', 'liushui', 'mean', 'xiaofei', 'beizhu'], // Excel表所对应的Key
      userEheader: ['姓名', '手机号', '身份证', '是否有居住证', '是否有网约证', '性质', '是否分期', '分期金额', '是否可以每日提现', '经办人', '支付方式', '交款时间', '紧急联络人', '紧急联络人电话'],
      level: 0
    }
  },
  computed: {
    ...mapState(['mass', 'idcarOne', 'idcarWen', 'licenceOne', 'licenceWen'])
  },
  methods: {
    ...mapMutations(['GAINMASS', 'GAINTALLWEN']),
    // 判断权限
    jurisdiction() {
      // eslint-disable-next-line
      let query = Bmob.Query('administrator')
      query.equalTo('admin_name', '==', this.mass.user)
      query.find().then(res => {
        this.level = res[0].level
      })
    },
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
              if (res[i].Net_around === 'Y') {
                res[i].Net_around = '是'
              } else if (res[i].Net_around === 'N') {
                res[i].Net_around = '否'
              }
              if (res[i].active_date !== undefined) {
                res[i].activeDate = res[i].active_date.iso.split(' ')[0]
              }
              if (res[i].withdraw_date !== undefined) {
                res[i].withdrawDate = res[i].withdraw_date.iso.split(' ')[0]
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
                if (res[i].Net_around === 'Y') {
                  res[i].Net_around = '是'
                } else if (res[i].Net_around === 'N') {
                  res[i].Net_around = '否'
                }
                if (res[i].active_date !== undefined) {
                  res[i].activeDate = res[i].active_date.iso.split(' ')[0]
                }
                if (res[i].withdraw_date !== undefined) {
                  res[i].withdrawDate = res[i].withdraw_date.iso.split(' ')[0]
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
      this.optDack = true
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
      this.optDack = true
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
      this.optDack = true
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
      this.optDack = true
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
          query.limit(30)
        } else if (v > 1) {
          let num = (v - 1) * 30
          query.skip(num)
          query.limit(30)
        }
        query.statTo('order', 'withdraw_date.iso')
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
            if (res[i].Net_around === 'Y') {
              res[i].Net_around = '是'
            } else if (res[i].Net_around === 'N') {
              res[i].Net_around = '否'
            }
            if (res[i].active_date !== undefined) {
              res[i].activeDate = res[i].active_date.iso.split(' ')[0]
            }
            if (res[i].withdraw_date !== undefined) {
              res[i].withdrawDate = res[i].withdraw_date.iso.split(' ')[0]
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
          query.limit(30)
        } else if (v > 1) {
          let num = (v - 1) * 30
          query.skip(num)
          query.limit(30)
        }
        query.statTo('order', 'withdraw_date.iso')
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
            if (res[i].Net_around === 'Y') {
              res[i].Net_around = '是'
            } else if (res[i].Net_around === 'N') {
              res[i].Net_around = '否'
            }
            if (res[i].active_date !== undefined) {
              res[i].activeDate = res[i].active_date.iso.split(' ')[0]
            }
            if (res[i].withdraw_date !== undefined) {
              res[i].withdrawDate = res[i].withdraw_date.iso.split(' ')[0]
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
          query.limit(30)
        } else if (v > 1) {
          let num = (v - 1) * 30
          query.skip(num)
          query.limit(30)
        }
        query.statTo('order', '-withdraw_date.iso')
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
            if (res[i].Net_around === 'Y') {
              res[i].Net_around = '是'
            } else if (res[i].Net_around === 'N') {
              res[i].Net_around = '否'
            }
            if (res[i].active_date !== undefined) {
              res[i].activeDate = res[i].active_date.iso.split(' ')[0]
            }
            if (res[i].withdraw_date !== undefined) {
              res[i].withdrawDate = res[i].withdraw_date.iso.split(' ')[0]
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
          query.limit(30)
        } else if (v > 1) {
          let num = (v - 1) * 30
          query.skip(num)
          query.limit(30)
        }
        query.statTo('order', '-withdraw_date.iso')
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
            if (res[i].Net_around === 'Y') {
              res[i].Net_around = '是'
            } else if (res[i].Net_around === 'N') {
              res[i].Net_around = '否'
            }
            if (res[i].active_date !== undefined) {
              res[i].activeDate = res[i].active_date.iso.split(' ')[0]
            }
            if (res[i].withdraw_date !== undefined) {
              res[i].withdrawDate = res[i].withdraw_date.iso.split(' ')[0]
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
          query.limit(30)
        } else if (v > 1) {
          let num = (v - 1) * 30
          query.skip(num)
          query.limit(30)
        }
        query.statTo('order', '-withdraw_date.iso')
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
            if (res[i].Net_around === 'Y') {
              res[i].Net_around = '是'
            } else if (res[i].Net_around === 'N') {
              res[i].Net_around = '否'
            }
            if (res[i].active_date !== undefined) {
              res[i].activeDate = res[i].active_date.iso.split(' ')[0]
            }
            if (res[i].withdraw_date !== undefined) {
              res[i].withdrawDate = res[i].withdraw_date.iso.split(' ')[0]
            }
          }
          this.pageShow = true
          this.userdata = res
          this.loading = false
        })
        sessionStorage.setItem('hirePage', JSON.stringify(v))
        // 退车
      } else if (this.optFor === 5) {
        this.loading = true
        // eslint-disable-next-line
        let query = Bmob.Query('_User')
        query.statTo('where', { 'character': 'withdraw' })
        if (v === 1) {
          query.limit(30)
        } else if (v > 1) {
          let num = (v - 1) * 30
          query.skip(num)
          query.limit(30)
        }
        query.statTo('order', '-withdraw_date.iso')
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
            if (res[i].Net_around === 'Y') {
              res[i].Net_around = '是'
            } else if (res[i].Net_around === 'N') {
              res[i].Net_around = '否'
            }
            if (res[i].active_date !== undefined) {
              res[i].activeDate = res[i].active_date.iso.split(' ')[0]
            }
            if (res[i].withdraw_date !== undefined) {
              res[i].withdrawDate = res[i].withdraw_date.iso.split(' ')[0]
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
      sessionStorage.setItem('rowInfo', JSON.stringify(data))
      sessionStorage.removeItem('arrNum')
      if (this.trim === 1) {
        this.alterCustom.identity_card = data.identity_card
        this.alterCustom.user = data.realName
        this.alterCustom.cell = data.phone
        if (data.position === '等级1') {
          this.alterCustom.position = 'lever1'
        } else {
          this.alterCustom.position = 'lever2'
        }
        if (data.character === '直营') {
          this.alterCustom.character = 'direct'
        } else if (data.character === '租车') {
          this.alterCustom.character = 'rent'
        } else if (data.character === '以租代购') {
          this.alterCustom.character = 'leasing'
        } else if (data.character === '退车') {
          this.alterCustom.character = 'withdraw'
        }
        if (data.Net_around === '是') {
          this.alterCustom.net_around = 'Y'
        } else {
          this.alterCustom.net_around = 'N'
        }
        this.alterCustom.residence_permit = data.residence_permit
        this.alterCustom.operator = data.operator
        this.alterCustom.payment = data.mode_of_payment
        this.alterCustom.contributions = data.contributions
        this.alterCustom.emergency_contact = data.emergency_contact
        this.alterCustom.talk_back = data.talk_back
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
    // 下载模板
    usertemplate() {
      this.handleDownload([], this.userEheader, [], '模板')
    },
    // 导入数据
    catData(file) {
      let _this = this
      var rABS = false // 是否将文件读取为二进制字符串
      var f = file
      var reader = new FileReader()
      // if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = ''
        var rABS = false // 是否将文件读取为二进制字符串
        var pt = this
        var wb // 读取完成的数据
        var outdata
        var reader = new FileReader()
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          var XLSX = require('xlsx')
          if (rABS) {
            // eslint-disable-next-line
            wb = XLSX.read(btoa(fixdata(binary)), { // 手动转化
              type: 'base64'
            })
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            })
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) // outdata就是你想要的东西
          this.da = [...outdata]
          this.da.map(v => {
            // eslint-disable-next-line
            let query = Bmob.Query('_User')
            query.equalTo('phone', '==', String(v['手机号']))
            query.find().then(res => {
              // console.log(res)
              if (res.length === 0) {
                if (v['姓名'] !== undefined) {
                  query.set('realName', String(v['姓名']))
                }
                if (v['手机号'] !== undefined) {
                  query.set('phone', String(v['手机号']))
                  query.set('username', String(v['手机号']))
                }
                if (v['性质'] !== undefined) {
                  if (v['性质'] === '直营') {
                    query.set('character', 'direct')
                  } else if (v['性质'] === '租车') {
                    query.set('character', 'rent')
                  } else if (v['性质'] === '以租代购') {
                    query.set('character', 'leasing')
                  } else if (v['性质'] === '退车') {
                    query.set('character', 'withdraw')
                  }
                }
                if (v['身份证'] !== undefined) {
                  query.set('identity_card', String(v['身份证']))
                }
                if (v['是否有居住证'] !== undefined) {
                  query.set('residence_permit', String(v['是否有居住证']))
                }
                if (v['是否有网约证'] !== undefined) {
                  if (v['是否有网约证'] === '是') {
                    query.set('Net_around', 'Y')
                  } else if (v['是否有网约证'] === '否') {
                    query.set('Net_around', 'N')
                  }
                }
                if (v['是否分期'] !== undefined) {
                  if (v['是否分期'] === '是') {
                    query.set('has_deposit_loan', 'Y')
                  } else if (v['是否分期'] === '否') {
                    query.set('has_deposit_loan', 'N')
                  }
                }
                if (v['分期金额'] !== undefined) {
                  query.set('deposit_amount', String(v['分期金额']))
                }
                if (v['是否可以每日提现'] !== undefined) {
                  if (v['是否可以每日提现'] === '是') {
                    query.set('can_cashout_onMon', 'Y')
                  } else if (v['是否可以每日提现'] === '否') {
                    query.set('can_cashout_onMon', 'N')
                  }
                }
                if (v['经办人'] !== undefined) {
                  query.set('operator', String(v['经办人']))
                }
                if (v['支付方式'] !== undefined) {
                  query.set('mode_of_payment', String(v['支付方式']))
                }
                if (v['交款时间'] !== undefined) {
                  query.set('contributions', _this.formatDateRent(v['交款时间']))
                }
                if (v['紧急联络人'] !== undefined) {
                  query.set('emergency_contact', String(v['紧急联络人']))
                }
                if (v['紧急联络人电话'] !== undefined) {
                  query.set('talk_back', String(v['紧急联络人电话']))
                }
                query.set('password', '123456')
                query.set('position', 'lever2')
                query.set('status', 'user')
                query.save()
              }
            })
          })
          _this.$message({
            message: '请耐心等待导入成功',
            type: 'success'
          })
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    // 时间的转换
    formatDate(numb) {
      let time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      let year = time.getFullYear() + ''
      let month = time.getMonth() + 1
      let date = time.getDate()
      if (month < 10) {
        month = `0${month}`
      } else {
        month = time.getMonth() + 1 + ''
      }
      if (date < 10) {
        date = `0${date}`
      } else {
        date = time.getDate() + ''
      }
      return {
        '__type': 'Date',
        'iso': `${year}-${month}-${date} 00:00:00`
      }
    },
    // 退车时间的转换
    formatQuitDate(numb, join) {
      let time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      let year = time.getFullYear()
      let month = time.getMonth() + 1 + Number(join)
      let date = time.getDate()
      if (month > 12) {
        year = year + 1 + ' '
        month = month - 12
      } else {
        year = year + ''
      }
      if (month < 10) {
        month = `0${month}`
      } else {
        month = time.getMonth() + 1 + ''
      }
      if (date < 10) {
        date = `0${date}`
      } else {
        date = time.getDate() + ''
      }
      return {
        '__type': 'Date',
        'iso': `${year}-${month}-${date} 00:00:00`
      }
    },
    // 时间的转换
    formatDateRent(numb) {
      let time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      let year = time.getFullYear() + ''
      let month = time.getMonth() + 1
      let date = time.getDate()
      if (month < 10) {
        month = `0${month}`
      } else {
        month = time.getMonth() + 1 + ''
      }
      if (date < 10) {
        date = `0${date}`
      } else {
        date = time.getDate() + ''
      }
      return `${year}-${month}-${date}`
    },
    // 新增
    add() {
      this.modal = true
      this.remText = '新增客户'
      this.eliminateNum = 1
      this.trim = 2
    },
    // 上传
    upload() {
      this.modal_up = true
    },
    // 交款时间
    paymentDate(v) {
      this.formCustom.contributions = v
    },
    // 导出的时间选择
    running() {
      this.eliminateNum = 5
      this.modal = true
      this.remText = '选择月份'
      this.trim = 0
      this.runningWaterInfo = []
    },
    // 导出相应时间
    derive(v) {
      this.getPreMonthDate(v)
      this.getMonthLuishui(v.split('-')[1])
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
        this.handleSubmit('formCustom')
      } else if (this.eliminateNum === 4 && this.trim === 1) {
        this.alterSubmit('alterCustom')
      } else if (this.eliminateNum === 5 && this.trim === 0) {
        // console.log(this.runningWaterInfo)
        // console.log(this.nameLiushui)
        // console.log(this.sumRunningInfo)
        let M = []
        this.sumRunningInfo = []
        for (let i = 1, max = this.runningWaterInfo.length; i < max; i++) {
          if (this.runningWaterInfo[i].name === this.runningWaterInfo[i - 1].name) {
            M.push(this.runningWaterInfo[i - 1])
          } else {
            this.sumRunningInfo.push(M)
            M = []
          }
          // console.log(this.sumRunningInfo)
        }
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
          query.set('identity_card', this.formCustom.identity_card)
          query.set('idcarOne', this.idcarOne)
          query.set('idcarWen', this.idcarWen)
          query.set('licenceOne', this.licenceOne)
          query.set('licenceWen', this.licenceWen)
          query.set('password', '123456')
          query.set('position', 'lever2')
          query.set('status', 'user')
          query.set('Net_around', this.formCustom.net_around)
          query.set('residence_permit', this.formCustom.residence_permit)
          query.set('operator', this.formCustom.operator)
          query.set('mode_of_payment', this.formCustom.payment)
          query.set('contributions', this.formCustom.contributions)
          query.set('emergency_contact', this.formCustom.emergency_contact)
          query.set('talk_back', this.formCustom.talk_back)
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
          query.set('identity_card', this.alterCustom.identity_card)
          query.set('phone', this.alterCustom.cell)
          query.set('username', this.alterCustom.cell)
          query.set('position', this.alterCustom.position)
          query.set('character', this.alterCustom.character)
          query.set('Net_around', this.alterCustom.net_around)
          query.set('residence_permit', this.alterCustom.residence_permit)
          query.set('operator', this.alterCustom.operator)
          query.set('mode_of_payment', this.alterCustom.payment)
          query.set('contributions', this.alterCustom.contributions)
          query.set('emergency_contact', this.alterCustom.emergency_contact)
          query.set('talk_back', this.alterCustom.talk_back)
          // eslint-disable-next-line
          query.save().then(res => {
            this.$Modal.warning({
              title: '修改成功',
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
              title: '修改失败'
            })
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    // // 导出数据为Excel
    // outputXlsxFile(data, wscols, xlsxName) {
    //   var sheetNames = []
    //   var sheetsList = {}
    //   for (var key in data) {
    //     sheetNames.push(key)
    //     var temp = transferDataExcel(data[key])
    //     sheetsList[key] = XLSX.utils.aoa_to_sheet(temp)
    //     sheetsList[key]['!cols'] = wscols
    //   }
    //   const wb = XLSX.utils.book_new()
    //   wb['SheetNames'] = sheetNames
    //   wb['Sheets'] = sheetsList
    //   XLSX.writeFile(wb, xlsxName + '.xlsx')
    //   // 处理数据的函数
    //   function transferDataExcel(data) {
    //     var total = []
    //     var temp = ['功能', '功能描述', '取值']
    //     total.push(temp)
    //     data.forEach(function(item, index) {
    //       var arr = []
    //       arr.push(item.function_name)
    //       arr.push(item.description)
    //       arr.push(item.value)
    //       total.push(arr)
    //     })
    //   }
    // },
    // 车辆信息
    carinfo() {
      this.GAINTALLWEN(0)
      sessionStorage.setItem('key', JSON.stringify(0))
      this.$router.push({ path: '/userinfo/carinfo' })
      this.eliminateNum = 0
    },
    // 流水信息
    moneyinfo() {
      this.eliminateNum = 0
      this.GAINTALLWEN(1)
      sessionStorage.setItem('key', JSON.stringify(1))
      this.$router.push({ path: '/userinfo/moneyinfo' })
    },
    // 出险历史
    threatened() {
      this.eliminateNum = 0
      this.GAINTALLWEN(2)
      sessionStorage.setItem('key', JSON.stringify(2))
      this.$router.push({ path: '/userinfo/threatened' })
    },
    particular() {
      this.eliminateNum = 0
      this.GAINTALLWEN(3)
      sessionStorage.setItem('key', JSON.stringify(3))
      this.$router.push({ path: '/userinfo/particular' })
    },
    // 导出数据为Excel
    async handleDownload(tableData, heaDer, Val, Ename) {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('@/vendor/Export2Excel')
        const list = tableData
        const data = this.formatJson(Val, list)
        export_json_to_excel(heaDer, data, Ename)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  components: {
    IdcardOne,
    IdcardWen,
    licenceOne,
    licenceWen
  }
}

</script>
<style rel="stylesheet/scss" lang="scss">
.userInfo {
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

    .butRun {
      position: absolute;
      top: 0;
      left: 390px;
      z-index: 100;
    }

    .temBut {
      position: absolute;
      top: 0;
      left: 390px;
      z-index: 100;
      display: inline-block;
    }

    .ivu-upload {
      position: absolute;
      top: 0;
      left: 240px;
      z-index: 100;
      display: inline-block;
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
