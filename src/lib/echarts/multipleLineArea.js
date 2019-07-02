import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep.js';
export default function (params = {}, echarts) {
  function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        Math.round(value)
      ]
    };
  }

  function getRandomData() {
    now = new Date(+now + oneDay);
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        Math.round(Math.random() * 650)
      ]
    };
  }
  var data = [];
  var otherData = [];
  var now = +new Date(1997, 9, 3);
  var oneDay = 24 * 3600 * 1000;
  var value = Math.random() * 1000;

  for (var i = 0; i < 300; i++) {
    data.push(randomData());
    otherData.push(getRandomData());
  }

  var seriesTemple = {
    name: params.seiresName || '',
    type: 'line',
    showSymbol: false,
    hoverAnimation: false,
    data: ''
  };

  var markPointData = params.markPointData || [];

  var markPointTemplate = {
    // data:[{ name: 'Wed', value: 934, coord:[3, 934]}] // coord数组中第一个值为 x轴数据数组中的下标值（index), 第二个值为 series data数组中对应下标值的value， 即 seriesData[index]
    data: markPointData,
    symbol: 'pin',
    symbolSize: 20,
    emphasis: {
      label: {
        show: !!markPointData.length,
        offset: [0, -60],
        align: 'left',
        position: function (pt) {
          console.log('pt', pt, typeof pt[0]);
          // return [pt[0], '30%'];
          // return ['20%', pt[1]];
          if (pt[0] < 145) {
            pt[0] = 145;
          }
          if (pt[0] > 230) {
            pt[0] = 230;
          }
          var x = pt[0] - 94;
          var y = pt[1] - 40;
          return [x, y];
          // return [x, 'center'];
          // return [pt[0], pt[1]];
          // return [pt[0] - 140, pt[1] + 150];
          // return [(pt[0] + 150), (pt[1] - 150)];
        },
        // formatter: "{b}: {c}"
        formatter: function (params) {
          console.log('markPoint params', params);
          if (Array.isArray(params) && params.length) {
            var params0 = params[0];
            var nameStr = params0.seriesName || '';
            var valueArr = (Array.isArray(params0.value) && params0.value) || [
              params0.value
            ];
            var timeStr = valueArr[1] && valueArr[0];
            var valueStr = valueArr[1] || valueArr[0] || 0;
            return (
              nameStr + '\n' + '时间：' + timeStr + '\n' + '值： ' + valueStr
            );
          } else if (params) {
            var paramsData = params.data;
            var nameStr = paramsData.name;
            var timeStr = paramsData.coord[0];
            var valueStr = paramsData.coord[1];
            return (
              nameStr + '\n' + '时间：' + timeStr + '\n' + '值： ' + valueStr
            );
          } else {
            return '{b}: {c}';
          }
          // return 'markPoint'
          // return "{b}: {c}"
        }
      }
    }
    // symbolOffset: [0, -20]
  };
  var scatterObj = params.scatterObj || {};
  var scatterData = scatterObj.data || [];
  var scatterUnit = scatterObj.unit || '';
  var scatterName = scatterObj.name || '';
  var scatterSeries = {
    name: scatterName,
    type: 'scatter',
    data: scatterData,
    symbol: 'pin',
    symbolSize: 20,
    label: {
      show: true,
      formatter: function (params) {
        console.log('scatterSeries', params);
        return params.value[1] + scatterUnit;
      }
    }
    // emphasis: {
    //   label: {
    //     show: true,
    //     formatter: function (params) {
    //       console.log('emphasis scatterSeries', params)
    //       return 'fsdfs'
    //     }
    //   }
    // }
  };
  var seiresNameArr = params.seiresNameArr || [];
  var seriesDataArr = params.seriesDataArr || [];
  var series = [];
  var max = params.max || null;
  seriesDataArr.forEach((item, index) => {
    var seriesItem = cloneDeep(seriesTemple);
    seriesItem.data = item;
    if (seiresNameArr.length) {
      seriesItem.name = seiresNameArr[index] || '';
    }
    if (index == seriesDataArr.length - 1 && markPointData.length) {
      seriesItem.markPoint = markPointTemplate;
    }
    series.push(seriesItem);
  });
  if (scatterData.length) {
    series.push(scatterSeries);
  }
  var formatter = params.formatter || 'mm';
  formatter = (formatter == 'MINUTE' && 'mm') || formatter;
  // formatter: 'MINUTE', // Y: year, M: month, D:day, hh:hour, mm: minute, ss:second
  console.log('series', series);
  var yAxisStr =
    ((params.yAxisName && params.yAxisName + '/') || '') + (params.unit || '');
  var option = {
    title: {
      text: params.title || '参数趋势图',
      textStyle: {
        fontSize: 15,
        fontFamily: 'PingFang-SC-Bold',
        fontWeight: '500', // bold
        color: 'rgba(49,49,49,1)'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        // params = params[0];
        // var date = new Date(params.name);
        // return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
        console.log('params', params);
        var str = params
          .map(param => {
            // var date = new Date(param.name);
            var date = new Date(param.value[0]);
            // return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + param.value[1];
            return (
              param.seriesName +
              ': ' +
              (date.getMonth() + 1) +
              '/' +
              date.getDate() +
              ' ' +
              date.getHours() +
              ':' +
              date.getMinutes() +
              ':' +
              (date.getSeconds() > 10 ?
                date.getSeconds() :
                '0' + date.getSeconds()) +
              ', ' +
              (isNaN(+param.value[1]) ? '--' : (+param.value[1]).toFixed(2))
            );
          })
          .join('\n');
        console.log('params str', str);
        return str;
      },
      position: function (pt) {
        console.log('pt', pt, typeof pt[0]);
        // return [pt[0], '30%'];
        // return ['20%', pt[1]];
        if (pt[0] < 145) {
          pt[0] = 145;
        }
        if (pt[0] > 230) {
          pt[0] = 230;
        }
        // var x = pt[0] - 94;
        // var y = pt[1] - 40;
        var x = pt[0] - 94;
        var y = pt[1] - 40 - 30;
        return [x, y];
        // return [x, 'center'];
        // return [pt[0], pt[1]];
        // return [pt[0] - 140, pt[1] + 150];
        // return [(pt[0] + 150), (pt[1] - 150)];
      },
      axisPointer: {
        animation: false
      },
      textStyle: {
        fontSize: 11,
        fontFamily: 'PingFang-SC-Medium',
        fontWeight: 500,
        color: 'rgba(255,255,255,1)',
        lineHeight: 16
      }
    },
    grid: {
      top: '25%', // 25%
      bottom: '20%', // 20%
      // bottom: '30%',
      left: '15%',
      right: '15%'
      // containLabel: true
    },
    xAxis: {
      name: params.xAxisName || '',
      type: 'time',
      // type: xAxisType,
      // data: xAxisData,
      boundaryGap: false,
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
      splitLine: {
        show: false
      }
    },
    yAxis: {
      name: yAxisStr,
      type: 'value',
      boundaryGap: [0, '100%'],
      max: max,
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
      splitLine: {
        show: false
      }
    },
    // series,
    series: series
    // || [{
    //     name: '',
    //     type: 'line',
    //     showSymbol: false,
    //     hoverAnimation: false,
    //     itemStyle: {
    //       color: 'rgba(131,101,219,1)'
    //     },
    //     areaStyle: {
    //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //           offset: 0,
    //           color: 'rgba(131,101,219,1)'
    //         },
    //         {
    //           offset: 1,
    //           color: 'rgba(102,120,232,1)'
    //         }
    //       ])
    //     },
    //     data: data
    //   },
    //   {
    //     name: '',
    //     type: 'line',
    //     showSymbol: false,
    //     hoverAnimation: false,
    //     data: otherData
    //   }
    // ]
  };

  return option;
}
