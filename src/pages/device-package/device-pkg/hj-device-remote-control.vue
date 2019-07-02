<template>
  <div class="hj-device-remote-control">
    <div
      v-if="!isAuth"
      style="height:100%;width:100%;position:relative: z-index:11111;"
    >暂无权限查看</div>
    <div v-if='!hasControl' class='hj--title'>该设备不支持遥控.</div>
    <wux-row v-if="hasControl" wux-class="hj-device-remote-control__panel">
      <div class="hj-device-remote-control__panel__item">
        <img
          :src="monitorDisplay"
          alt=""
          style="height:36px;width: 36px;"
          mode="aspectFit"
        >
      </div>
      <div
        class="hj-device-remote-control__panel__item"
        v-for="(ctrBtn, index) in ctrBtns"
        :key="index"
        @click="implementAction(ctrBtn)"
        :style="{backgroundColor: ctrBtn.color}"
        style="border-radius:6px;color: #fff;"
      >
        <button
          size="mini"
          :style="{backgroundColor: ctrBtn.color}"
          style="border:none;color: #fff;height:100%;width:100%;border-radius:none;"
        >
          {{ctrBtn.name}}
        </button>
      </div>
    </wux-row>
  </div>
</template>
<script>
export default {
  name: "hj-device-remote-control",
  components: {},
  props: {
    id: {
      type: [String, Number],
      default: ""
    },
    deviceId: {
      type: [String, Number],
      default: ""
    },
    isAuth: {
      type: Boolean,
      default: true
    },
    queryUrl: {
      type: String,
      default: "" // socialUnitsDevicesRisks
    }
  },
  data() {
    var colorList = [
      "rgba(102,120,233,1)",
      "rgba(235,162,98,1)",
      "#E96666",
      "#2AA4DD",
      "#c0c05d",
      "#4e6392",
      "#9080a3",
      "#ffc09f"
    ];

    // var ctrBtns = Array.apply(null, { length > 0: 8 }).map((item, index) => {
    //   return {
    //     name: "name" + index,
    //     ident: "ident" + index,
    //     color: colorList[index]
    //   };
    // });

    var ctrBtns = [];
    return {
      monitorDisplay: "../../../static/images/common/remote_control_icon.png",
      colorList,
      ctrBtns,
      bordered: false,
      params: {}
    };
  },
  computed: {
    hasControl(){
      return this.ctrBtns.length > 0
    }
  },
  methods: {
    initData(params) {
      console.log("hj-device-remote-control initData params", params);
      Object.assign(this.params, params);
      // this.$http("paramSettings", params, { method: "get" })
      //   .then(res => {
      //     console.log("paramSettings", res.data);
      //   })
      //   .catch(res => {});

      this.$http("controlConfigFile", params, {
        method: "get"
      })
        .then(res => {
          console.log("control api response, ", res);
          if (!res.data) return
          try {
            var resData = JSON.parse(res.data || "");
            var controls =
              resData.controlAndSettings && resData.controlAndSettings.controls;
            this.setCtrBtns(this.getCtrBtns(controls));
          } catch (e) {
            console.error("json parse string error", e);
          }
        })
        .catch(res => {
          console.log("res", res);
        });
    },
    getCtrBtns(ctrs) {
      if (!ctrs || !Array.isArray(ctrs)) {
        console.log("ctrs is not array: ", ctrs);
        return [];
      }
      return ctrs.map((item, index) => {
        return {
          name: item.name,
          ident: item.ident,
          color: this.colorList[index]
        };
      });
    },
    setCtrBtns(ctrBtns) {
      if (!ctrBtns || !Array.isArray(ctrBtns)) {
        return;
      }
      // this.ctrBtns = [...ctrBtns, ...ctrBtns];
      this.ctrBtns = ctrBtns;
    },
    implementAction(ctrBtn) {
      var params = {
        commandName: ctrBtn.name,
        ident: ctrBtn.ident,
        ...this.params
      };
      console.log("implementAction params", params);
      this.$http("settingParamByIdent", params, { method: "put" })
        .then(res => {
          wx.showToast({
            title: ctrBtn.name + ": 成功",
            icon: "none",
            mask: true
          });
          console.log("settingParamByIdent", res);
        })
        .catch(res => {
          console.log("settingParamByIdent", res);
          wx.showToast({
            title: ctrBtn.name + ": 失败",
            icon: "none",
            mask: true
          });
        });
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
.hj-device-remote-control {
  box-sizing: border-box;
  min-width: 100%;
  margin-top: 10px;
  padding: 10px;
  &__panel {
    background: #fff;
    box-shadow: 0px 2px 16px 0px rgba(10, 57, 115, 0.18);
    border: 1rpx solid #ddd;
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    // justify-content: space-evenly;
    justify-content: start;
    padding: 10rpx;
    &__item {
      display: flex;
      flex-grow: 1;
      align-items: center;
      // padding-left: 15rpx;
      // padding-right: 15rpx;
      margin: 10rpx;
    }
    // height: 300px;
    // background: rgba(255, 255, 255, 1);
    &__left {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    &__right {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      &__btn {
        border-radius: 6px;
        color: #fff;
      }
    }
  }
}
</style>