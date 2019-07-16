<template>
  <div class="personage">
    <div class="new">现绑车辆</div>
    <Table border :columns="carColumns" :data="carInfo" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="band"></div>
    <div class="worn">历史绑定车辆</div>
    <Table border :columns="hisColumns" :data="carHistoryInfo" @on-row-click="inRowInfo" :loading="loading"></Table>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  inject: ['sonReloadRouter'],
  created() {
    this.getCarInfo()
    this.dataSum()
    this.alterNumberPages()
    this.pageUserInfo(this.currentPage)
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      carColumns: [{
        title: '姓名',
        key: 'realName',
        width: 100,
        fixed: 'left'
      }, {
        title: '车牌',
        key: 'plate'
      }, {
        title: '车型',
        key: 'vehicle_type'
      }, {
        title: '颜色',
        key: 'color'
      }, {
        title: '供应商',
        key: 'belong_to'
      }, {
        title: '车辆状态',
        key: 'status'
      }],
      carInfo: [],
      hisColumns: [{
        title: '姓名',
        key: 'realName'
      }, {
        title: '车牌',
        key: 'plate'
      }, {
        title: '车型',
        key: 'vehicle_type'
      }, {
        title: '颜色',
        key: 'color'
      }, {
        title: '供应商',
        key: 'belong_to'
      }, {
        title: '换绑时间',
        key: 'createdAt'
      }],
      carHistoryInfo: [],
      sun: 0,
      sunCar: 0, // 车辆总数
      currentPage: 1,
      pageShow: false,
      loading: false,
      modal: false,
      searchNuse: ''
    }
  },
  computed: {
    ...mapState(['mass', 'tallyWen'])
  },
  methods: {
    ...mapMutations(['GAINMASS']),
    inRowInfo(data) {

    },
    getCarInfo() {
      this.butShow = false
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.field('relate', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
      query.relation('car').then(res => {
        this.carInfo = res.results
        for (let i = 0, max = res.results.length; i < max; i++) {
          this.carInfo[i].realName = JSON.parse(sessionStorage.getItem('rowInfo')).realName
        }
        if (res.results.length === 0) {
          this.butShow = true
        } else {
          this.butShow = false
        }
      })
    },
    // 数据总数
    dataSum() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.field('history_relate', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
      query.relation('history_relate').then(res => {
        if (res.count > 10) {
          this.pageShow = true
        }
        this.sun = res.count
      })
    },
    pageUserInfo(v) {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.field('history_relate', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
      if (v === 1) {
        query.limit(10)
      } else if (v > 1) {
        let num = (v - 1) * 10
        query.skip(num)
        query.limit(10)
      }
      query.statTo('order', '-createdAt')
      query.relation('history_relate').then(res => {
        this.carHistoryInfo = res.results
        for (let i = 0, max = res.results.length; i < max; i++) {
          this.carHistoryInfo[i].realName = JSON.parse(sessionStorage.getItem('rowInfo')).realName
        }
        this.loading = false
      })
      sessionStorage.setItem('currentPage', JSON.stringify(v))
    },
    // 改变页数
    alterNumberPages() {
      if (JSON.parse(sessionStorage.getItem('currentPage')) !== null) {
        this.currentPage = JSON.parse(sessionStorage.getItem('currentPage'))
      }
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.personage {
  position: relative;
  padding: 2%;

  .new {
    padding: 0 15px 5px;
    font-size: 18px;
  }

  .worn {
    padding: 5px 15px;
    margin-top: 10px;
    font-size: 18px;
  }

  .band {
    height: 10px;
    background: #f5f7f9;
  }

}

</style>
