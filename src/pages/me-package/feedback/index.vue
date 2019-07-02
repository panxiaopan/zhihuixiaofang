<template>
  <div class="hj-feedback">
    <textarea
      class="hj-feedback__textarea"
      v-model.lazy="feedback"
      :placeholder="placeholder"
      name="feedback"
      id="feedback"
    ></textarea>
    <!-- <div class="hj-feedback__label">原密码</div>
    <input class="hj-feedback__input" v-model.lazy="oldPassword" type="password" placeholder="请输入原密码">
    <div class="hj-feedback__label">新密码</div>
    <input class="hj-feedback__input" v-model.lazy="newPassword" type="password" placeholder="请输入新密码">
    <div class="hj-feedback__label">确认新密码</div>
    <input class="hj-feedback__input" v-model.lazy="confirmPassword" type="password" placeholder="请再输入新密码">
    <div class="hj-feedback__btn">
      <button class="hj-feedback__btn__reset" @click="reset" style="background: #fff;color:rgba(102, 120, 233, 1);">重置</button>
      <button class="hj-feedback__btn__modify" @click="modify" style="background: rgba(102, 120, 233, 1);color: #fff;">修改</button>
    </div> -->

    <wux-row>
      <wux-rol
        :span=5
        @click="reset"
      ><button>重置</button></wux-rol>
      <wux-rol
        :span=5
        @click="confirm"
      ><button>提交</button></wux-rol>
    </wux-row>
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
    if (wx.getStorageSync("appIsHide")) {
      wx.setStorageSync("appIsHide", false);
      return;
    }
    this.oldPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";
  },
  components: {
    // card
  },

  data() {
    return {
      feedback: "",
      placeholder: "请输入反馈意见"
    };
  },
  methods: {
    reset(e) {
      console.log("reset", e);
    },
    confirm(e) {
      console.log("confirm", e);
    },
    validated() {
      if (!this.oldPassword) {
        this.$wuxToptips.error({
          text: "请输入原密码",
          duration: 3000
        });
        return false;
      }
      if (!this.newPassword) {
        this.$wuxToptips.error({
          text: "请输入新密码",
          duration: 3000
        });
        return false;
      }
      if (!this.confirmPassword) {
        this.$wuxToptips.error({
          text: "请再次输入新密码",
          duration: 3000
        });
        return false;
      }
      if (this.confirmPassword !== this.newPassword) {
        this.$wuxToptips.error({
          text: "新密码不一致",
          duration: 3000
        });
        return false;
      }
      return true;
    },
    reset() {
      this.oldPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    },
    modify() {
      if (!this.validated()) {
        console.error("is not validated");
        return;
      }

      this.$http(
        "password",
        {
          oldPassword: md5(this.oldPassword),
          newPassword: md5(this.newPassword)
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
          wx.reLaunch({
            url: "/pages/user-info/main",
            success: re => {
              console.log("wx.reLaunch", re);
            }
          });
        })
        .catch(res => {
          console.log("catch res", res);
          this.$wuxToptips.error({
            text: res.head && res.head.msg,
            duration: 3000
          });
        });
    },
    initTooltip() {
      if (!this.$wuxToptips) {
        this.$wuxToptips = $wuxToptips("#wux-toptips1", this.$root.$mp.page);
      }
    }
  },
  mounted() {
    this.initTooltip();
  }
};
</script>

<style lang="scss">
.hj-feedback {
  width: 100vw;
  height: 100vh;
  background: rgba(244, 247, 254, 1);
  padding: 10px;
  box-sizing: border-box;
  &__textarea {
    width: 100%;
    font-size: 18px;
    border: 1px solid rgba(102, 120, 233, 1);
    margin-bottom: 20px;
    font-family: PingFang-SC-Medium;
  }
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
}
</style>
