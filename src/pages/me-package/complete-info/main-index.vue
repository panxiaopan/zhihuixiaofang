<template>
  <div class="hj-complete-info">
    <form
      @submit="onFormSubmit"
      @reset="onReset"
    >
      <!-- <formItem
        ref="loginName"
        :hjClass="loginNameClass"
        label="登录名"
        type="text"
        required
        name="loginName"
        placeholder="请输入登陆名"
        :value="loginName"
      >
      </formItem> -->
      <formItem
        ref="userName"
        :hjClass="userNameClass"
        label="昵称"
        type="text"
        required
        name="userName"
        placeholder="请输入昵称"
        :value="userName"
      >
      </formItem>
      <formItem
        ref="tel"
        :hjClass="telClass"
        label="电话"
        type="text"
        required
        name="tel"
        placeholder="请输入电话"
        @hj-input="inputTel"
        :value="tel"
      >
      </formItem>
      <sendCodeItem
        ref="telCode"
        name="telCode"
        :required="false"
        :value="telCode"
        @send="sendTelColde"
        placeholder="请输入验证码"
        :disabledSend="disabledSendTelCode"
      ></sendCodeItem>

      <!-- <formItem
        ref="email"
        :hjClass="emailClass"
        label="邮箱"
        type="text"
        name="email"
        placeholder="请输入邮箱"
        :value="email"
        @hj-input="inputEmail"
      >
      </formItem>
      <sendCodeItem
        ref="emailCode"
        :required="false"
        name="emailCode"
        placeholder="请输入邮箱验证码"
        :value="emailCode"
        @send="sendEmailCode"
        :disabledSend="disabledSendEmailCode"
      ></sendCodeItem> -->

      <!-- :disabled="disabledReset" -->
      <!-- :disabled="disabledModify" -->
      <div class="hj-complete-info__btn">
        <!-- <button
          class="hj-complete-info__btn__reset"
          @click="resetData"
          style="background: #fff;color:rgba(102, 120, 233, 1);"
        >重置</button> -->
        <button
          class="hj-complete-info__btn__modify"
          formType="submit"
          @click="modify"
          style="background: rgba(102, 120, 233, 1);color: #fff;width:100%;"
        >修改</button>
      </div>
    </form>
    <!-- <wux-toptips id="wux-toptips1"></wux-toptips> -->
  </div>
</template>

<script>
// import { formatTime } from '@/utils/index';
// import card from '@/components/card';

import schema from "async-validator";
import formItem from "../components/form-item.vue";
import sendCodeItem from "@/components/send-code-item/index.vue";

// import { $wuxToptips } from "@/utils/wux.js";
// import md5 from "md5";

