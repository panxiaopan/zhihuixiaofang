import dayjs from 'dayjs';
export default function (params = {}, echarts) {

  // var base = +new Date(1968, 9, 3);
  // var oneDay = 24 * 3600 * 1000;
  var date = [];

  var data = [Math.random() * 300];

  // for (var i = 1; i < 20000; i++) {
  //   var now = new Date((base += oneDay));
  //   date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  //   data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
  // }

  date = Array.apply(null, {
    length: 20
  }).map((it, index) => {
    return dayjs('2018-10-11 06:00:00').add(15 * index, 'minute').format('YY-MM-DD hh:mm')
  })
  data = Array.apply(null, {
    length: 20
  }).map((it, index) => {
    var res = index % 6;
    if (!res) {
      return 0;
    }
    return +Math.random().toFixed(2) * index * 10;
  })

  date = params.date || date;
  data = params.data || data;


  var unit = params.unit || 'mA';
  var xAxisName = params.xAxisName || '时间';
  var yAxisName = params.yAxisName || '剩余电流';
  var xAxisType = params.xAxisType || 'category';
  var xAxisData = params.xAxisData || date;
  var seriesData = params.seriesData || data;
  var seriesName = params.seriesName || '剩余电流';
  var markPointData = params.markPointData || [];
  var markLineData = params.markLineData || [];
  // var tooltipFormatter = (params.tooltipFormatter || '{c}') + ' ' + unit;
  // var tooltipFormatter = (params.tooltipFormatter || '{c0}\n{c1}') + ' ' + unit;

  // console.log(date, data)
  var option = {
    tooltip: {
      trigger: 'axis',
      // trigger: 'item',
      // formatter: '{b}: {c} ' + unit,
      // formatter: '{c} ' + unit,
      // formatter: '{c0}\n{c1}') + ' ' + unit,
      // formatter: tooltipFormatter,
      formatter: function (params) {
        console.log('formatter', params)

        if (Array.isArray(params[0].value)) {
          return params[0].value[0] + '\n' + params[0].value[1];
        } else {
          return params[0].value.valueOf();
        }
        // return params[0].value[0] + '<br/>' + params[0].value[1];
        // return "fsfsff";
      },
      position: function (pt) {
        // return [pt[0], '30%'];
        return ['20%', pt[1]];
      },
      textStyle: {
        fontSize: 11,
        fontFamily: 'PingFang-SC-Medium',
        fontWeight: 500,
        color: 'rgba(255,255,255,1)',
        lineHeight: 16
      }
    },
    // title: {
    //   left: 'center',
    //   text: '大数据量面积图'
    // },
    grid: {
      top: '10%',
      bottom: '20%',
      // bottom: '30%',
      left: '15%',
      right: '15%'
      // containLabel: true
    },
    // toolbox: {
    //   feature: {
    //     dataZoom: {
    //       yAxisIndex: 'none'
    //     },
    //     restore: {},
    //     saveAsImage: {}
    //   }
    // },
    xAxis: {
      name: xAxisName,
      type: xAxisType,
      // type: 'time',
      boundaryGap: false,
      data: xAxisData,
      nameGap: 10,
      nameTextStyle: {
        align: 'right',
        fontSize: 11,
        fontFamily: 'PingFang-SC-Medium',
        fontWeight: 500,
        color: 'rgba(49,49,49,1)'
      },
      axisLabel: {
        fontSize: 11,
        fontFamily: 'DIN-Regular',
        fontWeight: 400,
        color: 'rgba(49,49,49,1)'
      }
    },
    yAxis: {
      name: yAxisName + '/' + unit,
      type: 'value',
      boundaryGap: ['0%', '10%'],
      nameGap: 10,
      nameTextStyle: {
        align: 'right',
        fontSize: 11,
        fontFamily: 'PingFang-SC-Medium',
        fontWeight: 500,
        color: 'rgba(49,49,49,1)'
      },
      axisLabel: {
        fontSize: 11,
        fontFamily: 'DIN-Regular',
        fontWeight: 400,
        color: 'rgba(49,49,49,1)'
      },
      // data: data
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }
      // , {
      //   start: 0,
      //   end: 100,
      //   handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      //   handleSize: '80%',
      //   handleStyle: {
      //     color: '#fff',
      //     shadowBlur: 3,
      //     shadowColor: 'rgba(0, 0, 0, 0.6)',
      //     shadowOffsetX: 2,
      //     shadowOffsetY: 2
      //   }
      // }
    ],
    series: {
      name: seriesName,
      type: 'line',
      smooth: true,
      // symbol: 'emptyCircle',
      symbol: 'circle',
      symbolSize: 10,
      showSymbol: false,
      sampling: 'average',
      itemStyle: {
        color: 'rgba(131,101,219,1)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(131,101,219,1)'
          },
          {
            offset: 1,
            color: 'rgba(102,120,232,1)'
          }
        ])
      },
      data: seriesData,

      markPoint: {
        // data:[{ name: 'Wed', value: 934, coord:[3, 934]}] // coord数组中第一个值为 x轴数据数组中的下标值（index), 第二个值为 series data数组中对应下标值的value， 即 seriesData[index]
        data: markPointData,
        symbol: 'pin',
        symbolSize: 20,
        emphasis: {
          label: {
            show: !!markPointData.length,
            offset: [0, -30],
            align: 'left',
            // formatter: "{b}: {c}"
            formatter: function (params) {
              console.log('markPoint params', params)
              if (Array.isArray(params) && params.length) {
                var params0 = params[0];
                var nameStr = params0.seriesName || '';
                var valueArr = Array.isArray(params0.value) && params0.value || [params0.value];
                var timeStr = valueArr[1] && valueArr[0];
                var valueStr = valueArr[1] || valueArr[0] || 0;
                return nameStr + '\n' + '时间：' + timeStr + '\n' + '值： ' + valueStr

              } else if (params) {
                var paramsData = params.data;
                var nameStr = paramsData.name;
                var timeStr = paramsData.coord[0];
                var valueStr = paramsData.coord[1];
                return nameStr + '\n' + '时间：' + timeStr + '\n' + '值： ' + valueStr
              } else {
                return "{b}: {c}"
              }
              // return 'markPoint'
              // return "{b}: {c}"
            }
          }
        },
        // symbolOffset: [0, -20]
      },
      // markLine: {
      //   lineStyle: {
      //     normal: {
      //       type: 'solid'
      //     }
      //   },
      //   data: markLineData,
      //   // emphasis: {
      //   //   label: {
      //   //     show: !!markLineData.length,
      //   //     offset: [0, -30],
      //   //     align: 'left',
      //   //     // formatter: "{b}: {c}"
      //   //     formatter: function (params) {
      //   //       console.log('markPoint params', params)
      //   //       // if (Array.isArray(params) && params.length) {
      //   //       //   var params0 = params[0];
      //   //       //   var nameStr = params0.seriesName || '';
      //   //       //   var valueArr = Array.isArray(params0.value) && params0.value || [params0.value];
      //   //       //   var timeStr = valueArr[1] && valueArr[0];
      //   //       //   var valueStr = valueArr[1] || valueArr[0] || 0;
      //   //       //   return nameStr + '\n' + '时间：' + timeStr + '\n' + '值： ' + valueStr

      //   //       // } else if (params) {
      //   //       //   var paramsData = params.data;
      //   //       //   var nameStr = paramsData.name;
      //   //       //   var timeStr = paramsData.coord[0];
      //   //       //   var valueStr = paramsData.coord[1];
      //   //       //   return nameStr + '\n' + '时间：' + timeStr + '\n' + '值： ' + valueStr
      //   //       // } else {
      //   //       //   return "{b}: {c}"
      //   //       // }
      //   //       // return 'markPoint'
      //   //       return "{b}: {c}"
      //   //     }
      //   //   }
      //   // },
      //   // [{
      //   //     type: 'average',
      //   //     name: '平均值'
      //   //   },
      //   //   {
      //   //     xAxis: 170
      //   //   }
      //   // ]
      // }
      // data: Array.apply(null, {
      //   length: 55
      // }).map((it, index) => {
      //   var initTimeStr = dayjs().format('YYYY-MM-DD 06:00:00')
      //   console.error('initTimeStr', initTimeStr)
      //   var time = dayjs(initTimeStr).add(15 * index, 'minute').format('YYYY-MM-DD HH:mm:ss');
      //   var value = !(index % 3) ? '--' : +((Math.random() * 200).toFixed(2));
      //   console.log(time, value)
      //   return {
      //     time,
      //     value
      //   }
      // })
    }
  };

  return option;
}
