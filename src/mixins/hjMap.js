import coordtransform from "coordtransform";
import cloneDeep from "lodash/cloneDeep.js";
import API from '@/store/flyio/apiUrl/home.js';

export default {
  onReady() {
    this.mapCtx = wx.createMapContext("myMap");
    this.getCurrentPosition();
  },
  data() {
    // wx.getLocation({type: 'gcj02'})
    // 北京经纬度
    var defaultLatitude = 39.7652000000;
    var defaultLongitude = 116.5779250000;
    // 深圳经纬度
    // var defaultLatitude = 23.482468;
    // var defaultLongitude = 113.50388;
    var markerTemplate = {
      id: (Math.random() * 1000).toFixed(2),
      // title: "title",
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      // callout: {
      //   content: "content",
      //   color: "#fff",
      //   bgColor: "#1fd14c",
      //   display: "BYCLICK" // BYCLICK , ALWAYS
      //   // padding: 5,
      //   // textAlign: "center",
      //   // borderColor: "#1fd14c",
      //   // borderWidth: 1,
      //   // borderRadius: 5,
      // },
      // label: {
      //   content: "content",
      //   color: "#DC143C",
      //   // color: "#1fd14c",
      //   bgColor: "#ffffff",
      //   anchorX: -5,
      //   anchorY: -20,
      //   padding: 4
      //   // textAlign: "center",
      //   // borderWidth: 1,
      //   // borderColor: "#E4FF00",
      //   // borderRadius: 5,
      // },
      width: 24,
      height: 24,
      iconPath: "../../static/images/common/mapIcon@2x.png"
    };
    var circlesTemplate = {
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      color: "#1fd14c",
      // fillColor: "#E4FF00",
      radius: 48, // 24，48，96，
      strokeWidth: 16 // 8，16,35
    };
    // includePoints
    return {
      currentNodeId: 0,
      markerTemplate,
      circlesTemplate,
      markers: [],
      includePoints: [],
      // [
      //   {
      //     latitude: defaultLatitude, // defaultLatitude,
      //     longitude: defaultLongitude // defaultLongitude
      //   }
      // ],
      defaultLatitude,
      defaultLongitude,
      defaultScale: 15,
      // scale: 15, // 11
      // latitude: 39.7652,
      // longitude: 116.577925,
      centerPoint: {
        latitude: 39.7652,
        longitude: 116.577925,
      },
      isShowPanel: false,
      info: {}
    }
  },
  methods: {
    // wx: MapContext.translateMarker 设置markers的移动必须设置 markers 内部数组对应对象的经纬度，调用translateMarker 貌似不起作用。
    // MapContext.includePoints
    // 获取当前位置经纬度
    getCurrentPosition() {
      // 为精简代码此处不展示拒绝的情况
      return new Promise((resolve, reject) => {
        wx.getLocation({
          type: "gcj02",
          success: res => {
            console.warn('getCurrentPosition', res)
            resolve({
              latitude: res.latitude,
              longitude: res.longitude
            });
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    // 获取中心点经纬度,然后查询附近充电站
    getCenterLocation() {
      return new Promise((resolve, reject) => {
        this.mapCtx.getCenterLocation({
          success: res => {
            let pos = {
              latitude: res.latitude,
              longitude: res.longitude
            };
            console.info(pos);
            resolve(pos)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    getRegion() {
      return new Promise((resolve, reject) => {
        this.mapCtx.getRegion({
          success: res => {
            console.info("getRegion", res);
            var southwest = coordtransform.gcj02tobd09(res.southwest.latitude, res.southwest.longitude);
            var leftBtmLat = southwest[0];
            var leftBtmLng = southwest[1];
            var northeast = coordtransform.gcj02tobd09(res.northeast.latitude, res.northeast.longitude);
            var rightTopLat = northeast[0];
            var rightTopLng = northeast[1];
            var mapSocialUnitsParams = {
              leftBtmLat,
              leftBtmLng,
              rightTopLat,
              rightTopLng
            };
            resolve(mapSocialUnitsParams)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    getScale() {
      return new Promise((resolve, reject) => {
        this.mapCtx.getScale({
          success: res => {
            resolve(res);
          },
          fail: res => {
            reject(res)
          }
        });
      });
    },
    setIncludePoints(includePoints) {
      console.log('setIncludePoints', includePoints)
      return new Promise((resolve) => {
        if (!includePoints || !(includePoints instanceof Object)) {
          console.log('setIncludePoints false')
          resolve(false);
          return;
        }

        var points = [];
        if (Array.isArray(includePoints) && includePoints.length) {
          points = includePoints;
        } else if (!Array.isArray(includePoints)) {
          points = [cloneDeep(includePoints)]
        }
        var includePointsObj = {
          padding: [30],
          points: points,
          success: (res) => {
            console.log('setIncludePoints resolve', res);
            resolve(res);
          },
          fail: (res) => {
            reject(res);
          }
        };
        console.log("includePoints", includePoints);
        this.mapCtx.includePoints(includePointsObj);
      });
    },
    // 视野变化触发：begin和end方法内操作data会导致地图拖动后立即复位
    regionChange(e) {
      console.info("in regionchange");
      console.info(e);
    },
    // 视野变化开始：begin和end方法内操作data会导致地图拖动后立即复位
    begin(e) {
      console.info("in begin");
      console.info(e);
      this.beginTimeStamp = e.timeStamp;
    },
    // 视野变化结束：begin和end方法内操作data会导致地图拖动后立即复位
    end(e) {
      // 拖动结束后获取中心点经纬度
      console.info("in end");
      this.getCenterLocation();
      if (e.timeStamp - this.beginTimeStamp > 120) {
        this.getRegionAndQueryMarkers()
      }
    },
    markertap(e) {
      console.info('markertap', e)
      var id = e.mp.markerId;
      this.currentNodeId = id;
      // this.isShowPanel = true;
      this.querySocalUnitInfoByNodeId({
        id
      });
    },
    callouttap(e) {
      console.info('callouttap', e)
    },
    controltap(e) {
      console.info('controltap', e)
    },
    tap(e) {
      console.info('tap', e)
      this.isShowPanel = false;
    },
    updated(e) {
      console.info('updated', e)
    },
    poitap(e) {
      console.info('poitap', e)
    },
    queryMarkers(params) {
      // 73°E~135°E ， 4°N~53°N
      // latitude:4, longitude: 73
      // latitude:53, longitude: 135
      params.leftBtmLng = params.leftBtmLng || 73;
      params.leftBtmLat = params.leftBtmLat || 3;
      params.rightTopLng = params.rightTopLng || 135;
      params.rightTopLat = params.rightTopLat || 54;
      this.isShowPanel = false;
      this.$http("mapSocialUnits", params, {
          method: "get"
        })
        .then(res => {
          console.info("mapSocialUnits", res);
          this.setMarkers(
            this.processMarkersData({
              data: res.data,
              status: this.currentUnitState
            }),
          );
        })
        .catch(res => {
          console.info("mapSocialUnits catch", res);
        });
    },
    processMarkersData({
      data,
      status
    }) {
      console.log("processMarkersData");
      if (!Array.isArray(data) || !data.length) {
        return;
      }
      var circles = [];
      var includePoints = [];
      var markers = [];
      data.forEach(item => {
        console.log('processMarkersData item', item)
        if (status == "risk" && !(item.status.value == 20 || item.status.value == 30)) {
          return;
        }
        var bd09togcj02 = coordtransform.bd09togcj02(
          item.latitude,
          item.longitude
        );
        var latitude = bd09togcj02[0];
        var longitude = bd09togcj02[1];

        // var newItem = cloneDeep(this.markerTemplate);
        var newItem = { ...this.markerTemplate
          // callout: { ...this.markerTemplate.callout
          // },
          // label: { ...this.markerTemplate.label
          // }
        };
        newItem.id = item.nodeId;
        newItem.latitude = latitude;
        newItem.longitude = longitude;
        // newItem.title = item.leftRisksCount + "";
        newItem.iconPath = this.getStatusPinSrcByCode(item.status.value);
        newItem.callout = undefined;
        // newItem.callout.content = item.leftRisksCount + "";
        newItem.label = undefined;
        // newItem.label.content = item.leftRisksCount + "";

        circles.push(
          Object.assign(cloneDeep(this.circlesTemplate), {
            latitude,
            longitude
          })
        );
        includePoints.push({
          latitude,
          longitude
        });
        markers.push(newItem);
      });
      return {
        markers,
        circles,
        includePoints
      };
    },
    getStatusPinSrcByCode(code) {
      // 10 正常，20 预警, 30 报警
      // normal breakdown alert offline
      switch (code) {
        case 10:
          // return "正常";
          // return "../../static/images/common/address_green.png";
          return "../../static/images/common/normal.png";
          break;
        case 20:
          // return "预警";
          // return "../../static/images/common/address_yellow.png";
          return "../../static/images/common/breakdown.png";

          break;
        case 30:
          // return "报警";
          // return "../../static/images/common/address_red.png";
          return "../../static/images/common/alert.png";

          break;
        default:
          // return "未知";
          // return "../../static/images/common/address_gray.png";
          return "../../static/images/common/offline.png";
          break;
      }
    },
    setMarkers(dataObj) {
      console.info("setMarkers", dataObj);
      if (!dataObj) {
        return;
      }
      this.markers = dataObj.markers;
    },
    getRegionAndQueryMarkers() {
      this.getRegion().then(res => {
        this.queryMarkers(res)
      })
    },
    querySocalUnitInfoByNodeId(params = {}) {
      params.id = params.id || this.currentNodeId || "";
      if (!params.id) {
        return;
      }

      this.$http("mapSocialUnitsById", params, {
          method: "get"
        })
        .then(res => {
          console.info("mapSocialUnitsById", res);
          this.info = this.processSocialUnitDataForPanel(res.data);
          this.isShowPanel = true;
          console.info("this.info", this.info);
        })
        .catch(res => {
          console.info("mapSocialUnitsById catch", res);
          this.isShowPanel = false;
        });
    },
    processSocialUnitDataForPanel(data) {
      console.log('processSocialUnitDataForPanel', data)
      if (!data) {
        return;
      }
      var {
        socialUnit,
        leftRiskCount,
        status,
        deviceStatusWithCounts
      } = data;
      var {
        name,
        id,
        address,
        coverPicUrl,
        manResponsibleForFireSecurity,
        latitude,
        longitude
      } = socialUnit;
      coverPicUrl = coverPicUrl ? API.requestDomain + coverPicUrl : undefined;
      var deviceCounts = 0;
      var unknowDeviceCount = 0;
      deviceStatusWithCounts.forEach(item => {
        deviceCounts = deviceCounts + item.count;
        if (item.value == 20) {
          unknowDeviceCount = item.count;
        }
      });
      var {
        name: responseName,
        tel
      } = manResponsibleForFireSecurity;
      var result = {
        id,
        title: name,
        subtitle: address,
        bdLeftIcon: coverPicUrl,
        bdRightContentList: [{
            label: "单位状态：",
            value: status.desc,
            id: status.value
          },
          {
            label: "设备数量：",
            value: deviceCounts
          },
          {
            label: "隐患数量：",
            value: leftRiskCount
          },
          {
            label: "离线设备：",
            value: unknowDeviceCount
          }
        ],
        ftContent: "安全责任人：" + responseName + tel,
        extraInfo: {
          phoneNumber: tel,
          latitude,
          longitude
        }
      };
      console.info("processSocialUnitDataForPanel", result);
      return result;
    },
  },
  created() {
    // this.$root.$mp.page.$root[0].latitude = this.defaultLatitude;
    // this.$root.$mp.page.$root[0].longitude = this.defaultLongitude;
    // this.$root.$mp.page.$root[0].scale = 19;
  },
  mounted() {
    console.log('this.$root.$mp.page', this.$root.$mp.page)
    // --- 
    if (this.moveToLocationTimer) {
      clearTimeout(this.moveToLocationTimer)
    }
    if (this.getRegionAndQueryMarkersTimer) {
      clearTimeout(this.getRegionAndQueryMarkersTimer)
    }
    this.moveToLocationTimer = setTimeout(() => {
      this.mapCtx.moveToLocation();
      this.getRegionAndQueryMarkersTimer = setTimeout(() => {
        this.getRegionAndQueryMarkers();
      }, 1000);
    }, 1000);


    // ---

    // setTimeout(() => {
    //   this.setIncludePoints({
    //     latitude: 22.569294828991797, //this.defaultLatitude,
    //     longitude: 113.95937311904906, //this.defaultLongitude
    //   }).then((res) => {
    //     console.log('setIncludePoints success', res)
    //     this.getRegionAndQueryMarkers();
    //   }).catch((res) => {
    //     console.log('setIncludePoints fail', res)
    //   });
    // }, 10000);

    // this.$root.$mp.page.setData({
    //   '$root[0].latitude': this.latitude,
    //   '$root[0].longitude': this.longitude,
    //   '$root[0].scale': 15
    // })
  },
  destroyed() {
    if (this.moveToLocationTimer) {
      clearTimeout(this.moveToLocationTimer)
    }
    if (this.getRegionAndQueryMarkersTimer) {
      clearTimeout(this.getRegionAndQueryMarkersTimer)
    }
  },
}
