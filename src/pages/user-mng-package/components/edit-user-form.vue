<template>
  <div class="hj-user-form">
    <formItem
      ref="tel"
      :hjClass="telClass"
      label="手机号码"
      type="number"
      name="tel"
      placeholder="请输入手机号码"
      :value="tel"
    >
    </formItem>

    <formItem
      ref="loginName"
      :hjClass="loginNameClass"
      label="登录名"
      name="loginName"
      placeholder="请输入登录名"
      :value="loginName"
    > </formItem>

    <formItem
      ref="username"
      :hjClass="usernameClass"
      label="昵称"
      name="username"
      placeholder="请输入昵称"
      :value="username"
    > </formItem>

    <!-- <formItem
      ref="email"
      :hjClass="emailClass"
      label="邮箱"
      name="email"
      placeholder="请输入邮箱"
      :value="email"
    > </formItem> -->
    <formItem
      v-if="isShowMore"
      ref="resetPasswordFlag"
      :hjClass="resetPasswordFlagClass"
      label="重置密码"
      name="resetPasswordFlag"
      formType="switch"
      type="switch"
      :value="resetPasswordFlag"
    >
    </formItem>
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
// userId	是	int	被编辑的用户id
// tel	是	string	手机号
// loginName	是	string	登录名，不能是纯数字或者包含@符号
// username	是	string	昵称
// email	是	string	邮箱
// resetPasswordFlag	否	boolean	是否重置密码（使用系统自定义策略）

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
        //   pattern: //,
        //   message: "登录名不能是全数字，必须包含除'-_' 之外的字符"
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
      loginName: "",
      username: "",
      // email: "",
      resetPasswordFlag: false,

      telClass: "",
      loginNameClass: "",
      usernameClass: "",
      emailClass: "",
      resetPasswordFlagClass: "",

      errorClassStr: "hj-user-form--red-border-bottom",

      isShowMore: false,
      currentFormData: null
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
      var formData = {
        tel: +this.$refs.tel.getVal(),
        loginName: this.$refs.loginName.getVal(),
        username: this.$refs.username.getVal()
        // email: this.$refs.email.getVal()
      };
      if (this.isShowMore) {
        formData.resetPasswordFlag = this.$refs.resetPasswordFlag.getVal();
      }
      return formData;
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

        // if (!this.$refs.username.getVal()) {
        //   this.usernameClass = this.errorClassStr;
        //   this.showToast("昵称不能为空");
        //   reject(false);
        //   return;
        // }
        // if (!this.$refs.email.getVal()) {
        //   this.emailClass = this.errorClassStr;
        //   this.showToast("邮箱码不能为空");
        //   reject(false);
        //   return;
        // }
        if (!this.$refs.loginName.getVal()) {
          this.loginNameClass = this.errorClassStr;
          this.showToast("登录名不能为空");
          reject(false);
          return;
        }
        if (!/\D+/g.test(this.$refs.loginName.getVal())) {
          this.loginNameClass = this.errorClassStr;
          this.showToast("登录名不能全是数字，必须包含除'-_' 之外的字符");
          return;
        }
        if (!/[^a-zA-Z]+/g.test(this.$refs.loginName.getVal())) {
          this.loginNameClass = this.errorClassStr;
          this.showToast("登录名不能全是字母，必须包含除'-_' 之外的字符");
          return;
        }
        var validatorData = {};

        validatorData.tel = +this.$refs.tel.getVal();
        // if (this.$refs.email && this.$refs.email.getVal()) {
        //   validatorData.email = this.$refs.email.getVal();
        // }

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
      this.loginNameClass = "";
      this.usernameClass = "";
      this.emailClass = "";
      this.resetPasswordFlagClass = "";
    },
    resetData(isResetCurrentFormData, data) {
      if (isResetCurrentFormData) {
        data = this.currentFormData;
      } else if (!data) {
        data = {};
      }

      console.log("reset", data);
      this.tel = data.tel || "";
      this.loginName = data.loginName || "";
      this.username = data.username || "";
      // this.email = data.email || "";
      this.resetPasswordFlag = data.resetPasswordFlag ? true : false;
    },
    reset(isResetCurrentFormData, data) {
      this.resetFormItemClass();
      this.tel = " ";
      this.loginName = " ";
      this.username = " ";
      // this.email = " ";
      this.resetPasswordFlag = " ";
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.resetData(isResetCurrentFormData, data);
        });
      });
    },
    // setData(data) {
    //   if (!data) {
    //     return;
    //   }
    //   this.resetFormItemClass();

    //   this.currentFormData = { ...data };

    //   this.tel = data.tel || "";
    //   this.loginName = data.loginName || "";
    //   this.username = data.username || "";
    //   this.email = data.email || "";
    //   this.resetPasswordFlag = data.resetPasswordFlag ? true : false;
    // },
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
