<template>
  <scroll-view
    class="hj-user-search"
    :hjClass="hjClass"
    :hjStyle="hjStyle"
    scroll-y
    @scroll="scroll"
    @scrolltolower="scrolltolower"
  >
    <!-- :focus=isFocus -->
    <searchCom
      ref="searchCom"
      :hjClass="hjSearchClass"
      :hjStyle="hjSearchStyle"
      :hjContentClass="hjSearchContentClass"
      :hjContentStyle="hjSearchContentStyle"
      :hjPostfixIconClass="hjPostfixIconClass"
      :placeholderClass="placeholderClass"
      :placeholder="placeholder"
      :searchIconSize="searchIconSize"
      :searchIconColor="searchIconColor"
      :hjPostfixIconStyle="hjPostfixIconStyle"
      :postfixIcon="postfixIcon"
      :postfixIconSize="postfixIconSize"
      :postfixIconColor="postfixIconColor"
      :showPostfix="showPostfix"
      :withInput="withInput"
      :value="keyword"
      @focus="focus"
      @empty-value="emptyValue"
      @input="input"
      @change="change"
      @confirm="confirm"
      @iclick="clickSearchBar"
      @click-postfix="clickSearchPostfix"
      @clear="clear"
      @debounce-input="debounceInput"
    ></searchCom>
    <div :style="placeholdDivStyle"></div>
    <wux-refresher
      wux-class="hj-user-search__refresher"
      class="hj-user-search__refresher"
      v-if="isAuth"
      :id="refresherId"
      @pulling="onPulling"
      @refresh="onRefresh"
    >
      <slot>
      </slot>
      <i-load-more
        v-if="isShowLoading"
        :loading="loading"
        :tip="tip"
      ></i-load-more>
    </wux-refresher>
  </scroll-view>
