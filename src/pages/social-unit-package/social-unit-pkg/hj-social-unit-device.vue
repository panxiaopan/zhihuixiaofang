<template>
  <div class="hj-social-unit-device">
    <wux-refresher v-if="isAuth" id="wux-refresher1" @pulling="onPulling" @refresh="onRefresh">
      <div
        class="hj_home__div hj-social-unit-device__panel"
        v-for="row in rows"
        :key="row.id"
        @click="clickDevice(row)"
      >
        <wux-row wux-class="hj-social-unit-device__panel__title">
          <wux-col span="6" wux-class>
            <div>
              <img :src="row.iconBgColor" style="height:15px;width:15px;vertical-align:middle; padding-right: 5px;" alt>
              <span class="hj-social-unit-device__panel__title__label">{{row.name}}</span>
            </div>
          </wux-col>
          <wux-col span="6" wux-class>
            <span
              class="hj-social-unit-device__panel__title__subtitle"
            >{{row.updateTime}} &nbsp; &nbsp;</span>
          </wux-col>
        </wux-row>
        <div class="hj-social-unit-device__panel__bd">
          <div class="hj-social-unit-device__panel__bd__item" >设备位置：{{row.address}}</div>
          <div class="hj-social-unit-device__panel__bd__item" >设备类型：{{row.type}}</div>
          <div class="hj-social-unit-device__panel__bd__item" >品牌型号：{{row.brandName}} [{{row.modelName}}]</div>
        </div>
      </div>
    </wux-refresher>
    <div v-if="showBottomLoading&&isAuth" class="hj__loading">
      <img class="hj__loading__img" :src="loadingImg" style="height: 24px;width:24px;" alt>
    </div>
    <div v-if="isAuth" class="hj__to_top" hover-class="hj__to_top--hover" @click="toTop"></div>
  </div>
</template>

