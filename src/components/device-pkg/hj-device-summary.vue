<template>
  <div class="hj-device-summary">
    <wux-white-space></wux-white-space>
    <div class="hj--title">
      <div class="hj-rhombus-icon"></div> &nbsp;基本信息
    </div>
    <div class="hj-device-summary__div hj-device-summary__device-info">
      <!-- <div>所属社会单位：{{deviceInfo.socialUnit}}</div> -->
      <div>设备名称：{{deviceInfo.name}}</div>
      <div>位置：{{deviceInfo.address}}</div>
      <div>状态：{{deviceInfo.status}}</div>
      <div>描述：{{deviceInfo.desc}}</div>
      <div>更新时间：{{deviceInfo.updateTime}}</div>
    </div>
    <wux-white-space></wux-white-space>
    <div class="hj--title">
      <div class="hj-rhombus-icon"></div> &nbsp;数据监控
    </div>
    <wux-white-space></wux-white-space>

    <hjDatePicker
      v-if="isAuth"
      isShowDay
      isShowWeek
      :isShowMonth="false"
      :isShowYear="false"
      :isShowTotal="false"
      :classStr="'hj-device-summary__date_picker'"
      v-model="datePickedVal"
      :dateType.sync="dateType"
      @change-date-type-value="changeDateTypeValue"
    ></hjDatePicker>
    <div class="hj-device-summary__monitor">
      <!-- <div >
      <ec-canvas></ec-canvas>
    </div> -->

      <div style="height: 220px;">
        <ec-canvas
          v-if="isAuth"
          ec-class="hj-device-summary__monitor__chart"
          id="hj-device-summary__monitor__chart"
          canvas-id="hj-device-summary__monitor__chart"
          :ec="lineAreaEc"
        ></ec-canvas>
      </div>

      <radio-group
        class="radio-group"
        @change="radioChange"
      >
        <div
          class="hj-device-summary_monitor__point-data"
          v-for="(measureData,measureIndex) in measureDataList"
          v-if="isShowMore&&true || measureIndex<4"
          :key="measureData.dataId"
          style="padding-top:5px;padding-bottom:5px;border-top: 1rpx solid #ddd;"
        >
          <label class="hj-device-summary_monitor__point-data__item">
            <radio
              :value="measureData.id"
              :checked="measureData.checked"
              color="#886aea"
            />
            <span
              class="hj-device-summary_monitor__point-data__item__title"
              style="font-size: 14px;font-family: PingFang-SC-Bold;font-weight: bold;color: rgba(49, 49, 49, 1);"
            >
              {{measureData.measureName}}
            </span>
            <span
              v-if="measureData.value"
              class="hj-device-summary_monitor__point-data__item__subtitle"
              style="position: absolute;right: 25px;font-size: 13px;font-family: PingFang-SC-Medium;font-weight: 500;color: rgba(80, 101, 234, 1);line-height:2;"
            >
              <span class="hj-device-summary_monitor__point-data__item__subtitle__value">
                {{measureData.value}}
              </span>
              <span class="hj-device-summary_monitor__point-data__item__subtitle__unit">
                {{measureData.unit}}
              </span>
            </span>
          </label>
          <wux-white-space></wux-white-space>
          <hjDeviceSummaryMeasureItemPanel
            v-if="measureData.children&&measureData.children.length"
            v-for="(dataItem, i) in measureData.children"
            :key="dataItem.dataId"
            :dataItem="dataItem"
          ></hjDeviceSummaryMeasureItemPanel>

          <!-- <div v-if="measureData.children&&measureData.children.length">
            <div
              v-for="(measureItem, i) in measureData.children"
              :key="measureItem.dataId"
            >
              <span>{{measureItem.measureName}}</span>
              <span>
                <span>{{measureItem.value}}</span>
                <span>{{measureItem.unit}}</span>
              </span>
            </div>
          </div> -->

        </div>

        <div>
          <wux-white-space></wux-white-space>
          <div style="text-align:center;">
            <span @click="showMore">
              <wux-icon
                v-if="!isShowMore"
                type="ios-arrow-dropdown-circle"
                color="#6678E9"
                style="text-align:center;"
              ></wux-icon>
              <wux-icon
                v-if="isShowMore"
                type="ios-arrow-dropup-circle"
                color="#6678E9"
                style="text-align:center;"
              ></wux-icon>
            </span>
          </div>
          <wux-white-space></wux-white-space>
        </div>
      </radio-group>
    </div>

  </div>
