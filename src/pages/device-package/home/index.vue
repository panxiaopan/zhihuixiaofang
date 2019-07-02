<template>
  <div class="hj-device-pakage">
    <wux-tabs
      class="hj-device-pakage__tabs"
      wux-class="hj-device-pakage__tabs"
      theme="royal"
      controlled='true'
      :default-current="tab"
      :current="tab"
      :auto="false"
      @change="changeTab"
    >
      <wux-tab v-for="t in tabs" :key="t.key" :title="t.title"></wux-tab>
    </wux-tabs>
    <div class="hj-device-pakage__placeholder"></div>
    <hjDeviceSummary v-if="deviceType=='ELECTRICAL_FIRE_MONITORING_DETECTOR'" ref="summary_ELECTRICAL_FIRE_MONITORING_DETECTOR" v-bind="deviceParams"></hjDeviceSummary>
    <hjSmokerSummary v-if="deviceType=='SMOKE_DETECTOR'" ref="summary_SMOKE_DETECTOR" v-bind="deviceParams"></hjSmokerSummary>
    <hjDeviceTrouble v-if="tab=='trouble'" ref="trouble" v-bind="troubleProps"></hjDeviceTrouble>
    <hjDeviceAssignment v-if="tab=='assignment'" ref="assignment" v-bind="deviceParams"></hjDeviceAssignment>
    <hjDeviceRemoteControl v-if="tab=='remoteControl'" ref="remoteControl" v-bind="deviceParams"></hjDeviceRemoteControl>
    <wux-white-space></wux-white-space>
  </div>
</template>
<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import hjDeviceSummary from "../device-pkg/hj-device-summary.vue";
import hjSmokerSummary from "../device-pkg/hj-smoke-detector-summary.vue";
import hjDeviceTrouble from "../device-pkg/hj-device-trouble.vue";
import hjDeviceAssignment from "../device-pkg/hj-device-assignment.vue";
import hjDeviceRemoteControl from "../device-pkg/hj-device-remote-control.vue";
export default {
  onShareAppMessage,
  name: "hj-device-pakage",
  components: {
    hjDeviceSummary,
    hjSmokerSummary,
    hjDeviceTrouble,
    hjDeviceAssignment,
    hjDeviceRemoteControl
  },
  data() {
    return {
      tab: "summary",
      tabs: [
        {
          key: "summary",
          title: "概述"
        },

        {
          key: "trouble",
          title: "隐患"
        },
        {
          key: "assignment",
          title: "工单"
        },
        {
          key: "remoteControl",
          title: "遥控"
        }
      ],
      deviceParams: {
        deviceId: "",
        deviceType: "",
        id: "",
        deviceName: "",
        socialUnitName: ""
      }
    };
  },
  computed: {
    deviceType(){
      if (this.tab == 'none') return 'none'
      if (this.tab.indexOf('summary') < 0){
        return 'none'
      }
      return this.deviceParams.deviceType
    },
    troubleProps() {
      return {
        deviceId: this.deviceParams.deviceId,
        id: this.deviceParams.id,
        deviceName: this.deviceParams.deviceName,
        socialUnitName: this.deviceParams.socialUnitName,
        isAuth: true, // this.$store.dispatch("isAuth", "mp_risk_group") // 通过 store方法返回对应的权限许可
        queryUrl: "socialUnitsDevicesRisks"
      };
    }
  },
  methods: {
    changeTab(e) {

      console.log("changeTab", e);
      this.tab = e.mp.detail.key;
      if (this.tab == 'summary'){
        this.tab = 'summary_' + this.deviceParams.deviceType
      }

      wx.nextTick(() => {
        this.$nextTick(() => {
          console.log(
            "this.$refs[this.tab]",
            this.$refs,
            this.tab,
            this.$refs[this.tab]
          );
          if (this.$refs[this.tab]) {
            this.$refs[this.tab].initData({
              id: this.$mp.query.id,
              deviceId: this.$mp.query.deviceId
            });
          }
        });
      });
    },
    mountedAction() {
      console.log("mounted", this.$options.name);
      console.log(
        "social unit ",
        this,
        this.$root.$mp.page.route,
        this.$mp.page.route
      ); 
      // pages/social-unit-package/homes/main
      console.log("this.$root.$mp.page.query", this.$mp.query);
      if (this.$mp.query.name) {
        wx.setNavigationBarTitle({
          title: this.$mp.query.name
        });
        this.deviceParams.deviceName = this.$mp.query.name;
        this.$mp.query.name = "";
      }
      if (this.$mp.query.currentTab) {
        this.tab = this.$mp.query.currentTab;
        this.$mp.query.currentTab = "";
      }

      if (this.$mp.query.id) {
        this.deviceParams.id = this.$mp.query.id;
      }
      if (this.$mp.query.deviceId) {
        this.deviceParams.deviceId = this.$mp.query.deviceId;
      }
      if (this.$mp.query.deviceType) {
        this.deviceParams.deviceType = this.$mp.query.deviceType;
      }
      if (this.$mp.query.socialUnitName) {
        this.deviceParams.socialUnitName = this.$mp.query.socialUnitName;
        this.$mp.query.socialUnitName = "";
      }
      console.log('deviceParams: ', this.deviceParams)

      if (this.tab == 'summary'){
        this.tab = 'summary_' + this.deviceParams.deviceType
      }

      wx.nextTick(() => {
        if (this.$refs[this.tab]) {
          this.$refs[this.tab].initData({
            id: this.$mp.query.id,
            deviceId: this.$mp.query.deviceId
          });
        }
      });
    }
  },
  mounted() {
    this.mountedAction();
  },
  onUnload(){
    this.tab = 'none'
    console.log('device detail onUnload')
  }
};
</script>
<style lang="scss">
.hj-rhombus-icon {
  display: inline-block;
  width: 11px;
  height: 11px;
  background-color: rgba(243, 134, 81, 1);
  transform: rotate(45deg);
}
.hj--title {
  width: 100%;
  text-indent: 10px;
  font-size: 16px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(49, 49, 49, 1);
}
.hj-device-pakage {
  // padding: 12px 12px 45px 12px;
  background-color: #f4f7fb;
  font-family: PingFang-SC-Medium;
  // width: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: start;
  min-width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  &__placeholder {
    height: 48px;
  }
  &__tabs {
    width: 100%;
    position: fixed;
    z-index: 3;
  }
}
</style>
