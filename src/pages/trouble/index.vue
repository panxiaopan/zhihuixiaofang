<template>
  <!-- <div> -->
  <div class="hj-trouble">
    <div
      v-if="!isAuth"
      style="height:100%;width:100%;position:relative: z-index:11111;"
    >暂无权限查看</div>
    <wux-toptips id="wux-toptips1" />

    <!-- <hjFilter @confirm="confirm" @reset="confirm"></hjFilter> -->
    <wux-filterbar
      v-if="isAuth"
      class="hj-trouble__filter"
      :items="filterList"
      @change="onFilterChange"
      @open="onFilterOpen"
      @close="onFilterClose"
    />
    <!-- <div class="hj-trouble__select__container__wrapper" :class="selectContainerClass" :style="selectContainerStyle">
      <div class="hj_home__div hj-trouble__select__container">
        <span class="hj-trouble__select__val" @click="clickFilterBtn">
          隐患等级
        </span>
        <div class="hj-trouble__select__val" @click="clickFilterBtn" style="border-left: 1px solid #ccc;">
          隐患状态
        </div>
      </div>
    </div> -->

    <!-- <div class="hj-trouble__select__options__container" :class="optionsPanelClassStr" :style="optionsPanelStyleStr">
      <div class="hj-trouble__select__options" @click.stop="clickOptions">
        select options
      </div>
      <div class="hj-trouble__select__options" @click.stop="clickOptions">
        select options
      </div>
      <div class="hj-trouble__select__options" @click.stop="clickOptions">
        select options
      </div>
    </div> -->
    <div
      v-if="isAuth"
      style="height:55px;"
    ></div>
    <!-- <hjSimpleDatePicker  v-if="isAuth" hjClass="hj-trouble__picker" @changeDate="changeDate"></hjSimpleDatePicker>
    <div  v-if="isAuth" style="height:30px;"></div> -->

    <wux-refresher
      v-if="troubleInfoArray.length&&isAuth"
      id="wux-refresher1"
      @pulling="onPulling"
      @refresh="onRefresh"
    >
      <hjTroublePanel
        v-for="(item, index) in troubleInfoArray"
        :index="index"
        :key="item.id"
        v-bind="item"
        @click="click"
      >
      </hjTroublePanel>
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
      <!-- <img
        class="hj__to_top__btn"
        :src="toTopSrc"
        alt=""
        style="height:34px;width:34px;"
      > -->
    </div>
    <!-- <button @click="changeData">change</button> -->
    <!-- <official-account></official-account> -->
  </div>
  <!-- </div> -->
</template>

