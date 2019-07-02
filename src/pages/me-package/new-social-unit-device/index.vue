<template>
  <div class="hj-new-social-unit-device">
    <!-- <div style="position: fixed;width:100%;padding-bottom:10px;margin-right:-10px;margin-left: -10px;border-bottom:1rpx solid #ccc;margin-bottom: 10px;box-sizing:border-box;">
      <wux-steps :current="current">
        <wux-step title="注册社会单位"></wux-step>
        <wux-step title="注册设备"></wux-step>
        <wux-step title="完成注册"></wux-step>
      </wux-steps>
    </div> -->
    <!-- <div style="height: 72px"></div> -->
    <!-- <div style="height: 62px"></div> -->
    <form
      @submit="onFormSubmit"
      @reset="onReset"
    >
      <socialUnitDeviceForm ref="socialUnitDeviceForm"></socialUnitDeviceForm>

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
          @click="confirm"
        > 确定
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import socialUnitDeviceForm from "../components/social-unit-device-form.vue";
export default {
  onShareAppMessage,
  onShow() {
    console.log("hj-new-social-unit-device-only onShow");
    if (this.isMounted) {
      this.reset();
    }
  },
  name: "hj-new-social-unit-device-only",
  components: { socialUnitDeviceForm },
  mixins: [],
  data() {
    return {
      isAuth: true,
      isMounted: false
      // current: 1,
    };
  },
  computed: {},
  methods: {
    confirm() {
      this.$refs.socialUnitDeviceForm.validateAndGetFormData().then(res => {
        console.log("confirm", res);
        if (res) {
          this.addDevice(res);
        }
      });
    },
    addDevice(data) {
      var params = { ...data, id: this.$root.$mp.query.id };
      console.log("addDevice", params);
      this.$http("addSocialUnitsDevice", params, {})
        .then(res => {
          console.log("addSocialUnitsDevice success", res);
          wx.showToast({
            title: "添加设备成功",
            icon: "none",
            mask: true,
            duration: 3000,
            complete: ()=> {
              this.$root.$mp.appOptions.query.from = "newSocialUnitDevice";
              wx.navigateBack({ delta: 1 });
            }
          });
        })
        .catch(e => {
          console.log("addSocialUnitsDevice e", e);
        });
    },
    reset(e) {
      console.log("reset", e);
      this.$refs &&
        this.$refs.socialUnitForm &&
        this.$refs.socialUnitForm.reset();
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
    console.log("hj-new-social-unit-device-only mounted");
    this.isMounted = true;
    this.reset();
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
