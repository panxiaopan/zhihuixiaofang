<template>
  <div class="hj-new-social-unit">
    <div style="position: fixed;width:100%;padding-bottom:10px;margin-right:-10px;margin-left: -10px;border-bottom:1rpx solid #ccc;margin-bottom: 10px;box-sizing:border-box;">
      <wux-steps :current="current">
        <wux-step title="添加社会单位"></wux-step>
        <wux-step title="添加设备"></wux-step>
        <wux-step title="完成添加"></wux-step>
      </wux-steps>
    </div>
    <div style="height: 62px"></div>
    <form
      @submit="onFormSubmit"
      @reset="onReset"
    >
      <socialUnitForm
        ref="socialUnitForm"
        @hj-choose-location="hjChooseLocation"
        v-if="current==0"
      >
      </socialUnitForm>
      <div class="hj-new-social-unit__btn__container">
        <!-- <button
          class="hj-new-social-unit__btn--reset"
          @click.stop="reset"
        >重置
        </button> -->
        <button
          class="hj-new-social-unit__btn--next"
          formType="submit"
          @click="next"
        >下一步
        </button>
      </div>
    </form>

    <!-- <div style="height:20px;"></div> -->
    <!-- <button @click="next">下一步</button> -->
  </div>
</template>

<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import socialUnitForm from "../components/social-unit-form.vue";
import isMounted from "@/mixins/isMounted.js";
export default {
  onShareAppMessage,
  onShow() {
    console.log(
      "new-social-unit this.isMounted onShow",
      this.isMounted,
      this.$root.$mp,
      this
    );
    console.log(
      "onShow new social unit this.$root.$mp.appOptions.query.from",
      this.$root.$mp.appOptions.query.from
    );

    if (wx.getStorageSync("isReset")) {
      // wx.setStorageSync("isReset", false);
      this.$root.$mp.appOptions.query.from = "socialUnitMng";
    } else {
      this.$root.$mp.appOptions.query.from = "";
    }

    wx.setStorageSync("isReset", false);

    if (this.$root.$mp.appOptions.query.from == "socialUnitMng") {
      if (!this.isMounted) {
        return;
      }
      this.reset();
    }
  },
  onUnload() {
  },
  onHide() {},
  name: "new-social-unit",
  components: {
    socialUnitForm
  },
  mixins: [isMounted],
  data() {
    return {
      isAuth: true,
      current: 0
      // isMounted: false
    };
  },
  computed: {},
  methods: {
    hjChooseLocation() {
      console.log("new social unit hjChooseLocation");
      this.$root.$mp.appOptions.query.from = "hjChooseLocation";
    },
    next(e) {
      console.log("next action", e);
      this.$refs.socialUnitForm.validateAndGetFormData().then(res => {
        if (res) {
          wx.setStorageSync("socialUnitFormData", res);
          if (wx.getStorageSync("fromPage") !== "newSocialUnitDeviceStep") {
            wx.setStorageSync("isReset", true);
          }
          wx.navigateTo({
            url: "/pages/me-package/new-social-unit-device-step/main"
          });
        }
      });
    },
    reset(e) {
      console.log("reset action", e);
      this.$refs &&
        this.$refs.socialUnitForm &&
        this.$refs.socialUnitForm.reset();
    },
    onFormSubmit(e) {
      console.log("on formSubmit", e);
    },
    onReset(e) {
      console.log("on reset", e);
    }
  },
  created() {},
  mounted() {
    console.log("newSocialUnit mounted", this.isMounted);
    // this.isMounted = true;
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
