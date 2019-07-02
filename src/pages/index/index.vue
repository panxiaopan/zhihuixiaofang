<template>
  <div class="container hj_home">
    <wux-toptips id="wux-toptips1" />
    <div v-if="!isAuth&&isMounted" style="height:100%;width:100%;position:relative: z-index:11111;">
      <button @click="jumpToLogin">暂无权限查看,点击重新授权登录</button>
    </div>
    <div v-if="isAuth" class="hj_home__div">
      <!-- <span class="hj_home__socail-unit--label">社会单位总数 （个数）：</span>
      <span class="hj_home__socail-unit--value">{{summaryInfo.totalSocialUnitCount}}</span>-->
      <div class="phi_home">
        <div class="phj_back">
          <div class="_total total_bol">{{socalinformtion.totalSocialUnitCount}}</div>
          <div class="_total total_num">社会单位</div>
        </div>
        <div class="phj_back">
          <div class="_total total_bol">{{socalinformtion.todayRiskCount}}</div>
          <div class="_total total_num">今日隐患</div>
        </div>
        <div class="phj_back">
          <div class="_total total_bol">{{socalinformtion.historyRiskCount}}</div>
          <div class="_total total_num">历史隐患</div>
        </div>
      </div>
    </div>
    <ec-canvas
      v-if="isAuth"
      class="hj_home__div hj_home__device-status"
      id="hj_home__device-status"
      canvas-id="hj_home__device-status"
      :ec="ecPie"
    ></ec-canvas>

    <hj-panel
      v-if="isAuth"
      @iclick="clickState"
      :wrapperClass="'hj_home__div'"
      title="隐患状态统计"
      :title-icon="troubleStateIcon"
      :firstValue="summaryInfo.leftRisksByStatus[0].count"
      :secondValue="summaryInfo.leftRisksByStatus[1].count"
    ></hj-panel>

    <hj-panel
      v-if="isAuth"
      :wrapperClass="'hj_home__div'"
      title="隐患等级统计"
      :title-icon="troubleLevelIcon"
      :showDefaultContentChild="false"
    >
      <hjPanelTroubleStasticSlot :risksByGrade="risksByGrade" @iclick="clickGrade"></hjPanelTroubleStasticSlot>
    </hj-panel>
    <hjDatePicker
      v-if="isAuth"
      :classStr="'hj_home__trouble__date_picker'"
      v-model="datePickedVal"
      :dateType.sync="dateType"
      @change-date-type-value="changeDateTypeValue"
    ></hjDatePicker>
    <ec-canvas
      v-if="isAuth"
      class="hj_home__trouble_work_order_tendency_chart"
      id="hj_home__trouble_work_order_tendency_chart"
      canvas-id="hj_home__trouble_work_order_tendency_chart"
      :ec="ecBarLine"
    ></ec-canvas>
    <ec-canvas
      v-if="isAuth"
      class="hj_home__trouble_reason_statistics_chart"
      id="hj_home__trouble_reason_statistics_chart"
      canvas-id="hj_home__trouble_reason_statistics_chart"
      :ec="ecRadar"
    ></ec-canvas>
    <!-- <official-account></official-account> -->
  </div>
</template>