<script>
// Use Vuex
import { mapState, mapActions } from "vuex";
import store from "./store";
import hjTroublePanel from "@/components/hj-trouble/hj-trouble-panel.vue";
import hjFilter from "@/components/hj-trouble/hj-filter.vue";
import merge from "lodash/merge.js";
import cloneDeep from "lodash/cloneDeep.js";
// import debounce from 'lodash/debounce';
import isEqual from "lodash/isEqual.js";
// wx.makePhoneCall(OBJECT)
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import { $stopWuxRefresher } from "@/utils/wux.js";
import hjSimpleDatePicker from "@/components/common/hj-simple-date-picker.vue";
import wuxToptips from "@/mixins/wuxToptips.js";
import isMounted from "@/mixins/isMounted.js";
import setScrollTop from "@/mixins/setScrollTop.js";
export default {
  onShareAppMessage,
  onShow() {
    console.log("trouble page onShow", this.$options.name);
    if (this.isMounted) {
      var trouble = wx.getStorageSync("trouble");
      var from = (trouble && trouble.from) || "";
      if (!from) {
        this.initData(this.params);
      } else {
        trouble.from = "";
        wx.setStorageSync("trouble", trouble);
      }
    }
  },
  onReachBottom(e) {
    console.log("onReachBottom", e);
    this.showBottomLoading = true;
    if (this.params.size > this.total) {
      this.showBottomLoading = false;
    } else {
      this.params.size += 10;
      this.initData(this.params, this.setPushingData);
    }
  },
  name: "trouble",
  mixins: [wuxToptips, isMounted, setScrollTop],
  components: {
    hjTroublePanel,
    hjFilter,
    hjSimpleDatePicker
  },
  // onPageScroll(e) {
  //   console.log("onPageScroll", e, this);
  //   if (this.debounceFun) {
  //     this.debounceFun(e);
  //   }
  // },
  data() {
    return {
      // scrollTop: 0,
      // timer: null,
      defaultSize: 10,
      toTopSrc: "../../static/images/common/to-top-circle.png",
      filterList: [
        //  {
        //       type: 'radio',
        //       label: 'Updated',
        //       value: 'updated',
        //       children: [{
        //               label: 'Recently updated',
        //               value: 'desc',
        //           },
        //           {
        //               label: 'Least recently updated',
        //               value: 'asc',
        //           },
        //       ],
        //       groups: ['001'],
        //   },
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

        // {
        //     type: 'sort',
        //     label: 'Stars',
        //     value: 'stars',
        //     groups: ['003'],
        // },
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
      loadingImg: "../../static/images/common/loading.png",
      scrollTop: 0,
      total: 0,
      overflow: "",
      optionsPanelClassStr: "",
      optionsPanelStyleStr: "",
      selectContainerStyle: "",
      // selectContainerClass: 'hj-trouble__select__container__wrapper__shadow',
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

        // startTime: this.$_dayjs()
        //   .subtract(100, 'day')
        //   .format('YYYY-MM-DD'),
        // endTime: this.$_dayjs()
        //   .add(1, 'day')
        //   .format('YYYY-MM-DD')
      }
      // troubleInfoArray: [
      //   {
      //     title: 'title1',
      //     extra: 'extra1',
      //     thumb: '../../../static/images/common/alarm@2x.png',
      //     address: '深圳市南山区创盛路1号',
      //     dateTime: '2018-10-15 10:12:22'',
      //     deviceName: 'GM探测器2',
      //     socialUnit: '华杰电气技术有限公司'
      //   },
      //   {
      //     title: 'title2',
      //     extra: 'extra2',
      //     thumb: '../../../static/images/common/warning@2x.png',
      //     address: '深圳市南山区创盛路1号',
      //     dateTime: '2018-10-15 10:12:22'',
      //     deviceName: 'GM探测器2',
      //     socialUnit: '华杰电气技术有限公司'
      //   }
      // ]
    };
  },
  computed: {
    count() {
      return store.state.count;
    },
    troubleParams() {
      return this.$store.state.troubleStore.params;
    },
    requestBy() {
      return this.$store.state.troubleStore.requestBy;
    },
    isAuth() {
      return (
        this.$store.state.userPermissionsMap &&
        this.$store.state.userPermissionsMap["mp_risk_group"]
      );
    }
  },
  watch: {
    troubleParams(newVal, oldVal) {
      console.log("troubleParams", newVal, oldVal); // isEqual
      // if (!isEqual(newVal, oldVal)) {
      console.log("troubleParams change"); // isEqual

      var newParams = merge({}, this.params);
      this.params.size = 10;
      newParams = merge(newParams, newVal);
      console.log(
        !isEqual(newParams, this.params),
        "newParams",
        newParams,
        "this.params",
        this.params
      );
      if (!isEqual(newParams, this.params)) {
        this.params = newParams;
        // if(this.timer){
        //   clearTimeout(this.timer)
        // }
        // this.timer = setTimeout(()=>{
        //   this.setFilterListByParams();
        // },300)
        this.setFilterListByParams();
        this.initData(this.params);
      }
      // }
    },
    optionsPanelClassStr(newVal, oldVal) {
      if (newVal != oldVal) {
        if (!newVal) {
          // this.timer = null;
          // this.timer = setTimeout(()=>{
          // this.optionsPanelStyleStr = 'display: none'
          // }, 700)
        } else {
          // this.optionsPanelStyleStr = 'display: block;'
          // this.timer = setTimeout(()=>{
          // this.optionsPanelStyleStr = 'display: block;'
          // }, 1000)
        }
      }
    }
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
      console.log("this.params", this.params);
      console.log("this.scrollTop", this.scrollTop);
      if (this.scrollTop <= 55) {
        this.initData(this.params, this.setPullingData);
      } else {
        this.stopWuxRefresher();
      }
      // this.$stopWuxRefresher('#wux-refresher1', this.$root.$mp.page)
      // this.timer = setTimeout(() => {
      //   // this.setData({
      //   //     items: [{
      //   //         title: new Date,
      //   //         content: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
      //   //     }, ...this.data.items],
      //   // })

      //   this.changeData([this.troubleInfoArray[0]]);
      //   this.stopWuxRefresher();
      //   // $stopWuxRefresher();
      // }, 2000);
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
      $stopWuxRefresher("#wux-refresher1", this.$root.$mp.page);
    },
    confirm(params) {
      // if (this.params.grade == undefined) {
      //   this.params.grade = '';
      // }
      // if (this.params.state == undefined) {
      //   this.params.state = '';
      // }

      if (
        !isEqual(params, { grade: this.params.grade, state: this.params.state })
      ) {
        Object.assign(this.params, params);
        this.initData(this.params);
      }
    },
    click(item = {}) {
      console.log("item", item);

      console.log(
        "home initData isAuth mp_task_task_view",
        this.$store.dispatch("isAuth", "mp_task_task_view")
      );
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
    test(e) {
      console.log("test", e);
    },
    scroll(e) {
      console.log("scroll", e);
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
          console.log('changeData', dataArr)
          this.troubleInfoArray = dataArr.map(item => item);
        });
      }
    },
    increment() {
      store.commit("increment");
    },
    decrement() {
      store.commit("decrement");
    },
    clickFilterBtn() {
      // this.optionsPanelStyleStr = 'visibility: visible;'
      // this.optionsPanelStyleStr = 'height: auto;'
      this.overflow = "hidden";
      //
      this.optionsPanelClassStr =
        "hj-trouble__select__options__container--hover";
      console.log("clickFilterBtn", this.optionsPanelClassStr);

      // this.$nextTick(()=>{
      // this.optionsPanelClassStr = 'hj-trouble__select__options__container--hover';
      // })
    },
    clickOptions() {
      this.optionsPanelClassStr = "";
    },
    getComputedImgSrcByCode(code) {
      // 10 正常，20 预警 ， 30 报警
      switch (code) {
        case 20:
          return "../../static/images/common/warning@2x.png";
          break;
        case 30:
          return "../../static/images/common/alarm@2x.png";
          break;
        case 10:
          return "../../static/images/common/message@1x.png";
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
              ((description.recordValue && description.unit) || ""));
        } catch (e) {
          title = "";
          console.error("cannot parse item.description json", e);
        }

        var extra = item.riskState.desc;
        var deviceName = item.device.name;
        var position = item.device.address
        var socialUnit = item.socialUnit.name;
        var address = item.socialUnit.address;
        var dateTime = item.eventTime;
        var thumb = this.getComputedImgSrcByCode(item.riskGrade.value);
        var attachedWorkOrderId = item.attachedWorkOrderId;
        var phoneNumber = item.socialUnit.manResponsibleForFireSecurity.tel;
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
          position,
          deviceName,
          socialUnit,
          phoneNumber,
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
      console.log(
        "home initData isAuth",
        this.$store.dispatch("isAuth", "mp_risk_group")
      );
      if (!this.$store.dispatch("isAuth", "mp_risk_group")) {
        return false;
      }

      // if (!params.startTime || !params.endTime) {
      //   params = merge(
      //     {
      //       startTime: this.$_dayjs()
      //         .subtract(100, 'day')
      //         .format('YYYY-MM-DD'),
      //       endTime: this.$_dayjs()
      //         .add(1, 'day')
      //         .format('YYYY-MM-DD')
      //     },
      //     params
      //   );
      // }

      this.$store
        .dispatch("requestApi/risks", params)
        .then(res => {
          console.log(
            "request risk success res",
            res.data.rows
            // this.processData(res.data.rows)
          );

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
    },
    // actionFun(e) {
    //   // this.selectContainerStyle = "top: " + e + "px";
    //   console.log("actionFun scrollTop", e);
    //   this.scrollTop = e.scrollTop;
    // },
    // debounceFun(e) {
    //   console.log("debounceFun", e);
    //   if (this.timer) {
    //     clearTimeout(this.timer);
    //     this.timer = null;
    //   }
    //   this.timer = setTimeout(() => {
    //     this.actionFun(e);
    //   }, 300);
    // },
    mountedAction() {}
  },
  created() {},
  mounted() {
    console.log("trouble mounted");
    console.log(
      "this.$store.state.troubleStore.requestBy",
      this.$store.state.troubleStore.requestBy,
      this.requestBy
    );

    var trouble = wx.getStorageSync("trouble");
    var from = (trouble && trouble.from) || "";

    // wx.setStorageSync('trouble', { requestBy: 'store' });

    if (!from) {
      console.log("trouble mounted initData");
      this.initData(this.params);
    } else {
      trouble.from = "";
      wx.setStorageSync("trouble", trouble);
    }

    // if (!this.$root.$mp.query.changeParamsByStore) {
    //   this.initData(this.params);
    // }
  },
  destroyed() {
    this.timer = null;
  }
};
</script>
<style lang="scss">
@import "../../assets/css/variables.scss";

.hj-trouble {
  width: 100%;
  min-height: 100vh;
  padding: 0 24rpx 40rpx 24rpx;
  box-sizing: border-box;
  position: relatvie;
  background-color: #f4f7fb;
  &__filter {
    width: 100%;
    z-index: 3;
    // height: 100%;
  }
  &__picker {
    position: fixed;
    width: 100%;
    // top: 55px;
    z-index: 1;
  }
}

.hoverClass {
  color: red;
}
</style>
