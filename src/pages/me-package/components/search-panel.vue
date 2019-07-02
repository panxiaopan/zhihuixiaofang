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
      <span
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
      default: "#6677e9"
    }
    // searchIcon: {
    //   type: String,
    //   default: "../../static/images/common/search.png"
    // },
    // searchIconClass: {
    //   type: String,
    //   default: ""
    // }
  },
  computed: {
    displayContent() {
      console.log("displayContent", this.value, this.placeholder);
      if (!this.value) {
        return this.placeholder;
      } else {
        return this.value;
      }
    },
    isShowClear() {
      return !!(this.value + "");
    }
  },
  methods: {
    click(e) {
      this.$emit("iclick", e);
    },
    clear(e) {
      console.log("clear", e);
      this.$emit("clear");
    },
    clickPostfix(e) {
      console.log("clickPostfix", e);
      this.$emit("click-postfix", e);
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
      color: #ccc;
      flex-grow: 1;
    }
  }
  &__postfix {
    width: 32px;

    // border: 3rpx solid #6677e9;
    // border-radius: 16px;
    text-align: center;
  }
}
</style>