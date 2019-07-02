<template>
  <div class="hj-primary">
    <bgBox :contentBoxClass="contentBoxClass">
      <div class="hj-primary__content__box">
        <button
          class="hj-primary__content__box__btn hj-primary__content__box__btn__user-info"
          open-type="getUserInfo"
          @getuserinfo="getUserInfo"
        >授予用户信息</button>
        <!-- <button class="hj-primary__content__box__btn hj-primary__content__box__btn__experiment" @click="experiment">体验</button> -->
        <!-- <wux-white-space size="large"></wux-white-space> -->
      </div>
    </bgBox>
    <!-- <official-account></official-account> -->
  </div>
</template>
<script>
import bgBox from "@/components/login/bg-box.vue";
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import isMounted from "@/mixins/isMounted.js";
import getFormattedValueAndUnit from "@/utils/getFormattedValueAndUnit.js";
export default {
  onShareAppMessage,
  onShow() {
    console.warn(
      "index onShow this.$root.$mp.appOptions",
      JSON.stringify(this.$root.$mp.appOptions)
    );
    console.warn(
      "index onShow this.$root.$mp.query",
      JSON.stringify(this.$root.$mp.query)
    );

    // console.log("index onShow  this.$root.$mp.query", this.$root.$mp.query);
    // 第二次从公众号跳转到该页面时，如何重定向
    // this.redirect();
  },
  name: "getUserInfo",
  mixins: [isMounted],
  components: {
    bgBox
  },
  data() {
    return {
      showOpenType: false,
      contentBoxClass: "hj-primary__content-box--class"
    };
  },
  computed: {
    // isAutoLogin() {
    //   return this.$store.state.isAutoLogin;
    // }
  },
  watch: {
    // isAutoLogin(newVal, oldVal) {
    //   console.log("index/main isAutoLogin watch", newVal, oldVal);
    //   if (!newVal) {
    //     this.setLoginCode(false);
    //   }
    // }
  },
  methods: {
    redirect() {
      if (wx.getStorageSync("sessionId")) {
        // sessionId存在时
        // var appQuery = this.$root.$mp.appOptions.query;
        var query = this.$root.$mp.query;
        // if(this.$root.$mp.appOptions.query.from=='officialAccount'||this.$root.$mp.query.from=='officialAccount'){
        if (query.from == "officialAccount") {
          // this.$root.$mp.query.from = '';
          // query.from = '';
          var pageName = query.redirect;
          // if(pageName)
          var url = "/pages/" + pageName + "/main?from=officialAccount";
          // url = url +  '?from=officialAccount&'
          // 1043 公众号模板
          // 1035 自定义菜单
          if (pageName == "trouble-detail") {
            var {
              id,
              eventTime,
              attachedWorkOrderId,
              dealer,
              time,
              desc
            } = query;
            //  dealer = dealer == 'undefined' || !dealer ? '' : dealer;
            //  time = time == 'undefined' || !time ? '' : time;
            //  desc = desc == 'undefined' || !desc ? '' : desc;
            // url =
            //   "/pages/" +
            //   "trouble-package/" +
            //   pageName +
            //   "/main?from=officialAccount";
            var urlWithQuery =
              url +
              "&id=" +
              id +
              "&eventTime=" +
              eventTime +
              "&attachedWorkOrderId=" +
              attachedWorkOrderId +
              "&dealer=" +
              dealer +
              "&time=" +
              time +
              "&desc=" +
              desc;
            query.from = "";
            wx.redirectTo({ url: urlWithQuery });
          } else if (pageName == "assignment-detail") {
            var url =
              "/pages/" +
              "assignment-package/" +
              pageName +
              "/main?from=officialAccount";
            var urlWithQuery = url + "&workOrderId=" + query.workOrderId;
            query.from = "";
            wx.redirectTo({ url: urlWithQuery });
          } else {
            wx.switchTab({ url: "/pages/index/main" });
          }
        }
      }
    },
    setUserInfo(detail) {
      wx.setStorageSync("userInfo", detail.userInfo);
      var login = wx.getStorageSync("login");
      login.encryptedData = detail.encryptedData;
      login.iv = detail.iv;
      login.signature = detail.signature;
      wx.setStorageSync("login", login);
      console.log("getUserInfo", login);
    },
    getUserInfo(e) {
      console.log("获取用户信息", e);
      if (e.mp.detail.userInfo) {
        this.setUserInfo(e.mp.detail);
        wx.redirectTo({ url: "/pages/login/main" });
      }

      // e.mp.detail = {
      // encryptedData:"4SeanyyI4uMEvsG3o=",
      // errMsg:"getUserInfo:ok",
      // iv:"ApBRDM4tkJz41l1MQS1p/w==",
      // rawData: "{"nickName":"小猪版纳","gender":1,"language":"zh_CN","city":"Shenzhen","province":"Guangdong","country":"China","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/STwKKmNsnBIcoGico1FRibnOojXtdyuW0icktD8mkFdRbA8OdfcKfo6aVhGqyOgKc7OMvicV5KIpI4o4lJicc28SNUg/132"}",
      // signature:"e1fe6155a9512706d27c6a3cbcd870037918055f",
      // userInfo: {
      // avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/STwKKmNsnBIcoGico1FRibnOojXtdyuW0icktD8mkFdRbA8OdfcKfo6aVhGqyOgKc7OMvicV5KIpI4o4lJicc28SNUg/132",
      // city:"Shenzhen",
      // country:"China",
      // gender:1,
      // language:"zh_CN",
      // nickName:"小猪版纳",
      // province:"Guangdong"
      // }
      // }
    },
    getAuthSettingInfo(isRedirect) {
      wx.getSetting({
        success: settingInfo => {
          // 获取用户授权信息, 如果授权了获取用户信息则直接调用API获取用户信息
          // 如果没有则调用微信授权信用API
          // 如果用户拒绝则什么都不做，默认跳转到index页面
          if (settingInfo.authSetting["scope.userInfo"]) {
            // settingInfo.authSetting['scope.phoneNumber']
            wx.getUserInfo({
              success: res => {
                console.log("wx.getUserInfo success res", res);
                this.setUserInfo(res);
                if (isRedirect) {
                  wx.redirectTo({ url: "/pages/login/main" });
                }
              },
              fail: res => {
                console.log("wx.getUserInfo fail res", res);
              }
            });
          } else {
            // wx.getUserInfo({success: (res)=>{
            //   console.log('wx.getUserInfo success res', res)
            // }, fail: res=>{console.log('wx.getUserInfo fail res', res)}})
          }
          console.log("wx.getSetting", settingInfo);
        }
      });
    },

    experiment() {
      console.log("experiment");
    },
    setLoginCode(isRedirect) {
      wx.setStorageSync("logcode", "");
      wx.login({
        success: res => {
          // this.$root.$mp.appOptions.experiment == 'true'
          wx.setStorageSync("logcode", res.code);
          this.getAuthSettingInfo(isRedirect);
          // wx.navigateTo({ url: '/pages/login-with-count/main' });
        }
      });
    }
  },
  beforeCreate() {},

  created() {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo();
  },
  mounted() {
    // wx.navigateTo({ url: "/pages/map/main" });
  }
};
</script>
<style lang="scss">
.hj-primary {
  min-width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #f4f7fb;
  box-sizing: border-box;
  // &__content-box-class{
  // }
  &--class {
    height: 30vh;
  }
  &__content__box {
    height: 30vh;
    // width: 100%;
    width: 90%;
    padding-left: 5%;
    padding-right: 5%;
    display: flex;
    flex-direction: column;
    align-items: space-around;
    // align-items: center;
    // justify-content: space-around;
    justify-content: center;
    &__btn {
      width: 100%;
      color: #fff;
      background: rgba(102, 119, 233, 1);
      border-radius: 4px;
      &__user-info {
      }
      &__experiment {
        // margin-bottom: 10px;
      }
    }
  }
}
</style>