export default function (params = {}) {
  // linear-gradient(0deg,rgba(176,102,233,1) 0%,rgba(102,120,233,1) 100%);
  var colors = ['rgba(176,102,233,1)', 'rgba(246,17,50,1)']
  if (params.homepage == true) { //是首页的话直接return 出去,//样式写在首页了,,
    return params
  }

  return {
    color: ['#6678E9', 'rgba(232,107,162,1)'],
    title: {
      text: ' 隐患趋势图',
      textStyle: {
        fontSize: 15,
        fontFamily: 'PingFang-SC-Bold',
        fontWeight: 'bold',
        color: 'rgba(49,49,49,1)'
      }
    },
    tooltip: {
      formatter: '{a}：{c}\n时间：{b}',
      trigger: 'item', // axis 
      position: function (pt) {
        console.log('pt', pt, typeof pt[0])
        // return [pt[0], '30%'];
        // return ['20%', pt[1]];
        var x = pt[0] - 70;
        var y = pt[1] - 40;
        return [x, y];
        // return [x, 'center'];
        // return [pt[0], pt[1]];
        // return [pt[0] - 140, pt[1] + 150];
        // return [(pt[0] + 150), (pt[1] - 150)];
      },
      // position: 'top',
      // position: ['40%', '0%'],
      axisPointer: {
        type: 'shadow' // shadow cross
      }
    },
    grid: {
      // right: '20%',
      // top: '35%',
      left: 'center',
      top: '25%', //25%
      height: '60%', // 60%'
      width: '70%' // 70%
      // containLabel: true
    },
    legend: {
      show: false,
      data: ['隐患', '工单'],
      right: '5%',
      top: '10%'
      // top: 'top',
      // top: 'center',
      // left: 'right',
      // orient: ''
    },
    xAxis: [{
      type: 'category',
      // name: '日期',
      boundaryGap: true,
      nameGap: 20,
      nameLocation: 'start',
      nameTexStyle: {
        fontSize: 24,
        fontFamily: 'PingFang-SC-Medium',
        fontWeight: 500,
        color: 'rgba(61,61,61,1)'
      },
      axisTick: {
        alignWithLabel: true
      },
      data: params.xAxis || ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }],
    yAxis: [{
        type: 'value',
        name: '隐患（个数）',
        nameLocation: "end",
        nameGap: 10,
        // boundaryGap: ['20%', '20%'],
        // boundaryGap: true,
        // min: 0,
        // max: 250,
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#6678E9'
          }
        },
        axisLabel: {
          formatter: '{value}'
        }
      },
      // {
      //   type: 'value',
      //   name: '工单（个数）',
      //   // boundaryGap: ['20%', '20%'],
      //   // boundaryGap: true,
      //   // min: 0,
      //   // max: 25,
      //   position: 'right',
      //   axisLine: {
      //     lineStyle: {
      //       color: 'rgba(232,107,162,1)'
      //     }
      //   },
      //   axisLabel: {
      //     formatter: '{value}'
      //   }
      // }
    ],
    series: [{
        name: '隐患',
        type: 'bar',
        yAxisIndex: 0,
        data: params.data || [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
      },
      // {
      //   name: '工单',
      //   type: 'line',
      //   yAxisIndex: 1,
      //   data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
      // }
    ]
  }
}
