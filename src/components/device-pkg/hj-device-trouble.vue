<template>
  <div class="hj-device-trouble">
    <div
      v-if="!isAuth"
      style="height:100%;width:100%;position:relative: z-index:11111;"
    >暂无权限查看</div>
    <wux-toptips id="wux-toptips1" />

    <wux-filterbar
      v-if="isAuth"
      class="hj-device-trouble__filter"
      :items="filterList"
      @change="onFilterChange"
      @open="onFilterOpen"
      @close="onFilterClose"
    />

    <div
      v-if="isAuth"
      style="height:55px;"
    ></div>

    <wux-refresher
      v-if="isAuth"
      id="wux-refresher-hj-device-trouble"
      @pulling="onPulling"
      @refresh="onRefresh"
    >
      <hjDeviceTroublePanel
        v-if="troubleInfoArray.length&&isAuth"
        v-for="(item, index) in troubleInfoArray"
        :index="index"
        :key="item.id"
        v-bind="item"
        @click="click"
      >
      </hjDeviceTroublePanel>

      <!-- <div  v-if="troubleInfoArray.length&&isAuth"
        v-for="(item, index) in troubleInfoArray"
        :key="item.id"
        @click="click" class="hj-device-trouble-panel">
      </div> -->

    </wux-refresher>
    <div
      v-if="showBottomLoading"
      class="hj__loading"
    >
      <img
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
</template>

<script>
// import hjTroublePanel from "@/components/hj-trouble/hj-trouble-panel.vue";
import hjDeviceTroublePanel from "@/components/device-pkg/hj-device-trouble-panel.vue";
// import hjFilter from "@/components/hj-trouble/hj-filter.vue";
import merge from "lodash/merge.js";
import cloneDeep from "lodash/cloneDeep.js";

import isEqual from "lodash/isEqual.js";

