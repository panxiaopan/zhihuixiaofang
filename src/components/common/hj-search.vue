<template>
  <div
    class="hj-search"
    :id="hjId"
    :class="hjClass"
    @click.stop="clickContainer"
    :style="hjStyle"
  >
    <div
      style="width:100%;vertical-align:middle;"
      :class="{'hj-search__input--active': !disabled, 'hj-search__input--unactive': disabled}"
    >
      <!-- <wux-icon  type="md-search" size="22" color="#bbb" style="vertical-align:middle;"></wux-icon> -->
      <input
        style="display:inline-block;vetical-align:bottom;transform:translateY(5px);"
        class="hj-search__input"
        v-model="currentValue"
        type="text"
        @change="change"
        @input="input"
        @focus="focus"
        @blur="blur"
        :disabled="disabled"
      >
    </div>
    <!-- @input="input" v-on="inputListeners" v-bind="$attrs" -->
    <!-- <scroll-view scroll-y class="hj-search__options" v-if="currentOptions.length&&isShowOptionsPanel"> -->
    <div
      class="hj-search__options"
      v-if="currentOptions.length&&isShowOptionsPanel"
    >
      <div
        class="hj-search__options__op"
        v-for="option in currentOptions"
        :key="option.id"
        @click.stop="selectOption(option)"
      >
        <span
          class="hj-search__options__op__label"
          :class="{'hj-search__options__op__label--active': (selectedOption&&selectedOption.id)==option.id }"
        >
          {{option.name}}
        </span>
      </div>

      <!-- <div class="hj-search__options__op" v-for="option in currentOptions" :key="option.id" @click.stop="selectOption(option)">
        <span class="hj-search__options__op__label" :class="{'hj-search__options__op__label--active': (selectedOption&&selectedOption.id)==option.id }">
          {{option.name}}
        </span>
      </div> -->

    </div>
    <!-- </div> -->
    <div
      class="hj-search__options"
      v-else-if="!currentOptions.length&&isShowOptionsPanel"
    >
      <div>暂无选项</div>
    </div>

    <div v-if="history">

    </div>
  </div>
