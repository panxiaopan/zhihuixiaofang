<template>
  <div
    class="hj-upload-image-form-item"
    :class="hjClass"
    :style="hjStyle"
  >
    <wux-upload
      style="width: 100%;"
      :fileList="fileList"
      name="attachments"
      :url="uploadUrl"
      list-type="picture-card"
      :size-type="sizeType"
      :source-type="sourceType"
      @success="onSuccess"
      @fail="onFail"
      @complete="onComplete"
      @change="onChange"
      @preview="onPreview"
      @remove="onRemove"
      @click="clickAdd"
    >
      <!-- list-type="text"
      list-type="picture-card" -->
      <wux-icon
        type="ios-add"
        @click="clickAdd"
      ></wux-icon>
    </wux-upload>
  </div>
</template>
<script>
import merge from "lodash/merge.js";
import isEqual from "lodash/isEqual.js";
import submitImage from "@/mixins/submitImage.js";
import difference from "lodash/difference.js";
import differenceWith from "lodash/differenceWith.js";
import API from '@/store/flyio/apiUrl/home.js';
export default {
  name: "hj-upload-image-form-item",
  mixins: [submitImage],
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    fileType: {
      type: String,
      requre: true,
      default: "" // efm-socialUnit
    },
    imageList: {
      type: Array,
      default: () => [] // [{url: '', name: ''}]
    },
    tipTile: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      fileList: [],
      remoteAttachments: [],
      newLocalAttachments: [],
      addedLocalAttachments: [],
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      // uploadUrl: 'https://www.skyvow.cn/api/common/file',
      // uploadUrl: "https://www.huajiecloud.com/efm-mp/workOrders"
      uploadUrl: API.workOrders
    };
  },
  watch: {
    imageList: {
      // immediate: true,
      handler(newVal, oldVal) {
        if (newVal && newVal.length) {
          this.fileList = newVal;
          // this.remoteAttachments = [];
          // this.newLocalAttachments = [];
          // this.addedLocalAttachments = [];
        } else {
          this.fileList = [];
        }
        this.remoteAttachments = [];
        this.newLocalAttachments = [];
        this.addedLocalAttachments = [];
      }
    }
  },
  methods: {
    clickAdd(e) {
      console.log("clickAdd", e);
      if (!this.$root.$mp.appOptions.query.from) {
        this.$root.$mp.appOptions.query.from = "addImage";
      }
    },
    onSuccess(e) {
      console.log("onSuccess", e);
    },
    onFail(e) {
      console.log("onFail", e);
    },
    onComplete(e) {
      console.log("onComplete", e);
      this.submitToServer();
    },
    onChange(e) {
      console.log("onChange", e);
      const { file, fileList } = e.mp.detail;
      // file
      // res :{statusCode: 200, data: "{"head":{"code":99998,"msg":"登陆已失效"}}", header: {…}, cookies: Array(0), errMsg: "uploadFile:ok"}
      // status :"done"
      // uid :"wux-upload--1546844348393-2"
      // url :"http://tmp/wxbc47483790762e40.o6zAJszqP_lXqu7XQSPXvd2xEvoA.arMHrBCsta5Q355ee4810185b0b7caa997cffbf0031e.jpg"

      if (!isEqual(this.fileList, fileList)) {
        this.fileList = fileList.map(item => {
          return merge({}, item);
          // return item;
        });
        // this.attachments = this.fileList.map(item => item.url);
      }
    },
    onPreview(e) {
      console.log("onPreview", e);
      if (!this.$root.$mp.appOptions.query.from) {
        this.$root.$mp.appOptions.query.from = "previewImage";
      }
      const { file, fileList } = e.mp.detail;
      wx.previewImage({
        current: file.url,
        urls: fileList.map(n => n.url)
      });
    },
    onRemove(e) {
      console.log("onRemove", e);

      const { file, fileList } = e.mp.detail;
      console.log(this.fileList === fileList);
      console.log(this.fileList);
      console.log("onRemove", e, fileList);
      this.fileList = fileList.map(item => item);
      // wx.showModal({
      //   content: '确定删除？',
      //   success: res => {
      //     if (res.confirm) {
      //       this.fileList = fileList.filter(n => n.uid !== file.uid);
      //     }
      //   }
      // });
    },
    // getUrlsDiffFileListFromImageList(){
    //   imageList fileList
    // },
    submitToServer() {
      return new Promise((resolve, reject) => {
        var newLocalAttachments = difference(
          this.fileList.map(item => item.url),
          this.imageList.map(item => item.url)
        );

        newLocalAttachments = difference(
          newLocalAttachments,
          this.addedLocalAttachments
        );

        if (newLocalAttachments && newLocalAttachments.length) {
          this.submitImages({
            uploadUrl: API.upload, 
            filePaths: newLocalAttachments,
            formData: {
              type: this.fileType
            }
          })
            .then(res => {
              console.log("upload image success res", res);
              var newRemoteAttachments = res
                .map(response => {
                  if (!response.head.code) {
                    return response.data;
                  } else {
                    return "";
                  }
                })
                .filter(f => !!f);

              // this.attachments = this.attachments.concat(newRemoteAttachments);
              this.remoteAttachments = [
                ...this.remoteAttachments,
                ...newRemoteAttachments
              ];
              this.addedLocalAttachments = [
                ...this.addedLocalAttachments,
                newLocalAttachments
              ];
              resolve(newRemoteAttachments);
            })
            .catch(res => {
              console.log("upload image faile res", res);
              showToast("upload image faile");
              this.fileList = differenceWith(
                this.fileList,
                newLocalAttachments.map(item => ({ url: item })),
                function(source, target) {
                  return source.url == target.url;
                }
              );
              reject(res);
            });
        } else {
          reject(false);
        }
      });
    },
    getAttachments() {
      return [...this.remoteAttachments];
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.hj-upload-image-form-item {
  margin-top: 10px;
}
</style>

