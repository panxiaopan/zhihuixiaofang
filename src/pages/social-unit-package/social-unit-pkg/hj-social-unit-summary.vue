<template>
  <div class="hj-social-unit-summary">
    <wux-white-space></wux-white-space>
    <div class="hj--title">
      <div class="hj-rhombus-icon"></div> &nbsp;基本信息
      <!-- <span class="hj-social-unit-summary__title--more">更多{{'>'}}&nbsp;&nbsp;</span> -->
    </div>

    <wux-white-space></wux-white-space>
    <!-- <div class="hj_home__div">
      <div>社会单位：{{socialUnit}}      </div>
      <div>地址：{{address}}      </div>
      <div>
        <img :src="" alt="" class="src"> {{}}
      </div>
    </div> -->
    <div class="hj-social-unit-summary__base-info hj-social-unit-summary--shadow-box hj-social-unit-summary--radius">
      <div class="hj-social-unit-summary__base-info__content">社会单位：{{socialUnit}}</div>
      <!-- hj-social-unit-summary__base-info__content--heightlight -->
      <!-- <div class="hj-social-unit-summary__base-info__content hj-social-unit-summary__base-info__content__location">设备位置：{{basicInfo.device.address}}</div>
      <div class="hj-social-unit-summary__base-info__content hj-social-unit-summary__base-info__content--heightlight">设备名称：{{basicInfo.device.name}}</div> -->
      <div class="hj-social-unit-summary__base-info__content hj-social-unit-summary__base-info__content__address">单位地址：{{address}}</div>
      <wux-white-space></wux-white-space>
      <wux-row class="hj-social-unit-summary__base-info__ft">
        <wux-col
          class="hj-social-unit-summary__base-info__ft__lt"
          span=6
        >
          <img
            :src="linkedIcon"
            style="height: 18px;width:18px;vertical-align:middle;"
            alt=""
          >
          <span style="vertical-align:middle;">
            {{responseName}}
          </span>
        </wux-col>
        <wux-col
          class="hj-social-unit-summary__base-info__ft__rt"
          span=6
        >
          <span class="hj-social-unit-summary__base-info__ft__rt__phone">{{phoneNumber}}</span>&nbsp;
          <img
            class="hj-social-unit-summary__base-info__ft__rt__icon"
            :src="phoneIcon"
            alt="phone"
            @click="makePhoneCall"
          >
        </wux-col>
      </wux-row>
    </div>

    <wux-white-space></wux-white-space>
    <div class="hj--title">
      <div class="hj-rhombus-icon"></div> &nbsp;设备状态
    </div>
    <div class="hj-social-unit-summary__div">
      <ec-canvas
        v-if="isAuth"
        ec-class="hj_home__div hj-social-unit-summary__state"
        id="hj-social-unit-summary__state"
        canvas-id="hj-social-unit-summary__state"
        :ec="ecPie"
      ></ec-canvas>

    </div>

    <wux-white-space></wux-white-space>

    <div class="hj--title">
      <div class="hj-rhombus-icon"></div> &nbsp;隐患统计
    </div>
    <div class="hj-social-unit-summary__div">
      <hjDatePicker
        v-if="isAuth"
        isShowWeek
        :isShowYear="false"
        :isShowTotal="false"
        :classStr="'hj-social-unit-summary__trouble__date_picker'"
        v-model="datePickedVal"
        :dateType.sync="dateType"
        @change-date-type-value="changeDateTypeValue"
      ></hjDatePicker>
      <div style="height: 220px;margin-bottom: 30px;">
        <ec-canvas
          v-if="isAuth"
          ec-class="hj-social-unit-summary__trouble_work_order_tendency_chart"
          id="hj-social-unit-summary__trouble_work_order_tendency_chart"
          canvas-id="hj-social-unit-summary__trouble_work_order_tendency_chart"
          :ec="ecBarLine"
        ></ec-canvas>
      </div>
    </div>

    <wux-white-space></wux-white-space>
  </div>
