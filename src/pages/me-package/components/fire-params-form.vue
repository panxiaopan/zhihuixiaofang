<template>
  <div class="hj-fire-params-form">
    <div v-if="formItemObjs">
      <formItem
        v-for="item in formItemObjs"
        :ref="item.name"
        orientation="horizon"
        :key="item.name"
        :hjClass="item.class"
        :label="item.label"
        :type="item.type"
        :name="item.name"
        :placeholder="item.placeholder"
        :max="item.max"
        :min="item.min"
        :step="item.step"
        :form-type="item.formType"
        :picker-range="item.pickerRange"
        :picker-range-key="item.pickerRangeKey"
        :picker-range-id="item.pickerRangeId"
        :disabled="item.disabled"
        :labelWidth="item.labelWidth"
        v-model="item.data"
      >
      </formItem>
    </div>

    <!-- <formItem
      :hjClass="alarmValueClass"
      :label="名称"
      type="number"
      orientation="horizon"
      name="alarmValue"
      :placeholder="alarmValuePlaceholder"
      v-model="alarmValue"
      max=""
      min=""
      step=1
    >
    </formItem> -->

    <!-- <formItem
      :hjClass="alarmDelayClass"
      label="名称"
      type="number"
      orientation="horizon"
      name="alarmDelay"
      :placeholder="alarmDelayPlaceholder"
      v-model="alarmDelay"
      :pickerRange="pickerRange"
    >
    </formItem>
    <formItem
      :hjClass="alarmTouTuiClass"
      label="名称"
      type="text"
      orientation="horizon"
      name="alarmTouTui"
      :placeholder="alarmTouTuiPlaceholder"
      v-model="alarmTouTui"
      :pickerRange="pickerRange"
    >
    </formItem>
    <formItem
      :hjClass="earlyWarningValueClass"
      label="名称"
      type="number"
      orientation="horizon"
      name="earlyWarningValue"
      :placeholder="earlyWarningValuePlaceholder"
      v-model="earlyWarningValue"
      :pickerRange="pickerRange"
    >
    </formItem>
    <formItem
      :hjClass="earlyWarningDelayClass"
      label="名称"
      type="number"
      orientation="horizon"
      name="earlyWarningDelay"
      :placeholder="earlyWarningDelayPlaceholder"
      v-model="earlyWarningDelay"
      :pickerRange="pickerRange"
    >
    </formItem>
    <formItem
      :hjClass="earlyWarningTouTuiClass"
      label="名称"
      type="text"
      orientation="horizon"
      name="earlyWarningTouTui"
      :placeholder="earlyWarningTouTuiPlaceholder"
      v-model="earlyWarningTouTui"
      :pickerRange="pickerRange"
    >
    </formItem>
     -->
  </div>
</template>
<script>
// id	是	int	社会单位id
// deviceId	是	int	设备ID
// ident	是	int	参数标识

// alarmValue	是	float	报警值
// alarmDelay	是	int	报警延迟
// alarmTouTui	是	int	报警投退类型
// earlyWarningValue	是	float	预警比
// earlyWarningDelay	是	int	预警延迟
// earlyWarningTouTui	是	int	预警投退类型

// data	是	string	基本参数的数值

import schema from "async-validator";
import formItem from "./form-item.vue";

