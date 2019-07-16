<template>
  <div class="echarts">
    <div id="myChart"></div>
  </div>
</template>
<script>
export default {
  created() {
    this.inNum()
  },
  mounted() {},
  updated() {

  },
  data() {
    return {
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
      Dec: 0
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
    drawLine() {
      let _this = this
      // let odataArr = this.dataArr
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: `总实际提现额表` },
        tooltip: {},
        xAxis: {
          data: this.dataArr
        },
        yAxis: {},
        series: [{
          name: '现额',
          type: 'bar', // 折线图 可以自定义bar柱状图
          data: [this.Jan, this.Feb, this.Mar, this.Apr, this.May, this.Jun, this.Jul, this.Aug, this.Sep, this.Oct, this.Nov, this.Dec]
        }]
      })
      // 点击月份柱 触发事件
      myChart.on('click', function(params) {
        _this.$parent.pageUserInfo(1, `0${params.name.split('月')[0]}`)
      })
    },
    inNum() {
      // eslint-disable-next-line
      let query = Bmob.Query('cash_out')
      query.statTo('groupby', 'month')
      query.statTo('sum', 'real_recieved_cash')
      query.find().then(res => {
        for (let i = 0, max = res.length; i < max; i++) {
          if (res[i].month === '01') {
            this.Jan = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '02') {
            this.Feb = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '03') {
            this.Mar = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '04') {
            this.Apr = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '05') {
            this.May = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '06') {
            this.Jun = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '07') {
            this.Jul = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '08') {
            this.Aug = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '09') {
            this.Sep = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '10') {
            this.Oct = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '11') {
            this.Nov = res[i]._sumReal_recieved_cash.toFixed(2)
          } else if (res[i].month === '12') {
            this.Dec = res[i]._sumReal_recieved_cash.toFixed(2)
          }
        }
        this.drawLine()
      })
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
#myChart {
  width: 100%;
  height: 300px;
  text-align: center;
}

</style>
