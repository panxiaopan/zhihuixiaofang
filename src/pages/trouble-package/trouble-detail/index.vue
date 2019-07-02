<template>
  <div class="hj-trouble-detail">
    <wux-toptips id="wux-toptips1" />
    <div
      v-if="!isAuth&&isMounted"
      style="height:100%;width:100%;position:relative: z-index:11111;"
    >
      <button @click="jumpToLogin">
        暂无权限查看,点击重新授权登录
      </button>
    </div>
    <div
      v-if="isAuth"
      class="hj-trouble-detail--title"
    >
      <div class="hj-rhombus-icon"></div> &nbsp;隐患历史趋势图
    </div>
    <wux-white-space></wux-white-space>
    <div
      v-if="isAuth"
      class="hj-trouble-detail--shadow-box hj-trouble-detail--top-radius hj-trouble-detail__history-head"
    >
      <wux-row class="hj-trouble-detail__history-head__title--label">
        <wux-col span="6">
          隐患等级：{{troubleAlarmInfo.grade}}
        </wux-col>
        <wux-col
          class="hj-trouble-detail__history-head__title--postfix"
          span="6"
          style="text-align: right;"
        >
          {{troubleAlarmInfo.dateTime}}
        </wux-col>
      </wux-row>
      <wux-white-space></wux-white-space>
      <div class="hj-trouble-detail__history-head__desc">
        隐患描述：{{troubleAlarmInfo.desc}}
      </div>
    </div>
    <!-- hj-trouble-detail--shadow-box hj-trouble-detail--bottom-radius -->

    <ec-canvas
      v-if="showChart"
      class="hj-trouble-detail__history-chart hj-trouble-detail--shadow-box hj-trouble-detail--bottom-radius"
      id="hj-trouble-detail__history-chart"
      :ec="lineAreaEc"
      canvas-id="hj-trouble-detail__history-chart"
    >
    </ec-canvas>

    <wux-white-space size="large"></wux-white-space>
    <div
      v-if="isAuth"
      class="hj-trouble-detail--title"
    >
      <div class="hj-rhombus-icon"></div> &nbsp;设备实时数据
    </div>
    <wux-white-space></wux-white-space>

    <div
      v-if="isAuth"
      class="hj-trouble-detail__device-data hj-trouble-detail--shadow-box hj-trouble-detail--radius"
    >
      <div class="hj-trouble-detail__device-data__state">状态：{{basicInfo.deviceStatus.desc}}</div>
      <wux-white-space></wux-white-space>
      <wux-grids
        bordered
        col=4
      >
        <!-- wux-grid[label=weapp$]*24 -->
        <wux-grid
          v-for="(itm, index) in deviceRealtiemDataList"
          :label="itm"
          :key="index"
        ></wux-grid>
      </wux-grids>
    </div>
    <wux-white-space size="large"></wux-white-space>

    <div
      v-if="isAuth"
      class="hj-trouble-detail--title"
    >
      <div class="hj-rhombus-icon"></div> &nbsp;基本信息
    </div>
    <wux-white-space></wux-white-space>

    <div
      v-if="isAuth"
      class="hj-trouble-detail__base-info hj-trouble-detail--shadow-box hj-trouble-detail--radius"
    >
      <div class="hj-trouble-detail__base-info__content hj-trouble-detail__base-info__content__location">设备位置：{{basicInfo.device.address}}</div>
      <div
        class="hj-trouble-detail__base-info__content hj-trouble-detail__base-info__content--heightlight"
        @click.stop="clickDevice"
      >设备名称：{{basicInfo.device.name}}</div>
      <div
        class="hj-trouble-detail__base-info__content hj-trouble-detail__base-info__content--heightlight"
        @click.stop="clickSocialUnit"
      >社会单位：{{basicInfo.socialUnit.name}}</div>
      <div class="hj-trouble-detail__base-info__content hj-trouble-detail__base-info__content__address">单位地址：{{basicInfo.socialUnit.address}}</div>
      <wux-white-space></wux-white-space>
      <wux-row class="hj-trouble-detail__base-info__ft">
        <wux-col
          class="hj-trouble-detail__base-info__ft__lt"
          span=6
        >
          <img
            :src="linkedIcon"
            style="height: 18px;width:18px;vertical-align:middle;"
            alt=""
          >
          <span style="vertical-align:middle;">
            {{basicInfo.socialUnit.manResponsibleForFireSecurity.name}}
          </span>
        </wux-col>
        <wux-col
          class="hj-trouble-detail__base-info__ft__rt"
          span=6
        >
          <span class="hj-trouble-detail__base-info__ft__rt__phone">{{basicInfo.socialUnit.manResponsibleForFireSecurity.tel}}</span>&nbsp;
          <img
            class="hj-trouble-detail__base-info__ft__rt__icon"
            :src="phoneIcon"
            alt="phone"
            @click="callPhone"
          >
        </wux-col>
      </wux-row>
    </div>
    <wux-white-space size="large"></wux-white-space>

    <div
      v-if="isAuth&&imagesList&&imagesList.length"
      class="hj-trouble-detail--title"
    >
      <div class="hj-rhombus-icon"></div> &nbsp;图片
    </div>
    <wux-white-space v-if="imagesList.length"></wux-white-space>
    <div v-if="isAuth&&imagesList&&imagesList.length">
      <img
        v-for="images in imagesList"
        :key="images"
        mode="aspectFit"
        :src="images"
        alt=""
        style="height:36px;width:64px;"
        @click="previewImage(imagesList, images)"
      >
    </div>
    <div
      v-if="isAuth&&attachedWorkOrderId"
      class="hj-trouble-detail--title"
    >
      <div class="hj-rhombus-icon"></div> &nbsp;关联工单流程
    </div>
    <wux-white-space></wux-white-space>
    <hj-flow-state
      v-if="isAuth&&isShowFlowState"
      :flowStateCode="flowStateCode"
      :orderList="orderList"
      :isSpread.sync="isSpread"
    ></hj-flow-state>
    <wux-floating-button
      v-if="isAuth&&buttons&&buttons.length"
      position="bottomRight"
      theme="royal"
      :buttons="buttons"
      @iclick="handleTrouble"
      @change="onChange"
    />

    <div
      v-if="isAuth&&dealer"
      class="hj-trouble-detail--title"
    >
      <div class="hj-rhombus-icon"></div>
      <span style="font-size: 14px;font-family: PingFang-SC-Medium;font-weight: 500;color: rgba(49, 49, 49, 1);">
        &nbsp;处理人信息
      </span>
    </div>
    <wux-white-space></wux-white-space>
    <wux-row
      v-if="isAuth&&dealer"
      wux-class="hj-trouble-detail__dealer hj-trouble-detail--shadow-box hj-trouble-detail--radius"
      style="width:100%;"
    >
      <wux-col span=8>
        <div style="font-size: 14px;font-family: PingFang-SC-Medium;font-weight: 500;color: rgba(49, 49, 49, 1);">
          {{solutionStr}}
        </div>
      </wux-col>
      <wux-col
        span=4
        style="text-align:right;"
      >
        <div style="font-size: 14px;font-family: PingFang-SC-Medium;font-weight: 500;color: rgba(49, 49, 49, 1);">
          {{time}}
        </div>
      </wux-col>
    </wux-row>
    <!-- <div class="hj-trouble-detail__navigator">
      <button class="hj-trouble-detail__navigator__btn" v-for="li in navigatorList" @click="handleTrouble(li)" size="mini" :key="li">{{li.name}}</button>
    </div> -->

  </div>
