<template>
  <div
    class="hj-map"
    :class="hjClass"
    :style="hjStyle"
  >
    <!-- @click="clickMapContainer" -->
    <!-- :markers="markers" -->
    <!-- :circles="circles" -->
    <!-- :markers="markers" -->
    <!-- :include-points="includePoints"  -->
    <!-- enable-overlooking -->
    <!-- v-if="markers.length" -->
    <!-- :latitude="latitude" -->
    <!-- :longitude="longitude" -->
    <!-- :latitude="defaultCenterPoint.latitude"
      :longitude="defaultCenterPoint.longitude" -->
    <!-- :latitude="centerPoint.latitude"
      :longitude="centerPoint.longitude"
      :scale="scale" -->
    <map
      id="myMap"
      ref="myMap"
      name="hjVueMap"
      class="hj-map__com"
      :class="hjMapClass"
      show-compass
      show-location
      enable-zoom
      enable-scroll
      :enable-rotate="false"
      :markers="markers"
      :latitude="latitude"
      :longitude="longitude"
      @markertap="markertap"
      @callouttap="callouttap"
      @controltap="controltap"
      @regionchange="regionchange"
      @begin="regionBegin"
      @end="regionEnd"
      @tap="tap"
      @updated="updated"
      @poitap="poitap"
    >
      <cover-image
        v-if="pinIconImage"
        :src="pinIconImage"
        style="width:32px;height:32px;position:absolute; top: 50%;left:50%;transform: translate(-50%, -50%);"
      >
      </cover-image>

      <cover-image
        v-if="locationIconImage"
        :src="locationIconImage"
        style="width:32px;height:32px;position:absolute;bottom:20px;left:0px;"
        @click.stop="moveToUserLocation"
      >
      </cover-image>
      <cover-view
        style="position:absolute;top:6.435vh;right:0;padding:5px;background-color: #E97F66;color: #ffffff;font-size:11px;font-family:PingFang-SC-Medium;"
        @click="getRiskUnit"
      >
        <cover-view>
          隐患
        </cover-view>
        <cover-view>
          单位
        </cover-view>
      </cover-view>
      <cover-view
        style="position:absolute;top:17.655vh;right:0;padding:5px;background-color:#6678E9;color: #ffffff;font-size:11px;font-family:PingFang-SC-Medium;"
        @click="getAllUnit"
      >
        <cover-view>
          所有
        </cover-view>
        <cover-view>
          单位
        </cover-view>
      </cover-view>
    </map>

    <!-- <cover-image
      v-if="info"
      :src="navigateIcon"
      style="position:absolute;bottom:165px;right:5px;width:50px;height:50px;z-index:1112;"
    >
    </cover-image> -->

    <hjMapPanel
      v-if="isShowPanel"
      v-bind="info"
      hj-class="hj-map-panel-class-prop"
      @click-postfix-icon="clickPostfixIcon"
    ></hjMapPanel>

  </div>
</template>
<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import coordtransform from "coordtransform";

import hjMapPanel from "@/components/map/hj-map-panel.vue";
import cloneDeep from "lodash/cloneDeep.js";
import isEqual from "lodash/isEqual.js";
import API from '@/store/flyio/apiUrl/home.js';

