<template>
  <div class="hj-user-form">
    <formItem
      ref="tel"
      :hjClass="telClass"
      required
      label="手机号码"
      type="number"
      name="tel"
      placeholder="请输入手机号码"
      :value="tel"
    >
    </formItem>
    <formItem
      ref="username"
      :hjClass="usernameClass"
      required
      label="昵称"
      name="username"
      placeholder="请输入昵称"
      :value="username"
    > </formItem>
    <formItem
      ref="userPassword"
      :hjClass="userPasswordClass"
      required
      label="密码"
      password
      name="userPassword"
      placeholder="请输入密码"
      :value="userPassword"
    >
    </formItem>

    <formItem
      ref="userRepassword"
      :hjClass="userRepasswordClass"
      required
      label="确认密码"
      password
      name="userRepassword"
      placeholder="请再次输入密码"
      :value="userRepassword"
    > </formItem>

    <div v-if="isShowMore">
      <formItem
        ref="loginName"
        :hjClass="loginNameClass"
        label="登录名"
        name="loginName"
        placeholder="请输入登录名"
        :value="loginName"
      > </formItem>

      <!-- <formItem
        ref="email"
        :hjClass="emailClass"
        label="邮箱"
        name="email"
        placeholder="请输入邮箱"
        :value="email"
      > </formItem> -->
    </div>
    <div
      style="text-align:right;padding-right: 10px;"
      @click="toggleShowMore"
    >
      <wux-icon
        v-if="!isShowMore"
        type="ios-arrow-down"
        color="##6677e9"
      ></wux-icon>
      <wux-icon
        v-if="isShowMore"
        type="ios-arrow-up"
        color="##6677e9"
      ></wux-icon>
    </div>
  </div>
</template>
<script>
// 参数名	必选	类型	说明
// tel	是	string	手机号
// userPassword	是	string	密码
// userRepassword	是	string	重复密码
// loginName	是	string	默认使用 hj_+电话号码
// username	是	string	昵称
// email	否	string	邮箱

// var isTelAndMobile = /^(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})$/;
// var isMobile = /^1[3|4|5|6|7|8][0-9]{9}$/;
// var isEmpty = /(^\s*)|(\s*$)/g;
import formItem from "./form-item.vue";
import schema from "async-validator";
export default {
  name: "hj-user-form",
  components: {
    formItem
  },
  props: {
    descriptor: {
      type: Object,
      default: () => ({
        tel: {
          type: "number",
          require: true,
          pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
          message: "必须填入正确的手机号码"
        }
        // userPassword: {
        //   type: "string",
        //   require: true,
        //   message: "请输入密码"
        // },
        // userRepassword: {
        //   type: "string",
        //   require: true,
        //   message: "请再次输入密码"
        // },
        // loginName: {
        //   type: "string",
        //   message: ""
        // },
        // username: {
        //   type: "string",
        //   message: ""
        // },
        // email: {
        //   type: "email",
        //   message: "请填入正确的邮箱"
        // }
      })
    }
  },
  data() {
    return {
      tel: "",
      userPassword: "",
      userRepassword: "",
      loginName: "",
      username: "",
      // email: "",

      telClass: "",
      userPasswordClass: "",
      userRepasswordClass: "",
      loginNameClass: "",
      usernameClass: "",
      emailClass: "",
      errorClassStr: "hj-user-form--red-border-bottom",

      isShowMore: false
    };
  },
  methods: {
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
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
      var tel = +this.$refs.tel.getVal();
      // var loginName = this.$refs.loginName.getVal();
      var userPassword = this.$refs.userPassword.getVal();
      var userRepassword = this.$refs.userRepassword.getVal();

      var result = {
        tel,
        username: this.$refs.username.getVal(),
        userPassword,
        userRepassword
      };
      // loginName: loginName || "hj_" + tel,
      // result.username = this.$refs.username.getVal();
      if (this.isShowMore) {
        result.loginName =
          this.$refs.loginName && this.$refs.loginName.getVal();
        // result.email = this.$refs.email && this.$refs.email.getVal();
      }
      return result;
    },
    validateAndGetFormData() {
      return new Promise((resolve, reject) => {
        this.resetFormItemClass();
        console.log("this.$refs", this, this.$refs);
        if (!this.$refs.tel.getVal()) {
          this.telClass = this.errorClassStr;
          this.showToast("手机号码不能为空");
          reject(false);
          return;
        }
        if (!this.$refs.username.getVal()) {
          this.usernameClass = this.errorClassStr;
          this.showToast("用户名不能为空");
          reject(false);
          return;
        }
        if (!this.$refs.userPassword.getVal()) {
          this.userPasswordClass = this.errorClassStr;
          this.showToast("密码不能为空");
          reject(false);
          return;
        }
        if (!this.$refs.userRepassword.getVal()) {
          this.userRepasswordClass = this.errorClassStr;
          this.showToast("确认密码不能为空");
          reject(false);
          return;
        }
        if (
          this.$refs.userPassword.getVal() !==
          this.$refs.userRepassword.getVal()
        ) {
          this.showToast("两次输入的密码必须一致");
          this.userPasswordClass = this.errorClassStr;
          this.userRepasswordClass = this.errorClassStr;
          reject(false);
          return;
        }
        var validatorData = {};
        validatorData.tel = +this.$refs.tel.getVal();

        if (this.isShowMore) {
          // validatorData.email = this.$refs.email && this.$refs.email.getVal();
        }

        this.validator(validatorData)
          .then(res => {
            resolve(this.getFormDataObj());
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
    resetFormItemClass() {
      this.telClass = "";
      this.userPasswordClass = "";
      this.userRepasswordClass = "";
      this.loginNameClass = "";
      this.usernameClass = "";
      this.emailClass = "";
    },
    resetBlankData() {
      this.tel = "-";
      this.userPassword = "-";
      this.userRepassword = "-";
      this.loginName = "-";
      this.username = "-";
      // this.email = "-";
    },
    resetData() {
      this.tel = "";
      this.userPassword = "";
      this.userRepassword = "";
      this.loginName = "";
      this.username = "";
      // this.email = "";
    },
    reset() {
      this.resetFormItemClass();
      this.resetBlankData();
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.resetData();
        });
      });
    },
    setData(data) {
      this.resetFormItemClass();
      this.tel = data.tel;
      this.userPassword = data.userPassword;
      this.userRepassword = data.userRepassword;
      this.loginName = data.loginName;
      this.username = data.username;
      // this.email = data.email;
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    }
  }
};
</script>
<style lang="scss">
.hj-user-form {
  width: 100%;
  box-sizing: border-box;
  // color: #6677e9;
  &--none-border-bottom {
    border-bottom: 0rpx solild #ddd;
  }

  &--blue-border-bottom {
    // border-bottom: 1rpx solid blue;
    border-bottom: 1rpx solid #ddd;
  }
  &--gray-border-bottom {
    border-bottom: 1rpx solid #ddd;
  }
  &--red-border-bottom {
    border-bottom: 1rpx solid red !important;
  }
}
</style>
