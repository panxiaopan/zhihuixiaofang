<template>
  <div class="hj-new-social-unit">
    <!-- <wux-toast id="wux-toast" /> -->
    <div style="position: fixed;width:100%;padding-bottom:10px;margin-right:-10px;margin-left: -10px;border-bottom:1rpx solid #ccc;margin-bottom: 10px;box-sizing:border-box;">
      <wux-steps :current="current">
        <wux-step title="添加社会单位"></wux-step>
        <wux-step title="添加设备"></wux-step>
        <wux-step title="完成添加"></wux-step>
      </wux-steps>
    </div>
    <div style="height: 62px"></div>
    <div style="height:20px;"></div>
    <button @click="registerSocialUnit">添加</button>
  </div>
</template>

<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import isMounted from "@/mixins/isMounted.js";
// import { $wuxToast } from "@/utils/wux.js";
export default {
  onShareAppMessage,
  onShow() {
    console.log("onShow");
    console.log("new-social-unit isMounted", this.isMounted);
  },
  name: "new-social-unit",
  components: {},
  mixins: [isMounted],
  data() {
    return {
      isAuth: true,
      current: 2
    };
  },
  computed: {},
  methods: {
    registerSocialUnit() {
      var socialUnitFormData = wx.getStorageSync("socialUnitFormData");
      var socialUnitDeviceFormData = wx.getStorageSync(
        "socialUnitDeviceFormData"
      );
      console.log(
        "socialUnitFormData socialUnitDeviceFormData",
        socialUnitFormData,
        socialUnitDeviceFormData
      );
      if (socialUnitFormData && socialUnitDeviceFormData) {
        //         参数名	必选	类型	说明
        // registCode	是	string	注册码
        // name	是	string	社会单位名称
        // areaId	是	long	区域ID，城镇ID
        // latitude	是	float	纬度
        // longitude	是	float	经度
        // addrjson	是	string	json格式地址
        // industry	是	int	所属行业
        // safetyManName	是	string	安全责任人姓名
        // safetyManTel	是	string	安全责任人电话
        // deviceName	是	string	设备名称
        // deviceClassId	是	string	设备类型
        // deviceBrandId	是	int	设备品牌
        // deviceTypeId	是	int	设备型号
        // commId	是	int	通信ID，默认为1
        // location	是	string	设备位置
        // mainCircuitCurrent	是	float	电流互感器规格，100、200等
        this.$http(
          "socialUnitsDetailList",
          {
            ...socialUnitFormData,
            ...socialUnitDeviceFormData
          },
          {}
        )
          .then(res => {
            console.log("socialUnitsDetailList success", res);
            // wx.navigateTo({ url: "/pages/me-package/social-unit-mng/main" });
            wx.setStorageSync("socialUnitFormData", false);
            wx.setStorageSync("socialUnitDeviceFormData", false);
            wx.hideLoading();
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.timer = setTimeout(() => {
              wx.showToast({
                title: "注册成功",
                icon: "success",
                mask: true,
                duration: 3000,
                complete: () => {
                  wx.setStorageSync("fromPage", "newFinish");
                  wx.navigateBack({ delta: 3 });
                }
              });
            }, 1000);
          })
          .catch(res => {
            console.log("socialUnitsDetailList catch", res);
            var title =
              res.head && res.head.msg
                ? "注册失败：" + res.head.msg
                : "注册失败";

            wx.hideLoading();
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.timer = setTimeout(() => {
              wx.showToast({
                title,
                icon: "none",
                mask: true,
                duration: 3000,
                complete: () => {
                  // wx.navigateBack({ delta: 3 });
                }
              });
            }, 1000);
          });
      }
    },
    back() {
      // wx.navigateTo({ url: "/pages/me-package/social-unit-mng/main" });
      wx.navigateBack({
        delta: 3
      });
    }
  },
  created() {},
  mounted() {
    console.log("new finish mounted");
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style lang="scss">
.hj-new-social-unit {
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;
  padding: 10px;
  background-color: #f4f7fb;
}
</style>
