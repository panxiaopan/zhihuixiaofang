<script>
import { mapState, mapActions } from "vuex";
// import { onShareAppMessage } from '@/mixins/pageRegisterFun.js';
// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
export default {
  name: "app",
  onShow(e) {
    console.warn("e", e);
    console.warn(
      "app onShow this.$root.$mp.appOptions",
      JSON.stringify(this.$root.$mp.appOptions)
    );
    console.warn(
      "app onShow this.$root.$mp.query",
      JSON.stringify(this.$root.$mp.query)
    );

    // 当小程序已打开，从别的场景再进入小程序时， 场景值并不会变更，
    // scene: 值
    // 1043 公众号模板
    // 1035 自定义菜单
    // 1001 发现入口
    // 1089 微信主界面下拉
    // 1011 扫码
    // var scene = this.$root.$mp.appOptions.scene;
    var scene = e.scene;
    var appQuery = this.$root.$mp.appOptions.query;
    // this.$root.$mp.appOptions.scene = 0;

    // if (!wx.getStorageSync("sessionId")) {
    //   wx.redirectTo({ url: "/pages/user-info/main" });
    //   return;
    // }

    if (
      wx.getStorageSync("sessionId") &&
      this.$store &&
      this.$store.state &&
      this.$store.state.isLogin
    ) {
      // if (scene && scene !== 1043) {
      //   if (!appQuery || !appQuery.from) {
      //     wx.switchTab({ url: "/pages/index/main" });
      //   }
      //   return;
      // }

      if (scene == 1043 || scene == 1011) {
        // var query = this.$root.$mp.query;
        // if(this.$root.$mp.appOptions.query.from=='officialAccount'||this.$root.$mp.query.from=='officialAccount'){
        console.warn("call redirectFunByParams", JSON.stringify(appQuery));
        this.redirectFunByParams(appQuery);
      } else if (scene == 1035) {
        // else if (scene == 1001 || scene == 1035) {
        // this.redirectFunByParams(appQuery);

        // 公众号 菜单必须添加 redirect=home
        // &&appQuery.redirect == 'home'
        // wx.switchTab({ url: "/pages/index/main" });

        if (
          appQuery &&
          appQuery.from == "officialAccount" &&
          appQuery.redirect == "home"
        ) {
          wx.switchTab({ url: "/pages/index/main" });
          appQuery.from = "";
          appQuery.redirect = "";
        }

        // wx.switchTab({ url: "/pages/index/main" });
      } else if (scene == 1001) {
        wx.switchTab({ url: "/pages/index/main" });
        console.log("onShow scene", scene);
      }
    }
  },
  onHide() {
    console.log("app onhide");
    console.log(
      "this.$root.$mp.appOptions.query",
      this.$root.$mp.appOptions.query
    );
    console.log("this.$root.$mp", this.$root.$mp);
    console.log("this", this);
    wx.setStorageSync("appIsHide", true);
  },

  onLaunch(params) {
    // 有效
    console.warn("onLaunch", params);
    console.log("app onLaunch", params);
    console.log(
      "this.$root.$mp.appOptions.path, this.$root.$mp.appOptions.query, this.$root.$mp.query",
      this.$root.$mp.appOptions.path,
      this.$root.$mp.appOptions.query,
      this.$root.$mp.query
    );
    //  wx.authorize({success: res => {console.log('authorize',res)}, scope:"scope.userInfo"});
  },
  // globalData: { // 无效
  //   userInfo: null
  // },
  data() {
    return {
      globalData: {
        globalData: "globalData"
      }
    };
  },
  methods: {
    ...mapActions("login", [
      "wxlogin",
      "wxGetSetting",
      "wxGetUserInfo",
      "wxGetPhoneNumber"
    ]),
    redirectFunByParams(appQuery) {
      if (appQuery.from == "officialAccount") {
        if (!appQuery) {
          return;
        }
        // this.$root.$mp.query.from = '';
        // query.from = '';
        var pageName = appQuery.redirect;
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
          } = appQuery;
          //  dealer = dealer == 'undefined' || !dealer ? '' : dealer;
          //  time = time == 'undefined' || !time ? '' : time;
          //  desc = desc == 'undefined' || !desc ? '' : desc;
          url =
            "/pages/" +
            "trouble-package/" +
            pageName +
            "/main?from=officialAccount";
          url =
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
          appQuery.from = "";
          wx.navigateTo({
            url,
            success: res => {
              console.warn("redirectTo success", url, res);
            },
            fail: res => {
              console.warn("redirectTo fail", url, res);
            }
          });
        } else if (pageName == "assignment-detail") {
          url =
            "/pages/" +
            "assignment-package/" +
            pageName +
            "/main?from=officialAccount";
          url = url + "&workOrderId=" + appQuery.workOrderId;
          appQuery.from = "";
          wx.navigateTo({
            url,
            success: res => {
              console.warn("redirectTo success", url, res);
            },
            fail: res => {
              console.warn("redirectTo fail", url, res);
            }
          });
        } else if (pageName === "home") {
          wx.switchTab({ url: "/pages/index/main" });
        } else {
          // if(!appQuery.from){
          //   // wx.switchTab({ url: "/pages/index/main" });
          // }
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
          }
        }
      });
    },
    setLoginCode(isRedirect) {
      wx.setStorageSync("logcode", "");
      wx.login({
        success: res => {
          // this.$root.$mp.appOptions.experiment == 'true'
          this.getAuthSettingInfo(isRedirect);
          // wx.navigateTo({ url: '/pages/login-with-count/main' });
        }
      });
    },
    // 自动登录操作，根据后端传递的参数确定登录后的页面
    autoLogin(code) {
      console.log("autoLogin", code);
      this.$http(
        "weChatAutoLogin",
        { code },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            sessionId: ""
          }
        }
      )
        .then(res => {
          console.log("app mounted", res);
          var resData = res.data || {};

          // if(typeof resData === 'string'){
          //   wx.setStorageSync('sessionId', resData)
          //   wx.switchTab({url: '/pages/index/main'})
          // }else{
          //    wx.setStorageSync('sessionId', '')
          // }

          var { unionIdExistsKey, sessionId } = resData;
          var url = "/pages/index/main";
          var login = wx.getStorageSync("login");
          login.unionIdExistsKey = "";
          login.code = "";
          login.sessionId = "";
          login.login = false;
          // login.code = code
          console.log("unionIdExistsKey", unionIdExistsKey);
          console.log("sessionId", sessionId);
          if (sessionId) {
            login.login = true;
            login.sessionId = sessionId;
            wx.setStorageSync("sessionId", sessionId);
            wx.setStorageSync("login", login);

            this.$store.dispatch("setIsLogin", true);
            // wx.setStorageSync("isAutoLogin", true);
            this.setLoginCode(false);

            this.$store.dispatch("setUserPermissions", {
              permissions: res.data.permissions || []
            });
            // this.$store.dispatch('setAutoLogin', { isAutoLogin: false });
            //获取后端传递过来的页面信息
            var appQuery = this.$root.$mp.appOptions.query;
            // console.log("JSON.stringify appQuery", JSON.stringify(appQuery));
           
            //从公众号页面进入
            if (appQuery.from == "officialAccount") {
              // this.$root.$mp.query.from = '';
              // appQuery.from = '';
              var pageName = appQuery.redirect;

              //隐患详情页面
              if (pageName == "trouble-detail") {
                url =
                  "/pages/" +
                  "trouble-package/" +
                  pageName +
                  "/main?from=officialAccount";
                //跳转到相关页面
                wx.navigateTo({ url });
              } else if (pageName == "assignment-detail") {//任务详情
                url =
                  "/pages/" +
                  "assignment-package/" +
                  pageName +
                  "/main?from=officialAccount";
                wx.navigateTo({ url });
              } else if (pageName == "home") {//主页
                url = "/pages/index/main?from=officialAccount";
                appQuery.redirect = "";
                appQuery.from = "";
                wx.switchTab({ url });
              }
            } else {
              //生产环境，默认到首页
              if (process.env.NODE_ENV == "production") {
                wx.switchTab({ url });
              } else {
                
              }
            }
          } else if (unionIdExistsKey) {
            // 已拿到unionId 需要获取手机号 wx.getPhoneNumber (button open-type)
            login.unionIdExistsKey = unionIdExistsKey;
            wx.setStorageSync("login", login);
            // this.wxGetSetting().then(res => {
            //   // if (res.authSetting['scope.phoneNumber']) { // 由于微信没有获取手机号码的API，只能通过设置button 的开放能力， 让用户手动点击获取手机号码，故而当能获取到用户的unionId时，都转到login登陆页面
            //   //   // 调用 wx api 获取手机号
            //   // } else {
            //   //   url = '/pages/login/main';
            //   //   wx.redirectTo({ url });
            //   // }
            //   url = '/pages/login/main';
            //   wx.redirectTo({ url });
            // });

            // var url = "/pages/login/main";
            this.setLoginCode(false);

            wx.redirectTo({ url: "/pages/login/main" });
          } else {
            //    // wx.authorize({ scope: 'scope.phoneNumber' });
            // 注意：wx.authorize({scope: "scope.userInfo"})，无法弹出授权窗口，请使用 <button open-type="getUserInfo"/>
            // 没拿到 unionId 需要获取个人信息，手机号 调用 wx.getUserInfo  wx.getPhoneNumber (button open-type)
            // wx.setStorageSync('login', {login: false, unionIdExistsKey: '', sessionId:'',code,  showLoading: false})

            this.setLoginCode(true);
            wx.setStorageSync("login", login);

            // // url = '/pages/login/main'
            // url = '/pages/user-info/main';
            wx.redirectTo({ url: "/pages/user-info/main" });
          }
          // wx.redirectTo({ url });

          // wx.authorize({success: resed => {console.log(resed)}, scope:"scope.userInfo"});
          // scope.userInfo // wx.getUserInfo
          // scope.userLocation  // wx.getLocation wx.chooseLocation
          // scope.address // wx.chooseAddress
          // scope.phoneNumber // wx.phoneNumber
        })
        .catch(e => {
          console.log("weChatAutoLogin error", e);
        });
    },
    // getAuthSettingInfo() {
    //   this.wxGetSetting().then(res => {
    //     console.log('getAuthSettingInfo', res);
    //   });
    //   //   wx.getSetting({success:(settingInfo)=>{
    //   //   // 获取用户授权信息, 如果授权了获取用户信息则直接调用API获取用户信息
    //   //   // 如果没有则调用微信授权信用API
    //   //   // 如果用户拒绝则什么都不做，默认跳转到index页面
    //   //   if(settingInfo.authSetting['scope.userInfo']){
    //   //     wx.getUserInfo({success: (res)=>{
    //   //       console.log('wx.getUserInfo success res', res)
    //   //     }, fail: res=>{console.log('wx.getUserInfo fail res', res)}})
    //   //   }else{
    //   //     // wx.getUserInfo({success: (res)=>{
    //   //     //   console.log('wx.getUserInfo success res', res)
    //   //     // }, fail: res=>{console.log('wx.getUserInfo fail res', res)}})
    //   //   }
    //   //   console.log('wx.getSetting', settingInfo)
    //   // }
    //   // })
    // },
    login() {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // wx.setStorageSync('logcode', res.code)
          // console.log('wx.setStorageSync', wx.getStorageSync('logcode'))
          console.log("app login res", res);
          this.autoLogin(res.code);
        },
        fail: res => {
          console.log("login failed", res);
        }
      });
    },
    setInitData() {
      // try {
      //   wx.clearStorageSync();
      // } catch (e) {
      //   // Do something when catch error
      // }
      wx.setStorageSync("login", {
        login: false,
        sessionId: "",
        unionIdExistsKey: "",
        code: ""
      });
      wx.setStorageSync("logcode", "");
      wx.setStorageSync("sessionId", "");
      wx.setStorageSync("trouble", {});
    }
  },
  created() {
    console.log("app created");
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync("logs") || [];
    // logs.unshift(Date.now());
    this.setInitData();
    this.login();
  },
  mounted() {
    console.log("app mounted");
  }
};
</script>

