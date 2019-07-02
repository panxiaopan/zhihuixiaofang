<template>
  <div
    class="hj-search-com"
    :class="hjClass"
    :style="hjStyle"
    @click="click"
  >
    <div
      class="hj-search-com__content"
      :class="hjContentClass"
      :style="hjContentStyle"
    >
      <wux-icon
        type="ios-search"
        :size="searchIconSize"
        :color="searchIconColor"
      ></wux-icon>
      <!-- :focus="currentFocus" -->
      <input
        v-if="withInput"
        :class="placeholderClass"
        class="hj-search-com__content__placeholder"
        type="text"
        :placeholder="placeholder"
        v-model="currentValue"
        @focus="onFocus"
        @input="onInput"
        @change="onChange"
        @confirm="onConfirm"
      >
      <span
        v-if="!withInput"
        class="hj-search-com__content__placeholder"
        :class="placeholderClass"
      >
        {{displayContent}}
      </span>
      <span
        v-if="isShowClear"
        @click.stop="clear"
      >
        &nbsp;
        <wux-icon
          type="ios-close"
          color="#ccc"
        ></wux-icon>
        &nbsp;
      </span>
    </div>
    <div
      v-if="showPostfix"
      class="hj-search-com__postfix"
      :class="hjPostfixIconClass"
      :style="hjPostfixIconStyle"
      @click.stop="clickPostfix"
    >
      <span class="hj-search-com__postfix__icon">
        <wux-icon
          :type="postfixIcon"
          :size="postfixIconSize"
          :color="postfixIconColor"
        ></wux-icon>

      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: "searchCom",
  props: {
    value: {
      type: String,
      default: ""
    },
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    hjContentClass: {
      type: String,
      default: ""
    },
    hjContentStyle: {
      type: String,
      default: ""
    },
    hjPostfixIconClass: {
      type: String,
      default: ""
    },
    hjPostfixIconStyle: {
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
    // isShowClear: {
    //   type: Boolean,
    //   default: false
    // },
    searchIconSize: {
      type: Number,
      default: 22
    },
    searchIconColor: {
      type: String,
      default: "#ccc"
    },
    showPostfix: {
      type: Boolean,
      default: false
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
      default: "#6678e9"
    },
    withInput: {
      type: Boolean,
      default: false
    }
    // focus: {
    //   type: Boolean,
    //   default: false
    // }
    // searchIcon: {
    //   type: String,
    //   default: "../../static/images/common/search.png"
    // },
    // searchIconClass: {
    //   type: String,
    //   default: ""
    // }
  },
  data() {
    return {
      currentValue: ""
      // currentFocus: false
    };
  },
  computed: {
    displayContent() {
      if (!this.value) {
        return this.placeholder;
      } else {
        return this.value;
      }
    },
    isShowClear() {
      if (!this.withInput) {
        return !!(this.value + "");
      } else {
        return !!this.currentValue;
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (this.currentValue !== newVal) {
        this.currentValue = newVal;
      }
    }
    // focus(newVal, oldVal) {
    //   this.currentFocus = newVal;
    // }
  },
  methods: {
    onFocus(e) {
      console.log("focus", e);
      this.$emit("focus", e.mp.detail.value);
      if (e.mp.detail.value === "") {
        this.$emit("empty-value", "");
      }
    },
    onInput(e) {
      console.log("input", e);
      this.$emit("input", e.mp.detail.value);
      this.tempValue = e.mp.detail.value;
      this.debounceInput();
    },
    onChange(e) {
      console.log("change", e);
      this.$emit("change", e.mp.detail.value);
    },
    onConfirm(e) {
      console.log("confirm", e);
      this.$emit("confirm", e.mp.detail.value);
    },
    click(e) {
      this.$emit("iclick", e);
    },
    clear(e) {
      console.log("clear", e);
      this.$emit("empty-value", "");

      if (this.withInput) {
        this.currentValue = "";
        this.$emit("clear", e);
      } else {
        this.$emit("clear", e);
      }
    },
    clickPostfix(e) {
      console.log("clickPostfix", e);
      this.$emit("click-postfix", e);
    },
    debounceInput() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.$emit("debounce-input", this.tempValue);
        if (!this.tempValue) {
          this.$emit("empty-value", this.tempValue);
        }
      }, 300);
    }
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
.hj-search-com {
  width: 100%;
  // height: 30px;
  // background: rgba(255, 255, 255, 1);

  display: flex;
  align-items: center;
  // text-indent: 5rpx;
  padding-left: 10rpx;
  padding-right: 10rpx;
  box-sizing: border-box;

  &__content {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 13px 0px rgba(2, 25, 53, 0.14);
    border-radius: 27px;
    display: flex;
    height: 33px;
    flex-grow: 1;
    align-items: center;
    text-indent: 5rpx;
    margin-left: 10rpx;
    margin-right: 10rpx;
    &__placeholder {
      font-size: 16px;
      vertical-align: middle;
      flex-grow: 1;
      color: #ccc;
    }
  }
  &__postfix {
    width: 32px;

    // border: 3rpx solid #6678e9;
    // border-radius: 16px;
    text-align: center;
  }
}
</style>