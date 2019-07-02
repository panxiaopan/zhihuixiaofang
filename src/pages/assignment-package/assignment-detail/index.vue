<template>
  <div class="hj-assignment-detail">
    <wux-toptips id="wux-toptips1" />
    <div
      v-if="!isAuth&&isMounted"
      style="height:100%;width:100%;position:relative: z-index:11111;"
    >
      <button @click="jumpToLogin">
        暂无权限查看,点击重新授权登录
      </button>
    </div>
    <div
      v-if="isAuth"
      class="hj-assignment-detail__title"
    >
      <div class="hj-rhombus-icon"></div> &nbsp;基本信息
    </div>
    <hjAssignmentPanel
      v-if="isAuth"
      v-bind="baseInfo"
    ></hjAssignmentPanel>
    <wux-white-space size="large"></wux-white-space>
    <div
      v-if="isAuth"
      class="hj-assignment-detail__title"
    >
      <div class="hj-rhombus-icon"></div> &nbsp;关联信息
    </div>
    <wux-white-space size="large"></wux-white-space>
    <div
      v-if="isAuth"
      class="hj-assignment-detail__referinfo"
    >
      <wux-row
        class="hj-assignment-detail__referinfo__list"
        @click.stop="clickSource"
      >
        <wux-col span=3>
          工单来源：
          <!-- {{sourceInfo}} -->
        </wux-col>
        <wux-col
          span=9
          wux-class="hj-assignment-detail__referinfo__list__source_order"
        >
          {{sourceInfo}}
        </wux-col>
      </wux-row>
      <wux-white-space></wux-white-space>
      <wux-row class="hj-assignment-detail__referinfo__list">
        <wux-col span=3>
          关联工单：
        </wux-col>
        <wux-col span=9>
          <ol>
            <li
              v-for="(item, index) in linkedWorkOrders"
              :key="item.id"
              @click="clickLinkedOrder(item)"
            >{{index+1}}、{{item.name}}</li>
          </ol>
          <wux-white-space></wux-white-space>
        </wux-col>
      </wux-row>
    </div>
    <wux-white-space></wux-white-space>
    <div
      v-if="isAuth"
      class="hj-assignment-detail__title"
    >
      <div class="hj-rhombus-icon"></div> &nbsp;流程
    </div>

    <wux-white-space></wux-white-space>
    <!-- <hj-flow-state :current="current" :orderList="orderList"></hj-flow-state> -->
    <hjFlowState
      v-if="isAuth&&orderList&&orderList.length"
      :flowStateCode="flowStateCode"
      :orderList="orderList"
      :isSpread.sync="isSpread"
    ></hjFlowState>
    <!-- <div style="with:100%;"> -->
    <wux-floating-button
      v-if="isAuth&&isShowFloatingBtns"
      :position="position"
      :theme="theme"
      :buttons="buttons"
      @iclick="onClick"
      @change="onChange"
    />
    <!-- @change="onChange"  @contact="onContact" @getuserinfo="onGotUserInfo" -->
    <!-- </div> -->
    <!-- <button @click="changeButtons">click</button> -->
  </div>
</template>
<script>
import hjAssignmentPanel from "@/components/hj-assignment/hj-assignment-panel.vue";
import hjFlowState from "@/components/common/hj-flow-state.vue";
import merge from "lodash/merge.js";
import cloneDeep from "lodash/cloneDeep.js";
import hjIcon from "@/mixins/hjIcon.js";
// const icon =
//   "data:image/png;base64,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";