<script>
import { $stopWuxRefresher } from "@/utils/wux.js";
import setScrollTop from "@/mixins/setScrollTop.js";
export default {
  name: "hjSocialUnitDevice",
  onReachBottom(e) {
    console.log("this.params", this.params);
    console.log("onReachBottom", e);
    this.showBottomLoading = true;
    if (this.params.size > this.total) {
      this.showBottomLoading = false;
    } else {
      this.params.size += 10;
      this.initData({ size: this.params.size }, this.setPushingData);
    }
  },
  components: {},
  props: {
    id: {
      type: [Number, String],
      default: ""
    },
    socialUnitName: {
      type: String,
      default: ""
    }
  },
  mixins: [setScrollTop],
  data() {
    return {
      loadingImg: "../../../static/images/common/loading.png",
      total: 0,
      rows: [],
      isAuth: true,
      params: {
        size: 10,
        start: 0
      }
    };
  },
  computed: {},
  methods: {
    setPushingData(res) {
      // 记住scrolltop的位置
      // var data = {total: res.data.total, rows: res.data.rows}
      this.setData(res.data, true);
      // 设置scroltop的位置
      this.showBottomLoading = false;
    },
    toTop(e) {
      console.log("toTop", e);
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300,
        success: res => {
          console.log("pageScrollTo", res);
        },
        fail: res => {
          console.log("fail", res);
        },
        complete: res => {
          console.log("complete", res);
        }
      });
    },
    onPulling(e) {
      console.log("onPulling", e);
    },
    onRefresh(e) {
      console.log("onRefresh", e);
      if (this.scrollTop <= 44) {
        this.initData({ id: this.id }, this.setPullingData);
      } else {
        $stopWuxRefresher("#wux-refresher1", this.$root.$mp.page);
      }
    },
    setPullingData(res) {
      // this.params.size = 10;
      this.setData(res.data);
      $stopWuxRefresher("#wux-refresher1", this.$root.$mp.page);
    },

    setData(data) {
      this.total = data.total;
      this.rows = this.proccessData(data.rows);
    },
    initData(params, cb) {
      console.log("hjSocialUnitDevice initData", params);
      params.id = params.id || this.id;
      params.keyword = params.keyword || this.keyword || "";
      params.start = params.start || this.params.start || 0;
      params.size = params.size || this.params.size || 10;
      this.$http("socialUnitsDevices", params, { method: "get" })
        .then(res => {
          console.log("socialUnitsDevices", res);
          if (cb) {
            cb(res);
          } else {
            this.setData(res.data);
          }
        })
        .catch(res => {
          console.log("socialUnitsDevices", res);
        });
    },
    proccessData(rows) {
      if (!rows || !Array.isArray(rows) || !rows.length) {
        return;
      }
      return rows.map(item => {
        var { id, name, address, brandName, deviceClassId, modelName, type, status } = item;
        var { desc, value: statusCode, updateTime } = status;
        
        var iconBgColor = this.getComputedImgSrcByCode(statusCode);
        //console.error("item", item);
        //console.error("status", status);
        return {
          id,
          updateTime,
          name,
          desc,
          address,
          brandName,
          modelName,
          type,
          iconBgColor,
          statusCode,
          deviceClassId
        };
      });
    },
    getComputedImgSrcByCode(code) {
      // 10 正常，20 预警 ， 30 报警
      // switch (code) {
      //   case 20:
      //     // return "../../static/images/common/warning@2x.png";
      //     return "#FF9C01";
      //     break;
      //   case 30:
      //     // return "../../static/images/common/alarm@2x.png";
      //     return "FF2444";
      //     break;
      //   case 10:
      //     // return "../../static/images/common/message@1x.png";
      //     return "#25B8FC";
      //     break;
      //   default:
      //     // 离线
      //     return "#ccc";
      //     break;
      // }
      //console.error("状态：", code);
      switch (code) {
        case 20:
          return "../../../static/images/common/device-warning.png";
          break;
        case 30:
          return "../../../static/images/common/alarm@2x.png";
          break;
        case 10:
          return "../../../static/images/common/device-normal.png";
          break;
        case 40:
          return "../../../static/images/common/device-offline.png";
          break;
        default:
          return "../../../static/images/common/device-offline.png";
          break;
      }
    },
    //增加根据设备类型区分跳转的页面，烟感设备需跳转到烟感的详情页
    clickDevice(item) {

        console.log(          "/pages/device-package/home/main?"+
            "deviceType=" + item.deviceClassId + 
            "&deviceId=" +item.id +
            "&name=" +item.name +
            "&currentTab=summary&id=" +
            this.id +
            "&socialUnitName=" +
            this.socialUnitName)
            
        wx.navigateTo({
          url:
            "/pages/device-package/home/main?"+
            "deviceType=" + item.deviceClassId + 
            "&deviceId=" +item.id +
            "&name=" +item.name +
            "&currentTab=summary&id=" +
            this.id +
            "&socialUnitName=" +
            this.socialUnitName
        });
      //console.error("item", item);
      // if (item.deviceClassId === "SMOKE_DETECTOR") {
      //   //跳转到烟感详情页面
      //   wx.navigateTo({
      //     url
      //       "/pages/social-unit-package/smoke-detector-detail/main?deviceId=" +
      //       item.id +
      //       "&name=" +
      //       item.name +
      //       "&currentTab=summary&id=" +
      //       this.id +
      //       "&socialUnitName=" +
      //       this.socialUnitName + "&item=" + JSON.stringify(item)
      //   });
      // } else if(item.deviceClassId === "ELECTRICAL_FIRE_MONITORING_DETECTOR"){
      //   //跳转到电气火灾探测器SE3311设备详情页面
      //   wx.navigateTo({
      //     url:
      //       "/pages/device-package/home/main?deviceId=" +
      //       item.id +
      //       "&name=" +
      //       item.name +
      //       "&currentTab=summary&id=" +
      //       this.id +
      //       "&socialUnitName=" +
      //       this.socialUnitName
      //   });
      // } else if(item.deviceClassId === "PARTIAL_DISCHARGE_DETECTOR"){
      //   //跳转到局放设备详情页面
      //   wx.navigateTo({
      //     url:
      //       "/pages/device-package/home/main?deviceId=" +
      //       item.id +
      //       "&name=" +
      //       item.name +
      //       "&currentTab=summary&id=" +
      //       this.id +
      //       "&socialUnitName=" +
      //       this.socialUnitName
      //   });
      // } else if(item.deviceClassId === "FIRE_DETECTOR"){
      //   //跳转到火探设备详情页面
      //   wx.navigateTo({
      //     url:
      //       "/pages/device-package/home/main?deviceId=" +
      //       item.id +
      //       "&name=" +
      //       item.name +
      //       "&currentTab=summary&id=" +
      //       this.id +
      //       "&socialUnitName=" +
      //       this.socialUnitName
      //   });
      // }
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
.hj-social-unit-device {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  &__panel {
    &__title {
      line-height: 2;
      border-bottom: 1rpx solid #ddd;
      &__icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 6px;
        vertical-align: middle;
        &__font {
          font-size: 12px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(37, 184, 252, 1);
          vertical-align: middle;
        }
      }
      &__label {
        font-size: 15px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(49, 49, 49, 1);
        vertical-align: middle;
      }
      &__subtitle {
        float: right;
        font-size: 12px;
        line-height: 3;
        font-family: DIN-Regular;
        font-weight: 400;
        color: rgba(49, 49, 49, 1);
      }
    }
    &__bd {
      padding-top: 10px;
      padding-bottom: 10px;
      &__item {
        line-height: 2;
        font-size: 14px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(49, 49, 49, 1);
      }
    }
  }
}
</style>
