<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{login.title}}</h3>
        <!-- <lang-select class="set-language"></lang-select> -->
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" :placeholder="login.username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" :placeholder="login.password" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{login.logIn}}</el-button>
      <!-- <div class="tips">
        <span>{{login.username}} : admin</span>
        <span>{{login.password}} : {{login.any}}</span>
      </div> -->
      <!-- <div class="tips">
        <span style="margin-right:18px;">{{login.username}} : editor</span>
        <span>{{login.password}} : {{login.any}}</span>
      </div> -->
      <!-- <el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{login.thirdparty}}</el-button> -->
    </el-form>
    <el-dialog :title="login.thirdparty" :visible.sync="showDialog" append-to-body>
      {{login.thirdpartyTips}}
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>
  </div>
</template>
<script>
import LangSelect from '@/components/LangSelect'
import { mapMutations } from 'vuex'
export default {
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      let confiU = this.confirmUserName()
      if (value.length === 0) {
        callback(new Error('用户不能为空'))
      } else if (confiU !== 1) {
        callback(new Error('用户不存在'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      let confiP = this.confiPassword()
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else if (confiP !== 1) {
        callback(new Error('密码错误'))
      } else {
        callback()
      }
    }
    return {
      login: {
        title: '系统登录',
        logIn: '登录',
        username: '账号',
        password: '密码'
      },
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      logoIngo: [],
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    ...mapMutations(['OPENGAINTALLONE', 'OFFGAINTALLONE']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let mass = {}
          // eslint-disable-next-line
          let query = Bmob.Query('administrator')
          query.statTo('where', { 'admin_name': this.loginForm.username })
          query.find().then(res => {
            mass.exceed = res[0].level
            mass.user = this.loginForm.username
            mass.pass = this.loginForm.password
            sessionStorage.setItem('mass', JSON.stringify(mass))
            this.$router.push({ path: '/' })
            this.OPENGAINTALLONE()
          })
        } else {
          return false
        }
      })
    },
    confirmUserName() {
      let userflag = 0
      for (let i = 0; i < this.logoIngo.length; i++) {
        if (this.loginForm.username === this.logoIngo[i].admin_name) {
          userflag = 1
        }
      }
      return userflag
    },
    confiPassword() {
      let passflag = 0
      for (let i = 0; i < this.logoIngo.length; i++) {
        if (this.loginForm.password === this.logoIngo[i].password) {
          passflag = 1
        }
      }
      return passflag
    }
  },
  created() {
    // eslint-disable-next-line
    let query = Bmob.Query('administrator')
    query.find().then(res => {
      this.logoIngo = res
    })
    this.OFFGAINTALLONE()
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}

</script>
<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;

    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;

  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;

    &_login {
      font-size: 20px;
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}

</style>