</template>
<script>
import hjDatePicker from "@/components/hj-date-picker.vue";
import hjDeviceSummaryMeasureItemPanel from "@/components/device-pkg/hj-device-summary-measure-item-panel.vue";
import multipleLineAreaFun from "@/lib/echarts/multipleLineArea.js";
import cloneDeep from "lodash/cloneDeep.js";
export default {
  name: "hj-device-summary",
  components: {
    hjDatePicker,
    hjDeviceSummaryMeasureItemPanel
  },
  props: {
    id: {
      type: [Number, String],
      defualt: ""
    },
    deviceId: {
      type: [Number, String],
      defualt: ""
    }
  },
  data() {
    return {
      isShowMore: false,
      isAuth: true,
      lineAreaEc: {
        lazyLoad: true,
        domId: "hj-device-summary__monitor__chart",
        instanceName: "hj-device-summary__monitor__chart",
        // options: multipleLineAreaFun(),
        getOptions: multipleLineAreaFun,
        params: {}
      },
      deviceInfo: {
        name: "name",
        address: "address",
        socialUnit: "socialUnit",
        status: "status",
        desc: "desc",
        updateTime: "updateTime"
      },

      datePickedVal: "",
      dateType: "day",
      startTime: this.$_dayjs().format("YYYY-MM-DD 00:00:00"),
      endTime: this.$_dayjs()
        .add(1, "day")
        .format("YYYY-MM-DD 00:00:00"),

      measureDataList: [],
      currentMeasureDataGroup: "residualCurrents"
      // measureDataList: [
      //   {
      //     id: "currents",
      //     dataId: "2002", //  residualCurrent
      //     measureName: "剩余电流",
      //     value: "1232",
      //     unit: "mA",
      //     type: 1,
      //     checked: false,
      //     children: [
      //       //   {
      //       //     dataId:'',
      //       //     measureName: '',
      //       //     value: '',
      //       //     unit: '',
      //       //     type: '',
      //       //     checked:false
      //       // }
      //     ]
      //   },
      //   {
      //     id: "temperature",
      //     dataId: "temperature", //  temperature
      //     measureName: "温度",
      //     value: "",
      //     unit: "",
      //     type: 1,
      //     checked: false,
      //     children: [
      //       {
      //         dataId: 2003,
      //         measureName: "温度1",
      //         value: "40.42346392152831",
      //         unit: "℃",
      //         type: 1
      //       },
      //       {
      //         dataId: 2004,
      //         measureName: "温度2",
      //         value: "37.44861059822142",
      //         unit: "℃",
      //         type: 1
      //       },
      //       {
      //         dataId: 2005,
      //         measureName: "温度3",
      //         value: "37.334380542393774",
      //         unit: "℃",
      //         type: 1
      //       },
      //       {
      //         dataId: 2006,
      //         measureName: "温度4",
      //         value: "37.4116178387776",
      //         unit: "℃",
      //         type: 1
      //       }
      //     ]
      //   }
      // ]
    };
  },
  computed: {
    seiresNameArr() {
      if (this.measureDataList.length) {
        var currentMeasureItem = this.measureDataList.filter(item => {
          return item.id == this.currentMeasureDataGroup;
        })[0];
        // currentMeasureDataGroup: "residualCurrents"
        if (currentMeasureItem.children && currentMeasureItem.children.length) {
          return currentMeasureItem.children.map(child => {
            return child.measureName;
          });
        } else {
          return [currentMeasureItem.measureName];
        }
      } else {
        return ["剩余电流"];
      }
    }
    // chartParams(){
    //   return {
    //     id: this.id,
    //     deviceId: this.deviceId,
    //     startTime: this.startTime,
    //     endTime: this.endTime,
    //     dataIdsGroup: this.currentMeasureDataGroup.replace(/s$/g, ""),
    //   }
    // }
  },
  watch: {},
  methods: {
    showMore() {
      this.isShowMore = !this.isShowMore;
    },
    radioChange(e) {
      console.log("radioChange", e);
      this.currentMeasureDataGroup = e.mp.detail.value;

      this.measureDataList.forEach(item => {
        if (item.id == this.currentMeasureDataGroup) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      this.questChartData({
        id: this.id,
        deviceId: this.deviceId,
        startTime: this.startTime,
        endTime: this.endTime,
        dataIdsGroup: this.currentMeasureDataGroup
      });
    },
    changeDateTypeValue(dateObj) {
      console.log("changeDateTypeValue", dateObj);

      var startTime = "";
      var endTime = "";
      if (dateObj.type == "day") {
        var dayjsObj = this.$_dayjs(dateObj.value);
        startTime = this.startTime = dayjsObj.format("YYYY-MM-DD 00:00:00");
        endTime = this.endTime = dayjsObj
          .add(1, "day")
          .format("YYYY-MM-DD 00:00:00");
      }
      if (dateObj.type == "week") {
        var dayjsObj = this.$_dayjs(dateObj.value);
        endTime = this.endTime = dayjsObj
          .add(1, "day")
          .format("YYYY-MM-DD 00:00:00");
        startTime = this.startTime = dayjsObj
          .subtract(7, "day")
          .format("YYYY-MM-DD 00:00:00");
      }

      if (startTime && endTime) {
        this.questChartData({
          id: this.id,
          deviceId: this.deviceId,
          startTime,
          endTime
        });
      }
      // this.startTime = startTime;
      // this.endTime = endTime;
    },
    getMeasureDataIds() {
      if (dataObj.curents.length && dataObj.curents.length == 1) {
      } else {
      }
    },
    dealMeasureItem(obj, sourceObj) {
      if (sourceObj.length == 1) {
        var { dataId, measureName, value, unit, type } = sourceObj[0];
        // Object.assign(obj, sourceObj);

        obj.dataId = dataId;
        obj.measureName = measureName;
        obj.value = (+value).toFixed(2);
        obj.unit = unit;
        obj.type = type;
      } else if (sourceObj.length > 1) {
        obj.dataId = sourceObj
          .map(item => {
            // var newItem = Object.assign({},item, {checked: false, children:[]})
            //  obj.children.push(Object.assign({},item, {checked: false, children:[]}))
            item.value = (+item.value).toFixed(2);
            obj.children.push(item);
            return item.dataId;
          })
          .join(",");
        // obj.children = sourceObj;
      }
      console.log("dealMeasureItem", obj);
    },
    proccessMeasureData(dataObj) {
      // if (!Array.isArray(dataArr) || !dataArr.length) {
      //   return [];
      // }
      // http://www.huajiecloud.com:8000/index.php?s=/11&page_id=663
      // dataIdsGroup	否	int	测点参数组，residualCurrent-剩余电流，current-电流，voltage-电压，temperature-温度，totalEnergy-用电量
      // {dataId: 4, measureName: "交流功率", value: "12712.161400169134", unit: "W", type: 1}
      // {dataId: 7, measureName: "电网频率", value: "49.979998882859945", unit: "Hz", type: 1}
      // {dataId: 8, measureName: "功率因数", value: "0.9930999875068665", unit: "", type: 1}
      // {dataId: 12, measureName: "运行状态", value: "--", unit: "", type: 1}
      // {dataId: 30, measureName: "A相电压", value: "236.4060937250033", unit: "V", type: 1}
      // {dataId: 31, measureName: "B相电压", value: "230.49284634180367", unit: "V", type: 1}
      // {dataId: 32, measureName: "C相电压", value: "229.55431575886905", unit: "V", type: 1}
      // {dataId: 33, measureName: "A相电流", value: "35.07757013011724", unit: "A", type: 1}
      // {dataId: 34, measureName: "B相电流", value: "16.032790875062346", unit: "A", type: 1}
      // {dataId: 35, measureName: "C相电流", value: "20.53565062675625", unit: "A", type: 1}
      // {dataId: 2001, measureName: "用电量", value: "3291.088539143093", unit: "kWh", type: 1}
      // {dataId: 2002, measureName: "剩余电流IR", value: "22.735087683424354", unit: "mA", type: 1}
      // {dataId: 2003, measureName: "温度1", value: "40.42346392152831", unit: "℃", type: 1}
      // {dataId: 2004, measureName: "温度2", value: "37.44861059822142", unit: "℃", type: 1}
      // {dataId: 2005, measureName: "温度3", value: "37.334380542393774", unit: "℃", type: 1}
      // {dataId: 2006, measureName: "温度4", value: "37.4116178387776", unit: "℃", type: 1}

      var objTemp = {
        id: "residualCurrents",
        dataId: "dataId",
        measureName: "",
        value: "",
        unit: "",
        type: "",
        checked: false,
        children: []
      };

      // var curents = cloneDeep(objTemp);
      // var residualCurrents = cloneDeep(objTemp);
      // var temperatures = cloneDeep(objTemp);
      // var totalEnergys = cloneDeep(objTemp);
      // var voltages = cloneDeep(objTemp);
      var obj = {};

      Object.keys(dataObj).forEach(key => {
        if (key != "others") {
          obj[key] = cloneDeep(objTemp);
          obj[key].id = key;
          switch (key) {
            case "residualCurrents":
              obj[key].measureName = "剩余电流";
              obj[key].checked =
                this.currentMeasureDataGroup == "residualCurrents" || false;
              this.dealMeasureItem(obj[key], dataObj[key]);
              break;
            case "temperatures":
              obj[key].checked =
                this.currentMeasureDataGroup == "temperatures" || false;
              obj[key].measureName = "温度";
              this.dealMeasureItem(obj[key], dataObj[key]);
              break;
            case "currents":
              obj[key].checked =
                this.currentMeasureDataGroup == "currents" || false;

              obj[key].measureName = "电流";
              this.dealMeasureItem(obj[key], dataObj[key]);
              break;

            case "voltages":
              obj[key].checked =
                this.currentMeasureDataGroup == "voltages" || false;

              obj[key].measureName = "电压";
              this.dealMeasureItem(obj[key], dataObj[key]);
              break;
            case "totalEnergys":
              obj[key].checked =
                this.currentMeasureDataGroup == "totalEnergys" || false;

              obj[key].measureName = "用电量";
              this.dealMeasureItem(obj[key], dataObj[key]);
              break;
          }
        }
      });
      var others = [];
      if (Array.isArray(dataObj["others"]) && dataObj["others"].length) {
        others = dataObj["others"].map((item, index) => {
          item.id = item.dataId;
          item.children = [];
          item.value = (+item.value).toFixed(2);
          item.checked = false;
          return item;
        });
      }

      var result = [
        obj.residualCurrents,
        obj.temperatures,
        obj.currents,
        obj.voltages,
        obj.totalEnergys,
        ...others
      ];
      console.log("proccessMeasureData", result);
      return result;
    },
    proccessDeviceData(data) {
      if (!data) {
        return null;
      }
      var {
        id,
        name,
        address,
        // socialUnit,
        status: statusObj
      } = data;
      var { value: code, desc, updateTime } = statusObj;
      var status = this.getStatusByCode(code);

      return {
        id,
        name,
        address,
        // socialUnit,
        status,
        desc,
        updateTime
      };
    },
    // proccessOneSeriesData(data){
    //   valueArr = logsList.filter(item => {
    //     if(isNaN(+item.value)){
    //         return
    //       }else{
    //         item.value
    //     }
    //     })
    //   // array.reduce(function(total, currentValue, currentIndex, arr))
    //   var max = Math.max.apply(null, valueArr);
    //   var min = Math.min.apply(null, valueArr)
    // },
    getSeriesDataArr({ startTime, endTime, unit, value, timeDataMap }) {
      // endTime =
      //   endTime ||
      //   this.$_dayjs()
      //     .endOf("month")
      //     .add(1, "day")
      //     .format("YYYY-MM-DD 00:00:00");

      endTime = endTime || "2018-11-30 00:00:00";
      startTime = startTime || "2018-11-20 00:00:00";
      timeDataMap = timeDataMap || {};
      // startTime =
      //   startTime ||
      //   this.$_dayjs()
      //     .startOf("month")
      //     .format("YYYY-MM-DD 00:00:00");

      endTime = this.$_dayjs(endTime).set("millisecond", 0);
      startTime = this.$_dayjs(startTime).set("millisecond", 0);
      unit = unit || "MINUTE"; // minute
      unit = unit.toLowerCase();
      value = value || 15;
      var result = {};
      // var map = new Map();
      var result = [];
      while (startTime.isBefore(endTime)) {
        let timeStr = startTime.format("YYYY-MM-DD HH:mm:ss");
        // result[timeStr] =
        var value1 = NaN;
        if (timeDataMap.hasOwnProperty(timeStr)) {
          value1 = timeDataMap[timeStr];
        }
        result.push({ name: timeStr, value: [timeStr, value1] });
        startTime = startTime.add(15, unit);
      }
      return result;
    },
    proccessChartData(data) {
      var measureInfoObj = this.getMeasureNameAndUnit(); // unit 数值单位
      var baseUnit = measureInfoObj.unit;
      var interval = data.interval; // unit: MINUTE, value:15 //时间间隔单位
      var logsList = data.logsList; // []

      var result = {
        unit: baseUnit,
        xAxisName: "",
        yAxisName: measureInfoObj.measureName,
        seriesName: measureInfoObj.measureName,
        xAxisType: "time",
        seiresNameArr: this.seiresNameArr,
        formatter: interval.unit, // Y: year, M: month, D:day, hh:hour, mm: minute, ss:second
        seriesDataArr: []
      };

      if (!Array.isArray(logsList) || !logsList.length) {
        return result;
      }

      var max = undefined;
      var min = undefined;
      var filterLogsList = [];

      logsList.forEach((logs, logIndex) => {
        var logsObj = {}; // map
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

      var seriesDataArr = filterLogsList.map(filterLogs => {
        return this.getSeriesDataArr({
          startTime: this.startTime,
          endTime: this.endTime,
          timeDataMap: filterLogs,
          ...interval
        });
      });

      result.seriesDataArr = seriesDataArr;
      return result;
    },
    getMeasureNameAndUnit() {
      if (!this.measureDataList.length) {
        switch (this.currentMeasureDataGroup) {
          case "residualCurrents":
            return { measureName: "剩余电流", unit: "mA" };
          case "temperatures":
            return { measureName: "温度", unit: "℃" };
          case "currents":
            return { measureName: "电流", unit: "A" };
          case "voltages":
            return { measureName: "电压", unit: "V" };
          case "totalEnergys":
            return { measureName: "用电量", unit: "kWh" };
          default:
            return { measureName: "未知", unit: "" };
            break;
        }
      } else {
        var checkedObj = this.measureDataList.filter(item => {
          return this.currentMeasureDataGroup == item.id;
        })[0];
        return { measureName: checkedObj.measureName, unit: checkedObj.unit };
      }
    },
    setChartData(data) {
      console.log("setChartData", data);
      this.lineAreaEc.params = data;
      // {
      //   unit: data.unit,
      //   xAxisName: "",
      //   yAxisName: measureInfoObj.measureName,
      //   seriesName: measureInfoObj.measureName,
      //   xAxisType: "time",
      //   formatter: 'MINUTE', // Y: year, M: month, D:day, hh:hour, mm: minute, ss:second
      //   seriesDataArr: data.values
      // };

      this.initChart(this.lineAreaEc);
    },
    setDeviceInfoData(obj) {
      if (obj) {
        this.deviceInfo = obj;
      }
    },
    setMeasureData(data) {
      this.measureDataList = data;
    },
    setData({ measureDataList }) {
      this.measureDataList = arr;
    },
    getStatusByCode(code) {
      // 10 正常，20 预警, 30 报警
      switch (code) {
        case 10:
          return "正常";
          break;
        case 20:
          return "预警";
          break;
        case 30:
          return "报警";
          break;
        default:
          return "未知";
          break;
      }
    },
    // questData() {},
    questDeviceInfo(params) {
      this.$http("socialUnitsDevice", params, { method: "get" })
        .then(res => {
          console.log("socialUnitsDevice", res);
          this.setDeviceInfoData(this.proccessDeviceData(res.data));
        })
        .catch(res => {
          console.log("socialUnitsDevice", res);
        });
    },
    questMeasureData(params) {
      this.$http("socialUnitsDevicesRealtimeDataList", params, {
        method: "get"
      })
        .then(res => {
          console.log("socialUnitsDevicesRealtimeDataList", res);
          this.setMeasureData(this.proccessMeasureData(res.data));
        })
        .catch(res => {
          console.log("res", res);
        });
    },
    questChartData(params) {
      var startTime = params.startTime || this.startTime;
      var endTime = params.endTime || this.endTime;
      var deviceId = params.deviceId || this.deviceId;
      var id = params.id || this.id;

      var queryParams = {
        deviceId,
        id,
        startTime,
        endTime,
        year: "",
        month: "",
        day: ""
      };

      var dataIdsGroup = params.dataIdsGroup || this.currentMeasureDataGroup;
      if (isNaN(+dataIdsGroup)) {
        dataIdsGroup = dataIdsGroup.replace(/s$/g, "");
        queryParams.dataIdsGroup = dataIdsGroup;
      } else {
        queryParams.dataIds = +dataIdsGroup;
      }

      this.$http("devicesDataByDataIds", queryParams, { method: "get" })
        .then(res => {
          console.log("devicesDataByDataIds", res);
          this.setChartData(this.proccessChartData(res.data));
        })
        .catch(res => {
          console.log("devicesDataByDataIds", res);
        });
    },
    initData(params) {
      params.id = params.id || this.id || "";
      params.deviceId = params.deviceId || this.deviceId || "";
      if (!params.id || !params.deviceId) {
        return console.error("error: deviceId is not exist");
      }
      this.questDeviceInfo(params);
      this.questMeasureData(params);
      this.questChartData(params);
    },
    // 点击按钮后初始化图表
    initChart(ec) {
      // 绑定图表的必须 ec的 lazyLoad 为true，不会一加载就渲染图表
      if ((!ec.options && !ec.getOptions) || !ec) {
        return;
      }
      // {instanceName: '', domId: '', options}
      // this.dispose(ec.instanceName);
      this.$root.$mp.page
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
    // setTimeout(() => {
    //   this.setChartData([]);
    // }, 1000);
  }
};
</script>
<style lang="scss" scoped>
.hj-device-summary {
  width: 100%;
  padding-right: 10px;
  padding-left: 10px;
  box-sizing: border-box;
  &__div {
    margin-top: 10px;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    text-indent: 10px;
    border-radius: 10px;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
  }
  &__device-info {
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(49, 49, 49, 1);
    padding: 5px;
    box-sizing: border-box;
  }
  &__date_picker {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    /* text-indent: 10px; */
    /* line-height: 2; */
  }
  &__monitor {
    border-top: 1rpx solid #ddd;
    background: rgba(255, 255, 255, 1);
    text-indent: 10px;
    // border-radius: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    &__point-data {
      // padding-top: 15px !important;
      &__item {
        &__title {
          font-size: 14px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: rgba(49, 49, 49, 1);
        }
        &__subtitle {
          font-size: 13px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(80, 101, 234, 1);
          // position: absolute;
          // right: 5px;
          &__value {
          }
          &__unit {
          }
        }
      }
    }
    &__chart {
      width: 100%;
      height: 220px;
    }
  }
}
</style>