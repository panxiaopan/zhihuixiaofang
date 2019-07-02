<template>
  <div
    class="hj-form-item"
    :class="hjClass"
    :style="hjStyle"
  >
    <label
      class="hj-form-item__item"
      :class="orientationClass"
      :for="name"
    >
      <div
        class="hj-form-item__item__label"
        :style="labelWrapperSty"
      >
        <span
          class="hj-form-item__item__label__icon"
          v-if="required"
        >*</span>
        <span class="hj-form-item__item__label__label">
          {{label}}{{labelWithColon? ':' : ''}}
        </span>
      </div>
      <div
        class="hj-form-item__item__input"
        v-if="formType=='input'"
      >
        <input
          :name="name"
          class="hj-form-item__item__input__model"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :password="password"
          :value="currentValue"
          @input="input"
          @change="change"
          @focus="focus"
          @blur="blur"
        >
        <div
          v-if="currentValue"
          class="hj-form-item__item__input__clear"
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
        class="hj-form-item__item__switch"
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
      <div
        class="hj-form-item__item__picker"
        v-if="formType=='picker'"
      >
        <picker
          class="hj-form-item__item__picker__model"
          :name="name"
          :mode="pickerMode"
          :range="pickerRange"
          :range-key="pickerRangeKey"
          v-model="currentValue"
          :disabled="disabled"
          @change="change"
          @cancel="cancelPick"
        >
          <div class="hj-form-item__item__picker__display">
            {{pickerDisplayStr}}
            <wux-icon
              class="hj-form-item__item__picker__display__icon"
              type="ios-arrow-forward"
              color="#ccc"
              size="22"
            ></wux-icon>
          </div>
        </picker>
      </div>
      <div
        v-if="formType=='inputNumber'"
        class="hj-form-item__item__input-number"
      >
        <div class="hj-form-item__item__input-number__wrapper">
          <wux-icon
            class="hj-form-item__item__input-number__wrapper__subs"
            type="ios-remove-circle"
            size="22"
            :color="inputNumberColor"
            @click.stop="substruct"
          ></wux-icon>
          <input
            class="hj-form-item__item__input-number__wrapper__model"
            :name="name"
            type="digit"
            :disabled="disabled"
            :placeholder="placeholder"
            v-model="currentValue"
            @input="input"
            @change="change"
            @focus="focus"
            @blur="blur"
          >
          <wux-icon
            class="hj-form-item__item__input-number__wrapper__add"
            type="ios-add-circle"
            size="22"
            :color="inputNumberColor"
            @click.stop="add"
          ></wux-icon>
        </div>
        <!-- 
        <wux-input-number
          v-model="currentValue"
          :disabled="disabled"
          :color="color"
          :auto="auto"
          :min="min"
          :max="max"
          :step="step"
          :longpress="longpress"
          :shape="shape"
          @change="change"
          @focus="focus"
          @blur="blur"
        ></wux-input-number> -->

      </div>
    </label>
  </div>