// import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
export default {
  // onShareAppMessage,
  // onShow() {
  //   if (wx.getStorageSync("appIsHide")) {
  //     wx.setStorageSync("appIsHide", false);
  //     return;
  //   }
  // },
  props: {
    descriptor: {
      type: Object,
      default: () => ({
        // loginName: {
        //   type: "string",
        //   required: true,
        //   message: "必须填写登录名"
        // },
        userName: {
          type: "string",
          required: true,
          message: "必须填写昵称"
        },
        tel: {
          type: "number",
          required: true,
          pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
          message: "请填写正确电话号码"
        },
        // email: {
        //   type: "email",
        //   message: "填写的邮箱格式不正确"
        // },
        telCode: {
          type: "string",
          message: "请填写手机验证码"
        }
        // emailCode: {
        //   type: "string",
        //   message: "请填写邮箱验证码"
        // }
      })
    }
  },
  components: {
    formItem,
    sendCodeItem
    // card
  },
  computed: {
    // disabledSendTelCode() {
    //   return !/^1[3|4|5|6|7|8][0-9]{9}$/.test(this.tel);
    // },
    // disabledSendEmailCode() {
    //   return !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email);
    // }
    // disabledReset() {
    //   if (!this.originData) {
    //     return true;
    //   }
    //   return !this.isSameWithOriginData();
    // },
    // disabledModify() {
    //   if (!this.originData) {
    //     return true;
    //   }
    //   return !this.isSameWithOriginData();
    // }
  },
  data() {
    return {
      // loginName: "",
      userName: "",
      tel: "",
      // email: "",
      telCode: "",
      // emailCode: "",

      // loginNameClass: "",
      userNameClass: "",
      telClass: "",
      emailClass: "",
      telCodeClass: "",
      emailCodeClass: "",

      errorClassStr: "hj-complete-info--red-border-bottom",
      originData: null,
      disabledSendTelCode: false,
      disabledSendEmailCode: false
    };
  },
  methods: {
    setDisabledSendTelCode(tel) {
      if (
        tel &&
        this.originData &&
        this.originData.tel &&
        tel == this.originData.tel
      ) {
        this.disabledSendTelCode = true;
      } else {
        this.disabledSendTelCode = !/^1[3|4|5|6|7|8][0-9]{9}$/.test(+tel);
      }
    },
    setDisabledSendEmailCode(email) {
      if (
        email &&
        this.originData &&
        this.originData.email &&
        email == this.originData.email
      ) {
        this.disabledSendEmailCode = true;
      }
      this.disabledSendEmailCode = !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(
        email
      );
    },
    changeTel(val) {
      this.tel = val;
    },
    inputTel(val) {
      console.log("inputTel", val);
      console.log("this.$refs", this.$refs);
      // this.tel = val;
      this.tempTel = val;
      this.setDisabledSendTelCode(val);
      if (!val) {
        this.$refs.telCode.resetSend();
      }
    },
    // changeEmail(val) {
    //   this.email = val;
    // },
    // inputEmail(val) {
    //   // this.email = val;
    //   this.tempEmail = val;
    //   this.setDisabledSendEmailCode(val);
    //   if (!val) {
    //     this.$refs.emailCode.resetSend();
    //   }
    // },
    sendTelColde() {
      this.$http("telCode", {
        tel: this.$refs.tel.getVal(),
        type: "modification"
      })
        .then(res => {
          this.showToast("发送手机验证码成功");
        })
        .catch(res => {
          this.showToast("发送手机验证码失败");
          console.error("sendTelColde fail: ", res);
        });
    },
    // sendEmailCode() {
    //   this.$http("emailCode", { email: this.$refs.email.getVal() })
    //     .then(res => {
    //       this.showToast("发送邮箱验证码成功");
    //     })
    //     .catch(res => {
    //       console.error("sendEmailCode fail：", res);
    //       this.showToast("发送邮箱验证码失败");
    //     });
    // },
    onFormSubmit(e) {
      console.log("onFormSubmit", e);
    },
    isSameWithOriginData() {
      return ["userName", "tel", "email"].every(item => {
        console.log(
          item,
          "this",
          this[item],
          "this.originData",
          this.originData[item]
        );
        return this[item] == this.originData[item];
      });
    },
    resetBlankData() {
      // this.loginName = " ";
      this.userName = " ";
      this.tel = " ";
      this.tempTel = " ";
      this.setDisabledSendTelCode("");
      // this.email = " ";
      this.tempEmail = " ";
      this.setDisabledSendEmailCode("");
      this.telCode = " ";
      // this.emailCode = " ";
    },
    resetData() {
      if (this.isSameWithOriginData()) {
        this.showToast("数据未改变");
        return;
      }
      this.resetBlankData();
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.reset(this.originData);
        });
      });
    },
    onReset(e) {
      console.log("onReset", e);
    },
    validator(formData, descriptor) {
      // var isTelAndMobile = /^(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})$/;
      // var isMobile = /^1[3|4|5|6|7|8][0-9]{9}$/;
      // var isEmpty = /(^\s*)|(\s*$)/g;
      console.log("validator", formData);
      return new Promise((resolve, reject) => {
        if (!descriptor && !this.descriptor) {
          console.error("descriptor must be needed");
          reject(false);
        }
        var validator = new schema(descriptor || this.descriptor);
        validator.validate(formData, (errors, fields) => {
          console.log("errors", errors);
          if (errors) {
            console.log("validator.validate", errors, fields);
            // return handleErrors(errors, fields);
            reject({ errors, fields });
          } else {
            resolve(formData);
          }
        });
      });
    },
    getFormDataObj() {
      return {
        // loginName: this.$refs.loginName.getVal(),
        userName: this.$refs.userName.getVal(),
        tel: this.tel,
        // email: this.email,
        // tel: this.$refs.tel.getVal(),
        // email: this.$refs.email.getVal(),
        telCode: this.$refs.telCode.getVal()
        // emailCode: this.$refs.emailCode.getVal()
      };
    },
    getFormDataFilterOrigin() {
      var formData = this.getFormDataObj();
      console.log("formData", formData);
      var result = {};
      var diffArr = [];
      // ["userName", "tel", "email"]
      ["userName", "tel"].forEach(item => {
        if (this.originData[item] != formData[item]) {
          diffArr.push(item);
        }
      });

      diffArr.forEach(diffKey => {
        result[diffKey] = formData[diffKey];
      });

      if (diffArr.includes("tel")) {
        result.telCode = formData["telCode"];
      }
      // if (diffArr.includes("email")) {
      //   result.emailCode = formData["emailCode"];
      // }
      return result;
    },
    validateAndGetFormData() {
      console.log("validateAndGetFormData");
      return new Promise((resolve, reject) => {
        this.resetClass();
        // var loginName = this.$refs.loginName.getVal();
        var userName = this.$refs.userName.getVal();
        var tel = this.$refs.tel.getVal();
        // var email = this.$refs.email.getVal();
        var telCode = this.$refs.telCode.getVal();
        var emailCode = this.$refs.emailCode.getVal();

        var validateData = {
          // loginName: loginName || NaN,
          userName: userName || NaN,
          tel: +tel || NaN
        };

        // if (!!email.trim()) {
        //   validateData.email = email;
        //   if (email != this.originData.email) {
        //     validateData.emailCode = emailCode || NaN;
        //   }
        // }
        console.log("tel , this.originData.tel", tel, this.originData.tel);
        if (tel != this.originData.tel) {
          validateData.telCode = telCode || NaN;
        }
        console.log("validateData.telCode", telCode);
        this.validator(validateData)
          .then(res => {
            // console.log("social unit form validated", this.getFormDataObj());
            resolve(this.getFormDataFilterOrigin());
          })
          .catch(res => {
            console.log("is not be validated", res);
            if (res && res.errors.length) {
              res.errors.forEach((item, index) => {
                if (!index) {
                  this.showToast(item.message);
                }
                this[item.field + "Class"] = this.errorClassStr;
              });
            }
            reject(false);
          });
      });
    },
    resetClass() {
      // this.loginNameClass = "";
      this.userNameClass = "";
      this.telClass = "";
      this.emailClass = "";
      this.telCodeClass = "";
      this.emailCodeClass = "";
    },
    reset(data) {
      console.log("reset data", data);
      this.resetClass();
      data = data || {};
      // this.loginName = data.loginName || "";
      this.userName = data.userName || "";
      this.tel = +data.tel || "";
      this.tempTel = +data.tel || "";
      this.setDisabledSendTelCode(data.tel);
      // this.email = data.email || "";
      // this.tempEmail = data.email || "";
      // this.setDisabledSendEmailCode(data.email);
      this.telCode = "";
      // this.emailCode = "";
    },
    modify() {
      console.log("modify");

      // this.email = this.tempEmail;
      this.tel = this.tempTel;

      if (this.isSameWithOriginData()) {
        this.showToast("数据未改变");
        return;
      }

      // 参数名	必选	类型	说明
      // nickname	否	string	昵称
      // tel	否	string	手机号
      // telCode	否	string	手机验证码，当手机号非空时，为必填项
      // email	否	string	邮箱
      // emailCode	否	string	邮箱验证码，当邮箱非空时，为必填项
      // loginName	否	string	登录名
      this.validateAndGetFormData()
        .then(res => {
          console.log("validateAndGetFormData", res);
          this.queryModifyInfo(res);
        })
        .catch(res => {
          console.log("validateAndGetFormData error", res);
        });
    },
    queryModifyInfo(params) {
      console.log("queryModifyInfo", params);
      this.$http("account", params, {
        method: "put",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          console.log("modify password res", res);
          var newParams = { ...params };
          if (newParams.hasOwnProperty("telCode")) {
            delete newParams.telCode;
          }
          if (newParams.hasOwnProperty("emailCode")) {
            delete newParams.emailCode;
          }

          Object.assign(this.originData, newParams);
          this.telCode = "";
          this.emailCode = "";
          this.$refs.telCode.resetSend();
          this.$refs.emailCode.resetSend();
          this.showToast("修改信息成功");
          // wx.navigateBack

          // wx.reLaunch({
          //   url: "/pages/user-info/main",
          //   success: re => {
          //     console.log("wx.reLaunch", re);
          //   }
          // });
        })
        .catch(res => {
          console.log("catch res", res);
          this.showToast(res.head && res.head.msg);
          // this.$wuxToptips.error({
          //   text: res.head && res.head.msg,
          //   duration: 3000
          // });
        });
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    },
    // initTooltip() {
    //   if (!this.$wuxToptips) {
    //     this.$wuxToptips = $wuxToptips("#wux-toptips1", this.$root.$mp.page);
    //   }
    // },
    queryData() {
      this.$http("account", {}, { method: "get" })
        .then(res => {
          console.log(res);
          console.log(res.data);
          this.originData = res.data;
          this.reset(res.data);
        })
        .catch(res => {
          console.log(res);
        });
    }
  },
  mounted() {
    this.queryData();
  }
};
</script>

<style lang="scss">
.hj-complete-info {
  width: 100vw;
  height: 100vh;
  background: rgba(244, 247, 254, 1);
  padding: 10px;
  box-sizing: border-box;
  &__input {
    font-size: 18px;
    border-bottom: 1px solid rgba(102, 120, 233, 1);
    margin-bottom: 20px;
    font-family: PingFang-SC-Medium;
  }

  &__label {
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(99, 99, 99, 1);
  }
  &__btn {
    margin-top: 30px;
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
      width: 100%;
    }
  }
  &--blue-border-bottom {
    // border-bottom: 1rpx solid blue;
    border-bottom: 1rpx solid #ddd;
  }
  &--red-border-bottom {
    border-bottom: 1rpx solid red !important;
  }
}
</style>