<script>
// Use Vuex
// import { mapState, mapActions } from 'vuex';
import store from "./store";
import hjPanelTroubleStasticSlot from "@/components/home/hjPanelTroubleStasticSlot";
import card from "@/components/card";
import hjPanel from "@/components/hj-panel";
import hjDatePicker from "@/components/hj-date-picker";
import pieFun from "@/lib/echarts/pie.js";
import barLineFun from "@/lib/echarts/barLine.js";
import barFun from "@/lib/echarts/bar.js";
import radarFun from "@/lib/echarts/radar.js";
import mockSummaryInfo from "@/mockData/home/home.js";
import isEmpty from "lodash/isEmpty.js";
import merge from "lodash/merge.js";
import isEqual from "lodash/isEqual.js";
import wuxToptips from "@/mixins/wuxToptips.js";
// import isMounted from "@/mixins/isMounted.js";
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
export default {
  // onShareAppMessage,
  onShareAppMessage: function(res) {
    // this.selectComponent('#hj_home__device-status');
    console.log("this.ecComponent", this, res);
    return {
      title: "华杰智慧消防云",
      path: "/pages/index/main",
      success: function() {},
      fail: function() {}
    };
  },
  onShow() {
    if (this.isMounted) {
      if (!wx.getStorageSync("sessionId")) {
        wx.redirectTo({ url: "/pages/user-info/main" });
      } else {
        this.initData();
      }
    }
  },
  onReady: function() {
    // 获取组件
    // var page = this.$mp.page;
    //     if (this.isMounted) {
    //   this.initData();
    // }
    // console.log(
    //   'this.$mp.page',
    //   this.$mp.page.selectComponent('#hj_home__device-status'),
    //   page
    // );
  },
  mixins: [wuxToptips],
  data() {
    return {
      isMounted: false,
      // risksByGrades: {},
      summaryInfo: mockSummaryInfo.data, //
      dateType: "month",
      datePickedVal: "",
      socailUnit: 33,
      troubleStateIcon: "../../static/images/common/trouble_state.png",
      troubleLevelIcon: "../../static/images/common/trouble_level.png",
      motto: "Hello World",
      userInfo: {},
      ecPie: {
        // 将 lazyLoad 设为 true 后，需要手动初始化图表
        lazyLoad: true,
        options: pieFun()
      },
      ecBarLine: {
        // 将 lazyLoad 设为 true 后，需要手动初始化图表
        lazyLoad: true,
        options: barLineFun()
      },
      ecBar: {
        // 将 lazyLoad 设为 true 后，需要手动初始化图表
        lazyLoad: true,
        options: barFun()
      },
      ecRadar: {
        lazyLoad: true,
        options: radarFun()
      },
      socalinformtion: {} //社会信息
    };
  },
  components: {
    card,
    "hj-panel": hjPanel,
    hjDatePicker,
    hjPanelTroubleStasticSlot
  },
  computed: {
    isAuth() {
      return (
        this.$store.state.userPermissionsMap &&
        this.$store.state.userPermissionsMap["mp_index_group"]
      );
    },
    assignmentValueObj() {
      return { undo: 0, do: 0 };
    },
    risksByGrade() {
      if (this.summaryInfo && this.summaryInfo.risksByGrade) {
        var result = {
          info: { ...this.summaryInfo.risksByGrade["0"] },
          beforeWarning: { ...this.summaryInfo.risksByGrade[1] },
          warning: { ...this.summaryInfo.risksByGrade[2] }
        };
        var resultArr = Object.values(result).map(item => {
          return item;
        });
        console.log("resultArr", resultArr);
        // return resultArr;
        return result;
      }
      return null;
    },
    format() {
      switch (this.dateType) {
        case "month":
          return "YYYY-MM-DD";
          break;
        case "year":
          return "YYYY-MM";
          break;
        default:
          return "YYYY-MM-DD";
          break;
      }
    }
    // 'troubleParams'(){
    //   return this.$store.state.trouble.params
    // }
  },
  watch: {
    isAuth(newVal, oldVal) {
      console.log("====");
      console.log(newVal);
      console.log(oldVal);

      if (newVal) {
        wx.nextTick(() => {
          this.$nextTick(() => {
            this.initData();
          });
        });
      }
    }
  },
  methods: {
    jumpToLogin() {
      wx.navigateTo({
        url: "/pages/user-info/main"
      });
    },
    clickState(val) {
      console.log("clickState", val);
      // wx.navigateTo({ url: "/pages/social-unit-package/info/main" });
      // return;
      var params = { state: val == "left" ? "pending" : "processing" };
      this.setStoreDataAndJumpToTrouble(params);
    },
    clickGrade(e) {
      console.log("click", e);
      var params = { grade: e };
      console.log("params", params);
      this.setStoreDataAndJumpToTrouble(params);
    },
    setStoreDataAndJumpToTrouble(params) {
      // this.$store.dispatch('setRequestBy', { requestBy: 'store' });
      // wx.setStorageSync('trouble', { requestBy: 'store' });
      // this.$store.dispatch('setTroubleStoreParams', { params });
      // console.log('beforeSwitch page', this.$root);
      // this.$nextTick(() => {
      //   wx.nextTick(() => {
      //     wx.switchTab({
      //       url: '/pages/trouble/main',
      //       success: res => {
      //         this.$store.dispatch('setRequestBy', { requestBy: 'store' });
      //         wx.setStorageSync('trouble', { requestBy: 'store' });
      //         this.$store.dispatch('setTroubleStoreParams', { params });
      //         console.log('beforeSwitch page', this.$root);
      //         console.log('wx.switchTab', res, this.$root);
      //       }
      //     });
      //   });
      // });

      wx.switchTab({
        url: "/pages/trouble/main",
        success: res => {
          // this.$store.dispatch('setRequestBy', { requestBy: 'store' });
          wx.setStorageSync("trouble", { from: "home" });
          this.$store.dispatch("setTroubleStoreParams", { params });
          console.log("beforeSwitch page", this.$root);
          console.log("wx.switchTab", res, this.$root);
        }
      });
    },
    changeContent() {
      console.log("changeContent", this.summaryInfo.risksByGrade);
      this.summaryInfo.risksByGrade[0].count = 33;
      console.log("after changeContent", this.summaryInfo.risksByGrade);
    },
    // 点击按钮后初始化图表
    init(ec) {
      if (!ec.options) {
        return;
      }
      // {instanceName: '', domId: '', options}
      // this.dispose(ec.instanceName);
      if (!this.$mp.page || !this.$mp.page.selectComponent("#" + ec.domId)) {
        return;
      }
      // try {
      this.$mp.page
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
      // } catch (e) {
      //   console.warn(e);
      // }
    },
    // dispose(instanceName) {
    //   if (this[instanceName]) {
    //     this[instanceName].dispose();
    //   }
    // },
    initCharts(
      { pieOptions, barLineOptions, radarOptions },
      notInitObj = {
        notInitPie: false,
        notInitBarLine: false,
        notInitRadar: false
      }
    ) {
      console.log("notInitObj", notInitObj);
      [
        {
          instanceName: "hj_home__device-status__chart",
          domId: "hj_home__device-status",
          options: pieOptions ? pieOptions : pieFun(),
          notInit: notInitObj.notInitPie
        },
        {
          instanceName: "hj_home__trouble_work_order_tendency_chart__chart",
          domId: "hj_home__trouble_work_order_tendency_chart",
          options: barLineOptions ? barLineOptions : barLineFun(),
          notInit: notInitObj.notInitBarLine
        },
        {
          instanceName: "hj_home__trouble_reason_statistics_chart__chart",
          domId: "hj_home__trouble_reason_statistics_chart",
          options: radarOptions ? radarOptions : radarFun(),
          notInit: notInitObj.notInitRadar
        }
      ].forEach(item => {
        if (!item.notInit) {
          this.init(item);
        }
      });
    },
    resetChartOption() {
      // 无法生效
      // this.ecPie = { options: radarFun() };
      // this.ecRadar = { options: pieFun() };
      var deviceStatusCom = this.$mp.page.selectComponent(
        "#hj_home__trouble_reason_statistics_chart"
      );
      var troubleReasonCom = this.$mp.page.selectComponent(
        "#hj_home__device-status"
      );

      console.log(
        "deviceStatusCom",
        deviceStatusCom,
        deviceStatusCom.chart,
        "troubleReasonCom",
        troubleReasonCom,
        troubleReasonCom.chart
      );

      deviceStatusCom.chart.setOption(radarFun());
      troubleReasonCom.chart.setOption(pieFun());
    },
    bindViewTap() {
      console.log("bindViewTap");
      // const url = '/pages/me/index';
      const url = "../me/main";
      // wx.navigateTo({ url });
      wx.setStorageSync("meInfo", "meInfoss");
      wx.switchTab({ url });
    },
    // getUserInfo() {
    //   // 调用登录接口
    //   wx.login({
    //     success: () => {
    //       wx.getUserInfo({
    //         success: res => {
    //           this.userInfo = res.userInfo;
    //         }
    //       });
    //     }
    //   });
    // },
    changeDateTypeValue(typeObj) {
      console.log("changeDateTypeValue", typeObj);
      this.$nextTick(() => {
        console.log("dateType", this.dateType);
        this.requestValueByDate(typeObj);
      });
    },
    requestValueByDate(typeObj) {
      var params = {};
      params.dateType = typeObj.type;
      if (typeObj.value && typeObj.type != "total") {
        var startTime = this.$_dayjs(typeObj.value)
          .startOf(typeObj.type)
          .format("YYYY-MM-DD 00:00:00");
        var endTime = this.$_dayjs(typeObj.value)
          .endOf(typeObj.type)
          .format("YYYY-MM-DD 00:00:00");
        params.startTime = startTime;
        params.endTime = endTime;
      } else if (typeObj.type == "total") {
      }

      console.log("startTime", startTime);
      console.log("endTime", endTime);

      // this.$http('riskTrend', params)({ method: 'get' })
      this.httpRequest("riskTrend", params)
        .then(res => {
          console.log("res", res);
          var lummaryInfo = res.data;
          this.initCharts(
            {
              barLineOptions: barLineFun(
                this.processRiskTimeCountsData(lummaryInfo.riskTimeCounts)
              ),
              radarOptions: radarFun(
                this.processRisksByReasonData(lummaryInfo.risksByReason)
              )
            },
            { notInitPie: true }
          );
        })
        .catch(e => {
          this.dateType = typeObj.oldType;
          typeObj.oldValue && (this.datePickedVal = typeObj.oldValue);
          console.log("e requestValueByDate", e);
        });
    },
    clickHandle(msg, ev) {
      console.log("clickHandle:", msg, ev);
    },
    processDeviceStatusWithCountsData(dataArr, cb) {
      if (!dataArr || !dataArr.length) {
        return cb();
      }
      var data = [];
      //  dataArr.reduce(function(total, currentValue, currentIndex, arr), initialValue)
      var total = dataArr.reduce((total, currentValue) => {
        data.push({ name: currentValue.desc, value: currentValue.count });
        return total + currentValue.count;
      }, 0);
      if (cb) {
        return cb({ data, total });
      }
      return { data, total };
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
    processRisksByReasonData(dataArr, cb) {
      if (!dataArr || !dataArr.length) {
        return cb();
      }
      var valueArr = dataArr.map(item => {
        if (isNaN(+item.count)) {
          return 0;
        }
        return +item.count;
      });
      var max = Math.max.apply(null, valueArr);
      if (max) {
        max = max * 1.2;
      }
      var indicatorValueArray = [];
      var indicator = dataArr.map(item => {
        var count = +item.count;
        if (isNaN(+item.count)) {
          count = 0;
        }
        indicatorValueArray.push(count);
        var countStr = !count ? "" : count + "个";
        return { text: item.desc + "\n " + countStr, max };
      });
      // if (!max) {
      //   indicator = [];
      // }
      console.log("indicator", indicator, max, indicatorValueArray);
      if (cb) {
        return cb({
          indicator,
          max,
          indicatorValueArray
        });
      }
      return { indicator, max, indicatorValueArray };
    },
    // successFun(){
    // },
    httpRequest(url, params = {}, config = {}, isApend = false) {
      //  merge
      return this.$http(
        url,
        params,
        merge(
          {
            method: "get",
            headers: {
              sessionId: wx.getStorageSync("sessionId")
            }
          },
          config
        ),
        {},
        isApend
      );
    },
    initData() {
      //首页总汇
      console.log(
        "home initData isAuth",
        this.$store.dispatch("isAuth", "mp_index_group")
      );
      if (!this.$store.dispatch("isAuth", "mp_index_group")) {
        return false;
      }
      this.httpRequest("collectdata")
        .then(res => {
          console.log("接口首页");

          console.log(res);

          this.summaryInfo = res.data;
          this.socalinformtion = res.data;
          // this.$nextTick(() => {
          //   if (this.timer) {
          //     clearTimeout(this.timer);
          //     this.timer = null;
          //   }
          //   this.timer = setTimeout(() => {
          //     this.initCharts({
          //       pieOptions: pieFun(
          //         this.processDeviceStatusWithCountsData(
          //           this.summaryInfo.deviceStatusWithCounts
          //         )
          //       ),
          //       barLineOptions: barLineFun(
          //         this.processRiskTimeCountsData(
          //           this.summaryInfo.riskTimeCounts
          //         )
          //       ),
          //       radarOptions: radarFun(
          //         this.processRisksByReasonData(this.summaryInfo.risksByReason)
          //       )
          //     });
          //   }, 500);
          // });
        })
        .catch(res => {
          console.log("res", res);

          this.wuxToptips({ text: "请求汇总信息失败" }, res);
          this.$nextTick(() => {
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.timer = setTimeout(() => {
              this.initCharts({});
            }, 1000);
          });
        });
    }
  },
  created() {
    console.log("home index created");

    // 调用应用实例的方法获取全局数据
    // this.getUserInfo();
  },
  mounted() {
    // wx.navigateTo({
    //   // url: "/pages/me-package/new-social-unit-device/main"
    //   // url: "/pages/me-package/new-social-unit/main"
    //   url: "/pages/me-package/social-unit-mng/main"
    //   // url: "/pages/me-package/user-search/main"
    //   // url: "/pages/me-package/edit-social-unit/main"
    //   // url: "/pages/me-package/new-social-unit-device-step/main",
    //   // url: "/pages/user-mng-package/user-mng/main"
    //   // url: "/pages/user-mng-package/new-user/main"
    // });
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (!this.isMounted) {
      this.timer = setTimeout(() => {
        this.isMounted = true;
      }, 1000);
    }

    console.log("home this.$root.$mp.appOptions", this.$root.$mp.appOptions);
    console.log("home this.$root.$mp.query", this.$root.$mp.query);
    console.log("home index mounted");
    console.warn(
      "home page",
      "this.$root.$mp.appOptions",
      this.$root.$mp.appOptions,
      "this.$root.$mp.query",
      this.$root.$mp.query,
      this
    );

    // if (!wx.getStorageSync("sessionId")) {
    //   wx.redirectTo({ ur: "/pages/user-info/main" });
    // }

    // if (wx.getStorageSync("sessionId")) {
    //   console.log("home mounted initData");
    //   this.initData();
    // } else {
    //   wx.redirectTo({ ur: "/pages/user-info/main" });
    // }

    // this.initData();
    console.log("this.$root", this.$root, this.$root.globalData);
    // wx.reLaunch({url: '/pages/user-info/main', success: ()=>{
    //   wx.navigateBack({delta:1})
    // }})

    // wx.showLoading({
    //     title: '加载中',
    //     mask: true
    //   })
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style scoped>
.total_bol {
  font-family: DIN-Bold;
  font-weight: bold;
  font-size: 24px;
}
._total {
  text-align: center;
  color: #fff;
  font-family: "微软雅黑";
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 50%; */
}
.total_num {
  font-size: 16px;
}

.phi_home {
  height: 240rpx;
  width: 100%;
  background: #fff;
  display: flex;
  border-radius: 40rpx;
  justify-content: space-around;
  align-items: center;
}
.phj_back {
  width: 25%;
  background: linear-gradient(120deg, #8364db 0%, #6777e9 100%);
  height: 120rpx;
  border-radius: 10rpx;
}

.hj_home {
}

.hj_home__socail-unit {
  line-height: 2;
}
.hj_home__socail-unit--label {
  font-size: 15px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(49, 49, 49, 1);
}
.hj_home__socail-unit--value {
  font-size: 24px;
  vertical-align: middle;
  font-family: DIN-Bold;
  font-weight: bold;
  color: rgba(49, 49, 49, 1);
}
.hj_home__device-status {
  width: 100%;
  height: 220px;
}

.hj_home__trouble_work_order_tendency_chart {
  border-top: 1px solid rgba(191, 191, 191, 1);
  width: 100%;
  height: 220px;
  /* height: 220px; */
  /* height: 235px; */
  text-indent: 10px;
  background: rgba(255, 255, 255, 1);
  padding-top: 5px;
  padding-bottom: 0px;
  box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
}
.hj_home__trouble_reason_statistics_chart {
  border-top: 1px solid rgba(191, 191, 191, 1);
  width: 100%;
  height: 220px;
  text-indent: 5px;
  background: rgba(255, 255, 255, 1);
  width: 100%;
  padding-top: 5px;
  padding-bottom: 0px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
}

.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
<style>
.hj_home__div {
  margin-top: 10px;
  background: rgba(255, 255, 255, 1);
  width: 100%;
  text-indent: 10px;
  border-radius: 10px;
  box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
}

.hj_home__trouble__date_picker {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
  /* text-indent: 10px; */
  /* line-height: 2; */
}
</style>