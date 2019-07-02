<template>
  <div class="hj-smoke-detector">
    <wux-white-space></wux-white-space>
    <div class="hj--title">
      <div class="hj-rhombus-icon"></div>&nbsp;基本信息
    </div>
    <div class="hj-smoke-detector__div hj-smoke-detector__device-info">
      <wux-white-space></wux-white-space>
      <wux-row gutter="0">
        <wux-col span="4">
          <div class="hj--context">设备状态: {{deviceInfo.status.desc}}</div>
        </wux-col>
        <wux-col span="8">
          <div class="hj--context">更新时间: {{deviceInfo.status.updateTime}}</div>
        </wux-col>
      </wux-row>
      <wux-white-space></wux-white-space>
      <wux-row>
        <wux-col span="5">
          <div
            class="hj-smoke-detector__circle hj-smoke-detector__pading"
            :style="{backgroundColor:statusColor}"
          >
            <div class="hj-smoke-detector__circle_text">{{deviceInfo.status.desc}}</div>
          </div>
        </wux-col>

        <wux-white-space></wux-white-space>
        <wux-col span="7">
          <div class="hj--context">名称: {{deviceInfo.name}}</div>
          <wux-white-space></wux-white-space>
          <div class="hj--context">品牌: {{deviceInfo.brandName}}</div>
          <wux-white-space></wux-white-space>
          <div class="hj--context">型号: {{deviceInfo.modelName}}</div>
          <wux-white-space></wux-white-space>
          <div class="hj--context">位置: {{deviceInfo.address}}</div>
        </wux-col>
      </wux-row>
      <wux-white-space></wux-white-space>
      <!-- 增加一条横线 -->
      <!-- <div class="hj-smoke-detector__pading">
      <div class="hj-smoke-detector__line"></div>
      </div>-->
    </div>

    <wux-white-space></wux-white-space>
    <div class="hj--title">
      <div class="hj-rhombus-icon"></div>&nbsp;参数信息
    </div>
    <wux-white-space></wux-white-space>
    <div class="hj-smoke-detector__div hj-smoke-detector__device-info">
      <!-- 参数分两列显示 -->
      <wux-row>
        <wux-col span="6">
          <div v-for="curItem in realTimeData_left" :key="curItem.dataId">
            <div class="hj--context">{{curItem.measureName}}: {{curItem.value}}{{curItem.unit}}</div>
            <wux-white-space></wux-white-space>
          </div>
        </wux-col>
        <wux-col span="6">
          <div v-for="curItem in realTimeData_right" :key="curItem.dataId">
            <div class="hj--context">{{curItem.measureName}}: {{curItem.value}}{{curItem.unit}}</div>
            <wux-white-space></wux-white-space>
          </div>
        </wux-col>
      </wux-row>
    </div>
  </div>
</template>
<script>
import hjDatePicker from "@/components/hj-date-picker.vue";
import multipleLineAreaFun from "@/lib/echarts/multipleLineArea.js";

import cloneDeep from "lodash/cloneDeep.js";

export default {
  name: "hj-smoke-detector-summary",
  components: {
    hjDatePicker //,
    //  hjDeviceSummaryMeasureItemPanel
  },
  mixins: [],
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
      realTimeData: [],
      realTimeData_left: [],
      realTimeData_right: [],
      deviceInfo: {
        name: "",
        address: "",
        brandName: "",
        modelName: "",
        updateTime: "",
        type: "",
        status: {
          value: 10,
          desc: "正常",
          updateTime: "2018-09-28 09:04:16"
        }
      }
    };
  },
  computed: {
    statusColor() {
      // 10 正常，20 预警, 30 报警
      switch (this.deviceInfo.status.value) {
        case 10:
          return  'rgb(0, 178, 106)';
          // return  '#00b26a';
          break;
        case 20:
          return "yellow";
          break;
        case 30:
          return "red";
          break;
        default:
          return "lightgray";
          break;
      }
    }
  },
  watch: {},
  methods: {
    questDeviceInfo(params) {
      this.$http("socialUnitsDevice", params, { method: "get" })
        .then(res => {
          console.log("socialUnitsDevice", res);
          // this.setDeviceInfoData(this.proccessDeviceData(res.data));
          this.setDeviceInfoData(res.data);
        })
        .catch(res => {
          console.log("socialUnitsDevice", res);
        });
    },

    setDeviceInfoData(obj) {
      if (obj) {
        this.deviceInfo = obj;
        console.log("this.deviceInfo: ", this.deviceInfo);
      }
    },

    initData(params) {
      params.id = params.id || this.id || "";
      params.deviceId = params.deviceId || this.deviceId || "";
      if (!params.id || !params.deviceId) {
        return console.error("error: deviceId is not exist");
      }
      //请求各类型数据
      console.log("initData,", params);
      this.questDeviceInfo(params);
      this.questMeasureData(params);
    },

    //查询烟感设备的实时数据
    questMeasureData(params) {
      var param = { id: params.id, deviceId: params.deviceId };
      this.$http("socialUnitsDevicesRealtimeDataList", param, {
        method: "get"
      })
        .then(res => {
          console.log("实时数据: ", res.data);
          this.proccessMeasureData(res.data.others);
        })
        .catch(res => {
          console.log("res", res);
        });
    },

    //处理实时数据
    proccessMeasureData(data) {
      /*
      0:{dataId: 3009, measureName: "报警状态", value: "10.0", unit: "", type: 1, …}
      1:{dataId: 3010, measureName: "电池容量", value: "100.0", unit: "Wh", type: 1, …}
      2:{dataId: 3011, measureName: "电池电压", value: "220.0", unit: "V", type: 1, …}
      3:{dataId: 3012, measureName: "电池电量", value: "80.0", unit: "Wh", type: 1, …}
      4:{dataId: 3013, measureName: "温度", value: "36.0", unit: "℃", type: 1, …}
      5:{dataId: 3014, measureName: "气压", value: "100.0", unit: "kPa", type: 1, …}
      */
      let realTimeData = [];
      for (var item of data) {
        if (item.dataId === 3009) {
          if (item.value === "10.0") {
            item.value = "正常";
          } else if (item.value === "20.0") {
            item.value = "预警";
          } else if (item.value === "30.0") {
            item.value = "报警";
          } else {
            item.value = "未知";
          }
        }
        realTimeData.push(item);
      }
      var len = realTimeData.length;
      //四舍五入
      var leftCount = (len / 2).toFixed(0);
      this.realTimeData_left = realTimeData.slice(0, leftCount);
      this.realTimeData_right = realTimeData.slice(leftCount, len);
    },

    mounted() {
      console.error("mounted: ", "Test");
      console.error("mounted: ", this.$root);
      console.error("mounted: ", this.$root.$mp);
    }
  }
};
</script>
<style lang="scss" scoped>

.hj-smoke-detector {
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
  &__circle {
    //text-indent: 15px;
    //1vw 约为视窗宽度的1%，1vh约为视窗高度的1%
    height: 35vw;
    width: 35vw;
    border-radius: 50%;
    background-color: lightgray;
  }

  &__circle_text {
    font-size: 16px;
    height: 35vw;
    width: 35vw;
    line-height: 35vw;
    text-align: center;
  }
  &__line {
    height: 0px;
    width: 100%;
    border: 1px solid #a1a1a1;
  }
  &__pading {
    //box-sizing: border-box;
    //左右外边距
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>