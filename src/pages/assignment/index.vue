<template>
  <div
    class="hj-assignment"
    :style="pageStyle"
  >
    <wux-toptips id="wux-toptips1" />
    <!-- <div style="position:fixed;width:100%;height:100%;box-sizing: border-box;z-index:2;">
      <div class="hj-assignment__search">
        <wux-row>
          <wux-col class="hj-assignment__search__bar" span=12>
            <wux-search-bar :value="searchStr" :auto="auto" :placeholder="placeholder" @change="onChange" @focus="onFocus" @blur="onBlur" @confirm="onConfirm" @clear="onClear" @cancel="onCancel" />
          </wux-col>
        </wux-row>
      </div>
      <wux-filterbar class="hj-assignment__filter" :items="filterList" @change="onFilterChange" @open="onFilterOpen" @close="onFilterClose" />
      <hjSimpleDatePicker @changeDate="changeDate"></hjSimpleDatePicker>
    </div> -->
    <div
      v-if="!isAuth"
      style="height:100%;width:100%;position:relative: z-index:11111;"
    >暂无权限查看</div>
    <wux-search-bar
      v-if="isAuth"
      class="hj-assignment__search_bar"
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
    <wux-filterbar
      v-if="isAuth"
      class="hj-assignment__filter"
      :items="filterList"
      @change="onFilterChange"
      @open="onFilterOpen"
      @close="onFilterClose"
    />
    <!-- <hjSimpleDatePicker v-if="isAuth"  hj-class="hj-assignment__picker" @changeDate="changeDate"></hjSimpleDatePicker> -->

    <!-- <wux-tabs class="hj-assignment__tabs" :default-current="currentTabs" theme="royal" @change="changeTabs">
      <wux-tab v-for="item in tabs" :key="item.key" :title="item.title"></wux-tab>
    </wux-tabs> -->
    <!-- <button @click="action">click</button> -->
    <div
      v-if="isAuth"
      style="height:84px;"
    ></div>
    <wux-refresher
      v-if="isAuth"
      id="wux-refresher1"
      @pulling="onPulling"
      @refresh="onRefresh"
      style="width:100%;"
    >
      <div style="padding-left: 10px;padding-right:10px;">
        <hjAssignmentPanel
          hj-class="hj-assignment__info_panel"
          v-for="item in list"
          v-bind="item"
          :key="item.workOrderId"
          @click="clickPanel(item)"
        ></hjAssignmentPanel>
      </div>
    </wux-refresher>
    <div
      v-if="showBottomLoading&&isAuth"
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
    <!-- <official-account></official-account> -->
  </div>
</template>

