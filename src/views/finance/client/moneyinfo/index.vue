<template>
  <div class="moneyinfo">
    <div class="sumUp">
      <Echarts></Echarts>
    </div>
    <div class="band"></div>
    <Select v-model="time" slot="prepend" style="width: 50px" @on-change="select">
      <Option value="year">年</Option>
      <Option value="month">月</Option>
      <Option value="date">日</Option>
    </Select>
    <DatePicker :type="show" placeholder="请选择" style="width: 200px" @on-change="gainDate" v-model="inDate" :editable="editable"></DatePicker>
    <Button type="primary" @click="search" class="but">搜索</Button>
    <Button type="primary" @click="add" class="butAdd">新增</Button>
    <Table border :columns="columns" :data="moneydata"></Table>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" />
    <Modal v-model="modal" :title="remText" @on-ok="ok">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="流水" prop="liushui">
          <Input type="text" v-model="formCustom.liushui" placeholder="请输入数量"></Input>
        </FormItem>
        <FormItem label="消费" prop="xiaofei">
          <Input type="text" v-model="formCustom.xiaofei" placeholder="请输入数量"></Input>
        </FormItem>
        <FormItem label="工作状态" prop="work">
          <Select v-model="formCustom.work" style="width:200px">
            <Option value="1">出勤</Option>
            <Option value="2">休息</Option>
          </Select>
        </FormItem>
        <FormItem label="扣罚" prop="koufa">
          <Input type="text" v-model="formCustom.koufa" placeholder="请输入数量"></Input>
        </FormItem>
        <FormItem label="备注" prop="xiaofei">
          <Input type="text" v-model="formCustom.beizhu" placeholder="请输入原因"></Input>
        </FormItem>
        <FormItem label="日期" prop="date">
          <DatePicker type="date" placeholder="请选择" style="width: 200px" v-model="formCustom.date" @on-change="gatDate" :editable="editable"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Echarts from './echarts/index'
