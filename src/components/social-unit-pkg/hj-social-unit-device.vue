<template>
  <div class="hj-social-unit-device">
    <wux-refresher
      v-if="isAuth"
      id="wux-refresher1"
      @pulling="onPulling"
      @refresh="onRefresh"
    >
      <div
        class="hj_home__div hj-social-unit-device__panel"
        v-for="row in rows"
        :key="row.id"
        @click="clickDevice(row)"
      >
        <wux-row wux-class="hj-social-unit-device__panel__title">
          <wux-col
            span="6"
            wux-class=""
          >
            <div>
              <div
                class="hj-social-unit-device__panel__title__icon"
                :style="{backgroundColor: row.iconBgColor}"
              ></div>

              <span
                class="hj-social-unit-device__panel__title__icon__font"
                :style="{color: row.iconBgColor}"
              >
                {{row.desc}}
              </span>

              <span class="hj-social-unit-device__panel__title__label">
                {{row.name}}
              </span>
            </div>
          </wux-col>
          <wux-col
            span="6"
            wux-class=""
          >
            <span class="hj-social-unit-device__panel__title__subtitle">
              {{row.updateTime}} &nbsp; &nbsp;
            </span>

          </wux-col>
        </wux-row>
        <div class="hj-social-unit-device__panel__bd">
          <div class="hj-social-unit-device__panel__bd__item">设备位置：{{row.address}}</div>
          <div class="hj-social-unit-device__panel__bd__item">品牌型号：{{row.brandName}}</div>
          <div class="hj-social-unit-device__panel__bd__item">设备类型：{{row.type}}</div>
        </div>
      </div>
    </wux-refresher>
  </div>
</template>

<script>
import { $stopWuxRefresher } from "@/utils/wux.js";
export default {
  name: "hjSocialUnitDevice",
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
  data() {
    return {
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
    onPulling(e) {
      console.log("onPulling", e);
    },
    onRefresh(e) {
      console.log("onRefresh", e);
      this.initData({ id: this.id }, this.setPullingData);
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
        var { id, name, address, brandName, type, status } = item;
        var { desc, value: statusCode, updateTime } = status;
        var iconBgColor = this.getComputedImgSrcByCode(statusCode);
        return {
          id,
          updateTime,
          name,
          desc,
          address,
          brandName,
          type,
          iconBgColor
        };
      });
    },
    getComputedImgSrcByCode(code) {
      // 10 正常，20 预警 ， 30 报警
      switch (code) {
        case 20:
          // return "../../static/images/common/warning@2x.png";
          return "#FF9C01";
          break;
        case 30:
          // return "../../static/images/common/alarm@2x.png";
          return "FF2444";
          break;
        case 10:
          // return "../../static/images/common/message@1x.png";
          return "#25B8FC";
          break;
        default:
          // 离线
          return "#ccc";
          break;
      }
    },
    clickDevice(item) {
      wx.navigateTo({
        url:
          "/pages/device-package/home/main?deviceId=" +
          item.id +
          "&name=" +
          item.name +
          "&currentTab=summary&id=" +
          this.id +
          "&socialUnitName=" +
          this.socialUnitName
      });
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
        background: red;
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
        // position: relative;
        // top: 50%;
        // transform: translateY(-50%);
        // height: 100%;
        // vertical-align: middle;
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
