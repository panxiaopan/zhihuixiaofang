export default function (params = {}) {
  //  data = data || [{
  //         value: 335,
  //         name: '正常'
  //       },
  //       {
  //         value: 310,
  //         name: '报警'
  //       },
  //       {
  //         value: 54,
  //         name: '故障'
  //       },
  //       {
  //         value: 5,
  //         name: '离线'
  //       }
  //     ]
  // if(deviceStatusWithCounts){
  //   // array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
  //   // var total = deviceStatusWithCounts.reduce((total, currentValue)=>{
  //   //   return total + currentValue.count
  //   // }, 0);
  //   // data = deviceStatusWithCounts.map((item)=>{
  //   //   return {name: item.desc, value: item.count}
  //   // })
  // }
  // console.log('total', total)

  var legendListData = ['正常', '报警', '故障', '离线'];
  var legendData = legendListData;
  console.log('legendListDataMap params.data', params)
  if (params.data && Array.isArray(params.data)) {
    var legendListDataMap = {};
    params.data.forEach((item) => {
      console.log('legendListDataMap, item', item)
      legendListDataMap[item.name] = item.value;
      item.name = item.name + '：' + item.value
    })
    legendData = legendListData.map((li) => {
      console.log('legendListData li', li)
      // return li + legendListDataMap[li];
      return li;
    })
  }


  return {
    title: [{
      text: params.title || ' 设备状态',
      textStyle: {
        fontSize: 15,
        fontFamily: 'PingFang-SC-Bold',
        fontWeight: 'bold',
        color: '#313131'
      }
    }, {
      text: params.total === undefined ? '30 ' : params.total + ' ',
      textStyle: {
        fontSize: 24,
        fontFamily: 'DIN-Bold',
        fontWeight: 'bold',
        color: 'rgba(49,49,49,1)',
        align: 'right',
        verticalAlign: 'center'
      },
      subtext: params.subtitle || '设备总数',
      subtextStyle: {
        fontSize: 14,
        fontFamily: 'PingFang-SC-Bold',
        fontWeight: 'bold',
        color: 'rgba(49,49,49,1)',
        align: 'right',
      },
      right: "5px",
      top: '35%',
    }],
    color: ['rgba(37,184,252,1)', 'rgba(253,110,131,1)', 'rgba(208,110,253,1)', 'rgba(253,158,133,1)'],
    grid: {
      containLabel: true
    },
    tooltip: {
      // trigger: 'axis',
      // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      //   type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      // },
      trigger: 'item',
      // confine: true, // 限制在图表内
      // position: 'inside',
      // formatter: "{b}: {c} \n ({d}%)",
      formatter: "{b} \n ({d}%)",
      backgroundColor: 'rgba(102,120,233,1)',
      extraCssText: 'box-shadow:0px 0px 0px 0px rgba(24,3,82,0.16);border-radius:6px;',
      textStyle: {
        fontSize: 22,
        fontFamily: 'PingFang-SC-Medium',
        fontWeight: 500,
        color: 'rgba(255,255,255,1)'
      }
    },
    legend: {
      orient: 'vertical',
      // orient: 'horizontal',
      x: 'left',
      // data: ['正常', '报警', '故障', '离线'],
      // data: legendData,
      // bottom: '10px',
      // left: 'center',
      // bottom: '10px',
      left: '10px',
      top: 'center',
      itemGap: 20,
      formatter: function (name) {
        return name
      }
    },
    series: [{
      name: params.title || params.seriesName || '设备状态',
      type: 'pie',
      // radius: ['50%', '70%'],
      // radius: ['35%', '60%'],
      radius: ['30%', '55%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: false, // 显示中间的文字
          textStyle: {
            fontSize: '30',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: params.data || [{
          value: 335,
          name: '正常'
        },
        {
          value: 310,
          name: '报警'
        },
        {
          value: 54,
          name: '故障'
        },
        {
          value: 5,
          name: '离线'
        }
      ]
    }]
  }
}