<script>
// import { formatTime } from '@/utils/index'
// import card from '@/components/card'
import hjAssignmentPanel from "@/components/hj-assignment/hj-assignment-panel.vue";
import merge from "lodash/merge.js";
import isEqual from "lodash/isEqual.js";
import { $stopWuxRefresher } from "@/utils/wux.js";
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import hjSimpleDatePicker from "@/components/common/hj-simple-date-picker.vue";
import wuxToptips from "@/mixins/wuxToptips.js";
import isMounted from "@/mixins/isMounted.js";
import setScrollTop from "@/mixins/setScrollTop.js";
export default {
  onShareAppMessage,
  onReachBottom(e) {
    console.log("this.params", this.params);
    console.log("onReachBottom", e);
    this.showBottomLoading = true;
    if (this.params.size > this.total) {
      this.showBottomLoading = false;
    } else {
      this.params.size += 10;
      this.initData(this.currentTabs, this.params, this.setPushingData);
    }
  },
  onShow() {
    console.log(
      "this.filterList[3].visible before",
      this.filterList[3].visible,
      "this.isMounted",
      this.isMounted
    );
    if (this.isMounted) {
      // this.initData(this.currentTabs, this.params);
    }

    // if (this.filterList[3].visible) {
    //   console.log('this.filterList[3].visible enter');
    //   this.filterList = this.filterList.map(item => {
    //     if (item.type == 'filter') {
    //       item.visible = false;
    //     }
    //     return item;
    //   });
    // }

    console.log("this.filterList[3].visible after", this.filterList[3].visible);
  },
  onHide() {
    console.log("onHide", this.$options.name);
  },
  onUnload() {
    console.log("onUnload", this.$options.name);
    this.isMounted = false;
  },
  name: "assignment",
  mixins: [isMounted, wuxToptips, setScrollTop],
  components: {
    // card
    hjAssignmentPanel,
    hjSimpleDatePicker
  },

  data() {
    return {
      defaultSize: 10,
      showBottomLoading: false,
      isFilterOpened: false,
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
          type: "text",
          label: "待我处理",
          value: "toBeHandledByMe",
          checked: true,
          groups: ["001"]
        },
        {
          type: "text",
          label: "我已处理",
          value: "handledByMe",
          checked: false,
          groups: ["002"]
        },
        {
          type: "text",
          label: "我发起的",
          value: "startedByMe",
          checked: false,
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
            {
              type: "radio",
              label: "排序字段",
              value: "orderCol",
              children: [
                {
                  label: "开始时间",
                  checked: false,
                  value: "start_time"
                },
                {
                  label: "结束时间",
                  checked: false,
                  value: "end_time"
                },
                {
                  label: "更新时间",
                  checked: false,
                  value: "update_time"
                },
                {
                  label: "状态",
                  checked: false,
                  value: "state"
                }
              ]
            },
            {
              type: "radio",
              label: "排序方式",
              value: "orderType",
              children: [
                {
                  label: "降序",
                  checked: false,
                  value: "desc"
                },
                {
                  label: "升序",
                  checked: false,
                  value: "asc"
                }
              ]
            },

            {
              type: "checkbox",
              label: "工单类型",
              value: "type",
              children: [
                {
                  label: "消缺",
                  value: "risk"
                },
                {
                  label: "巡检",
                  value: "patrol"
                },
                {
                  label: "维保",
                  value: "maintenance"
                }
              ]
            },
            {
              type: "checkbox",
              label: "工单状态",
              value: "state",
              children: [
                {
                  label: "待接收",
                  value: "toBeReceived"
                },
                {
                  label: "处理中",
                  value: "processing"
                },
                {
                  label: "已完成",
                  value: "completed"
                },
                {
                  label: "已关闭",
                  value: "closed"
                }
              ]
            }
          ],
          groups: ["001", "002", "003"]
        }
      ],
      list: [],
      pageStyle: "",
      panelProps: {
        title: "titleParent",
        postTitle: "postTitleParent",
        subtitle: "subtitle",
        postsubtitle: "postsubtitle",
        orderNumber: "orderNumber",
        socialUnit: "socialUnit",
        deviceName: "deviceName",
        foot: "foot",
        postfoot: "postfoot"
      },
      currentTabs: "toBeHandledByMe",
      params: {
        size: 10,
        startTime: "",
        endTime: ""
        // startTime: this.$_dayjs()
        //   .subtract(100, 'day')
        //   .format('YYYY-MM-DD'),
        // endTime: this.$_dayjs()
        //   .add(1, 'day')
        //   .format('YYYY-MM-DD')
      },
      tabs: [
        { key: "toBeHandledByMe", title: "待我处理" },
        { key: "handledByMe", title: "我已处理" },
        { key: "startedByMe", title: "我发起" }
      ],
      // logs: []
      searchStr: "",
      defaultSearchStr: "",
      auto: false,
      placeholder: "Search",
      total: 0
    };
  },
  computed: {
    isAuth() {
      return (
        this.$store.state.userPermissionsMap &&
        this.$store.state.userPermissionsMap["mp_task_group"]
      );
    }
  },
  watch: {
    // total: {
    //   immediate: true,
    //   handler: function(newVal, oldVal) {
    //     if (newVal != oldVal) {
    //       if (!newVal) {
    //         wx.removeTabBarBadge({
    //           index: 2,
    //           success: res => {
    //             console.log('wx.removeTabBarBadge res', res);
    //           }
    //         });
    //       } else {
    //         wx.setTabBarBadge({
    //           index: 2,
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
    //   this.params.startTime = this.$_dayjs(date).format('YYYY-MM-DD 00:00:00');
    //   this.params.endTime = this.$_dayjs(date)
    //     .add(1, 'day')
    //     .format('YYYY-MM-DD 00:00:00');
    //   this.toTop();
    //   this.initData(this.currentTabs, this.params);
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
    onPulling(e) {
      console.log("e", e);
    },
    onRefresh(e) {
      console.log("e", e);
      console.log("onRefresh", e);
      if (this.scrollTop <= 84) {
        this.initData(this.currentTabs, this.params, this.setPullingData);
      } else {
        this.stopWuxRefresher();
      }
    },
    stopWuxRefresher() {
      $stopWuxRefresher("#wux-refresher1", this.$root.$mp.page);
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
    onFilterChange(e, index) {
      // 设置 params
      this.params.size = this.defaultSize;
      e.mp.detail.checkedItems.forEach(item => {
        if (item.type == "text") {
          this.currentTabs = item.value;
          // 设置
          this.filterList.forEach(orgIt => {
            if (orgIt.type == "text") {
              if (orgIt.groups[0] == item.groups[0]) {
                orgIt.checked = true;
              } else {
                orgIt.checked = false;
              }
            }
          });
        }
        if (item.type == "filter") {
          item.children.forEach(child => {
            if (child.type == "radio") {
              var filterRadioArr = child.children
                .filter(it => it.checked)
                .map(filtItem => filtItem.value);
              this.params[child.value] =
                (filterRadioArr[0] && filterRadioArr[0]) || "";
            }
            if (child.type == "checkbox") {
              var filterCheckboxArr = child.children
                .filter(it => it.checked)
                .map(filtItem => filtItem.value);
              this.params[child.value] =
                (filterCheckboxArr[0] && filterCheckboxArr.join(",")) || "";
            }
          });
          if (!isEqual(item, this.filterList[3])) {
            this.filterList[3] = item;
          }
        }
      });
      // console.log('onFilterChange', e, index);
      console.log(
        "onFilterChange",
        "e",
        e,
        "index",
        index,
        "this.params",
        this.params,
        "this.filterList",
        this.filterList,
        "visible",
        this.filterList[3].visible
      );
      // 设置 filterList
      this.filterList.forEach(element => {});
      this.initData(this.currentTabs, this.params);
    },
    onFilterOpen(e) {
      this.filterList[3].visible = true;
      console.log(
        "onFilterOpen",
        e,
        "this.filterList",
        this.filterList,
        "visible",
        this.filterList[3].visible
      );
      // this.pageStyle = 'height: 100%; overflow: hidden';
    },
    onFilterClose(e) {
      this.filterList[3].visible = false;
      console.log(
        "onFilterClose",
        e,
        "this.filterList",
        this.filterList,
        "visible",
        this.filterList[3].visible
      );
      // this.pageStyle = '';
    },
    clickPanel(item) {
      var url = "/pages/assignment-package/assignment-detail/main";
      var assignmentDetail = this.transformDataToPanelViewData(
        item.originData,
        [
          { label: "工单编号", value: "workOrderVO.number" },
          { label: "社会单位", value: "workOrderVO.socialUnit.name" },
          { label: "地址", value: "workOrderVO.socialUnit.address" },
          { label: "设备名称", value: "workOrderVO.device.name" },
          { label: "设备位置", value: "workOrderVO.device.address" }
        ]
      );
      console.log("assignmentDetail", assignmentDetail);
      wx.setStorageSync("assignmentDetail", assignmentDetail);
      wx.navigateTo({ url });
    },
    // action() {
    //   console.log(this.searchStr);
    // },
    onChange(e) {
      console.log("onChange", e);
      this.searchStr = e.mp.detail.value;
      this.defaultSearchStr = e.mp.detail.value;
    },
    onFocus(e) {
      console.log("onFocus", e);
    },
    onBlur(e) {
      console.log("onBlur", e);
    },
    onConfirm(e) {
      console.log("onConfirm", e);
      console.log("searchStr", this.searchStr, this.defaultSearchStr);
      this.searchStr = e.mp.detail.value;
      this.defaultSearchStr = e.mp.detail.value;
      this.params.keyword = this.searchStr;
      this.params.size = 10;
      this.initData(this.currentTabs, this.params);
    },
    onClear(e) {
      console.log("onClear", e);
      this.searchStr = e.mp.detail.value;
      this.defaultSearchStr = e.mp.detail.value;
    },
    onCancel(e) {
      console.log("onCancel", e);
      console.log("searchStr", this.searchStr, this.defaultSearchStr);
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.searchStr = "";
        this.defaultSearchStr = "";
        this.params.keyword = this.searchStr;
        this.params.size = 10;
        this.initData(this.currentTabs, this.params);
      }, 300);
    },
    changeTabs(e) {
      console.log("changeTabs", e);
      this.currentTabs = e.mp.detail.key;
      this.initData(this.currentTabs, { keyword: this.searchStr });

      // var assignmentData = wx.getStorageSync('assignment');
      // wx.setStorageSync(
      //   'assignment',
      //   merge(assignmentData, { currentTabs: this.currentTabs })
      // );
    },
    transformDataToPanelViewData(data, contentlist) {
      // var task = data.task;
      var workOrderVO = data.workOrderVO;
      var title = workOrderVO.title;
      var postTitle = workOrderVO.type.desc;
      var subtitle = workOrderVO.startUser.name;
      var postsubtitle = workOrderVO.startTime;

      // var orderNumber = workOrderVO.number;
      // var socialUnit = workOrderVO.socialUnit.name;
      // var deviceName = workOrderVO.device.name;
      if (contentlist) {
        contentlist = contentlist.map(it => {
          var tempVal = "";
          it.value.split(".").forEach(key => {
            tempVal = (tempVal && tempVal[key]) || data[key];
          });
          it.value = tempVal || "";
          return it;
        });
      } else {
        contentlist = [
          { label: "工单编号", value: workOrderVO.number },
          { label: "社会单位", value: workOrderVO.socialUnit.name },
          { label: "设备名称", value: workOrderVO.device.name }
        ];
      }

      var foot = workOrderVO.executors[0].name;
      var footList =
        (workOrderVO.executors.length > 1 &&
          workOrderVO.executors.filter((item, index) => {
            return index;
          })) ||
        [];
      var postfoot = workOrderVO.endTime
        ? workOrderVO.endTime
        : workOrderVO.updateTime;

      return {
        workOrderId: workOrderVO.id,
        title,
        postTitle,
        subtitle,
        postsubtitle,
        // orderNumber,
        // socialUnit,
        // deviceName,
        contentlist,
        foot,
        footList,
        postfoot,
        originData: data
      };
    },
    processData(list) {
      if (!list || !list.length) {
        return [];
      }
      return list.map(item => {
        return this.transformDataToPanelViewData(item);
      });
    },
    setData(data, notReload) {
      if (!data) {
        return;
      }
      this.total = data.total;
      var list = this.processData(data.rows);
      if (!notReload) {
        this.list = [];
      }
      this.$nextTick(() => {
        this.list = list;
        console.log("list", list);
      });
    },
    initData(url, params, cb) {
      console.log(
        "home initData isAuth mp_task_group",
        this.$store.dispatch("isAuth", "mp_task_group")
      );
      if (!this.$store.dispatch("isAuth", "mp_task_group")) {
        return false;
      }
      if (!params) {
        return;
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
      // params = merge(
      //   {
      //     startTime: this.$_dayjs()
      //       .subtract(100, 'day')
      //       .format('YYYY-MM-DD'),
      //     endTime: this.$_dayjs()
      //       .add(1, 'day')
      //       .format('YYYY-MM-DD')
      //   },
      //   params
      // );
      //     参数名	必选	类型	说明
      // type	否	string	工单类型，多类型之间使用“,”拼接
      // state	否	string	工单状态，多状态之间使用“,”拼接
      // keyword	否	string	关键字，描述，标题，社会单位名称，设备名称
      // start	否	int	起始记录数，默认为0
      // size	否	int	每页记录数，默认为10
      // orderCol	否	string	排序字段，start_time（发起时间）, end_time（结束时间）, update_time（更新时间），state（工单状态）
      // orderType	否	string	排序方式，asc-升序，desc-降序
      // startTime	是	date	发起时间范围-开始时间
      // endTime	是	date	发起时间范围-结束时间

      this.$http(url, params, {
        method: "get",
        headers: { "content-type": "application/x-www-form-urlencoded" }
      })
        .then(res => {
          console.log("workOrders success res", res);
          if (cb) {
            cb(res);
          } else {
            this.setData(res.data);
          }
        })
        .catch(res => {
          console.log("workOrders fail res", res);
          this.wuxToptips({ text: "请求任务列表失败：" }, res);
          if (cb) {
            cb(res);
          }
        });
    }
  },
  created() {
    // const logs = (wx.getStorageSync('logs') || [])
    // this.logs = logs.map(log => formatTime(new Date(log)))
  },
  mounted() {
    console.log("assignment mounted");
    // var assignmentData = wx.getStorageSync('assignment');
    // if (assignmentData.currentTabs) {
    //   this.currentTabs = assignmentData.currentTabs;
    // }
    this.initData(this.currentTabs, this.params);
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
.hj-assignment {
  // padding: 12px 12px 45px 12px;
  // padding: 12px 12px 15px 12px;
  background-color: #f4f7fb;
  font-family: PingFang-SC-Medium;
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: start;
  // width: 100wh;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
  &__search_bar {
    position: fixed;
    z-index: 2;
    width: 100%;
  }
  &__filter {
    width: 100%;
    // height: 100%;
    position: fixed;
    z-index: 3;
    top: 41px;
  }
  &__picker {
    position: fixed;
    z-index: 2;
    top: 90px;
  }
  &__info_panel {
    // margin-left: 10px;
    // margin-right: 10px;
    // padding-bottom: 30px;
  }

  // box-sizing: border-box;
  &__search {
    // position: fixed;
    // z-index: 2;
    width: 100%;
    &__bar {
      // width: 80%;
      // border-radius:  44px;
    }
    &__icon {
      text-align: right;
      //       background-image:url("data:image/png;
      // base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOEAYAAAB2v0DJAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAApRJREFUOMulVDFIclEY/e7NR69BSoniidbQFNTQUg1NkeESTUVNhQgZNDXYKA8rJERJEN+9KA1BQ0MEpg251BhFQ+HWlBRRJATPSN973z/I+4N+Htbv2e65557v3HPhEjbCRthIOAxBCELQ7ychEiIhTYMWgTu4gzs2G7rQha7d3eBMcCY4E4//I2RLbIktPTyEMYxhpLTVwSb2cA/3UBR5J+/knff3VjqKKUxhqliUSlJJKm1utjrYvEjtvfZee4/FjFvj1rjN5SwDOAvOgrMQCNA1ukbXenr4NJ/m0+n0bxtp6G02SZVUSc1mTf7J8+R58qyvNzVAREQkhClMYUosxkf5KB89OGisBcHqXNKX9CV97e2MMsro0RFf5It8MRpttUlQikpRKW5sMMYYYycn8fH4eHy8o8Pcb7xxVxdzMAdzXFwoOSWn5H5w09+Ci1zkYijEJtkkm1SUv/wwH+bDx8f8kB/yw+Xl//W3NVWcwzmc5/MQgQhEZNmksYxlLDudwo1wI9zk8yaf9qa9ae/QELVTO7UnEla2pEzKpPzy0jyAFaIQhSghdaxjHRFNevVs9Wz17O6usfJ6W26AztJZOmsY+pV+pV8RAm5wg9tan3nMPGYe+/u1klbSSgsLlr7zdJ7Oq+rPG+iDPugj5Dtdz9az9exXA1V/1V/1VyqiQ3SIjutrKzv9Ur/ULz8+mgbQZV3WZXMAIbACK7ACQLbIFtkiBHqhF3q/9PZT+6n9tFbTMlpGy1QqVr7ChDAhTFSrzRtAQMDXVxIhERJxudgze2bP+/swCIMw2N39PcDn2OfY55jHQwfoAB2Ym7OyNWRDNmRVJU0DfEPjo5maanxc29ttUpvUJvl8gUQgEUi8vf3W7w/ooDUn0eweYAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0xMi0yNlQxNjoyMzo1MiswODowMB2krtAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMTItMjZUMTY6MjM6NTIrMDg6MDBs+RZsAAAATnRFWHRzdmc6YmFzZS11cmkAZmlsZTovLy9ob21lL2FkbWluL2ljb24tZm9udC90bXAvaWNvbl9zaW41b3JyOHQwdmVpcGI5L2ZpbHRlci5zdmfzJTbdAAAAAElFTkSuQmCC")
      &__filter {
        // transform: translateY(50%);
      }
    }
  }

  &__tabs {
    margin-top: 10px;
    width: 100%;
    font-size: 16px;
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: rgba(49, 49, 49, 1);
  }
}

.wux-filterbar__item--checked.wux-filterbar__item--checked {
  color: #6678e9;
}
</style>

