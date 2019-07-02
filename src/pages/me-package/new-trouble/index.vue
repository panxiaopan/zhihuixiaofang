<template>
  <div class="hj-new-trouble">
    <!-- <wux-toptips id="wux-toptips2" /> -->
    <!-- <wux-white-space></wux-white-space> -->
    <hjForm
      :config="config"
      @confirm="confirm"
      :isReset="isReset"
      file-type="efm-risk"
    ></hjForm>
  </div>
</template>
<script>
import hjForm from "@/components/common/hj-form.vue";
// import { $wuxToptips } from '@/utils/wux.js';
import isEmpty from "lodash/isEmpty.js";
import submitImage from "@/mixins/submitImage.js";
// import { $wuxSelect, $wuxToptips} from '@/utils/wux.js';
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import wuxToptips from "@/mixins/wuxToptips.js";
import isMounted from "@/mixins/isMounted.js";
export default {
  onShareAppMessage,
  onShow() {
    console.log("onShow", this.$options.name, this);
    console.log(
      "wx.setStorageSync('appIsHide', true);",
      wx.getStorageSync("appIsHide")
    );
    if (this.isMounted) {
      if (this.$root.$mp.appOptions.query.from == "previewImage") {
        this.$root.$mp.appOptions.query.from = "";
        return;
      }
      if (this.$root.$mp.appOptions.query.from == "addImage") {
        this.$root.$mp.appOptions.query.from = "";
        return;
      }
      if (wx.getStorageSync("appIsHide")) {
        wx.setStorageSync("appIsHide", false);
        return;
      }
      this.isReset = true;

      // if (this.$root.$mp.appOptions.query.isReset) {
      //   this.$root.$mp.appOptions.query.isReset = false;
      //   this.isReset = true;
      // }
    }
  },
  onHide() {
    console.log("onHide", this.$options.name, this);
    this.isReset = false;
  },
  onUnload() {
    console.log("onUnload", this.$options.name);
    this.isReset = false;
  },
  name: "newTrouble",
  mixins: [submitImage, wuxToptips, isMounted],
  components: {
    hjForm
  },
  data() {
    return {
      config: {},
      isReset: false
    };
  },
  methods: {
    confirm(params) {
      console.log("params", params);
      var {
        socialUnitNameOption,
        deviceNameOption,
        dateTime: foundTime,
        description,
        attachments
      } = params;
      var socialUnitId = socialUnitNameOption.id;
      var deviceId = deviceNameOption.id;
      this.submit({
        attachments,
        description,
        socialUnitId,
        deviceId,
        foundTime
      });
    },
    submit(params) {
      //       参数名	必选	类型	说明
      // socialUnitId	是	int	关联社会单位ID
      // deviceId	是	int	关联设备ID
      // description	是	string	隐患描述
      // foundTime	否	date	隐患发现时间
      // attachments	否	file[]	附件列表
      // this.isReset = false;
      this.$http("reportArtificially", params)
        .then(res => {
          console.log("new trouble success res", res);
          this.wuxToptips(
            {
              text: "人工上报",
              success: ress => {
                console.log("ress", ress);
                // wx.switch({ url: '/pages/me/main' });
                // this.isReset = true;
                wx.navigateBack({ delta: -1 });
              }
            },
            res,
            // 'wux-toptips2',
            undefined,
            "success"
          );
        })
        .catch(res => {
          console.log("new trouble fail res", res);
          this.wuxToptips(
            {
              text: "人工上报",
              success: ress => {
                console.log("ress", ress);
                // wx.redirectTo({ url: '/pages/me/main' });
                // wx.navigateBack({ delta: -1 });
              }
            },
            res,
            undefined
          );
        });
    }
  },
  mounted() {
    // if (!this.isReset) {
    //   this.isReset = true;
    // }
    // this.config = {
    // }
    this.config = {
      socialUnitName: {
        show: true,
        require: true,
        value: "",
        disabled: false
      },
      deviceName: {
        show: true,
        require: true,
        value: "",
        disabled: false
      },
      title: {
        show: false
        // value: ''
      },
      dateTime: {
        show: true,
        require: true,
        value: this.$_dayjs().format("YYYY-MM-DD")
      },
      time: {
        show: true,
        require: true,
        value: this.$_dayjs().format("hh:mm")
      },
      description: {
        require: true,
        label: "添加隐患描述",
        message: "请输入隐患描述",
        // placeholder: '请输入工单描述',
        placeholder: "",
        value: ""
      },
      maintainers: {
        show: false
      }
    };
  }
};
</script>
<style lang="scss">
.hj-new-trouble {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  background-color: #f4f7fb;
  box-sizing: border-box;
  min-height: 100vh;
  // box-sizing: border-box;
}
</style>
