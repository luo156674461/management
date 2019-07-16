<template>
  <div class="homepage">
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  created() {
    this.OFFGAINTALLONE()
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
    ...mapState(['mass'])
  },
  methods: {
    ...mapMutations(['GAINMASS', 'OFFGAINTALLONE'])
  },
  components: {}
}

</script>
<style rel="stylesheet/scss" lang="scss">
</style>
