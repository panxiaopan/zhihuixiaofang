<template>
  <scroll-view
    class="hj-refresh-upload-frame"
    scroll-y
    @scroll="scroll"
    @scrolltolower="scrolltolower"
  >
    <wux-refresher
      wux-class="hj-refresh-upload-frame__list-wrapper"
      class="hj-refresh-upload-frame__list-wrapper"
      v-if="isAuth"
      :id="refresherId"
      @pulling="onPulling"
      @refresh="onRefresh"
    >
      <slot>
      </slot>
      <i-load-more
        :loading="loading"
        :tip="tip"
      ></i-load-more>
    </wux-refresher>
  </scroll-view>
</template>
<script>
import isMounted from "@/mixins/isMounted.js";
import { $stopWuxRefresher } from "@/utils/wux.js";
export default {
  name: "hj-refresh-upload-frame",
  mixins: [isMounted],
  props: {
    list: {
      type: Array,
      default: () => []
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
      default: 10
    },
    refresherId: {
      type: String,
      default: "wux-refresher1"
    }
  },
  components: {
    // searchCom,
    // refreshUploadFrame
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
    }
  },
  watch: {},
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
    initData(params, cb) {
      if (!params) {
        return;
      }
      this.$http(this.url, params, {
        method: "get"
      })
        .then(res => {
          console.log(this.url, res);
          if (cb) {
            cb(res.data);
          } else {
            this.$emit("update-data", { data: res.data, notReload: false });
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
      this.params.start = 0;
      this.params.size = 20;
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
      this.$emit("update-data", { data: data, notReload: false });
      this.stopWuxRefresher();
    },
    setPushingData(res) {
      this.$emit("update-data", { data: data, notReload: true });
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
    console.log("refresh-upload-frame mounted", this);
    this.initData(this.params);
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
.hj-refresh-upload-frame {
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
}
</style>