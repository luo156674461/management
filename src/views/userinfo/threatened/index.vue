<template>
  <div class="threatened">
    <!-- <div class="search">
      <Input placeholder="请输入姓名" style="width: auto" v-model="searchNuse" @input="refresh"></Input>
      <Icon type="ios-search" slot="suffix" class="icon" />
      <Button type="primary" @click="search">搜索</Button>
    </div> -->
    <div class="band_1"></div>
    <Table border :columns="columns" :data="dangerdata" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="band_1"></div>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
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
      pageShow: false // 分页条显示
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
    // 每一页用户信息
    pageUserInfo(v) {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('insurance_record')
      // eslint-disable-next-line
      query.statTo('where', { 'involed_user': JSON.parse(sessionStorage.getItem('rowInfo')).realName})
      if (v === 1) {
        query.limit(10)
      } else if (v > 1) {
        let num = (v - 1) * 10
        query.skip(num)
        query.limit(10)
      }
      query.statTo('order', '-createdAt')
      query.find().then(res => {
        if (res.count > 10) {
          this.pageShow = true
        } else {
          this.pageShow = false
        }
        for (let i = 0, max = res.length; i < max; i++) {
          res[i].date = res[i].be_in_danger_time.iso
        }
        this.sun = res.length
        this.dangerdata = res
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
