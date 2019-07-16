<template>
  <div class="regulations">
    <Collapse simple v-if="dataShow">
      <Panel name="1">
        <div class="head">
          <div class="zero">{{user}}</div>
          <div class="zero1">{{carData.plate}}</div>
          <div class="one">
            <span class="hint">是否有违章:</span>
            <span class="txt">{{result.has_vio}}</span>
          </div>
          <div class="two">
            <span class="hint">状态:</span>
            <span class="txt">{{result.status}}</span>
          </div>
          <div class="three">
            <span class="hint">违章:</span>
            <span class="txt">{{result.undeal_count}}</span>
          </div>
          <div class="four">
            <span class="hint">罚款:</span>
            <span class="txt">{{result.undeal_amount_of_money}}</span>
          </div>
          <div class="five">
            <span class="hint">扣分:</span>
            <span class="txt">{{result.undeal_amount_of_score}}</span>
          </div>
          <div class="seven">
            <span class="hint">检验有效期至:</span>
            <span class="txt">{{result.valid_date}}</span>
          </div>
          <div class="six">
            <span class="hint">强制报废时间:</span>
            <span class="txt">{{result.invalidated_date}}</span>
          </div>
        </div>
        <Table border :columns="columns" :data="regdata" @on-row-click="inRowInfo" :loading="loading" slot="content"></Table>
      </Panel>
    </Collapse>
    <div class="reminder" v-if="hintShow">
      <span class="title">提示</span>
      <span class="content">{{content}}</span>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.carData = JSON.parse(sessionStorage.getItem('rowInfo'))
    this.in_gatWeiZhanInfo()
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      carData: {},
      result: {},
      user: '',
      columns: [{
          title: '采集机构名称',
          key: 'cjjgmc'
        },
        {
          title: '违法时间',
          key: 'wfsj'
        },
        {
          title: '违法行为',
          key: 'wfxw'
        },
        {
          title: '违法记分',
          key: 'wfjfs'
        },
        {
          title: '罚款金额',
          key: 'fkje'
        },
        {
          title: '违法地址',
          key: 'wfdz'
        },
        {
          title: '处理状态',
          key: 'clbjmc'
        },
        {
          title: '缴费状态',
          key: 'jkbjmc'
        }
      ],
      regdata: [],
      loading: false,
      dataShow: false,
      content: '',
      hintShow: false
    }
  },
  computed: {

  },
  methods: {
    in_gatWeiZhanInfo() {
      let params = {}
      params.plate_no = this.carData.plate
      if (this.carData.car_type === '小型汽车') {
        params.car_type = '02'
      } else if (this.carData.car_type === '新能源小车') {
        params.car_type = '52'
      }
      this.dataShow = false
      params.eng_no = this.carData.engine_num.slice(-6)
      this.$api.get(`/jmt-api/aladdin/getCarInfo`, params, r => {
        if (r.err_code === -200) {
          this.hintShow = true
          this.content = r.errmsg
        }
        this.result = r.result
        this.regdata = r.result_set
        // eslint-disable-next-line
        let query = Bmob.Query('car')
        query.statTo('where', {
          '$and': [{ 'plate': params.plate_no }, {
            'bind_user': { '$exists': true }
          }]
        })
        query.find().then(res => {
          if (res.length === 0) {
            query.field('bind_user', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
            query.relation('_User').then(res => {
              this.user = '无'

              // eslint-disable-next-line
              let violationQuery = Bmob.Query('car_violation_record')
              violationQuery.statTo('where', { 'plate': this.carData.plate })
              violationQuery.find().then(res => {
                if (res.length === 0) {
                  violationQuery.set('result', r.result)
                  violationQuery.set('plate', this.carData.plate)
                  violationQuery.set('involed_user', this.user)
                  if (r.result.has_vio) {
                    violationQuery.set('result_set', r.result_set)
                  } else {
                    violationQuery.set('result_set', [])
                  }
                  // eslint-disable-next-line
                  violationQuery.save()
                } else {
                  violationQuery.set('id', res[0].objectId)
                  violationQuery.set('result', r.result)
                  violationQuery.set('plate', this.carData.plate)
                  violationQuery.set('involed_user', this.user)
                  if (r.result.has_vio) {
                    violationQuery.set('result_set', r.result_set)
                  } else {
                    violationQuery.set('result_set', [])
                  }
                  // eslint-disable-next-line
                  violationQuery.save()
                }
              })
            })
            if (this.result.has_vio) {
              this.result.has_vio = '是'
            } else {
              this.result.has_vio = '否'
            }
          } else {
            query.field('bind_user', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
            query.relation('_User').then(res => {
              this.user = res.results[0].realName

              // eslint-disable-next-line
              let violationQuery = Bmob.Query('car_violation_record')
              violationQuery.statTo('where', { 'plate': this.carData.plate })
              violationQuery.find().then(res => {
                if (res.length === 0) {
                  violationQuery.set('result', r.result)
                  violationQuery.set('plate', this.carData.plate)
                  violationQuery.set('involed_user', this.user)
                  if (r.result.has_vio) {
                    violationQuery.set('result_set', r.result_set)
                  } else {
                    violationQuery.set('result_set', [])
                  }
                  // eslint-disable-next-line
                  violationQuery.save()
                } else {
                  violationQuery.set('id', res[0].objectId)
                  violationQuery.set('result', r.result)
                  violationQuery.set('plate', this.carData.plate)
                  violationQuery.set('involed_user', this.user)
                  if (r.result.has_vio) {
                    violationQuery.set('result_set', r.result_set)
                  } else {
                    violationQuery.set('result_set', [])
                  }
                  // eslint-disable-next-line
                  violationQuery.save()
                }
              })
            })
            if (this.result.has_vio) {
              this.result.has_vio = '是'
            } else {
              this.result.has_vio = '否'
            }
          }
          this.dataShow = true
        })
      })
    },
    inRowInfo(data) {}
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.regulations {
  .head {
    display: flex;
    position: absolute;
    width: 100%;
    top: 1px;
    padding-left: 16px;
    text-align: center;

    .hint {
      display: inline-block;
      font-weight: 600;
    }

    .txt {
      display: inline-block;
      margin: 0 3%;
      font-weight: 400;
      color: #EF7E34;
    }

    .zero {
      flex: 0 0 40px;
      width: 40px;
      text-align: center;
      margin-right: 20px;
    }

    .zero1 {
      flex: 0 0 80px;
      width: 80px;
      text-align: center;
      margin-right: 20px;
    }

    .one {
      flex: 0 0 100px;
      width: 100px;
      margin-right: 20px;
    }

    .two {
      flex: 0 0 100px;
      width: 100px;
    }

    .three {
      flex: 0 0 100px;
      width: 100px;
    }

    .four {
      flex: 0 0 100px;
      width: 100px;
    }

    .five {
      flex: 0 0 100px;
      width: 100px;
    }

    .six {
      flex: 0 0 180px;
    }

    .seven {
      flex: 0 0 180px;
    }
  }

  .reminder {
    margin: 200px auto;
    text-align: center;

    .title {
      display: block;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .content {
      display: block;
      font-size: 15px;
    }
  }
}

</style>
