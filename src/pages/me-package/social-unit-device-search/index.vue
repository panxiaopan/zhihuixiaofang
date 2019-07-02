<template>
  <div class="hj-social-unit-device-search">
    <wux-search-bar
      v-if="!isShowMap"
      wux-class="hj-social-unit-device-search__search"
      class="hj-social-unit-device-search__search"
      :value="keyword"
      :auto="auto"
      :placeholder="placeholder"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      @clear="onClear"
      @cancel="onCancel"
    />
    <div style="height: 46px;"></div>
    <div
      v-if="isShowConveniencePanel"
      class="hj-social-unit-device-search__history"
    >
      <div class="hj-social-unit-device-search__history__hd">
        <div class="hj-social-unit-device-search__history__hd__label">
          历史搜索
        </div>
        <div
          class="hj-social-unit-device-search__history__hd__rubbish"
          @click.stop="clearHistory"
        >
          <wux-icon
            size="22"
            type="md-trash"
          ></wux-icon>
        </div>
      </div>
      <div
        v-if="searchList&&searchList.length"
        class="hj-social-unit-device-search__history__list"
      >
        <wux-tag
          wux-class="hj-social-unit-device-search__history__list__li"
          v-for="searchLi in searchList"
          :key="searchLi"
          @click.stop="clickHistoryWord(searchLi)"
        >
          {{searchLi}}
        </wux-tag>
      </div>
      <div v-else>
        暂无数据
      </div>
    </div>
    <div v-if="isShowMapSocialUnitPanel">
      <mapSocialUnitPanel
        v-for="li in list"
        :key="li.id"
        @iclick="clickSuggestList(li)"
        v-bind="li"
        :isShowPostfix="false"
      >
      </mapSocialUnitPanel>
      <div v-if="!list.length">
        暂无数据
      </div>
    </div>
    <div
      v-if="isShowDetailPanel"
      class="hj-social-unit-device-search__detail-list"
    >
      <socialUnitDevicePanelWithoutSwipeout
        hjStyle=""
        v-for="dtli in detailList"
        :key="dtli"
        v-bind="dtli"
        @iclick="clickList(dtli)"
      ></socialUnitDevicePanelWithoutSwipeout>
      <i-load-more
        :loading="loading"
        :tip="tip"
      ></i-load-more>
    </div>
  </div>