export default {
  inject: ['sonReloadRouter'],
  created() {
    this.monData = JSON.parse(sessionStorage.getItem('rowInfo'))
    this.value = JSON.parse(sessionStorage.getItem('rowInfo')).realName
    this.alterNumberPages()
    this.pageUserInfo(this.currentPage)
    this.userSum()
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      columns: [{
          title: '日期',
          key: 'date'
        }, {
          title: '流水',
          key: 'liushui'
        },
        {
          title: '消费',
          key: 'xiaofei'
        },
        {
          title: '工作状态',
          key: 'on_duty'
        },
        {
          title: '扣罚',
          key: 'koufa'
        },
        {
          title: '收入分成',
          key: 'totalPay'
        },
        {
          title: '备注',
          key: 'beizhu'
        }
      ],
      moneydata: [],
      monData: {},
      loading: false,
      value: '',
      time: 'year',
      show: 'year',
      valdate: '',
      editable: false,
      inDate: '',
      currentPage: 1,
      sun: 0,
      modal: false,
      remText: '',
      formCustom: {
        liushui: '',
        xiaofei: '',
        koufa: '',
        date: '',
        beizhu: '',
        work: ''
      },
      ruleCustom: {
        liushui: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        xiaofei: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        beizhu: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      judge: 0
    }
  },
  computed: {

  },
  methods: {
    // 用户流水总数
    userSum() {
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('where', { 'name': this.value })
      query.find().then(res => {
        this.sun = res.length
      })
    },
    // 每一页用户流水信息
    pageUserInfo(v) {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('where', { 'name': this.value })
      if (v === 1) {
        query.limit(10)
      } else if (v > 1) {
        let num = (v - 1) * 10
        query.skip(num)
        query.limit(10)
      }
      query.statTo('order', '-date')
      query.find().then(res => {
        for (let i = 0, max = res.length; i < max; i++) {
          res[i].date = res[i].upload_date.iso.split(' ')[0]
          if (res[i].on_duty === '1') {
            res[i].on_duty = '出勤'
          } else if (res[i].on_duty === '2') {
            res[i].on_duty = '休息'
          }
        }
        this.moneydata = res
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
    select(v) {
      if (v === 'year') {
        this.show = v
        this.inDate = ''
      } else if (v === 'month') {
        this.show = v
        this.inDate = ''
      } else if (v === 'date') {
        this.show = v
        this.inDate = ''
      }
    },
    gainDate(v) {
      if (this.show === 'year') {
        this.valdate = v
      } else if (this.show === 'month') {
        this.valdate = v.split('-')[1]
      } else if (this.show === 'date') {
        this.valdate = v.replace(/\-/g, '/')
      }
      if (v.length === 0) {
        this.pageUserInfo(this.currentPage)
      }
    },
    search() {
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      if (this.show === 'year') {
        // query.statTo('groupby', 'name,liushui,date,' + this.show)
        query.statTo('where', { '$and': [{ 'name': this.value }, { 'year': this.valdate }] })
        query.statTo('order', '-date')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            res[i].date = res[i].upload_date.iso.split(' ')[0]
            if (res[i].on_duty === '1') {
              res[i].on_duty = '出勤'
            } else if (res[i].on_duty === '2') {
              res[i].on_duty = '休息'
            }
          }
          this.moneydata = res
        })
      } else if (this.show === 'month') {
        // query.statTo('groupby', 'name,liushui,date,' + this.show)
        query.statTo('where', { '$and': [{ 'name': this.value }, { 'month': this.valdate }] })
        query.statTo('order', '-date')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            res[i].date = res[i].upload_date.iso.split(' ')[0]
            if (res[i].on_duty === '1') {
              res[i].on_duty = '出勤'
            } else if (res[i].on_duty === '2') {
              res[i].on_duty = '休息'
            }
          }
          this.moneydata = res
        })
      } else {
        // query.statTo('groupby', 'name,liushui,date,' + this.show)
        query.statTo('where', { '$and': [{ 'name': this.value }, { 'date': this.valdate }] })
        query.statTo('order', '-date')
        query.find().then(res => {
          for (let i = 0, max = res.length; i < max; i++) {
            res[i].date = res[i].upload_date.iso.split(' ')[0]
            if (res[i].on_duty === '1') {
              res[i].on_duty = '出勤'
            } else if (res[i].on_duty === '2') {
              res[i].on_duty = '休息'
            }
          }
          this.moneydata = res
        })
      }
    },
    // 新增
    add() {
      this.modal = true
      this.remText = '新增流水'
    },
    gatDate(v) {
      this.formCustom.date = v.replace(/\-/g, '/')
      for (let i = 0, max = this.moneydata.length; i < max; i++) {
        if (this.formCustom.date === this.moneydata[i].date) {
          this.judge = 1
        }
      }
    },
    ok() {
      if (this.judge !== 1) {
        this.handleSubmit('formCustom')
      } else {
        this.alterSubmit('formCustom')
      }
    },
    // 流水新增
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          // eslint-disable-next-line
          let query = Bmob.Query('commission')
          query.set('liushui', Number(this.formCustom.liushui))
          query.set('xiaofei', Number(this.formCustom.xiaofei))
          query.set('koufa', Number(this.formCustom.koufa))
          let totalPay = Number(this.formCustom.liushui) - (Number(this.formCustom.xiaofei) + Number(this.formCustom.koufa))
          query.set('totalPay', totalPay)
          query.set('date', this.formCustom.date)
          query.set('beizhu', this.formCustom.beizhu)
          query.set('name', this.value)
          query.set('month', this.formCustom.date.split('/')[1])
          query.set('year', this.formCustom.date.split('/')[0])
          query.set('on_duty', this.formCustom.work)
          // eslint-disable-next-line
          query.save().then(res => {
            // eslint-disable-next-line
            let relID = Bmob.Relation('commission').add(res.objectId)
            // eslint-disable-next-line
            Bmob.Query('_User').get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
              res.set('commission_relate', relID)
              res.save().then(res => {})
            })
            this.$Modal.warning({
              title: '添加成功',
              onOk() {
                _this.sonReloadRouter()
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
    // 流水修改
    alterSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          // eslint-disable-next-line
          let query = Bmob.Query('commission')
          query.statTo('where', { '$and': [{ 'date': this.formCustom.date, 'name': this.value }] })
          query.find().then(res => {
            query.set('id', res[0].objectId)
            query.set('liushui', Number(this.formCustom.liushui))
            query.set('xiaofei', Number(this.formCustom.xiaofei))
            query.set('koufa', Number(this.formCustom.koufa))
            let totalPay = Number(this.formCustom.liushui) - (Number(this.formCustom.xiaofei) + Number(this.formCustom.koufa))
            query.set('totalPay', totalPay)
            query.set('beizhu', this.formCustom.beizhu)
            query.set('on_duty', this.formCustom.work)
            // eslint-disable-next-line
            query.save().then(res => {
              this.$Modal.warning({
                title: '修改成功',
                onOk() {
                  _this.sonReloadRouter()
                }
              })
              // eslint-disable-next-line
            }).catch(err => {
              this.$Modal.warning({
                // eslint-disable-next-line
                title: '修改失败'
              })
            })
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  },
  components: {
    Echarts
  }
}

</script>
<style rel="stylesheet/scss" lang="scss">
.moneyinfo {
  .band {
    height: 20px;
    background: #f5f7f9;
  }

  .name {
    display: block;
  }
}

</style>
