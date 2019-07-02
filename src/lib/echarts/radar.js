export default function (params = {}) {
  //   var indicator =  [{
  //     text: '超温\n5个', max: params.max|| 600},
  //   {
  //     text: '断线\n5个', max: params.max|| 600},
  //   {
  //     text: '漏电\n5个', max: params.max|| 600},
  //   {
  //     text: '过流\n5个', max: params.max|| 600},
  //   {
  //     text: '欠压\n5个', max: params.max|| 600},
  //   {
  //     text: '短路\n5个', max: params.max|| 600},
  //   {
  //     text: '过压\n5个', max: params.max|| 600}
  // ]
  console.log('radar params', params)
  return {
    color: ['rgba(169,112,255,1)'],
    title: {
      text: '隐患原因统计图',
      top: 0,
      left: 5,
      textStyle: {
        fontSize: 15,
        fontFamily: 'PingFang-SC-Bold',
        fontWeight: 'bold',
        color: 'rgba(49,49,49,1)'
      }
    },
    radar: {
      indicator: params.indicator || [{
          text: '超温\n5个',
          max: params.max || 600
        },
        {
          text: '断线\n5个',
          max: params.max || 600
        },
        {
          text: '漏电\n5个',
          max: params.max || 600
        },
        {
          text: '过流\n5个',
          max: params.max || 600
        },
        {
          text: '欠压\n5个',
          max: params.max || 600
        },
        {
          text: '短路\n5个',
          max: params.max || 600
        },
        {
          text: '过压\n5个',
          max: params.max || 600
        }
      ],
      // center: ['50%', '55%'],
      center: ['50%', '60%'],
      radius: '50%',
      // startAngle: 168,
      splitNumber: 5,
      shape: 'polygon',
      name: {
        formatter: '{value}',
        textStyle: {
          fontSize: 12,
          fontFamily: 'PingFang-SC-Medium',
          fontWeight: 500,
          color: 'rgba(49,49,49,1)'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(66,138,255,1)', 'rgba(66,138,255,0.8)', 'rgba(66,138,255,0.6)', 'rgba(66,138,255,0.4)', 'rgba(66,138,255,0.2)'],
          // shadowColor: 'rgba(0, 0, 0, 0.3)',
          // shadowBlur: 2
        }
      },
      axisLine: {
        lineStyle: {
          // color: 'rgba(255, 255, 255, 0.4)'
          color: 'rgba(66,138,255,1)',
        }
      },
      splitLine: {
        lineStyle: {
          // color:  ['#aaa', '#ddd'],
          color: 'rgba(255, 255, 255, 0)'
        }
      }
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      // show: false,
      // position: 'right',
      // confine: true, // 限制在图表内
      trigger: 'item',
      position: ['0%', '100%'],
      // trigger: 'axis',
      // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      //   type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      // },
      formatter: function (formatterparams) {
        console.log('formatter params', formatterparams);
        console.log('formatter params', params);
        var tooltipStr = '';
        params.indicator.forEach((item, index) => {
          // tooltipStr += item.text + ': ' + formatterparams.value[index] + '个' +  ((index+1 == formatterparams.value.length) ? '' : '\n');
          tooltipStr += item.text + ': ' + formatterparams.value[index] + '个' + ((index + 1 == formatterparams.value.length) ? '' : '\n');
        })
        return 'tooltipStr'
      },
      // backgroundColor: 'rgba(169,112,255,0.51)'
      backgroundColor: 'rgba(0,0,250,0.2)'
    },
    // legend: {
    //   type: 'scroll',
    //   bottom: 10,
    //   data: (function () {
    //     var list = [];
    //     for (var i = 1; i <= 1; i++) {
    //       list.push(i + 2000 + '');
    //     }
    //     return list;
    //   })()
    // },
    series: [{
      name: '隐患原因统计图',
      type: 'radar',
      symbol: 'circle',
      // itemStyle: {normal: {areaStyle: {type: 'default'}}},
      areaStyle: {
        // color: 'rgba(0,250,0,0.3)'
        // color: 'rgba(66,138,255,0.1)'
        color: 'rgba(169,112,255,1)'
      },
      emphasis: {
        areaStyle: {
          // color: 'rgba(0,250,0,0.3)'
          color: 'rgba(169,112,255,1)'
        }
      },
      lineStyle: {
        width: 1
      },
      data: [{
        value: params.indicatorValueArray || [100, 200, 300, 400, 510, 450, 350],
        name: '隐患原因统计图'
      }]
    }]
    // series: (function () {
    //   var series = [];
    //   for (var i = 1; i <= 1; i++) {
    //     series.push({
    //       name: '隐患原因统计图',
    //       type: 'radar',
    //       symbol: 'circle',
    //       // itemStyle: {normal: {areaStyle: {type: 'default'}}},
    //       areaStyle: {
    //         // color: 'rgba(0,250,0,0.3)'
    //         // color: 'rgba(66,138,255,0.1)'
    //         color: 'rgba(169,112,255,1)'
    //       },
    //       emphasis: {
    //         areaStyle: {
    //           // color: 'rgba(0,250,0,0.3)'
    //           color: 'rgba(169,112,255,1)'
    //         }
    //       },
    //       lineStyle: {
    //         width: 1
    //       },
    //       data: [{
    //         value: [
    //           // (40 - i) * 10,
    //           (38 - i) * 4 + 60,
    //           (40 - i) * 8,
    //           (40 - i) * 6,
    //           (40 - i) * 4,
    //           i * 5 + 10,
    //           i * 9,
    //           i * i / 2,
    //           // (38 - i) * 3 + 60,
    //           // (40 - i) * 8,
    //         ],
    //         name: i + 2000 + ''
    //       }]
    //     });
    //   }
    //   return series;
    // })()
  }
}
