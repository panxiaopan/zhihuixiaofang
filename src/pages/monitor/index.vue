<template>
  <div class="hj-monitor container hj-monitor__no-padding">
    <!-- :class="mapContainerClass" -->
    <wux-toptips id="wux-toptips1" />
    <div
      v-if="!isAuth"
      style="height:100%;width:100%;position:relative: z-index:11111;"
    >暂无权限查看</div>

    <wux-row
      v-if="isAuth"
      wux-class="hj-monitor__bar--wux"
      class="hj-monitor__bar"
    >
      <wux-col span="10">
        <wux-search-bar
          v-if="!isShowMap"
          wux-class="hj-monitor__bar__search"
          class="hj-monitor__bar__search"
          :value="searchStr"
          :auto="auto"
          :placeholder="placeholder"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
          @confirm="onConfirm"
          @clear="onClear"
          @cancel="onCancel"
        >
        </wux-search-bar>
        <search-com
          v-if="isShowMap"
          @iclick="searchPage"
          hj-style="height:36px;margin-top:4px;margin-bottom:4px;"
        ></search-com>
      </wux-col>
      <wux-col span="2">
        <div
          class="hj-monitor__bar__icon"
          @click="showMap"
        >
          &nbsp;
          &nbsp;
          &nbsp;
          <img
            v-if="unactiveMapIcon&&!isShowMap"
            class="hj-monitor__bar__icon__ele"
            :src="unactiveMapIcon"
            alt="unactiveMapIcon"
            mode="aspectFit"
          >
          <wux-icon
            v-if="isShowMap"
            type="md-list"
            size="28"
            color="rgb(8,8,8)"
          ></wux-icon>
          &nbsp;
        </div>
      </wux-col>
    </wux-row>
    <div
      v-if="!isShowMap"
      style="width:100%;padding-left:12px;padding-right:12px;box-sizing:border-box;"
    >
      <!-- <div style="height: 90px"></div> -->
      <div style="height: 5rem"></div>
      <wux-filterbar
        v-if="isAuth"
        class="hj-monitor__filter"
        wux-class="hj-monitor__filter--wux"
        :items="filterList"
        @change="onFilterChange"
        @open="onFilterOpen"
        @close="onFilterClose"
      />

      <wux-refresher
        wux-class="hj-monitor__penel-list-wrapper"
        class="hj-monitor__penel-list-wrapper"
        v-if="isAuth"
        id="wux-refresher1"
        @pulling="onPulling"
        @refresh="onRefresh"
      >
        <hjMonitorSocialUnitPanel
          hj-class="hj_home__div"
          v-for="li in list"
          :key="li.id"
          @iclick="clickPanle(li)"
          @click-ft="clickFt(li)"
          v-bind="li"
        ></hjMonitorSocialUnitPanel>
      </wux-refresher>
      <div
        v-if="showBottomLoading"
        class="hj__loading"
      >
        <img
          v-if="loadingImg"
          class="hj__loading__img"
          :src="loadingImg"
          style="height: 24px;width:24px;"
          alt=""
        >
      </div>
      <div
        v-if="isAuth"
        class="hj__to_top"
        hover-class="hj__to_top--hover"
        @click="toTop"
      >
        <!-- <wux-icon
          class="hj__to_top__btn"
          type="md-arrow-up"
          style=""
          size="34"
        ></wux-icon> -->
      </div>
    </div>

    <div
      class="hj-map"
      :style="hjStyle"
      @click.stop
    >

      <!-- :scale="scale"
    :latitude="latitude"
    :longitude="longitude" 
    :latitude="centerPoint.latitude"
    :longitude="centerPoint.longitude"
    @updated="updated"
      -->

      <map
        id="myMap"
        name="hjVueMap"
        class="hj-map__com"
        show-compass
        show-location
        enable-zoom
        enable-scroll
        :enable-rotate="false"
        :markers="markers"
        @markertap="markertap"
        @callouttap="callouttap"
        @controltap="controltap"
        @regionchange="regionchange"
        @begin="begin"
        @end="end"
        @tap="tap"
        @poitap="poitap"
      >
        <cover-image
          v-if="pinIconImage"
          :src="pinIconImage"
          style="width:32px;height:32px;position:absolute; top: 50%;left:50%;transform: translate(-50%, -100%);"
        >
        </cover-image>
        <cover-view style="width:32px;height:32px;position:absolute;top:20px;left:20px;background:#fff;border-radius:16px;">
          <cover-image
            v-if="locationIconImage"
            :src="locationIconImage"
            @click.stop="clickLocation"
            style="width:32px;height:32px;"
          >
          </cover-image>
        </cover-view>

        <cover-view
          style="position:absolute;top:6.435vh;right:10px;padding:5px;background-color: #E97F66;color: #ffffff;font-size:11px;font-family:PingFang-SC-Medium;"
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
          style="position:absolute;top:17.655vh;right:10px;padding:5px;background-color:#6678E9;color: #ffffff;font-size:11px;font-family:PingFang-SC-Medium;"
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
        @click-navigator="clickNavigator"
        @click-container="clickContainer"
      ></hjMapPanel>

    </div>
  </div>
