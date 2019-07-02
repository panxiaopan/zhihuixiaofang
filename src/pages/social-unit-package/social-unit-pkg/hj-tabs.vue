<template>
  <div style="width: 100%;">
    <wux-tabs
      class="hj-social-unit-home__tabs"
      :theme="theme"
      :default-current="currentValue"
      :current="currentValue"
      :auto="auto"
      @change="changeTab"
    >
      <wux-tab
        v-for="t in tabs"
        :key="t.key"
        :title="t.title"
      ></wux-tab>
    </wux-tabs>
  </div>
</template>
<script>
import lodashGet from "lodash/get.js";
export default {
  name: "hj-tabs",
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "component" // store 依赖于 根 store的state相关的属性, component 依赖于组件自身
    },
    theme: {
      type: String,
      default: "royal" // 主题色，可选值为 light、stable、positive、calm、assertive、balanced、energized、royal、dark
    },
    statePathStr: {
      type: [String, Array],
      default: "socialUnit.tab"
    },
    value: {
      type: [String, Number],
      default: ""
    },
    tabs: {
      type: Array,
      default: function() {
        return [
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
        ];
      }
    }
  },
  data() {
    currentValue: "summary";
    // currentTabs: [
    //   {
    //     key: "summary",
    //     title: "概述"
    //   },
    //   {
    //     key: "device",
    //     title: "设备"
    //   },
    //   {
    //     key: "trouble",
    //     title: "隐患"
    //   },
    //   {
    //     key: "assignment",
    //     title: "工单"
    //   }
    // ];
  },
  computed: {
    storeTab() {
      var val = lodashGet(this.$store.state, this.statePathStr, "");
      console.log("computed storeTab", val);
      if (val) {
        return val;
      }
      return false;
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(newVal, oldVal) {
        console.log("value newVal", newVal);
        console.log("value oldVal", oldVal);
        console.log("value currentValue", this.currentValue);
        if (!!newVal) {
          if (this.currentValue !== newVal) {
            this.currentValue = newVal;
          }
        } else {
          if (Array.isArray(this.tabs) && this.tabs.length) {
            this.currentValue = this.tabs[0].key;
          }
        }
        console.log("value newVal", newVal);
        console.log("value oldVal", oldVal);
        console.log("value currentValue", this.currentValue);
      }
    },
    storeTab(newVal, oldVal) {
      console.log("watch storeTab out newVal oldVal ", newVal, oldVal);
      if (this.mode == "store" && !!newVal && this.currentValue != newVal) {
        this.currentValue = newVal;
        console.log("watch storeTab in ", this.currentValue);
      }
    }
    // tabs(newVal, oldVal) {
    //   if (newVal && newVal !== this.currentTabs) {
    //     this.currentTabs = newVal;
    //   }
    // }
  },
  methods: {
    changeTab(e) {
      console.log("changeTab", e);
      this.currentValue = e.mp.detail.key;
      console.log("changeTab currentValue", this.currentValue);
      if (this.mode == "store") {
        this.$store.dispatch("changeValByStatePath", {
          value: e.mp.detail.key,
          path: this.statePathStr
        });
      }
      if (this.mode == "component") {
        this.$emit("input", e.mp.detail.key);
      }
      this.$emit("change", e.mp.detail.key);
      console.log("this.storeTab", this.storeTab);
    }
  },
  mounted() {
    console.log("mounted hj-tabs", this.storeTab);
  }
};
</script>