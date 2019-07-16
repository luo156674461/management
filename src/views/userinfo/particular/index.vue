<template>
  <div class="particular">
    <div class="papers">
      <div class="idcard1"><img :src="idcarOneS" alt="身份证正面"/></div>
        <div class="idcard2"><img :src="idcarWenS" alt="身份证反面"/></div>
          <div class="licence1"><img :src="licenceOneS" alt="驾驶证正面"/></div>
            <div class="licence2"><img :src="licenceWenS" alt="驾驶证反面"/></div>
            </div>
          </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import IdcardOne from '../Upload/IdcardOne'
import IdcardWen from '../Upload/IdcardWen'
import licenceOne from '../Upload/licenceOne'
import licenceWen from '../Upload/licenceWen'
export default {
  inject: ['pageUser'],
  created() {
    // this.alterNumberPages()
    this.pageUserInfo(this.currentPage)
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
      idcarOneS: '',
      idcarWenS: '',
      licenceOneS: '',
      licenceWenS: '',
      loading: false // 过度
    }
  },
  computed: {
    ...mapState(['mass', 'idcarOne', 'idcarWen', 'licenceOne', 'licenceWen'])
  },
  methods: {
    // 每一页用户信息
    pageUserInfo(v) {
      this.loading = true
      // eslint-disable-next-line
      let query = Bmob.Query('_User')
      // eslint-disable-next-line
      query.statTo('where', { 'objectId': JSON.parse(sessionStorage.getItem('rowInfo')).objectId })
      query.find().then(res => {
        this.idcarOneS = res[0].idcarOne
        this.idcarWenS = res[0].idcarWen
        this.licenceOneS = res[0].licenceOne
        this.licenceWenS = res[0].licenceWen
        this.loading = false
      })
    }
  },
  components: {
    IdcardOne,
    IdcardWen,
    licenceOne,
    licenceWen
  }
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

  .papers {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    text-align: center;

    img {
      width: 100%;
      height: 100%;
    }

    .idcard1 {
      flex: 0 0 50%;
      padding: 5%;
      height: 350px;

    }

    .idcard2 {
      flex: 0 0 50%;
      padding: 5%;
      height: 350px;

    }

    .licence1 {
      flex: 0 0 50%;
      padding: 5%;
      height: 350px;

    }

    .licence2 {
      flex: 0 0 50%;
      padding: 5%;
      height: 350px;

    }

  }
}

</style>
