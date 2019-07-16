<template>
  <div id="app">
    <router-view v-if="isRouter"></router-view>
    <div class="overtime" v-if="overtimeShow" @click="overtimeSwi">
      <Alert type="warning" show-icon>
        超时
        <template slot="desc">
          你登录已超时！
        </template>
      </Alert>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'App',
  created() {
  },
  mounted() {

  },
  updated() {

  },
  provide() {
    return {
      reloadRou: this.reloadRou
    }
  },
  data() {
    return {
      isRouter: true
    }
  },
  computed: {
    ...mapState(['overtimeShow'])
  },
  methods: {
    ...mapMutations(['OVERTIMESWITCH']),
    overtimeSwi() {
      this.OVERTIMESWITCH()
      this.$router.push({ path: '/login' })
    },
    reloadRou() {
      this.isRouter = false
      this.$nextTick(function() {
        this.isRouter = true
      })
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss">
#app {
  position: relative;

  .overtime {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background: rgba(7, 17, 27, 0.5);
    z-index: 10000;
    padding: 20% 20% 5%;
  }
}

</style>
