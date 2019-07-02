<template>
  <div class="hj-social-unit-device-mng">
    <!-- @touchstart="touchstart" -->
    <!-- @touchend="touchend" -->
    <searchPanel
      hjClass="hj-social-unit-device-mng__search"
      showPostfix
      @iclick="click"
      :value="keyword"
      @clear="clear"
      @click-postfix="addSocialUnitsDevice"
    ></searchPanel>
    <wux-dialog id="wux-dialog"/>
    <wux-dialog id="wux-dialog--alert"/>
    <scroll-view class="hj-social-unit-device-mng__content" scroll-y>
      <div v-if="list.length" @touchstart="touchstart">
        <socialUnitDevicePanelWithSwipeout
          v-for="(li, index) in list"
          :key="li.id"
          v-bind="li"
          @iclick="clickPanel(li)"
          @longpress="longpress($event, li, index)"
        ></socialUnitDevicePanelWithSwipeout>
      </div>
    </scroll-view>
    <hjPopupList v-if="isShowPop" :list="popList" :hjStyle="popStyle" @change-action="changeAction"></hjPopupList>
  </div>
</template>
<script>
import searchPanel from "./search-panel.vue";
import socialUnitDevicePanelWithSwipeout from "./social-unit-device-panel-with-swipeout.vue";
import md5 from "md5";
import { $wuxDialog } from "@/utils/wux.js";
import hjPopupList from "../components/hj-popup-list.vue";