</template>
<script>
import isEqual from "lodash/isEqual.js";
import merge from "lodash/merge.js";
import cloneDeep from "lodash/cloneDeep.js";
export default {
  name: "hj-search",
  inheritAttrs: false,
  props: {
    hjId: {
      type: String,
      default: "hj-simple-search"
    },
    isReset: {
      type: Boolean,
      default: false
    },
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number],
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    searchUrl: {
      type: String,
      default: "socialUnits"
    },
    proccessFun: {
      type: [Function, Object], // return Array //id , name
      default: null
    },
    params: {
      type: Object,
      default: null
    },
    queryParams: {
      type: Object,
      default: null
    },
    selectedId: {
      type: [String, Number],
      default: ""
    },
    disabled: {
      type: String,
      default: false
    },
    history: {
      type: Boolean,
      default: false
    }
    // optionProps:{
    //   type: Object,
    //   default: ()=> ({
    //     label: 'name',
    //     value: 'id'
    //   })
    // },
  },
  data() {
    return {
      currentValue: "",
      currentOptions: [],
      selectedOption: null,
      isShowOptionsPanel: false,
      currentParams: {
        keyword: ""
      },
      currentQueryParams: { method: "get" }
    };
  },
  // computed: {
  //   inputListeners: function() {
  //     var vm = this;
  //     // `Object.assign` 将所有的对象合并为一个新对象
  //     return Object.assign(
  //       {},
  //       // 我们从父级添加所有的监听器
  //       this.$listeners,
  //       // 然后我们添加自定义监听器，
  //       // 或覆写一些监听器的行为
  //       {
  //         // 这里确保组件配合 `v-model` 的工作
  //         change: function(val) {
  //           // console.log('input event this', 'input event vm', vm.$event, event);
  //           // vm.$emit('input', event);
  //           vm.$emit('change', event);
  //         }
  //         //   input: function(event) {
  //         //     console.log('input event', event);
  //         //     vm.$emit('input', event);
  //         //   }
  //       }
  //     );
  //   }
  // },
  watch: {
    value: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal && newVal !== undefined) {
          this.currentValue = newVal;
          this.isShowOptionsPanel = false;
        }
      }
    },
    options: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal && newVal !== undefined) {
          this.currentOptions = newVal;
          // this.isShowOptionsPanel = false;
        }
      }
    },
    params: {
      immediate: true,
      handler: function(newVal, oldVal) {
        console.log("params newVal", newVal, oldVal);
        if (!!newVal && !isEqual(newVal, oldVal)) {
          console.log("params merge", newVal);
          this.currentParams = merge(cloneDeep(this.currentParams), newVal);
        }
      }
    },
    queryParams: {
      immediate: true,
      handler: function(newVal, oldVal) {
        console.log(
          "queryParams newVal",
          newVal,
          oldVal,
          isEqual(newVal, oldVal)
        );
        if (!!newVal && !isEqual(newVal, oldVal)) {
          this.currentQueryParams = merge(
            cloneDeep(this.currentQueryParams),
            newVal
          );
          console.log("this.currentQueryParams", this.currentQueryParams);
        }
      }
    },
    isReset(newVal, oldVal) {
      if (newVal) {
        this.isShowOptionsPanel = false;
      }
    }
    // optionProps:{
    //   immediate: true,
    //   hanlder: function(newVal, oldVal){
    //     if(newVal!=oldVal){

    //     }
    //   }
    // }
  },
  methods: {
    clickContainer() {
      // console.log('clickContainer', e);

      this.isShowOptionsPanel = this.isShowOptionsPanel && false;
    },
    change(e) {
      // this.$emit('change', {
      //   value: e.mp.detail.value,
      //   option: this.selectedOption
      // });

      this.$emit("change", e.mp.detail.value);
      // this.$emit('change', e);
      console.log("change", e);
      console.log("this.currentValue", this.currentValue);
    },
    input(e) {
      this.$emit("input", e.mp.detail.value);
      // this.$emit('input', e);
      console.log("input", e);
      console.log("this.currentValue", this.currentValue);
      this.search(e.mp.detail.value);
      // this.currentValue = e.mp.detail.value;
      // setTimeout(() => {
      //   console.log('this.currentValue', this.currentValue);
      // }, 1000);
      // return 'input';
    },
    focus(e) {
      this.$emit("focus", e.mp.detail.value);
      console.log("focus", e);
      if (!this.currentValue) {
        this.search();
      } else {
        this.isShowOptionsPanel = this.isShowOptionsPanel || true;
      }
    },
    blur(e) {
      this.$emit("blur", e.mp.detail.value);
      // setTimeout(() => {
      //   this.isShowOptionsPanel = this.isShowOptionsPanel && false;
      //   console.log('blur', e);
      // }, 100);
    },
    selectOption(option) {
      console.log("selectOption", option);
      this.$emit("select", option);
      this.selectedOption = option;
      this.currentValue = option.name;
      if (this.timer2) {
        clearTimeout(this.timer2);
        this.timer2 = null;
      }
      this.timer2 = setTimeout(() => {
        this.isShowOptionsPanel = this.isShowOptionsPanel && false;
        // console.log('blur', e);
      }, 300);

      // this.isShowOptionsPanel = false;
    },
    search(keyword) {
      // if(this.history){
      // }

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.currentParams.keyword = keyword || "";
      console.log("this.currentQueryParams", this.currentQueryParams);
      this.timer = setTimeout(() => {
        this.$http(this.searchUrl, this.currentParams, this.currentQueryParams)
          .then(res => {
            console.log("res", res);
            this.dealFun(res.data || [], res);
          })
          .catch(res => {
            console.log("fail res", res);
            this.dealFun([]);
          });
      }, 300);
    },
    dealFun(data, res) {
      this.selectedOption = null;
      if (this.proccessFun) {
        this.currentOptions = this.proccessFun(res);
      } else {
        if (Array.isArray(data)) {
          this.currentOptions = data;
        } else {
          this.currentOptions = [];
        }
      }
      if (this.selectedId) {
        this.currentOptions.some(item => {
          if (item.id === this.selectedId && this.currentValue == item.name) {
            this.selectedOption = item;
            // this.currentValue = item.name;
            return true;
          }
          return false;
        });
      }
      this.isShowOptionsPanel = true;
    }
  },
  mounted() {
    console.log("hj-search mounted");
    this.isShowOptionsPanel = false;
    console.log("this.$attrs", this.$attrs);
    // this.search();
  },
  destroyed() {
    if (this.timer2) {
      clearTimeout(this.tiemr2);
      this.tiemr2 = null;
    }
    if (this.timer) {
      clearTimeout(this.tiemr);
      this.timer = null;
    }
  }
};
</script>
<style lang="scss">
.hj-search {
  width: 100%;
  // height: 100%;
  position: relative;
  // z-index: 2;
  margin-bottom: 10px;
  font-size: 18px;
  font-family: PingFang-SC-Medium;
  &__input {
    // position: relative;
    // z-index: 0;
    &--active {
      color: #111;
      // border-bottom: 1rpx solid #6678e9;
      border-bottom: 1px solid #ddd;
    }
    &--unactive {
      color: #ccc;
      border-bottom: 1px solid #ddd;
    }
  }
  &__options {
    position: absolute;
    z-index: 555;
    width: 100%;
    // height: 150px;
    background-color: #fff;
    // height: 100%;
    top: 32px;
    &__op {
      width: 100%;
      margin-top: 5px;
      margin-bottom: 5px;
      margin-left: 10px;
      // height: 100%;
      &__label {
        &--active {
          color: #6678e9;
        }
      }
    }
  }
}
</style>