</template>
<script>
import pieFun from "@/lib/echarts/pie.js";
import hjDatePicker from "@/components/hj-date-picker";
import barLineFun from "@/lib/echarts/barLine.js";
export default {
  name: "hj-social-unit-summary",
  components: {
    hjDatePicker
  },
  props: {
    id: {
      type: [Number, String],
      default: ""
    },
    socialUnitName: {
      type: String,
      default: ""
    },
    params: null
  },
  data() {
    return {
      format: "YYYY-MM-DD",
      socialUnit: "",
      address: "",
      responseName: "",
      phoneNumber: "",
      linkedIcon: "../../../static/images/common/me@2x.png",
      phoneIcon: "../../../static/images/common/phone_light@3x.png",
      isAuth: true,
      ecPie: {
        // 将 lazyLoad 设为 true 后，需要手动初始化图表
        lazyLoad: true,
        options: pieFun({ title: " " }),
        instanceName: "hj-social-unit-summary__state",
        domId: "hj-social-unit-summary__state"
      },
      ecBarLine: {
        lazyLoad: true,
        options: barLineFun(),
        instanceName:
          "hj-social-unit-summary__trouble_work_order_tendency_chart",
        domId: "hj-social-unit-summary__trouble_work_order_tendency_chart"
      },
      datePickedVal: "",
      dateType: "week",
      queryRiskTrendParams: null
    };
  },
  computed: {},
  watch: {
    // id(newVal, oldVal) {
    //   if (!!newVal && newVal != undefined && newVal != "undefined") {
    //     this.id = newVal;
    //     console.log("this.id", this.id);
    //     this.initData();
    //   }
    // }
  },
  methods: {
    changeDateTypeValue(dateObj) {
      // console.log(
      //   "changeDateTypeValue",
      //   dateObj,
      //   this.$_dayjs(dateObj.value).format("YYYY-DD"),
      //   this.$_dayjs((dateObj.value + "-01 00:00:00").replace("-", "/")).format(
      //     "YYYY-DD-01"
      //   )
      // );
      var params = { id: this.id };
      if (dateObj.type == "week") {
        params.startTime = this.$_dayjs(dateObj.value)
          .subtract(7, "day")
          .format("YYYY-MM-DD");
        params.endTime = this.$_dayjs(dateObj.value).format("YYYY-MM-DD");
      } else if (dateObj.type == "month") {
        params.startTime = this.$_dayjs(dateObj.value + "-01 00:00:00")
          .startOf("month")
          .format("YYYY-MM-DD 00:00:00");
        params.endTime = this.$_dayjs(dateObj.value + "-01 00:00:00")
          .endOf("month")
          .add(1, "day")
          .format("YYYY-MM-DD 00:00:00");
      }

      console.log("changeDateTypeValue params", params);
      // queryRiskTrendParams

      this.querySocialUnitsRiskTrend(params);
    },
    querySocialUnitsRiskTrend(params) {
      // params.dateType
      params.id = params.id || this.id;
      params.startTime =
        params.startTime ||
        this.$_dayjs()
          .add(-100, "day")
          .format(this.format);
      params.endTime =
        params.endTime ||
        this.$_dayjs()
          .add(1, "day")
          .format(this.format);
      this.$http("socialUnitsRiskTrend", params, { method: "get" }).then(
        res => {
          console.log("socialUnitsRiskTrend", res);
          this.ecBarLine.options = barLineFun(
            this.processRiskTimeCountsData(res.data)
          );
          this.instanceChart(this.ecBarLine);
        }
      );
    },
    setHjSocialUnitSummaryData(data) {
      console.log("setHjSocialUnitSummaryData hjSocial", data);
      if (!data) {
        return;
      }

      var basic = data.basicInfo;
      var manResponsibleForFireSecurity =
        basic && basic.manResponsibleForFireSecurity;
      this.socialUnit = basic && basic.name;
      this.address = basic && basic.address;
      this.responseName =
        (manResponsibleForFireSecurity && manResponsibleForFireSecurity.name) ||
        "";
      this.phoneNumber =
        (manResponsibleForFireSecurity && manResponsibleForFireSecurity.tel) ||
        "";
    },
    initData(params = {}) {
      console.log("initData hj-social-unit-summary");
      params.id = params.id || this.id;
      this.$http("socialUnitsDetail", params, {
        method: "get"
      })
        .then(res => {
          console.log("socialUnitsDetail", res);
          this.setHjSocialUnitSummaryData(res.data);
          this.initChart(res.data);
        })
        .catch(res => {
          console.log("socialUnitsDetail", res);
        });
    },
    initChart(data) {
      var deviceStatusWithCounts = data.deviceStatusWithCounts;
      if (
        !deviceStatusWithCounts ||
        !Array.isArray(deviceStatusWithCounts) ||
        !deviceStatusWithCounts.length
      ) {
        return;
      }
      var total = 0;
      var pieData = deviceStatusWithCounts.map(item => {
        total += item.count;
        return { name: item.desc, value: item.count };
      });
      this.ecPie.options = pieFun({ data: pieData, total, title: " " });
      this.instanceChart(this.ecPie);

      this.ecBarLine.options = barLineFun(
        this.processRiskTimeCountsData(data.deviceRiskStatistic.riskTimeCounts)
      );
      this.instanceChart(this.ecBarLine);
    },
    // 点击按钮后初始化图表
    instanceChart(ec) {
      // ec    // instanceName    domId    options
      if (!ec.options) {
        return;
      }
      // {instanceName: '', domId: '', options}
      // this.dispose(ec.instanceName);
      this.$root.$mp.page
        .selectComponent("#" + ec.domId)
        .init((echarts, canvas, width, height) => {
          // 获取组件的 canvas、width、height 后的回调函数
          // 在这里初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });

          chart.setOption(ec.options);
          // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
          this[ec.instanceName] = chart;

          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          return chart;
        });
    },
    processRiskTimeCountsData(dataArr, cb) {
      if (!dataArr || !dataArr.length) {
        return cb();
      }
      var xAxis = [];
      var data = dataArr.map(item => {
        xAxis.push(this.$_dayjs(item.time).format(this.format));
        return item.value;
      });
      if (cb) {
        return cb({ data, xAxis });
      }
      return { data, xAxis };
    },
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: this.phoneNumber,
        success: res => {
          console.log("call phoneNumber success");
        }
      });
    }
  },
  mounted() {
    console.log("social-unit-summary summary mounted", this);
    // this.initData();
  }
};
</script>