</template>
<script>
// import schema from "async-validator";
// const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
export default {
  model: {
    prop: "modelval",
    event: "hj-change"
  },
  name: "hj-form-item",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    orientation: {
      type: String,
      default: "horizon" // 'vertical'
    },
    labelWidth: {
      type: Number,
      default: 0
    },
    labelWithColon: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: "input" // switch  picker inputNumber
    },
    color: {
      type: String,
      default: "#886aea"
    },
    disabled: {
      type: Boolean,
      default: false
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
    },
    pickerMode: {
      type: String,
      default: "selector"
    },
    pickerRange: {
      type: String,
      default: () => [] // [{name: 'name', id: ''}]
    },
    pickerRangeKey: {
      type: String,
      default: "name"
    },
    pickerRangeId: {
      type: String,
      default: "id"
    },
    modelval: {
      type: [String, Object, Number],
      default: ""
    },
    longpress: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: "square" //  circle、square
    },
    step: {
      type: Number,
      default: 1
    },
    auto: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: -(Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1)
    },
    max: {
      type: Number,
      default: +(Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1)
    }
    // isAutoValidate: {
    //   type: Boolean,
    //   default: false
    // },
    // descriptor: {
    //   type: Object,
    //   default: () => null // ({ type: "string",  message: ""})
    // }
  },
  computed: {
    orientationClass() {
      return "hj-form-item--" + this.orientation;
    },
    labelWrapperSty() {
      if (this.orientation == "vertical") {
        return ";flex-basis: auto!important";
      } else if (!!this.labelWidth) {
        return ";flex-basis: " + this.labelWidth + "px";
      } else {
        return "";
      }
    },
    pickerDisplayStr() {
      if (this.formType == "picker" && this.pickerMode == "selector") {
        if (
          !isNaN(+this.currentValue) &&
          this.pickerRange &&
          this.pickerRange.length &&
          this.pickerRange[this.currentValue]
        ) {
          return this.pickerRange[this.currentValue][this.pickerRangeKey];
        } else {
          return this.placeholder;
        }
      } else {
        return this.placeholder;
      }
    },
    inputNumberColor() {
      if (this.disabled) {
        return "#ccc";
      } else {
        return this.color;
      }
    }
  },
  data() {
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
    return {
      currentValue: "",
      MAX_SAFE_INTEGER
    };
  },
  watch: {
    value: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal !== this.currentValue) {
            if (this.formType == "inputNumber" && newVal !== "") {
              this.currentValue = this.formatValueByStep(newVal, this.step);
            } else {
              this.currentValue = newVal;
            }
          }
        }
      }
    },
    modelval: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal !== this.currentValue) {
            if (this.formType == "inputNumber" && newVal !== "") {
              this.currentValue = this.formatValueByStep(newVal, this.step);
            } else {
              this.currentValue = newVal;
            }
          }
        }
      }
    }
  },
  methods: {
    input(e) {
      console.log("input", e);
      this.currentValue = e.mp.detail.value;
      this.$emit("hj-input", e.mp.detail.value);
      // this.$emit("input", e.mp.detail.value);
    },
    focus(e) {
      console.log("focus", e);
      this.$emit("hj-focus", e);
      this.$emit("focus", e);
    },
    blur(e) {
      console.log("blur", e);
      this.$emit("hj-blur", e);
      this.$emit("blur", e);
    },
    change(e) {
      console.log("change", e);
      this.currentValue = e.mp.detail.value;
      this.$emit("hj-change", e.mp.detail.value);
      // this.$emit("change", e.mp.detail.value);

      // if(this.isAutoValidate){
      //   this.validate()
      // }
    },
    changeSwitch(e) {
      console.log("changeSwitch", e);
      this.currentValue = e.mp.detail.value;
      this.$emit("hj-change", e.mp.detail.value);
      // this.$emit("change", e.mp.detail.value);
    },
    clear(e) {
      this.currentValue = "";
      this.$emit("hj-clear", "");
      // this.$emit("clear", "");
    },
    getValidValue(value, min, max) {
      let val = parseFloat(value);

      if (isNaN(val)) {
        return value;
      }

      if (val < min) {
        val = min;
      }

      if (val > max) {
        val = max;
      }

      return val;
    },
    formatValueByStep(value, step) {
      value = +value;
      var stepStr = String(step);
      if (stepStr.includes(".")) {
        var stepLength = stepStr.length;
        var index = stepStr.indexOf(".");
        value = +value.toFixed(stepLength - index - 1);
      } else {
        value = parseInt(value);
      }
      return value;
    },
    substruct(e) {
      console.log("substruct", e);
      if (isNaN(+this.currentValue)) {
        console.error("+this.currentValue is NaN");
        return;
      }
      var value = this.currentValue;
      value = Number(value) - Number(this.step);

      if (!isFinite(value)) {
        console.log("isFinite", value);
        value = "";
        this.currentValue = value;
        this.$emit("hj-change", value);
        return;
      } else if (this.currentValue === "") {
        value = Number(this.min);
      } else if (this.min !== "" && !isNaN(this.min) && value <= this.min) {
        value = Number(this.min);
      }

      this.currentValue = this.formatValueByStep(value, this.step);
      this.$emit("hj-change", this.currentValue);
    },
    add(e) {
      console.log("add", e);
      console.log(this.max, this.min, this.currentValue);
      if (isNaN(+this.currentValue)) {
        console.error("+this.currentValue is NaN");
        return;
      }
      var value = Number(this.currentValue) + Number(this.step);
      if (!isFinite(value)) {
        console.log("isFinite", value);
        value = "";
        this.currentValue = value;
        this.$emit("hj-change", value);
        return;
      } else if (this.currentValue === "") {
        value = Number(this.min);
      } else if (
        this.max !== "" &&
        !isNaN(this.max) &&
        this.currentValue >= this.max
      ) {
        value = Number(this.max);
      }

      var formatValueByStep = this.formatValueByStep(value, this.step);
      console.log("formatValueByStep", formatValueByStep);
      this.currentValue = formatValueByStep;
      this.$emit("hj-change", value);
    },
    cancelPick(e) {
      console.log("cancelPick", e);
    },
    validate() {},
    getVal() {
      console.log("getVal currentValue", this.currentValue);
      if (this.currentValue === "") {
        return "";
      }

      switch (this.formType) {
        case "input":
          if (this.type == "number") {
            return +this.currentValue;
          }
          return this.currentValue;
        case "picker":
          if (
            this.pickerMode == "selector" &&
            !isNaN(+this.currentValue) &&
            this.pickerRange &&
            this.pickerRange.length &&
            this.pickerRange[this.currentValue]
          ) {
            return this.pickerRange[this.currentValue][this.pickerRangeId];
          }
          return this.currentValue;
        case "inputNumber":
          if (this.type == "int") {
            return parseInt(this.currentValue);
          }
          if (this.type == "float") {
            return +(+this.currentValue).toFixed(2);
          }
          return +this.currentValue;
        default:
          return this.currentValue;
      }
    }
  },
  mounted() {
    // console.log("form-item mounted", this.$props, this);
  }
};
</script>
<style lang="scss">
.hj-form-item {
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
    // align-items: flex-start;

    &__label {
      margin-right: 5px;
      flex-basis: 80px;
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
        display: flex;
        align-items: center;
      }
    }
    &__switch {
      margin-left: 5px;
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
    }
    &__picker {
      margin-left: 5px;
      flex-grow: 1;
      // display: flex;
      &__model {
        width: 100%;
        font-size: 15px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(179, 178, 178, 1);
        line-height: 1.5;
      }
      &__display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &__label {
          flex-grow: 1;
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;

          line-height: 1.5;
        }
        &__icon {
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;

          line-height: 1.5;
        }
      }
    }
    &__input-number {
      margin-left: 5px;
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
      padding-left: 10px;
      &__wrapper {
        display: flex;
        &__subs {
          padding-left: 5px;
          padding-right: 5px;
        }
        &__model {
          text-align: center;
          width: 100px;
        }
        &__add {
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
  }

  &--vertical {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
    padding-top: 0px;
    padding-bottom: 0px;

    &__input {
    }
  }
  &--horizon {
    flex-direction: row;
    margin-top: 0px;
    padding-top: 10px;
    padding-bottom: 10px;

    &__input {
    }
  }
}
</style>