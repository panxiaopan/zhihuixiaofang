import * as WxCanvas from './wx-canvas';
import * as echarts from './echarts.min.js';

// const computedBehavior = require('miniprogram-computed');
let ctx;

Component({
  externalClasses: ['ec-class'],
  // behaviors: [computedBehavior],
  properties: {
    canvasId: {
      type: String,
      value: 'ec-canvas'
    },

    ec: {
      type: Object
    }
  },
  // computed: {
  //   ec() {
  //     // 计算属性同样挂在 data 上，每当进行 setData 的时候会重新计算
  //     // 比如此字段可以通过 this.data.b 获取到
  //     return this.data.a + 100
  //   },
  // },
  data: {

  },

  // ready: function () {
  //   if (!this.data.ec) {
  //     console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" '
  //       + 'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
  //     return;
  //   }

  //   if (!this.data.ec.lazyLoad) {
  //     this.init();
  //   }
  // },
  ready: function () {
    // 异步获取
    setTimeout(() => {
      if (!this.data.ec) {
        console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" ' +
          'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
        return;
      }

      if (!this.data.ec.lazyLoad) {
        this.init();
      }
    }, 500)
  },
  methods: {
    // dispose(){
    //   console.log('disdispose', this.chart)
    //   if (this.chart) {
    //     this.chart.dispose();
    //     this.chart = null;
    //   }
    // },
    init: function (callback) {
      // this.dispose();
      const version = wx.version.version.split('.').map(n => parseInt(n, 10));
      const isValid = version[0] > 1 || (version[0] === 1 && version[1] > 9) ||
        (version[0] === 1 && version[1] === 9 && version[2] >= 91);
      if (!isValid) {
        console.error('微信基础库版本过低，需大于等于 1.9.91。' +
          '参见：https://github.com/ecomfe/echarts-for-weixin' +
          '#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82');
        return;
      }

      ctx = wx.createCanvasContext(this.data.canvasId, this);

      const canvas = new WxCanvas.default(ctx, this.data.canvasId);

      echarts.setCanvasCreator(() => {
        return canvas;
      });

      var query = wx.createSelectorQuery().in(this);

      query.select('.ec-canvas').boundingClientRect(res => {
        if (typeof callback === 'function') {
          this.chart = callback(echarts, canvas, res.width, res.height);
        } else if (this.data.ec && typeof this.data.ec.onInit === 'function') {
          this.chart = this.data.ec.onInit(echarts, canvas, res.width, res.height);
        } else if (this.data.ec && this.data.ec.options) {
          // 添加接收 options 传参
          const ec = this.data.ec

          function initChart(echarts, canvas, width, height) {
            const chart = echarts.init(canvas, null, {
              width: width,
              height: height
            });
            canvas.setChart(chart);
            chart.setOption(ec.options);
            return chart;
          }
          this.chart = initChart(echarts, canvas, res.width, res.height);
        } else {
          this.triggerEvent('init', {
            echarts: echarts,
            canvas: canvas,
            width: res.width,
            height: res.height
          });
        }
      }).exec();
    },

    canvasToTempFilePath(opt) {
      if (!opt.canvasId) {
        opt.canvasId = this.data.canvasId;
      }

      ctx.draw(true, () => {
        wx.canvasToTempFilePath(opt, this);
      });
    },

    touchStart(e) {
      if (this.chart && e.touches.length > 0) {
        var touch = e.touches[0];
        this.chart._zr.handler.dispatch('mousedown', {
          zrX: touch.x,
          zrY: touch.y
        });
        this.chart._zr.handler.dispatch('mousemove', {
          zrX: touch.x,
          zrY: touch.y
        });
      }
    },

    touchMove(e) {
      if (this.chart && e.touches.length > 0) {
        var touch = e.touches[0];
        this.chart._zr.handler.dispatch('mousemove', {
          zrX: touch.x,
          zrY: touch.y
        });
      }
    },

    touchEnd(e) {
      if (this.chart) {
        const touch = e.changedTouches ? e.changedTouches[0] : {};
        this.chart._zr.handler.dispatch('mouseup', {
          zrX: touch.x,
          zrY: touch.y
        });
        this.chart._zr.handler.dispatch('click', {
          zrX: touch.x,
          zrY: touch.y
        });
      }
    }
  }
});
