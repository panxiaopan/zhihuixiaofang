<template>
  <div>
    <mainIndex v-if="isMounted"></mainIndex>
    <wux-toptips id="wux-toptips1"></wux-toptips>
  </div>
</template>

<script>
import mainIndex from "./main-index.vue";
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import { $wuxToptips } from "@/utils/wux.js";
export default {
  onShareAppMessage,
  onShow() {
    console.log("complete info show");
    // if (wx.getStorageSync("appIsHide")) {
    //   wx.setStorageSync("appIsHide", false);
    //   return;
    // }
    // console.log("complete info show", this.isMounted);
    // if(!this.isMounted){
    // this.isMounted
    // }
  },
  onUnload() {
    console.log("complete info onUnload");
    this.isMounted = false;
  },
  components: {
    mainIndex
  },
  data() {
    return {
      isMounted: true
    };
  },
  methods: {
    initTooltip() {
      if (!this.$wuxToptips) {
        this.$wuxToptips = $wuxToptips("#wux-toptips1", this.$root.$mp.page);
      }
    }
  },
  mounted() {
    console.log("complete info mounted", this.isMounted);
    this.isMounted = true;
    this.initTooltip();
  }
};
</script>

<style lang="scss">
</style>