</template>
<script>
import mapSocialUnitPanel from "@/components/search-display-panel/map-social-unit-panel.vue";
// import hjSearchMapPanel from '@/components/map/hj-search-map-panel.vue'
import socialUnitDevicePanelWithoutSwipeout from "../components/social-unit-device-panel-without-swipeout.vue";
export default {
  onLoad() {
    console.log("onLoad", this);
  },
  onShow() {
    console.log("onShow", this);
  },
  onReady() {
    console.log("onReady", this);
    var searchList = wx.getStorageSync("socialUnitDeviceSearchList");
    console.log("wx.getStorageSync searchList", searchList);
    if (searchList && Array.isArray(searchList)) {
      this.searchList = searchList;
    }
    // this.searchList = ['华', '深圳', '广东省深圳市', '河南省','华', '深圳', '广东省深圳市', '河南省','华', '深圳', '广东省深圳市', '河南省','华', '深圳', '广东省深圳市', '河南省']
  },
  onHide() {
    console.log("onHide");
  },
  onUnload() {
    console.log("onunload");
    wx.setStorageSync("socialUnitDeviceSearchList", [...this.searchList]);
  },
  onReachBottom(e) {
    console.log("this.params", this.params);
    console.log("onReachBottom", e);
    if (this.isShowDetailPanel) {
      this.loading = true;
      if (this.size > this.total) {
        this.loading = false;
      } else {
        this.size += 10;
        this.queryData(
          { keyword: this.keyword, size: this.size },
          this.setDetailList
        );
      }
    }
  },
  name: "hj-search",
  components: {
    mapSocialUnitPanel,
    // socialUnitPanelWithoutSwipeout,
    socialUnitDevicePanelWithoutSwipeout
    // hjSearchMapPanel
  },
  data() {
    return {
      keyword: "",
      auto: false,
      isSearchingSuggest: false,
      placeholder: "search",
      // rubbishIcon: "../../static/images/common/rubbish.png",
      deafultParams: {},
      list: [],
      panel: "mapSocialUnitPanel",
      // isShowDetailPanel: false,
      detailList: [],
      searchList: [],
      loading: false,
      total: 10,
      size: 10,
      defaultUrl: "socialUnitsDeviceConfigById"
      // defaultPanel:
    };
  },
  computed: {
    isShowMapSocialUnitPanel() {
      return (
        !this.isShowConveniencePanel &&
        !this.detailList.length &&
        this.list.length
      );
    },
    isShowConveniencePanel() {
      if (!this.keyword) {
        return true;
      } else {
        return false;
      }
    },
    isShowDetailPanel() {
      return (
        !this.isShowConveniencePanel &&
        this.detailList.length &&
        !this.list.length
      );
    },
    tip() {
      console.log("tip total length", this.detailList.length, this.total);
      if (this.total == this.detailList.length) {
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
  methods: {
    clickHistoryWord(keyword) {
      this.queryData({ keyword });
    },
    clearHistory() {
      this.searchList = [];
    },
    deleteOneRecord(index) {
      this.searchList = this.searchList.filter((item, idx) => {
        return index != idx;
      });
    },
    onChange(e) {
      console.log("onChange", e);
      console.log("this.keyword", this.keyword);
      this.tempKeyword = e.mp.detail.value || "";
      this.debounceQueryData();
    },
    onFocus(e) {
      console.log("onFocus", e);
      console.log("this.keyword", this.keyword);
    },
    onBlur(e) {
      console.log("onBlur", e);
      console.log("this.keyword", this.keyword);
    },
    onConfirm(e) {
      console.log("onConfirm", e);
      console.log("this.keyword", this.keyword);
      if (!this.searchList.includes(this.keyword) && e.mp.detail.value) {
        this.searchList.push(e.mp.detail.value);
      }
      this.queryData({ keyword: e.mp.detail.value }, this.setDetailList);
    },
    onClear(e) {
      console.log("onClear", e);
      console.log("this.keyword", this.keyword);
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.keyword = "";
    },
    onCancel(e) {
      console.log("onCancel", e);
      console.log("this.keyword", this.keyword);
      wx.navigateBack({ delta: -1 });
    },
    debounceQueryData() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        var keyword = this.tempKeyword;
        if (this.isSearchingSuggest) {
          return;
        }
        this.queryData({ keyword });
      }, 1000);
    },

    queryData(params, cb) {
      // console.log("this queryData", this.keyword, params, cb);
      params.id = this.$root.$mp.query.id;
      if (!params.size) {
        this.total = 10;
        this.size = 10;
        console.warn("set total and size for 10", this.total, this.size);
      }

      if (!params.keyword) {
        this.keyword = "";
        return;
      }

      if (params.keyword == this.keyword && !cb) {
        return;
      }

      this.keyword = params.keyword;

      this.$http(this.url, params, { method: "get" })
        .then(res => {
          console.log(this.url + " res", res);
          if (cb) {
            cb(res.data);
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.timer = setTimeout(() => {
              this.isSearchingSuggest = false;
            }, 2000);
          } else {
            this.setData(this[this.process](res.data));
          }
        })
        .catch(e => {
          console.log("catch e", e);
        });
    },
    processData(data) {
      if (
        !data ||
        !data.rows ||
        !Array.isArray(data.rows) ||
        !data.rows.length
      ) {
        return false;
      }
      // return data.rows;
      return data.rows.map(item => {
        var address = "";
        try {
          var deviceData = JSON.parse(item.data);
          address = deviceData.location;
        } catch (e) {
          console.error("JSON parse failed");
        }

        return { name: item.name, address, id: item.id };
      });
    },
    setData(rows) {
      if (!rows) {
        return;
      }
      this.detailList = [];
      this.list = rows;
    },
    setDetailList(data) {
      this.total = data.total;
      this.setDetailData(this.processDetailData(data));
    },
    processDetailData(data) {
      console.log("processDetailData", data);
      if (
        !data ||
        !data.rows ||
        !Array.isArray(data.rows) ||
        !data.rows.length
      ) {
        return false;
      }
      return data.rows.map(item => {
        return this.processSocialUnitDataForPanel(item);
      });
    },
    processSocialUnitDataForPanel(item) {
      try {
        var deviceData = JSON.parse(item.data);
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
            }
          ],
          extra: item
        };
      } catch (e) {
        console.error(e);
        return {};
      }
    },
    setDetailData(list) {
      this.loading = false;
      if (!list) {
        return;
      }
      this.list = [];
      this.detailList = list;
    },
    clickSuggestList(li) {
      console.log("click", li);
      this.keyword = li.name;
      this.$nextTick(() => {
        wx.nextTick(() => {
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
          this.isSearchingSuggest = true;
          this.queryData({ keyword: li.name }, this.setDetailList);
        });
      });
    },
    clickList(dtli) {
      wx.setStorageSync("socialUnitDeviceSearchKeyword", dtli.extra.name);
      if (this.to) {
        wx.navigateTo({ url: "/pages/" + to + "/main" });
      } else {
        wx.navigateBack({ delta: -1 });
      }
    },
    setInitData() {
      this.loading = false;
      this.total = 10;
      this.size = 10;
      this.keyword = "";
      this.list = [];
      this.detailList = [];
      // this.isShowDetailPanel = false;
    }
  },
  created() {
    console.log("hj-search created");
  },
  mounted() {
    console.log("search-page mounted");
    // 多次跳转到该页面时，挂靠在this的属性值还是原先的值， mpvue页面的unload等函数并不能把该页面中this 实例中相关的属性值给清空。故而存在页面缓存的问题。
    this.setInitData();
    var query = this.$root.$mp.query;
    console.log("search-page query", query);
    // var url = query.url; // 搜索时查询的url
    // var from = query.from; // 从何处跳转到该搜索页面
    // var process = query.process; // 请求 url 后该使用哪个处理函数处理数据
    // var to = query.pagePath||''; // 点击搜索结构后跳转到哪个页面
    // var panel = query.panel  // 处理数据后以哪种面板展示数据

    // this.url = "socialUnitsDeviceConfigById";

    this.url =
      query.url && query.url != "undefined" ? query.url : this.defaultUrl; // socialUnitsDetailList socialUnitsConfig socialUnitsDeviceConfigById
    this.from = query.from && query.from != "undefined" ? query.from : "map";

    this.process =
      query.process && query.process != "undefined"
        ? query.process
        : "processData";

    this.to =
      query.pagePath && query.pagePath != "undefined" ? query.pagePath : "";

    // this.panel =
    //   query.panel && query.panel != "undefined"
    //     ? query.panel
    //     :  this.defaultPanel; // "mapSocialUnitPanel";

    var keyword =
      query.keyword && query.keyword != "undefined" ? query.keyword : "";
    if (keyword) {
      this.queryData({ keyword });
    }
    // else {
    //   this.queryData({keyword:''});
    // }
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.hj-social-unit-device-search {
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #f4f7fb;
  // padding: 10px;
  &__search {
    width: 100%;
    position: fixed;
  }
  &__history {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    &__hd {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      border-bottom: 1rpx solid #ddd;
      // padding:10px;
      // margin: 10px;
      &__label {
        flex-grow: 1;
        font-size: 15px;
      }
      &__rubbish {
        vertical-align: middle;
        font-size: 15px;
        padding: 5px;
      }
    }
    &__list {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      margin-top: 10px;
      flex-wrap: wrap;
      &__li {
        margin-left: 5px;
        margin-right: 5px;
        font-size: 22px;
        // padding:5px;
        // border:1rpx solid #ddd;
      }
    }
  }
  &__detail-list {
    padding: 10px;
    &__li {
      border-bottom: 1rpx solid #ddd;
    }
  }
}
</style>