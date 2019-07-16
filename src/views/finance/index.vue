<template>
  <div class="finance">
    <div class="option">
      <div class="client">
        <Button type="info" class="finBut" @click="goClient">客户</Button>
      </div>
      <div class="car">
        <Button type="success" class="finBut" @click="goCar">车辆</Button>
      </div>
      <div class="water">
        <Button type="warning" class="finBut" @click="goWater">流水</Button>
      </div>
      <div class="withdraw">
        <Button type="error" class="finBut" @click="goWithdraw">提现</Button>
      </div>
      <div class="withdraw">
        <Button type="error" class="finBut" @click="userRent">客户租金</Button>
      </div>
      <div class="withdraw">
        <Button type="error" class="finBut" @click="catRent">车辆租金</Button>
      </div>
    </div>
    <router-view class="finRouter"></router-view>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  created() {

  },
  mounted() {

  },
  updated() {

  },
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {
    ...mapMutations(['GAINTALLWEN']),
    // 客户
    goClient() {
      this.$router.push({ path: '/finance/client' })
      this.GAINTALLWEN(0)
      sessionStorage.setItem('key', JSON.stringify(0))
    },
    // 车辆
    goCar() {
      this.$router.push({ path: '/finance/vehicle' })
      this.GAINTALLWEN(1)
      sessionStorage.setItem('key', JSON.stringify(1))
    },
    // 流水
    goWater() {
      this.$router.push({ path: '/finance/running' })
      this.GAINTALLWEN(2)
      sessionStorage.setItem('key', JSON.stringify(2))
    },
    // 提现
    goWithdraw() {
      this.$router.push({ path: '/finance/deposit' })
      this.GAINTALLWEN(3)
      sessionStorage.setItem('key', JSON.stringify(3))
    },
    // 客户租金
    userRent() {
      this.$router.push({ path: '/finance/userrent' })
      this.GAINTALLWEN(4)
      sessionStorage.setItem('key', JSON.stringify(4))
    },
    // 车辆租金
    catRent() {
      this.$router.push({ path: '/finance/catrent' })
      this.GAINTALLWEN(5)
      sessionStorage.setItem('key', JSON.stringify(5))
    }
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
.finance {
  // position: relative;

  .option {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    text-align: center;

    .client {
      flex: 0 0 50%;
      height: 200px;
    }

    .car {
      flex: 0 0 50%;
      height: 200px;
    }

    .water {
      flex: 0 0 50%;
      height: 200px;
    }

    .withdraw {
      flex: 0 0 50%;
      height: 200px;
    }

    .finBut {
      margin-top: 8.5%;
      width: 50%;
      height: 50%;
      font-size: 20px;
    }
  }



  .finRouter {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
  }
}

</style>
