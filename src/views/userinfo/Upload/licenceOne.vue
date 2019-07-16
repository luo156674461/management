<template>
  <div class="upload1">
    <div class="demo-upload-list" v-for="item in uploadList">
      <template v-if="item.status === 'finished'">
        <p>成功</p>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :format="['jpg','jpeg','png']" :max-size="2048" :before-upload="handleBeforeUpload" multiple type="drag" action="https://api2.bmob.cn/2/files/uploading" style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;" v-if="upShow">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  props: ['name'],
  data() {
    return {
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      upShow: true
    }
  },
  methods: {
   ...mapMutations(['GETLICENCEONE']),
    handleBeforeUpload(file) {
      this.upShow = false
      this.imgName = this.name + 'licence_1.jpg'
         // eslint-disable-next-line
      let fileimg = Bmob.File(this.imgName, file)
      fileimg.save().then(res => {
        res[0].percentage = this.$refs.upload.fileList.percentage
        res[0].showProgress = this.$refs.upload.fileList.showProgress
        res[0].status = 'finished'
        this.uploadList = res
        this.GETLICENCEONE(res[0].url)
      })
      const check = this.uploadList.length < 4
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList
  }
}

</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.ivu-upload-drag {
  border: none;
}

</style>
