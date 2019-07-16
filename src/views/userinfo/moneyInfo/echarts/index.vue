<template>
  <div class="echarts">
    <div id="myChart"></div>
    <div id="weekly">
      <Table :columns="columns" :data="dataInfo" :loading="loading"></Table>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.monData = JSON.parse(sessionStorage.getItem('rowInfo'))
    this.value = JSON.parse(sessionStorage.getItem('rowInfo')).realName
    this.inNum()
    let getDate = new Date().getMonth() + 1
    this.inMonthInfo('0' + getDate)
  },
  mounted() {},
  updated() {

  },
  data() {
    return {
      value: '',
      dataArr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
      columns: [{
          title: '现日均流水',
          key: 'nomLui'
        },
        {
          title: '流水级别',
          key: 'rank'
        },
        {
          renderHeader: (h, params) => {
            return h('div', this.distance)
          },
          key: 'distNum'
        },
        {
          title: '剩余每日仍需',
          key: 'still'
        },
        {
          title: '剩余每日流水可达优秀',
          key: 'excellent'
        },
        {
          title: '剩余可休息天数',
          key: 'butRest'
        }
      ],
      dataInfo: [],
      distance: '距离下个等级',
      loading: false
    }
  },
  computed: {

  },
  watch: {
    dataArr(val) { // 监听数据发生改变 刷新图表数据
      this.drawLine()
    }
  },
  methods: {
    // 流水柱状图
    drawLine() {
      let _this = this
      // let odataArr = this.dataArr
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: `${this.value}流水表` },
        tooltip: {},
        xAxis: {
          data: this.dataArr
        },
        yAxis: {},
        series: [{
          name: '流水',
          type: 'bar', // 折线图 可以自定义bar柱状图
          data: [this.Jan, this.Feb, this.Mar, this.Apr, this.May, this.Jun, this.Jul, this.Aug, this.Sep, this.Oct, this.Nov, this.Dec]
        }]
      })
      // 点击月份柱 触发事件
      myChart.on('click', function(params) {
        let month = `0${params.name.charAt(0)}`
        _this.dataInfo = []
        _this.inMonthInfo(month)
      })
    },
    // 柱状图数据
    inNum() {
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('where', { 'name': this.value })
      query.statTo('groupby', 'name,month')
      query.statTo('sum', 'liushui')
      query.find().then(res => {
        for (let i = 0, max = res.length; i < max; i++) {
          if (res[i].month === '01') {
            this.Jan = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '02') {
            this.Feb = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '03') {
            this.Mar = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '04') {
            this.Apr = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '05') {
            this.May = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '06') {
            this.Jun = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '07') {
            this.Jul = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '08') {
            this.Aug = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '09') {
            this.Sep = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '10') {
            this.Oct = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '11') {
            this.Nov = res[i]._sumLiushui.toFixed(2)
          } else if (res[i].month === '12') {
            this.Dec = res[i]._sumLiushui.toFixed(2)
          }
        }
        this.drawLine()
      })
    },
    // 初始化
    inMonthInfo(month) {
      this.loading = true
      // 获取点击月的总流水
      // eslint-disable-next-line
      let sumQuery = Bmob.Query('commission')
      sumQuery.statTo('where', { '$and': [{ 'name': this.value }, { 'month': month }] })
      sumQuery.statTo('sum', 'liushui')
      sumQuery.find().then(sumRes => {
        if (sumRes.length !== 0) {
          // 出勤天数
          // eslint-disable-next-line
          let dutyQuery = Bmob.Query('commission')
          dutyQuery.statTo('where', { '$and': [{ 'name': this.value }, { 'month': month }] })
          dutyQuery.equalTo('on_duty', '==', '1')
          dutyQuery.count().then(dutyRes => {
            // 休息天数
            // eslint-disable-next-line
            let restQuery = Bmob.Query('commission')
            restQuery.statTo('where', { '$and': [{ 'name': this.value }, { 'month': month }] })
            restQuery.equalTo('on_duty', '==', '2')
            restQuery.count().then(restRes => {
              this.clickMonthInfo(month, sumRes[0]._sumLiushui, dutyRes, restRes)
            })
          })
        } else {
          this.loading = false
        }
      })
    },
    // 获取点击月的信息
    clickMonthInfo(month, sum, duty, rest) {
      this.dataInfo = []
      let weekly = {}
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('where', { '$and': [{ 'name': this.value }, { 'month': month }] })
      query.find().then(res => {
        // 获得点击月的天数
        let fate = new Date(Number(res[0].year), Number(res[0].month), 0).getDate()
        let remainingDays = fate - (duty + rest)
        let remainingDaysRate = remainingDays * (duty / (duty + rest))
        // 现日均流水
        weekly.nomLui = (sum / (duty + rest)).toFixed(2)
        // 流水级别
        if (sum > 0 && sum < 8000) {
          weekly.rank = '未达标'
          weekly.distNum = 8000 - sum
          this.distance = '距离达标'
          weekly.still = (weekly.distNum / remainingDaysRate).toFixed(2)
          weekly.butRest = parseInt(remainingDays - weekly.distNum / weekly.nomLui)
        } else if (sum > 8000 && sum < 10000) {
          weekly.rank = '达标'
          weekly.distNum = 10000 - sum
          this.distance = '距离中级'
          weekly.still = (weekly.distNum / remainingDaysRate).toFixed(2)
          weekly.butRest = parseInt(remainingDays - weekly.distNum / weekly.nomLui)
        } else if (sum > 10000 && sum < 12000) {
          weekly.rank = '中级'
          weekly.distNum = 10000 - sum
          this.distance = '距离优秀'
          weekly.still = (weekly.distNum / remainingDaysRate).toFixed(2)
          weekly.butRest = parseInt(remainingDays - weekly.distNum / weekly.nomLui)
        } else if (sum > 12000) {
          weekly.rank = '优秀'
          this.distance = '已完美'
          weekly.distNum = '完美'
          weekly.still = '完美'
          weekly.butRest = '完美'
        }
        if (sum < 12000) {
          weekly.excellent = ((12000 - sum) / remainingDaysRate).toFixed(2)
        } else {
          weekly.excellent = '完美'
        }
        this.dataInfo.push(weekly)
        this.loading = false
      })
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.echarts {
  display: flex;

  #myChart {
    flex: 1;
    width: 100%;
    height: 300px;
    text-align: center;
  }

  #weekly {
    flex: 1;
  }
}

</style>
