<template>
  <div class="hj-edit-social-unit">
    <wux-tabs
      class="hj-edit-social-unit__tabs"
      wux-class="hj-edit-social-unit--bordered"
      :auto="auto"
      :current="current"
      controlled='true'
      theme="royal"
      @change="onTabsChange"
    >
      <block
        v-for="item in tabs"
        :key="item.key"
      >
        <wux-tab
          :key="item.key"
          :title="item.title"
        ></wux-tab>
      </block>
    </wux-tabs>

    <!-- <swiper
      :current="currentIndex"
      @change="onSwiperChange"
      class="hj-edit-social-unit__swiper"
    >
      <div
        v-for="tab in tabs"
        :key="tab.key"
      >
        <swiper-item class="hj-edit-social-unit__swiper__item">
          <view class="hj-edit-social-unit__content">

            <editSocialUnitForm
              v-if="tab.key=='baseProperty'"
              ref="editSocialUnitForm"
            ></editSocialUnitForm>
            <socialUnitDeviceMng
              v-if="tab.key=='deviceMng'"
              ref="socialUnitDeviceMng"
              @touchstart="touchstart"
              @touchend="touchend"
            ></socialUnitDeviceMng>
          </view>
        </swiper-item>
      </div>
    </swiper> -->
    <!-- <wux-dialog id="wux-dialog--alert" /> -->
    <div style="height:48px;"></div>
    <editSocialUnitForm v-if="current=='baseProperty'"></editSocialUnitForm>
    <socialUnitDeviceMng
      ref="socialUnitDeviceMng"
      v-if="current=='deviceMng'"
    ></socialUnitDeviceMng>
  </div>
</template>

<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import editSocialUnitForm from "../components/edit-social-unit-form.vue";
import socialUnitDeviceMng from "../components/social-unit-device-mng.vue";
export default {
  onShareAppMessage,
  onShow() {
    console.log("onShow");
    if (this.isMounted) {
    }
  },
  onUnload() {
    // this.$root.$mp.appOptions.query.from = "editSocialUnit";
  },
  name: "hj-edit-social-unit",
  components: {
    editSocialUnitForm,
    socialUnitDeviceMng
  },
  mixins: [],
  data() {
    return {
      isAuth: true,
      isMounted: false,
      auto: false,
      current: "deviceMng",
      tabs: [
        {
          key: "baseProperty",
          title: "基本属性"
        },
        {
          key: "deviceMng",
          title: "设备管理"
        }
      ]
    };
  },
  computed: {},
  methods: {
    onTabsChange(e) {
      console.log("onTabsChange", e);
      // this.$root.$mp.appOptions.query.from = e.mp.detail.key;
      const { key } = e.mp.detail;
      const index = this.tabs.map(n => n.key).indexOf(key);
      this.current = key;
      if (this.current == "deviceMng") {
        this.$nextTick(() => {
          wx.nextTick(() => {
            this.$refs.socialUnitDeviceMng.setShowPop(false);
          });
        });
      }
    }
    // onSwiperChange(e) {
    //   console.log("onSwiperChange", e);
    //   const { current: index, source } = e.mp.detail;
    //   const { key } = this.tabs[index];
    //   if (!!source) {
    //     this.current = key;
    //     this.currentIndex = index;
    //   }
    // }
  },
  created() {},
  mounted() {
    console.log("edit social unit mounted", this);
    this.isMounted = true;
  }
};
</script>

<style lang="scss">
.hj-edit-social-unit {
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;
  padding: 0px 10px 10px 10px;
  background-color: #f4f7fb;
  &__tabs {
    width: 100%;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    position: fixed;
    z-index: 2;
    box-sizing: border-box;
    margin-left: -10px;
    margin-right: -10px;
  }
  &--bordered {
    // width: 100%;
    bottom: 1rpx solid #ddd;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    // margin-left: -10px;
    // margin-right: -10px;
  }
  &__content {
    // min-height: 100vh;
    margin-top: -20px;
    padding: 10px;
  }
  &__swiper {
    position: relative;
    height: calc(100vh - 50px);
    // height: inherit;
    top: 50px;
    background-color: #f4f7fb;
    overflow: hidden;
    &__item {
      // height: auto !important;
      // overflow: visible !important;
    }
  }
}
</style>
