<template>
  <div class="hj-me">
    <div v-if="!isAuth" style="height:100%;width:100%;position:relative: z-index:11111;">暂无权限查看</div>
    <div class="hj-me__topbg" v-if="isAuth"></div>
    <div class="hj-me__toper" v-if="isAuth">
      <div class="hj-me__toper__layer">
        <div class="hj-me__toper__layer__avatar">
          <div class="hj-me__toper__layer__avatar__icon">
            <div class="hj-me__toper__layer__avatar__icon__div">
              <button
                v-if="!isSettingUserInfo"
                open-type="getUserInfo"
                @getuserinfo="getUserInfoCb"
                style="height:44px;width:44px;border-radius: 22px;"
              >获取用户头像</button>
              <!-- <wux-popover placement="top" content="点击获取获取用户头像">
                <button v-if="!isSettingUserInfo" open-type="getUserInfo" @getuserinfo="getUserInfoCb" style="height:44px;width:44px;border-radius: 22px;">获取用户头像</button>
              </wux-popover>-->
              <img
                v-if="isSettingUserInfo"
                :src="userInfo.avatarUrl"
                alt="avatar"
                style="height:44px;width:44px;border-radius: 22px;"
              >
              <!-- <button v-if="!isSettingUserInfo" open-type="getUserInfo" @getuserinfo="getUserInfoCb" style="height:44px;width:44px;border-radius: 22px;">获取用户头像</button> -->
            </div>
          </div>
          <div class="hj-me__toper__layer__avatar__name">{{userInfo.nickName}}</div>
        </div>
        <!-- <wux-white-space size="large"></wux-white-space> -->
        <wux-wing-blank wux-class="hj-me__toper__layer__action--wrapper">
          <wux-row gutter="15">
            <wux-col
              span="4"
              v-for="item in actionList"
              :key="item.name"
              @click="clickAction(item)"
            >
              <div
                class="hj-me__toper__layer__action hj-me__toper__layer__action__order"
                @touchstart="touchstart($event, item)"
                @touchend="touchend($event, item)"
                hover-class="hj-me__toper__layer__action--active"
              >
                <wux-white-space size="default"></wux-white-space>
                <div class="hj-me__toper__layer__action--icon">
                  <wux-icon :type="item.icon"></wux-icon>
                </div>
                <div class="hj-me__toper__layer__action--name">{{item.name}}</div>
                <wux-white-space size="default"></wux-white-space>
              </div>
            </wux-col>
          </wux-row>
        </wux-wing-blank>
      </div>
    </div>
    <div v-if="isAuth" style="transform:translateY(-60px)">
      <wux-cell
        wux-class="hj-me__cell"
        v-for="cell in cellList"
        :key="cell.title"
        :title="cell.title"
        :isLink="cell.isLink"
        :url="cell.url"
      ></wux-cell>
    </div>
    <div v-if="isAuth" style="transform:translateY(-60px)">
      <official-account></official-account>
    </div>
  </div>
</template>

<script>
// import { formatTime } from '@/utils/index';
// import card from '@/components/card';
import API from "@/store/flyio/apiUrl/home";
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";