</template>
<script>
// import lineAreaFun from "@/lib/echarts/lineArea.js";
import barFun from "@/lib/echarts/bar.js";
import hjFlowState from "@/components/common/hj-flow-state.vue";
import wuxToptips from "@/mixins/wuxToptips.js";
import hjIcon from "@/mixins/hjIcon.js";
import getSeriesTimeDataArr from "@/mixins/getSeriesTimeDataArr.js";
import API from '@/store/flyio/apiUrl/home.js';

// const icon =
//   "data:image/png;base64,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";

import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import cloneDeep from "lodash/cloneDeep.js";
import multipleLineAreaFun from "@/lib/echarts/multipleLineArea.js";
export default {
  onShareAppMessage,
  onShow(e) {
    console.warn(
      "trouble-detail onShow this.$root.$mp.appOptions",
      JSON.stringify(this.$root.$mp.appOptions)
    );
    console.warn(
      "trouble-detail onShow this.$root.$mp.query",
      JSON.stringify(this.$root.$mp.query)
    );

    console.warn("trouble-detail onShow this.isMounted", this.isMounted);
    if (this.$root.$mp.appOptions.query.from == "previewImage") {
      this.$root.$mp.appOptions.query.from = "";
      return;
    }
    if (this.isMounted) {
      var params = this.$root.$mp.appOptions.query.params;
      if (params && params.attachedWorkOrderId) {
        var attachedWorkOrderId = this.$root.$mp.appOptions.query.params
          .attachedWorkOrderId;
        this.attachedWorkOrderId = attachedWorkOrderId;
        this.initDataParams.attachedWorkOrderId = attachedWorkOrderId;
        this.$root.$mp.appOptions.query.params = null;
        params = null;
      }
      console.warn("this, ", this);
      console.warn(
        "this.$root.$mp.appOptions.query",
        this.$root.$mp.appOptions.query
      );

      if (params && params.dealer) {
        var { dealer, time, desc } = params;
        this.dealer = dealer;
        this.time = time;
        this.desc = desc;
        this.$root.$mp.appOptions.query.params = null;
        params = null;
      }

      this.initDataParams && this.initData(this.initDataParams);
    }
  },
  onHide() {
    console.log("this.$root.$mp", this.$root.$mp);

    console.log("onhide");
  },
  onUnload() {
    console.log("this.$root.$mp", this.$root.$mp);

    this.isMounted = false;
    console.log("onUnload");
  },
  name: "trouble-detail",
  mixins: [wuxToptips, hjIcon, getSeriesTimeDataArr],
  components: {
    hjFlowState
  },
  computed: {
    showChart(){
        if(!this.isAuth) return false
        if(this.fromManualReport) return false
        return this.hasAssociatedDataId
    },
    isAuth() {
      // mp_risk_risk_detail_view
      return (
        this.$store.state.userPermissionsMap &&
        this.$store.state.userPermissionsMap["mp_risk_risk_detail_view"]
      );
    },
    solutionStr() {
      return this.dealer + "：" + this.desc;
      // + '， ' + this.time;
    },
    deviceRealtiemDataList() {
      var arr = [];
      this.deviceRealtiemDataArrObj.forEach(item => {
        if (!item.measureName)
          return

        let value = '--'
        if (item.type == 2) //开关量
          value = item.value
        else if(item.type == 1 && item.value)
          value = (+item.value).toFixed(2)

        arr.push(item.measureName)
        arr.push(value + ' ' + item.unit)
      })
      console.log('deviceRealtiemDataList,', arr)
      return arr;
    },
    isShowFlowState() {
      return this.attachedWorkOrderId && this.orderList.length;
    },
    // isShowSolution() {
    //   // console.log(
    //   //   'this.buttons',
    //   //   this.buttons,
    //   //   this.dealer,
    //   //   this.attachedWorkOrderId
    //   // );
    //   // return !!this.buttons.length;
    //   return this.attachedWorkOrderId || this.dealer;
    //   // return false;
    // },
    buttons() {
      if (!this.dealer && !this.attachedWorkOrderId) {
        // if (!this.isShowSolution) {
        return [
          // {
          //   label:
          //   value:
          //   url: ''
          //   icon
          // }
          {
            label: "派单",
            id: "troubleDispatchList",
            // url: "/pages/trouble-dispatch-list/main",
            url: "../trouble-dispatch-list/main",
            permission: "mp_risk_start_work_order",
            icon: this.hjIconDispatch
          },

          {
            label: "新建维保",
            id: "troubleNewMaintenance",
            // url: "/pages/trouble-new-maintenance/main",
            url: "../trouble-new-maintenance/main",
            permission: "mp_risk_start_maintenance_order",
            icon: this.hjIconMaintain
          },
          {
            label: "意见处理",
            id: "troubleDisposeComments",
            // url: "/pages/trouble-dispose-comments/main",
            url: "../trouble-dispose-comments/main",
            permission: "mp_risk_add_handling_opinions",
            icon: this.hjIconRemark
          }
        ];
      } else {
        return [];
      }
    }
  },
  data() {
    return {
      hasAssociatedDataId: true, //是否有关联的dataId，用于决定是否要显示chart
      fromManualReport: true,
      imagesList: [],
      // markPointDataObj: null,
      orderList: [],
      isSpread: false,
      isMounted: false,
      initDataParams: null,
      linkedIcon: "../../../static/images/common/me@2x.png",
      phoneIcon: "../../../static/images/common/phone_light@3x.png",
      flowStateCode: 3,
      attachedWorkOrderId: false,
      troubleAlarmInfo: {
        grade: "报警",
        dateTime: this.$_dayjs().format("YYYY-MM-DD HH:mm:ss"),
        desc: "xxxx"
      },
      residualCurrents: {},
      deviceRealtiemDataArrObj: [],
      basicInfo: {
        deviceStatus: {
          desc: "正常"
        },
        device: {
          address: "device address",
          name: "device name",
          id: "device id"
        },
        socialUnit: {
          id: "id",
          name: "name",
          address: "address",
          manResponsibleForFireSecurity: { name: "fsfd", tel: 136734345 }
        }
      },
      process: {},
      current: 3,

      navigatorList: [
        {
          name: "派单",
          id: "troubleDispatchList",
          // url: "/pages/trouble-dispatch-list/main"
          url: "../trouble-dispatch-list/main"
        },
        {
          name: "意见处理",
          id: "troubleDisposeComments",
          // url: "/pages/trouble-dispose-comments/main"
          url: "../trouble-dispose-comments/main"
        },
        {
          name: "新建维保",
          id: "troubleNewMaintenance",
          // url: "/pages/trouble-new-maintenance/main"
          url: "../trouble-new-maintenance/main"
        }
      ],

      lineAreaEc: {
        lazyLoad: true,
        // options: lineAreaFun()
        domId: "hj-trouble-detail__history-chart",
        instanceName: "hj-trouble-detail__history-chart",
        getOptions: multipleLineAreaFun,
        params: {}
      },
      dealer: "",
      desc: "",
      time: "",
      commonQueryParams: {
        sourceId: "", // 创建 派单， 维保等需要用到参数
        sourceTime: "", // 创建 派单， 维保等需要用到参数
        desc: "" // 创建默认工单标题需要用到的参数 // 报警描述
      }
    };
  },
  methods: {
    clickDevice() {
      console.log("clickDevice", this.basicInfo);
      wx.navigateTo({
        url:
          "/pages/device-package/home/main?deviceId=" +
          this.basicInfo.device.id +
          "&name=" +
          this.basicInfo.device.name +
          "&currentTab=summary&id=" +
          this.basicInfo.socialUnit.id +
          "&socialUnitName=" +
          this.basicInfo.socialUnit.name
      });
    },
    clickSocialUnit() {
      console.log("this.basicInfo", this.basicInfo);
      wx.navigateTo({
        url:
          "/pages/social-unit-package/home/main?id=" +
          this.basicInfo.socialUnit.id +
          "&name=" +
          this.basicInfo.socialUnit.name +
          "&currentTab=summary"
      });
    },
    previewImage(imagesList, images) {
      wx.previewImage({
        urls: imagesList,
        current: images,
        complete: res => {
          console.log("previewImage complete");
          this.$root.$mp.appOptions.query.from = "previewImage";
        }
      });
    },
    callPhone() {
      var tel = this.basicInfo.socialUnit.manResponsibleForFireSecurity.tel;
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
    onChange(e) {
      console.log("onChange", e);
    },
    handleTrouble(e) {
      console.log("handleTrouble", e);
      var selectedItem = e.mp.detail.value;
      var permission = selectedItem.permission;
      // var btnItem = this.buttons[e.mp.detail.index];
      var url = selectedItem.url;
      var { sourceId, sourceTime, desc } = this.commonQueryParams;
      url =
        url +
        "?sourceId=" +
        sourceId +
        "&sourceTime=" +
        sourceTime +
        "&deviceName=" +
        this.basicInfo.device.name +
        "&socialUnitName=" +
        this.basicInfo.socialUnit.name +
        "&desc=" +
        desc;

      console.log(
        "home initData isAuth",
        this.$store.dispatch("isAuth", "mp_risk_start_work_order")
      );
      if (!this.$store.dispatch("isAuth", permission || "")) {
        return false;
      }

      wx.navigateTo({ url });
      // /risks/reportArtificially
    },
    proccessRealtimeData(dt) {
      console.log("proccessRealtimeData", dt);
      return dt.realtimeDatas;
    },

    getSeriesDataItemArr(item) {
      // return [
      //   item.time,
      //   item.value == "NaN" || isNaN(+item.value) ? 0 : (+item.value).toFixed(2)
      // ];
      return {
        name: item.time,
        value: [item.time, item.value]
      };
    },
    processChartData(alarmDataTimeValues, alarmPointObj) {
      // alarmTime
      // alarmPointObj // time, value, unit
      var { unit, logsList, interval } = alarmDataTimeValues;
      var chartParams = {
        // seriesData: [],
        // markPointData: [],
        unit,
        seriesDataArr: [],
        // scatterObj: {
        //   data: [
        //     { name: alarmPointObj.time },
        //     [alarmPointObj.time, alarmPointObj.value]
        //   ],
        //   unit: alarmPointObj.unit
        // },
        max: null
        // markPointData: []
        // seiresNameArr: this.seiresNameArr,
        // formatter: "minute", // Y: year, M: month, D:day, hh:hour, mm: minute, ss:second
      };

      if (
        !logsList ||
        !logsList.length ||
        !logsList[0] ||
        !logsList[0].length
      ) {
        return chartParams;
      }
      //
      var max = undefined;
      var min = undefined;
      var filterLogsList = [];
      // var dealArr = [];
      // 过滤 非NaN的值， 并获取多数组的每个数组中的最大值，最小值。
      logsList.forEach((logs, logIndex) => {
        var logsObj = {}; // map
        // max = undefined; //当开启时为每个数组中的最大值，最小值，未开启时为多个数组之间的比较
        // min = undefined;
        max = logs.reduce((total, currentLog, index, arr) => {
          if (total == undefined || isNaN(+total)) {
            if (!isNaN(+currentLog.value)) {
              logsObj[currentLog.time] = +currentLog.value;
              min = +currentLog.value;
            }
            return +currentLog.value;
          } else if (!isNaN(+currentLog.value)) {
            logsObj[currentLog.time] = +currentLog.value;
            min = +total < +currentLog.value ? +total : +currentLog.value;
            return +total > +currentLog.value ? +total : +currentLog.value;
          } else {
            return +total;
          }
        }, max);
        filterLogsList.push(logsObj);
      });

      chartParams.seriesDataArr = logsList.map((logs, index) => {
        return logs.map((log, logIndex) => {
          return this.getSeriesDataItemArr(log);
        });
      });

      console.log("max, min", max, min);
      console.log("chartParams", chartParams);
      if (!max && !min) {
        console.error("value has problem");
        return;
      }
      chartParams.max = Math.ceil(max * 1.5);
      console.log("chartParams", chartParams);
      // chartParams.seriesData.push(this.getSeriesDataItemArr(alarmPointObj));
      return chartParams;
    },
    // formatValueByUnit() {},
    // getMarkPointDataObj() {
    //   return { name: '', value: '', coord: [] };
    // },
    setData(data) {
      console.log("setData", data);
      if (data.alarmDataTimeValues) {
        this.hasAssociatedDataId = true
      }else{
        this.hasAssociatedDataId = false
      }
      this.basicInfo = data.basicInfo;
      this.fromManualReport = data.fromManualReport;
      this.troubleAlarmInfo.grade = data.riskGrade.desc;
      // set imagesList
      var riskDesc = data.riskDesc;
      var attachmentUrls = riskDesc.attachmentUrls;
      var imagesList = [];
      if (
        attachmentUrls &&
        Array.isArray(attachmentUrls) &&
        attachmentUrls.length
      ) {
        attachmentUrls.forEach(item => {
          let url = API.requestDomain + item;
          imagesList.push(url);
        });
      }
      this.imagesList = imagesList;

      this.troubleAlarmInfo.dateTime = riskDesc.alarmTime;
      var alarmValueUnit = riskDesc.alarmValueUnit;
      var alarmValueStr =
        (alarmValueUnit &&
          alarmValueUnit.value &&
          (+alarmValueUnit.value).toFixed(2)) ||
        "";
      var alarmUnitStr = (alarmValueUnit && alarmValueUnit.unit) || "";
      var alarmDataMeasureNamesStr =
        (riskDesc.alarmDataMeasureNames &&
          riskDesc.alarmDataMeasureNames.length == 1 &&
          riskDesc.alarmDataMeasureNames[0]) ||
        "";
      var markPointData = [];

      if (riskDesc.alarmTime && alarmValueStr) {
        markPointData.push({
          name: riskDesc.description + alarmDataMeasureNamesStr,
          value: alarmValueStr + alarmUnitStr,
          coord: [riskDesc.alarmTime, alarmValueStr]
        });
      }
      var descWithComma = riskDesc.description
        ? riskDesc.description + ", "
        : "";
      var alarmDataMeasureNamesStrWithColon = alarmDataMeasureNamesStr
        ? alarmDataMeasureNamesStr + ":"
        : "";
      this.troubleAlarmInfo.desc =
        descWithComma +
        alarmDataMeasureNamesStrWithColon +
        alarmValueStr +
        alarmUnitStr;
      // 保存告警描述
      this.commonQueryParams.desc = riskDesc.description;

      this.deviceRealtiemDataArrObj = this.proccessRealtimeData(
        data.realtimeData
      );
 
      if (!data.fromManualReport) {
        var alarmDataMeasureNames =
          riskDesc.alarmDataMeasureNames.length > 1
            ? ""
            : riskDesc.alarmDataMeasureNames[0];

        this.lineAreaEc.params = {
          unit: data.alarmDataTimeValues.unit || "--",
          xAxisType: "time",
          yAxisName: alarmDataMeasureNames,
          seriesName: alarmDataMeasureNames,
          seiresNameArr: riskDesc.alarmDataMeasureNames,
          xAxisName: "",
          ...this.processChartData(data.alarmDataTimeValues, {
            time: riskDesc.alarmTime,
            value: alarmValueStr,
            unit: alarmUnitStr,
            name: riskDesc.description + alarmDataMeasureNamesStr
          }),
          scatterObj: {
            data: [
              { name: riskDesc.alarmTime },
              [riskDesc.alarmTime, alarmValueStr]
            ],
            unit: alarmUnitStr,
            name: riskDesc.description + alarmDataMeasureNamesStr
          }
          // markPointData
          // tooltipFormatter: '{c0}\n{c1}',
          // markLineData: [
          //   {
          //     // name: riskDesc.description + alarmDataMeasureNamesStr,
          //     // value: alarmValueStr + alarmUnitStr,
          //     coord: [riskDesc.alarmTime, alarmValueStr + ""]
          //   }
          // ]
        };
        this.$nextTick(() => {
          wx.nextTick(() => {
            this.initChart(this.lineAreaEc);
          });
        });
      }
    },
    // processOrderListData(dataArr) {
    //   if (!dataArr || !dataArr.length) {
    //     return [];
    //   }
    //   // actioner, action, time , status , title
    //   // [{title, desc, time, finish, id, }]
    //   // var result = []
    //   return dataArr.reverse().map((item, index) => {
    //     if (!index) {
    //       console.log(item);
    //     }
    //     return {
    //       title: item.name,
    //       id: item.id,
    //       startTime: item.startTime,
    //       endTime: item.endTime,
    //       status: item.finished ? 'finish' : 'wait',
    //       desc: item.actioners[0].name + ', ' + item.bizStateShow.desc,
    //       icon: dataArr.length - 1 == index ? 'ios-arrow-up' : 'ios-checkmark',
    //       randomId: Math.random().toFixed(10)
    //     };
    //   });
    // },
    processOrderListData(dataArr) {
      if (!dataArr || !dataArr.length) {
        return [];
      }
      // actioner, action, time , status , title
      // [{title, desc, time, finish, id, }]
      var result = [];
      dataArr.reverse().forEach((item, index) => {
        if (!index) {
          console.log(item);
        }
        var li = {
          title: item.name,
          id: item.id || (Math.random() * 1000).toFixed(2),
          startTime: item.startTime,
          endTime: item.endTime,
          status: item.finished ? "finish" : "wait",
          desc: item.actioners[0].name + ", " + item.bizStateShow.desc,
          attachments: [],
          icon: dataArr.length - 1 == index ? "ios-arrow-up" : "ios-checkmark",
          finished: item.finished,
          randomId: Math.random().toFixed(10)
        };

        if ((item.comments && item.comments.length == 0) || !item.comments) {
          result.push(li);
        }
        if (item.comments && item.comments.length == 1) {
          li.desc = li.desc + item.comments[0].remark;
          // li.attachments = item.comments[0].attachments;
          item.comments[0].attachments.forEach(atch => {
            if (atch.url) {
              li.attachments.push(
                API.requestDomain + atch.url
              );
            }
            // return 'http://tmp/' + atch.name;
          });

          result.push(li);
        }
        if (item.comments && item.comments.length > 1) {
          item.comments.forEach((com, comIndex) => {
            var cloneLi = cloneDeep(li);
            cloneLi.randomId = Math.random().toFixed(10);
            cloneLi.attachments = com.attachments;
            if (comIndex == 0) {
              cloneLi.desc = cloneLi.desc + com.remark;
            } else {
              cloneLi.startTime = com.time;
              cloneLi.endTime = com.time;
              // cloneLi.status = finish
              cloneLi.desc = com.actionerName + ", " + com.remark;
              // cloneLi.icon =
              // cloneLi.finished =
            }
            result.push(cloneLi);
          });
        }
      });
      return result;
    },
    initData(params) {
      console.log("initData, ", params)      
      this.$http("risksById", params, { method: "get" })
        .then(res => {
          console.log("risksById", res);
          this.setData(res.data);
        })
        .catch(res => {
          console.log("请求隐患详情失败：", res);
          this.wuxToptips({ text: "请求隐患详情失败：" }, res);
        });

      if (params.attachedWorkOrderId) {
        if (params.attachedWorkOrderId == "undefined") {
          return;
        }
        // 请求工单流程数据
        this.$http(
          "flowDetail",
          { id: params.attachedWorkOrderId },
          { method: "get" }
        )
          .then(res => {
            console.log("flowDetail success", res);
            this.orderList = this.processOrderListData(res.data.taskInfo);
            console.log("this.orderList", this.orderList);
            console.log("this.attachedWorkOrderId", this.attachedWorkOrderId);

            this.flowStateCode = res.data.workOrderVO.flowStateCode;
          })
          .catch(res => {
            console.log("flowDetail failed", res);
            this.wuxToptips({ text: "请求工单流程失败：" }, res);
          });
      }
    },
    // 点击按钮后初始化图表
    initChart(ec) {
      if(!this.showChart)
        return
        
      // 绑定图表的必须 ec的 lazyLoad 为true，不会一加载就渲染图表
      if ((!ec.options && !ec.getOptions) || !ec) {
        return;
      }
      // {instanceName: '', domId: '', options}
      // this.dispose(ec.instanceName);
      this.$mp.page
        .selectComponent("#" + ec.domId)
        .init((echarts, canvas, width, height) => {
          height = height || "220px";
          // 获取组件的 canvas、width、height 后的回调函数
          // 在这里初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });

          chart.setOption(
            ec.options || ec.getOptions(ec.params || {}, echarts)
          );
          // // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
          // this[ec.instanceName] = chart;

          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          return chart;
        });
    }
  },
  mounted() {
    // this.isMounted = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (!this.isMounted) {
      this.timer = setTimeout(() => {
        this.isMounted = true;
      }, 1000);
    }
    console.warn("trouble-detail mounted");
    console.warn(
      "trouble-detail this.$root.$mp.appOptions",
      this.$root.$mp.appOptions
    );
    console.warn("trouble-detail this.$root.$mp.query", this.$root.$mp.query);
    var appQuery = this.$root.$mp.appOptions.query;
    var query = this.$root.$mp.query;
    if (appQuery.from == "officialAccount") {
      var { id, eventTime, attachedWorkOrderId, dealer, time, desc } = appQuery;
      appQuery.from = "";
    } else {
      if (query.from == "officialAccount") {
        query.from = "";
      }
      var { id, eventTime, attachedWorkOrderId, dealer, time, desc } = query;
    }

    if (process.env.NODE_ENV == "development") {
      id = id || 2513;
      eventTime = eventTime || "2018-10-23 23:47:00";
      attachedWorkOrderId = attachedWorkOrderId || "";
    }

    this.dealer = dealer == "undefined" || !dealer ? "" : dealer;
    this.time = time == "undefined" || !time ? "" : time;
    this.desc = desc == "undefined" || !desc ? "" : desc;
    // 处理描述

    this.commonQueryParams = { sourceId: id, sourceTime: eventTime };
    this.attachedWorkOrderId =
      attachedWorkOrderId == "undefined" || !attachedWorkOrderId
        ? ""
        : attachedWorkOrderId;

    if (id && eventTime) {
      this.initDataParams = { id, eventTime, attachedWorkOrderId };
      this.initData(this.initDataParams);
    }

    console.log(
      "attachedWorkOrderId dealer",
      this.dealer,
      this.attachedWorkOrderId
    );
  }
};
</script>
<style lang="scss">
.hj-rhombus-icon {
  display: inline-block;
  width: 11px;
  height: 11px;
  background-color: rgba(243, 134, 81, 1);
  transform: rotate(45deg);
}
.hj-trouble-detail {
  // .wux-step__thumb {
  //   color: red;
  // }
  padding: 12px 12px 45px 12px;
  background-color: #f4f7fb;
  font-family: PingFang-SC-Medium;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  // width: 100wh;
  min-height: 100vh;
  box-sizing: border-box;
  &--radius {
    border-radius: 12px;
  }
  &--top-radius {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  &--bottom-radius {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  &--shadow-box {
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    padding: 10px;
    width: 100%;
  }
  &--title {
    width: 100%;
    text-indent: 10px;
    font-size: 16px;
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: rgba(49, 49, 49, 1);
  }

  &__history-head {
    padding: 10px;
    border-bottom: 1rpx solid #ddd;
    &__title {
      &--label {
        font-size: 14px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(234, 35, 20, 1);
      }
      &--postfix {
        font-size: 12px;
        font-family: DIN-Regular;
        font-weight: 400;
        color: rgba(49, 49, 49, 1);
      }
    }
    &__desc {
      font-size: 12px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(49, 49, 49, 1);
    }
  }

  &__history-chart {
    // border-top: 1px solid rgba(191, 191, 191, 1);

    // height: 220px;
    height: 283px;
    text-indent: 5px;
    background: rgba(255, 255, 255, 1);

    padding-top: 5px;
    padding-bottom: 5px;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
  }

  &__device-data {
    // display: flex;
    // flex-direction: column;
    &__state {
      font-size: 14px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(49, 49, 49, 1);
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
  &__navigator {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-left: -12px;
    position: fixed;
    bottom: 10px;
    z-index: 2;
    &__btn {
      background-color: #6678e9;
      color: #fff;
      font-size: 14px;
      min-width: 25%;
    }
  }
  &__dealer {
  }
}
</style>
