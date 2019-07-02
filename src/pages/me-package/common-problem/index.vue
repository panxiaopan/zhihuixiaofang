<template>
  <div class="hj-common-problem">
    <h3>
      安全用电云小程序快速入门
    </h3>

    <hjAccordionGroup
      v-bind="group1"
      @click-icon="click"
    ></hjAccordionGroup>

    <hjAccordionGroup
      v-bind="group2"
      @click-icon="click"
    ></hjAccordionGroup>

    <hjAccordionGroup
      v-bind="group3"
      @click-icon="click"
    ></hjAccordionGroup>
  </div>
</template>

<script>
// https://www.huajiecloud.com/efm-mp/common-problem.html
// https://www.huajiecloud.com/static/index.html
// http://www.huajiecloud.com/static/efm-mp/index.html
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import hjAccordionGroup from "@/components/hj-accordion-group/index.vue";
export default {
  onShareAppMessage,
  onShow() {
    if (wx.getStorageSync("appIsHide")) {
      wx.setStorageSync("appIsHide", false);
      return;
    }
  },
  components: {
    hjAccordionGroup
  },
  data() {
    return {
      // src: "../../../../static/main-index.html"
      // src: "./main-index.html",
      group1: {
        groupTitle: "【使用须知】",
        contentList: [
          {
            title: "1.如何登陆小程序",
            content:
              "  首先需要通过微信搜索并添加”安全用电云小程序，然后授予用户信息进行登录(手机号或账号登录).详情请用力戳右侧视频",
            vid: "x0854l5fctb"
          }
        ]
      },
      group2: {
        groupTitle: "【安装实施快速入门】",
        contentList: [
          {
            title: "1. 小程序使用步骤",
            content:
              "  登录安全用电小程后,首先添加社会单位和设备,确认添加成功并查看数据后,根据需要为业主等添加用户账号,然后将添加的社会单位和设备转移给用户,最后由用户账号登录并查看单位和设备的信息。详情请用力戳右侧视频",
            vid: "g0854qfg8i1"
          },
          {
            title: "2. 添加社会单位",
            content:
              "  进入小程序,点击我的菜单，再点击社会单位管理，点击搜索栏右侧添加按钮，填写社会单位基本信息即可。详情请用力戳右侧视频",
            vid: "q0854kht0ii"
          },
          {
            title: "3. 添加设备",
            content:
              "  进入小程序,点击我的菜单,再点击社会单位管理，搜索或选择社会单位,点击设备管理页,点击搜索栏添加按钮，填写设备信息即可。详情请用力戳右侧视频",
            vid: "y0854g93xvm"
          },
          {
            title: "4. 添加用户",
            content:
              "  进入小程序，点击我的菜单，进入用户管理模块，点击搜索栏右侧添加按钮，填写新用户手机号码和密码信息即可。详情请用力戳右侧视频",
            vid: "b0854ap4shd"
          },
          {
            title: "5. 社会单位转移",
            content:
              "  进入小程序，点击我的菜单，再点击社会单位管理，搜索或选择社会单位，向左侧滑动，点击转移即可。详情请用力戳右侧视频",
            vid: "w0854bx09m6"
          }
        ]
      },
      group3: {
        groupTitle: "【详细介绍】",
        contentList: [
          {
            title: "1. 小程序详细介绍",
            content: "  全面了解小程序功能,用力戳右侧视频,手把手教你",
            vid: "n0854zbgsty"
          }
        ]
      }
    };
  },
  methods: {
    click(content) {
      console.log("click content", content);
      wx.navigateTo({
        url: "/pages/display-video/main?vid=" + content.vid
      });
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.hj-common-problem {
  width: 100vw;
  height: 100vh;
  background: rgba(244, 247, 254, 1);
  padding: 10px;
  box-sizing: border-box;
}
</style>
