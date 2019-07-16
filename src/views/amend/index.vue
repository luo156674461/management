<template>
  <div class="amend">
    <Modal v-model="modal" title="密码修改" @on-ok="ok">
      <Input v-model="password" @input="remind" />
      <span class="rem" style="display:block; text-align:center; color: red; margin-top: 10px;" v-if="remShow">{{remText}}</span>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  created() {
    this.revamp()
  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {
      password: '',
      remText: '',
      remShow: false,
      modal: false
    }
  },
  computed: {
    ...mapState(['mass'])
  },
  methods: {
    ...mapMutations(['GAINMASS']),
    // 密码修改
    revamp() {
      this.revampJudge = true
      this.modal = true
    },
    ok() {
      this.GAINMASS()
      let params = {}
      params.user = JSON.parse(sessionStorage.getItem('rowInfo')).user
      params.password = this.$des.encrypt(this.password)
      let _this = this
      if (this.password.length !== 0) {
        this.$api.post(`change_passwd/?user=${this.mass.user}`, params, r => {
          if (r.state === 200) {
            this.$Modal.warning({
              content: r.msg,
              onOk() {
                _this.integralNum = ''
                _this.reloadRou()
              }
            })
          } else if (r.state === 400) {
            this.$Modal.warning({
              content: r.msg,
              onOk() {
                _this.integralNum = ''
                _this.reloadRou()
              }
            })
          }
        })
      }
    },
    remind() {
      if (this.password.length === 0) {
        this.remShow = true
        this.remText = '密码不能为空'
      } else {
        this.remShow = false
      }
    },
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
</style>
