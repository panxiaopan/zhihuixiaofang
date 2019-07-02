<template>
  <div
    class="hj-monitor-panel"
    :class="hjClass"
    @click.stop="clickHjMonitorPanel"
  >
    <div
      class="hj-monitor-panel___title"
      style="font-size: 18px;margin-bottom:5px;font-family: PingFang-SC-Medium;font-weight: 500;"
    >
      {{name}}
    </div>
    <!-- <wux-white-space></wux-white-space> -->
    <div style="border-bottom: 1rpx solid #ddd;"></div>

    <wux-row
      wux-class="hj-monitor-panel__content"
      gutter=0
    >
      <wux-col
        span=4
        wux-class="hj-monitor-panel__content__col hj-monitor-panel__content__left"
      >
        <!-- <div v-if="coverUrl" style="width: 100%;height: 100%;">
          <img :src="coverUrl" mode="aspectFill" alt="coverUrl" style="width: 100%;height: 100%;vertical-align:middle">
        </div> -->
        <!-- v-if="coverUrl" -->

        <!-- <div style="width:100%;height:100%;"> -->
        <img
          :src="coverUrl"
          mode="aspectFill"
          alt="coverUrl"
          lazy-load
          style="vertical-align:middle;width: calc((100vw - 39px) / 3);height:calc((100vw - 39px) / 3);"
        >
        <!-- </div> -->

        <!-- style="vertical-align:middl;width: 100px;;height: 100px;" -->

        <!-- <div
          v-if="!coverUrl"
          style="width: 100%;height: 100%;background: #ddd;line-height:100px;color:#fff;"
        >
          暂无图片
        </div> -->

      </wux-col>
      <wux-col
        span=8
        wux-class="hj-monitor-panel__content__col hj-monitor-panel__content__right"
      >
        <div class="hj-monitor-panel__content__right__item">
          <!-- <span class="hj-monitor-panel__content__right__item__label"> -->
          设备数量:
          <!-- </span> -->
          <!-- <span class="hj-monitor-panel__content__right__item__value"> -->
          {{totalDeviceCount}}
          <!-- </span> -->
        </div>
        <div class="hj-monitor-panel__content__right__item">
          <!-- <span class="hj-monitor-panel__content__right__item__label"> -->
          隐患数量:
          <!-- </span> -->
          <!-- <span class="hj-monitor-panel__content__right__item__value"> -->
          {{pendingRiskCount}}
          <!-- </span> -->
        </div>
        <!-- <wux-white-space></wux-white-space> -->
        <wux-row wux-class="hj-monitor-panel__content__right__item">
          <wux-col>
            <div class="hj-monitor-panel__content__right__item__mini">
              <span style="vertical-align: middle;line-height:22px;">
                <img
                  :src="alarmIcon"
                  alt="alarmIcon"
                  style="height:13px;width: 13px;vertical-align: middle;"
                >
                <span style="vertical-align: middle;line-height:22px;">
                  {{desc}} {{updateTime}}
                </span>
              </span>

            </div>
          </wux-col>
          <!-- <wux-col span=3>
            <img :src="phoneIcon" alt="" style="height: 22px;width:22px;">
          </wux-col> -->
        </wux-row>
        <div
          class="hj-monitor-panel__content__right__item"
          style="text-align:left;"
        >
          <!-- <span
            style="vertical-align: middle;line-height:22px;"
           @click.stop="makePhoneCall"
          > -->
          <span @click.stop="clickAddressIcon">
            &nbsp;
            <img
              :src="mapIcon"
              alt="mapIcon"
              style="height: 22px;width:22px;vertical-align: middle;"
            >
            &nbsp;
          </span>
          <span @click.stop="makePhoneCall">
            &nbsp;
            <img
              :src="phoneIcon"
              alt="phoneIcon"
              style="height: 22px;width:22px;vertical-align: middle;"
            >
            &nbsp;
          </span>

          <!-- </span> -->
        </div>
      </wux-col>
    </wux-row>
    <div style="border-bottom: 1rpx solid #ddd;"></div>
    <wux-row wux-class="hj-monitor-panel__foot">
      <!-- @click.stop="clickAddressIcon" -->
      <wux-col style="font-size:12px;line-height:2.55;font-family:PingFang-SC-Medium;font-weight:500;color:rgba(121,121,121,1);overflow:hidden;text-indent:3px;">
        <wux-icon
          type="ios-pin"
          size="18"
          color="rgba(121, 121, 121, 1)"
          style="vertical-align: middle;"
        />
        {{address}}
      </wux-col>

    </wux-row>
  </div>
</template>
<script>
import API from '@/store/flyio/apiUrl/home.js';

