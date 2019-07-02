import {
  $stopWuxRefresher
} from "@/utils/wux.js";
export default function ({
  processData,
  urlStr,
  topDistance,
  params,
  refresherId,
  validateBeforeInit
}) {
  refresherId = refresherId || 'wux-refresher1';
  params = params || {
    keyword: '',
    size: 10
  }
  if (!processData) {
    console.error('processData is must be needed')
    return

  }
  // topDistance = topDistance || 
  return {
    onPageScroll(e) {
      console.log("onPageScroll", e, this);
      if (this.debounceFun) {
        this.debounceFun(e);
      }
    },
    onReachBottom(e) {
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
    data() {
      return {
        params,
        list: [],
        total: 0,
        scrollTop: 0,
        loading: false,
      };
    },
    methods: {
      processData,
      initData(params, cb) {
        if (!params) {
          return;
        }
        // if (this.validateBeforeInit) {
        //   if (!validateBeforeInit.call(this, params)) {
        //     return
        //   }
        // }
        this.$http(urlStr, params, {
            method: "get"
          })
          .then(res => {
            console.log(urlStr, res);
            if (cb) {
              cb(res.data);
            } else {
              this.setData(res.data);
            }
          })
          .catch(res => {
            console.log("catch" + urlStr, res);
          });
      },
      setData(data, notReload) {
        console.log("setData", data);
        if (!data) {
          return;
        }
        var list = this.processData(data);
        this.total = data.total || 0;
        if (!list) {
          return;
        }
        if (!notReload) {
          this.list = [];
        }
        this.$nextTick(() => {
          this.list = list;
          console.log("list", list);
        });
      },
      onPulling(e) {
        console.log("e", e);
      },
      onRefresh(e) {
        console.log("e", e);
        console.log("onRefresh", e);
        if (this.scrollTop <= topDistance) {
          this.initData(this.params, this.setPullingData);
        } else {
          this.stopWuxRefresher();
        }
      },
      stopWuxRefresher() {
        $stopWuxRefresher("#" + refresherId, this.$root.$mp.page);
      },
      setPullingData(data) {
        this.setData(data);
        this.stopWuxRefresher();
      },
      setPushingData(res) {
        // 记住scrolltop的位置
        this.setData(res.data, true);
        this.loading = false;
      },
      actionFun() {
        // this.selectContainerStyle = "top: " + e + "px";
        // console.log("actionFun scrollTop", e);
        this.scrollTop = this.tempScrollTop;
      },
      debounceFun(e) {
        console.log('debounceFun', e)
        this.tempScrollTop = e.scrollTop;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.actionFun();
        }, 300);
      },
    },
    destroyed() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  }
}