export default {
  onShareAppMessage,
  onShow() {
    console.info("hj-map onShow");
  },
  name: "hj-map",
  components: {
    hjMapPanel
  },
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjMapClass: {
      type: String,
      default: ""
    },
    defaultCenterPoint: {
      type: Object,
      default: () => ({
        latitude: 39.7652,
        longitude: 116.577925
      })
    },
    defaultScale: {
      type: Number,
      default: 11
    },
    defaultShowPanel: {
      type: Boolean,
      default: false
    },
    hjStyle: {
      type: String,
      default: ""
    }
  },
  data() {
    // wx.getLocation({type: 'gcj02'})
    // 北京经纬度
    // var defaultLatitude = 39.7652000000;
    // var defaultLongitude = 116.5779250000;
    // 深圳经纬度
    // var defaultLatitude = 23.482468;
    // var defaultLongitude = 113.50388;

    // console.info("this.defaultLatitude", this.defaultLatitude);
    // console.info("this.defaultLongitude", this.defaultLongitude);

    // var defaultLatitude = 39.7652;
    // var defaultLongitude = 116.577925;

    var markerTemplate = {
      id: (Math.random() * 1000).toFixed(2),
      title: "title",
      latitude: this.defaultCenterPoint.latitude,
      longitude: this.defaultCenterPoint.longitude,
      callout: {
        content: "content",
        color: "#fff",
        bgColor: "#1fd14c",
        display: "BYCLICK" // BYCLICK , ALWAYS
        // padding: 5,
        // textAlign: "center",
        // borderColor: "#1fd14c",
        // borderWidth: 1,
        // borderRadius: 5,
      },
      label: {
        content: "content",
        color: "#DC143C",
        // color: "#1fd14c",
        bgColor: "#ffffff",
        anchorX: -5,
        anchorY: -20,
        padding: 4
        // textAlign: "center",
        // borderWidth: 1,
        // borderColor: "#E4FF00",
        // borderRadius: 5,
      },
      width: 24,
      height: 24,
      iconPath: "../../static/images/common/mapIcon@2x.png"
    };
    var circlesTemplate = {
      latitude: this.defaultCenterPoint.latitude,
      longitude: this.defaultCenterPoint.longitude,
      color: "#1fd14c",
      // fillColor: "#E4FF00",
      radius: 48, // 24，48，96，
      strokeWidth: 16 // 8，16,35
    };
    return {
      currentUnitState: "all", // all risk
      centerPoint: {
        latitude: this.defaultCenterPoint.latitude,
        longitude: this.defaultCenterPoint.longitude
      }, // null
      // regionBeginTimeStamp: 0,
      // regionEndTimeStamp: 0,
      mapSocialUnitsParams: null,
      isMounted: false,
      isShowPanel: false,
      // hjMapPanelClass: '',
      info: null,
      // mapCtx: null,
      // {
      //   title: "title",
      //   subtitle: "subtitle"
      // },
      navigateIcon: "../../static/images/common/phone_light@3x.png",
      coverImage: "../../static/images/common/address@2x.png",
      pinIconImage: "../../static/images/common/address@2x.png",
      locationIconImage: "../../static/images/common/address@2x.png",
      scale: this.defaultScale, // 11
      latitude: this.defaultCenterPoint.latitude,
      longitude: this.defaultCenterPoint.longitude,
      // centerLatitude: 0,
      // centerLongitude: 0,
      markerTemplate,
      // markers: [markerTemplate],
      markers: undefined,
      circlesTemplate,
      circles: [circlesTemplate],
      includePoints: [
        {
          latitude: this.defaultCenterPoint.latitude, // defaultLatitude,
          longitude: this.defaultCenterPoint.longitude // defaultLongitude
        }
      ]
    };
  },
  watch: {
    defaultShowPanel(newVal, oldVal) {
      this.isShowPanel = newVal;
    }
    // defaultCenterPoint(newVal, oldVal) {
    //   if (newVal) {
    //     this.moveToLocation(newVal);
    //   }
    // }
  },
  methods: {
    clickMapContainer(e) {
      console.log("clickMapContainer", e);
    },
    markertap(e) {
      console.info("markertap e", e);
      var id = e.mp.markerId;
      this.isShowPanel = true;
      this.querySocalUnitInfoByNodeId({ id });
    },
    callouttap(e) {
      console.info("callouttap e", e);
    },
    controltap(e) {
      console.info("controltap e", e);
    },
    regionchange(e) {
      console.info("regionchange e", e);
    },
    regionBegin(e) {
      console.info("regionBegin", e);

      // this.regionBeginTimeStamp = 0;
      // this.regionEndTimeStamp = 0;
      wx.setStorageSync("regionBeginTimeStamp", e.timeStamp);
      // this.regionBeginTimeStamp = e.timeStamp;
    },
    regionEnd(e) {
      console.info("regionEnd", e);
      // console.log("this.isMounted", this.isMounted);
      // console.log("this.scale", this.scale);
      // debugger;
      // this.regionEndTimeStamp = e.timeStamp;

      var regionBeginTimeStamp = wx.getStorageSync("regionBeginTimeStamp");
      console.warn(
        "regionEndTimeStamp - regionBeginTimeStamp",
        e.timeStamp - regionBeginTimeStamp
      );
      console.warn("this.causeby", this.causeby);
      // if (!this.mapSocialUnitsParams) {
      //   this.debounceGetRegion();
      // } else
      // if (!this.causeby) {
      if (e.timeStamp - regionBeginTimeStamp > 120) {
        this.$nextTick(() => {
          wx.nextTick(() => {
            this.debounceGetRegion();
          });
        });
      }
      //  else if (this.regionEndTimeStamp - this.regionBeginTimeStamp > 100) {
      //   this.debounceGetRegion();
      //   // this.getRegionAndInitData();
      // }

      // // this.debounceGetRegion();
      // if (e.mp.causedBy == "drag") {
      //   this.debounceGetRegion();
      // } else {
      //   if (e.mp.causedBy == "scale") {
      //   }
      // }
    },
    tap(e) {
      console.warn("tap e", e);
      this.isShowPanel = false;
    },
    updated(e) {
      console.warn("updated e", e);
    },
    poitap(e) {
      console.warn("poitap e", e);
    },
    clickPostfixIcon(e) {
      wx.makePhoneCall({
        phoneNumber: e.extraInfo.phoneNumber
      });
    },
    processSocialUnitDataForPanel(data) {
      if (!data) {
        return;
      }
      var { socialUnit, leftRiskCount, status, deviceStatusWithCounts } = data;
      var {
        name,
        address,
        coverPicUrl,
        manResponsibleForFireSecurity
      } = socialUnit;
      coverPicUrl = coverPicUrl
        ? API.requestDomain + coverPicUrl
        : "../../static/images/common/socialUnitSampleImg.jpg";
      var deviceCounts = 0;
      var unknowDeviceCount = 0;
      deviceStatusWithCounts.forEach(item => {
        deviceCounts = deviceCounts + item.count;
        if (item.value == 20) {
          unknowDeviceCount = item.count;
        }
      });
      var { name: responseName, tel } = manResponsibleForFireSecurity;
      var result = {
        title: name,
        subtitle: address,
        bdLeftIcon: coverPicUrl,
        bdRightContentList: [
          {
            label: "单位状态：",
            value: status.desc,
            id: status.value
          },
          {
            label: "设备数量：",
            value: deviceCounts
          },
          {
            label: "隐患个数：",
            value: leftRiskCount
          },
          {
            label: "离线设备：",
            value: unknowDeviceCount
          }
        ],
        ftContent: "安全责任人：" + responseName + tel,
        extraInfo: {
          phoneNumber: tel
        }
      };
      console.info("processSocialUnitDataForPanel", result);
      return result;
    },
    querySocalUnitInfoByNodeId(params = {}) {
      params.id = params.id || this.currentNodeId || "";
      if (!params.id) {
        return;
      }

      this.$http("mapSocialUnitsById", params, { method: "get" })
        .then(res => {
          console.info("mapSocialUnitsById", res);
          this.info = this.processSocialUnitDataForPanel(res.data);
          console.info("this.info", this.info);
        })
        .catch(res => {
          console.info("mapSocialUnitsById catch", res);
        });
    },
    processData({ data, status }) {
      console.log("processData", data);
      if (!Array.isArray(data) || !data.length) {
        return;
      }
      var circles = [];
      var includePoints = [];
      var markers = [];
      data.forEach(item => {
        console.warn("data.forEach out", item);
        if (
          status == "risk" &&
          !(item.status.value == 20 || item.status.value == 30)
        ) {
          console.warn("data.forEach in", item);

          console.log("item", item, "status", status);
          return;
        }
        console.warn("data.forEach after", item);

        var bd09togcj02 = coordtransform.bd09togcj02(
          item.latitude,
          item.longitude
        );
        var latitude = bd09togcj02[0];
        var longitude = bd09togcj02[1];

        console.info("latitude", latitude);
        console.info("longitude", longitude);

        // this.latitude = this.latitude || latitude;
        // this.longitude = this.longitude || longitude;

        var newItem = cloneDeep(this.markerTemplate);
        newItem.id = item.nodeId;
        newItem.latitude = latitude;
        newItem.longitude = longitude;
        newItem.title = item.leftRisksCount + "";
        newItem.iconPath = this.getStatusPinSrcByCode(item.status.value);
        newItem.callout = undefined;
        // newItem.callout.content = item.leftRisksCount + "";
        newItem.label = undefined;
        // newItem.label.content = item.leftRisksCount + "";
        console.info("newItem", newItem);

        circles.push(
          Object.assign(cloneDeep(this.circlesTemplate), {
            latitude,
            longitude
          })
        );
        includePoints.push({ latitude, longitude });
        markers.push(newItem);

        // return newItem;
      });

      // this.circles = circles;
      // this.includePoints = includePoints;
      // this.markers = markers;

      // this.mapCtx = wx.createMapContext("myMap");
      // this.mapCtx.includePoints({
      //   padding: [10],
      //   points: this.includePoints
      // });

      // this.$nextTick(() => {
      //   wx.nextTick(() => {
      //     this.moveToLocation(this.includePoints);
      //   });
      // });

      console.info("this.markers", this.markers);
      console.info("this.circles", this.circles);
      console.info("this.includePoints", this.includePoints);

      return {
        markers,
        circles,
        includePoints
      };
    },
    setData(dataObj, locationInfo) {
      console.info("setData", "dataObj", dataObj, "locationInfo", locationInfo);

      if (!dataObj) {
        return;
      }
      this.causeby = "setData";

      // this.scale = locationInfo.scale;
      // this.centerPoint = { ...locationInfo.point };

      // this.markers = cloneDeep(dataObj.markers);
      this.markers = dataObj.markers;
      console.log("this.markers", this.markers);
      // console.log("after this.markers",  this.markers);
      // dataObj.markers.map(item => {
      //   return item;
      //   });

      // console.log('this.isFirstTimeInit', this.isFirstTimeInit)
      // if(!this.isFirstTimeInit){
      // }

      // this.$nextTick(() => {
      //   wx.nextTick(() => {
      //     this.markers = dataObj.markers.map(item => {
      //       return cloneDeep(item);
      //     });
      //   });
      // });

      if (this.updateMarkersTimer) {
        clearTimeout(this.updateMarkersTimer);
        this.updateMarkersTimer = null;
      }
      this.updateMarkersTimer = setTimeout(() => {
        this.$nextTick(() => {
          wx.nextTick(() => {
            this.causeby = "";
          });
        });
      }, 300);

      // if (!this.markers) {
      //   this.markers = dataObj.markers;
      // } else {
      //   if (this.markers.length > dataObj.markers.length) {
      //     this.markers.forEach((item, index) => {
      //       if (index < dataObj.markers.length) {
      //         this.markers[index] = dataObj.markers[index];
      //       } else {
      //         this.markers[index] = undefined;
      //       }
      //     });
      //   } else {
      //     dataObj.markers.forEach((item, index) => {
      //       this.markers[index] = item;
      //     });
      //   }
      // }

      this.includePoints = dataObj.includePoints;
      // this.moveToLocation(this.centerPoint);
    },
    moveToLocation(includePoints, isInit) {
      console.info("moveToLocation,includePoints", includePoints);
      if (!this.mapCtx) {
        this.mapCtx = wx.createMapContext("myMap");
      }
      if (includePoints && includePoints instanceof Object) {
        var points = [];
        if (Array.isArray(includePoints) && includePoints.length) {
          points = includePoints;
        } else if (!Array.isArray(includePoints)) {
          points = [cloneDeep(includePoints)];
        }
        var includePointsObj = {
          padding: [30],
          points: points
        };
        console.log("includePoints", includePoints);
        if (isInit) {
          includePointsObj.complete = res => {
            console.log("moveToLocation success");
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.timer = setTimeout(() => {
              this.debounceGetRegion();
            }, 100);
          };
        }
        this.mapCtx.includePoints(includePointsObj);
      } else {
        this.mapCtx && this.mapCtx.moveToLocation(); // 移动到用户所在地址中心；
      }
    },
    moveToUserLocation(e) {
      console.log("moveToUserLocation", e);
      console.log("#myMapDom", this.$root.$mp.page.selectComponent("#myMap"));
      // this.moveToLocation();
      // this.getCenterLocation().then(res => {
      //   console.warn(res);
      // });
      this.mapCtx.getCenterLocation({
        success: res => {
          console.info("getCenterLocation res.latitude", res.latitude);
          console.info("getCenterLocation res.longitude", res.longitude);
          // resolve({ latitude: res.latitude, longitude: res.longitude });
        }
      });
      this.mapCtx.getScale({
        success: res => {
          console.log("getScale", res);
          // resolve(res);
        }
      });
      this.mapCtx.getRegion({
        success: res => {
          console.info("getRegion", res);
          var mapSocialUnitsParams = {
            leftBtmLng: res.southwest.longitude,
            leftBtmLat: res.southwest.latitude,
            rightTopLng: res.northeast.longitude,
            rightTopLat: res.northeast.latitude
          };
          console.info("mapSocialUnitsParams", mapSocialUnitsParams);
          console.info("this.mapSocialUnitsParams", this.mapSocialUnitsParams);
          // this.mapSocialUnitsParams = mapSocialUnitsParams;
          // this.initData(mapSocialUnitsParams);
          // if (!isEqual(this.mapSocialUnitsParams, mapSocialUnitsParams)) {
          //   this.mapSocialUnitsParams = mapSocialUnitsParams;
          //   this.initData(mapSocialUnitsParams);
          // }
        }
      });
      // this.mapCtx.getCenterLocation({
      //   success: res => {
      //     console.info("getCenterLocation res.latitude", res.latitude);
      //     console.info("getCenterLocation res.longitude", res.longitude);
      //     resolve({ latitude: res.latitude, longitude: res.longitude });
      //   }
      // });
    },
    getCenterLocation() {
      if (!this.mapCtx) {
        this.mapCtx = wx.createMapContext("myMap");
      }
      return new Promise((resolve, reject) => {
        this.mapCtx &&
          this.mapCtx.getCenterLocation({
            success: res => {
              console.info("res.latitude", res.latitude);
              console.info("res.longitude", res.longitude);
              resolve({ latitude: res.latitude, longitude: res.longitude });
            }
          });
      });
    },
    debounceGetRegion() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(
        that => {
          if (!this.timerCount) {
            this.timerCount = 0;
          }
          this.timerCount += 1;
          console.log(
            "in debounceGetRegion setTimeout timerCount",
            this.timerCount
          );
          // this.getCenterLocation().then(res => {
          //   // if (!isEqual(this.defaultCenterPoint, res) || !this.markers.length) {
          //   //   this.$emit("updateCurrentCenterPoint", res);
          //   //   this.$nextTick(() => {
          //   //     wx.nextTick(() => {
          //   //       this.getRegionAndInitData();
          //   //     });
          //   //   });
          //   // }
          if (!that.timer) {
            return;
          }

          //   this.$emit("update-current-center-point", res);
          //   this.centerPoint = { ...res };
          //   this.getRegionAndInitData();
          // });
          this.getScaleAndCenterLocation()
            .then(res => {
              console.warn("getScaleAndCenterLocation success", res);
              // this.centerPoint = { ...res.point };
              this.$emit("update-current-center-point", res);
              // this.scale = res.scale;
              this.$emit("update-scale", res.scale);
              this.getRegionAndInitData();
            })
            .catch(res => {
              console.info("getScaleAndCenterLocation catch", res);
            });
          // this.getRegionAndInitData();
        },
        100,
        this
      );
    },
    getScaleAndCenterLocation() {
      return new Promise((resolve, reject) => {
        Promise.all([this.getScale(), this.getCenterLocation()]).then(res => {
          console.log("getScaleAndCenterLocation", res);
          if (res.length == 2) {
            resolve({
              scale: res[0].scale,
              point: res[1]
            });
          } else {
            console.error("call getScaleAndCenterLocation function error", res);
          }
        });
      });
    },
    getScale() {
      if (!this.mapCtx) {
        this.mapCtx = wx.createMapContext("myMap");
      }
      return new Promise((resolve, reject) => {
        this.mapCtx.getScale({
          success: res => {
            resolve(res);
          }
        });
      });
    },
    getRegionAndInitData() {
      if (!this.mapCtx) {
        this.mapCtx = wx.createMapContext("myMap");
      }
      // return new Promise((resolve, reject)=>{
      //   this.mapCtx.getRegion({success: (res)=>{
      //     resolve(res)
      //   }})
      // })
      this.mapCtx.getRegion({
        success: res => {
          console.info("getRegion", res);
          var mapSocialUnitsParams = {
            leftBtmLng: res.southwest.longitude,
            leftBtmLat: res.southwest.latitude,
            rightTopLng: res.northeast.longitude,
            rightTopLat: res.northeast.latitude
          };
          console.info("mapSocialUnitsParams", mapSocialUnitsParams);
          console.info("this.mapSocialUnitsParams", this.mapSocialUnitsParams);
          this.mapSocialUnitsParams = mapSocialUnitsParams;
          this.initData(mapSocialUnitsParams);
          // if (!isEqual(this.mapSocialUnitsParams, mapSocialUnitsParams)) {
          //   this.mapSocialUnitsParams = mapSocialUnitsParams;
          //   this.initData(mapSocialUnitsParams);
          // }
        }
      });
    },
    getRiskUnit(e) {
      console.info("getRiskUnit", e);
      this.isShowPanel = false;
      this.currentUnitState = "risk";
      this.debounceGetRegion();

      // this.getRegionAndInitData();

      // var defaultLatitude = 23.482468;
      // var defaultLongitude = 113.50388;
      // this.latitude = 23.482468;
      // this.longitude = 113.50388;

      // console.info("this", this);
      // console.info("this.latitude", this.latitude);
      // console.info("this.longitude", this.longitude);
      // this.latitude = this.latitude - 2;
      // this.longitude = this.longitude - 2;

      // this.moveToLocation({
      //   latitude: this.latitude,
      //   longitude: this.longitude
      // });
      // console.info("this.latitude", this.latitude);
      // console.info("this.longitude", this.longitude);

      // this.$nextTick(() => {
      //   this.getCenterLocation();
      // });
      // this.isShowPanel = false;
      // this.openLocation({
      //   latitude: 23.482468,
      //   longitude: 113.50388
      // });
      // this.mapCtx.moveToLocation();
      // this.getCenterLocation();
    },
    getAllUnit(e) {
      console.info("getAllUnit", e);
      this.isShowPanel = false;
      this.currentUnitState = "all";
      this.debounceGetRegion();
      // this.getRegionAndInitData();

      // this.mapCtx.moveToLocation();
      // this.getCenterLocation();
    },
    chooseLocation() {
      wx.chooseLocation({
        success: res => {
          // address:"广东省深圳市南山区桃园路5号",
          // errMsg:"chooseLocation:ok",
          // latitude:22.53132,
          // longitude:113.9297,
          // name:"友邻公寓"
          console.info("chooseLocation", res);
        }
      });
    },
    openLocation(object) {
      wx.openLocation({
        success: res => {
          console.info("openLocation", res);
        },
        ...object
      });
    },
    initData(params = {}) {
      // 73°E~135°E ， 4°N~53°N
      // latitude:4, longitude: 73
      // latitude:53, longitude: 135
      params.leftBtmLng = params.leftBtmLng || 73;
      params.leftBtmLat = params.leftBtmLat || 3;
      params.rightTopLng = params.rightTopLng || 135;
      params.rightTopLat = params.rightTopLat || 54;
      this.$http("mapSocialUnits", params, { method: "get" })
        .then(res => {
          console.info("socialUnitsDetailList", res);

          // this.getCenterLocation().then(centerPoint => {
          //   if (
          //     !isEqual(this.defaultCenterPoint, centerPoint) ||
          //     !this.markers.length
          //   ) {
          //     this.defaultCenterPoint.latitude = centerPoint.latitude;
          //     this.defaultCenterPoint.longitude = centerPoint.longitude;
          //     this.$emit("updateCurrentCenterPoint", centerPoint);
          //     this.$nextTick(() => {
          //       wx.nextTick(() => {
          //         this.setData(this.processData(res.data));
          //       });
          //     });
          //   } else {
          //     this.setData(this.processData(res.data));
          //   }
          // });

          this.getScaleAndCenterLocation()
            .then(locationInfo => {
              console.warn("getScaleAndCenterLocation success", locationInfo);
              // this.centerPoint = { ...locationInfo.point };
              this.$emit("update-current-center-point", {
                ...locationInfo.point
              });
              // this.scale = locationInfo.scale;
              this.$emit("update-scale", locationInfo.scale);

              this.setData(
                this.processData({
                  data: res.data,
                  status: this.currentUnitState
                }),
                locationInfo
              );
            })
            .catch(res => {
              console.info("getScaleAndCenterLocation catch", res);
            });
        })
        .catch(res => {
          console.info("socialUnitsDetailList catch", res);
        });
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
    }
  },
  created() {
    console.info("hj-wx-map created");
    this.centerPoint = { ...this.defaultCenterPoint };
    this.scale = this.defaultScale;
    this.latitude = this.centerPoint.latitude;
    this.longitude = this.centerPoint.longitude;
  },
  mounted() {
    console.info("this.isMounted", this, this.isMounted);
    this.mapCtx = wx.createMapContext("myMap");
    console.log("this.mapCtx", this.mapCtx);
    console.log("this.centerPoint", this.centerPoint);

    // this.moveToLocation(this.centerPoint, true);
    this.moveToLocation();
    this.$nextTick(() => {
      wx.nextTick(() => {
        this.debounceGetRegion();
        console.log("#myMapDom", this.$root.$mp.page.selectComponent("#myMap"));
        console.log("myMap ref", this.$refs);
      });
    });
    console.info("map mounted");
  },
  destroyed() {
    console.warn("hjMap destroyed");
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    // conosle.log
    if (this.updateMarkersTimer) {
      clearTimeout(this.updateMarkersTimer);
      this.updateMarkersTimer = null;
    }
    // this.causeby = "";
  }
};
</script>
<style lang="scss">
.hj-map {
  // padding: 12px 12px 45px 12px;
  // margin-top: 45px;
  background-color: #f4fbf6;
  font-family: PingFang-SC-Medium;
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: start;
  // width: 100wh;
  min-height: 100vh;
  box-sizing: border-box;
  &__com {
    // width: 100%;
    // height: 300px;
    width: 100%;
    height: 33vh;
    position: relative;
    top: 0px;
  }
  // &__test {
  //   color: var(--primary-color);
  //   // color: $--font-color-primary;
  // }
}
.hj-map-panel-class-prop {
  // margin: 5px;
  // box-sizing: border-box;
  // padding: 10px;
  position: absolute;
  bottom: 0px;
}
</style>