</template>

<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import hjMonitorSocialUnitPanel from "@/components/hj-monitor/hj-monitor-social-unit-panel.vue";
import wuxToptips from "@/mixins/wuxToptips.js";
import { $stopWuxRefresher } from "@/utils/wux.js";
import cloneDeep from "lodash/cloneDeep.js";
import setScrollTop from "@/mixins/setScrollTop.js";
import hjMapMixin from "@/mixins/hjMap.js";
import coordtransform from "coordtransform";
import hjMapPanel from "@/components/map/hj-map-panel.vue";
import isEqual from "lodash/isEqual.js";
import searchCom from "@/components/search-com/index.vue";
export default {
  onShareAppMessage,
  onShow() {
    console.log(" onShow ");
    var monitorParams = wx.getStorageSync("monitor");
    if (monitorParams) {
      wx.getStorageSync("monitor", "");
      this.clickFt(monitorParams);
    }
  },
  onReachBottom(e) {
    console.log("onReachBottom", e);
    this.showBottomLoading = true;
    if (this.listParams.size > this.total) {
      this.showBottomLoading = false;
    } else {
      this.listParams.size += 10;
      this.initData(this.listParams, this.setPushingData);
    }
  },
  name: "hj-monitor",
  components: {
    hjMonitorSocialUnitPanel,
    hjMapPanel,
    searchCom
  },
  mixins: [wuxToptips, setScrollTop, hjMapMixin],
  data() {
    var defaultListParams = {
      keyword: "",
      state: "",
      orderCol: "",
      orderType: "",
      start: 0,
      size: 10
    };
    return {
      isShowMap: false,
      defaultSize: 10,
      total: 0,
      loadingImg: "../../static/images/common/loading.png",
      unactiveMapIcon: "../../static/images/common/mapIcon@2x.png",
      showBottomLoading: false,
      isMounted: false,
      searchStr: "",
      auto: false,
      placeholder: "Search",
      filterList: [
        // sort  1 : desc, -1: asc, 0 : 默认 // 循环顺序， 默认 倒序 正序 即 0 1 -1;
        {
          type: "text",
          label: "安装时间",
          value: "installedDate",
          checked: false,
          sort: undefined,
          groups: ["001"]
        },
        {
          type: "text",
          label: "隐患数量",
          value: "mostRiskCount",
          checked: false,
          sort: undefined,

          groups: ["002"]
        },
        {
          type: "filter",
          label: "筛选",
          value: "filter",
          checked: true,
          visible: false,
          children: [
            {
              type: "checkbox",
              label: "状态",
              value: "state",
              children: [
                {
                  value: "normal",
                  label: "正常",
                  checked: false
                },
                {
                  value: "alarm",
                  label: "报警",
                  checked: false
                },
                {
                  value: "fault",
                  label: "故障",
                  checked: false
                },
                {
                  value: "communicationInterruption",
                  label: "离线",
                  checked: false
                }
              ]
            }
          ],
          groups: ["001", "002"]
        }
      ],
      listParams: {
        ...defaultListParams
      },
      defaultListParams,
      list: [],
      //地图相关 变量
      pinIconImage: "../../static/images/common/pin.png",
      locationIconImage: "../../static/images/common/location.png",
      currentUnitState: "all" // all risk
      // isShowPanel: false,
      // info: {}
    };
  },
  computed: {
    isAuth() {
      return (
        this.$store.state.userPermissionsMap &&
        this.$store.state.userPermissionsMap["mp_realtime_monitoring_group"]
      );
    },
    hjStyle() {
      if (!this.isShowMap) {
        return "position: absolute;top: -120vh;";
      } else {
        return "position: absolute;top: 0px;";
      }
    }
  },
  methods: {
    searchPage(e) {
      console.log("searchPage", e);
      wx.navigateTo({
        url:
          "/pages/search/main?url=socialUnitsDetailList&from=map&process=processData&to=&panel=mapSocialUnitPanel"
      });
    },
    showMap() {
      //  this.$root.$mp.page.setData({
      //   "$root[0].latitude": this.latitude,
      //   "$root[0].longitude": this.longitude,
      //   "$root[0].scale": 15
      // });

      this.isShowMap = !this.isShowMap;
    },
    toTop(e) {
      console.log("toTop", e);
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300,
        success: res => {
          console.log("pageScrollTo", res);
        },
        fail: res => {
          console.log("fail", res);
        },
        complete: res => {
          console.log("complete", res);
        }
      });
    },
    onChange(e) {
      console.log("onChange", e);
      this.searchStr = e.mp.detail.value;
    },
    onFocus(e) {
      console.log("onFocus", e);
    },
    onBlur(e) {
      console.log("onBlur", e);
    },
    onConfirm(e) {
      console.log("onConfirm", e);
      this.searchStr = e.mp.detail.value;
      this.listParams.keyword = this.searchStr;
      this.listParams.size = 10;
      this.initData(this.listParams);
    },
    onClear(e) {
      console.log("onClear", e);
      this.searchStr = "";
    },
    onCancel(e) {
      console.log("onCancel", e);
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.searchStr = "";
        this.listParams.keyword = this.searchStr;
        this.listParams.size = 10;
        this.initData(this.listParams);
      }, 300);
    },
    onFilterChange(e) {
      console.log("onFilterChange", e);
      this.listParams.size = this.defaultSize;
      var checkedItems = e.mp.detail.checkedItems;
      var items = e.mp.detail.items;
      console.log("items", items);
      console.log("checkedItems", checkedItems);
      if (Array.isArray(checkedItems) && checkedItems.length) {
        checkedItems.forEach((item, index) => {
          if (item.type == "text") {
            this.listParams.orderCol = item.value;
            this.listParams.orderType = "desc";
          }
          if (item.type == "filter") {
            item.children.forEach(child => {
              if (child.type == "checkbox") {
                this.listParams[child.value] = child.children
                  .filter(grandchild => {
                    return grandchild.checked;
                  })
                  .map(filterItem => {
                    return filterItem.value;
                  })
                  .join(",");
              }
              if (child.type == "radio") {
              }
            });
          }
        });
      }
      console.log("this.listParams", this.listParams);
      this.filterList = cloneDeep(items);
      this.initData(this.listParams);
    },
    onFilterOpen(e) {
      console.log("onFilterOpen", e);
      this.filterList[2].visible = true;
    },
    onFilterClose(e) {
      console.log("onFilterClose", e);
      this.filterList[2].visible = false;
    },
    initData(params = {}, cb) {
      console.log("initData socialUnitsDetailList");
      if (!this.$store.dispatch("isAuth", "mp_realtime_monitoring_group")) {
        return false;
      }
      this.$http("socialUnitsDetailList", params, { method: "get" })
        .then(res => {
          console.log("socialUnitsDetailList success res", res);
          if (cb) {
            cb(res);
          } else {
            this.setData(res.data);
          }
        })
        .catch(res => {
          console.log("socialUnitsDetailList fail res", res);
          this.wuxToptips({ text: "请求社会单位列表失败：" }, res);
        });
    },
    setData(data = {}, notReload) {
      console.log("setData", data);
      this.total = data.total || 0;
      var rows = (data && Array.isArray(data.rows) && data.rows) || [];
      if (!notReload) {
        this.list = [];
      }
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.list = rows;
        });
      });
    },
    setPushingData(res) {
      // 记住scrolltop的位置
      // var data = {total: res.data.total, rows: res.data.rows}
      this.setData(res.data, true);
      // 设置scroltop的位置
      this.showBottomLoading = false;
    },
    onPulling(e) {
      console.log("onPulling", e);
    },
    setPullingData(res) {
      this.setData(res.data);
      this.stopWuxRefresher();
    },
    onRefresh(e) {
      console.log("onRefresh e", e);
      if (this.scrollTop <= 5 * 16) {
        this.initData(this.listParams, this.setPullingData);
      } else {
        this.stopWuxRefresher();
      }
    },
    stopWuxRefresher() {
      $stopWuxRefresher("#wux-refresher1", this.$root.$mp.page);
    },
    clickPanle(li) {
      wx.navigateTo({
        url:
          "/pages/social-unit-package/home/main?id=" +
          li.id +
          "&name=" +
          li.name +
          "&currentTab=summary"
      });
    },
    clickFt(li) {
      console.log("clickFt", li); // {  latitude: li.latitude,  longitude: li.longitude}
      this.isShowMap = true;
      var bd09togcj02 = coordtransform.bd09togcj02(li.latitude, li.longitude);
      var latitude = bd09togcj02[0];
      var longitude = bd09togcj02[1];
      this.setIncludePoints({
        latitude: latitude,
        longitude: longitude
      }).then(res => {
        console.log("is going to getRegionAndQueryMarkers", res);
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          // console.log("is going to getRegionAndQueryMarkers timeout", res);
          this.getRegionAndQueryMarkers();
        }, 1000);
      });
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        // console.log("is going to getRegionAndQueryMarkers timeout", res);
        this.getRegionAndQueryMarkers();
        this.querySocalUnitInfoByNodeId({ id: li.id });
      }, 1000);
    },
    moveToUserLocation(e) {
      console.log("moveToUserLocation", e);
      this.getCenterLocation();

      // this.$root.$mp.page.setData(
      //   {
      //     "$root[0].centerPoint": {
      //       latitude: this.latitude,
      //       longitude: this.longitude
      //     },
      //     "$root[0].scale": 15
      //   },
      //   function(res) {
      //     console.log("this.$root.$mp.page.setData res", res);
      //   }
      // );

      //  this.$root.$mp.page.setData({
      //   "$root[0].latitude": this.latitude,
      //   "$root[0].longitude": this.longitude,
      //   "$root[0].scale": 15
      // });
    },
    getRiskUnit(e) {
      console.log("getRiskUnit", e);
      // this.isShowPanel = false;
      this.currentUnitState = "risk";
      this.getRegionAndQueryMarkers();
    },
    getAllUnit(e) {
      console.log("getAllUnit", e);
      // this.isShowPanel = false;
      this.currentUnitState = "all";
      this.getRegionAndQueryMarkers();
    },
    clickLocation(e) {
      console.log("clickLocation", e);
      this.isShowPanel = false;
      this.mapCtx.moveToLocation();
    },
    clickPostfixIcon(e) {
      console.log("clickPostfixIcon", e);
      wx.makePhoneCall({
        phoneNumber: e.extraInfo.phoneNumber
      });
    },
    clickNavigator(e) {
      // console.log("clickNavigator", e);
      var { title: name, subtitle: address, extraInfo } = e;
      var { latitude, longitude } = extraInfo;
      var bd09togcj02 = coordtransform.bd09togcj02(latitude, longitude);
      latitude = bd09togcj02[0];
      longitude = bd09togcj02[1];
      wx.openLocation({
        latitude,
        longitude,
        scale: 19,
        name,
        address,
        success: res => {
          console.log("openLocation", res);
        }
        // fail
        // complete
      });
    },
    clickContainer(props) {
      console.log("clickContainer", props);
      wx.navigateTo({
        url:
          "/pages/social-unit-package/home/main?id=" +
          props.id +
          "&name=" +
          props.title +
          "&currentTab=summary"
      });
    }
  },
  created() {
    // if ( this.$root.$mp &&  this.$root.$mp.page) {
    //    this.$root.$mp.page.$root[0].latitude = this.defaultLatitude;
    //    this.$root.$mp.page.$root[0].longitude = this.defaultLongitude;
    //    this.$root.$mp.page.$root[0].scale = 19;
    // }
  },
  mounted() {
    console.log("this", this);
    if (!this.isMounted) {
      this.isMounted = true;
      this.initData();
    }

    // this.mapCtx.moveToLocation();
    // setTimeout(() => {
    //   this.getRegionAndQueryMarkers();
    // }, 1000);

    // if (this.$root.$mp && this.$root.$mp.page) {
    //   this.$root.$mp.page.setData({
    //     "$root[0].latitude": this.latitude || this.defaultLatitude,
    //     "$root[0].longitude": this.longitude || this.defaultLatitude,
    //     "$root[0].scale": 15
    //   });
    // }
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style lang="scss">
.hj-monitor {
  width: 100vw;
  box-sizing: border-box;
  &__state {
    width: 100%;
    height: 220px !important;
    position: relative;
    z-index: 2;
  }
  &__bar {
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 3;
    &--wux {
    }
    &__search {
      width: 100%;
    }
    &__icon {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 44px;
      background-color: #f4f7fb;
      &__ele {
        height: 24px;
        width: 24px;
        line-height: 33px;

        // height: 32px;
        // width: 32px;
        // line-height: 44px;
      }
    }
  }

  &__filter {
    width: 100%;
    top: 39px;
    position: fixed;
    margin-left: -12px;
    margin-right: -12px;
    z-index: 3;
    &--wux {
    }
  }
  &__penel-list-wrapper {
    width: 100%;
  }
}

.hj-monitor__no-padding.hj-monitor__no-padding {
  padding-left: 0;
  padding-right: 0;
}
</style>
<style lang="scss">
.hj-map {
  background-color: #f4fbf6;
  font-family: PingFang-SC-Medium;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  &__com {
    width: 100%;
    margin-top: 45px;
    height: calc(100vh - 48px);
    position: relative;
    top: 0px;
  }
}
.hj-map-panel-class-prop {
  width: 100%;
  position: absolute;
  bottom: 0px;
}
</style>
