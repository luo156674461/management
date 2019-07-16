<template>
  <div class="money" ref="inte">
    <div class="sumUp">
      <Diagram></Diagram>
    </div>
    <div class="band"></div>
    <div class="search">
      <Input placeholder="请输入姓名" style="width: auto" v-model="searchNuse" @input="refresh"></Input>
      <Icon type="ios-search" slot="suffix" class="icon" />
      <Button type="primary" @click="search">搜索</Button>
      <Button type="primary" @click="template">下载模板</Button>
      <Upload ref="upload" action="/api/book/excel/import" name="excel-file" :before-upload="catData" :format="['xlsx','xls']">
        <Button type="primary">导入数据</Button>
      </Upload>
    </div>
    <div class="band"></div>
    <Table border :columns="columns" :data="comdata" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="band"></div>
    <Page :total="sun" :page-size="10" :current="currentPage" :show-elevator="true" @on-change="pageUserInfo" v-if="pageShow" />
    <router-view class="router_integral"></router-view>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Diagram from './diagram/index'
export default {
  inject: ['reloadRouter'],
  created() {
    this.alterNumberPages()
    this.pageUserInfo(this.currentPage, `0${new Date().getMonth() + 1}`)
    this.$nextTick(() => {
      this.taHeight = this.$refs.inte.offsetHeight - 64
    })
  },
  mounted() {

  },
  updated() {

  },
  data() {
    const cellValidate = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('手机号码只能是数字'))
      } else {
        callback()
      }
    }
    return {
      columns: [{
          title: '排名',
          key: 'rowNumber',
          width: 70,
          fixed: 'left'
        },
        {
          title: '月份',
          key: 'month'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '流水',
          key: '_sumLiushui'
        },
        {
          title: '消费',
          key: '_sumXiaofei'
        },
        {
          title: '工作状态',
          key: 'on_duty'
        },
        {
          title: '扣罚',
          key: '_sumKoufa'
        },
        {
          title: '收入分成',
          key: '_sumTotalPay'
        },
        {
          title: '备注',
          key: 'beizhu'
        }
      ],
      comdata: [],
      sun: 0, // 用户总数
      currentPage: 1,
      searchNuse: '',
      loading: false,
      companyIoading: false,
      taHeight: 0,
      modal: false,
      integralNum: '',
      remShow: false,
      remText: '',
      checkNum: 0,
      eliminateNum: 0,
      pageShow: true,
      trim: 0,
      gMonth: 0,
      moneyEheader: ['姓名', '日期', '流水', '消费', '扣罚', '收入分成', '工作状态', '备注']
    }
  },
  computed: {
    ...mapState(['mass'])
  },
  methods: {
    ...mapMutations(['GAINTALLWEN', 'GAINMASS']),
    // 搜索
    search() {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('groupby', 'month,name')
      query.statTo('sum', 'liushui,xiaofei,koufa,totalPay')
      query.equalTo('name', '==', this.searchNuse)
      query.find().then(res => {
        this.pageShow = false
        for (let i = 0, max = res.length; i < max; i++) {
          res[i]._sumKoufa = res[i]._sumKoufa.toFixed(2)
          res[i]._sumLiushui = res[i]._sumLiushui.toFixed(2)
          res[i]._sumTotalPay = res[i]._sumTotalPay.toFixed(2)
          res[i]._sumXiaofei = res[i]._sumXiaofei.toFixed(2)
          res[i].rowNumber = i + 1
          if (res[i].on_duty === '1') {
            res[i].on_duty = '出勤'
          } else if (res[i].on_duty === '2') {
            res[i].on_duty = '休息'
          }
        }
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
    userSum(val) {
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('groupby', 'name')
      query.statTo('where', { 'month': val })
      query.find().then(res => {
        this.sun = res.length
      })
    },
    // 每一页用户信息
    pageUserInfo(v, month) {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      query.statTo('groupby', 'month,name')
      query.statTo('sum', 'liushui,xiaofei,koufa,totalPay')
      if (month !== undefined) {
        query.statTo('where', { 'month': month })
        this.userSum(month)
        this.gMonth = month
      } else {
        query.statTo('where', { 'month': this.gMonth })
        this.userSum(this.gMonth)
      }
      query.find().then(res => {
        let M
        for (let i = 0, max = res.length; i < max; i++) {
          for (let j = i + 1, max = res.length; j < max; j++) {
            if (res[i]._sumLiushui < res[j]._sumLiushui) {
              M = res[j]
              res[j] = res[i]
              res[i] = M
            }
          }
          res[i]._sumKoufa = res[i]._sumKoufa.toFixed(2)
          res[i]._sumLiushui = res[i]._sumLiushui.toFixed(2)
          res[i]._sumTotalPay = res[i]._sumTotalPay.toFixed(2)
          res[i]._sumXiaofei = res[i]._sumXiaofei.toFixed(2)
          res[i].rowNumber = i + 1
          if (res[i].on_duty === '1') {
            res[i].on_duty = '出勤'
          } else if (res[i].on_duty === '2') {
            res[i].on_duty = '休息'
          }
        }
        this.pageShow = true
        if (v === 1) {
          this.comdata = res.slice(v - 1, v + 9)
        } else if (v > 1) {
          let num = v * 10
          let qNum = (v - 1) * 10
          this.comdata = res.slice(qNum, num)
        }
        // console.log(res)
        // // this.comdata = res
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
      if (this.trim === 1) {
        this.formCustom.liushui = data.liushui.toString()
        this.formCustom.xiaofei = data.xiaofei.toString()
        this.formCustom.koufa = data.koufa.toString()
        this.formCustom.beizhu = data.beizhu
      }
    },
    // 新增
    add() {
      this.modal = true
      this.remText = '新增车辆'
      this.eliminateNum = 2
      this.trim = 2
    },
    // 下载模板
    template() {
      this.handleDownload([], this.moneyEheader, [], '模板')
    },
    // 导入数据
    catData(file) {
      let _this = this
      var rABS = false // 是否将文件读取为二进制字符串
      var f = file
      var reader = new FileReader()
      // if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = ''
        var rABS = false // 是否将文件读取为二进制字符串
        var pt = this
        var wb // 读取完成的数据
        var outdata
        var reader = new FileReader()
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          var XLSX = require('xlsx')
          if (rABS) {
            // eslint-disable-next-line
            wb = XLSX.read(btoa(fixdata(binary)), { // 手动转化
              type: 'base64'
            })
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            })
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) // outdata就是你想要的东西
          this.da = [...outdata]
          this.da.map(v => {
            // eslint-disable-next-line
            let query = Bmob.Query('commission')
            query.statTo('where', { 'name': v['姓名'] })
            query.find().then(res => {
              if (res.length === 0) {
                if (v['姓名'] !== undefined) {
                  query.set('name', String(v['姓名']))
                }
                if (v['日期'] !== undefined) {
                  query.set('upload_date', this.formatDateSum(v['日期']))
                  query.set('month', this.formatMonth(v['日期']))
                  query.set('year', this.formatYear(v['日期']))
                  query.set('date', this.formatDate(v['日期']))
                }
                if (v['流水'] !== undefined) {
                  query.set('liushui', v['流水'])
                }
                if (v['消费'] !== undefined) {
                  query.set('xiaofei', v['消费'])
                }
                if (v['扣罚'] !== undefined) {
                  query.set('Koufa', v['扣罚'])
                }
                if (v['收入分成'] !== undefined) {
                  query.set('totalPay', v['收入分成'])
                }
                if (v['工作状态'] !== undefined) {
                  if (v['工作状态'] === '出勤') {
                    query.set('on_duty', '1')
                  } else if (v['工作状态'] === '休息') {
                    query.set('on_duty', '2')
                  }
                }
                if (v['备注'] !== undefined) {
                  query.set('beizhu', String(v['备注']))
                }
              }
            })
          })
          // console.log(arr)
          // let para = {
          //   // withList: JSON.stringify(this.da)
          //   withList: arr
          // }
          _this.$message({
            message: '请耐心等待导入成功',
            type: 'success'
          })
          // eslint-disable-next-line
          // withImport(para).then(res => {
          //   window.location.reload()
          // })
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    // 时间的转换
    formatDateSum(numb) {
      let time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      let year = time.getFullYear() + ''
      let month = time.getMonth() + 1
      let date = time.getDate()
      if (month < 10) {
        month = `0${month}`
      } else {
        month = time.getMonth() + 1 + ''
      }
      if (date < 10) {
        date = `0${date}`
      } else {
        date = time.getDate() + ''
      }
      return {
        '__type': 'Date',
        'iso': `${year}-${month}-${date} 00:00:00`
      }
    },
    formatYear(numb) {
      let time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      let year = time.getFullYear() + ''
      return `${year}`
    },
    formatMonth(numb) {
      let time = new Date((numb - 1) * 24 * 3600000 + 1)
      let month = time.getMonth() + 1
      if (month < 10) {
        month = `0${month}`
      } else {
        month = time.getMonth() + 1 + ''
      }
      return `${month}`
    },
    formatDate(numb) {
      let time = new Date((numb - 1) * 24 * 3600000 + 1)
      let date = time.getDate()
      if (date < 10) {
        date = `0${date}`
      } else {
        date = time.getDate() + ''
      }
      return `${date}`
    },
    ok() {
      this.modal = false
      // eslint-disable-next-line
      let query = Bmob.Query('commission')
      let _this = this
      if (this.eliminateNum === 1 && this.trim === 1) {
        this.handleSubmit('formCustom')
      } else if (this.eliminateNum === 2) {
        let objectId = JSON.parse(sessionStorage.getItem('rowInfo')).objectId
        query.destroy(objectId).then(res => {
          this.$Modal.warning({
            title: '修改成功',
            onOk() {
              _this.reloadRouter()
              _this.eliminateNum = 0
            }
          })
          // eslint-disable-next-line
        }).catch(err => {
          this.$Modal.warning({
            title: '修改失败'
          })
        })
      }
    },
    // 导出数据为Excel
    async handleDownload(tableData, heaDer, Val, Ename) {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('@/vendor/Export2Excel')
        const list = tableData
        const data = this.formatJson(Val, list)
        export_json_to_excel(heaDer, data, Ename)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  components: {
    Diagram
  }
}

</script>
<style rel="stylesheet/scss" lang="scss">
.money {
  position: relative;

  .sumUp {
    margin: 5px 0;
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

    .ivu-upload {
      display: inline-block;
    }
  }

  .band {
    height: 5px;
    background: #f5f7f9;
  }

  .router_integral {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 1000;
  }

  .rem {
    display: block;
    text-align: center;
    margin-top: 5px;
  }
}

</style>
