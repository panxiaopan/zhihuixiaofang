<template>
  <div
    class="hj-form-items"
    :class="hjClass"
    :style="hjStyle"
  >
    <label
      class="hj-form-items__item"
      :for="name"
    >
      <div class="hj-form-items__item__label">
        <span
          class="hj-form-items__item__label__icon"
          v-if="required"
        >*</span>
        <span class="hj-form-items__item__label__label">
          {{label}}
        </span>
      </div>
      <div
        class="hj-form-items__item__input"
        v-if="formType=='input'"
      >
        <input
          :name="name"
          class="hj-form-items__item__input__model"
          :type="type"
          :password="password"
          :value="currentValue"
          @input="input"
          @change="change"
          :placeholder="placeholder"
        >
        <div
          v-if="currentValue"
          class="hj-form-items__item__input__clear"
          @click.stop="clear"
        >
          &nbsp;
          <wux-icon
            type="md-close"
            size="22"
          ></wux-icon>
          &nbsp;
        </div>
      </div>
      <div
        class="hj-form-items__item__switch"
        v-if="formType=='switch'"
      >
        <switch
          :name="name"
          :checked="currentValue"
          :type="type"
          @change="changeSwitch"
          :color="color"
        />
      </div>
    </label>
  </div>
</template>
<script>
// import schema from "async-validator";
export default {
  name: "hj-form-items",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    formType: {
      type: String,
      default: "input"
    },
    color: {
      type: String,
      default: "#886aea"
    },
    placeholder: {
      type: String,
      default: "placeholder"
    },
    required: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "text"
    },
    password: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: "label"
    },
    name: {
      type: String,
      default: "name"
    },
    value: {
      type: [String, Object, Number],
      default: ""
    }
    // descriptor: {
    //   type: Object,
    //   require: true,
    //   default: () => ({
    //     type: "string",
    //     message: ""
    //   })
    // }
  },
  data() {
    return {
      currentValue: ""
    };
  },
  watch: {
    value: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.currentValue = newVal;
      }
    }
  },
  methods: {
    input(e) {
      this.currentValue = e.mp.detail.value;
      this.$emit("hj-input", e.mp.detail.value);
    },
    change(e) {
      this.currentValue = e.mp.detail.value;
      this.$emit("hj-change", e.mp.detail.value);
    },
    changeSwitch(e) {
      console.log("changeSwitch", e);
      this.currentValue = e.mp.detail.value;
      this.$emit("hj-change", e.mp.detail.value);
    },
    clear(e) {
      this.currentValue = "";
      this.$emit("hj-clear", "");
    },
    validate() {},
    getVal() {
      return this.currentValue;
    }
  },
  mounted() {
    // console.log("form-item mounted", this.$props, this);
  }
};
</script>
<style lang="scss">
.hj-form-items {
  width: 100%;
  box-sizing: border-box;
  // border-bottom: 1rpx solid blue;
  border-bottom: 1rpx solid #ddd;
  &__item {
    width: 100%;
    display: flex;
    // margin-top: 20px;
    // border-bottom: 1rpx solid blue;
    padding-top: 10px;
    padding-bottom: 10px;
    align-items: center;

    &__label {
      margin-right: 5px;
      flex-basis: 110px;
      display: flex;
      justify-content: space-between;
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
        text-align: center;
        // text-justify: inter-cluster;
      }
    }
    &__input {
      margin-left: 5px;
      flex-grow: 1;
      display: flex;
      width: 100%;
      font-size: 15px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(179, 178, 178, 1);
      line-height: 1.5;

      &__model {
        flex-grow: 1;
        font-size: 15px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(179, 178, 178, 1);
        line-height: 1.5;
      }
      &__clear {
        font-size: 15px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(179, 178, 178, 1);
        line-height: 1.5;
      }
    }
    &__switch {
      margin-left: 5px;
      flex-grow: 1;
      display: flex;
      // text-align: right;
      justify-content: flex-end;
    }
  }
}
</style>