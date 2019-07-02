<template>
  <div class="hj-edit-social-unit-device">
    <wux-tabs
      class="hj-edit-social-unit-device__tabs"
      wux-class="hj-edit-social-unit-device--bordered"
      :auto="auto"
      :current="current"
      theme="royal"
      @change="onTabsChange"
    >
      <block v-for="item in tabs" :key="item.key">
        <wux-tab :key="item.key" :title="item.title"></wux-tab>
      </block>
    </wux-tabs>

    <swiper
      :current="currentIndex"
      @change="onSwiperChange"
      class="hj-edit-social-unit-device__swiper"
    >
      <div v-for="tab in tabs" :key="tab.key">
        <swiper-item class="hj-edit-social-unit-device__swiper__item">
          <div v-if="tab.key=='baseProperty'">
            <form @submit="onFormSubmit" @reset="onReset">
              <socialUnitDeviceForm
                ref="socialUnitDeviceForm"
                @form-ready="formReady"
                :isShowRegistCode="true"
                :showId="showId"
                :hj-style="'padding-left:10px;padding-right:10px;'"
              ></socialUnitDeviceForm>

              <div class="hj-edit-social-unit-device__btn__container">
                <!-- <button
                  class="hj-edit-social-unit-device__btn--reset"
                  formType="reset"
                  @click.stop="reset"
                >重置
                </button>-->
                <button
                  class="hj-edit-social-unit-device__btn--next"
                  formType="submit"
                  @click="modify"
                >修改</button>
              </div>
            </form>
          </div>

          <scroll-view
            v-if="tab.key=='paramsSetting'"
            scroll-y
            style="box-sizing: border-box;height:calc(100vh - 50px);"
          >
            <deviceParamsSetting
              :list="fireSettingList"
              @click-cell="clickCell($event, 'fireSetting')"
              title="消防设置"
            ></deviceParamsSetting>
            <deviceParamsSetting
              :list="basicSettingList"
              @click-cell="clickCell($event, 'basicSetting')"
              title="基本设置"
            ></deviceParamsSetting>
            <deviceParamsSetting
              :list="commSettingList"
              @click-cell="clickCell($event, 'commSetting')"
              title="通信设置"
            ></deviceParamsSetting>

            <div
              size="mini"
              :animation="animationData"
              @click.stop="queryParamSettings('put')"
              style="position:fixed;top:10px;right:10px;background-color: #6677e9;border-radius:12px;width:24px;height:24px;text-align:center;"
            >
              <!-- <div :class="freshClass"> -->
              <wux-icon type="ios-refresh" size="24" color="#fff" style="width:24px;height:24px;"></wux-icon>
              <!-- </div> -->
            </div>
          </scroll-view>
        </swiper-item>
      </div>
    </swiper>
  </div>
