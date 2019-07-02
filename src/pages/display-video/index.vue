<template>
  <div class="hj-display-video">
    <!-- <video
      id="myVideo"
      src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
      :danmu-list="danmuList"
      enable-danmu
      danmu-btn
      controls
    ></video> -->

    <txv-video
      v-if="vid"
      :vid="vid"
      playerid="txv1"
      :width="width"
      :height="height"
      autoplay
      controls
    >
      <cover-view class='txv-video-slot'>华杰智慧消防云</cover-view>
    </txv-video>
  </div>
</template>

<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
export default {
  name: "hj-display-video",
  onShareAppMessage,
  onShow() {
    if (wx.getStorageSync("appIsHide")) {
      wx.setStorageSync("appIsHide", false);
      return;
    }
  },
  components: {},
  data() {
    return {
      vid: "x0854l5fctb",
      width: "auto",
      height: "100%"
      // danmuList: [
      //   {
      //     text: "第 1s 出现的弹幕",
      //     color: "#ff0000",
      //     time: 1
      //   },
      //   {
      //     text: "第 3s 出现的弹幕",
      //     color: "#ff00ff",
      //     time: 3
      //   }
      // ]
    };
  },
  methods: {},
  mounted() {
    console.log("this.vid", this, this.$root.$mp.query.vid);
    if (this.$root.$mp.query.vid) {
      this.vid = "";
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.vid = this.$root.$mp.query.vid;
        });
      });
    }
  }
};
</script>

<style lang="scss">
.hj-display-video {
  width: 100vw;
  height: 100vh;
  background: rgba(244, 247, 254, 1);
  // padding: 10px;
  box-sizing: border-box;
}
</style>
