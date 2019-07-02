export default {
  onPageScroll(e) {
    console.log("onPageScroll", e, this);
    if (this.debounceFun) {
      this.debounceFun(e);
    }
  },
  data() {
    return {
      scrollTop: 0,
      timer: null,
    }
  },
  methods: {
    actionFun(e) {
      // this.selectContainerStyle = "top: " + e + "px";
      console.log("actionFun scrollTop", e);
      this.scrollTop = e.scrollTop;
    },
    debounceFun(e) {
      console.log('debounceFun', e)
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.actionFun(e);
      }, 300);
    },
  },
  destroyed() {
    this.timer = null;
  },
}