<style lang="scss">
.container {
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  box-sizing: border-box;
  padding: 0px 12px 20px 12px;
  background: #f4f7fb;
  /* padding-bottom: 100px; */
  /* align-items: center; */
  /* justify-content: space-between; */
  /* padding: 0px 12px 100px 12px; */
}

/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
  font-family: PingFang-SC-Medium;
}
.hj--value {
  font-family: DIN-Regular;
}
.hj_home__div {
  margin-top: 10px;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  text-indent: 10px;
  border-radius: 10px;
  box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
}

.hj {
  &__loading {
    text-align: center;
    &__img {
      animation-name: hjrotate;
      animation-duration: 1s;
      animation-timing-function: linear;
      animation-delay: 0.5s;
      animation-iteration-count: infinite;
      animation-direction: normal;
      animation-play-state: running;
    }
  }
  &__to_top {
    position: fixed;
    bottom: 25px;
    right: 25px;
    z-index: 1;
    // background-color: rgba(0, 0, 0, 0.3);
    // border-radius: 50%;
    // background-image: url("../static/images/common/to-top-circle.png");
    background-image: url("./assets/images/common/to-top-circle.png");
    background-size: 34px 34px;
    background-repeat: no-repeat;
    width: 34px;
    height: 34px;
    // width: 48px;
    // height: 48px;
    text-align: center;
    &--hover {
    }
    &__btn {
      opacity: 0.6;
    }
  }
}

@keyframes hjrotate {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
radio{
  transform:scale(0.7);
}
</style>