export default {
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    id: {
      type: [String, Number],
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    totalDeviceCount: {
      type: String,
      default: ""
    },
    pendingRiskCount: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    status: {
      type: Object,
      default: () => ({
        desc: "正常",
        updateTime: "",
        value: 10
      })
    },
    coverPicUrl: {
      type: String,
      default: ""
    },
    manResponsibleForFireSecurity: {
      type: String,
      default: () => ({
        name: "",
        tel: ""
      })
    }
  },
  data() {
    var res = wx.getSystemInfoSync();
    console.log("getSystemInfoSync res", res);
    var width = Math.floor((res.screenWidth - 24 - 5 - 5 - 5) * 4 / 12);
    console.log("getSystemInfoSync", width);
    var coverStyle = `vertical-align:middle;width: ${width}px;height:${width}px;`;

    return {
      phoneIcon: "../../static/images/common/phone@3x.png",
      mapIcon: "../../static/images/common/mapIcon_active@3x.png",
      coverStyle: coverStyle
      // addressIcon: '../../static/images/common/'
      // imgStyle
    };
  },
  computed: {
    // imgStyle() {
    //   if (this.$store.state.systemInfo) {
    //     var sysInfo = this.$store.state.systemInfo;
    //     console.log('getSystemInfoSync', sysInfo);
    //     var screenWidth = sysInfo.screenWidth;
    //     var imgWidth = screenWidth * 0.3 + 'px';
    //     var imgStyle = 'width:' + imgWidth + ';height:' + imgWidth;
    //     return imgStyle;
    //   }
    //   return 'width: 100px;;height: 100px;';
    // },
    updateTime() {
      return (this.status && this.status.updateTime) || "";
    },
    coverUrl() {
      if (this.coverPicUrl) {
        return API.requestDomain + this.coverPicUrl;
      }
      return "../../static/images/common/socialUnitSampleImg.jpg";
    },
    alarmIcon() {
      if (this.status) {
        // 20 预警 ， 30 报警 , 10 正常, 40 离线
        switch (this.status.value) {
          case 20:
            return "../../static/images/common/device-warning.png";
            break;
          case 30:
            return "../../static/images/common/alarm@2x.png";
            break;
          case 10:
            return "../../static/images/common/device-normal.png";
            break;
          case 40:
            return "../../static/images/common/device-offline.png";
            break;
          default:
            return "../../static/images/common/device-offline.png";
            break;
        }
      }
      return "";
    },
    desc() {
      if (this.status) {
        // return this.status.desc + ': ' + this.status.value;
        console.log('desc', this.status)
        return this.status.desc;
      }
      return "";
    }
  },
  methods: {
    makePhoneCall() {
      console.log("this makePhoneCall", this);
      var tel = this.manResponsibleForFireSecurity.tel;
      wx.makePhoneCall({
        phoneNumber: tel,
        success: res => {
          console.log("success", res);
        },
        fail: res => {
          console.log("fail", res);
        },
        complete: res => {
          console.log("complete", res);
        }
      });
    },
    clickAddressIcon(e) {
      console.log("clickAddressIcon", e);
      console.log("$options.props", this.$options.props);
      this.$emit("click-ft", this.$options.props);
      // this.$emit('click-address')
    },
    clickHjMonitorPanel(e) {
      console.log("clickHjMonitorPanel", e);
      this.$emit("iclick", e);
    }
  },
  mounted() {
    //     country	string	国家
    // province	string	省份
    // city	string	城市
    // county	string	区/县
    // town	string	乡/镇
    // remark	string	详细地址
    // address	string	地址全称
    // city	string	城市
    // totalDeviceCount	number	设备总数量
    // offlineDeviceCount	number	失联数量
    // onlineDeviceCount	number	在线数量
    // leftRiskCount	number	待处理隐患数量
    // completedRiskCount	number	已完成隐患数量
    // var res = wx.getSystemInfoSync();
    // console.log("getSystemInfoSync res", res);
    // var width = Math.floor((res.screenWidth - 24 - 5 - 5 - 5) * 5 / 12);
    // console.log("getSystemInfoSync", width);
    // this.coverStyle = `vertical-align:middle;width: ${width}px;height:${width}px;`;
  }
};
</script>
<style lang="scss">
.hj-monitor-panel {
  box-sizing: border-box;
  padding: 5px;
  // width: 100%;
  // margin-bottom: 10px;
  &__title {
    font-size: 16px;
    line-height: 1.5;
    font-family: PingFang-SC-Bold;
    // font-weight: bold;
    font-weight: Medium;
    color: #373737;
  }
  &__content {
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100%;
    height: max-content;

    &__col {
      height: max-content;
      // padding-right: 10px;
    }
    &__left {
      // padding-right: 30px;
    }
    // border-bottom: 1rpx solid #ddd;
    &__right {
      padding-left: 15px;
      &__item {
        font-size: 15px;
        font-family: PingFang-SC-Bold;
        // font-weight: bold;
        line-height: 2;
        color: #373737;
        &__lable {
          // font-size: 14px;
          // font-family: PingFang-SC-Bold;
          // font-weight: bold;
          // color: rgba(49, 49, 49, 1);
        }
        &__value {
          // font-size: 14px;
          font-family: DIN-Regular;
          // font-weight: bold;
          // color: rgba(49, 49, 49, 1);
        }
        &__mini {
          // style="font-size: 13px !important;font-family: PingFang-SC-Medium !important;font-weight: 500;color: rgba(96, 96, 96, 1);"
          // margin-top: 8px;
          font-size: 12px !important;
          font-family: PingFang-SC-Medium !important;
          font-weight: 500;
          color: rgba(96, 96, 96, 1);
          // padding-bottom: 5px;
        }
      }
    }
    &__left {
    }
  }
  &__foot {
    // width: 100%;
  }
  &--min {
  }
}
</style>