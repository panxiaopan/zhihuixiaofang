<template>
  <div class="hj-device-fire-params-setting">
    <form
      @submit="onFormSubmit"
      @reset="onReset"
    >

      <fireParamsForm
        ref="fireParamsForm"
        v-if="formItemObjs"
        @form-ready="formReady"
        :formItemObjs="formItemObjs"
      ></fireParamsForm>

      <div class="hj-device-fire-params-setting__btn__container">

        <!-- <button
                  class="hj-device-fire-params-setting__btn--reset"
                  formType="reset"
                  @click.stop="reset"
                >重置
                </button> -->
        <button
          class="hj-device-fire-params-setting__btn--next"
          formType="submit"
          @click="setting"
        > 设置
        </button>
      </div>
    </form>

  </div>
</template>
<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import fireParamsForm from "../components/fire-params-form.vue";
export default {
  onShareAppMessage,
  onShow() {
    // if (this.isMounted) {
    //   this.reset();
    // }
  },
  name: "hj-device-fire-params-setting",
  components: {
    fireParamsForm
  },
  data() {
    return {
      isAuth: true,
      isMounted: false,
      formItemObjs: null,
      isMounted: false
    };
  },
  methods: {
    onFormSubmit(e) {
      console.log("onFormSubmit", e, this);
      this.$refs.fireParamsForm.validateAndGetFormData().then(res => {
        console.log("validateAndGetFormData success", res);
        if (res) {
          this.settingParamByIdent(res);
        }
      });
    },
    onReset(e) {
      console.log("onReset", e);
    },
    formReady(e) {
      console.log("formReady", e);
    },
    reset(e) {
      console.log("reset", e);
    },
    settingParamByIdent(params) {
      // paramSettings
      console.log("settingParamByIdent", params);
      var newParams = {
        ident: this.pageQuery.ident,
        id: this.pageQuery.id,
        deviceId: this.pageQuery.deviceId,
        ...params
      };
      console.log("newParams", newParams);

      this.$http("settingParamByIdent", newParams, {
        method: "put"
      })
        .then(res => {
          console.log("settingParamByIdent", res);
          this.showToast((res.head && res.head.msg) || "设置成功");
        })
        .catch(res => {
          this.showToast((res.head && res.head.msg) || "设置失败");
        });
    },
    setting(e) {
      console.log("setting", e);
    },
    refreshParamSettings() {
      this.$http(
        "paramSettings",
        { ...this.pageQuery },
        { method: "put" }
      ).then(res => {
        console.log("hj-device-fire-params-setting paramSettings", res);
        var deviceParamsDataMap = {};
        res.data.forEach(item => {
          deviceParamsDataMap[item.ident] = item;
        });
        wx.setStorageSync("deviceParamsDataMap", deviceParamsDataMap);
      });
    },
    getFormObj(params) {
      var defaultFormObj = {
        labelWidth: 0,
        class: "",
        label: "label",
        type: "number",
        name: "name",
        placeholder: "placeholder",
        max: "max",
        min: "min",
        step: 1,
        formType: "input",
        pickerRange: [],
        pickerRangeKey: "name",
        pickerRangeId: "id",
        disabled: false,
        data: ""
      };
      if (params) {
        Object.assign(defaultFormObj, params);
      }
      return defaultFormObj;
    },
    getCamelCaseStrForPre(pre, str) {
      return pre + (str.charAt(0).toUpperCase() + str.slice(1));
    },
    decodeFireSettingParams(pre, dataObj) {
      console.log("decodeFireSettingParams", pre, dataObj);
      if (!dataObj) {
        return null;
      }
      var result = {};
      Object.keys(dataObj).forEach(key => {
        var item = dataObj[key];
        var value = {};
        var camelCaseStr = this.getCamelCaseStrForPre(pre, key);
        value.name = camelCaseStr;
        value.label = this.getNameByStr(camelCaseStr);

        if (item.type == "int" || item.type == "float") {
          value.max = item.max || "max";
          value.min = item.min || "min";
          value.type = "number";
          value.formType = "inputNumber";
          value.type = "int";
          if (item.hasOwnProperty("max") && item.hasOwnProperty("min")) {
            var validateType =
              (item.type == "int" && "integer") ||
              (item.type == "float" && "float") ||
              "number";

            value.descriptor = {
              type: validateType,
              range: {
                min: +item.min,
                max: +item.max
              },
              message:
                value.label + "必须在" + item.min + "~" + item.max + "之间"
            };
          }

          if (item.type == "float") {
            value.step = 0.1;
            value.type = "float";
          }
          value.placeholder = "(" + item.min + "~" + item.max + ")";
        }
        if (item.type == "enum") {
          value.formType = "picker";
          value.pickerRange = item.values.map(val => {
            return {
              id: val.value,
              name: val.desc.zh
            };
          });
          value.placeholder = "请选择" + value.label;
        }

        if (item.unit) {
          value.label = value.label + "(" + item.unit + ")";
        }
        result[camelCaseStr] = this.getFormObj(value);
      });
      console.log("decodeFireSettingParams result", result);
      return result;
    },
    getNameByStr(str) {
      switch (str) {
        case "alarmValue":
          return "报警值";

        case "alarmDelay":
          return "报警延迟";

        case "alarmToutui":
          return "报警投退";

        case "earlyWarningValue":
          return "预警比";

        case "earlyWarningDelay":
          return "预警延迟";

        case "earlyWarningToutui":
          return "预警投退";

        default:
          console.log("getNameByStr", str);
          return "blank";
      }
    },
    getFireSettingFormObj(config) {
      console.log("getFireSettingFormObj", config);
      if (!config) {
        return null;
      }
      var warning = config.warning;
      var prewarning = config.prewarning;
      var waringPre = "alarm";
      var prewarningPre = "earlyWarning";
      var warningObj = this.decodeFireSettingParams(waringPre, warning);
      var prewarningObj = this.decodeFireSettingParams(
        prewarningPre,
        prewarning
      );
      return {
        ...warningObj,
        ...prewarningObj
      };
    },
    setFireSettingDataByRemote(result) {
      if (!result) {
        return null;
      }
      var deviceParamsDataMap = wx.getStorageSync("deviceParamsDataMap");
      var mapedData = deviceParamsDataMap[this.pageQuery.ident];
      if (mapedData) {
        Object.keys(mapedData).forEach(key => {
          if (result[key]) {
            if (
              result[key].formType &&
              result[key].formType == "picker" &&
              result[key].pickerRange &&
              result[key].pickerRange.length
            ) {
              result[key].pickerRange.some((item, index) => {
                if (item.id == mapedData[key]) {
                  result[key].data = index;
                  return true;
                }
                return false;
              });
            } else {
              result[key].data = mapedData[key];
            }
          }
        });
      }
    },
    setBasicSettingDataByRemote(result) {
      if (!result) {
        return null;
      }
      var deviceParamsDataMap = wx.getStorageSync("deviceParamsDataMap");
      var mapedData = deviceParamsDataMap[this.pageQuery.ident];
      console.log("setBasicSettingDataByRemote", result.data, mapedData);
      if (mapedData) {
        if (
          result.data &&
          result.data.formType &&
          result.data.formType == "picker" &&
          result.data.pickerRange &&
          result.data.pickerRange.length
        ) {
          result.data.pickerRange.some((item, index) => {
            if (item.id == mapedData.data) {
              result.data.data = index;
              return true;
            }
            return false;
          });
        } else {
          result.data.data = mapedData.data;
        }
      }
    },
    generaterFormObjBySetting() {
      // alarmValue
      // alarmDelay
      // alarmToutui
      // earlyWarningValue
      // earlyWarningDelay
      // earlyWarningToutui
      var result = null;
      var configInfoMap = wx.getStorageSync("configInfoMap");
      console.log("this.pageQuery", this.pageQuery);
      console.log("generaterFormObjBySetting", configInfoMap);
      var config = configInfoMap[this.pageQuery.ident];
      var formName = config.name;
      // fireSetting
      // basicSetting
      // commSetting
      if (this.pageQuery.paramType == "fireSetting") {
        result = this.getFireSettingFormObj(config);
        this.setFireSettingDataByRemote(result);
      }
      if (
        this.pageQuery.paramType == "basicSetting" ||
        this.pageQuery.paramType == "commSetting"
      ) {
        result = this.getBasicSettingFormObj(config);
        this.setBasicSettingDataByRemote(result);
      }

      console.log("generaterFormObjBySetting", result);
      return result;
    },
    getBasicSettingFormObj(config) {
      console.log("getBasicSettingFormObj", config);
      if (!config) {
        return null;
      }
      var formData = {};
      var value = {};
      value.label = config.unit
        ? config.name + "(" + config.unit + ")"
        : config.name;
      // value.name = config.ident;
      value.name = "data";

      value.placeholder = "请输入" + config.name;
      if (config.type == "enum") {
        value.formType = "picker";
        value.pickerRange = config.values.map(val => {
          return {
            id: val.value,
            name: val.desc.zh
          };
        });
        value.placeholder = "请选择" + config.name;
      }

      if (config.type == "text") {
        value.type = "text";
      }

      if (config.type == "int" || config.type == "float") {
        value.max = config.max || "max";
        value.min = config.min || "min";
        value.formType = "inputNumber";
        // value.type = "number";
        value.type = "int";
        if (
          config.value.hasOwnProperty("max") &&
          config.value.hasOwnProperty("min")
        ) {
          value.descriptor = {
            type:
              (config.type == "int" && "integer") ||
              (config.type == "float" && "float") ||
              "number",
            range: {
              min: +config.value.min,
              max: +config.value.max
            },
            message:
              config.label +
              "必须在" +
              config.value.min +
              "~" +
              config.value.max +
              "之间"
          };
        }

        if (config.value.type == "float") {
          value.step = 0.1;
          value.type = "float";
        }
        value.placeholder =
          "(" + config.value.min + "~" + config.value.max + ")";
      }

      value.labelWidth = 200;
      var result = this.getFormObj(value);

      // formData[config.ident] = result;
      formData["data"] = result;
      console.log("result", result);
      return formData;
    },
    setFormItemObjs(formItemObjs) {
      if (formItemObjs) {
        this.formItemObjs = formItemObjs;
      }
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    }
  },
  mounted() {
    this.pageQuery = this.$root.$mp.query;
    if (this.isMounted) {
      this.formItemObjs = null;
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.setFormItemObjs(this.generaterFormObjBySetting());
        });
      });
    } else {
      this.setFormItemObjs(this.generaterFormObjBySetting());
    }
    // this.refreshParamSettings();

    console.log("this.pageQuery", this.pageQuery);
    this.isMounted = true;
  }
};
</script>
<style lang="scss">
.hj-device-fire-params-setting {
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;
  padding: 10px 10px 10px 10px;
  background-color: #f4f7fb;

  &__btn {
    &__container {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
    }
    &--next {
      background-color: rgba(102, 120, 233, 1);
      color: #fff;
      width: 100%;
    }
    &--reset {
    }
  }
}
</style>