export default {
  onShareAppMessage,
  onShow() {
    // mp_mine_group
  },
  components: {
    // card
  },

  data() {
    return {
      APIURL: API.requestDomain,
      questionshow: false,
      isSettingUserInfo: false,
      logs: [],
      userInfo: {
        // avatarUrl: "../../static/images/common/my-head@2x.png",
        avatarUrl: "../../static/images/common/me@2x.png",
        nickName: "点击获取用户名"
      },
      actionList: [
        {
          id: "orderMsg",
          name: "工单管理",
          icon: "ios-today",
          permission: "mp_mine_work_order_manage",
          pageUrl: "/pages/me-package/worker-order-mng/main"

          // url: '../../static/images/home/order.png',
          // active: false,
          // activeUrl: '../../static/images/home/order_active.png',
          // unactiveUrl: '../../static/images/home/order.png'
        },
        {
          id: "socialUnitMsg",
          name: "社会单位管理",
          icon: "ios-hammer",
          permission: "mp_mine_social_unit_device_manage_device_delete",
          pageUrl: "/pages/me-package/social-unit-mng/main"

          // url: '../../static/images/home/device-mng.png',
          // active: false,
          // activeUrl: '../../static/images/home/device-mng_active.png',
          // unactiveUrl: '../../static/images/home/device-mng.png'
        },
        {
          id: "manualReport",
          name: "人工上报",
          icon: "ios-cloud-upload",
          permission: "mp_mine_risk_manual_report",
          pageUrl: "/pages/me-package/new-trouble/main",
          isReset: true
          // url: '../../static/images/home/upload.png',
          // active: false,
          // activeUrl: '../../static/images/home/upload_active.png',
          // unactiveUrl: '../../static/images/home/upload.png'
        }
      ],
      cellList: [
        {
          title: "完善资料",
          isLink: true,
          url: "/pages/me-package/complete-info/main"
        },
        {
          title: "意见反馈",
          isLink: true,
          url: "/pages/me-package/feedback/main"
        },
        {
          title: "常见问题",
          isLink: true,
          url: "/pages/me-package/common-problem/main"
        },
        {
          title: "设置",
          isLink: true,
          url: "/pages/me-package/me-setting/main"
        }
      ]
      // cellList: [
      //   {
      //     title: "完善资料",
      //     isLink: true,
      //     url: "/pages/user-mng-package/user-mng/main"
      //   },
      //   {
      //     title: "意见反馈",
      //     isLink: true,
      //     url: "/pages/me-package/feedback/main"
      //   },
      //   {
      //     title: "常见问题",
      //     isLink: true,
      //     url: "/pages/user-mng-package/user-mng/main"
      //   },
      //   {
      //     title: "用户管理",
      //     isLink: true,
      //     url: "/pages/user-mng-package/user-mng/main"
      //   },
      //   {
      //     title: "设置",
      //     isLink: true,
      //     url: "/pages/me-package/me-setting/main"
      //   }
      // ]
    };
  },
  computed: {
    isAuth() {
      return true;

      // return (
      //   this.$store.state.userPermissionsMap &&
      //   this.$store.state.userPermissionsMap["mp_mine_group"]
      // );
    },
    mngUsers() {
      return (
        this.$store.state.userPermissionsMap &&
        this.$store.state.userPermissionsMap["mp_account_manage_group"]
      );
    }
  },
  methods: {
    clickAction(item) {
      console.log("item", item, item.pageUrl, this);
      if (!this.$store.dispatch("isAuth", item.permission || "")) {
        return false;
      }
      if (item.pageUrl) {
        if (item.isReset) {
          this.$root.$mp.appOptions.query.isReset = true;
        }
        wx.navigateTo({ url: item.pageUrl });
      }
    },
    touchstart(e, item) {
      console.log("touchstart", e, item);
      item.url = item.activeUrl;
    },
    touchend(e, item) {
      console.log("touchend", e, item);
      item.url = item.unactiveUrl;
    },
    tap(e) {
      console.log("tap", e);
    },
    getUserInfoCb(e) {
      console.log("e", e);
      var userInfo = e.mp.detail.userInfo;
      this.setUserInfo(userInfo);
    },
    setUserInfo(userInfo) {
      if (!userInfo) {
        return;
      }
      this.userInfo.nickName = userInfo.nickName;
      this.userInfo.avatarUrl = userInfo.avatarUrl;
      this.isSettingUserInfo = true;
    },
    getUserInfo() {
      wx.getSetting({
        success(res) {
          console.log(res.authSetting);
          // res.authSetting = {
          //   "scope.userInfo": true,
          //   "scope.userLocation": true
          // }
          if (res.authSetting["scope.userInfo"]) {
            wx.getUserInfo({
              success: res => {
                console.log("me getUserInfo success res", res);
                var userInfo = res.userInfo;
                this.setUserInfo(userInfo);
              },
              fail: res => {
                console.log("me getUserInfo fail res", res);
              }
            });
          } else {
          }
        }
      });

      // 调用授权窗口 (除了 scope.userInfo scope.phoneNumber)
      // wx.authorize({
      //   scope: 'scope.userInfo',
      //   success: res => {},
      //   fail: res => {}
      // });
    },
    getSettingListByAuth(isAuthUsersMng) {
      var cellList = [
        {
          title: "完善资料",
          isLink: true,
          url: "/pages/me-package/complete-info/main"
        },
        // {
        //   title: "意见反馈",
        //   isLink: true,
        //   url: "/pages/me-package/feedback/main"
        // },
        {
          title: "设置",
          isLink: true,
          url: "/pages/me-package/me-setting/main"
        }
      ];
      if (this.questionshow) {
        cellList.splice(1, 0, {
          title: "常见问题",
          isLink: true,
          url: "/pages/me-package/common-problem/main"
        });
      }
      if (isAuthUsersMng) {
        cellList.splice(0, 0, {
          title: "用户管理",
          isLink: true,
          url: "/pages/user-mng-package/user-mng/main"
        });
      }
      return cellList;
    },
    getAccountInfo() {
      this.$http("account", {}, { method: "get" })
        .then(res => {
          // this.userInfo.avatarUrl =
          //   "../../static/images/common/socialUnitSampleImg.jpg";
          this.userInfo.nickName = res.data.userName;
          this.isSettingUserInfo = true;
        })
        .catch(res => {});
    }
  },
  created() {
    const logs = wx.getStorageSync("logs") || [];
    // this.logs = logs.map(log => formatTime(new Date(log)));
  },
  mounted() {
    // var userInfo = wx.getStorageSync("userInfo");
    // if (userInfo) {
    //   console.log("me mounted", userInfo);
    //   this.setUserInfo(userInfo);
    // } else {
    //   this.getUserInfo();
    // }
    if (this.APIURL.indexOf("https://www.huajiecloud.com/fp-mp") >= 0) {
      this.questionshow = true;
    } else {
      this.questionshow = false;
    }
    this.getAccountInfo();
    console.warn("me mounted this.mngUsers", this.mngUsers);
    this.cellList = this.getSettingListByAuth(this.mngUsers);
  }
};
</script>

