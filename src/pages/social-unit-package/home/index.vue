<template>
  <!-- 社会单位详情标签页 -->
  <div class="hj-social-unit-home">
    <wux-tabs
      class="hj-social-unit-home__tabs"
      wux-class="hj-social-unit-home__tabs"
      theme="royal"
      :default-current="tab"
      :current="tab"
      controlled='true'
      :auto="false"
      @change="changeTab"
    >
      <wux-tab v-for="t in tabs" :key="t.key">
        <!-- :title="t.title" -->
        <span style="font-size:32rpx;font-family:PingFang-SC-Bold;color:#313131;">{{t.title}}</span>
      </wux-tab>
    </wux-tabs>

    <div class="hj-social-unit-home__placeholder"></div>
    <hj-social-unit-summary ref="summary" v-if="tab=='summary'" v-bind="homeParams"></hj-social-unit-summary>

    <hjSocialUnitDevice ref="device" v-if="tab=='device'" v-bind="homeParams"></hjSocialUnitDevice>

    <hjSocialUnitTrouble ref="trouble" v-if="tab=='trouble'" v-bind="troubleParams"></hjSocialUnitTrouble>
    <hjSocialUnitAssignment v-if="tab=='assignment'" v-bind="homeParams" ref="assignment"></hjSocialUnitAssignment>

    <wux-white-space></wux-white-space>
  </div>
</template>
<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
//概述tab
import hjSocialUnitSummary from "../social-unit-pkg/hj-social-unit-summary.vue";
//设备tab
import hjSocialUnitDevice from "../social-unit-pkg/hj-social-unit-device.vue";
//隐患tab
import hjSocialUnitTrouble from "../social-unit-pkg/hj-social-unit-trouble.vue";
//工单tab
import hjSocialUnitAssignment from "../social-unit-pkg/hj-social-unit-assignment.vue";

export default {
  onShareAppMessage,

  name: "social-unit-home",
  components: {
    hjSocialUnitSummary,
    hjSocialUnitDevice,
    hjSocialUnitTrouble,
    hjSocialUnitAssignment
  },
  data() {
    return {
      tab: "summary",
      tabs: [
        {
          key: "summary",
          title: "概述"
        },
        {
          key: "device",
          title: "设备"
        },
        {
          key: "trouble",
          title: "隐患"
        },
        {
          key: "assignment",
          title: "工单"
        }
      ],
      summary: {},
      device: {},
      trouble: {},
      assignment: {},
      homeParams: { id: "", socialUnitName: "" }
    };
  },
  computed: {
    
    troubleParams() {
      return {
        id: this.homeParams.id,
        socialUnitName: this.homeParams.socialUnitName,
        isAuth: true,
        queryUrl: "socialUnitsRisks"
      };
    }
  },
  methods: {
    changeTab(e) {
      console.log("methods changeTab", e, e.mp.detail.key);
      this.tab = e.mp.detail.key;
    

      wx.nextTick(() => {
        this.$nextTick(() => {
          
          if (this.$refs[this.tab]) {
            this.$refs[this.tab].initData({ id: this.$mp.query.id });
          }
        });
      });
    },
    initData() {},
    mountedAction() {
      console.log(
        "social unit ",
        this,
        this.$root.$mp.page.route,
        this.$mp.page.route
      ); 
      // pages/social-unit-package/homes/main
      console.log("this.$root.$mp.page.query", this.$mp.query);
      if (this.$mp.query.name) {
        wx.setNavigationBarTitle({
          title: this.$mp.query.name
        });
        this.homeParams.socialUnitName = this.$mp.query.name;
        this.$mp.query.name = "";
      }
      if (this.$mp.query.currentTab) {
        this.tab = this.$mp.query.currentTab;
        this.$mp.query.currentTab = "";
      }

      if (this.$mp.query.id) {
        this.homeParams.id = this.$mp.query.id;
      }
      console.log("this.$refs[this.tab]", this.$refs[this.tab]);
      wx.nextTick(() => {
        this.$nextTick(() => {
          if (this.$refs[this.tab]) {
            this.$refs[this.tab].initData({ id: this.$mp.query.id });
          }
        });
      });

      // this.$nextTick(())
    }
  },
  mounted() {
    this.mountedAction();
  }
};
</script>
<style lang="scss">
.hj-rhombus-icon {
  display: inline-block;
  width: 11px;
  height: 11px;
  background-color: rgba(243, 134, 81, 1);
  transform: rotate(45deg);
}
.hj--title {
  width: 100%;
  text-indent: 10px;
  font-size: 16px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(49, 49, 49, 1);
}

.hj-social-unit-home {
  // padding: 0px 12px 45px 12px;
  background-color: #f4f7fb;
  font-family: PingFang-SC-Medium;
  // width: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: start;
  // width: 100wh;
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;
  &__placeholder {
    height: 44px;
  }
  &__tabs {
    width: 100%;
    position: fixed;
    z-index: 3;
    // margin-left: -12px;
    // margin-right: -12px;
    // padding-right: 12px;
  }
}
</style>
