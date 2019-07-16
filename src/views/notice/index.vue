<template>
  <div class="notice" ref="not">
    <Input placeholder="请输入标题" style="width: auto" v-model="searchNuse" @input="refresh">
    <Icon type="ios-search" slot="suffix" />
    </Input>
    <Button type="primary" @click="search">搜索</Button>
    <Table :height="taHeight" border :columns="columns" :data="noticeData" @on-row-click="inRowInfo" :loading="loading"></Table>
    <div class="input">
      <div class="txt">标题</div>
      <Input v-model="titleValue" placeholder="请输入标题" style="width: 300px" />
      <div class="txt">公告内容</div>
      <Input v-model="value" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 6, maxRows: 5 }" />
      <div class="but">
        <Button type="primary" @click="send">保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  inject: ['reloadRouter'],
  created() {
    this.into()
    this.$nextTick(() => {
      this.taHeight = this.$refs.not.offsetHeight - 311
    })
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      titleValue: '',
      value: '',
      taHeight: 0,
      searchNuse: '',
      loading: false,
      columns: [{
          title: '标题',
          key: 'title'
        },
        {
          title: '时间',
          key: 'c_time'
        },
        {
          title: '内容',
          key: 'message'
        }
      ],
      noticeData: []
    }
  },
  computed: {
    ...mapState(['mass'])
  },
  methods: {
    ...mapMutations(['GAINMASS']),
    inRowInfo(data) {
      sessionStorage.setItem('dataImg', JSON.stringify(data.cer_file))
    },
    // 搜索
    search() {
      this.noticeData = this.noticeData.filter(i => i.title.toLowerCase().indexOf(this.searchNuse.toLowerCase()) > -1)
    },
    // 搜索后刷新
    refresh() {
      this.into()
    },
    send() {
      this.GAINMASS()
      let params = {}
      params.title = this.titleValue
      params.message = this.value
      this.$api.post(`notices/?user=${this.mass.user}`, params, r => {
        let _this = this
        if (r.state === 200) {
          this.$Modal.warning({
            title: r.msg,
            onOk() {
                _this.titleValue = ''
                _this.value = ''
                _this.reloadRouter()
              }
          })
        } else if (r.state === 400) {
          this.$Modal.warning({
            title: r.msg,
            onOk() {
                _this.titleValue = ''
                _this.value = ''
                _this.reloadRouter()
              }
          })
        }
      })
    },
    into() {
      this.loading = true
      this.GAINMASS()
      this.$api.get(`notices/?user=${this.mass.user}`, {}, r => {
        for (let i = 0, max = r.msg.length; i < max; i++) {
          r.msg[i].c_time = r.msg[i].c_time.replace('T', ' ').split('.')[0]
        }
        this.noticeData = r.msg
        this.loading = false
      })
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.notice {
  padding: 0 2%;

  .input {
    .txt {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 5px;
      margin-top: 5px;
    }

    .but {
      margin-top: 10px;
      text-align: center;
    }
  }
}

</style>