export default {
  name: "hj-fire-params-form",
  props: {
    formItemObjs: {
      type: Object,
      default: () => {
        return null;
      }
    },
    descriptor: {
      type: Object,
      default: () => null //
    }
  },
  components: {
    formItem
  },
  data() {
    return {
      // alarmDelay: "",
      // alarmValue: "",
      // alarmTouTui: "",
      // earlyWarningValue: "",
      // earlyWarningDelay: "",
      // earlyWarningTouTui: "",

      // alarmValueClass: "",
      // alarmDelayClass: "",
      // alarmTouTuiClass: "",
      // earlyWarningValueClass: "",
      // earlyWarningDelayClass: "",
      // earlyWarningTouTuiClass: "",

      errorClassStr: "hj-fire-params-form--red-border-bottom"
    };
  },
  // computed: {
  //   alarmValuePlaceholder() {
  //     var str = "请输入报警值";
  //     return str;
  //   },
  //   alarmDelayPlaceholder() {
  //     var str = "请输入报警延时";
  //     return str;
  //   },
  //   alarmTouTuiPlaceholder() {
  //     var str = "请选择报警投退";
  //     return str;
  //   },
  //   earlyWarningValuePlaceholder() {
  //     var str = "请输入预警比";
  //     return str;
  //   },
  //   earlyWarningDelayPlaceholder() {
  //     var str = "请输入预警延时";
  //     return str;
  //   },
  //   earlyWarningTouTuiPlaceholder() {
  //     var str = "请选择预警投退";
  //     return str;
  //   }
  // },
  watch: {
    formItemObjs: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.originData = {};
        }
      }
    }
  },
  methods: {
    // getVal(){
    //   var result = null;
    //   if()
    //   this.formItemObjs
    // },
    resetFormItemClass() {
      console.log("resetFormItemClass");
      // this.alarmValueClass = "";
      // this.alarmDelayClass = "";
      // this.alarmTouTuiClass = "";
      // this.earlyWarningValueClass = "";
      // this.earlyWarningDelayClass = "";
      // this.earlyWarningTouTuiClass = "";
      // Object.entries();

      Object.keys(this.formItemObjs).forEach(key => {
        this.formItemObjs[key].class = "";
      });

      // this.formItemObjs;
    },
    resetData() {},
    reset() {},
    getFormDataAndDescriptor() {
      var formData = {};
      var descriptor = null;
      Object.keys(this.formItemObjs).forEach(key => {
        var item = this.formItemObjs[key];
        var ref = item.name;
        var data = this.$refs[key][0].getVal();
        if (data === "") {
          return;
        }

        if (item.descriptor) {
          if (!descriptor) {
            descriptor = {};
          }
          formData[key] = data;
          descriptor[key] = item.descriptor;
        }
      });

      return {
        formData,
        descriptor
      };
    },
    validator(formData, descriptor) {
      // var isTelAndMobile = /^(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})$/;
      // var isMobile = /^1[3|4|5|6|7|8][0-9]{9}$/;
      // var isEmpty = /(^\s*)|(\s*$)/g;
      console.log("validator", formData, descriptor);
      return new Promise((resolve, reject) => {
        descriptor = descriptor || this.descriptor;
        if (!descriptor) {
          console.error("descriptor must be needed");
          reject(false);
        }
        var validator = new schema(descriptor || this.descriptor);
        validator.validate(formData, (errors, fields) => {
          console.log("errors", errors);
          if (errors) {
            console.log("validator.validate", errors, fields);
            console.log("formData, descriptor", formData, descriptor);
            // return handleErrors(errors, fields);
            reject({ errors, fields });
          } else {
            resolve(formData);
          }
        });
      });
    },
    getFormDataObj() {
      console.log("getFormDataObj");
      var formData = {};
      Object.keys(this.formItemObjs).forEach(key => {
        var ref = this.formItemObjs[key].name;
        formData[key] = this.$refs[ref][0].getVal();
      });

      return formData;
    },
    validateAndGetFormData() {
      console.log("validateAndGetFormData");
      return new Promise((resolve, reject) => {
        this.resetFormItemClass();
        var { formData, descriptor } = this.getFormDataAndDescriptor();
        console.log(
          "getFormDataAndDescriptor formData",
          formData,
          "descriptor",
          descriptor
        );

        if (!descriptor) {
          resolve(this.getFormDataObj());
          return;
        }

        this.validator(formData, descriptor)
          .then(res => {
            resolve(this.getFormDataObj());
            // resolve(formData)
          })
          .catch(res => {
            console.log("is not be validated", res);
            if (res && res.errors.length) {
              res.errors.forEach((item, index) => {
                if (!index) {
                  this.showToast(item.message);
                }
                console.log(item);
                this.formItemObjs[item.field].class = this.errorClassStr;
                // this[item.field + "Class"] = this.errorClassStr;
              });
              console.log("formItemObjs", this.formItemObjs);
            }
            reject(false);
          });
      });
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    }
  }
};
</script>
<style lang="scss">
.hj-fire-params-form {
  &--none-border-bottom {
    border-bottom: 0rpx solild #ddd;
  }

  &--blue-border-bottom {
    // border-bottom: 1rpx solid blue;
    border-bottom: 1rpx solid #ddd;
  }
  &--gray-border-bottom {
    border-bottom: 1rpx solid #ddd;
  }
  &--red-border-bottom {
    border-bottom: 1rpx solid red !important;
  }
}
</style>
