<template>
  <div class="particular">
    <div class="band_1"></div>
    <Table border :columns="columns" :data="dangerdata" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="band_1"></div>
    <div class="text">用户历史</div>
    <div class="band_1"></div>
    <Table border :columns="columnsHU" :data="historyUserDate" :loading="loading"></Table>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="historyUserInfo" v-if="pageShow" />
  </div>
</template>
<script>
export default {
  created() {
    // this.alterNumberPages()
    this.pageUserInfo(this.currentPage)
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      searchNuse: '', // 搜索的输入
      eliminateNum: 0,
      trim: 0,
      columns: [{
          title: '网约车证',
          key: 'Net_around'
        },
        {
          title: '居住证',
          key: 'residence_permit'
        },
        {
          title: '定金额度',
          key: 'deposit_amount'
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
        }
      ],
      dangerdata: [], // 出险数据
      columnsHU: [{
          title: '姓名',
          key: 'realName'
        }, {
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
        }
      ],
      historyUserDate: [], // 历史用户数据
      loading: false, // 过度
      sun: 0, // 用户总数
      currentPage: 1, // 当前页的数字
      pageShow: false // 分页条显示
    }
  },
  computed: {

  },
  methods: {
    // 每一页用户信息
    pageUserInfo(v) {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      // eslint-disable-next-line
      query.statTo('where', { 'objectId': JSON.parse(sessionStorage.getItem('rowInfo')).objectId })
      if (v === 1) {
        query.limit(10)
      } else if (v > 1) {
        let num = (v - 1) * 10
        query.skip(num)
        query.limit(10)
      }
      query.statTo('order', '-createdAt')
      query.find().then(res => {
        if (res[0].Net_around === 'Y') {
          res[0].Net_around = '是'
        } else if (res[0].Net_around === 'N') {
          res[0].Net_around = '否'
        }
        if (res[0].residence_permit === 'Y') {
          res[0].residence_permit = '是'
        } else if (res[0].residence_permit === 'N') {
          res[0].residence_permit = '否'
        }
        this.dangerdata = res
        this.loading = false
        sessionStorage.setItem('currentPage', JSON.stringify(v))
      })
    },
    historyUserInfo(v) {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.field('history_user', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
      if (v === 1) {
        query.limit(10)
      } else if (v > 1) {
        let num = (v - 1) * 10
        query.skip(num)
        query.limit(10)
      }
      query.statTo('order', '-active_date.iso')
      query.relation('history_user').then(res => {
        this.historyUserDate = res.results
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
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.particular {
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

  .text {
    font-size: 20px;
  }
}

</style>
