<template>
  <div class="hj-new-social-unit-device">
    <div style="position: fixed;width:100%;padding-bottom:10px;margin-right:-10px;margin-left: -10px;border-bottom:1rpx solid #ccc;margin-bottom: 10px;box-sizing:border-box;">
      <wux-steps :current="current">
        <wux-step title="添加社会单位"></wux-step>
        <wux-step title="添加设备"></wux-step>
        <wux-step title="完成添加"></wux-step>
      </wux-steps>
    </div>
    <!-- <div style="height: 72px"></div> -->
    <div style="height: 62px"></div>
    <form
      @submit="onFormSubmit"
      @reset="onReset"
    >
      <socialUnitDeviceForm
        ref="socialUnitDeviceForm"
        @scan-code="scanCode"
      ></socialUnitDeviceForm>

      <div class="hj-new-social-unit-device__btn__container">
        <!-- <button
          class="hj-new-social-unit-device__btn--reset"
          formType="reset"
          @click.stop="reset"
        >重置
        </button> -->
        <button
          class="hj-new-social-unit-device__btn--next"
          formType="submit"
          @click="next"
        > 下一步
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import socialUnitDeviceForm from "../components/social-unit-device-form.vue";
import isMounted from "@/mixins/isMounted.js";

export default {
  onShareAppMessage,
  onShow() {
    console.log(
      "new-social-unit-device onShow",
      this.$root.$mp.appOptions.query
    );
    console.log("hj-new-social-unit-device this.isMounted", this.isMounted);
    if (
      wx.getStorageSync("fromPage") == "newSocialUnit" &&
      wx.getStorageSync("isReset")
    ) {
      this.$root.$mp.appOptions.query.from = "newSocialUnit";
      // wx.setStorageSync("isReset", false);
    } else {
      this.$root.$mp.appOptions.query.from = "";
    }
    wx.setStorageSync("isReset", false);
    if (this.$root.$mp.appOptions.query.from == "newSocialUnit") {
      if (!this.isMounted) {
        return;
      }
      this.reset();
    }
  },
  onUnload() {
  },
  name: "hj-new-social-unit-device",
  components: { socialUnitDeviceForm },
  mixins: [isMounted],
  data() {
    return {
      isAuth: true,
      current: 1
      // isMounted: false
    };
  },
  computed: {},
  methods: {
    scanCode(e) {
      console.log("scanCode");
      this.$root.$mp.appOptions.query.from = "scan-code";
    },
    next() {
      this.$refs.socialUnitDeviceForm.validateAndGetFormData().then(res => {
        if (res) {
          wx.setStorageSync("socialUnitDeviceFormData", res);
          wx.navigateTo({ url: "/pages/me-package/new-finish/main" });
        }
      });
    },
    reset(e) {
      console.log("reset", e);
      this.$refs &&
        this.$refs.socialUnitDeviceForm &&
        this.$refs.socialUnitDeviceForm.reset();
    },
    onFormSubmit(e) {
      console.log("onFormSubmit", e);
    },
    onReset(e) {
      console.log("onReset", e);
    }
  },
  created() {},
  mounted() {
    console.log("newSocialUnitDevice mounted", this.isMounted);
    this.isMounted = true;
  }
};
</script>

<style lang="scss">
.hj-new-social-unit-device {
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;
  padding: 10px;
  background-color: #f4f7fb;
  &__btn {
    &__container {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
    }
    &--next {
      background-color: rgba(102, 120, 233, 1);
      color: #fff;
      width: 100%;
    }
    &--reset {
    }
  }
}
</style>
