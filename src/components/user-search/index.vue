<template>
  <div class="hj-user-search">
    <!-- :historySearchList="historySearchList" -->
    <!-- isFocus -->
    <search-list-frame
      ref="userSeachList"
      :list="list"
      :is-show-history-search-list="isShowHistorySearchList"
      :history-search-list="historySearchList"
      @change-data="changeData"
      @empty-value="emptyValue"
      @input="input"
      :defaultKeyword="defaultKeyword"
      @debounce-input="debounceInput"
      withInput
      :params="params"
      url="userNicknameAndTel"
      :isShowLoading="!isShowHistorySearchList"
    >
      <div
        v-if="isShowHistorySearchList"
        class="hj-user-search__history"
      >
        <div class="hj-user-search__history__hd">
          <div class="hj-user-search__history__hd__label">
            历史搜索
          </div>
          <div
            class="hj-user-search__history__hd__rubbish"
            @click.stop="clearHistory"
          >
            <wux-icon
              size="22"
              type="md-trash"
            ></wux-icon>
          </div>
        </div>
        <hjTags
          v-if="isShowHistorySearchList&&historySearchList&&historySearchList.length"
          hj-class="hj-user-search__history__list"
          :wux-class="'hj-user-search__history__list__li'"
          :history-search-list="historySearchList"
          @click-tag="clickHistoryWord"
        ></hjTags>
        <div v-if="isShowHistorySearchList&&(!historySearchList||!historySearchList.length)">
          暂无数据
        </div>
      </div>

      <!-- <div v-if="suggestList.length">
      <div v-for="suggestLi in suggestList" :key="suggestLi.id">
        {{suggestLi.name}} {{suggestLi.tel}}
      </div>
     </div> -->

      <div v-if="!isShowHistorySearchList&&list.length">
        <div
          class="hj-user-search__list"
          v-for="li in list"
          :key="li.id"
          @click.stop="clickList($event,li)"
          @longpress="longpress(li)"
        >
          <div class="hj-user-search__list__name">
            <wux-icon
              v-if="li.checked"
              type="md-checkmark"
              color="blue"
              size="22"
            >
            </wux-icon>
            {{li.name}}
          </div>
          <div class="hj-user-search__list__tel">
            {{li.tel}}
          </div>

        </div>
      </div>

    </search-list-frame>
    <div>

    </div>
  </div>
</template>
<script>
import isMounted from "@/mixins/isMounted.js";
import searchListFrame from "@/components/search-com/search-list-frame.vue";
import hjTags from "./hj-tags.vue";
export default {
  name: "hj-user-search",
  mixins: [isMounted],
  props: {
    wxStorageStr: {
      type: String,
      default: ""
    }
  },
  components: {
    searchListFrame,
    hjTags
  },
  data() {
    return {
      isAuth: true,

      // scoped: {
      //   isShowHistorySearchList: false,
      //   historySearchList: []
      // },
      isShowHistorySearchList: false,
      historySearchList: [],

      defaultKeyword: "",
      // isShowSuggestList: false,
      // suggestList: [],
      params: {
        keyword: "",
        size: 20
      },
      // isShowLoading: true,
      list: [
        {
          index: 0,
          name: "name",
          tel: "tel",
          id: "id"
        }
      ]
    };
  },
  methods: {
    clearHistory() {
      this.historySearchList = [];
      wx.setStorageSync(this.wxStorageStr, false);
    },
    clickHistoryWord(keyword) {
      // this.defaultKeyword = keyword;
      this.isShowHistorySearchList = false;

      this.params.keyword = keyword;
      this.$refs.userSeachList.initData();
      // this.queryData({ keyword });
    },
    changeData({ data, notReload }) {
      console.log("changeList", data);
      this.isShowHistorySearchList = false;
      if (
        this.params.keyword &&
        !this.historySearchList.includes(this.params.keyword)
      ) {
        this.historySearchList.push(this.params.keyword);

        // this.historySearchList = [
        //   ...this.historySearchList,
        //   this.params.keyword
        // ].map(item => item);

        wx.setStorageSync(this.wxStorageStr, [...this.historySearchList]);
      }
      if (!data) {
        return;
      }
      var list = this.processData(data.rows);
      // this.total = data.total || 0;
      console.log("list", list);
      console.log("this.historySearchList", this.historySearchList);
      if (!list) {
        return;
      }
      if (!notReload) {
        this.list = [];
      }
      this.$nextTick(() => {
        this.list = list;
      });
    },
    input(val) {
      console.log("user search input", val);
      if (val) {
        // this.isShowHistorySearchList = false;
      }
    },
    debounceInput(val) {},
    emptyValue(val) {
      console.log("emptyValue", val);
      this.isShowHistorySearchList = true;
      // this.scoped = {
      //   historySearchList: this.historySearchList.map(item => item),
      //   isShowHistorySearchList: true
      // };
      // console.log("this.scoped", this.scoped);
      console.log("this.historySearchList", this.historySearchList);
    },
    processData(data) {
      console.log("processData", data, this);
      if (!Array.isArray(data)) {
        return false;
      }

      return data.map(item => {
        item.checked = false;
        return item;
      });
    },
    clickLi(e, li) {
      console.log("clickli e li", e, li);
      // todo 跳转到 用户编辑页面
    },
    longpress(li) {
      li.checked = true;
    },
    clickList(e, li) {
      console.log("clickList", e, this, this.list);
      this.$emit("click-li", { li, e });
      // if (this.list.length < 29) {
      //   this.list = this.generateList();
      // } else if (this.list.length > 29 && this.list.length < 39) {
      //   this.list = [...this.list, ...this.generateList(10)];
      // } else if (this.list.length > 39) {
      //   this.list = [];
      //   this.$nextTick(() => {
      //     wx.nextTick(() => {
      //       this.list = this.generateList(this.list.length + 10);
      //     });
      //   });
      // }
    },
    generateList(length) {
      length = length || 40;
      return Array.apply(null, { length }).map((item, index) => {
        return {
          index,
          name: "name " + index,
          id: Math.random() * (index + 1),
          tel: parseInt(Math.random() * (index + 1) * Math.pow(10, 11))
        };
      });
    }
  },
  mounted() {
    if (this.wxStorageStr) {
      this.historySearchList = wx.getStorageSync(this.wxStorageStr) || [];
    }
    this.$refs.userSeachList.initData(this.params);
  }
};
</script>
<style lang="scss">
.hj-user-search {
  min-width: 100vw;
  min-height: 100vh;
  // background-color: #f4f7fb;
  &__list {
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
    }
    &__tel {
    }
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
}
</style>