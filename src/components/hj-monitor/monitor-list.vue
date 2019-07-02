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
        />
      </wux-col>
      <wux-col span="2">
        <div
          class="hj-monitor__bar__icon"
          @click="showMap"
        >
          &nbsp;
          &nbsp;
          <img
            v-if="unactiveMapIcon"
            class="hj-monitor__bar__icon__ele"
            :src="unactiveMapIcon"
            alt="unactiveMapIcon"
            mode="aspectFit"
          >
          &nbsp;
        </div>
      </wux-col>
    </wux-row>
    <div
      v-if="!isShowMap"
      style="width:100%;padding-left:12px;padding-right:12px;box-sizing:border-box;"
    >
      <div style="height: 90px"></div>
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
          v-if="isAuth"
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
    <div :style="hjStyle">
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

export default {
  onShareAppMessage,
  onShow() {
    console.log(" onShow ");
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
    hjMonitorSocialUnitPanel
  },
  mixins: [wuxToptips, setScrollTop],
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
      list: []
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
      var rows = (data.rows && Array.isArray(data.rows) && data.rows) || [];
      if (!notReload) {
        this.troubleInfoArray = [];
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
      if (this.scrollTop <= 90) {
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
    }
  },
  created() {},
  mounted() {
    if (!this.isMounted) {
      this.isMounted = true;
      this.initData();
    }
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
        height: 32px;
        width: 32px;
        line-height: 44px;
      }
    }
  }

  &__filter {
    width: 100%;
    top: 44px;
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
.hj-monitor__map-com.hj-monitor__map-com {
  margin-top: 45px;
  height: calc(100vh - 48px);
}
</style>
