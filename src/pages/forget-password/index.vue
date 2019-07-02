<template>
  <div class="hj-forget-password">
    <!-- <div class="hj-forget-password__label">原密码</div>
    <input class="hj-forget-password__input" v-model.lazy="oldPassword" type="password" placeholder="请输入原密码"> -->
    <form
      @submit="onFormSubmit"
      @reset="onReset"
    >
      <div class="hj-forget-password__label">新密码</div>
      <input
        class="hj-forget-password__input"
        :class="newPasswordClass"
        type="password"
        placeholder="请输入新密码"
        name="newPassword"
        v-model="newPassword"
      >
      <div class="hj-forget-password__label">确认新密码</div>
      <input
        class="hj-forget-password__input"
        :class="confirmPasswordClass"
        type="password"
        placeholder="请再输入新密码"
        name="confirmPassword"
        v-model="confirmPassword"
      >
      <div class="hj-forget-password__label">手机号</div>
      <input
        class="hj-forget-password__input"
        :class="telClass"
        type="text"
        placeholder="请输入手机号"
        name="tel"
        v-model="tel"
      >
      <div class="hj-forget-password__label">验证码</div>
      <div class="hj-forget-password__vcode">
        <div class="hj-forget-password__vcode__bd">
          <input
            class="hj-forget-password__input"
            :class="vcodeClass"
            style="margin-bottom:0px;"
            placeholder="请输入验证码"
            name="vcode"
            v-model="vcode"
          />
        </div>
        <div class="hj-forget-password__vcode__ft">
          <button
            size="mini"
            @click="getCode"
            style="padding:0 8px;vertical-align:middle;"
            :disabled="disabledSendTelCode"
          >{{getVcodeText}} </button>
        </div>
      </div>

      <div class="hj-forget-password__btn">
        <!-- <button
          class="hj-forget-password__btn__reset"
          formType="reset"
          @click="reset"
          style="background: #fff;color:rgba(102, 120, 233, 1);"
        >重置</button> -->
        <button
          class="hj-forget-password__btn__modify"
          formType="submit"
          @click="modify"
          style="background: rgba(102, 120, 233, 1);color: #fff;width:100%;"
        >提交</button>
      </div>
    </form>

    <wux-toptips id="wux-toptips1"></wux-toptips>
  </div>
</template>

<script>
// import { formatTime } from '@/utils/index';
// import card from '@/components/card';

import { $wuxToptips } from "@/utils/wux.js";
import md5 from "md5";

