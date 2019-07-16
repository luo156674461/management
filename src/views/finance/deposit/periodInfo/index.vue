<template>
  <div class="period">
    <div class="band"></div>
    <div class="search">
      <Input placeholder="请输入姓名" style="width: auto" v-model="searchNuse" @input="refresh"></Input>
      <Icon type="ios-search" slot="suffix" class="icon" />
      <Button type="primary" @click="search">搜索</Button>
    </div>
    <div class="band"></div>
    <Table border :columns="columns" :data="comdata" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="band"></div>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  created() {
    this.userSum()
    this.alterNumberPages()
    this.pageUserInfo(this.currentPage)
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      columns: [{
          title: '姓名',
          key: 'user'
        },
        {
          title: '实际提现额',
          key: 'real_recieved_cash'
        },
        {
          title: '应提现额',
          key: 'should_recieved_cash'
        },
        {
          title: '差额',
          key: 'phone'
        }
      ],
      comdata: [],
      sun: 0, // 用户总数
      currentPage: 1,
      loading: false,
      pageShow: true,
      searchNuse: ''
    }
  },
  computed: {
    ...mapState(['mass'])
  },
  methods: {
    ...mapMutations(['GAINTALLWEN', 'GAINMASS', 'GAINTALLTHREE']),
    // 搜索
    search() {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('groupby', 'month,name')
      query.statTo('sum', 'real_recieved_cash')
      query.equalTo('name', '==', this.searchNuse)
      query.find().then(res => {
        this.pageShow = false
        this.comdata = res
        this.loading = false
      })
    },
    // 搜索后刷新
    refresh() {
      if (this.searchNuse.length === 0) {
        this.pageUserInfo(JSON.parse(sessionStorage.getItem('currentPage')))
      }
    },
    // 用户总数
    userSum() {
      // eslint-disable-next-line
      let query = Bmob.Query('cash_out')
      query.equalTo('time_area', '==', JSON.parse(sessionStorage.getItem('rowInfo')).time_area)
      query.count().then(res => {
        if (res < 10) {
          this.pageShow = false
        } else {
          this.pageShow = true
        }
        this.sun = res
      })
    },
    // 每一页用户信息
    pageUserInfo(v) {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('cash_out')
      if (v === 1) {
        query.limit(10)
      } else if (v > 1) {
        let num = (v - 1) * 10
        query.skip(num)
        query.limit(10)
      }
      query.statTo('where', { time_area: JSON.parse(sessionStorage.getItem('rowInfo')).time_area })
      query.find().then(res => {
        this.comdata = res
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
    inRowInfo(data) {
      sessionStorage.setItem('rowInfo', JSON.stringify(data))
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
</style>
