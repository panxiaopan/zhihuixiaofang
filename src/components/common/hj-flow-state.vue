<template>
  <div class="hj-trouble-detail__order-process hj-trouble-detail--shadow-box hj-trouble-detail--radius">
    <wux-steps v-if="orderList.length&&orderStateList.length">
      <!-- :current="flowStateCode" -->
      <!-- v-if="orderList.length&&orderStateList.length" -->
      <wux-step
        v-for="orderState in orderStateList"
        :key="orderState.randomId"
        :status="orderState.status"
        icon="ios-checkmark"
        @click="clickOrder"
      >
        <div
          class="hj-trouble-detail__order-process__task__tilte"
          :class="orderState.classStr"
          slot="title"
        >
          <!-- :class="{'hj-trouble-detail__order-process--active': orderState.status !=='wait', 'hj-trouble-detail__order-process--unactive': orderState.status =='wait'}" -->
          {{orderState.title}}
        </div>
      </wux-step>
      <!-- <wux-step status="finish" title="已接受" icon="ios-checkmark"></wux-step>
        <wux-step status="finish" title="已处理" icon="ios-checkmark"></wux-step>
        <wux-step status="process" title="已关闭" icon="ios-checkmark"></wux-step> -->
      <!-- <wux-step status="wait" title="已关闭" icon="ios-close"></wux-step> -->
    </wux-steps>
    <wux-white-space></wux-white-space>
    <div class="hj-trouble-detail__order-process__newest-info">
      最新：{{newTaskInfo}}&nbsp;&nbsp;&nbsp; <span class="hj-trouble-detail__order-process__newest-info__time">{{newTaskInfoTime}}</span>
    </div>
    <wux-white-space></wux-white-space>
    <div
      class="hj-trouble-detail__order-process__display"
      @click="spread"
    ><span style="display:inline-block;transform:translateX(-25%);">{{orderSpreadDesc}}</span></div>
    <wux-white-space size="large"></wux-white-space>
    <wux-animation-group
      classNames="wux-animate--fadeInDown"
      :in="isSpreadOrderList"
    >
      <!-- hj--slideInDown -->
      <wux-row>
        <wux-col push=5>
          <wux-steps direction="vertical">
            <wux-step
              v-for="order in orderList"
              :key="order.randomId"
              :status="order.status"
              :icon="order.icon"
            >
              <!-- :icon="getIcon(orderIndex)" -->
              <div
                class="hj-trouble-detail__order-process__task__tilte"
                slot="title"
                :class="{'hj-trouble-detail__order-process--active': order.status !== 'wait', 'hj-trouble-detail__order-process--unactive': order.status == 'wait'}"
              >{{order.title}}</div>
              <div slot="content">
                <!-- <div style="position:relative;"> -->
                <div style="width:45%;word-break:break-all;">
                  <!-- -->
                  {{order.desc}}
                  <br>
                  <!-- </div> -->
                  <!-- <div style="word-break：break-all;word-wrap:break-word;overflow-wrap:break-word;padding-right: 136px;overflow:hidden;"> -->
                  <!-- <div style="word-break：break-all;word-wrap:break-word;overflow-wrap:break-word;width:40%;overflow:hidden;"> -->
                  <!-- <div > -->
                  <span
                    style="vertical-align:middle"
                    v-if="order.attachments&&order.attachments.length"
                    v-for="(atcUrl, atcIdx) in  order.attachments"
                    :key="atcUrl"
                  >
                    <!-- <img :src="order.attachments[0]" alt="attachments" style="width:21px;height:21px;"> -->
                    <!-- <wux-icon type="md-attach" size="22">
                    </wux-icon>
                    <wux-icon type="md-attach" size="22">
                    </wux-icon>
                    <wux-icon type="md-attach" size="22">
                    </wux-icon>
                    <wux-icon v-for="(idf,idx) in 10" :key="idx" type="md-attach" size="22">
                    </wux-icon> -->
                    <!-- <img :src="atcUrl" alt="attachments" style="width:42px;height:75px;" @click.stop="viewAttachments(order, atcIdx)"> -->
                    <img
                      :src="atcUrl"
                      alt="attachments"
                      mode="aspectFill"
                      style="width:42px;height:42px;"
                      @click.stop="viewAttachments(order, atcIdx)"
                    >
                    &nbsp;
                  </span>
                </div>
                <div style="position:absolute; left: -120px;z-index:22;top: 0%;">{{order.startTime}}</div>
                <!-- </div> -->

                <!-- <div style="position:absolute; left: -120px;z-index:22;transform:translateY(-100%);">{{order.startTime}}</div> -->
              </div>
            </wux-step>

            <!-- <wux-step status="finish" icon="ios-checkmark">
              <div slot="title">已处理</div>
              <div slot="content" style="position:absolute; left: -70px;z-index:22;transform:translateY(-20px);">2018-10-10</div>
            </wux-step>
            <wux-step status="finish" icon="ios-arrow-up">
              <div slot="title">已发起</div>
              <div slot="content" style="position:absolute; left: -70px;z-index:22;transform:translateY(-20px);">2018-10-10</div>
            </wux-step> -->
            <!-- <wux-step status="finish" title="待处理" content="2018-10-10" icon="ios-checkmark"></wux-step>
            <wux-step status="finish" title="待处理" content="2018-10-10" icon="ios-checkmark"></wux-step>
            <wux-step status="finish" title="已发起" content="2018-09-08" icon="ios-arrow-up"></wux-step> -->
          </wux-steps>
        </wux-col>
      </wux-row>
    </wux-animation-group>
  </div>
