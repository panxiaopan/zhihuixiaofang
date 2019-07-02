<template>
  <div
    class="hj-send-code-item"
    :class="hjClass"
    :style="hjStyle"
  >
    <label
      class="hj-send-code-item__item"
      :for="name"
    >
      <span
        class="hj-send-code-item__item__label"
        :style="labelWrapperSty"
      >
        <span
          class="hj-send-code-item__item__label__icon"
          v-if="required"
        >*</span>
        <span class="hj-send-code-item__item__label__label">
          {{label}}{{labelWithColon? ':' : ''}}
        </span>
      </span>

      <input
        class="hj-send-code-item__item__model"
        :name="name"
        :type="type"
        :value="currentValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @input="input"
        @change="change"
        @focus="focus"
        @blur="blur"
      >
      <button
        size="mini"
        :disabled="disabledBtn"
        @click.stop="send"
        style="flex-grow: 1;flex-shrink:0;"
      >{{text}}</button>
    </label>
  </div>
</template>
<script>
export default {
  name: "hj-send-code-item",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    labelWrapperSty: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: "验证码"
    },
    labelWithColon: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    placeholder: {
      type: String,
      default: "请输入验证码"
    },
    sendText: {
      type: String,
      default: "发送"
    },
    disabledSend: {
      type: Boolean,
      default: false
    }
    // url:{
    //   type: String,
    //   default: ''
    // },
    // params:{
    //   type: Object,
    //   default: null
    // }
  },
  data() {
    return {
      currentValue: "",
      count: 0,
      disabled: true
    };
  },
  computed: {
    text() {
      if (!this.count) {
        return this.sendText;
      } else {
        return this.count;
      }
    },
    disabledBtn() {
      if (this.disabledSend) {
        return true;
      }
      return !!this.count;
    }
  },
  methods: {
    input(e) {
      console.log("input", e);
      this.currentValue = e.mp.detail.value;
      this.$emit("hj-input", e.mp.detail.value);
    },
    change(e) {
      console.log("change", e);
      this.currentValue = e.mp.detail.value;
      this.$emit("hj-change", e.mp.detail.value);
    },
    focus(e) {
      console.log("focus", e);
      this.$emit("hj-focus", e);
    },
    blur(e) {
      console.log("blur", e);
      this.$emit("hj-blur", e);
    },
    resetSend() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.disabled = true;
      this.currentValue = "";
      this.count = 0;
    },
    send() {
      this.currentValue = "";
      this.$emit("hj-input", "");
      this.disabled = false;
      this.count = 60;
      this.discount();
      this.$emit("send");
    },
    discount() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      this.timer = setInterval(() => {
        if (this.count == 0) {
          clearInterval(this.timer);
          this.timer = null;
          return;
        }
        this.count--;
      }, 1000);
    },
    getVal() {
      console.log("this.currentValue", this.currentValue);
      return this.currentValue;
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.currentValue = newVal;
      }
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style lang="scss">
.hj-send-code-item {
  width: 100%;
  box-sizing: border-box;
  // border-bottom: 1rpx solid blue;
  border-bottom: 1rpx solid #ddd;
  &__item {
    // width: 100%;
    // display: inline-block;
    // width: 120px;
    display: flex;
    // margin-top: 20px;
    // border-bottom: 1rpx solid blue;
    padding-top: 10px;
    padding-bottom: 10px;
    align-items: center;

    &__label {
      margin-right: 5px;
      flex-basis: 70px; // 80px
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &__icon {
        font-size: 15px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(255, 0, 0, 1);
      }
      &__label {
        font-size: 15px;
        font-family: PingFang-SC-Medium;
        font-weight: Medium;
        color: #313131ff;
        flex-grow: 1;
        // text-align: center;
        // text-justify: inter-cluster;
      }
    }
    &__model {
      flex-grow: 1;
      font-size: 15px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(179, 178, 178, 1);
      line-height: 1.5;
    }
  }
}
</style>
