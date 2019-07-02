<template>
  <div class="hj-me-setting">
    <wux-cell
      class="hj-me-setting__cell"
      wux-class="hj-me-setting__wux_cell"
      v-for="cell in cellList"
      :key="cell.title"
      :title="cell.title"
      :isLink="cell.isLink"
      :url="cell.url"
      @click="click"
    ></wux-cell>
    <div class="hj-me-setting__unbound">
      <button
        class="hj-me-setting__unbound__btn"
        type="warn"
        @click="unbound"
      >解除绑定</button>
    </div>
  </div>
</template>

<script>
// import { formatTime } from '@/utils/index';
// import card from '@/components/card';

import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
export default {
  onShareAppMessage,
  components: {
    // card
  },

  data() {
    return {
      logs: [],
      userInfo: {
        avatarUrl: "../../static/images/common/me@2x.png",
        nickName: "nickName"
      },
      actionList: [
        {
          name: "我的工单",
          url: "../../static/images/home/order.png",
          active: false,
          activeUrl: "../../static/images/home/order_active.png",
          unactiveUrl: "../../static/images/home/order.png",
          icon: "ios-today"
        },
        {
          name: "设备管理",
          url: "../../static/images/home/device-mng.png",
          active: false,
          activeUrl: "../../static/images/home/device-mng_active.png",
          unactiveUrl: "../../static/images/home/device-mng.png",
          icon: "ios-hammer"
        },
        {
          name: "人工上报",
          url: "../../static/images/home/upload.png",
          active: false,
          activeUrl: "../../static/images/home/upload_active.png",
          unactiveUrl: "../../static/images/home/upload.png",
          icon: "ios-cloud-upload"
        }
      ],
      cellList: [
        // {
        //   title: '切换账号',
        //   isLink: true,
        //   url: '/pages/login-with-count/main?switchCount=1'
        // },
        // {
        //   title: '意见反馈',
        //   isLink: true,
        //   url: '/pages/feedback/main'
        // },
        {
          title: "修改密码",
          isLink: true,
          url: "/pages/me-package/modify-password/main"
        }
      ]
    };
  },
  methods: {
    setUserInfo(detail) {
      wx.setStorageSync("userInfo", detail.userInfo);
      var login = wx.getStorageSync("login");
      login.encryptedData = detail.encryptedData;
      login.iv = detail.iv;
      login.signature = detail.signature;
      wx.setStorageSync("login", login);
      console.log("getUserInfo", login);
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
    },

    click(e) {
      // password account unbindToWeChat
      console.log("click", e);
    },
    unbound(e) {
      console.log("unbound", e);
      // this.$http('unbound',{},{});
      wx.login({
        success: response => {
          console.log("unbound login code", response);
          this.$http(
            "unbindToWeChat",
            { code: response.code },
            {
              headers: {
                "content-type": "application/x-www-form-urlencoded"
              }
            }
          ).then(res => {
            // this.setLoginCode(false);
            console.log('unbound success, direct to page, /pages/user-info/main')
            wx.reLaunch({ url: "/pages/user-info/main" });
          }).catch( e =>{            
            console.log('unbound fail,', e)
            wx.reLaunch({ url: "/pages/user-info/main" });
          });
        }
      });
    }
  },

  mounted() {}
};
</script>

<style lang="scss">
.hj-me-setting {
  width: 100vw;
  height: 100vh;
  background: rgba(244, 247, 254, 1);
  // padding: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  &__cell {
    box-sizing: border-box;

    width: 100%;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(49, 49, 49, 1);
  }
  &__wux_cell {
    box-sizing: border-box;

    // width: 100%;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(49, 49, 49, 1);
  }
  &__unbound {
    margin-top: 10px;
    width: 100%;
    // margin-left: 10px;
    // margin-right: 10px;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
    &__btn {
      // padding-left: 10px;
      // padding-right: 10px;
      // box-sizing: border-box;
    }
  }
}
</style>
