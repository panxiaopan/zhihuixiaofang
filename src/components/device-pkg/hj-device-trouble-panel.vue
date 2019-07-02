<template>
<div
    class="hj-device-trouble-panel hj-device-trouble-panel-wrapper"
    :style="{marginTop: !index? 0:'10px'}"
    @click.stop="click"
  >

    <div class="hj-device-trouble-panel__hd">
      <div style="flex-grow: 9">
        <img
          :src="thumb||'../../static/images/common/message@1x.png'"
          alt="thumb"
          style="width: 21px;height: 21px;vertical-align:middle;"
        >
        <span style="vertical-align:middle;">
          {{title}}
        </span>
      </div>
      <div style="text-align:right;color: #888;vertical-align:middle;flex-grow:3;font-size: 16px;">
        {{extra}}
      </div>
    </div>

    <div
      class="hj-device-trouble-panel__content"
      style="padding-top:10px;padding-bottom:10px; font-size: 14px;font-family: PingFang-SC-Medium;font-weight: 500;color: rgba(49, 49, 49, 1);"
    >
      <div>
      隐患等级：
      {{riskGrade}} 

      <!-- <img
          @click.stop="call"
          :src="phoneIcon"
          alt="phoneIcon"
          style="height: 22px;width:22px;vertical-align: middle;float:right;"
        > -->
      </div>
      <wux-white-space></wux-white-space>
      <div>
      隐患状态：{{riskState}}
      <span style="float:right;vertical-align:middle;font-size:12px;font-family:DIN-Regular;font-weight:400;color:rgba(49,49,49,1);">
      {{dateTime}}
      </span>
      </div>
    </div>

    <!-- <div
      class="hj-device-trouble-panel__ft"
      style="font-size: 13px;font-family: PingFang-SC-Medium;font-weight: 500;color: rgba(121, 121, 121, 1);"
    >
      <div class="hj-device-trouble-panel__ft__item">
        <wux-icon
          type="ios-pin"
          size="18"
          color="#6678E9"
        />
        <span>{{address}}</span>
      </div>
      <div
        class="hj-device-trouble-panel__ft__item"
        style="text-align: right"
      >
        {{dateTime}}
      </div>
    </div> -->

  </div>
</template>
<script>
export default {
  name: "hj-device-trouble-panel",
  props: [
    "index",
    "id",
    "title",
    "extra",
    "thumb",
    "address",
    "dateTime",
    "deviceName",
    "socialUnit",
    "phoneNumber",
    "riskGrade",
    "riskState",
    "extraData"
  ],
  data() {
    return {
      // thumb: '../../static/images/common/alarm@2x.png',
      // addressIcon: "../../static/images/common/address@2x.png",
      // phoneIcon: "../../static/images/common/phone@3x.png"
    };
  },
  methods: {
  click(e) {
      console.log("hj-device-trouble-panel click", e);
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
        riskGrade: this.riskGrade,
        riskState: this.riskState,
        extraData: this.extraData
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.hj-device-trouble-panel {
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
    padding-bottom: 15px;
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
      flex-grow: 1;
    }
  }
}
</style>