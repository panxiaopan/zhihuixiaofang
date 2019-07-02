<template>
  <cover-view
    class="hj-map-panel"
    :class="hjClass"
    @click.stop="clickContainer"
  >
    <!-- <cover-view class="hj-map-panel__navigator">
      <cover-image
        v-if="navigator"
        :src="navigator"
        @click.stop="clickNavigator"
        style="width:48px;height: 48px;position:absolute;right:10px;top:24px;    z-index: 3;"
      ></cover-image>
    </cover-view> -->
    <cover-view
      class="hj-map-panel__hd"
      style="border-bottom:1rpx solid #ddd;"
    >
      <cover-view style="flex-grow:1;">
        <cover-view class="hj-map-panel__hd__title">
          {{labelConfig.titleLabel}} {{title}}

          <!-- <cover-view class="hj-map-panel__hd__title__label">
          {{labelConfig.titleLabel}} {{title}}
        </cover-view>

        <cover-view class="hj-map-panel__hd__title__icon">
        </cover-view> -->

          <!-- <cover-view class="hj-map-panel__hd__title__icon">
          <cover-image
            v-if="navigator"
            :src="navigator"
            style="width:48px;height: 48px;position:absolute;top:-50px;"
          ></cover-image>
        </cover-view> -->

        </cover-view>
        <!-- <cover-view>
          &nbsp;
        </cover-view> -->
        <cover-view class="hj-map-panel__hd__subtitle">
          {{labelConfig.subtitleLabel}} {{subtitle}}

          <!-- <cover-view style="width:100%;white-space: pre-line;">
            {{labelConfig.subtitleLabel}} {{subtitle}}
          </cover-view> -->
        </cover-view>
      </cover-view>

      <cover-image
        v-if="navigator"
        :src="navigator"
        @click.stop="clickNavigator"
        style="width:48px;height: 48px;flex-shrink:0;"
      ></cover-image>
    </cover-view>
    <cover-view class="hj-map-panel__bd">
      <cover-view class="hj-map-panel__bd__left">
        <cover-image
          v-if="bdLeftIcon"
          :src="bdLeftIcon"
          alt=""
          style="height:100%"
          mode="aspectFit"
        ></cover-image>
        <cover-view>&nbsp;</cover-view>
      </cover-view>
      <cover-view
        class="hj-map-panel__bd__right"
        v-if="bdRightContentList.length"
      >
        <cover-view
          v-for="content in bdRightContentList"
          :key="content.value"
        >
          {{content.label||''}}{{content.value}}
        </cover-view>
      </cover-view>
    </cover-view>
    <cover-view class="hj-map-panel__ft">
      <cover-image
        v-if="ftPreIcon"
        :src="ftPreIcon"
        alt="ftPreIcon"
        style="width:24px;height:24px;"
        class="hj-map-panel__ft__pre-icon"
      ></cover-image>
      <cover-view class="hj-map-panel__ft__content">
        {{ftContent}}
      </cover-view>
      <cover-image
        v-if="ftPostfixIcon"
        :src="ftPostfixIcon"
        alt="ftPostfixIcon"
        class="hj-map-panel__ft__postfix-icon"
        @click.stop="clickPostfixIcon"
        style="width: 48px;height:48px;"
      ></cover-image>
    </cover-view>
  </cover-view>
</template>
<script>
export default {
  name: "hj-map-panel",
  props: {
    navigator: {
      type: String,
      default: "../../static/images/common/navigator.png"
    },
    hjClass: {
      type: String,
      default: ""
    },
    labelConfig: {
      type: Object,
      default: () => ({
        titleLabel: "",
        // titleLabel: "社会单位：",
        subtitleLabel: "地址："
      })
    },
    id: {
      type: [String, Number],
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: ""
    },
    bdLeftIcon: {
      type: String,
      default: "../../static/images/common/socialUnitSampleImg.jpg"
    },
    bdRightContentList: {
      type: Array,
      default: () => [] // {label:'', vlaue: '', id: ''}
    },
    ftPreIcon: {
      type: String,
      default: ""
      // default: "../../static/images/common/me@2x.png"
    },
    ftPostfixIcon: {
      type: String,
      default: "../../static/images/common/phone_light@3x.png"
    },
    ftContent: {
      type: String,
      default: "ftContent"
    },
    extraInfo: {
      type: String,
      default: null
    }
    // navigateIcon: {
    //   type: String,
    //   default: "../../static/images/common/phone_light@3x.png"
    // }
  },
  data() {
    return {};
  },
  methods: {
    clickPostfixIcon(e) {
      console.log("clickPostfixIcon", this);
      this.$emit("click-postfix-icon", this.$options.propsData);
    },
    clickNavigator(e) {
      console.log("clickNavigator", e);
      this.$emit("click-navigator", this.$options.propsData);
    },
    clickContainer(e) {
      console.log("clickContainer", e);
      this.$emit("click-container", this.$options.propsData);
    }
  }
};
</script>
<style lang="scss">
.hj-map-panel {
  // margin: 10px;
  // padding: 10px 10px 0 10px;

  padding: 5px;
  background-color: #fff;
  box-sizing: border-box;
  // border: 1rpx solid #ddd;
  width: 100%;
  // text-indent: 10px;

  // &__navigator {
  //   position: relative;
  //   height: 48px;
  //   // transform: translateY(50%);
  //   z-index: 2;
  // }

  &__hd {
    padding: 5px 10px 5px 10px;
    // margin-top: 48px;
    // width: 100%;
    // background-color: #fff;
    border-bottom: 1rpx solid #ddd;
    display: flex;
    // flex-wrap: wrap;
    &__title {
      font-size: 15px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(49, 49, 49, 1);
    }

    // &__title {
    //   display: flex;
    //   justify-content: space-around;
    //   &__label {
    //     font-size: 15px;
    //     font-family: PingFang-SC-Bold;
    //     font-weight: bold;
    //     color: rgba(49, 49, 49, 1);
    //     flex-grow: 1;
    //     // line-height:2;
    //   }
    //   &__icon {
    //     width: 48px;
    //     // position: relative;
    //   }
    // }

    &__subtitle {
      font-size: 13px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(49, 49, 49, 1);
      line-height: 1.2;
      // overflow-wrap: break-word;
      // word-wrap: break-word;
      // word-break: break-all;
      white-space: pre-line; //pre-line
      transform: translateY(20rpx);
    }
  }
  &__bd {
    // background-color: #fff;
    padding: 5px 10px 5px 10px;
    // width: 100%;
    display: flex;
    border-bottom: 1rpx solid #ddd;
    &__left {
      width: 40vw;
      text-align: left;
      display: flex;
      justify-content: left;
    }
    &__right {
      width: 60vw;
      font-size: 14px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(49, 49, 49, 1);
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-evenly;
      &__item {
      }
    }
  }
  &__ft {
    // background-color: #fff;
    padding: 0px 10px 5px 10px;
    // width: 100%;
    padding: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__pre-icon {
      // vertical-align: middle;
    }
    &__content {
      // vertical-align: middle;
      font-size: 14px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(49, 49, 49, 1);
      flex-grow: 1;
    }
    &__postfix-icon {
      // vertical-align: middle;
      // align-self: end;
    }
  }
}
</style>