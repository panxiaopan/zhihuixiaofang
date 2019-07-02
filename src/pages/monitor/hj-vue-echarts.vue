<template>
  <div
    class="hj-vue-echarts"
    :class="hjClass"
  >
    <ec-canvas
      class="hj-vue-echarts__chart"
      :class="hjEcWrapperClass"
      :ec-class="hjEcClass"
      :id="hjDomId"
      :canvas-id="hjDomId"
      :ec="ec"
    ></ec-canvas>

  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "hj-vue-echarts",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjEcWrapperClass: {
      type: String,
      default: "hj-vue-echarts__chart"
    },
    hjEcClass: {
      type: String,
      default: "hj-vue-echarts__chart"
    },
    hjDomId: {
      type: [Number, String],
      default: "" // "hj-vue-echarts" + (+Math.random() * 1000).toFixed(2)
    }
    // hjCanvasId: {
    //   type: [Number, String],
    //   default: "" // "hj-vue-echarts" + (+Math.random() * 1000).toFixed(2)
    // },

    // options:{
    //   type: Object,
    //   default: null
    // },

    // getOptions:{
    //   type:[Function, Object],
    //   default: null
    // },

    // config: {
    //   type: Object,
    //   default: () => ({
    //     options: null,
    //     getOptions: null,
    //     params: null
    //   })
    // }

    // options: {
    //   type: Object,
    //   default: null
    // },
    // getOptions:{
    //   type: [Function, Object],
    //   default: null
    // },
    // params:{
    //   type: Object,
    //   default: null
    // }
  },
  data() {
    return {
      ec: {
        lazyLoad: true,
        options: {}
      }
      // chart: null
    };
  },
  // computed: {
  //   ec() {
  //     return {
  //       lazyLoad: true,
  //       options: this.options,
  //       instanceName:
  //         this.canvasId ||
  //         this.id ||
  //         "hj-vue-echarts" + (+Math.random() * 1000).toFixed(2),
  //       domId: this.id || "hj-vue-echarts" + (+Math.random() * 1000).toFixed(2)
  //     };
  //   }
  // },
  // watch: {
  //   // "config.options": {
  //   //   handler: function(newVal, oldVal) {
  //   //     console.log("config.options", newVal, oldVal);
  //   //     if (newVal) {
  //   //       console.log("config.options init");
  //   //       this.init();
  //   //     }
  //   //   }
  //   // },
  //   // "config.params": {
  //   //   handler: function(newVal, oldVal) {
  //   //     console.log("config.params", newVal, oldVal);
  //   //     if (newVal) {
  //   //       console.log("config.params init");
  //   //       this.init();
  //   //     }
  //   //   }
  //   // }
  //   // options(newVal, oldVal) {
  //   //   console.log("options", newVal, oldVal);
  //   //   if (newVal) {
  //   //   }
  //   // },
  //   // getOptions(newVal, oldVal) {
  //   //   console.log("getOptions", newVal, oldVal);
  //   //   if (newVal) {
  //   //   }
  //   // },
  //   // params(newVal, oldVal) {
  //   //   console.log("params", newVal, oldVal);
  //   // }
  // },
  methods: {
    init(config) {
      // console.log("hj-vue-echarts init", this.config);
      // if (!config) {
      //   config = this.config;
      // }
      // var config = this.config;
      if (
        !config ||
        (!config.options && (!config.getOptions && !config.parmas))
      ) {
        return;
      }
      this.instanceChart(config);
    },
    // 点击按钮后初始化图表
    instanceChart(config) {
      console.log("instanceChart");
      // ec    // instanceName    domId    options
      // if (!ec.options) {
      //   return;
      // }
      if (!this.hjDomId) {
        return;
      }
      //  || !this.canvasId
      console.log("instanceChart", this.hjDomId);
      // {instanceName: '', domId: '', options}
      // this.dispose(ec.instanceName);
      var ecComponent = this.$root.$mp.page.selectComponent("#" + this.hjDomId);
      console.log("ecComponent", ecComponent);
      if (ecComponent) {
        ecComponent.init((echarts, canvas, width, height) => {
          // 获取组件的 canvas、width、height 后的回调函数
          // 在这里初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });

          var configOptions = config.options;
          // (config.options && cloneDeep(config.options)) || null;
          console.log("configOptions", configOptions);
          var configParams = config.params;
          // (config.params && cloneDeep(config.params)) || null;
          console.log("configParams", configParams);

          var getOp = config.getOptions && config.getOptions(configParams);
          console.log("getOp", getOp);

          var options = configOptions || getOp || null;

          if (options) {
            console.log("chart setOptions before", options);
            chart.setOption(options);
            console.log("chart setOptions after", options);
          }

          // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
          // if (config[instanceName]) {
          //   this[config[instanceName]] = chart;
          // } else {
          //   this.chart = chart;
          // }
          // this.chart = chart;
          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          return chart;
        });
      }
    }
  }
};
</script>
<style lang="scss">
.hj-vue-echarts.hj-vue-echarts {
  width: 100%;
  height: 220px;

  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  box-sizing: border-box;

  // position: relative;
  // z-index: 1;
}

.hj-vue-echarts__chart.hj-vue-echarts__chart {
  width: 100% !important;
  height: 220px !important;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  box-sizing: border-box;
  // position: relative;
  // z-index: 1;
}
</style>