</template>
<script>
export default {
  name: "hj-flow-state",
  props: {
    isSpread: {
      type: Boolean,
      default: false
    },
    flowStateCode: {
      type: Number,
      default: 1
    },
    orderList: {
      type: Array,
      default: _ => [
        {
          title: "张三65四",
          id: 1233,
          startTime: "2018-10-10 10:10:10",
          endTime: "2018-10-10 11:11:11",
          status: "finish",
          desc: "张三3四",
          icon: "ios-checkmark",
          randomId: Math.random().toFixed(10),
          attachments: []
        },
        {
          title: "张三四",
          id: 123,
          startTime: "2018-10-10 10:10:10",
          endTime: "2018-10-10 11:11:11",
          status: "process",
          desc: "张三四",
          icon: "ios-checkmark",
          randomId: Math.random().toFixed(10),
          attachments: []
        },
        {
          title: "张三四fsf",
          id: 132323,
          startTime: "2018-10-10 10:10:10",
          endTime: "2018-11-11 11:11:11",
          status: "wait",
          desc: "张三四fsf",
          icon: "ios-arrow-up",
          randomId: Math.random().toFixed(10),
          attachments: []
        }
      ]
    }
  },
  data() {
    return {
      canOperate: false,
      isSpreadOrderList: false,

      //       hjAnimation:{
      //     enter: 'hj--slideInDown-enter', // 进入过渡的开始状态，在过渡过程完成之后移除
      //     enterActive: 'slideInDown-enter-active', // 进入过渡的结束状态，在过渡过程完成之后移除
      //     enterDone: 'slideInDown-enter-done', // 进入过渡的完成状态
      //     exit: 'slideInDown-exit', // 离开过渡的开始状态，在过渡过程完成之后移除
      //     exitActive: 'slideInDown-exit-active', // 离开过渡的结束状态，在过渡过程完成之后移除
      //     exitDone: 'slideInDown-exit-done', // 离开过渡的完成状态
      // },
      orderStateListTemp: [
        {
          status: "finish", // finish process wait
          title: "已发起",
          id: 1,
          randomId: Math.random().toFixed(10),
          classStr: "hj-trouble-detail__order-process--active"
        },
        {
          status: "finish",
          title: "已接收",
          id: 2,
          randomId: Math.random().toFixed(10),
          classStr: "hj-trouble-detail__order-process--active"
        },
        {
          status: "wait",
          title: "已处理",
          id: 3,
          randomId: Math.random().toFixed(10),
          classStr: "hj-trouble-detail__order-process--unactive"
        },
        {
          status: "wait",
          title: "已关闭",
          id: 4,
          randomId: Math.random().toFixed(10),
          classStr: "hj-trouble-detail__order-process--unactive"
        }
      ],
      orderStateList: []
    };
  },
  computed: {
    orderSpreadDesc() {
      if (!this.isSpreadOrderList) {
        return "[ 展 开 ]";
      } else {
        return "[ 收 起 ]";
      }
    },
    newTaskInfo() {
      if (!this.orderList || !this.orderList.length) {
        // if(this.canOperate){
        return "";
      }
      // if()
      return this.orderList[0].desc;
    },
    newTaskInfoTime() {
      if (!this.orderList || !this.orderList.length) {
        // if (this.canOperate) {
        return "";
      }
      return this.orderList[0].startTime;
    }
    // orderStateList() {
    //   var code = this.flowStateCode;
    //   var arr = this.orderStateListTemp.map(item => {
    //     var result = {};
    //     Object.assign(result, item);
    //     if (result.id <= code) {
    //       result.status = 'finish';
    //     } else {
    //       result.status = 'wait';
    //     }
    //     return result;
    //   });
    //   console.log('orderStateList', arr);
    //   return arr;
    // },
    // orderListLastIndex() {
    //   if (!this.orderList.length) {
    //     return 0;
    //   }
    //   return this.orderList.length - 1;
    // }
  },
  watch: {
    flowStateCode: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          var code = this.flowStateCode;
          var arr = this.orderStateListTemp.map(item => {
            var result = {};
            result.id = Math.random().toFixed(10);
            result.randomId = Math.random().toFixed(10);
            Object.assign(result, item);
            if (result.id < code) {
              result.classStr = "hj-trouble-detail__order-process--active";
              result.status = "finish";
            } else if (result.id == code) {
              result.classStr = "hj-trouble-detail__order-process--active";
              result.status = "process";
            } else {
              result.classStr = "hj-trouble-detail__order-process--unactive";
              result.status = "wait";
            }
            return result;
          });
          console.log("orderStateList", arr);
          this.orderStateList = [];
          this.$nextTick(() => {
            wx.nextTick(() => {
              this.orderStateList = arr;
            });
          });

          // this.$nextTick(() => {
          //   this.orderStateList = arr;
          // });
          // return arr;
        }
      }
    },
    isSpread: {
      immediate: true,
      handler: function(newVal, oldVal) {
        console.log(newVal, oldVal);
        if (newVal !== oldVal) {
          this.isSpreadOrderList = newVal;
        }
      }
    }
  },
  methods: {
    viewAttachments(order, current) {
      console.log("viewAttachments order", order, current);
      var attachments = order.attachments;
      console.log("attachments", attachments);
      if (attachments && attachments.length) {
        // var urls = attachments.map(item => {
        //   // return 'https://www.huajiecloud.com/efm-mp' + item.url;
        //   // return 'https://tmp/' + item.name;
        //   return item;
        // });
        wx.previewImage({
          urls: attachments,
          current: attachments[current],
          complete: res => {
            console.log("view image complete");
            console.log(
              "this.$root.$mp.appOptions",
              this.$root.$mp,
              this.$root.$mp.appOptions
            );
            // this.$root.$mp.appOptions // referrerInfo, query
            this.$root.$mp.appOptions.query.from = "previewImage";
          }
        });
      }
    },
    clickOrder(e) {
      console.log("clickOrder", e);
    },
    spread() {
      console.log("hj-flow-state spread", this.orderList);
      this.isSpreadOrderList = !this.isSpreadOrderList;
      this.$emit("update:isSpread", this.isSpreadOrderList);
      // this.wuxAnimationType = {
      //   classNames: 'wux-animate--slideInDown',
      //   enter: true,
      //   exit: true,
      //   in: true
      // };
    },
    getIcon(index) {
      return this.orderListLastIndex == index
        ? "ios-arrow-up"
        : "ios-check-mark";
    }
  },
  mounted() {
    console.log("hj-flow-state mounted", this.orderList);
  }
};
</script>
<style lang="scss">
.hj-trouble-detail {
  &--radius {
    border-radius: 12px;
  }
  &--shadow-box {
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    padding: 10px;
    width: 100%;
  }
  &__order-process {
    width: 100%;
    font-size: 25rpx;
    font-family: PingFang-SC-Medium;
    // font-weight: 500;
    // color: rgba(166, 166, 166, 1);
    // color: rgba(166, 166, 166, 1);
    &__task__tilte {
      font-size: 25rpx;
    }
    &--active {
      color: rgba(102, 120, 233, 1);
    }
    &--unactive {
      color: rgba(166, 166, 166, 1);
    }
    &__newest-info {
      text-align: center;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(49, 49, 49, 1);
      &__time {
        vertical-align: middle;
        font-size: 11px;
        font-family: DIN-Regular;
        font-weight: 400;
        color: rgba(49, 49, 49, 1);
      }
    }
    &__display {
      font-family: Adobe Heiti Std R;
      font-weight: normal;
      color: #6678e9;
      text-align: center;
      text-justify: center;
    }
  }
}
</style>
