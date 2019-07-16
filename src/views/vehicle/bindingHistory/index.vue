<template>
  <div class="binding">
    <div class="new">现绑客户</div>
    <Button type="primary" shape="circle" class="but" @click="bound" v-if="butShow">车辆新绑</Button>
    <Table border :columns="hisColumns" :data="carHistoryInfo" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="worn">历史绑定客户</div>
    <Table border :columns="wornColumns" :data="wornHistoryInfo" :loading="loading"></Table>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
    <Modal v-model="modal" :title="modalTxt" @on-ok="ok">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" v-if="reveal === 1 ? true : false">
        <FormItem label="合同期" prop="vehicle_type">
          <Input type="text" v-model="formCustom.contract_duration" placeholder="请输入月个数"></Input>
        </FormItem>
        <FormItem label="提车日期" prop="plate">
          <DatePicker type="datetime" placeholder="请选择日期" style="width: 200px" @on-change="gainCarryDate" v-model="formCustom.activeDate" :editable="editable" clearable></DatePicker>
        </FormItem>
        <FormItem label="类型" prop="character">
          <Select v-model="formCustom.character">
            <Option v-for="item in characterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Form ref="formCustomCat" :model="formCustomCat" :rules="ruleCustomCat" :label-width="80" v-if="reveal === 2 ? true : false">
        <FormItem label="客户名" prop="realName">
          <Select v-model="formCustomCat.realNamemodel" style="width:200px" filterable>
            <Option v-for="item in cityList" :value="item.realName" :key="item.value">{{ item.realName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="合同期" prop="vehicle_type">
          <Input type="text" v-model="formCustomCat.contract_duration" placeholder="请输入月个数"></Input>
        </FormItem>
        <FormItem label="提车日期" prop="plate">
          <DatePicker type="datetime" placeholder="请选择日期" style="width: 200px" @on-change="addGainCarryDate" v-model="formCustomCat.activeDate" :editable="editable" clearable></DatePicker>
        </FormItem>
        <FormItem label="类型" prop="character">
          <Select v-model="formCustomCat.character">
            <Option v-for="item in characterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input type="text" v-model="formCustomCat.remark" placeholder="请原因"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  inject: ['pageUser', 'userSum'],
  created() {
    this.histoeyInfo()
    this.plateInfo()
    this.pageUserInfo(this.currentPage)
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      hisColumns: [{
        title: '姓名',
        key: 'realName'
      }, {
        title: '电话号码',
        key: 'phone'
      }, {
        title: '司机等级',
        key: 'position'
      }, {
        title: '类型',
        key: 'character'
      }, {
        title: '提车日期',
        key: 'activeDate'
      }, {
        title: '合同期',
        key: 'contract_duration'
      }, {
        title: '退车日期',
        key: 'withdrawDate'
      }, {
        title: '换绑时间',
        key: 'updatedAt'
      }, {
        title: '详情',
        key: 'action',
        fixed: 'right',
        width: 145,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: this.alter
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: this.bound
              }
            }, '车辆换绑')
          ])
        }
      }],
      wornColumns: [{
          title: '姓名',
          key: 'realName'
        }, {
          title: '电话号码',
          key: 'phone'
        }, {
          title: '司机等级',
          key: 'position'
        }, {
          title: '类型',
          key: 'character'
        }, {
          title: '提车日期',
          key: 'activeDate'
        }, {
          title: '合同期',
          key: 'contract_duration'
        }, {
          title: '退车日期',
          key: 'withdrawDate'
        }, {
          title: '换绑时间',
          key: 'updatedAt'
        }, {
          title: '闲置时间',
          key: 'sky'
        },
        {
          title: '闲置成本',
          key: 'skyF'
        },
        {
          title: '备注',
          key: 'remarks'
        }
      ],
      carHistoryInfo: [],
      wornHistoryInfo: [],
      formCustom: {
        activeDate: '',
        contract_duration: '',
        character: ''
      },
      withdraw_date: '',
      ruleCustom: {
        activeDate: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        contract_duration: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        character: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
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
      active: '',
      withdraw: '',
      loading: false,
      modal: false,
      modalTxt: '',
      editable: false,
      reveal: 0,
      formCustomCat: {
        realNamemodel: '',
        activeDate: '',
        contract_duration: '',
        character: '',
        remark: ''
      },
      ruleCustomCat: {
        realName: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        activeDate: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        contract_duration: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        character: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        remark: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      cityList: [],
      butShow: true,
      pageShow: false,
      currentPage: 1
    }
  },
  computed: {

  },
  methods: {
    inRowInfo(data) {
      sessionStorage.setItem('History', JSON.stringify(data))
      this.formCustom.activeDate = data.activeDate
      this.formCustom.contract_duration = data.contract_duration
      if (data.character === '直营') {
        this.formCustom.character = 'direct'
      } else if (data.character === '租车') {
        this.formCustom.character = 'rent'
      } else if (data.character === '以租代购') {
        this.formCustom.character = 'leasing'
      } else if (data.character === '退车') {
        this.formCustom.character = 'withdraw'
      }
    },
    histoeyInfo() {
      this.carHistoryInfo = []
      this.loading = true
      this.butShow = false
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.field('bind_user', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
      query.statTo('order', 'active_date')
      query.relation('_User').then(res => {
        if (res.results.length !== 0) {
          if (res.results[0].position.slice(5, 6) === '1') {
            res.results[0].position = '等级1'
          } else if (res.results[0].position.slice(5, 6) === '2') {
            res.results[0].position = '等级2'
          }
          if (res.results[0].character === 'direct') {
            res.results[0].character = '直营'
          } else if (res.results[0].character === 'rent') {
            res.results[0].character = '租车'
          } else if (res.results[0].character === 'leasing') {
            res.results[0].character = '以租代购'
          } else if (res.results[0].character === 'withdraw') {
            res.results[0].character = '退车'
          }
          if (res.results[0].active_date !== undefined) {
            res.results[0].activeDate = res.results[0].active_date.iso
          }
          if (res.results[0].withdraw_date !== undefined) {
            res.results[0].withdrawDate = res.results[0].withdraw_date.iso
          }
          this.carHistoryInfo = res.results
          this.loading = false
          this.butShow = false
        } else {
          this.butShow = true
          this.loading = false
        }
      })
    },
    // 数据总数
    dataSum() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.equalTo('plate', '==', JSON.parse(sessionStorage.getItem('rowInfo')).plate)
      query.count().then(res => {
        if (res > 10) {
          this.pageShow = true
        }
        this.sun = res
      })
    },
    pageUserInfo(v) {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.field('history_bind_user', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
      if (v === 1) {
        query.limit(10)
      } else if (v > 1) {
        let num = (v - 1) * 10
        query.skip(num)
        query.limit(10)
      }
      query.statTo('order', '-active_date.iso')
      query.relation('history_bind_user').then(res => {
        let sky = 0
        for (let i = 0, max = res.results.length; i < max; i++) {
          if (res.results[i].position.slice(5, 6) === '1') {
            res.results[i].position = '等级1'
          } else if (res.results[i].position.slice(5, 6) === '2') {
            res.results[i].position = '等级2'
          }
          if (res.results[i].character === 'direct') {
            res.results[i].character = '直营'
          } else if (res.results[i].character === 'rent') {
            res.results[i].character = '租车'
          } else if (res.results[i].character === 'leasing') {
            res.results[i].character = '以租代购'
          } else if (res.results[i].character === 'withdraw') {
            res.results[i].character = '退车'
          }
          if (res.results[i].withdraw_date !== undefined) {
            res.results[i].withdrawDate = res.results[i].withdraw_date.iso
          }
          if (res.results[i].active_date !== undefined) {
            res.results[i].activeDate = res.results[i].active_date.iso
          }
        }
        let rent_fee = JSON.parse(sessionStorage.getItem('rowInfo')).rent_fee
        for (let j = res.results.length - 1; j >= 0; j--) {
          if (res.results[j].active_date !== undefined && res.results[j].withdraw_date !== undefined) {
            let carry = 0
            let quit = 0
            let same = 0
            if (res.results.length - 1 > 0) {
              if (j !== 0) {
                if (res.results[j].active_date === undefined) {
                  carry = 0
                } else {
                  carry = new Date(res.results[j].active_date.iso.split(' ')[0]).getTime()
                }
                if (res.results[j - 1].withdraw_date === undefined) {
                  quit = 0
                } else {
                  quit = new Date(res.results[j - 1].withdraw_date.iso.split(' ')[0]).getTime()
                }
                res.results[j].sky = Math.floor((carry - quit) / 86400000)
                res.results[j].skyF = ((Math.floor((carry - quit) / 86400000) * rent_fee) / 30).toFixed(2)
              } else {
                res.results[j].sky = 0
                res.results[j].skyF = 0
              }
            } else {
              res.results[j].sky = 0
              res.results[j].skyF = 0
            }
          }
        }
        this.wornHistoryInfo = res.results
        this.loading = false
      })
      sessionStorage.setItem('currentPage', JSON.stringify(v))
    },
    // 改变页数
    alterNumberPages() {
      if (JSON.parse(sessionStorage.getItem('currentPage')) !== null) {
        this.currentPage = JSON.parse(sessionStorage.getItem('currentPage'))
      }
    },
    // 选择时间触发
    gainCarryDate(v) {
      this.formCustom.activeDate = v
      let M = Number(v.split('-')[1]) + Number(this.formCustom.contract_duration)
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
    // 选择时间触发
    addGainCarryDate(v) {
      this.formCustomCat.activeDate = v
      let M = Number(v.split('-')[1]) + Number(this.formCustomCat.contract_duration)
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
    // 修改
    alter() {
      this.modal = true
      this.reveal = 1
      this.modalTxt = '输入'
    },
    // 换绑
    bound() {
      this.modal = true
      this.reveal = 2
      this.modalTxt = '选择客户'
    },
    ok() {
      if (this.reveal === 1) {
        this.handleSubmit('formCustom')
      } else if (this.reveal === 2) {
        this.inTie()
      }
    },
    // 日期输入
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          if (this.formCustom.character !== JSON.parse(sessionStorage.getItem('History')).character) {
            // 把现在用户所绑定的车辆复制带history_bind_user数据库中
            // eslint-disable-next-line
            let history_relate_user_query = Bmob.Query('history_bind_user')
            for (let k in JSON.parse(sessionStorage.getItem('History'))) {
              if (k === 'realName' || k === 'phone' || k === 'position' || k === 'character' || k === 'active_date' || k === 'contract_duration' || k === 'withdraw_date') {
                history_relate_user_query.set(k, JSON.parse(sessionStorage.getItem('History'))[k])
              }
            }
            history_relate_user_query.set('remarks', this.formCustomCat.remark)
            history_relate_user_query.save().then(resh => {
              // 把history_bind_user绑至现车辆
              // eslint-disable-next-line
              let add_relation_bind = Bmob.Relation('history_bind_user')
              let add_relID_bind = add_relation_bind.add(resh.objectId)
              // eslint-disable-next-line
              let car_query_bind = Bmob.Query('car')
              car_query_bind.get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
                res.set('history_bind_user', add_relID_bind)
                res.save()
                this.pageUserInfo(this.currentPage)
              })
            })
          }
          // eslint-disable-next-line
          let query = Bmob.Query('_User')
          query.set('id', JSON.parse(sessionStorage.getItem('History')).objectId)
          query.set('contract_duration', this.formCustom.contract_duration)
          query.set('active_date', {
            '__type': 'Date',
            'iso': this.formCustom.activeDate
          })
          query.set('withdraw_date', {
            '__type': 'Date',
            'iso': this.withdraw_date
          })
          query.set('character', this.formCustom.character)
          if (this.formCustom.character === 'rent') {
            query.set('rent', JSON.parse(sessionStorage.getItem('rowInfo')).rent_fee)
            query.set('beginDate', this.formCustom.activeDate)
            query.set('alreadyRent', '0')
            query.set('overdue', '0')
          }
          // eslint-disable-next-line
          query.save().then(res => {
            this.$Modal.warning({
              title: '输入成功',
              onOk() {
                _this.reveal = 0
                _this.histoeyInfo()
              }
            }) // eslint-disable-next-line
          }).catch(err => {
            this.$Modal.warning({
              // eslint-disable-next-line
              title: '输入失败'
            })
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    // 客户名
    plateInfo() {
      this.cityList = []
      // eslint-disable-next-line
      let totalQuery = Bmob.Query('_User')
      totalQuery.count().then(res => {
        this.sunCar = res
        if (this.sunCar / 500 > 1) {
          for (let i = 0, max = Math.floor(this.sunCar / 500); i < max; i++) {
            totalQuery.skip(i * 500)
            totalQuery.statTo('limit', `500`)
            totalQuery.statTo('groupby', 'realName')
            totalQuery.find().then(res => {
              this.cityList.push(...res)
            })
          }
        } else {
          totalQuery.statTo('limit', `500`)
          totalQuery.statTo('groupby', 'realName')
          totalQuery.find().then(res => {
            this.cityList = res
          })
        }
      })
    },
    // 车辆换绑
    inTie() {
      this.butShow = false
      if (this.carHistoryInfo.length !== 0) {
        if (this.formCustomCat.realNamemodel !== this.carHistoryInfo[0].realName) {
          // 查询所显示的用户所绑的车辆信息
          // eslint-disable-next-line
          let query_car = Bmob.Query('_User')
          query_car.field('relate', this.carHistoryInfo[0].objectId)
          query_car.statTo('order', 'active_date')
          query_car.relation('car').then(res => {
            // 把现在用户所绑定的车辆复制带history_relate数据库中
            // eslint-disable-next-line
            let history_relate_query = Bmob.Query('history_relate')
            for (let k in res.results[0]) {
              if (k === 'realName' || k === 'phone' || k === 'position' || k === 'character' || k === 'active_date' || k === 'withdraw_date' || k === 'contract_duration') {
                history_relate_query.set(k, res.results[0][k])
              }
            }
            history_relate_query.save().then(res => {
              // 把history_relate绑至现用户
              // eslint-disable-next-line
              let add_relation_bind = Bmob.Relation('history_relate')
              let add_relID_bind = add_relation_bind.add(res.objectId)
              // eslint-disable-next-line
              let car_query_bind = Bmob.Query('_User')
              car_query_bind.get(this.carHistoryInfo[0].objectId).then(res => {
                res.set('history_relate', add_relID_bind)
                res.save()
              })
            })
            query_car.statTo('where', { 'realName': this.carHistoryInfo[0].realName })
            query_car.find().then(res => {
              // 把现在用户所绑定的车辆复制带history_bind_user数据库中
              // eslint-disable-next-line
              let history_relate_user_query = Bmob.Query('history_bind_user')
              for (let k in res[0]) {
                if (k === 'realName' || k === 'phone' || k === 'position' || k === 'character' || k === 'active_date' || k === 'contract_duration' || k === 'withdraw_date') {
                  history_relate_user_query.set(k, res[0][k])
                }
              }
              history_relate_user_query.set('remarks', this.formCustomCat.remark)
              history_relate_user_query.save().then(resh => {
                // 把history_bind_user绑至现车辆
                // eslint-disable-next-line
                let add_relation_bind = Bmob.Relation('history_bind_user')
                let add_relID_bind = add_relation_bind.add(resh.objectId)
                // eslint-disable-next-line
                let car_query_bind = Bmob.Query('car')
                car_query_bind.get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
                  res.set('history_bind_user', add_relID_bind)
                  res.save()
                })
              })
            })
          })
          // 删除原先用户所绑定的的车辆
          // eslint-disable-next-line
          let remove_relation1 = Bmob.Relation('car')
          // eslint-disable-next-line
          let remove_relID1 = remove_relation1.remove(JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
          // eslint-disable-next-line
          let user_query_remove = Bmob.Query('_User')
          user_query_remove.get(this.carHistoryInfo[0].objectId).then(res => {
            res.set('relate', remove_relID1)
            res.save()
          })
          // 删除原先车辆所绑定的的用户
          // eslint-disable-next-line
          let add_relation_remove2 = Bmob.Relation('_User')
          let add_relID_remove2 = add_relation_remove2.remove(this.carHistoryInfo[0].objectId)
          // eslint-disable-next-line
          let car_query_remove = Bmob.Query('car')
          car_query_remove.get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
            car_query_remove.set('id', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
            car_query_remove.set('status', '待出库')
            car_query_remove.save()
            res.set('bind_user', add_relID_remove2)
            res.save()
          })
          // 查询所选择的用户的信息
          // eslint-disable-next-line
          let history_query_user = Bmob.Query('_User')
          history_query_user.statTo('where', { 'realName': this.formCustomCat.realNamemodel })
          history_query_user.find().then(res => {
            history_query_user.set('id', res[0].objectId)
            history_query_user.set('contract_duration', this.formCustomCat.contract_duration)
            history_query_user.set('active_date', {
              '__type': 'Date',
              'iso': this.formCustomCat.activeDate
            })
            history_query_user.set('withdraw_date', {
              '__type': 'Date',
              'iso': this.withdraw_date
            })
            history_query_user.set('character', this.formCustomCat.character)
            if (this.formCustomCat.character === 'rent') {
              history_query_user.set('rent', JSON.parse(sessionStorage.getItem('rowInfo')).rent_fee)
              history_query_user.set('beginDate', this.formCustomCat.activeDate)
              history_query_user.set('alreadyRent', '0')
              history_query_user.set('overdue', '0')
            }
            // 所选的用户是否有绑车
            // eslint-disable-next-line
            let history_query_car = Bmob.Query('_User')
            history_query_car.field('relate', res[0].objectId)
            history_query_car.relation('car').then(resC => {
              // 没有绑车的
              if (resC.count === 0) {
                // 将现选择用户绑定至车牌（车辆换绑，重新添加relation关系，即car的bind_user字段）
                // eslint-disable-next-line
                let add_relation1 = Bmob.Relation('_User')
                let add_relID1 = add_relation1.add(res[0].objectId)
                // eslint-disable-next-line
                let car_query = Bmob.Query('car')
                car_query.get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
                  res.set('bind_user', add_relID1)
                  res.save()
                })
                // 将现车牌绑定至选择用户（添加relation关系，即_User的relate字段）
                // eslint-disable-next-line
                let add_relation2 = Bmob.Relation('car')
                let add_relID2 = add_relation2.add(JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
                // eslint-disable-next-line
                let user_query = Bmob.Query('_User')
                user_query.get(res[0].objectId).then(res => {
                  res.set('relate', add_relID2)
                  res.save().then(res => {
                    car_query.set('id', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
                    car_query.set('status', '在租')
                    car_query.save()
                    history_query_user.save()
                    this.histoeyInfo()
                    this.pageUser(1)
                    this.pageUserInfo(1)
                    this.reveal = 0
                    this.userSum()
                  })
                })
                // 有绑车的
              } else {
                // 把车辆所绑定的用户复制带history_bind_user数据库中
                // eslint-disable-next-line
                let history_relate_user_query1 = Bmob.Query('history_bind_user')
                for (let k in res[0]) {
                  if (k === 'realName' || k === 'phone' || k === 'position' || k === 'character' || k === 'active_date' || k === 'contract_duration' || k === 'withdraw_date') {
                    history_relate_user_query1.set(k, res[0][k])
                  }
                }
                history_relate_user_query1.set('remarks', this.formCustomCat.remark)
                history_relate_user_query1.save().then(resh => {
                  // 把history_bind_user绑至现选择用户
                  // eslint-disable-next-line
                  let add_relation_bind1 = Bmob.Relation('history_bind_user')
                  let add_relID_bind1 = add_relation_bind1.add(resh.objectId)
                  // eslint-disable-next-line
                  let car_query_bind1 = Bmob.Query('car')
                  car_query_bind1.get(resC.results[0].objectId).then(res => {
                    res.set('history_bind_user', add_relID_bind1)
                    res.save()
                  })
                })
                // 把现在选择用户所绑定的车辆复制带history_relate数据库中
                // eslint-disable-next-line
                let history_relate_query = Bmob.Query('history_relate')
                for (let k in resC.results[0]) {
                  if (k === 'realName' || k === 'phone' || k === 'position' || k === 'character' || k === 'active_date' || k === 'withdraw_date' || k === 'contract_duration') {
                    history_relate_query.set(k, resC.results[0][k])
                  }
                }
                history_relate_query.save().then(resh => {
                  // 把history_relate绑至现选择用户
                  // eslint-disable-next-line
                  let add_relation_bind1 = Bmob.Relation('history_relate')
                  let add_relID_bind1 = add_relation_bind1.add(resh.objectId)
                  // eslint-disable-next-line
                  let car_query_bind1 = Bmob.Query('_User')
                  car_query_bind1.get(res[0].objectId).then(res => {
                    res.set('history_relate', add_relID_bind1)
                    res.save()
                  })
                })
                // 删除选择用户所绑定的的车辆
                // eslint-disable-next-line
                let history_remove_relation1 = Bmob.Relation('car')
                // eslint-disable-next-line
                let history_remove_relID1 = history_remove_relation1.remove(resC.results[0].objectId)
                // eslint-disable-next-line
                let history_user_query_remove = Bmob.Query('_User')
                history_user_query_remove.get(res[0].objectId).then(res => {
                  res.set('relate', history_remove_relID1)
                  res.save()
                })
                // 删除车辆所绑定的选择用户
                // eslint-disable-next-line
                let history_add_relation_remove2 = Bmob.Relation('_User')
                let history_add_relID_remove2 = history_add_relation_remove2.remove(res[0].objectId)
                // eslint-disable-next-line
                let history_car_query_remove = Bmob.Query('car')
                history_car_query_remove.get(resC.results[0].objectId).then(res => {
                  history_car_query_remove.set('id', resC.results[0].objectId)
                  history_car_query_remove.set('status', '待出库')
                  history_car_query_remove.save()
                  res.set('bind_user', history_add_relID_remove2)
                  res.save()
                })
                // 将现选择用户绑定至车牌（车辆换绑，重新添加relation关系，即car的bind_user字段）
                // eslint-disable-next-line
                let add_relation1 = Bmob.Relation('_User')
                let add_relID1 = add_relation1.add(res[0].objectId)
                // eslint-disable-next-line
                let car_query = Bmob.Query('car')
                car_query.get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
                  res.set('bind_user', add_relID1)
                  res.save()
                })
                // 将现车牌绑定至选择用户（添加relation关系，即_User的relate字段）
                // eslint-disable-next-line
                let add_relation2 = Bmob.Relation('car')
                let add_relID2 = add_relation2.add(JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
                // eslint-disable-next-line
                let user_query = Bmob.Query('_User')
                user_query.get(res[0].objectId).then(res => {
                  res.set('relate', add_relID2)
                  res.save().then(res => {
                    history_car_query_remove.set('id', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
                    history_car_query_remove.set('status', '在租')
                    history_car_query_remove.save()
                    history_query_user.save()
                    this.histoeyInfo()
                    this.pageUser(1)
                    this.pageUserInfo(1)
                    this.reveal = 0
                    this.userSum()
                  })
                })
              }
            })
          })
        } else {
          this.$Modal.warning({
            title: '已绑定'
          })
        }
      } else {
        // 获得选择用户的信息
        // eslint-disable-next-line
        let user_query = Bmob.Query('_User')
        user_query.statTo('where', { 'realName': this.formCustomCat.realNamemodel })
        user_query.find().then(res => {
          user_query.set('id', res[0].objectId)
          user_query.set('contract_duration', this.formCustomCat.contract_duration)
          user_query.set('active_date', {
            '__type': 'Date',
            'iso': this.formCustomCat.activeDate
          })
          user_query.set('withdraw_date', {
            '__type': 'Date',
            'iso': this.withdraw_date
          })
          user_query.set('character', this.formCustomCat.character)
          if (this.formCustomCat.character === 'rent') {
            user_query.set('rent', JSON.parse(sessionStorage.getItem('rowInfo')).rent_fee)
            user_query.set('beginDate', this.formCustomCat.activeDate)
            user_query.set('alreadyRent', '0')
            user_query.set('overdue', '0')
          }
          // 所选的用户是否有绑车
          // eslint-disable-next-line
          let query_car = Bmob.Query('_User')
          query_car.field('relate', res[0].objectId)
          query_car.statTo('order', 'active_date')
          query_car.relation('car').then(resC => {
            // 没有绑车的
            if (resC.count === 0) {
              // 将现选择用户绑定至车牌（车辆换绑，重新添加relation关系，即car的bind_user字段）
              // eslint-disable-next-line
              let add_relation1 = Bmob.Relation('_User')
              let add_relID1 = add_relation1.add(res[0].objectId)
              // eslint-disable-next-line
              let car_query = Bmob.Query('car')
              car_query.get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
                res.set('bind_user', add_relID1)
                res.save()
              })
              // 将现车牌绑定至选择用户（添加relation关系，即_User的relate字段）
              // eslint-disable-next-line
              let add_relation2 = Bmob.Relation('car')
              let add_relID2 = add_relation2.add(JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
              user_query.get(res[0].objectId).then(res => {
                res.set('relate', add_relID2)
                res.save().then(res => {
                  car_query.set('id', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
                  car_query.set('status', '在租')
                  car_query.save()
                  user_query.save()
                  this.histoeyInfo()
                  this.pageUser(1)
                  this.pageUserInfo(1)
                  this.reveal = 0
                  this.userSum()
                })
              })
              // 有绑车的
            } else {
              // 把车辆所绑定的选择用户复制带history_bind_user数据库中
              // eslint-disable-next-line
              let history_relate_user_query = Bmob.Query('history_bind_user')
              for (let k in res[0]) {
                if (k === 'realName' || k === 'phone' || k === 'position' || k === 'character' || k === 'active_date' || k === 'contract_duration' || k === 'withdraw_date') {
                  history_relate_user_query.set(k, res[0][k])
                }
              }
              history_relate_user_query.set('remarks', this.formCustomCat.remark)
              history_relate_user_query.save().then(resh => {
                // 把history_bind_user绑至现选择用户
                // eslint-disable-next-line
                let add_relation_bind1 = Bmob.Relation('history_bind_user')
                let add_relID_bind1 = add_relation_bind1.add(resh.objectId)
                // eslint-disable-next-line
                let car_query_bind1 = Bmob.Query('car')
                car_query_bind1.get(resC.results[0].objectId).then(res => {
                  res.set('history_bind_user', add_relID_bind1)
                  res.save()
                })
              })
              // 把选择用户所绑定的车辆复制带history_relate数据库中
              // eslint-disable-next-line
              let history_relate_query = Bmob.Query('history_relate')
              for (let k in resC.results[0]) {
                if (k === 'realName' || k === 'phone' || k === 'position' || k === 'character' || k === 'active_date' || k === 'withdraw_date' || k === 'contract_duration') {
                  history_relate_query.set(k, resC.results[0][k])
                }
              }
              history_relate_query.save().then(resh => {
                // 把history_relate绑至现选择用户
                // eslint-disable-next-line
                let add_relation_bind1 = Bmob.Relation('history_relate')
                let add_relID_bind1 = add_relation_bind1.add(resh.objectId)
                // eslint-disable-next-line
                let car_query_bind1 = Bmob.Query('_User')
                car_query_bind1.get(res[0].objectId).then(res => {
                  res.set('history_relate', add_relID_bind1)
                  res.save()
                })
              })
              // 删除选择用户所绑定的的车辆
              // eslint-disable-next-line
              let remove_relation1 = Bmob.Relation('car')
              // eslint-disable-next-line
              let remove_relID1 = remove_relation1.remove(resC.results[0].objectId)
              // eslint-disable-next-line
              let user_query_remove = Bmob.Query('_User')
              user_query_remove.get(res[0].objectId).then(res => {
                res.set('relate', remove_relID1)
                res.save()
              })
              // 删除车辆所绑定的选择用户
              // eslint-disable-next-line
              let add_relation_remove2 = Bmob.Relation('_User')
              let add_relID_remove2 = add_relation_remove2.remove(res[0].objectId)
              // eslint-disable-next-line
              let car_query_remove = Bmob.Query('car')
              car_query_remove.get(resC.results[0].objectId).then(res => {
                car_query_remove.set('id', resC.results[0].objectId)
                car_query_remove.set('status', '待出库')
                car_query_remove.save()
                user_query.save()
                res.set('bind_user', add_relID_remove2)
                res.save()
              })
              // 将现选择用户绑定至车牌（车辆换绑，重新添加relation关系，即car的bind_user字段）
              // eslint-disable-next-line
              let add_relation1 = Bmob.Relation('_User')
              let add_relID1 = add_relation1.add(res[0].objectId)
              // eslint-disable-next-line
              let car_query = Bmob.Query('car')
              car_query.get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
                res.set('bind_user', add_relID1)
                res.save()
              })
              // 将现车牌绑定至选择用户（添加relation关系，即_User的relate字段）
              // eslint-disable-next-line
              let add_relation2 = Bmob.Relation('car')
              let add_relID2 = add_relation2.add(JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
              user_query.get(res[0].objectId).then(res => {
                res.set('relate', add_relID2)
                res.save().then(res => {
                  car_query_remove.set('id', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
                  car_query_remove.set('status', '在租')
                  car_query_remove.save()
                  user_query.save()
                  this.histoeyInfo()
                  this.pageUser(1)
                  this.pageUserInfo(1)
                  this.reveal = 0
                  this.userSum()
                })
              })
            }
          })
        })
      }
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.binding {
  position: relative;

  .new {
    padding: 5px 15px;
    font-size: 18px;
  }

  .but {
    position: absolute;
    z-index: 1000;
    top: 87px;
    left: 48%;
  }

  .worn {
    padding: 5px 15px;
    margin-top: 10px;
    font-size: 18px;
  }
}

</style>