export default {
  onShow() {
    console.log("social-unit-device-mng onShow");
    console.log("this.isMounted", this.isMounted);
    this.setShowPop(false);
    if (this.isMounted) {
      var socialUnitDeviceSearchKeyword = wx.getStorageSync(
        "socialUnitDeviceSearchKeyword"
      );
      this.params.id = this.$root.$mp.query.id;
      if (socialUnitDeviceSearchKeyword) {
        // this.params.keyword = socialUnitDeviceSearchKeyword;
        this.keyword = socialUnitDeviceSearchKeyword;
        wx.getStorageSync("socialUnitDeviceSearchKeyword", false);
      }
      // else {
      //   this.keyword = "";
      // }

      if (
        this.$root.$mp.appOptions.query.from == "newSocialUnitDevice" ||
        this.$root.$mp.appOptions.query.from == "socialUnitMng"
      ) {
        this.keyword = "";
        this.params.start = 0;
        this.params.size = 10;
      }

      // if(this.$root.$mp.appOptions.query.from == 'editSocialUnitDevice'){
      // }

      if (this.$root.$mp.appOptions.query.from) {
        this.$root.$mp.appOptions.query.from = "";
      }

      this.initData(this.params);
    }
  },
  onHide() {
    this.setShowPop(false);
  },
  name: "social-unit-device-mng",
  components: {
    searchPanel,
    socialUnitDevicePanelWithSwipeout,
    hjPopupList
  },
  data() {
    return {
      popIndex: 0,
      isShowPop: false,
      popList: [
        {
          name: "删除",
          id: "delete",
          color: "#fff",
          fontsize: "20",
          width: 50,
          icon: "trash",
          background: "#E21918"
        }
      ],
      popStyle: "",
      isMounted: false,
      list: [],
      total: 0,
      keyword: "",
      params: {
        id: "",
        keyword: "",
        start: 0,
        size: 10
      },
      deleteDeviceParams: {
        id: "",
        deviceId: "",
        password: "",
        index: "--"
      }
    };
  },
  methods: {
    setShowPop(bool) {
      this.isShowPop = bool;
    },
    clear() {
      this.setShowPop(false);
      this.keyword = "";
      this.initData(this.params);
    },
    clickPanel(li) {
      console.log(
        "clickPanel",
        li,
        "this.params.id",
        this.params.id,
        "deviceId",
        li.id
      );
      console.log("设备类型");
      console.log(li.extra.data.deviceClassId);

      //点击当前设备编辑的时候传过去设备的型号,根据型号判断
      wx.setStorageSync("socialUnitDeviceInfo", { ...li.extra });

      wx.navigateTo({
        url:
          "/pages/me-package/edit-social-unit-device/main?id=" +
          this.params.id +
          "&deviceId=" +
          li.id +
          "&deviceName=" +
          li.extra.name +
          "&devicetype=" +
          li.extra.data.deviceClassId
      });
    },
    touchstart(e) {
      this.setShowPop(false);
    },
    click() {
      this.setShowPop(false);
      wx.navigateTo({
        url:
          "/pages/me-package/social-unit-device-search/main?id=" +
          this.params.id
      });
    },
    addSocialUnitsDevice(e) {
      console.log("addSocialUnitsDevice", e);
      this.setShowPop(false);
      wx.navigateTo({
        url:
          "/pages/me-package/new-social-unit-device/main?id=" + this.params.id
      });
      // this.list = this.generateRandomData();
      // this.list = [];
      // this.$nextTick(() => {
      //   wx.nextTick(()=>{
      //     this.list = this.generateRandomData();
      //   })
      // });
    },
    prompt() {
      // const alert = content => {
      //   $wuxDialog("#wux-dialog--alert", this.$root.$mp.page).alert({
      //     resetOnClose: true,
      //     title: "提示",
      //     content: content
      //   });
      // };

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
          this.deleteDeviceParams.password = md5(response);
          this.deleteDevice();
          // const content =
          //   response.length === 8
          //     ? `Wi-Fi密码到手了: ${response}`
          //     : `请输入正确的Wi-Fi密码`;
          // alert(content);
        }
      });
    },
    deleteLiByIndex(index) {
      if (isNaN(index)) {
        console.error("index is not correct");
        return;
      }
      var list = this.list.filter((item, idx) => {
        if (idx == index) {
          return false;
        } else {
          return true;
        }
      });
      this.list = list;
    },
    longpress(e, li, index) {
      console.log("longpress 2", e, li);

      // this.popIndex = index;
      // this.popList = li.actions;

      this.deleteDeviceParams.index = index;
      this.deleteDeviceParams.deviceId = li.id;
      this.deleteDeviceParams.id = this.params.id;
      var x = e.x > 270 ? e.x - 80 : e.x;
      var y = e.y;
      x = x - 5;
      y = y - 63;
      this.popStyle = `position:absolute;left:${x}px;top:${y}px;`;
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.isShowPop = true;
        });
      });
    },
    changeAction(action) {
      console.log("changeAction action", action.index);
      this.isShowPop = false;
      // this.deleteDeviceParams.index = this.popIndex;
      // this.deleteDeviceParams.deviceId = this.popList.id;
      // this.deleteDeviceParams.id = this.params.id;

      if (!this.deleteDeviceParams.password) {
        this.prompt();
        // wx.showModal({
        //   title: "title",
        //   content: "<input>",
        //   success: res => {
        //     console.log("showModal success", res);
        //     if (res.confirm) {
        //       this.deleteDevice(li);
        //     }
        //   },
        //   fail: res => {
        //     console.log("showModal fail", res);
        //   }
        // });
      } else {
        wx.showModal({
          title: "确认删除？",
          content: "确认删除该设备吗？",
          success: res => {
            console.log("showModal success", res);
            if (res.confirm) {
              this.deleteDevice();
            }
          },
          fail: res => {
            console.log("showModal fail", res);
          }
        });
      }
    },
    deleteDevice() {
      // var params = {
      //   id: this.params.id,
      //   deviceId: li.id,
      //   password: md5(this.password)
      // };
      var { id, deviceId, password } = this.deleteDeviceParams;
      if (!id || !deviceId || !password) {
        console.error("params is error");
        return;
      }
      var params = { id, deviceId, password };
      this.$http(
        "deleteSocialUnitsDevice",
        params,
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
          console.log("deleteSocialUnitsDevice sucess", res);
          if (res.head.code == 11002) {
            // 密码不正确
            this.deleteDeviceParams.password = "";
            return;
          }
          this.deleteLiByIndex(this.deleteDeviceParams.index);
        })
        .catch(res => {
          console.log("deleteSocialUnitsDevice catch e", res);
          // if(res.head.code==11002){
          //   // 密码不正确
          // }
          this.deleteDeviceParams.password = "";
        });
    },
    processData(data) {
      // res.data[0]
      // data // deviceTypeId
      //      // commId
      //      // deviceClassId
      //      // location
      //      // latitude
      //      // longitude
      //      // mainCircuitCurrent
      //      // brandName
      //      // typeName
      //      // dtuTag
      //      // deviceBandId
      // id
      // name
      // parentId
      // subNodes []
      if (
        !data ||
        !data.rows ||
        !Array.isArray(data.rows) ||
        !data.rows.length
      ) {
        return false;
      }
      // if (!data || !Array.isArray(data) || !data.length) {
      //   return [];
      // }

      return data.rows.map(item => {
        try {
          var deviceData = JSON.parse(item.data);
          item.data = deviceData;
          return {
            id: item.id,
            contentList: [
              {
                // id: "id1",
                label: "设备名称",
                value: item.name
              },
              {
                // id: "id2",
                label: "设备位置",
                value: deviceData.location
              },
              {
                // id: "id0",
                label: "注册码",
                value: deviceData.dtuTag
              },
              {
                label: '设备类型',
                value: deviceData.deviceClassName
              }
            ],
            extra: item
          };
        } catch (e) {
          console.error(e);
        }
      });
    },
    generateRandomData(length) {
      if (!length) {
        length = parseInt(Math.random() * 10 + 5);
      }
      return Array.apply(null, { length }).map(() => {
        return {
          id: (Math.random() * 1000).toFixed(2),
          contentList: [
            {
              // id: "id1",
              label: "设备名称",
              value: +(Math.random() * 1000).toFixed(8)
            },
            {
              // id: "id2",
              label: "设备位置",
              value: +(Math.random() * 1000).toFixed(8)
            },
            {
              // id: "id0",
              label: "注册码",
              value: (Math.random() * 1000).toFixed(16)
            }
          ],
          extra: {}
        };
      });
    },
    initData(params) {
      params.keyword = this.keyword;
      if (!params.id) {
        return console.error("params id must be exist");
      }
      this.$http("socialUnitsDeviceConfigById", params, { method: "get" })
        .then(res => {
          console.log("socialUnitsDeviceConfigById success", res);
          this.total = res.data.total;
          this.setData(this.processData(res.data));
          console.log("generateRandomData");
          // this.list = this.generateRandomData(
          //   this.params.start + this.params.size
          // );
          // this.$refs.socialUnitForm.setData(data)
        })
        .catch(res => {
          console.log("socialUnitsDeviceConfigById catch", res);
        });
    },
    setData(list) {
      this.list = list;
    },
    queryData() {},
    init() {
      var query = this.$root.$mp.query;
      // query.id = query.id || 1;
      // query.keyword = query.keyword;
      console.log("edit-social-unit-form query", query);
      this.params.id = query.id;
      this.initData(this.params);
    }
  },
  mounted() {
    console.log("this.isMounted", this.isMounted);
    this.isMounted = true;
    this.init();
  }
};
</script>
<style lang="scss">
.hj-social-unit-device-mng {
  margin-top: 15px;
  margin-left: -10px;
  margin-right: -10px;
  box-sizing: border-box;
  position: relative;
  &__search {
    // width: 100%;
    // position: fixed;
    // z-index: 3;
    margin-bottom: 5px;
  }
  &__content {
    height: calc(100vh - 50px - 63px);
    // padding: 10px;
    box-sizing: border-box;
  }
}
</style>