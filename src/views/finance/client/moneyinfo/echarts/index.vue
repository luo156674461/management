<template>
  <div id="echarts">
    <div id="myChart"></div>
    <div class="list">
      <Table border :columns="columns" :data="userdata" @on-row-click="inRowInfo" :loading="loading"></Table>
      <div class="band"></div>
      <Table border :columns="gather" :data="gatherdata" :loading="loading"></Table>
    </div>
    <Modal v-model="modal" title="输入" @on-ok="ok">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom">
        <FormItem label="提现额" prop="real_recieved_cash">
          <Input type="text" v-model="formCustom.real_recieved_cash" placeholder="请输入数量"></Input>
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
  created() {
    this.monData = JSON.parse(sessionStorage.getItem('rowInfo'))
    this.value = JSON.parse(sessionStorage.getItem('rowInfo')).realName
    this.inNum()
    this.gatInformation()
    let month = ''
    if ((new Date().getMonth() + 1) < 10) {
      month = `0${new Date().getMonth() + 1}`
    } else {
      month = `${new Date().getMonth() + 1}`
    }
    this.getWeekTime(new Date().getFullYear(), month)
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
          title: '日期',
          key: 'time_area',
          width: 140
        }, {
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
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: ' ',
          key: 'action',
          fixed: 'right',
          width: 70,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: this.import
                }
              }, '输入')
            ])
          }
        }
      ],
      userdata: [],
      gather: [{
          title: ' ',
          key: 'title',
          width: 140
        }, {
          title: '实际提现额',
          key: 'realNum'
        },
        {
          title: '应提现额',
          key: 'shouldNum'
        },
        {
          title: '差额',
          key: 'phoneNum'
        }
      ],
      gatherdata: [{
        title: '汇总',
        realNum: 0,
        shouldNum: 0,
        phoneNum: 0
      }],
      loading: false,
      runningInfo: {},
      proWeekList: [],
      showDate: [],
      fairlyDate: [],
      monthDate: [],
      LiushuiNum: 0,
      showLiushui: [],
      startDate: 0,
      num: 0,
      count: 0,
      realNum: 0,
      shouldNum: 0,
      phoneNum: 0,
      showSumUp: false,
      agoDate: [],
      promiseArray: [],
      modal: false,
      formCustom: {
        real_recieved_cash: '',
        remark: ''
      },
      ruleCustom: {
        real_recieved_cash: [
          // eslint-disable-next-line
          { required: true, message: '数量不能为空', trigger: 'blur' }
        ],
        remark: [
          // eslint-disable-next-line
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
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
        _this.showDate = []
        _this.fairlyDate = []
        _this.showLiushui = []
        _this.promiseArray = []
        _this.monthDate = []
        _this.gatWeekLui(month)
      })
    },
    // 填入数据形成柱状图
    inNum() {
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('groupby', 'name,month')
      query.statTo('sum', 'liushui')
      query.statTo('where', { 'name': this.value })
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
    // 触发表的点击事件
    inRowInfo(data) {
      sessionStorage.setItem('rowInfo', JSON.stringify(data))
    },
    // 修改的点击事件
    import() {
      this.modal = true
      this.num = 1
    },
    ok() {
      // eslint-disable-next-line
      let query = Bmob.Query('cash_out')
      query.set('id', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
      query.set('real_recieved_cash', Number(this.formCustom.real_recieved_cash))
      query.set('remark', this.formCustom.remark)
      let phone = JSON.parse(sessionStorage.getItem('rowInfo')).should_recieved_cash - Number(this.formCustom.real_recieved_cash)
      query.set('phone', phone)
      // eslint-disable-next-line
      query.save().then(res => {
        let _this = this
        this.$Modal.warning({
          title: '输入成功',
          onOk() {
            _this.num = 0
            _this.inGetCash()
          }
        })
        // eslint-disable-next-line
      }).catch(err => {
        this.$Modal.warning({
          // eslint-disable-next-line
          title: '输入失败'
        })
      })
    },
    // 获取所点击柱相应的流水信息
    gatWeekLui(month) {
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('where', { '$and': [{ 'name': this.value }, { 'month': month }] })
      query.find().then(res => {
        this.userdata = []
        this.getWeekTime(res[0].year, res[0].month)
      })
    },
    // 获取提车日期
    gatInformation() {
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      query.statTo('groupby', 'active_date.iso')
      query.statTo('where', { 'realName': this.value })
      query.find().then(res => {
        if (res[0].active_date !== undefined) {
          this.startDate = res[0].active_date.iso
        }
      })
    },
    // 把所点击柱的信息已时间段形式显示在表上
    getWeekTime(year, month) {
      let d = new Date()
      // 该月第一天
      d.setFullYear(year, month - 1, 1)
      let w1 = d.getDay()
      if (w1 === 0) {
        w1 = 7
      }
      // 该月天数
      d.setFullYear(year, month, 0)
      let dd = d.getDate()
      // 第一个周一
      let d1
      if (w1 !== 1) {
        d1 = 7 - w1 + 2
      } else {
        d1 = 1
      }
      let agoNum = 0
      // 柱相应月的周数
      let week_count = Math.ceil((dd - d1 + 1) / 7)
      for (let i = 0, max = week_count; i < max; i++) {
        // 每周的星期二日期
        let two = (d1 + 1) + 7 * i
        // 拿到星期二的年月日
        if (two < 10) {
          this.agoDate[i] = new Date(`${year}-${month}-0${two}`)
        } else {
          this.agoDate[i] = new Date(`${year}-${month}-${two}`)
        }
        // 拿到每周星期二上一周的所有星期的年月日
        this.getProWeekList(this.agoDate[i])
        // 进入第一次循环
        if (i === 0) {
          // 判断是否与相应柱的月相同的个数
          for (let j = 0, max = this.proWeekList.length; j < max; j++) {
            if (this.proWeekList[j].split('-')[1] !== month) {
              agoNum++
            }
          }
          // 判断相应柱的月的一号是否在星期一
          if (agoNum !== 7) {
            let fairlyyise = ''
            let monthNum = ''
            let rise = `${Number(this.proWeekList.slice(agoNum)[0].split('-')[1])}月${Number(this.proWeekList.slice(agoNum)[0].split('-')[2])}日`
            if (Number(this.proWeekList.slice(agoNum)[0].split('-')[1]) < 10 && Number(this.proWeekList.slice(agoNum)[0].split('-')[2]) < 10) {
              fairlyyise = `0${Number(this.proWeekList.slice(agoNum)[0].split('-')[1])}-0${Number(this.proWeekList.slice(agoNum)[0].split('-')[2])}`
            } else {
              if (Number(this.proWeekList.slice(agoNum)[0].split('-')[1]) < 10) {
                fairlyyise = `0${Number(this.proWeekList.slice(agoNum)[0].split('-')[1])}-${Number(this.proWeekList.slice(agoNum)[0].split('-')[2])}`
              } else {
                fairlyyise = `${Number(this.proWeekList.slice(agoNum)[0].split('-')[1])}-${Number(this.proWeekList.slice(agoNum)[0].split('-')[2])}`
              }
            }
            if (Number(this.proWeekList.slice(agoNum)[0].split('-')[1]) < 10) {
              monthNum = `0${Number(this.proWeekList.slice(agoNum)[0].split('-')[1])}`
            } else {
              monthNum = `${Number(this.proWeekList.slice(agoNum)[0].split('-')[1])}`
            }
            let end = `${Number(this.proWeekList.slice(agoNum)[this.proWeekList.slice(agoNum).length - 1].split('-')[1])}月${Number(this.proWeekList.slice(agoNum)[this.proWeekList.slice(agoNum).length - 1].split('-')[2])}日`
            // 时间段
            this.showDate.push(`${rise}--${end}`)
            // 柱的月份
            this.monthDate.push(monthNum)
            // 用于排序的时间
            this.fairlyDate.push(`${fairlyyise}`)
            // 获得相应时间段的流水
            this.thisMonth(agoNum)
          }
        } else {
          let fairlyyise = ''
          let monthNum = ''
          let rise = `${Number(this.proWeekList[0].split('-')[1])}月${Number(this.proWeekList[0].split('-')[2])}日`
          if (Number(this.proWeekList[0].split('-')[1]) < 10 && Number(this.proWeekList[0].split('-')[2]) < 10) {
            fairlyyise = `0${Number(this.proWeekList[0].split('-')[1])}-0${Number(this.proWeekList[0].split('-')[2])}`
          } else {
            if (Number(this.proWeekList[0].split('-')[1]) < 10) {
              fairlyyise = `0${Number(this.proWeekList[0].split('-')[1])}-${Number(this.proWeekList[0].split('-')[2])}`
            } else {
              fairlyyise = `${Number(this.proWeekList[0].split('-')[1])}-${Number(this.proWeekList[0].split('-')[2])}`
            }
          }
          if (Number(this.proWeekList[0].split('-')[1]) < 10) {
            monthNum = `0${Number(this.proWeekList[0].split('-')[1])}`
          } else {
            monthNum = `${Number(this.proWeekList.split('-')[1])}`
          }
          let end = `${Number(this.proWeekList[this.proWeekList.length - 1].split('-')[1])}月${Number(this.proWeekList[this.proWeekList.length - 1].split('-')[2])}日`
          // 时间段
          this.showDate.push(`${rise}--${end}`)
          // 用于排序的时间
          this.fairlyDate.push(`${fairlyyise}`)
          // 柱的月份
          this.monthDate.push(monthNum)
          // 获得相应时间段的流水
          this.thisMonth(0)
        }
      }
      // 获得柱相应月的最后一天的时间
      let new_year = year // 取当前的年份
      let new_month = month++ // 取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) {
        new_month -= 12 // 月份减
        new_year++ // 年份增
      }
      let new_date = new Date(new_year, new_month, 1) // 取当年当月中的第一天
      let finallyDate = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate()
      let finallytxt = `${month - 1}月${finallyDate}日`
      let date1 = new Date(`${year}-${month - 1}-${finallyDate}`)
      let week = date1.getDay()
      let minus = week ? week - 1 : 6
      date1.setDate(date1.getDate() - minus)
      let y = date1.getFullYear()
      let m = date1.getMonth() + 1
      let d12 = date1.getDate()
      let ccc = m + '月' + d12 + '日'
      if (m < 10) {
        m = `0${m}`
      } else {
        m = `${m}`
      }
      let fairlyM = `${m}-${d12}`
      // 用于排序的时间
      this.fairlyDate.push(`${fairlyM}`)
      // 柱的月份
      this.monthDate.push(m)
      let dateEnd = ''
      if ((month - 1) < 10) {
        dateEnd = `${year}-0${month - 1}-${finallyDate}`
      } else {
        dateEnd = `${year}-${month - 1}-${finallyDate}`
      }
      let dateRise = y + '-' + m + '-' + d12
      // 时间段
      this.showDate.push(`${ccc}--${finallytxt}`)
      // 获得柱相应月的不够一周的剩余天的时间
      this.inTheEnd(dateRise, dateEnd)
      for (let s = 0, max = this.showDate.length; s < max; s++) {
        // eslint-disable-next-line
        let queryCash = Bmob.Query('cash_out')
        queryCash.statTo('where', { '$and': [{ 'user': this.value }, { 'time_area': this.showDate[s] }] })
        queryCash.find().then(res1 => {
          if (res1.length === 0) {
            queryCash.set('time_area', this.showDate[s])
            queryCash.set('user', this.value)
            queryCash.set('num', s)
            queryCash.save()
          }
        })
      }
      // let history_relate_user_query = Bmob.Query('history_bind_user')
      // for (let k in JSON.parse(sessionStorage.getItem('History'))) {
      //   if (k !== 'objectId' && k !== 'updatedAt' && k !== 'createdAt' && k !== 'relate' && k !== 'history_relate') {
      //     history_relate_user_query.set(k, JSON.parse(sessionStorage.getItem('History'))[k])
      //   }
      // }
      // 将每个时间段所获取到的流水重新排序
      Promise.all(this.promiseArray).then(res => {
        for (let d = 0, max = res.length; d < max; d++) {
          // 判断获取的流水是否有数据
          if (res[d].length !== 0) {
            let should = Number(res[d][0]._sumLiushui.toFixed(2))
            // eslint-disable-next-line
            let query = Bmob.Query('cash_out')
            query.statTo('where', { user: this.value })
            query.statTo('order', 'num')
            query.find().then(resC => {
              // console.log(resC)
              query.set('id', resC[d].objectId)
              query.set('month', this.monthDate[d])
              query.set('should_recieved_cash', should)
              query.save().then(res => {
                // 把cash_out绑至现用户
                // eslint-disable-next-line
                let add_cash_out = Bmob.Relation('cash_out')
                let add_relID_out = add_cash_out.add(resC[d].objectId)
                // eslint-disable-next-line
                let user_query_bind = Bmob.Query('_User')
                user_query_bind.get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
                  res.set('cash_out', add_relID_out)
                  res.save()
                })
              })
            })
          } else {
            // eslint-disable-next-line
            let query = Bmob.Query('cash_out')
            query.statTo('where', { user: this.value })
            query.statTo('order', 'num')
            query.find().then(resC => {
              query.set('id', resC[d].objectId)
              query.set('month', this.monthDate[d])
              query.set('should_recieved_cash', 0)
              query.save().then(resS => {
                // 把cash_out绑至现用户
                // eslint-disable-next-line
                let add_cash_out = Bmob.Relation('cash_out')
                let add_relID_out = add_cash_out.add(resC[d].objectId)
                // eslint-disable-next-line
                let user_query_bind = Bmob.Query('_User')
                user_query_bind.get(JSON.parse(sessionStorage.getItem('rowInfo')).objectId).then(res => {
                  res.set('cash_out', add_relID_out)
                  res.save()
                })
              })
            })
          }
        }
        month = month - 1
        if (month < 10) {
          month = `0${month}`
        } else {
          month = `${month}`
        }
        // 获取数据
        this.inGetCash(month)
      })
    },
    // 获取数据
    inGetCash(month) {
      this.userdata = []
      // eslint-disable-next-line
      let cashQuery = Bmob.Query('_User')
      cashQuery.field('cash_out', JSON.parse(sessionStorage.getItem('rowInfo')).objectId)
      cashQuery.statTo('where', { month: month })
      cashQuery.statTo('order', 'num')
      cashQuery.relation('cash_out').then(res => {
        this.count = 0
        this.userdata = res.results
        this.inGetCashrealNum(month)
        this.inGetCashshouldNum(month)
        this.inGetCashphoneNum(month)
      })
    },
    // 获取实际提现额总数
    inGetCashrealNum(month) {
      // eslint-disable-next-line
      let cashQuery = Bmob.Query('cash_out')
      cashQuery.statTo('where', { month: month })
      cashQuery.statTo('sum', 'real_recieved_cash')
      cashQuery.find().then(res => {
        this.realNum = res[0]._sumReal_recieved_cash
        this.gatherdata[0].realNum = res[0]._sumReal_recieved_cash
      })
    },
    // 获取应提现额总数
    inGetCashshouldNum(month) {
      // eslint-disable-next-line
      let cashQuery = Bmob.Query('cash_out')
      cashQuery.statTo('where', { month: month })
      cashQuery.statTo('sum', 'should_recieved_cash')
      cashQuery.find().then(res => {
        this.shouldNum = res[0]._sumShould_recieved_cash
        this.gatherdata[0].shouldNum = res[0]._sumShould_recieved_cash
      })
    },
    // 获取差额总数
    inGetCashphoneNum(month) {
      // eslint-disable-next-line
      let cashQuery = Bmob.Query('cash_out')
      cashQuery.statTo('where', { month: month })
      cashQuery.statTo('sum', 'phone')
      cashQuery.find().then(res => {
        this.phoneNum = res[0]._sumPhone
        this.gatherdata[0].phoneNum = res[0]._sumPhone
      })
    },
    // 获取相应时间段的流水数据
    thisMonth(agoNum) {
      let date1 = {
        '__type': 'Date',
        'iso': `${this.proWeekList[agoNum]} 00:00:00`
      }
      let date2 = {
        '__type': 'Date',
        'iso': `${this.proWeekList[6]} 23:59:59`
      }
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('where', {
        '$and': [{ 'name': this.value }, {
          'upload_date': { '$gte': date1, '$lte': date2 }
        }]
      })
      query.statTo('sum', 'liushui')
      this.promiseArray.push(query.find())
    },
    // 获取相应时间段的流水数据
    inTheEnd(rise, end) {
      let date1 = {
        '__type': 'Date',
        'iso': `${rise} 00:00:00`
      }
      let date2 = {
        '__type': 'Date',
        'iso': `${end} 23:59:59`
      }
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('where', {
        '$and': [{ 'name': this.value }, {
          'upload_date': { '$gte': date1, '$lte': date2 }
        }]
      })
      query.statTo('sum', 'liushui')
      this.promiseArray.push(query.find())
    },
    // 获取上周所以星期的时间
    getProWeekList(date) {
      // console.log(date)
      // if ((this.startDate < date) || (this.startDate = date)) {
        let dateTime = date.getTime() // 获取现在的时间
        let dateDay = date.getDay()
        let oneDayTime = 24 * 60 * 60 * 1000
        this.proWeekList = []

        for (let i = 0; i < 7; i++) {
          let time = dateTime - (dateDay + (7 - 1 - i)) * oneDayTime
          // 获取年月日
          var y = new Date(time).getFullYear()
          var m = new Date(time).getMonth() + 1
          var d = new Date(time).getDate()
          // 修改月日格式
          m < 10 && (m = '0' + m)
          d < 10 && (d = '0' + d)
          this.proWeekList[i] = `${y}-${m}-${d}`
          // console.log(this.proWeekList)
        }
      // }
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
#echarts {
  display: flex;

  #myChart {
    flex: 0 0 450px;
    height: 400px;
    text-align: center;
  }

  .list {
    flex: 1;
    height: 400px;

    .band {
      height: 20px;
      background: #fff;
    }

    .sumUp {
      margin: 10px 0;
      display: flex;

      div {
        flex: 1;
        text-align: center;

        .txt {
          display: block;
        }

        .num {
          display: block;
        }
      }
    }

  }

}

</style>
