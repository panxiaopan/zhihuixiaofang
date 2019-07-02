<template>
  <div class="hj-social-unit-device-form" :class="hjClass" :style="hjStyle">
    <wux-cascader :visible='isBrandSelectVisible' controlled='true' :value='deviceBrandValue' title="产品类型/品牌/型号" :options='brandOptions' @close="onBrandClose" @change="onBrandChange" />
    <wux-cascader :visible='isCircuitSelectVisible' controlled='true' :value='circuitValue' title="电流互感器规格(A)" :options='circuitOptions' @close="onCircuitCascaderClose" @change="onCircuitCascaderChange" />


    <label
      class="hj-social-unit-device-form__item"
      :class="registCodeClass"
      v-if="isShowRegistCode"
    >
      <div class="hj-social-unit-device-form__item__label">
        <span class="hj-social-unit-device-form__item__label__icon">*</span>
        <span class="hj-social-unit-device-form__item__label__label">注册码</span>
      </div>
      <div style="display:flex;">
        <input
          name="dtuTag"
          class="hj-social-unit-device-form__item__input"
          type="text"
          v-model.trim="dtuTag"
          placeholder="请输入注册码"
        >
        <div @click.stop="scannCode">
          &nbsp;
          <wux-icon type="md-qr-scanner" size="22"></wux-icon>&nbsp;
        </div>
      </div>
    </label>

    <label class="hj-social-unit-device-form__item" :class="deviceNameClass">
      <div class="hj-social-unit-device-form__item__label">
        <span class="hj-social-unit-device-form__item__label__icon">*</span>
        <span class="hj-social-unit-device-form__item__label__label">设备名称</span>
      </div>
      <input
        name="deviceName"
        class="hj-social-unit-device-form__item__input"
        type="text"
        v-model.trim="deviceName"
        placeholder="请输入设备名称"
      >
    </label>
    <label class="hj-social-unit-device-form__item" :class="locationClass">
      <div class="hj-social-unit-device-form__item__label">
        <span class="hj-social-unit-device-form__item__label__icon">*</span>
        <span class="hj-social-unit-device-form__item__label__label">设备位置</span>
      </div>
      <input
        name="location"
        class="hj-social-unit-device-form__item__input"
        type="text"
        v-model.trim="location"
        placeholder="请输入设备位置"
      >
    </label>
    <label class="hj-social-unit-device-form__item" :class="deviceMultiSelectClass">
      <div class="hj-social-unit-device-form__item__label">
        <span class="hj-social-unit-device-form__item__label__icon">*</span>
        <span class="hj-social-unit-device-form__item__label__label">设备类型/品牌/型号</span>
      </div>
      <div
        class="hj-social-unit-device-form__item__input hj-social-unit-device-form__item__input__addrwraper"
      >
        <input
          name="deviceCategoryId,deviceBrandId,deviceTypeId"
          class="hj-social-unit-device-form__item__input"
          type="text"
          disabled=true
          @click="onBrandShow"
          :value="deviceTypeAndBrandName"
          placeholder="请选择设备类型/品牌/型号">

        <wux-icon
          class="hj-social-unit-device-form__item__input__icon"
          type="ios-arrow-forward"
          size="22"
        ></wux-icon>
      </div>
    </label>

    <label
      class="hj-social-unit-device-form__item"
      :class="commIdClass"
      v-if="showId"

    >
      <div class="hj-social-unit-device-form__item__label">
        <span class="hj-social-unit-device-form__item__label__icon">*</span>
        <span class="hj-social-unit-device-form__item__label__label">设备通信ID</span>
      </div>
      <input
        name="commId"
        class="hj-social-unit-device-form__item__input"
        type="number"
        v-model.number="commId"
        placeholder="请输入设备通信ID"
      >
    </label>
    <label
      class="hj-social-unit-device-form__item"
      :class="mainCircuitCurrentClass"
      v-if="showId"

    >
      <div class="hj-social-unit-device-form__item__label">
        <span class="hj-social-unit-device-form__item__label__icon">*</span>
        <span class="hj-social-unit-device-form__item__label__label">电流互感器规格(A)</span>
      </div>
      <div
        class="hj-social-unit-device-form__item__input hj-social-unit-device-form__item__input__addrwraper"
      >
          <input
            name="mainCircuitCurrent"
            class="hj-social-unit-device-form__item__input"
            type="text"
            disabled=true
            @click="onCircuitCascaderShow"
            :value="circuitText"
            placeholder="电流互感器规格(A)">
        <wux-icon
          class="hj-social-unit-device-form__item__input__icon"
          type="ios-arrow-forward"
          size="22"
        ></wux-icon>
      </div>
    </label>
  </div>
</template>
<script>
// dtuTag	是	string	注册码
// deviceName	是	string	设备名称
// deviceCategoryId	是	string	设备类型
// deviceBrandId	是	int	设备品牌
// deviceTypeId	是	int	设备型号
// location	是	string	设备位置
// commId	是	int	通信ID，默认为1
// mainCircuitCurrent	是	float	电流互感器规格，100、200等