<style lang="scss">
.hj-social-unit-summary {
  width: 100%;
  &__div {
    margin-left: 10px;
    margin-right: 10px;
    box-sizing: border-box;
  }
  // &__basic-info {
  //   padding-right: 15px;
  // }
  &--shadow-box {
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    margin-left: 10px;
    margin-right: 10px;
    padding: 10px;
    // width: 100%;
  }
  &--radius {
    border-radius: 12px;
  }

  &__title {
    &--more {
      float: right;
      font-size: 13;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(102, 120, 233, 1);
    }
  }
  &__base-info {
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;

    color: rgba(49, 49, 49, 1);
    &__content {
      margin-top: 10px;

      &--heightlight {
        color: rgba(28, 135, 244, 1);
      }
      &__location {
        margin-top: 0;
      }
      &__address {
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
      }
    }
    &__ft {
      &__lt {
      }
      &__rt {
        text-align: right;

        &__phone {
          font-size: 14px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(49, 49, 49, 1);
          vertical-align: middle;
        }
        &__icon {
          height: 27px;
          width: 27px;
          vertical-align: middle;
        }
      }
    }
  }
  &__state {
    width: 100%;
    height: 220px !important;
    position: relative;
    z-index: 2;
  }
  &__trouble__date_picker {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    /* text-indent: 10px; */
    /* line-height: 2; */
  }
  &__trouble_work_order_tendency_chart {
    border-top: 1px solid rgba(191, 191, 191, 1);
    width: 100%;
    height: 220px;
    /* height: 220px; */
    /* height: 235px; */
    text-indent: 10px;
    background: rgba(255, 255, 255, 1);
    padding-top: 10px;
    padding-bottom: 10px;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
  }
}
</style>