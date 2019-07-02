<template>
  <div class="hj-login-with-count-input">
    <!-- <input class="hj-login-with-count-input__input" v-model.lazy="username" type="text" placeholder="登录名/绑定手机/绑定邮箱">
        <input class="hj-login-with-count-input__input" v-model.lazy="password" type="password" placeholder="请输入密码"> -->
    <input
      class="hj-login-with-count-input__input"
      v-model.lazy="scopedInfo.username"
      focus
      type="text"
      placeholder-style="font-family: PingFang-SC-Medium;"
      placeholder="登录名/绑定手机/绑定邮箱"
    >
    <input
      class="hj-login-with-count-input__input"
      v-model.lazy="scopedInfo.password"
      type="password"
      placeholder-style="font-family: PingFang-SC-Medium;"
      placeholder="请输入密码"
    >
    <!-- auto-focus focus -->

    <button
      class="hj-login-with-count-input__login"
      @click.stop="timeoutLogin"
    >登录</button>
    <div class="hj-login-with-count-input__forget">
      <div
        style="display:flex;align-items:center;"
        hover-class="hj-login-with-count-input--hover"
        @click="forgetPassword"
      >
        <span class="hj-login-with-count-input__forget__text">
          忘记密码
        </span>
        <wux-icon
          type="ios-help"
          size="22"
          color="#bbb"
        ></wux-icon>
        <!-- wux-class="hj-login-with-count-input__forget__icon" -->
      </div>
    </div>
    <!-- <button class="hj-login-with-count-input__login" @click.stop="timeoutLogin">登录</button> -->
    <!-- <wux-toptips id="wux-toptips1" /> -->
  </div>
</template>
<script>
import { $wuxToptips } from "@/utils/wux.js";
import md5 from "md5";
export default {
  data() {
    return {
      scopedInfo: {
        username: "",
        password: ""
      },
      username: "",
      password: ""
    };
  },
  methods: {
    onUsernameInput(e) {
      console.log("onUsernameInput", e);
    },
    onPasswordInput(e) {
      console.log("onPasswordInput", e);
    },
    onUsernameChange(e) {
      console.log("onUsernameChange", e);
    },
    onPasswordChange(e) {
      console.log("onPasswordChange", e);
    },
    loginAndBindToWeChat(params = {}) {
      console.log(
        "getStorageSync sessionId",
        wx.getStorageSync("login").sessionId
      );
      // this.$http('loginAndBindToWeChat', params)().then(res=>{
      var url = this.$root.$mp.query.switchCount
        ? "loginAndBindToWeChat"
        : "loginAndBindToWeChat";
      console.log('接口验证的url, ', url)
      this.$http(url, params, {
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
          // if (!this.$wuxToptips) {
          //   this.$wuxToptips = $wuxToptips(
          //     '#wux-toptips1',
          //     this.$root.$mp.page
          //   );
          // }
          this.$wuxToptips.error({
            text: e.head.msg,
            duration: 3000
          });

          //  wx.redirectTo({ url: '/pages/user-info/main?experiment=true' });
          console.log("loginAndBindToWeChat e", e);
        });
    },
    validate(scopedInfo) {
      // if (!this.$wuxToptips) {
      //   this.$wuxToptips = $wuxToptips('#wux-toptips1', this.$root.$mp.page);
      // }
      if (!scopedInfo.username) {
        this.$emit("errortip", "请输入登录名");
        // this.$wuxToptips &&
        //   this.$wuxToptips.error({
        //     text: '请输入登录名',
        //     duration: 3000
        //   });
        return false;
      }
      if (!scopedInfo.password) {
        this.$emit("errortip", "请输入密码");

        // this.$wuxToptips &&
        //   this.$wuxToptips.error({
        //     text: '请输入密码',
        //     duration: 3000
        //   });
        return false;
      }
      return true;
    },
    forgetPassword() {
      wx.navigateTo({ url: "/pages/forget-password/main" });
    },
    timeoutLogin(e) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.$nextTick(() => {
          wx.nextTick(() => {
            this.login(e);
          });
        });
      }, 100);
    },
    login(e) {
      // console.log(this.username, this.password);
      console.log("login with count", e, JSON.stringify(this.scopedInfo));
      if (!this.validate(this.scopedInfo)) {
        // if (!this.validate(this)) {
        return;
      }
      var loginObj = wx.getStorageSync("login");
      console.log("loginObj", loginObj);

      // var phoneNumberObj = e.mp.detail;
      var params = {};
      // this.scopedInfo
      // params.username = this.username;
      // params.password = md5(this.password);
      params.username = this.scopedInfo.username;
      params.password = md5(this.scopedInfo.password);
      console.log("params.password", params.password);
      console.log("loginObj", loginObj.code, loginObj);
      console.log("getStorageSync logcode", wx.getStorageSync("logcode"));
      params.code = wx.getStorageSync("logcode");

      // params.phoneEncryptedData = phoneNumberObj.encryptedData;
      // params.phoneIv = phoneNumberObj.iv;

      if (loginObj.unionIdExistsKey) {
        params.unionIdExistsKey = loginObj.unionIdExistsKey;
      } else {
        params.userInfoEncryptedData = loginObj.encryptedData;
        params.userInfoIv = loginObj.iv;
      }

      console.log("params", params);
      this.loginAndBindToWeChat(params);
    },
    initTooltip() {
      if (!this.$wuxToptips) {
        this.$wuxToptips = $wuxToptips("#wux-toptips1", this.$root.$mp.page);
      }
    }
  },
  mounted() {
    console.log("loginWithCount mounted", this.$root.$mp.query);
    this.initTooltip();
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
.hj-login-with-count-input {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: space-around;
  justify-content: space-around;
  &__input {
    width: 100%;
    // border-bottom: 1rpx solid rgba(102, 120, 233, 1);
    border-bottom: 1rpx solid #ddd;
    margin-top: 5px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    font-size: 14px;
    // font-family: PingFang-SC-Medium;
    // font-weight: 500;
    color: rgba(163, 163, 163, 1);
  }
  &__login {
    width: 100%;
    color: #fff;
    background-color: #6678e9;
  }
  &__forget {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 11px;
    &__text {
      font-family: PingFang-SC-Medium;
      color: #bbb;
    }
    // &__icon {
    //   // vertical-align: middle;
    // }
  }
  &--hover {
    background-color: #ddd;
  }
}
</style>
