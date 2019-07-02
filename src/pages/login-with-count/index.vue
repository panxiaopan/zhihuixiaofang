<template>
  <div class="hj-login-with-count">
    <bgBox
      :scopedInfo="scopedInfo"
      contentBoxClass="hj-login-with-count__content-box-class"
    >
      <loginWithCountInput @errortip="showTip"></loginWithCountInput>
    </bgBox>
    <!-- <wux-wing-blank size="large" style="width:100%;">
      <wux-row gutter=0>
        <wux-col span=2>
          账号：
        </wux-col>
        <wux-col span=10>
          <input class="hj-login-with-count__input" v-model.lazy="username" type="text" placeholder="登录名/绑定手机/绑定邮箱">
        </wux-col>
      </wux-row>
      <wux-white-space size="large"></wux-white-space>
      <wux-row>
        <wux-col span=2>
          密码：
        </wux-col>
        <wux-col span=10>
          <input class="hj-login-with-count__input" v-model.lazy="password" type="text" placeholder="请输入密码">
        </wux-col>
      </wux-row>
      <wux-white-space size="large"></wux-white-space>
      <button @click="login">登录</button>
    </wux-wing-blank> -->

    <wux-toptips id="wux-toptips1" />
  </div>
</template>
<script>
import bgBox from "@/components/login/bg-box.vue";
import loginWithCountInput from "@/components/login/login-with-count-input.vue";
import { $wuxToptips } from "@/utils/wux.js";
// import md5 from 'md5';
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
export default {
  onShareAppMessage,
  name: "loginWithCount",
  components: {
    bgBox,
    loginWithCountInput
  },
  // data() {
  //   return {
  //     scopedInfo: {
  //       username: '',
  //       password: ''
  //     },
  //     username: '',
  //     password: ''
  //   };
  // },
  // methods: {
  //   onUsernameInput(e) {
  //     console.log('onUsernameInput', e);
  //   },
  //   onPasswordInput(e) {
  //     console.log('onPasswordInput', e);
  //   },
  //   onUsernameChange(e) {
  //     console.log('onUsernameChange', e);
  //   },
  //   onPasswordChange(e) {
  //     console.log('onPasswordChange', e);
  //   },
  //   loginAndBindToWeChat(params = {}) {
  //     console.log(
  //       'getStorageSync sessionId',
  //       wx.getStorageSync('login').sessionId
  //     );
  //     // this.$http('loginAndBindToWeChat', params)().then(res=>{
  //     var url = this.$root.$mp.query.switchCount
  //       ? 'loginAndBindToWeChat'
  //       : 'loginAndBindToWeChat';
  //     this.$http(url, params, {
  //       headers: {
  //         sessionId: ''
  //       }
  //     })
  //       .then(res => {
  //         // debugger;
  //         wx.setStorageSync('sessionId', res.data);
  //         wx.switchTab({ url: '/pages/index/main' });
  //         // 绑定后当
  //         // 系统后台无此号码的账户，code等于几的时候，为体验账户，设置全局 storage  isTry变量，
  //         console.log('loginAndBindToWeChat', res);
  //       })
  //       .catch(e => {
  //         // if (!this.$wuxToptips) {
  //         //   this.$wuxToptips = $wuxToptips(
  //         //     '#wux-toptips1',
  //         //     this.$root.$mp.page
  //         //   );
  //         // }
  //         this.$wuxToptips.error({
  //           text: e.head.msg,
  //           duration: 3000
  //         });

  //         //  wx.redirectTo({ url: '/pages/user-info/main?experiment=true' });
  //         console.log('loginAndBindToWeChat e', e);
  //       });
  //   },
  //   validate(scopedInfo) {
  //     // if (!this.$wuxToptips) {
  //     //   this.$wuxToptips = $wuxToptips('#wux-toptips1', this.$root.$mp.page);
  //     // }
  //     if (!scopedInfo.username) {
  //       this.$wuxToptips &&
  //         this.$wuxToptips.error({
  //           text: '请输入登录名',
  //           duration: 3000
  //         });
  //       return false;
  //     }
  //     if (!scopedInfo.password) {
  //       this.$wuxToptips &&
  //         this.$wuxToptips.error({
  //           text: '请输入密码',
  //           duration: 3000
  //         });
  //       return false;
  //     }
  //     return true;
  //   },
  //   timeoutLogin(e) {
  //     setTimeout(() => {
  //       this.$nextTick(() => {
  //         wx.nextTick(() => {
  //           this.login(e);
  //         });
  //       });
  //     }, 300);
  //   },
  //   login(e) {
  //     // console.log(this.username, this.password);
  //     console.log('login with count', e, this.scopedInfo);
  //     if (!this.validate(this.scopedInfo)) {
  //       // if (!this.validate(this)) {
  //       return;
  //     }
  //     var loginObj = wx.getStorageSync('login');
  //     console.log('loginObj', loginObj);

  //     // var phoneNumberObj = e.mp.detail;
  //     var params = {};
  //     // this.scopedInfo
  //     // params.username = this.username;
  //     // params.password = md5(this.password);
  //     params.username = this.scopedInfo.username;
  //     params.password = md5(this.scopedInfo.password);
  //     console.log('params.password', params.password);
  //     console.log('loginObj', loginObj.code, loginObj);
  //     console.log('getStorageSync logcode', wx.getStorageSync('logcode'));
  //     params.code = wx.getStorageSync('logcode');

  //     // params.phoneEncryptedData = phoneNumberObj.encryptedData;
  //     // params.phoneIv = phoneNumberObj.iv;

  //     if (loginObj.unionIdExistsKey) {
  //       params.unionIdExistsKey = loginObj.unionIdExistsKey;
  //     } else {
  //       params.userInfoEncryptedData = loginObj.encryptedData;
  //       params.userInfoIv = loginObj.iv;
  //     }

  //     console.log('params', params);
  //     this.loginAndBindToWeChat(params);
  //   },
  //   initTooltip() {
  //     if (!this.$wuxToptips) {
  //       this.$wuxToptips = $wuxToptips('#wux-toptips1', this.$root.$mp.page);
  //     }
  //   }
  // },
  methods: {
    initTooltip() {
      if (!this.$wuxToptips) {
        this.$wuxToptips = $wuxToptips("#wux-toptips1", this.$root.$mp.page);
      }
    },
    showTip(msg) {
      this.$wuxToptips.error({
        text: msg,
        duration: 3000
      });
    }
  },

  mounted() {
    console.log("loginWithCount mounted", this.$root.$mp.query);
    this.initTooltip();
  }
};
</script>
<style lang='scss'>
.hj-login-with-count {
  min-width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #f4f7fb;
  &__content-box-class {
    padding-top: 20px;
    padding-bottom: 10px;
  }
  // &__content__box {
  //   height: 100%;
  //   width: 100%;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: space-around;
  //   justify-content: space-around;
  // }
  // &__input {
  //   width: 100%;
  //   border-bottom: 1rpx solid rgba(102, 120, 233, 1);
  //   margin-bottom: 10px;
  //   font-size: 14px;
  //   font-family: PingFang-SC-Medium;
  //   font-weight: 500;
  //   color: rgba(163, 163, 163, 1);
  // }
  // &__login {
  //   width: 100%;
  //   color: #fff;
  //   background-color: rgba(102, 120, 233, 1);
  // }
}
</style>