import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import { $stopWuxRefresher } from "@/utils/wux.js";
import hjSimpleDatePicker from "@/components/common/hj-simple-date-picker.vue";
import wuxToptips from "@/mixins/wuxToptips.js";
import isMounted from "@/mixins/isMounted.js";
export default {
  onShareAppMessage,
  onShow() {
    console.log("trouble page onShow", this.$options.name);
    // if (this.isMounted) {
    // var trouble = wx.getStorageSync("trouble");
    // var from = (trouble && trouble.from) || "";
    // if (!from) {
    //   this.initData(this.params);
    // } else {
    //   trouble.from = "";
    //   wx.setStorageSync("trouble", trouble);
    // }
    // }
  },
  // onPageScroll(e) {
  //   console.log('onPageScroll', e, this);
  //   // if (this.debounceFun) {
  //   //   this.debounceFun(e.scrollTop);
  //   // }
  // },
  onReachBottom(e) {
    console.log("onReachBottom hj-device-trouble", e);
    this.showBottomLoading = true;
    if (this.params.size > this.total) {
      this.showBottomLoading = false;
    } else {
      this.params.size += 10;
      this.initData(this.params, this.setPushingData);
    }
  },
  name: "hjTroubleComponent",
  mixins: [wuxToptips, isMounted],
  components: {
    hjDeviceTroublePanel,
    // hjFilter,
    hjSimpleDatePicker
  },
  props: {
    id: {
      type: [String, Number],
      default: ""
    },
    deviceId: {
      type: [String, Number],
      default: ""
    },
    isAuth: {
      type: Boolean,
      default: true
    },
    queryUrl: {
      type: String,
      default: "" // socialUnitsDevicesRisks
    }
  },
  data() {
    return {
      // isAuth: true,
      defaultSize: 10,
      filterList: [
        {
          type: "sort",
          label: "时间",
          value: "event_time",
          sort: -1,
          checked: true, // checked true 倒序， false正序
          groups: ["001"]
        },
        {
          type: "sort",
          label: "等级",
          value: "event_class",
          sort: 0,
          checked: false,
          groups: ["002"]
        },
        {
          type: "sort",
          label: "状态",
          value: "status",
          checked: false,
          sort: 0,
          groups: ["003"]
        },
        {
          type: "filter",
          label: "筛选",
          value: "filter",
          checked: true,
          visible: false,
          children: [
            // {
            //   type: 'radio',
            //   label: '排序字段',
            //   value: 'orderCol',
            //   children: [
            //     {
            //       label: '时间',
            //       value: 'event_time'
            //     },
            //     {
            //       label: '等级',
            //       value: 'event_class'
            //     },
            //     {
            //       label: '状态',
            //       value: 'state'
            //     }
            //   ]
            // },
            // {
            //   type: 'radio',
            //   label: '排序方式',
            //   value: 'orderType',
            //   children: [
            //     {
            //       label: '降序',
            //       value: 'desc'
            //     },
            //     {
            //       label: '升序',
            //       value: 'asc'
            //     }
            //   ]
            // },
            {
              type: "checkbox",
              label: "隐患等级",
              value: "grade",
              children: [
                // {
                //   label: '所有',
                //   value: 'info,earlyWarning,alarm'
                // },
                {
                  label: "信息",
                  value: "info",
                  checked: false
                },
                {
                  label: "预警",
                  value: "earlyWarning",
                  checked: false
                },
                {
                  label: "报警",
                  value: "alarm",
                  checked: false
                }
              ]
            },
            {
              type: "checkbox",
              label: "隐患状态",
              value: "state",
              children: [
                // {
                //   label: '所有',
                //   value: 'pending,processing,completed'
                // },
                {
                  label: "待处理",
                  value: "pending",
                  checked: false
                },
                {
                  label: "处理中",
                  value: "processing",
                  checked: false
                },
                {
                  label: "已完成",
                  value: "completed",
                  checked: false
                }
              ]
            }
          ],
          groups: ["001", "002", "003"]
        }
      ],
      showBottomLoading: false,
      loadingImg: "../../../static/images/common/loading.png",
      scrollTop: 0,
      total: 0,
      overflow: "",
      optionsPanelClassStr: "",
      optionsPanelStyleStr: "",
      selectContainerStyle: "",
      // selectContainerClass: 'hj-device-trouble__select__container__wrapper__shadow',
      selectContainerClass: "",
      troubleInfoArray: [],
      params: {
        grade: "", // info,earlyWarning,alarm
        state: "", // pending,processing,completed
        start: 0,
        size: 10,
        orderCol: "event_time", // event_time event_class status
        orderType: "desc", // desc asc
        startTime: "",
        endTime: ""
      }
    };
  },
  computed: {
    // troubleParams() {
    //   return this.$store.state.troubleStore.params;
    // },
    // requestBy() {
    //   return this.$store.state.troubleStore.requestBy;
    // },
    // isAuth() {
    //   console.log(
    //     "isAuth mp_index_group",
    //     this.$store.state.userPermissionsMap["mp_risk_group"]
    //   );
    //   return this.$store.state.userPermissionsMap["mp_risk_group"];
    // }
  },
  watch: {
    // troubleParams(newVal, oldVal) {
    //   console.log("troubleParams", newVal, oldVal); // isEqual
    //   // if (!isEqual(newVal, oldVal)) {
    //   console.log("troubleParams change"); // isEqual
    //   var newParams = merge({}, this.params);
    //   this.params.size = 10;
    //   newParams = merge(newParams, newVal);
    //   console.log(
    //     !isEqual(newParams, this.params),
    //     "newParams",
    //     newParams,
    //     "this.params",
    //     this.params
    //   );
    //   if (!isEqual(newParams, this.params)) {
    //     this.params = newParams;
    //     // if(this.timer){
    //     //   clearTimeout(this.timer)
    //     // }
    //     // this.timer = setTimeout(()=>{
    //     //   this.setFilterListByParams();
    //     // },300)
    //     this.setFilterListByParams();
    //     this.initData(this.params);
    //   }
    //   // }
    // },
    // optionsPanelClassStr(newVal, oldVal) {
    //   if (newVal != oldVal) {
    //     if (!newVal) {
    //       // this.timer = null;
    //       // this.timer = setTimeout(()=>{
    //       // this.optionsPanelStyleStr = 'display: none'
    //       // }, 700)
    //     } else {
    //       // this.optionsPanelStyleStr = 'display: block;'
    //       // setTimeout(()=>{
    //       // this.optionsPanelStyleStr = 'display: block;'
    //       // }, 1000)
    //     }
    //   }
    // }
    // total: {
    //   immediate: true,
    //   handler: function(newVal, oldVal) {
    //     if (newVal != oldVal) {
    //       if (!newVal) {
    //         wx.removeTabBarBadge({
    //           index: 1,
    //           success: res => {
    //             console.log('wx.removeTabBarBadge res', res);
    //           }
    //         });
    //       } else {
    //         wx.setTabBarBadge({
    //           index: 1,
    //           text: newVal + '',
    //           success: res => {
    //             console.log('wx.setTabBarBadge res', res);
    //           }
    //         });
    //       }
    //     }
    //   }
    // }
  },
  methods: {
    // changeDate(date) {
    //   this.params.stateTime = this.$_dayjs(date).format('YYYY-MM-DD 00:00:00');
    //   this.params.endTime = this.$_dayjs(date)
    //     .add(1, 'day')
    //     .format('YYYY-MM-DD 00:00:00');
    //   this.toTop();
    //   this.initData(this.params);
    // },
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
    setFilterListByParams() {
      var cloneFilterList = cloneDeep(this.filterList);
      var filterList = cloneFilterList.map(item => {
        if (item.type == "sort") {
          if (item.value == this.params.orderCol) {
            item.checked = true;
            if (this.params.orderType == "desc") {
              item.sort = -1;
            } else {
              item.sort = 0;
            }
          } else {
            item.checked = false;
          }
        }
        if (item.type == "filter") {
          var newItem = merge({}, item);
          var optionsMap = new Map();
          if (this.params.grade) {
            // var gradeMap = new Map();
            this.params.grade.split(",").forEach(gradeOption => {
              // gradeObj[gradeOption] = gradeOption;
              optionsMap.set(gradeOption, gradeOption);
            });
          }
          if (this.params.state) {
            // var stateMap = new Map();
            this.params.state.split(",").forEach(stateOption => {
              optionsMap.set(stateOption, stateOption);
              // stateObj[stateOption] = stateOption;
            });
          }
          newItem.children.forEach(child => {
            child.children.forEach(op => {
              if (optionsMap.has(op.value)) {
                op.checked = true;
              } else {
                op.checked = false;
              }
            });
          });
          item = newItem;
        }
        return item;
      });
      this.filterList = filterList;
    },
    onFilterChange(e) {
      console.log("onFilterChange", e);
      this.params.size = this.defaultSize;
      // 根据设置的checked items 设置 params 入参
      var checkedItems = e.mp.detail.checkedItems;
      checkedItems.forEach(item => {
        console.log("item", JSON.stringify(item));
        if (item.checked && item.type == "sort") {
          // if()
          this.params.orderType = item.sort === 1 ? "asc" : "desc";
          this.params.orderCol = item.value;
        }
        if (item.type == "filter") {
          item.children.forEach(child => {
            this.params[child.value] = child.children
              .map(it => {
                if (it.checked) {
                  return it.value;
                } else {
                  return "";
                }
              })
              .filter(f => f)
              .join(",");
          });
        }
      });
      // 设置 this.filterList
      console.log("this.filterList", this.filterList);
      var cloneFilterList = cloneDeep(this.filterList);
      console.log("cloneList", this.filterList);

      var filterList = cloneFilterList.map(li => {
        if (li.type == "sort") {
          if (li.value == checkedItems[0].value) {
            if (li.sort !== -1) {
              li.sort = -1;
            } else {
              li.sort = 1;
            }
            // li.sort = (!!checkedItems[0].sort && checkedItems[0].sort) || -1;
            if (!li.checked) {
              li.checked = true;
            }
            // li.checked = true;
          } else {
            if (li.sort !== 0) {
              li.sort = 0;
            }
            if (li.checked) {
              li.checked = false;
            }
          }
          return li;
        }
        if (li.type == "filter") {
          console.log("checkedItems[1]", checkedItems[1]);
          return checkedItems[1];
          // li.children.forEach(child=>{
          // })
        }
      });

      this.filterList = filterList;
      console.log("this.params", JSON.stringify(this.params));
      this.initData(this.params);
    },
    onFilterOpen(e) {
      this.filterList[3].visible = true;
      console.log("onFilterOpen", e);
    },
    onFilterClose(e) {
      this.filterList[3].visible = false;
      console.log("onFilterClose", e);
    },
    onPulling(e) {
      console.log("onPulling", e);
    },
    onRefresh(e) {
      console.log("onRefresh", e, this);
      // this.params.size = this.params.size + 10;
      // this.params.start = this.params.size - 1;
      this.initData(this.params, this.setPullingData);
    },
    setPullingData(res) {
      this.setData(res.data);
      this.stopWuxRefresher();
    },
    setPushingData(res) {
      // 记住scrolltop的位置
      // var data = {total: res.data.total, rows: res.data.rows}
      this.setData(res.data, true);
      // 设置scroltop的位置
      this.showBottomLoading = false;
    },
    stopWuxRefresher() {
      $stopWuxRefresher(
        "#wux-refresher-hj-device-trouble",
        this.$root.$mp.page
      );
    },
    // confirm(params) {
    //   if (
    //     !isEqual(params, { grade: this.params.grade, state: this.params.state })
    //   ) {
    //     Object.assign(this.params, params);
    //     this.initData(this.params);
    //   }
    // },
    click(item = {}) {
      console.log("item", item);
      if (!this.$store.dispatch("isAuth", "mp_task_task_view")) {
        return false;
      }

      var { id, dateTime: eventTime, extraData } = item;
      var { attachedWorkOrderId, solution } = extraData || {};
      var { dealer, time, desc } = solution || {};
      attachedWorkOrderId = attachedWorkOrderId || "";
      var dealerName = (dealer && dealer.name) || "";
      time = time || "";
      desc = desc || "";
      var url =
        "/pages/trouble-package/trouble-detail/main?id=" +
        id +
        "&eventTime=" +
        eventTime +
        "&attachedWorkOrderId=" +
        attachedWorkOrderId +
        "&dealer=" +
        dealerName +
        "&time=" +
        time +
        "&desc=" +
        desc;
      wx.navigateTo({ url });
    },
    changeData(dataArr, notReload) {
      if (!dataArr || !Array.isArray(dataArr)) {
        return;
      }
      if (!notReload) {
        this.troubleInfoArray = [];
      }
      if (dataArr.length) {
        // this.troubleInfoArray = dataArr.map(item => item);
        this.$nextTick(() => {
          this.troubleInfoArray = dataArr.map(item => item);
        });
      }
    },
    getComputedImgSrcByCode(code) {
      // 10 正常，20 预警 ， 30 报警
      switch (code) {
        case 20:
          return "../../../static/images/common/warning@2x.png";
          break;
        case 30:
          return "../../../static/images/common/alarm@2x.png";
          break;
        case 10:
          return "../../../static/images/common/message@1x.png";
          break;
        default:
          break;
      }
    },
    processData(dataArr) {
      if (!dataArr || !Array.isArray(dataArr)) {
        return false;
      }
      if (!dataArr.length) {
        return [];
      }
      return dataArr.map(item => {
        let id = item.id;
        var title = "";
        try {
          var description = JSON.parse(item.description);
          description &&
            (title =
              description.desc +
              " " +
              ((description.recordValue &&
                description.recordValue.toFixed(2)) ||
                "") +
              " " +
              (description.unit || ""));
        } catch (e) {
          title = "";
          console.error("cannot parse item.description json", e);
        }

        var extra = item.riskState.desc;
        var deviceName = (item.device && item.device.name) || this.deviceName;
        var socialUnit =
          (item.socialUnit && item.socialUnit.name) || this.socialUnitName;
        var address = (item.socialUnit && item.socialUnit.address) || "";
        var dateTime = item.eventTime;
        var thumb = this.getComputedImgSrcByCode(item.riskGrade.value);
        var attachedWorkOrderId = item.attachedWorkOrderId;
        var phoneNumber =
          (item.socialUnit &&
            item.socialUnit.manResponsibleForFireSecurity &&
            item.socialUnit.manResponsibleForFireSecurity.tel) ||
          "";
        var riskGrade = item.riskGrade.desc;
        var riskState = item.riskState.desc;
        // var attachedOverLimitReturnId = item.attachedOverLimitReturnId;
        // var attachedOverLimitReturnTime = item.attachedOverLimitReturnTime;
        var solution = item.solution; // "solution" : {"dealer" : "","time" : "","desc" : ""},
        return {
          id,
          title,
          extra,
          thumb,
          address,
          dateTime,
          deviceName,
          socialUnit,
          phoneNumber,
          riskGrade,
          riskState,
          extraData: {
            attachedWorkOrderId,
            solution
          }
        };
      });
    },
    setData(data, notReload) {
      if (!data) {
        return;
      }
      this.total = data.total;
      this.changeData(this.processData(data.rows), notReload);
    },
    initData(params = {}, cb) {
      if (!this.isAuth) {
        return;
      }
      var id = params.id || this.id;
      var deviceId = params.deviceId || this.deviceId;
      var newParams = { ...this.params, ...params, id, deviceId };
      this.$http(this.queryUrl, newParams, { method: "get" })
        .then(res => {
          if (cb) {
            cb(res);
          } else {
            this.setData(res.data);
          }
        })
        .catch(res => {
          console.error("request risk fail res", res);
          this.wuxToptips({ text: "请求隐患列表失败：" }, res);
          if (cb) {
            cb(res);
          }
        });
    }
    // actionFun(e) {
    //   this.selectContainerStyle = "top: " + e + "px";
    //   console.log("actionFun", e);
    // },
    // debounceFun(e) {
    //   if (this.timer) {
    //     clearTimeout(this.timer);
    //     this.timer = null;
    //   }
    //   this.timer = setTimeout(() => {
    //     this.actionFun(e);
    //   }, 0);
    //   // if(this.isDebounced)
    //   // return
    // },
  },
  created() {},
  mounted() {
    console.log("hj trouble mounted");
  }
};
</script>
<style lang="scss">
@import "../../assets/css/variables.scss";

.hj-device-trouble {
  width: 100%;
  // min-height: 100vh;
  // padding: 0 24rpx 40rpx 24rpx;
  padding-left: 12px;
  padding-right: 12px;
  margin-top: -12px; // 不同页面可能需要适配
  box-sizing: border-box;
  position: relatvie;
  background-color: #f4f7fb;
  &__filter {
    // width: 100%;
    // z-index: 3;
    position: fixed;
    z-index: 2;
    width: 100%;
    //  box-sizing: border-box;
    margin-left: -12px;
    background-color: #fff;
  }
  &__picker {
    position: fixed;
    width: 100%;

    z-index: 1;
  }
}

.hoverClass {
  color: red;
}

// .hj-device-trouble-panel{

// }
</style>