// import cloneDeep from "lodash/cloneDeep.js";
import schema from "async-validator";
export default {
  name: "social-unit-device-form",
  props: {
    hjStyle: {
      type: String,
      default: ""
    },
    hjClass: {
      type: String,
      default: ""
    },
    isShowRegistCode: {
      type: Boolean,
      default: true
    },
    showId: {
      type: Boolean
    },
    descriptor: {
      type: Object,
      default: () => ({
        registCode: {
          type: "string",
          message: "必须填写注册码"
        },
        deviceName: {
          type: "string",
          message: "必须填写设备名称"
        },        
        deviceCategoryId:{
          type: 'number',
          message: '必须选择设备类型'
        },
        deviceBrandId:{
          type: 'number',
          message: '必须选择品牌'
        },
        deviceTypeId:{
          type: 'number',
          message: '必须选择型号'
        },
        location: {
          type: "string",
          message: "必须填写设备位置"
        },
        commId: [
          {
            type: "integer",
            range: {
              min: 1,
              max: 255
            },
            message: "通信ID必须大与0小于256"
          }
        ],
        mainCircuitCurrent: {
          type: "number",
          message: "必须填写电流互感器规格"
        }
      })
    }
  },
  data() {
    return {
      isBrandSelectVisible: false,
      deviceBrandValue: [],
      brandOptions: [],
      deviceTypeAndBrandName: '',
      dtuTag: "", // **
      deviceName: "", // **
      deviceCategoryId: "", // **
      deviceBrandId: "", // **
      deviceTypeId: "", // **

      location: "", // **
      commId: 1, // **

      isCircuitSelectVisible: false,
      circuitText: '',
      circuitValue: [],
      circuitOptions: [
        { label: "100", value: '100' },
        { label: "200", value: '200' },
        { label: "400", value: '400' },
        { label: "800", value: '800' }
      ],
      mainCircuitCurrent: 0, // **
      registCodeClass: "",
      deviceNameClass: "",
      locationClass: "",
      commIdClass: "",
      mainCircuitCurrentClass: "",
      deviceMultiSelectClass: "",
      errorClassStr: "hj-social-unit-device-form--red-border-bottom"
    };
  },
  methods: {
    onCircuitCascaderClose(e){
      console.log('onCircuitCascaderClose', e)
      this.isCircuitSelectVisible = false
    },
    onCircuitCascaderShow(e){
      console.log('onCircuitCascaderShow', e)
      this.isCircuitSelectVisible = true
    },
    onCircuitCascaderChange(e){
      console.log('onCircuitCascaderChange', e)
      let detail = e.mp.detail
      this.circuitValue = detail.value
      if (!detail.done){
        return
      }

      this.mainCircuitCurrent = parseInt(detail.value[0])
      this.circuitText = this.mainCircuitCurrent.toString()
    },
    onBrandClose(e){
      console.log('onBrandClose', e)
      this.isBrandSelectVisible = false     
    },
    onBrandShow(e){
      console.log('onBrandShow', e)
      this.isBrandSelectVisible = true
    },
    onBrandChange(e) {
      console.log('onBrandChange', e)
      let detail = e.mp.detail
      this.deviceBrandValue = detail.value
      if (!detail.done){
        return
      }
      
      this.deviceCategoryId = detail.value[0]
      this.deviceBrandId = detail.value[1]
      this.deviceTypeId = detail.value[2]

      //判断是否为电气火灾探测器
      this.showId = this.deviceCategoryId == '23'
      console.log('onBrandChange', this.deviceCategoryId, this.deviceBrandId, this.deviceTypeId)
      this.deviceTypeAndBrandName = detail.options.map((n) => n.label).join('/')
    },
    scannCode(e) {
      console.log("scannCode", e);
      this.$emit("scan-code", e);
      wx.scanCode({
        success: res => {
          console.log("scannCode success", res);
          this.dtuTag = res.result;
        }
      });
    },
    convertToCasaderData(brandTree, convertedData){
      for(let i in brandTree){
        let item  = brandTree[i]
        let data = {}
        data.label = item.name
        data.value = item.id.toString()
        if (item.nodeList && item.nodeList.length > 0){
          data.children = []
          this.convertToCasaderData(item.nodeList, data.children)
        }
        convertedData.push(data)
      }
    },
    queryDeviceBrandModelTree() {
      this.$http("deviceBrandModelTree", {}, { method: "get" })
        .then(res => {
          console.log("queryDeviceBrandModelTree then", res);
          this.brandOptions = []
          this.convertToCasaderData(res.data, this.brandOptions);
          console.log('convertToCasaderData', this.brandOptions);

          this.$emit("form-ready");
        })
        .catch(res => {
          console.log("queryDeviceBrandModelTree catch", res);
        });
    },
    resetFormItemClass() {
      this.registCodeClass = "";
      this.deviceNameClass = "";
      this.deviceMultiSelectClass = "";
      this.locationClass = "";
      this.commIdClass = "";
      this.mainCircuitCurrentClass = "";
    },
    validator(formData, descriptor) {
      // var isTelAndMobile = /^(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})$/;
      // var isMobile = /^1[3|4|5|6|7|8][0-9]{9}$/;
      // var isEmpty = /(^\s*)|(\s*$)/g;
      console.log("validator", formData);
      return new Promise((resolve, reject) => {
        if (!descriptor && !this.descriptor) {
          console.error("descriptor must be needed");
          reject(false);
        }
        var validator = new schema(descriptor || this.descriptor);
        validator.validate(formData, (errors, fields) => {
          console.log("errors", errors);
          if (errors) {
            console.log("validator.validate", errors, fields);
            // return handleErrors(errors, fields);
            reject({ errors, fields });
          } else {
            resolve(formData);
          }
        });
      });
    },
    validateAndGetFormData() {
      return new Promise((resolve, reject) => {
        this.resetFormItemClass();
        var validatorData = this.getFormDataObj()
        console.log('validateAndGetFormData', validatorData)
        this.validator(validatorData)
          .then(res => {
            resolve(this.getFormDataObj());
          })
          .catch(res => {
            console.log("is not be validated", res);
            if (res && res.errors.length) {
              res.errors.forEach((item, index) => {
                if (!index) {
                  this.showToast(item.message);
                }
                this[item.field + "Class"] = this.errorClassStr;
              });
            }
            reject(false);
          });
      });
    },

    getFormDataObj() {
      var result = {
        deviceName: this.deviceName,
        deviceCategoryId: parseInt(this.deviceCategoryId),
        deviceBrandId: parseInt(this.deviceBrandId),
        deviceTypeId: parseInt(this.deviceTypeId),
        location: this.location,
      };
      if (this.showId){
        result.commId = (this.commId && parseInt(this.commId)) || NaN
        result.mainCircuitCurrent = this.mainCircuitCurrent || NaN
      }

      if (this.isShowRegistCode) {
        result.registCode = this.dtuTag;
      }

      return result;
    },
    reset() {
      this.resetFormItemClass();
      this.dtuTag = "";
      this.deviceName = "";
      this.location = "";
      this.commId = 1;
      this.mainCircuitCurrent = 100;
    },
    setData(data) {
      console.log("social unit device form setData", data);
      this.resetFormItemClass();
      var {
        dtuTag,
        location,
        commId,
        mainCircuitCurrent,
        deviceCategoryId,
        //后端单词拼错了
        deviceBandId: deviceBrandId,
        deviceTypeId,
        deviceClassId,
        deviceClassName,
        brandName,
        typeName,
      } = data.data;
      this.dtuTag = dtuTag || "";
      this.deviceName = data.name;
      this.location = location;
      this.commId = commId;
      this.deviceCategoryId = deviceCategoryId
      this.deviceBrandId = deviceBrandId
      this.deviceTypeId = deviceTypeId
      this.deviceBrandValue = ''
      if(deviceCategoryId && deviceBrandId && deviceTypeId)
        this.deviceBrandValue = [deviceCategoryId.toString(), deviceBrandId.toString(), deviceTypeId.toString()]
      console.log('setData', this.deviceBrandValue)
      if(mainCircuitCurrent){
        this.circuitValue = [mainCircuitCurrent.toString()]
        this.circuitText = mainCircuitCurrent.toString()
      }
      this.deviceTypeAndBrandName = deviceClassName +'/' +brandName +'/' +typeName

      console.log('setData, deviceTypeAndBrandName', this.deviceTypeAndBrandName)
    },

    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    }
  },
  onReady(){
    console.log('onReady in social-unit-device-form')
    this.reset()
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.timer = setTimeout(() => {
      this.queryDeviceBrandModelTree();
    }, 1000);

    if (this.showId == false) {
      this.commId = 1;
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
.hj-social-unit-device-form {
  &__item {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    // border-bottom: 1rpx solid blue;
    border-bottom: 1rpx solid #ddd;
    &--without-bottom {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
    }
    &__label {
      margin-right: 5px;
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
      }
    }
    &__input {
      margin-left: 5px;
      flex-grow: 1;
      font-size: 15px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(179, 178, 178, 1);
      line-height: 2;
      &__model {
        flex-grow: 1;
        line-height: 2;
        // line-height: 2;
        // border-bottom: 1rpx solid #ddd;
      }
      &__icon {
      }
      &__addrwraper {
        display: flex;
      }
    }
    &__remark {
      width: 100%;
      // display: flex;
      // flex-direction: column;
      &__input {
        width: 100%;
        display: inline-block;
      }
    }
  }

  &--none-border-bottom {
    border-bottom: 0rpx solild #ddd;
  }

  &--blue-border-bottom {
    border-bottom: 1rpx solid blue;
  }
  &--gray-border-bottom {
    border-bottom: 1rpx solid #ddd;
  }
  &--red-border-bottom {
    border-bottom: 1rpx solid red;
  }
}
</style>
