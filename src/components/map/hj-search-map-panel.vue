<template>
  <div
    class="hj-map-panel"
    :class="hjClass"
    @click.stop="click"
  >
    <div class="hj-map-panel__hd">
      <div class="hj-map-panel__hd__title">
        {{labelConfig.titleLabel}} {{title}}
      </div>
      <div class="hj-map-panel__hd__subtitle">
        {{labelConfig.subtitleLabel}} {{subtitle}}
      </div>
    </div>
    <div class="hj-map-panel__bd">
      <div class="hj-map-panel__bd__left">
        <img
          :src="bdLeftIcon"
          alt=""
          style="width:100px;height:100px;"
          mode="aspectFit"
        >
      </div>
      <div class="hj-map-panel__bd__right">
        <div
          v-if="bdRightContentList.length"
          v-for="content in bdRightContentList"
          :key="content.value"
        >
          {{content.label||''}}{{content.value}}
        </div>
      </div>
    </div>
    <div class="hj-map-panel__ft">
      <img
        :src="ftPreIcon"
        alt="ftPreIcon"
        style="width:18px;height:18px;"
        class="hj-map-panel__ft__pre-icon"
      >
      <span class="hj-map-panel__ft__content">
        {{ftContent}}
      </span>
      <img
        :src="ftPostfixIcon"
        alt="ftPostfixIcon"
        class="hj-map-panel__ft__postfix-icon"
        @click="clickPostfixIcon"
        style="width: 24px;height:24px;"
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "hj-map-panel",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    labelConfig: {
      type: Object,
      default: () => ({
        titleLabel: "社会单位：",
        subtitleLabel: "地址："
      })
    },
    id:{
      type: [String,Number],
      default: ''
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
      default: "../../static/images/common/me@2x.png"
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
  },
  data() {
    return {};
  },
  methods: {
    clickPostfixIcon(e) {
      console.log("clickPostfixIcon", this);
      this.$emit("click-postfi-icon", this.$options.propsData);
    },
    click(e){
      this.$emit('iclick', e)
    }
  }
};
</script>
<style lang="scss">
.hj-map-panel {
  // margin: 10px;
  // padding: 10px 10px 0 10px;
  background-color: #fff;
  box-sizing: border-box;
  border: 1rpx solid #ddd;
  padding:10px;
  margin-top:10px;
  &__hd {
    // width: 100%;
    border-bottom: 1rpx solid #ddd;
    // text-indent: 10px;
    &__title {
      font-size: 15px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(49, 49, 49, 1);
      // line-height:2;
    }
    &__subtitle {
      font-size: 13px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(49, 49, 49, 1);
      line-height: 2;
    }
  }
  &__bd {
    // width: 100%;
    display: flex;
    border-bottom: 1rpx solid #ddd;
    &__left {
      width: 40vw;
      text-align: center;
      display: flex;
      justify-content: center;
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
      justify-content: center;
      &__item {
      }
    }
  }
  &__ft {
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