<template>
  <div class="threatened">
    <div class="search">
      <Input placeholder="请输入姓名" style="width: auto" v-model="searchNuse" @input="refresh"></Input>
      <Icon type="ios-search" slot="suffix" class="icon" />
      <Button type="primary" @click="search">搜索</Button>
      <Button type="primary" @click="add">新增</Button>
    </div>
    <div class="band_1"></div>
    <Table border :columns="columns" :data="dangerdata" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="band_1"></div>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
    <Modal v-model="modal" :title="remText" @on-ok="ok">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" v-if="eliminateNum === 1? true : false">
        <FormItem label="出险人" prop="involed_user">
          <Select v-model="formCustom.involed_user" style="width:200px" filterable>
            <Option v-for="item in userList" :value="item.realName" :key="item.value">{{ item.realName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="日期" prop="date">
          <DatePicker type="datetime" placeholder="请选择日期" style="width: 200px" @on-change="gainDate" v-model="formCustom.date" :editable="editable" clearable></DatePicker>
        </FormItem>
        <FormItem label="出险金额" prop="loss_amount">
          <Input type="text" v-model="formCustom.loss_amount" placeholder="请输入数量"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input type="text" v-model="formCustom.remark" placeholder="请输入原因"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  inject: ['vehReloadRouter'],
  created() {
    this.alterNumberPages()
    this.pageUserInfo(this.currentPage)
    this.dangerUser()
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      searchNuse: '', // 搜索的输入
      modal: false, // 新增的输入框
      remText: '', // 输入框提示
      eliminateNum: 0,
      trim: 0,
      columns: [{
          title: '出险人',
          key: 'involed_user'
        },
        {
          title: '出险金额',
          key: 'loss_amount'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '日期',
          key: 'date'
        }
      ],
      dangerdata: [], // 出险数据
      loading: false, // 过度
      sun: 0, // 用户总数
      currentPage: 1, // 当前页的数字
      pageShow: false, // 分页条显示
      formCustom: {
        involed_user: '',
        loss_amount: '',
        remark: '',
        date: ''
      },
      ruleCustom: {
        involed_user: [
          // eslint-disable-next-line
          { required: true, message: '出险人不能为空', trigger: 'blur' }
        ],
        loss_amount: [
          // eslint-disable-next-line
          { required: true, message: '数量不能为空', trigger: 'blur' }
        ],
        remark: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        date: [
          // eslint-disable-next-line
          { required: true, message: '日期不能为空', trigger: 'blur' }
        ]
      },
      userList: [], // 出险人数组
      inDate: '', // 选择时间
      editable: false
    }
  },
  computed: {

  },
  methods: {
    // 搜索
    search() {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('insurance_record')
      query.equalTo('involed_user', '==', this.searchNuse)
      query.find().then(res => {
        for (let i = 0, max = res.length; i < max; i++) {
          res[i].date = res[i].be_in_danger_time.iso
        }
        this.pageShow = false
        this.dangerdata = res
        this.loading = false
      })
    },
    // 搜索后刷新
    refresh() {
      if (this.searchNuse.length === 0) {
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
      }
    },
    // 新增
    add() {
      this.modal = true
      this.remText = '新增车辆'
      this.eliminateNum = 1
      this.trim = 1
    },
    // 出险人名单
    dangerUser() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.statTo('groupby', 'realName')
      query.find().then(res => {
        this.userList = res
      })
    },
    // 每一页用户信息
    pageUserInfo(v) {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('car')
      query.field('insurance_record', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
      if (v === 1) {
        query.limit(10)
      } else if (v > 1) {
        let num = (v - 1) * 10
        query.skip(num)
        query.limit(10)
      }
      query.statTo('order', '-createdAt')
      query.relation('insurance_record').then(res => {
        if (res.count > 10) {
          this.pageShow = true
        } else {
          this.pageShow = false
        }
        for (let i = 0, max = res.results.length; i < max; i++) {
          res.results[i].date = res.results[i].be_in_danger_time.iso
        }
        this.sun = res.count
        this.dangerdata = res.results
        this.loading = false
        sessionStorage.setItem('currentPage', JSON.stringify(v))
      })
    },
    // 改变页数
    alterNumberPages() {
      if (JSON.parse(sessionStorage.getItem('currentPage')) !== null) {
        this.currentPage = JSON.parse(sessionStorage.getItem('currentPage'))
      }
    },
    // 数据选择触发
    inRowInfo(data) {
      sessionStorage.setItem('rowInfo', JSON.stringify(data))
    },
    // 选择时间触发
    gainDate(v) {
      this.formCustom.date = v
    },
    ok() {
      this.modal = false
      if (this.eliminateNum === 1 && this.trim === 1) {
        this.handleSubmit('formCustom')
      }
      // console.log(this.formCustom.involed_user)
      // console.log(this.formCustom.loss_amount)
      // console.log(this.formCustom.remark)
    },
    // 车辆新增
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          // eslint-disable-next-line
          let query = Bmob.Query('insurance_record')
          query.set('involed_user', this.formCustom.involed_user)
          query.set('loss_amount', Number(this.formCustom.loss_amount))
          query.set('remark', this.formCustom.remark)
          query.set('be_in_danger_time', {
            '__type': 'Date',
            'iso': this.formCustom.date
          })
          // eslint-disable-next-line
          query.save().then(res => {
            // eslint-disable-next-line
            let relID = Bmob.Relation('insurance_record').add(res.objectId)
            // eslint-disable-next-line
            Bmob.Query('car').get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
              res.set('insurance_record', relID)
              // eslint-disable-next-line
              res.save().then(res => {
                this.$Modal.warning({
                  title: '添加成功',
                  onOk() {
                    _this.vehReloadRouter()
                    _this.eliminateNum = 0
                  }
                }) // eslint-disable-next-line
              }).catch(err => {
                this.$Modal.warning({
                  // eslint-disable-next-line
                  title: '添加失败'
                })
              })
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
.threatened {
  position: relative;

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

  .band_1 {
    height: 5px;
    background: #f5f7f9;
  }
}

</style>