<style lang="scss">
.hj-me {
  width: 100vw;
  height: 100vh;
  background: rgba(244, 247, 254, 1);
  &__topbg {
    height: 140px;
    width: 100%;
    background: linear-gradient(#6678e9, #8364db);
  }
  &__toper {
    transform: translateY(-40%);
    height: 175px;
    width: 100%;
    &__layer {
      transform: translateX(12%);
      width: 80%;
      // height: 175px;
      height: 150px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 24px 0px rgba(2, 25, 53, 0.14);
      border-radius: 5px;
      // position: relative;
      position: absolute;
      &__avatar {
        display: flex;
        justify-content: center;
        flex-direction: column;
        transform: translateY(-40%);
        &__icon {
          text-align: center;
          &__div {
            display: inline-block;
            background-color: #fff;
            border-radius: 22px;
            // box-shadow: 0px 3px 24px 0px rgba(2, 25, 53, 0.14);
          }
        }
        &__name {
          text-align: center;
          font-size: 18px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: rgba(49, 49, 49, 1);
        }
      }
      &__action {
        background: rgba(244, 247, 254, 1);
        border-radius: 4px;
        text-align: center;
        font-size: 12px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: #898989;
        &--wrapper {
          transform: translateY(-10px);
          // margin-top: -10px;
          // padding-bottom: 20px;
        }
        // color: red;
        &--active {
          color: #fff;
          background: linear-gradient(#6678e9, #8364db);
          & .hj-me__toper__layer__action--name {
            color: #fff;
          }
        }
        &--icon {
        }
        &--name {
          color: rgba(49, 49, 49, 1);
        }
        &__order {
        }
        &__devicemng {
        }
        &__upload {
        }
      }
    }
  }
  &__cell {
    font-size: 15px;
    line-height: 2;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(49, 49, 49, 1);
  }
}
</style>
