<template>
  <div class="hj-login">
    <bgBox
      :scopedInfo="scopedInfo"
      contentBoxStyle=""
    >
      <div class="hj-login__content__box">
        <button
          hover-class="hj-login__btn--hover"
          style="border:1rpx solid #6677E9;color: #fff;background-color:rgba(102,119,233,1);width:90%;font-size: 14px;"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        ><img
            class="hj-login__logo_img"
            :src="scopedInfo.weChat"
            alt="alt"
          ><span> 手机号快捷登录</span></button>
        <wux-divider text="其他登录方式" />
        <button
          hover-class="hj-login__btn--hover"
          @click="loginWithCount"
          style="border:1rpx solid #6677E9;color: #6677E9;width:90%;font-size:14px;"
        ><span> 账号密码登录</span></button>
        <!-- <wux-wing-blank></wux-wing-blank> -->
      </div>
    </bgBox>
  </div>
</template>
<script>
import bgBox from "@/components/login/bg-box.vue";
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
export default {
  onShareAppMessage,
  onShow(e) {
    console.log("login onShow", e, this);
    wx.login({
      success: res => {
        console.log("reget log code", res.code);
        wx.setStorageSync("logcode", res.code);
      }
    });
  },
  name: "login",
  components: {
    bgBox
  },
  data() {
    return {
      scopedInfo: {
        weChat: "../../static/images/common/we-chat_white.png",
        logo: "../../static/images/common/logo_hjdq.png"
      },
      weChat: "../../static/images/common/we-chat_white.png",
      logo: "../../static/images/common/logo_hjdq.png"
    };
  },
  methods: {
    loginAndBindToWeChat(params = {}) {
      console.log(
        "getStorageSync sessionId",
        wx.getStorageSync("login").sessionId
      );
      this.$http("loginAndBindToWeChat", params, {
        headers: {
          sessionId: ""
        }
      })
        .then(res => {
          // debugger;
          wx.setStorageSync("sessionId", res.data.sessionId);
          this.$store.dispatch("setUserPermissions", {
            permissions: res.data.permissions || []
          });

          this.$store.dispatch("setIsLogin", true);

          wx.switchTab({ url: "/pages/index/main" });
          // 绑定后当
          // 系统后台无此号码的账户，code等于几的时候，为体验账户，设置全局 storage  isTry变量，
          console.log("loginAndBindToWeChat", res);
        })
        .catch(e => {
          console.log("loginAndBindToWeChat e", e);
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 3000
          })
          wx.redirectTo({ url: "/pages/user-info/main?experiment=true" });          
        });
    },
    getPhoneNumber(e) {
      console.log("getPhoneNumber", e);
      var loginObj = wx.getStorageSync("login");
      console.log("loginObj", loginObj);
      var phoneNumberObj = e.mp.detail;
      var params = {};
      console.log("getStorageSync logcode", wx.getStorageSync("logcode"));

      params.code = wx.getStorageSync("logcode");

      params.phoneEncryptedData = phoneNumberObj.encryptedData;
      params.phoneIv = phoneNumberObj.iv;

      if (loginObj.unionIdExistsKey) {
        params.unionIdExistsKey = loginObj.unionIdExistsKey;
      } else {
        params.userInfoEncryptedData = loginObj.encryptedData;
        params.userInfoIv = loginObj.iv;
      }

      console.log("params", params);
      this.loginAndBindToWeChat(params);

      // var {code,  encryptedData: userInfoEncryptedData, iv: userInfoIv} = wx.getStorageSync('login');
      // var {encryptedData: , iv: }  =  e.mp.detail

      // this.phoneNumberObj = {
      //   encryptedData:      e.mp.detail.encryptedData ,
      //   errMsg:      e.mp.detail.errMsg ,
      //   iv:      e.mp.detail.iv ,
      // }

      // encryptedData:"kCL3FoF1OBZHF6F7LSCaxO+Em5bRsGpo27xRBzpqiWOlW5E8+Z4sCL7MGttz4KUuAQvj+D42+uYLXB8lljfUUcmUmT6Ep7I4vfbujC9fI8Pek48PdvpEHEWPaFrdVWbRglWEEhEJoKYQK06NiwHUcqwaKFaUAsYbmRpy3sC5L3Hg2bGFkEyp8QAjaeCZkX7rbKnFsnmYav/7bjAio+q4Lg=="
      // errMsg:"getPhoneNumber:ok"
      // iv:"hRLXAWEop2GWriMaBf18uA=="
    },
    judgeIsLogin() {
      console.log("judgeIsLogin begin");
      var loginObj = wx.getStorageSync("login");
      if (loginObj.login) {
        var url = "/pages/index/main";
        wx.switchTab({ url });
      } else if (!loginObj.unionIdExistsKey) {
        console.log("unionIdExistsKey unionIdExistsKey");
        wx.authorize({
          scope: "scope.userLocation",
          success: res => {
            console.log("authorize", res);
          },
          fail: res => {
            console.log("get scope userInfo", res);
          }
        });
      }
      console.log("judgeIsLogin end");
    },
    loginWithCount(e) {
      console.log("loginWithCount", e);
      wx.navigateTo({ url: "/pages/login-with-count/main" });
    }
  },
  created() {
    console.log("created login");
  },
  mounted() {
    console.log("mounted login");
    // this.login = wx.getStorageSync('login');

    // if (!wx.getStorageSync('logcode')) {
    //   console.log('get logcode');
    //   // &&this.login.unionIdExistsKey
    //   wx.login({
    //     success: res => {
    //       console.log('reget log code', res.code);
    //       wx.setStorageSync('logcode', res.code);
    //     }
    //   });
    // }
  }
};
</script>
<style lang="scss">
.hj-login {
  background-color: #f4f7fb;
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;

  &__content__box {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    // align-items: space-around;
    // justify-content: space-around;
    justify-content: space-evenly;
    // justify-content: center;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  &__logo_img {
    height: 28px;
    width: 28px;
    vertical-align: middle;
  }
  &__label {
    vertical-align: middle;
  }
  &__btn--hover {
    color: #fff !important;
    background-color: #6677e9;
  }
}
</style>