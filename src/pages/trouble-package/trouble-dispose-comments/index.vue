<template>
  <div class="hj-trouble-dispose-comments">
    <wux-toptips id="wux-toptips1" />
    <div class="hj-trouble-dispose-comments__item">
      <div class="hj-trouble-dispose-comments__item__label">社会单位</div>
      <input
        class="hj-trouble-dispose-comments__item__input"
        v-model="socialUnitName"
        type="text"
        disabled
      >
      <div class="hj-trouble-dispose-comments__item__label">设备名称</div>
      <input
        class="hj-trouble-dispose-comments__item__input"
        v-model="deviceName"
        type="text"
        disabled
      >
      <div class="hj-trouble-dispose-comments__item__label">{{descriptionLabel}}</div>
      <textarea
        class="hj-trouble-dispose-comments__item__textarea"
        v-model="description"
        name=""
        id=""
        cols="10"
        rows="10"
      ></textarea>
      <wux-row style="width:100%; margin-top: 15px;">
        <!-- <wux-col
          span="4"
          push="1"
        >
          <button
            class="hj-trouble-dispose-comments__item__cancel_btn"
            @click="reset"
          >重置</button>
        </wux-col> -->
        <wux-col
          span="12"
          push="0"
        >
          <button
            class="hj-trouble-dispose-comments__item__confirm_btn"
            @click="confirm"
          >确定</button>
        </wux-col>
      </wux-row>
    </div>

  </div>
</template>
<script>
// import { $wuxToptips } from '@/utils/wux.js';
import isEmpty from "lodash/isEmpty.js";
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import isMounted from "@/mixins/isMounted.js";
import wuxToptips from "@/mixins/wuxToptips.js";
export default {
  onShareAppMessage,
  onShow() {
    if (this.isMounted) {
      if (wx.getStorageSync("appIsHide")) {
        wx.setStorageSync("appIsHide", false);
        return;
      }
      this.reset();
    }
  },
  name: "hj-trouble-dispose-comments",
  mixins: [isMounted, wuxToptips],
  data() {
    return {
      descriptionLabel: "处理意见",
      socialUnitName: "",
      deviceName: "",
      description: "",
      params: {}
    };
  },
  methods: {
    reset() {
      this.description = "";
    },
    validate(params) {
      if (!params.description) {
        this.wuxToptips({ text: "请输入意见", duration: 3000 });
        return false;
      }
      return true;
    },
    timeouAction() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.confirm();
      }, 300);
    },
    confirm() {
      // title
      // description
      // maintainers
      // attachments
      var params = { ...this.params, description: this.description };
      if (!this.validate(params)) {
        return;
      }
      // var { title, description, maintainers } = params;
      // this.submit({ ...this.params, title, description, maintainers });

      this.submit({ ...this.params, handlingOpinion: this.description });
    },
    submit(params) {
      // 参数名	必选	类型	说明
      // id	是	int	关联隐患记录的ID
      // time	是	date	关联隐患记录的时间
      // handlingOpinion	是	string	处理意见
      this.$http("handlingOpinions", params)
        .then(res => {
          console.log("handlingOpinions success res", res, this);
          console.log("this.wuxToptips", this.wuxToptips);
          // wx.navigateBack();
          this.wuxToptips(
            {
              text: "意见处理",
              success: () => {
                // wx.switch({ url: '/pages/me/main' });
                if (res.data) {
                  var data = res.data;
                  var dealer = data.dealer;
                  this.$root.$mp.appOptions.query.params = {
                    dealer: dealer.name,
                    id: dealer.id,
                    time: data.dealTime,
                    desc: data.handlingOpinion
                  };
                }
                console.log("this, ", this);
                console.log(
                  "this.$root.$mp.appOptions.query",
                  this.$root.$mp.appOptions.query
                );
                wx.navigateBack({ delta: -1 });
              }
            },
            res,
            // 'wux-toptips2',
            undefined,
            "success"
          );
        })
        .catch(res => {
          console.log("handlingOpinions fail res", res);
          this.wuxToptips(
            {
              text: "意见处理",
              success: () => {
                // wx.redirectTo({ url: '/pages/me/main' });
                // wx.navigateBack({ delta: -1 });
              }
            },
            res,
            undefined
          );
        });
    }
  },
  mounted() {
    console.log(
      "trouble-dispatch-list this.$root.$mp.query",
      this.$root.$mp.query
    );
    var query = this.$root.$mp.query;
    if (isEmpty(query) && process.env.NODE_ENV == "development") {
      query = {
        deviceName: "1#PMC350F",
        from: "trouble",
        sourceId: "2513",
        socialUnitName: "威氟化工制造工厂",
        sourceTime: "2018-10-23 23:47:00"
      };
    }
    this.socialUnitName = query.socialUnitName;
    this.deviceName = query.deviceName;
    this.params.id = query.sourceId;
    this.params.time = query.sourceTime;
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.hj-trouble-dispose-comments {
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
  &__item {
    padding-left: 6px;
    padding-right: 6px;
    // padding: 12px 12px 45px 12px;
    // padding: 12px 12px 15px 12px;
    background-color: #f4f7fb;
    font-family: PingFang-SC-Medium;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    // width: 100wh;
    min-height: 100vh;
    box-sizing: border-box;
    &__label {
      // margin-top: 10px;
      margin-bottom: 5px;
      font-size: 18px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      // color: rgba(99, 99, 99, 1);
      color: rgb(8, 8, 8);
      &--mark {
        color: red;
      }
    }
    &__input {
      width: 100%;
      // border-bottom: 1px solid rgba(102, 120, 233, 1);
      border-bottom: 1rpx solid #ddd;
      margin-bottom: 20px;
      &__ft {
        font-size: 14px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(99, 99, 99, 1);
        vertical-align: top;
      }
    }
    &__textarea {
      width: 100%;
      // border: 1px solid rgba(102, 120, 233, 1);
      border: 1rpx solid #ddd;
      margin-bottom: 20px;
    }
    &__cancel_btn {
      background-color: #fff;
      color: rgba(102, 120, 233, 1);
    }
    &__confirm_btn {
      background-color: rgba(102, 120, 233, 1);
      color: #fff;
    }
  }
}
</style>