</template>
<script>
import isMounted from "@/mixins/isMounted.js";
import searchCom from "@/components/search-com/index.vue";
import { $stopWuxRefresher } from "@/utils/wux.js";
export default {
  name: "hj-user-search",
  mixins: [isMounted],
  props: {
    // 样式相关属性 start
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    // 样式相关属性 end
    // 搜索相关属性 start
    hjSearchClass: {
      type: String,
      default: "hj-user-search__search"
    },
    hjSearchStyle: {
      type: String,
      default: ""
    },
    hjSearchContentClass: {
      type: String,
      default: "hj-user-search__search__content"
    },
    hjSearchContentStyle: {
      type: String,
      default: ""
    },
    hjPostfixIconClass: {
      type: String,
      default: ""
    },
    placeholderClass: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "搜索"
    },
    searchIconSize: {
      type: Number,
      default: 22
    },
    searchIconColor: {
      type: String,
      default: ""
    },
    hjPostfixIconStyle: {
      type: String,
      default: ""
    },
    postfixIcon: {
      type: String,
      default: "md-add-circle-outline"
    },
    postfixIconSize: {
      type: String,
      default: 32
    },
    postfixIconColor: {
      type: String,
      default: "#6677e9"
    },
    showPostfix: {
      type: Boolean,
      default: false
    },
    withInput: {
      type: Boolean,
      default: false
    },
    defaultKeyword: {
      type: String,
      default: ""
    },
    // 搜索相关属性 end
    // 刷新加载相关属性 start

    list: {
      type: Array,
      default: () => []
    },
    isShowHistorySearchList: {
      type: Boolean,
      default: false
    },
    historySearchList: {
      type: Array,
      default: () => []
    },
    scoped: {
      type: Object,
      default: () => ({})
    },
    url: {
      type: String,
      default: "users"
    },
    params: {
      type: Object,
      default: () => ({
        keyword: "",
        size: 20
      })
    },
    topDistance: {
      type: Number,
      default: 55
    },
    refresherId: {
      type: String,
      default: "wux-refresher1"
    },
    // 刷新加载相关属性 end
    // initData function 相关属性
    requestHead: {
      type: Object,
      default: {
        method: "get"
      }
    },
    flyConfig: {
      type: Object,
      default: null
    },
    isAspend: {
      type: Boolean,
      default: false
    },
    // exd
    // isFocus: {
    //   type: Boolean,
    //   default: false
    // }
    isShowLoading: {
      type: Boolean,
      default: true
    }
  },
  components: {
    searchCom
  },
  data() {
    return {
      isAuth: true,
      keyword: "",

      total: 0,
      scrollTop: 0,
      loading: false
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
    },
    placeholdDivStyle() {
      return "height: " + this.topDistance + "px";
    }
  },
  watch: {
    defaultKeyword: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal !== this.keyword) {
          this.keyword = newVal;
        }
      }
    }
  },
  methods: {
    scroll(e) {
      console.log("scroll view scroll", e);
      if (this.debounceFun) {
        this.debounceFun(e);
      }
    },
    scrolltolower(e) {
      console.log("this.params", this.params);
      console.log("onReachBottom", e);
      this.loading = true;
      if (this.params.size > this.total) {
        this.loading = false;
      } else {
        this.params.size += 10;
        this.initData(this.params, this.setPushingData);
      }
    },
    focus(val) {
      this.$emit("focus", val);
    },
    input(val) {
      console.log("user-mng input", val, this.keyword);
      this.$emit("input", val);
      // if (val === "") {
      //   this.$emit("empty-value", val);
      // }
    },
    emptyValue(val) {
      console.log("emptyValue", val);
      this.$emit("empty-value", val);
    },
    change(val) {
      console.log("user-mng change", val, this.keyword);
      this.$emit("change", val);
      this.keyword = val;
    },
    confirm(val) {
      console.log("user-mng confirm", val, this.keyword);
      this.$emit("confirm-search", val);
      this.params.size = 10;
      this.params.keyword = val;
      this.initData(this.params);
    },
    clickSearchBar(e) {
      this.$emit("click-search-bar", e);
    },
    clickSearchPostfix(e) {
      this.$emit("click-search-postfix", e);
    },
    clear(e) {
      this.keyword = "";
      this.$emit("clear", e);
    },
    debounceInput(val) {
      // this.params.keyword = val;
      // this.initData(this.params);
      this.$emit("debounce-input", val);
    },
    initData(params, cb, notInitByBlankKeyword) {
      params = params || this.params;
      console.log('initData, ',  params, notInitByBlankKeyword)
      if (notInitByBlankKeyword && !params.keyword) {
        return;
      }
      // if (!params) {
      //   return;
      // }
      console.log('initData, http, ', this.url,
        params,
        this.requestHead,
        this.flyConfig,
        this.isAspend)

      this.$http(
        this.url,
        params,
        this.requestHead,
        this.flyConfig,
        this.isAspend
      )
        .then(res => {
          console.log(this.url, res);
          if (cb) {
            cb(res.data);
          } else {
            this.total = res.data.total || 0;
            this.$emit("change-data", {
              data: res.data,
              notReload: false
              // keyword: this.params.keyword
            });
          }
        })
        .catch(res => {
          console.log("catch" + this.url, res);
        });
    },
    onPulling(e) {
      console.log("e", e);
    },
    onRefresh(e) {
      console.log("e", e);
      console.log("onRefresh", e);
      if (this.scrollTop <= this.topDistance) {
        this.initData(this.params, this.setPullingData);
      } else {
        this.stopWuxRefresher();
      }
    },
    stopWuxRefresher() {
      $stopWuxRefresher("#" + this.refresherId, this.$root.$mp.page);
    },
    setPullingData(data) {
      this.total = data.total || 0;
      this.$emit("change-data", {
        data: data,
        notReload: false
        // keyword: this.params.keyword
      });
      this.stopWuxRefresher();
    },
    setPushingData(res) {
      console.log("setPushingData", res);
      this.total = res.total || 0;
      this.$emit("change-data", {
        data: res,
        notReload: true
        // keyword: this.params.keyword
      });
      this.loading = false;
    },
    actionFun() {
      this.scrollTop = this.tempScrollTop;
    },
    debounceFun(e) {
      console.log("debounceFun", e);

      this.tempScrollTop = e.mp.detail.scrollTop;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.actionFun();
      }, 300);
    }
  },
  mounted() {
    // console.log("user-search mounted", this);
    // this.initData(this.params);
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang="scss">
.hj-user-search {
  width: 100vw;
  height: 100vh;
  background-color: #f4f7fb;
  &__search {
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #f4f7fb;
    position: fixed;
    z-index: 2;
    &__content {
    }
  }
  &__refresher {
    width: 100%;
  }
}
</style>