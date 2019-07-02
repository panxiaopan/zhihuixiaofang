<template>
  <div class="hj-user-mng">
    <searchCom
      showPostfix
      hjClass="hj-user-mng__search"
      hjContentClass="hj-user-mng__search__content"
      @click-postfix="addUser"
      :withInput="true"
      :value="keyword"
      @input="input"
      @change="change"
      @confirm="confirm"
    ></searchCom>
    <div style="height: 56px"></div>
    <div
      v-if="!isAuth"
      style="height:100%;width:100%;position:relative: z-index:11111;"
    >暂无权限查看</div>
    <wux-refresher
      wux-class="hj-user-mng__list-wrapper"
      class="hj-user-mng__list-wrapper"
      v-if="isAuth"
      id="wux-refresher1"
      @pulling="onPulling"
      @refresh="onRefresh"
    >
      <div v-if="list.length">
        <div
          class="hj-user-mng__list-wrapper__li"
          v-for="li in list"
          :key="li.id"
          @click.stop="clickLi(li)"
        >
          <div class="hj-user-mng__list-wrapper__li__name">
            {{li.name}}
          </div>
          <div class="hj-user-mng__list-wrapper__li__tel">
            {{li.tel}}
          </div>
        </div>
      </div>
      <i-load-more
        :loading="loading"
        :tip="tip"
      ></i-load-more>
    </wux-refresher>
  </div>
</template>
<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import isMounted from "@/mixins/isMounted.js";
import searchCom from "@/components/search-com/index.vue";
import generatePullDownFreshAndPushLoadMoreObj from "@/utils/generatePullDownFreshAndPushLoadMoreObj.js";
var freshLoadMore = generatePullDownFreshAndPushLoadMoreObj({
  processData(data) {
    console.log("processData", data);
    this.total = data.total;
    return data.rows;
  },
  urlStr: "userNicknameAndTel",
  topDistance: 60,
  params: {
    keyword: "",
    size: 20
  },
  refresherId: "wux-refresher1"
});
export default {
  onShareAppMessage,
  onShow() {
    if (wx.getStorageSync("addNewUser")) {
      wx.setStorageSync("addNewUser", false);
      this.params.keyword = "";
      this.initData(this.params);
    }
    if (wx.getStorageSync("editUser")) {
      wx.setStorageSync("editUser", false);
      this.initData(this.params);
    }
  },
  name: "hj-user-mng",
  mixins: [freshLoadMore, isMounted],
  components: {
    searchCom
  },
  data() {
    return {
      isAuth: true,
      keyword: ""
    };
  },
  computed: {
    tip() {
      console.log("tip total length", this.list.length, this.total);
      if (this.total == this.list.length) {
        if (this.total != 0) {
          return "已全部加载完毕";
        } else {
          return "暂无数据";
        }
      } else {
        return "加载中";
      }
    }
  },
  watch: {},
  methods: {
    // jumpToSearchPage(e) {
    //   console.log("jumpToSearchPage", e);
    // },
    addUser(e) {
      console.log("addUser", e);
      console.log("this.keyword", this.keyword);
      // todo 跳转到添加用户页面

      wx.navigateTo({ url: "/pages/user-mng-package/new-user/main" });
    },
    input(val) {
      console.log("user-mng input", val, this.keyword);
    },
    change(val) {
      console.log("user-mng change", val, this.keyword);
      this.keyword = val;
    },
    confirm(val) {
      console.log("user-mng confirm", val, this.keyword);
      this.params.size = 10;
      this.params.keyword = val;
      this.initData(this.params);
    },
    clickLi(li) {
      // todo 跳转到 用户编辑页面
      // id	number	用户id
      // name	string	用户昵称
      // tel	string	用户电话
      // userType	string	用户类型，user->终端用户，maintainer->运维人员
      wx.navigateTo({
        url:
          "/pages/user-mng-package/edit-user/main?userId=" + li.id 
          // +
          // "&name=" +
          // li.name +
          // "&tel=" +
          // li.tel +
          // "&userType=" +
          // li.userType
      });
    }
  },
  beforeCreate() {},

  created() {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo();
  },
  mounted() {
    // wx.navigateTo({ url: "/pages/map/main" });
    this.initData(this.params);
  }
};
</script>
<style lang="scss">
.hj-user-mng {
  min-width: 100vw;
  min-height: 100vh;
  background-color: #f4f7fb;
  &__search {
    padding-top: 10px;
    padding-bottom: 10px;
    background: #f4f7fb;
    position: fixed;
    z-index: 2;
    &__content {
    }
  }
  &__list-wrapper {
    width: 100%;
    &__li {
      padding: 10px;
      font-size: 15px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(49, 49, 49, 1);
      line-height: 2;
      border-bottom: 1rpx solid #cecece;
      display: flex;
      justify-content: space-between;
      &__name {
        // font-size: 15px;
        // font-family: PingFang-SC-Medium;
        // font-weight: 500;
        // color: rgba(49, 49, 49, 1);
      }
      &__tel {
        // font-size: 15px;
        // font-family: PingFang-SC-Medium;
        // font-weight: 500;
        // color: rgba(49, 49, 49, 1);
      }
    }
  }
}
</style>