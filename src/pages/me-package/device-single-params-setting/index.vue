<template>
  <div class="hj-device-single-params-setting">
    hj-device-single-params-setting
  </div>
</template>
<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";

export default {
  onShareAppMessage,
  onShow() {
    // if (this.isMounted) {
    //   this.reset();
    // }
  },
  name: "hj-device-single-params-setting",
  components: {},
  data() {
    return {
      isAuth: true,
      isMounted: false
    };
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="scss">
.hj-device-single-params-setting {
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;
  padding: 0px 10px 10px 10px;
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