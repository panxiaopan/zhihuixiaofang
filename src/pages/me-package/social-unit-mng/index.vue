<template>
  <div class="hj-social-unit-mng">

    <div
      v-if="!isAuth"
      style="height:100%;width:100%;position:relative: z-index:11111;"
    >暂无权限查看</div>

    <searchListFrame
      ref="socialUnitList"
      showPostfix
      url="socialUnitsConfig"
      :list="list"
      :params="params"
      searchIconColor="#ccc"
      postfixIconColor="#6677e9"
      @click-search-postfix="clickSearchPostfix"
      @click-search-bar="clickSearchBar"
      @change-data="changeData"
    >
      <!--  -->
      <div
        v-if="list.length"
        style="box-sizing: border-box;"
        @touchstart="touchstart"
      >
        <socialUnitPanel
          v-for="(li, index) in list"
          :key="li.id"
          v-bind="li"
          @longpress="longpress($event, li, index)"
          @iclick="clickSocialUnitPanel(li)"
        ></socialUnitPanel>
      </div>
    </searchListFrame>
    <!-- <userSearch
      v-if="showUserSearch"
      :hjStyle="userSearchStyle"
    ></userSearch> -->

    <wux-dialog id="wux-dialog" />
    <wux-dialog id="wux-dialog--alert" />
    <hjPopupList
      v-if="isShowPop"
      :list="popList"
      :hjStyle="popStyle"
      @change-action="changeAction"
    ></hjPopupList>
  </div>
</template>