import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import wuxToptips from "@/mixins/wuxToptips.js";
import API from '@/store/flyio/apiUrl/home.js';
export default {
  onShareAppMessage,
  onShow() {
    console.warn(
      "assignment-detail onShow this.$root.$mp.appOptions",
      JSON.stringify(this.$root.$mp.appOptions)
    );
    console.warn(
      "assignment-detail onShow this.$root.$mp.query",
      JSON.stringify(this.$root.$mp.query)
    );

    if (this.$root.$mp.appOptions.query.from == "previewImage") {
      this.$root.$mp.appOptions.query.from = "";
      return;
    }
    if (this.isMounted) {
      var baseInfo = wx.getStorageSync("assignmentDetail");
      this.initData({ id: baseInfo.workOrderId });
      // this.initData({ id: this.baseInfo.workOrderId });
    }
  },
  onHide() {
    console.log("onHide", this.$options.name);
    console.log("this.$root.$mp.appOptions", this.$root.$mp.appOptions);

    console.log("this.$root.$mp", this.$root.$mp);
  },
  onUnload() {
    console.log("this.$root.$mp.appOptions", this.$root.$mp.appOptions);

    console.log("onUnload", this.$options.name);
    console.log("this.$root.$mp", this.$root.$mp);
    this.isMounted = false;
  },
  name: "assignment-detail",
  mixins: [wuxToptips, hjIcon],
  components: {
    hjAssignmentPanel,
    hjFlowState
  },
  data() {
    return {
      isSpread: false,
      isMounted: false,
      // buttons: [
      //   {
      //     // openType: 'getUserInfo',
      //     label: '关闭',
      //     value: 'close',
      //     icon
      //   },
      //   {
      //     // openType: 'share',
      //     label: '驳回',
      //     value: 'reject',
      //     icon
      //   },
      //   {
      //     // openType: 'contact',
      //     label: '新建工单',
      //     value: 'newOrder',

      //     icon
      //   },
      //   {
      //     label: '新建维保',
      //     value: 'newMaintenance',
      //     icon
      //   }
      // ],
      position: "bottomRight",
      theme: "royal",
      colors: [
        "light",
        "stable",
        "positive",
        "calm",
        "balanced",
        "energized",
        "assertive",
        "royal",
        "dark"
      ],
      types: ["topLeft", "topRight", "bottomLeft", "bottomRight"],
      canOperate: false,
      baseInfo: {},
      sourceInfo: "",
      linkedWorkOrders: [{ name: "name1" }, { name: "name2" }],
      orderList: [],
      flowStateCode: 1,
      params: {},
      pageQuery: {
        deviceName: "",
        socialUnitName: "",
        desc: ""
      },
      source: null
    };
  },
  computed: {
    isAuth() {
      // mp_task_task_view
      return (
        this.$store.state.userPermissionsMap &&
        this.$store.state.userPermissionsMap["mp_task_task_view"]
      );
    },
    isShowFloatingBtns() {
      return !!this.buttons.length;
    },
    buttons() {
      if (!this.canOperate) {
        return [];
      }
      var flowStateCode = this.flowStateCode;
      // flowStateCode = 1;
      var defaultArr = [
        {
          // openType: 'contact',
          label: "新建工单",
          value: "newOrder",
          permission: "mp_task_related_work_order_add",
          icon: this.hjIconDispatch
        },
        {
          label: "新建维保",
          value: "newMaintenance",
          permission: "mp_task_related_work_order_add",
          icon: this.hjIconMaintain
        },
        {
          label: "新建批注",
          value: "newComment",
          permission: "mp_task_related_work_order_add",
          icon: this.hjIconRemark
        }
      ];
      // return defaultArr;
      switch (flowStateCode) {
        case 1:
          return [
            {
              label: "接收",
              value: "claim",
              permission: "mp_task_task_operate",
              icon: this.hjIconReceive
            }
          ];
          break;
        case 2:
          return [
            {
              label: "完成",
              value: "applyForClose",
              permission: "mp_task_task_operate",
              icon: this.hjIconComplete
            },
            {
              // openType: 'contact',
              label: "新建工单",
              value: "newOrder",
              permission: "mp_task_related_work_order_add",
              icon: this.hjIconDispatch
            },
            {
              label: "新建维保",
              value: "newMaintenance",
              permission: "mp_task_related_work_order_add",
              icon: this.hjIconMaintain
            },
            {
              label: "新建批注",
              value: "newComment",
              permission: "mp_task_related_work_order_add",
              icon: this.hjIconRemark
            }
          ];
          break;
        case 3:
          return [
            {
              // openType: 'getUserInfo',
              label: "关闭",
              value: "approveClose,1",
              permission: "mp_task_task_operate",
              icon: this.hjIconReject
            },
            {
              // openType: 'share',
              label: "驳回",
              value: "approveClose,0",
              permission: "mp_task_task_operate",
              icon: this.hjIconClose
            }
          ];

          // return [{
          //     // openType: 'contact',
          //     label: '新建工单',
          //     value: 'newOrder',
          // permission: 'mp_task_related_work_order_add',

          //     icon
          //   },
          //   {
          //     label: '新建维保',
          //     value: 'newMaintenance',
          // permission: 'mp_task_related_work_order_add',

          //     icon
          //   },
          //   {
          //     label: '新建批注',
          //     value: 'newComment',
          // permission: 'mp_task_related_work_order_add',
          //     icon
          //   }]
          break;
        case 4:
          return [];

          //  return [
          //     {
          //       // openType: 'getUserInfo',
          //       label: '关闭',
          //       value: 'approveClose,1',
          //       permission:'mp_task_task_operate',

          //       icon
          //     },
          //     {
          //       // openType: 'share',
          //       label: '驳回',
          //       value: 'approveClose,0',
          //       permission:'mp_task_task_operate',

          //       icon
          //     }
          //   ];
          break;
        default:
          return defaultArr;
          break;
      }
    }
  },
  methods: {
    jumpToLogin() {
      wx.navigateTo({
        url: "/pages/user-info/main"
      });
    },
    clickSource(e) {
      console.log("clickSource", e);
      // id, eventTime, attachedWorkOrderId, dealer, time, desc
      // wx.navigateTo({
      //   url: '/pages/trouble-package/trouble-detail/main/'
      // })
      var attachedWorkOrderId = this.baseInfo.workOrderId;
      var source = this.source;
      var id = source && source.id;
      var eventTime = source && source.time;
      // 当有关联工单ID时， 就没有处理人相关信息
      var dealerName = "";
      var time = "";
      var desc = "";
      // var desc = source && source.name;

      // var desc = source&&source.type&&source.type.desc;

      // var dealerName =source&&source.id;
      // var time = source&&source.id;

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
    clickLinkedOrder(item) {
      wx.setStorageSync("assignmentDetail", { workOrderId: item.id });
      // wx.redirectTo({url: '/pages/assignment-detail/main})
      this.initData({ id: item.id });
    },
    changeButtons() {
      this.buttons = [
        {
          label: "接收",
          value: "receive",
          icon
        }
      ];
    },
    // getFloatBtnsByFlowStateCode(flowStateCode) {
    //   // 根据工单所处流程决定按钮的种类
    //   if(flowStateCode)
    // },
    submitFlowStep(url, params = {}, extraParams = {}, tiptext) {
      if (!url) {
        return;
      }
      this.$http(url, params)
        .then(res => {
          console.log(url + "success res", res);
          if (extraParams.pageUrl) {
            wx.navigateTo({ url: pageUrl });
          }
          if (extraParams.isInit) {
            this.initData({ id: this.baseInfo.workOrderId });
          }
        })
        .catch(res => {
          console.log(url + "fail res", res);
          this.wuxToptips({ text: tiptext }, res);
        });
    },
    onChange(e) {
      console.log("onChange assignment-detail", e);
    },
    onClick(e) {
      console.log("onClick", e);
      console.log(this.params);
      // var value = this.buttons[e.mp.detail.index].value;
      var btnItem = e.mp.detail.value;
      var value = btnItem.value;
      var permission = e.mp.detail.value.permission;
      console.log("value", value);

      console.log("home initData isAuth");
      if (!this.$store.dispatch("isAuth", permission || "")) {
        return false;
      }

      var url = "";
      var deviceName = this.pageQuery.deviceName || "";
      var socialUnitName = this.pageQuery.socialUnitName || "";
      var desc = this.pageQuery.desc || "";
      var tiptext = btnItem.label;
      var appendStr =
        "id=" +
        this.params.id +
        "&taskId=" +
        this.params.taskId +
        "&deviceName=" +
        deviceName +
        "&socialUnitName=" +
        socialUnitName +
        "&desc=" +
        desc;
      var params = { ...this.params };
      var extraParams = {};
      switch (value) {
        case "approveClose,1":
          url = "approveClose";
          params.approveState = 1;
          extraParams.isInit = true;
          // tiptext = "关闭"
          break;
        case "approveClose,0":
          url = "approveClose";
          params.approveState = 0;
          extraParams.isInit = true;
          // tiptext = "驳回"
          break;
        case "claim":
          url = "claim";
          extraParams.isInit = true;
          break;
        case "applyForClose":
          // url = 'applyForClose';
          // extraParams.isInit = true;
          // break;
          url =
            "/pages/assignment-package/assignment-finished/main?" + appendStr;
          wx.navigateTo({ url });
          return;
        case "newOrder":
          url =
            "/pages/assignment-package/assignment-new-order/main?" +
            appendStr +
            "&workOrderType=risk";
          wx.navigateTo({ url });
          return;
        case "newMaintenance":
          url =
            "/pages/assignment-package/assignment-new-maintenance/main?" +
            appendStr +
            "&workOrderType=maintenance";
          wx.navigateTo({ url });
          return;
        case "newComment":
          url =
            "/pages/assignment-package/assignment-new-comment/main?" +
            appendStr;
          wx.navigateTo({ url });
          return;
        default:
          break;
      }
      this.submitFlowStep(url, params, extraParams, tiptext);
    },
    onContact(e) {
      console.log("onContact", e);
    },
    onGotUserInfo(e) {
      console.log("onGotUserInfo", e);
    },
    processOrderListData(dataArr) {
      if (!dataArr || !dataArr.length) {
        return [];
      }
      // actioner, action, time , status , title
      // [{title, desc, time, finish, id, }]
      var result = [];
      dataArr.reverse().forEach((item, index) => {
        if (!index) {
          console.log(item);
        }
        var li = {
          title: item.name,
          id: item.id || (Math.random() * 1000).toFixed(2),
          startTime: item.startTime,
          endTime: item.endTime,
          status: item.finished ? "finish" : "wait",
          desc: item.actioners[0].name + ", " + item.bizStateShow.desc,
          attachments: [],
          icon: dataArr.length - 1 == index ? "ios-arrow-up" : "ios-checkmark",
          finished: item.finished,
          randomId: Math.random().toFixed(10)
        };

        if (
          (item && item.comments && item.comments.length == 0) ||
          !item.comments
        ) {
          result.push(li);
        }
        if (item && item.comments && item.comments.length == 1) {
          li.desc = li.desc + ", " + item.comments[0].remark;
          // li.attachments = item.comments[0].attachments;
          item.comments[0].attachments.map(atch => {
            if (atch.url) {
              li.attachments.push(
                API.requestDomain + atch.url
              );
            }
            // return 'http://tmp/' + atch.name;
          });
          result.push(li);
        }
        if (item && item.comments && item.comments.length > 1) {
          item.comments.forEach((com, comIndex) => {
            var cloneLi = cloneDeep(li);
            cloneLi.randomId = Math.random().toFixed(10);
            cloneLi.attachments = com.attachments;
            if (comIndex == 0) {
              cloneLi.desc = cloneLi.desc + ", " + com.remark;
            } else {
              cloneLi.startTime = com.time;
              cloneLi.endTime = com.time;
              // cloneLi.status = finish
              cloneLi.desc = com.actionerName + ", " + com.remark;
              // cloneLi.icon =
              // cloneLi.finished =
            }
            result.push(cloneLi);
          });
        }
      });
      console.log("processOrderListData result", result);
      return result;
    },
    transformDataToPanelViewData(data, contentlist) {
      contentlist = contentlist || [
        { label: "工单编号", value: "workOrderVO.number" },
        { label: "社会单位", value: "workOrderVO.socialUnit.name" },
        { label: "地址", value: "workOrderVO.socialUnit.address" },
        { label: "设备名称", value: "workOrderVO.device.name" },
        { label: "设备位置", value: "workOrderVO.device.address" }
      ];
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
          it.value = tempVal;
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
    initData(params = {}) {
      // params = merge(params,)
      if (!params.id) {
        console.error("id must be need");
      }
      this.$http("flowDetail", params, { method: "get" })
        .then(res => {
          console.log("flowDetail success res", res);
          var data = res.data;
          var source = data.source;
          var workOrderVO = data.workOrderVO;

          this.baseInfo = this.transformDataToPanelViewData(res.data);
          // var linkedWorkOrders = data.linkedWorkOrders;
          this.source = source;
          this.sourceInfo =
            source.name + ", " + source.type.desc + ", " + source.time;

          this.linkedWorkOrders = data.linkedWorkOrders;
          this.canOperate = data.canOperate;
          if (Array.isArray(data.taskInfo) && data.taskInfo.length) {
            this.params.taskId = data.taskInfo[data.taskInfo.length - 1].id;
          }

          var orderList = this.processOrderListData(data.taskInfo);
          console.log("orderList", orderList);
          this.orderList = [];

          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
          this.timer = setTimeout(() => {
            this.orderList = orderList;
          }, 300);

          // wx.nextTick(()=>{
          //   this.$nextTick(()=>{
          //     this.orderList = orderList;
          //   })
          // })

          this.flowStateCode = workOrderVO.flowStateCode;
          console.log("flowStateCode", this.flowStateCode);

          // set float button
          // this.getFloatBtnsByFlowStateCode(this.flowStateCode);

          // 保存其他操作需要的入参
          this.params.id = workOrderVO.id;
          this.pageQuery.deviceName = workOrderVO.device.name;
          this.pageQuery.socialUnitName = workOrderVO.socialUnit.name;
          this.pageQuery.desc = workOrderVO.description;

          // data.taskInfo.forEach((item, index) => {
          //   // if (index == data.taskInfo.length - 1) {
          //   if (index == 0) {
          //     this.params.taskId = item.id;
          //   }
          // });
        })
        .catch(res => {
          console.log("flowDetail fail res", res);
        });
    }
  },
  beforeCreate() {
    console.log("assignment-detail beforeCreate");
  },
  created() {
    console.log("assignment-detail created");
  },
  beforeMount() {
    console.log("assignment-detail beforeMount");
  },
  mounted() {
    console.warn("assignment-detail mounted", this);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (!this.isMounted) {
      this.timer = setTimeout(() => {
        this.isMounted = true;
      }, 1000);
    }
    console.warn(
      "assignment-detail this.$root.$mp.appOptions",
      this.$root.$mp.appOptions
    );
    console.warn(
      "assignment-detail this.$root.$mp.query",
      this.$root.$mp.query
    );

    // this.isMounted = true;
    // this.baseInfo = wx.getStorageSync('assignmentDetail');
    var assignmentDetail = wx.getStorageSync("assignmentDetail");
    if (!assignmentDetail) {
      assignmentDetail = {};
    }
    var appQuery = this.$root.$mp.appOptions.query;
    var query = this.$root.$mp.query;
    // var workOrderId = assignmentDetail.workOrderId
    if (appQuery.from == "officialAccount") {
      var workOrderId = appQuery.workOrderId;
      appQuery.from = "";
      appQuery.workOrderId = "";
    } else if (query.from == "officialAccount") {
      var workOrderId = query.workOrderId;
      query.from = "";
      query.workOrderId = "";
    }

    if (appQuery.from == "officialAccount" || query.from == "officialAccount") {
      if (!workOrderId || workOrderId == "undefined") {
        console.error("小程序跳转错误，没有传工单ID参数" + workOrderId);
        return;
      }
      // 来自小程序跳转
      assignmentDetail.workOrderId = workOrderId;
      wx.setStorageSync("assignmentDetail", assignmentDetail);
    }

    this.initData({ id: assignmentDetail.workOrderId });
    // console.log('this.baseInfo', this.baseInfo);
    // this.initData({ id: this.baseInfo.workOrderId });
    if (!this.assignmentDetailCount) {
      this.assignmentDetailCount = 1;
    } else {
      this.assignmentDetailCount++;
    }
    console.log("this.assignmentDetailCount", this.assignmentDetailCount);
  },
  beforeUpdate() {
    console.log("assignment-detail beforeUpdate");
  },
  updated() {
    console.log("assignment-detail updated");
  },
  beforeDestroy() {
    console.log("assignment-detail beforeDestroy");
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    console.log("assignment-detail destroyed");
  }
};
</script>
<style lang="scss">
.hj-rhombus-icon {
  display: inline-block;
  width: 11px;
  height: 11px;
  background-color: rgba(243, 134, 81, 1);
  transform: rotate(45deg);
}
.hj-assignment-detail {
  padding: 12px 12px 45px 12px;
  background-color: #f4f7fb;
  font-family: PingFang-SC-Medium;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  // width: 100wh;
  min-height: 100vh;
  box-sizing: border-box;
  &__title {
    text-indent: 10px;
    font-size: 16px;
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: rgba(49, 49, 49, 1);
  }
  &__referinfo {
    background-color: #fff;
    box-sizing: border-box;
    // margin-top: 10px;
    width: 100%;
    // background: rgba(255, 255, 255, 1);
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    border-radius: 12px;
    padding: 10px;
    &__list {
      padding-bottom: 10px;
      font-size: 14px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(49, 49, 49, 1);
      &__source_order {
        color: #6678e9;
      }
    }
  }
}
</style>
