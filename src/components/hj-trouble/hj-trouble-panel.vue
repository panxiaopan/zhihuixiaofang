<template>
  <div
    class="hj-trouble-panel hj-trouble-panel-wrapper"
    :style="{marginTop: !index? 0:'10px'}"
    @click.stop="click"
  >

    <div class="hj-trouble-panel__hd">
      <div style="flex-grow: 9;display:flex;align-items:center;">
        <img
          :src="thumb||'../../static/images/common/message@1x.png'"
          alt="thumb"
          style="width: 21px;height: 21px;vertical-align:middle;flex-grow:0;flex-shrink:0;"
        >
        <span style="vertical-align:middle;padding-left:10rpx;padding-right:10rpx;">
          {{title}}
        </span>
      </div>
      <div style="text-align:right;color: #888;vertical-align:middle;flex-shrink:0;font-size: 16px;">
        {{extra}}
      </div>
    </div>

    <div
      class="hj-trouble-panel__content"
      style="padding-top:10px;padding-bottom:10px; font-size: 14px;font-family: PingFang-SC-Medium;font-weight: 500;color: rgba(49, 49, 49, 1);"
    >
      <div>设备名称：{{deviceName}} <img
          @click.stop="call"
          :src="phoneIcon"
          alt="phoneIcon"
          style="height: 22px;width:22px;vertical-align: middle;float:right;"
        ></div>
      <wux-white-space></wux-white-space>
      <div>设备位置：{{position}}</div>
      <wux-white-space></wux-white-space>
      <div>社会单位：{{socialUnit}}</div>
    </div>
    <div
      class="hj-trouble-panel__ft"
      style="font-size: 13px;font-family: PingFang-SC-Medium;font-weight: 500;color: rgba(121, 121, 121, 1);"
    >
      <div class="hj-trouble-panel__ft__item hj-trouble-panel__ft__item--left">
        <wux-icon
          type="ios-pin"
          size="18"
          color="rgba(121, 121, 121, 1)"
          style="flex-shrink:0"
        />
        <span style="padding-left: 5rpx;padding-right: 5rpx;">{{address}}</span>
      </div>

      <div
        class="hj-trouble-panel__ft__item hj-trouble-panel__ft__item--right"
        style="text-align: right"
      >
        {{dateTime}}
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "hj-trouble-panel",
  props: {
    index: {
      type: [String, Number],
      default: 0
    },
    id: {
      type: String,
      default: "id"
    },
    title: {
      type: String,
      default: "卡片标题"
    },
    extra: {
      type: String,
      default: "额外内容"
    },

    thumb: {
      type: String,
      default: "../../static/images/common/message@1x.png"
    },
    address: {
      type: String,
      default: ""
    },
    dateTime: {
      type: String,
      default: ""
    },
    position: {
      type: String,
      default: ""
    },
    deviceName: {
      type: String,
      default: ""
    },
    socialUnit: {
      type: String,
      default: ""
    },
    phoneNumber: {
      type: [String, Number],
      default: ""
    },
    extraData: {
      type: String,
      default: _ => {}
    }
  },
  data() {
    return {
      // thumb: '../../static/images/common/alarm@2x.png',
      addressIcon: "../../static/images/common/address@2x.png",
      phoneIcon: "../../static/images/common/phone@3x.png"
    };
  },
  methods: {
    call() {
      if (!this.phoneNumber) {
        return console.error("phoneNumber is not exist");
      }
      // phoneNumber
      wx.makePhoneCall({
        phoneNumber: this.phoneNumber,
        success: res => {
          console.log("call phoneNumber success");
        }
      });
      console.log("call");
    },
    click(e) {
      console.log("hj-trouble-panel click", e);
      this.$emit("click", {
        id: this.id,
        title: this.title,
        extra: this.extra,
        thumb: this.thumb,
        address: this.address,
        dateTime: this.dateTime,
        deviceName: this.deviceName,
        socialUnit: this.socialUnit,
        phoneNumber: this.phoneNumber,
        extraData: this.extraData
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.hj-trouble-panel {
  /*   height: 351px; */
  width: 100%;
  background-color: #fff;
  border-radius: 5px;
  // margin-top: 10px;
  padding: 10px;
  border: 1rpx solid #ddd;
  box-sizing: border-box;
  // padding: 9px 15px;
  &__hd {
    // text-indent: 15px;

    //   width:100%;
    font-size: 18px;
    // padding-top: 15px;
    padding-bottom: 10px;
    border-bottom: 1rpx solid #ddd !important;
    display: flex;
    align-items: center;
    // justify-content:
    // padding:9px 15px;
    &__title {
      // vertical-align: middle;
      &__icon {
        // height: 21px;
        // width: 21px;
      }
    }
  }
  &__bd {
    &__content {
      margin-bottom: 10px;
    }
  }
  &__ft {
    border-top: 1rpx solid #ddd;
    width: 100%;
    display: flex;

    padding-top: 6px;
    // padding-left: 16px;
    // padding-right: 16px;
    // margin: 0 -16px;
    &__item {
      &--left {
        display: flex;
        flex-grow: 1;
        display: flex;
      }
      &--right {
        flex-shrink: 0;
        flex-basis: 80px;
      }
    }
  }
}
</style>