<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import socialUnitPanel from "../components/social-unit-panel-with-swipeout.vue";
import md5 from "md5";
import { $wuxDialog } from "@/utils/wux.js";
import searchListFrame from "@/components/search-com/search-list-frame.vue";
import userSearch from "@/components/user-search/index.vue";
import isMounted from "@/mixins/isMounted.js";
import hjPopupList from "../components/hj-popup-list.vue";
import API from '@/store/flyio/apiUrl/home.js';
export default {
  onShareAppMessage,
  onShow() {
    this.isShowPop = false;
    console.log("onShow");
    console.log("this.isMounted", this.isMounted, this.$root.$mp.appOptions);
    console.log('onShow, fromPage', wx.getStorageSync("fromPage"))

    if (!this.isMounted) {
      return;
    }
    var fromPage = wx.getStorageSync("fromPage")
    if ( fromPage == "newFinish" || fromPage == 'edit-social-unit') {
      wx.setStorageSync("fromPage", "")
      this.$refs.socialUnitList.initData();
    }

    if (wx.getStorageSync("selectedUserIds")) {
      var selectedUserIds = wx.getStorageSync("selectedUserIds");
      this.transferSocialUnitToUser(selectedUserIds[0]);
      wx.setStorageSync("selectedUserIds", false);
    }
  },
  onHide() {
    this.isShowPop = false;
  },
  name: "hj-social-unit-mng",
  components: {
    socialUnitPanel,
    searchListFrame,
    userSearch,
    hjPopupList
  },
  mixins: [isMounted],
  data() {
    var actions = [
      {
        name: "删除",
        id: "delete",
        color: "#fff",
        fontsize: "20",
        width: 75,
        icon: "trash",
        background: "#E21918"
      },
      {
        name: "转移",
        id: "transfer",
        color: "#fff",
        fontsize: "20",
        width: 75,
        icon: "narrow",
        background: "#cac9cd"
      }
    ];
    return {
      isShowPop: false,
      selectedIndex: -1,
      selectedSocialUnitId: 0,
      popList: actions,
      popStyle: "",
      showUserSearch: true,
      userSearchStyle:
        "position: absolute;top:0;z-index:4;background: #f4f7fb;",
      // scoped: {actions},
      actions,
      deleteDeviceParams: {
        id: "",
        index: "",
        password: ""
      },
      transferParams: {
        socialUnitId: "",
        userId: "",
        password: ""
      },
      isAuth: true,
      params: {
        keyword: "",
        size: 20
      },
      list: []
    };
  },
  computed: {
    deleteSocialUnitAuth() {
      return (
        this.$store.state.userPermissionsMap &&
        this.$store.state.userPermissionsMap[
          "mp_mine_social_unit_device_manage_social_unit_delete"
        ]
      );
    },
    transferSocialUnitAuth() {
      return (
        this.$store.state.userPermissionsMap &&
        this.$store.state.userPermissionsMap[
          "mp_mine_social_unit_device_manage_social_unit_transfer"
        ]
      );
    }
  },
  methods: {
    touchstart(e) {
      console.log("touchstart", e);
      this.isShowPop = false;
    },
    changeData(params) {
      console.log("changeData", params);
      var { data, notReload } = params;
      console.log("changeData", data, notReload);
      var list = this.processData(data.rows);
      if (!list) {
        return;
      }

      // var copyList = [...list];
      // copyList.forEach(li => {
      //   li.id = (Math.random() * 1000).toFixed(3) + li.id;
      // });
      // list = [...list, ...copyList];

      if (!notReload) {
        this.list = [];
      }
      this.$nextTick(() => {
        this.list = list;
        console.log("list", list);
      });
    },
    processData(rows) {
      console.log("processData", rows, this);
      if (!Array.isArray(rows) || !rows.length) {
        return [];
      }
      return rows.map(row => {
        var {
          id,
          name: title,
          address: suffix,
          coverPicUrl,
          installedDate,
          manResponsibleForFireSecurity
        } = row;

        var leftImage = coverPicUrl
          ? API.requestDomain + coverPicUrl
          : undefined;
        // : "../../static/images/common/socialUnitSampleImg.jpg";
        var actions = [];
        var DELETE = 0;
        var TRANSFER = 1;
        if (!!this.deleteSocialUnitAuth) {
          actions.push({ ...this.actions[DELETE] });
        }

        if (row.ownerFlag || !!this.transferSocialUnitAuth) {
          actions.push({ ...this.actions[TRANSFER] });
        }

        return {
          id,
          title,
          suffix,
          leftImage,
          actions,
          contentList: [
            {
              label: "责任人",
              value: manResponsibleForFireSecurity.name
            },
            {
              label: "联系方式",
              value: manResponsibleForFireSecurity.tel
            },
            {
              label: "安装日期",
              value: installedDate
            }
          ],
          extra: row
        };
      });
    },
    longpress(e, li, index) {
      console.log("longpress", e, li);
      this.selectedIndex = index
      this.selectedSocialUnitId = li.id
      var x = e.x > 270 ? e.x - 80 : e.x;
      var y = e.y;

      this.popStyle = `position:absolute;left:${x}px;top:${y}px;`;
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.isShowPop = true;
        });
      });
    },
    changeAction(action) {
      console.log("changeAction action", action, this.popList);
      this.isShowPop = false;
      // e && e.stopPropagation();
      if (action.index == 0) {
        this.deleteAction();
      } else if (action.index == 1) {
        this.pickeUser();
      }
    },
    pickeUser() {
      // this.showUserSearch = true;
      // socialUnitId userId password
      this.transferParams.socialUnitId = this.selectedSocialUnitId;
      this.transferParams.index = this.selectedIndex;
      if (!this.password) {
        this.promtPickUser();
      } else {
        this.jumptoUserSearch();
      }
    },
    jumptoUserSearch() {
      // this.$root.$mp.appOptions.query.from = 'user-search'
      wx.navigateTo({
        url: "/pages/me-package/user-search/main"
      });
    },
    transferSocialUnitToUser(userId) {
      //  this.transferParams.userId = li.id;
      //  this.transferParams.socialUnitId
      //  this.transferParams.password = this.password;
      var { socialUnitId } = this.transferParams;
      var password = this.password;
      if (!userId) {
        console.log("userId is not exist");
        return;
      }
      this.$http(
        "transferSocialUnits",
        {
          userId,
          socialUnitId,
          password
        },
        {
          method: "put"
        }
      )
        .then(res => {
          console.log("transferSocialUnits success", res);
          if (res.head.code == 11002) {
            // 密码不正确
            this.password = "";
            return;
          }
          var index = this.transferParams.index;
          this.total = this.total - 1;
          var list = this.list.filter((item, idx) => {
            if (idx == index) {
              return false;
            } else {
              return true;
            }
          });
          this.list = list;
        })
        .catch(res => {
          console.log("transferSocialUnits fail", res);
          if (res.head.code == 11002) {
            // 密码不正确
            this.password = "";
          }
          if (res.head.msg) {
            this.$store.dispatch("showToast", { title: res.head.msg });
          }
        });
    },
    promtPickUser() {
      $wuxDialog("#wux-dialog", this.$root.$mp.page).prompt({
        resetOnClose: true,
        title: "身份确认",
        content: "请输入密码",
        fieldtype: "string",
        password: !0,
        defaultText: "",
        placeholder: "请输入密码",
        maxlength: 16,
        onConfirm: (e, response) => {
          console.log("onConfirm", e, response);
          this.password = md5(response);
          this.jumptoUserSearch();
        }
      });
    },
    deleteAction(li, index) {
      this.deleteDeviceParams.id = this.selectedSocialUnitId;
      this.deleteDeviceParams.index = this.selectedIndex;
      if (!this.password) {
        this.prompt();
      } else {
        wx.showModal({
          title: "是否删除该社会单位",
          content: "请谨慎删除",
          success: res => {
            console.log("showModal success", res);
            if (res.confirm) {
              this.deleteSocialUnit();
            }
          },
          fail: res => {
            console.log("showModal fail", res);
          }
        });
      }
    },
    deleteSocialUnit() {
      console.log('deleteSocialUnit', this.deleteDeviceParams)
      var { id } = this.deleteDeviceParams;
      var password = this.password;
      console.log('deleteSocialUnit,id=', id, 'password=', password)
      if (!id || !password) {
        console.error("params is error");
        return;
      }
      this.$http(
        "socialUnitsDetail",
        { id, password },
        {
          method: "delete",
          headers: {
            "content-type": "application/json; charset=UTF-8"
          }
        },
        null,
        true
      )
        .then(res => {
          if (res.head.code == 11002) {
            // 密码不正确
            this.password = "";
            return;
          }

          var index = this.deleteDeviceParams.index;
          this.total = this.total - 1;
          var list = this.list.filter((item, idx) => {
            if (idx == index) {
              return false;
            } else {
              return true;
            }
          });
          this.list = list;
        })
        .catch(res => {
          console.error("delete social unit fail", res);
          // if(res.head.code==11002){
          //   // 密码不正确
          // }
          this.password = "";
        });
    },
    prompt() {
      $wuxDialog("#wux-dialog", this.$root.$mp.page).prompt({
        resetOnClose: true,
        title: "身份确认",
        content: "请输入密码",
        fieldtype: "string",
        password: !0,
        defaultText: "",
        placeholder: "请输入密码",
        maxlength: 16,
        onConfirm: (e, response) => {
          console.log("onConfirm", e, response);
          this.password = md5(response);
          this.deleteSocialUnit();
        }
      });
    },
    clickSocialUnitPanel(li) {
      console.log("click-panel li", li);
      this.$root.$mp.appOptions.query.from = "socialUnitMng";
      wx.navigateTo({
        url: "/pages/me-package/edit-social-unit/main?id=" + li.id
        // + "&name=" + li.title
      });
    },
    clickSearchBar() {
      this.isShowPop = false;
      // wx.navigateTo({
      //   url:
      //     "/pages/search/main?url=socialUnitsConfig&from=socialUnitMng&process=processData&to=&panel=mapSocialUnitPanel"
      // });

      wx.navigateTo({
        url: "/pages/me-package/social-unit-search/main"
      });
    },
    clickSearchPostfix(e) {
      this.isShowPop = false;
      console.log("clickSearchPostfix", e);
      this.$root.$mp.appOptions.query.from = "socialUnitMng";
      wx.setStorageSync("isReset", true);
      this.$nextTick(() => {
        wx.nextTick(() => {
          wx.navigateTo({ url: "/pages/me-package/new-social-unit/main" });
        });
      });
    }
  },
  created() {},
  mounted() {
    console.log("social-unit-mng mounted", this.isMounted);
    this.$refs.socialUnitList.initData(this.params);
  }
};
</script>

<style lang="scss">
.hj-social-unit-mng {
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #f4f7fb;
  &__search {
    position: fixed;
    z-index: 3;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: rgba(255, 255, 255, 1);
    border-bottom: 1px solid #ddd;
    &__content {
      background-color: #f4f7fb;
    }
  }
  &__list-wrapper {
    width: 100vw;
    height: 100%;
  }
}
.i-swipeout-demo-item {
  width: 100%;
}
</style>
