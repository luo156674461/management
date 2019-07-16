<template>
  <div class="history">
    <Button type="primary" @click="add" class="butAdd">新增</Button>
    <Table border :columns="columns" :data="userHdata" @on-row-click="inRowInfo" :loading="loading"></Table>
    <Modal v-model="modal" title="新增客户" @on-ok="ok">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="客户名" prop="user">
          <Input type="text" v-model="formCustom.user" placeholder="请输入客户名"></Input>
        </FormItem>
        <FormItem label="租金" prop="cell">
          <Input type="text" v-model="formCustom.rent" placeholder="请输入租金"></Input>
        </FormItem>
        <FormItem label="交租日期" prop="beginDate">
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 250px" @on-change="begin" v-model="formCustom.beginDate"></DatePicker>
        </FormItem>
        <FormItem label="应交租时间" prop="answerDate">
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 250px" @on-change="answer" v-model="formCustom.answerDate"></DatePicker>
        </FormItem>
        <FormItem label="交租时间" prop="dealDate">
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 250px" @on-change="deal" v-model="formCustom.dealDate"></DatePicker>
        </FormItem>
        <FormItem label="已交租金" prop="alreadyRent">
          <Input type="text" v-model="formCustom.alreadyRent" placeholder="请输入租金"></Input>
        </FormItem>
        <FormItem label="逾期天数" prop="overdue">
          <Input type="text" v-model="formCustom.overdue" placeholder="请输入逾期天数"></Input>
        </FormItem>
        <FormItem label="滞纳金" prop="overdue_fine">
          <Input type="text" v-model="formCustom.overdue_fine" placeholder="请输入滞纳金"></Input>
        </FormItem>
        <FormItem label="备注" prop="rent_remark">
          <Input type="text" v-model="formCustom.rent_remark" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  created() {

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
      }], // 表头
      userHdata: [], // 表数据
      modal: false, // 输入弹窗
      loading: false, // 接收数据的过度
      formCustom: {
        user: '',
        rent: '',
        beginDate: '',
        answerDate: '',
        dealDate: '',
        alreadyRent: '',
        overdue: '',
        overdue_fine: '',
        rent_remark: ''
      },
      ruleCustom: {
        user: [
          // eslint-disable-next-line
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        rent: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        beginDate: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        answerDate: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
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
      }
    }
  },
  computed: {

  },
  methods: {
    // 表所触发的方法
    inRowInfo(data) {
      sessionStorage.setItem('usetHRowInfo', JSON.stringify(data))
    },
    getHuserRent() {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.field('user_rent', JSON.parse(sessionStorage.getItem('usetRowInfo')).objectId)
      query.statTo('order', '-createdAt')
      query.relation('history_bind_user').then(res => {
        this.loading = false
        this.userHdata = res
      })
    },
    // 新增
    add() {
      this.modal = true
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
    // 执行方法
    ok() {
      this.modal = false
      this.handleSubmit('formCustom')
    },
    // 用户新增
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let _this = this
          let objectId = JSON.parse(sessionStorage.getItem('usetRowInfo')).objectId
          // eslint-disable-next-line
          let query = Bmob.Query('user_rent')
          query.set('realName', this.formCustom.user)
          query.set('rent', this.formCustom.rent)
          query.set('beginDate', this.formCustom.beginDate)
          query.set('answerDate', this.formCustom.answerDate)
          query.set('dealDate', this.formCustom.dealDate)
          query.set('alreadyRent', this.formCustom.alreadyRent)
          query.set('overdue', this.formCustom.overdue)
          query.set('overdue_fine', this.formCustom.overdue_fine)
          query.set('rent_remark', this.formCustom.rent_remark)
          // eslint-disable-next-line
          query.save().then(res => {
            // 把user_rent绑至现用户
            // eslint-disable-next-line
            let add_relation_bind = Bmob.Relation('user_rent')
            let add_relID_bind = add_relation_bind.add(res.objectId)
            // eslint-disable-next-line
            let car_query_bind = Bmob.Query('_User')
            car_query_bind.get(objectId).then(res => {
              res.set('user_rent', add_relID_bind)
              res.save()
              this.$Modal.warning({
                title: '添加成功',
                onOk() {
                  _this.reloadRouter()
                }
              })
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
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.history {}

</style>