</template>
<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import socialUnitDeviceForm from "../components/social-unit-device-form.vue";
import isEqual from "lodash/isEqual.js";
import deviceParamsSetting from "../components/device-params-setting.vue";
import cloneDeep from "lodash/cloneDeep.js";
export default {
  onShareAppMessage,
  onShow() {
    // if (this.isMounted) {
    //   this.reset();
    // }
  },
  name: "edit-social-unit-device",
  components: {
    socialUnitDeviceForm,
    deviceParamsSetting
  },
  data() {
    var animation = wx.createAnimation({ duration: 500, delay: 0 });
    return {
      animationData: animation.export(),
      animation: animation,
      freshClass: "",
      isAuth: true,
      isMounted: false,
      auto: false,
      current: "baseProperty",
      currentIndex: 0,
      showId: true,
      tabs: [
        {
          key: "baseProperty",
          title: "基本属性"
        },
        {
          key: "paramsSetting",
          title: "参数设置"
        }
      ],
      query: {
        id: "",
        deviceId: ""
      },
      fireSettingList: [],
      basicSettingList: [],
      commSettingList: []
    };
  },
  methods: {
    rotating() {
      if (!this.animation) {
        this.animation = wx.createAnimation({ duration: 500, delay: 0 });
      }
      this.animation.rotate(360).step();
      this.animationData = this.animation.export();
    },
    rotate(isStart) {
      if (isStart) {
        // 旋转
        this.rotating();
        this.timer = setInterval(() => {
          this.rotating();
        }, 600);
      } else {
        clearInterval(this.timer);
        this.timer = null;
        // var animation = wx.createAnimation({ duration: 1000 });
        // this.animationData = {};
      }
    },
    onTabsChange(e) {
      console.log("onTabsChange", e);
      // this.$root.$mp.appOptions.query.from = e.mp.detail.key;
      const { key } = e.mp.detail;
      const index = this.tabs.map(n => n.key).indexOf(key);
      this.current = key;
      this.currentIndex = index;
    },
    onSwiperChange(e) {
      console.log("onSwiperChange", e);
      const { current: index, source } = e.mp.detail;
      const { key } = this.tabs[index];
      if (!!source) {
        this.current = key;
        this.currentIndex = index;
      }
    },
    onFormSubmit() {},
    onReset() {},
    reset() {
      this.initFormData();
    },
    modify() {
      this.$refs.socialUnitDeviceForm[0].validateAndGetFormData().then(res => {
        this.queryModify({ ...res, ...this.query });
      });
    },
    // clickFireSetting(li) {
    //   console.log("clickFireSetting", li);
    //   wx.navigateTo({
    //     url:
    //       "/pages/me-package/device-fire-params-setting/main?paramType=fireSetting&ident=" +
    //       li.ident +
    //       "&id=" +
    //       this.query.id +
    //       "&deviceId=" +
    //       this.deviceId
    //   });
    // },
    clickCell(li, paramType) {
      // fireSetting
      // basicSetting
      // commSetting
      console.log("clickCell", li);
      wx.navigateTo({
        url:
          // "/pages/me-package/device-single-params-setting/main?paramType=" +
          "/pages/me-package/device-fire-params-setting/main?paramType=" +
          paramType +
          "&ident=" +
          li.ident +
          "&id=" +
          this.query.id +
          "&deviceId=" +
          this.query.deviceId
      });
    },
    queryModify(params) {
      this.$http("deleteSocialUnitsDevice", params, { method: "put" })
        .then(res => {
          console.log("deleteSocialUnitsDevice modify success", res);
          wx.showToast({
            title: "修改成功",
            icon: "none",
            mask: true,
            duration: 3000,
            complete: () => {
              this.$root.$mp.appOptions.query.from = "editSocialUnitDevice";
              wx.navigateBack({ delta: 1 });
            }
          });
        })
        .catch(res => {
          console.log("deleteSocialUnitsDevice modify fail", res);
        });
    },
    formReady() {
      this.socialUnitDeviceFormIsReady = true;
      this.initFormData();
    },
    initFormData() {
      console.log("initFormData", this.$refs);
      var socialUnitDeviceInfo = wx.getStorageSync("socialUnitDeviceInfo");
      if (socialUnitDeviceInfo) {
        this.$refs.socialUnitDeviceForm[0] &&
          this.$refs.socialUnitDeviceForm[0].setData &&
          this.$refs.socialUnitDeviceForm[0].setData(socialUnitDeviceInfo);
      }
    },
    queryParamSettings(method) {
      method = method || "get"; // put 为刷新
      if (method == "put") {
        // this.freshClass = "hj-edit-social-unit-device--rotate";
        this.rotate(true);
      }
      this.$http("paramSettings", { ...this.query }, { method: method }).then(
        res => {
          console.log("paramSettings", res);

          if (method == "put") {
            // this.freshClass = "";
            this.queryParamSettings("get");
            return;
          }
          if (method == "get") {
            this.rotate(false);
            // setTimeout(() => {
            //   console.error("setTimeout");
            //   this.rotate(false);
            // }, 5000);
          }
          var deviceParamsDataMap = {};
          res.data.forEach(item => {
            deviceParamsDataMap[item.ident] = item;
          });

          wx.setStorageSync("deviceParamsDataMap", deviceParamsDataMap);
          ["fireSetting", "basicSetting", "commSetting"].forEach(key => {
            // ["fireSetting", "basicSetting"].forEach(key => {
            this[key + "List"] = this[
              "temp" + key.charAt(0).toUpperCase() + key.slice(1) + "List"
            ].map(item => {
              var mapedItem = deviceParamsDataMap[item.ident];
              if (mapedItem && mapedItem.data) {
                item.data = item.unit
                  ? mapedItem.data + " " + item.unit
                  : mapedItem.data;
              }
              return { ...item };
            });
          });
        },
        res => {
          if (method == "get") {
            // this.freshClass = "";
            console.error("catch?");
            this.rotate(false);
          }
        }
      );
      // .finally(() => {
      //   if (method == "put") {
      //     this.freshClass = "";
      //   }
      // });
    },
    queryConfigInfo() {
      console.log("queryConfigInfo", this.query);

      this.$http(
        "controlConfigFile",
        { ...this.query },
        { method: "get" }
      ).then(res => {
        console.log("queryConfigInfo res", res);
        try {
          var dataStr = res.data.replace(/("|')/g, '\\"');
          console.log("dataStr", dataStr);
          console.log("res.data params Json", res.data);
          var data = JSON.parse(res.data);
          console.log("json data", data);
          var controlAndSettings = data.controlAndSettings;
          var settings = controlAndSettings.settings;
          var configInfoMap = {};

          this.fireSetting = settings.fireSetting || [];
          this.basicSetting = settings.basicSetting || [];
          this.commSetting = settings.commSetting || [];

          this.tempFireSettingList = settings.fireSetting.map(item => {
            configInfoMap[item.ident] = item;
            return {
              name: item.name,
              ident: item.ident,
              unit: item.unit ? item.unit : "",
              isLink: true,
              // paramType: "fireSetting",
              data: ""
            };
          });
          this.tempBasicSettingList = settings.basicSetting.map(item => {
            configInfoMap[item.ident] = item;
            return {
              name: item.name,
              ident: item.ident,
              unit: item.unit ? item.unit : "",
              isLink: true,
              // paramType: "basicSetting",
              data: ""
            };
          });
          this.tempCommSettingList = settings.commSetting.map(item => {
            configInfoMap[item.ident] = item;
            return {
              name: item.name,
              ident: item.ident,
              unit: item.unit ? item.unit : "",
              isLink: true,
              // paramType: "commSetting",
              data: ""
            };
          });
          wx.setStorageSync("configInfoMap", configInfoMap);
          this.queryParamSettings("get");
        } catch (e) {
          console.error("JSON parse fail");
        }
      });
    }
  },
  mounted() {
    console.log("edit-social-unit-device mounted", this.isMounted);
    var query = this.$root.$mp.query;
    if (!this.isMounted) {
      this.query = { id: query.id, deviceId: query.deviceId };
      this.isMounted = true;
    } else if (!isEqual(this.query, this.$root.$mp.query)) {
      this.query = { id: query.id, deviceId: query.deviceId };
    }

    wx.setNavigationBarTitle({
      title: query.deviceName
    });

    this.queryConfigInfo();
    console.log("--判断类型--");
    console.log(this.$root.$mp.query.devicetype);
    if (
      //是电气火灾的时候就显示id 不是的时候不显示
      this.$root.$mp.query.devicetype == "ELECTRICAL_FIRE_MONITORING_DETECTOR"
    ) {
      this.showId = true;
    } else {
      this.showId = false;
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang="scss">
@keyframes hjRotating {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.hj-edit-social-unit-device {
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;
  // padding: 0px 10px 10px 10px;
  background-color: #f4f7fb;

  &--rotate {
    animation: hjRotating 1.2 linear infinite;
  }

  &__btn {
    &__container {
      margin-top: 40px;
      display: flex;
      justify-content: space-around;
      padding-left: 10px;
      padding-right: 10px;
    }
    &--next {
      background-color: rgba(102, 120, 233, 1);
      color: #fff;
      width: 100%;
    }
    &--reset {
    }
  }

  &__tabs {
    width: 100%;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    position: fixed;
    // top: -10px;
    z-index: 2;
    box-sizing: border-box;
    // margin-top: -10px;
    // margin-left: -10px;
    // margin-right: -10px;
  }

  &--bordered {
    // width: 100%;
    bottom: 1rpx solid #ddd;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    // margin-left: -10px;
    // margin-right: -10px;
  }

  &__swiper {
    position: relative;
    height: calc(100vh - 50px);
    // height: inherit;
    top: 50px;
    background-color: #f4f7fb;
    overflow: hidden;
    &__item {
      &__content {
        // padding-left: 100px;
        // padding-right: 10px;
        // box-sizing: border-box;
        // width: 100%;
      }
    }
  }
}
</style>