import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
export default {
  onShareAppMessage,
  onShow() {
    // if (wx.getStorageSync("appIsHide")) {
    //   wx.setStorageSync("appIsHide", false);
    //   return;
    // }
    // this.oldPassword = "";
    // this.newPassword = "";
    // this.confirmPassword = "";
  },
  components: {
    // card
  },

  data() {
    return {
      count: 0,
      disable: false,
      // vcodeSrc: '../../static/images/common/me@2x.png',
      vcodeSrc: "",
      // oldPassword: '',
      // newPassword: "",
      // confirmPassword: "",
      // tel: "",
      // vcode: "",

      newPassword: "",
      confirmPassword: "",
      tel: "",
      vcode: "",

      errorClassStr: "hj-forget-password--red-border-bottom"
    };
  },
  computed: {
    getVcodeText() {
      if (this.count == 0) {
        return "获取验证码";
      } else {
        return this.count;
      }
    },
    disabledSendTelCode() {
      return this.count;
      // if (this.count == 0) {
      //   return !/^1[3|4|5|6|7|8][0-9]{9}$/.test(this.tel);
      // } else {
      //   return true;
      // }
    }
  },
  methods: {
    onFormSubmit(e) {
      console.log("onFormSubmit", e);
    },
    onReset(e) {
      console.log("onReset", e);
    },
    changeCode(e) {
      console.log("changeCode", e);
      this.vcodeSrc = "../../static/images/common/me_active@2x.png";
    },
    getCode(e) {
      console.log("getCode", e);
      this.queryCode();
    },
    queryCode() {
      if (!/^1[3|4|5|6|7|8][0-9]{9}$/.test(this.tel)) {
        this.showToast("电话号不正确");
        return;
      }
      this.$http("telCode", {
        tel: this.tel,
        type: "modification"
      })
        .then(res => {
          this.showToast("发送验证码成功");
          this.discount();
        })
        .catch(res => {
          this.showToast("发送验证码失败");
        });
    },
    resetSend() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.count = 0;
      this.vcode = "";
      // this.disabled = true;
      // this.currentValue = "";
    },
    discount() {
      if (this.timer) {
        clearInterval(this.timer);

        this.timer = null;
      }
      this.count = 60;
      this.timer = setInterval(() => {
        if (this.count == 0) {
          clearInterval(this.timer);
          this.timer = null;
          return;
        }

        this.count--;
      }, 1000);
    },
    resetClass() {
      this.newPasswordClass = "";
      this.confirmPasswordClass = "";
      this.telClass = "";
      this.vcodeClass = "";
    },
    validated() {
      // 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)：^[a-zA-Z]\w{5,17}$
      this.resetClass();

      if (!/^[a-zA-Z]\w{5,17}$/.test(this.newPassword)) {
        this.$wuxToptips.error({
          text:
            "新密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)且不能为空",
          duration: 3000
        });
        this.newPasswordClass = this.errorClassStr;
        return false;
      }

      if (!/^[a-zA-Z]\w{5,17}$/.test(this.confirmPassword)) {
        this.$wuxToptips.error({
          text:
            "确认新密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)且不能为空",
          duration: 3000
        });
        this.confirmPasswordClass = this.errorClassStr;
        return false;
      }

      if (this.confirmPassword !== this.newPassword) {
        this.$wuxToptips.error({
          text: "密码不一致",
          duration: 3000
        });
        this.newPasswordClass = this.errorClassStr;
        this.confirmPasswordClass = this.errorClassStr;
        return false;
      }

      if (!/^1[3|4|5|6|7|8][0-9]{9}$/.test(this.tel)) {
        this.$wuxToptips.error({
          text: "请输入正确的手机号码",
          duration: 3000
        });
        return false;
      }

      if (!this.vcode) {
        this.$wuxToptips.error({
          text: "请输入验证码",
          duration: 3000
        });
        return false;
      }
      return true;
    },
    reset() {
      // this.oldPassword = '';
      this.resetClass();
      this.newPassword = "";
      this.confirmPassword = "";
      this.tel = "";
      this.vcode = "";
      this.count = 0;
    },
    modify() {
      if (!this.validated()) {
        console.error("is not validated");
        return;
      }
      this.$http(
        "passwordReset",
        {
          newPassword: md5(this.newPassword),
          mobile: this.tel,
          smsCode: this.vcode
        },
        {
          method: "put",
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      )
        .then(res => {
          console.log("modify password res", res);
          this.showToast("重置成功");
          // wx.reLaunch({
          //   url: "/pages/user-info/main",
          //   success: re => {
          //     console.log("wx.reLaunch", re);
          //   }
          // });
        })
        .catch(res => {
          console.log("catch res", res);
          this.showToast("重置失败");

          // this.$wuxToptips.error({
          //   text: res.head && res.head.msg,
          //   duration: 3000
          // });
        });
    },
    initTooltip() {
      if (!this.$wuxToptips) {
        this.$wuxToptips = $wuxToptips("#wux-toptips1", this.$root.$mp.page);
      }
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    }
  },
  mounted() {
    this.initTooltip();
    this.reset();
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style lang="scss">
.hj-forget-password {
  width: 100vw;
  height: 100vh;
  background: rgba(244, 247, 254, 1);
  padding: 10px;
  box-sizing: border-box;
  &__input {
    font-size: 18px;
    // border-bottom: 1px solid rgba(102, 120, 233, 1);
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    padding-bottom: 5px;
    margin-top: 10px;
    font-size: 14px;
    // font-family: PingFang-SC-Medium;
    &__placeholder {
      font-family: PingFang-SC-Medium;
    }
  }

  &__label {
    font-size: 18px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    // color: rgba(99, 99, 99, 1);
    color: rgba(8, 8, 8, 1);
  }
  &__btn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    &__reset {
      background: #fff;
      color: rgba(102, 120, 233, 1);
      font-family: PingFang-SC-Medium;
      width: 20%;
    }
    &__confirm {
      background: rgba(102, 120, 233, 1);
      color: #fff;
      font-family: PingFang-SC-Medium;
      width: 20%;
    }
  }
  &__vcode {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    &__hd,
    &__ft {
      flex-grow: 0;
    }
    &__ft {
      text-align: right;
      width: 120px;
    }
    &__bd {
      flex-grow: 1;
    }
  }
  &--red-border-bottom {
    border-bottom: 1rpx solid red !important;
  }
}
</style>
