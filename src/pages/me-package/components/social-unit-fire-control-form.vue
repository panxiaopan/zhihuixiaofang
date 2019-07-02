<template>
  <div class="hj-social-unit-fire-control-form">
    <label
      class="hj-social-unit-form__item"
      :class="fireFacilityTypesClass"
      for="fireFacilityTypes"
    >
      <div class="hj-social-unit-form__item__label">
        <span class="hj-social-unit-form__item__label__label">
          消防实施种类
        </span>
      </div>
      <div class="hj-social-unit-form__item__input hj-social-unit-form__item__input__addrwraper">
        <picker
          class="hj-social-unit-form__item__input__model"
          name="fireFacilityTypes"
          mode="selector"
          :range="fireFacilityTypesList"
          range-key="name"
          v-model="fireFacilityTypes"
          @change="changeFireFacilityTypes"
        >
          <div>
            {{fireFacilityTypesStr}}
          </div>
        </picker>
        <wux-icon
          class="hj-social-unit-form__item__input__icon"
          type="ios-arrow-forward"
          size="22"
        ></wux-icon>
      </div>
    </label>

    <formItem
      ref="numberOfFireLanes"
      :hjClass="numberOfFireLanesClass"
      label="消防车道数量"
      type="number"
      orientation="vertical"
      name="numberOfFireLanes"
      placeholder="请输入消防车道数量"
      :value="numberOfFireLanes"
    >
    </formItem>

    <formItem
      ref="numberOfExits"
      :hjClass="numberOfExitsClass"
      label="安全出口数量"
      type="number"
      orientation="vertical"
      name="numberOfExits"
      placeholder="请输入安全出口数量"
      :value="numberOfExits"
    >
    </formItem>

    <formItem
      ref="numberOfFireElevators"
      :hjClass="numberOfFireElevatorsClass"
      label="消防电梯数量"
      type="number"
      orientation="vertical"
      name="numberOfFireElevators"
      placeholder="请输入消防电梯数量"
      :value="numberOfFireElevators"
    >
    </formItem>
    <formItem
      ref="numberOfFireExtinguishers"
      :hjClass="numberOfFireExtinguishersClass"
      label="灭火器数量"
      type="number"
      orientation="vertical"
      name="numberOfFireExtinguishers"
      placeholder="请输入灭火器数量"
      :value="numberOfFireExtinguishers"
    >
    </formItem>
    <formItem
      ref="hasPowder"
      :hjClass="hasPowderClass"
      label="是否产生粉尘"
      type="switch"
      formType="switch"
      labelWidth=110
      name="hasPowder"
      :value="hasPowder"
    >
    </formItem>

    <formItem
      ref="hasExplosiveGas"
      :hjClass="hasExplosiveGasClass"
      label="是否产生易燃易爆气体"
      type="switch"
      formType="switch"
      labelWidth=170
      name="hasExplosiveGas"
      :value="hasExplosiveGas"
    >
    </formItem>

    <formItem
      ref="hasHazardousChemical"
      :hjClass="hasHazardousChemicalClass"
      label="是否产生危险化学品"
      type="switch"
      formType="switch"
      labelWidth=150
      name="hasHazardousChemical"
      :value="hasHazardousChemical"
    >
    </formItem>

    <formItem
      ref="hasFlammableStorage"
      :hjClass="hasFlammableStorageClass"
      label="是否有易燃存储物"
      type="switch"
      formType="switch"
      labelWidth=140
      name="hasFlammableStorage"
      :value="hasFlammableStorage"
    >
    </formItem>

    <label class="hj-social-unit-fire-control-form__item hj-social-unit-fire-control-form--none-border-bottom">
      <div class="hj-social-unit-fire-control-form__item__label">
        <span class="hj-social-unit-fire-control-form__item__label__label">
          单位正门图片
        </span>
      </div>
      <uploadImageFormItem
        ref="mainEntrancePicNameUrls"
        hjClass="hj-social-unit-fire-control-form__item__input"
        file-type="efm-socialUnit"
        :image-list="mainEntrancePicNameUrls"
      ></uploadImageFormItem>
    </label>
    <label class="hj-social-unit-fire-control-form__item hj-social-unit-fire-control-form--none-border-bottom">
      <div class="hj-social-unit-fire-control-form__item__label">
        <span class="hj-social-unit-fire-control-form__item__label__label">
          安全出口图片
        </span>
      </div>
      <uploadImageFormItem
        ref="exitPicNameUrls"
        hjClass="hj-social-unit-fire-control-form__item__input"
        file-type="efm-socialUnit"
        :image-list="exitPicNameUrls"
      ></uploadImageFormItem>
    </label>
    <label class="hj-social-unit-fire-control-form__item hj-social-unit-fire-control-form--none-border-bottom">
      <div class="hj-social-unit-fire-control-form__item__label">
        <span class="hj-social-unit-fire-control-form__item__label__label">
          消防栓图片
        </span>
      </div>
      <uploadImageFormItem
        ref="fireHydrantPicNameUrls"
        hjClass="hj-social-unit-fire-control-form__item__input"
        file-type="efm-socialUnit"
        :image-list="fireHydrantPicNameUrls"
      ></uploadImageFormItem>
    </label>
    <label class="hj-social-unit-fire-control-form__item hj-social-unit-fire-control-form--none-border-bottom">
      <div class="hj-social-unit-fire-control-form__item__label">
        <span class="hj-social-unit-fire-control-form__item__label__label">
          消防重点区域图片
        </span>
      </div>
      <uploadImageFormItem
        ref="importanceSectionPicNameUrls"
        hjClass="hj-social-unit-fire-control-form__item__input"
        file-type="efm-socialUnit"
        :image-list="importanceSectionPicNameUrls"
      ></uploadImageFormItem>
    </label>
    <label class="hj-social-unit-fire-control-form__item hj-social-unit-fire-control-form--none-border-bottom">
      <div class="hj-social-unit-fire-control-form__item__label">
        <span class="hj-social-unit-fire-control-form__item__label__label">
          火警疏散平面图
        </span>
      </div>
      <uploadImageFormItem
        ref="evacuationPlanPicNameUrls"
        hjClass="hj-social-unit-fire-control-form__item__input"
        file-type="efm-socialUnit"
        :image-list="evacuationPlanPicNameUrls"
      ></uploadImageFormItem>
    </label>
  </div>
</template>
<script>
// fireFacilityTypes	否	int[]	配备的消防设施种类
// numberOfFireLanes	否	int	消防车道数量
// numberOfExits	否	int	安全出口数量
// numberOfFireElevators	否	int	消防电梯数量
// numberOfFireExtinguishers	否	int	灭火器数量

// hasPowder	否	boolean	是否产生粉尘
// hasExplosiveGas	否	boolean	是否产生易燃易爆气体
// hasHazardousChemical	否	boolean	是否产生危险化学品
// hasFlammableStorage	否	boolean	是否有易燃存储物

// addedMainEntrancePics	否	string[]	新增的单位正门图片
// existedMainEntrancePics	否	string[]	已存在的单位正门图片
// mainEntrancePicNameUrls 单位正门图片

// addedExitPics	否	string[]	新增的安全出口图片
// existedExitPics	否	string[]	已存在的安全出口图片
// exitPicNameUrls 安全出口图片

// addedFireHydrantPics	否	string[]	新增的消防栓图片
// existedFireHydrantPics	否	string[]	已存在的消防栓图片
// fireHydrantPicNameUrls 消防栓图片

// addedImportanceSectionPics	否	string[]	新增的消防重点区域图片
// existedImportanceSectionPics	否	string[]	已存在的消防重点区域图片
// importanceSectionPicNameUrls 消防重点区域图片

// addedEvacuationPlanPics	否	string[]	新增的火警疏散平面图
// existedEvacuationPlanPics	否	string[]	已存在的火警疏散平面图
// evacuationPlanPicNameUrls 火警疏散平面图

import schema from "async-validator";
import uploadImageFormItem from "./upload-image-form-item.vue";
import formItem from "./form-item.vue";
import API from '@/store/flyio/apiUrl/home.js';
export default {
  name: "hj-social-unit-fire-control-form",
  components: {
    uploadImageFormItem,
    formItem
  },
  props: {
    descriptor: {
      type: Object,
      default: () => ({
        numberOfFireLanes: {
          type: "integer",
          message: "消防车道数量必须是整数"
        },
        numberOfExits: {
          type: "integer",
          message: "安全出口数量必须是整数"
        },
        numberOfFireElevators: {
          type: "integer",
          message: "消防电梯数量必须是整数"
        },
        numberOfFireExtinguishers: {
          type: "integer",
          message: "灭火器数量必须是整数"
        }
        // hasPowder: {
        //   type: "string",
        //   message: "必须填写详细地址"
        // },
        // hasExplosiveGas: {
        //   type: "integer",
        //   message: "必须填写所属行业"
        // },
        // hasHazardousChemical: {
        //   type: "string",
        //   message: "必须填写安全负责人"
        // },
        // hasFlammableStorage: {
        //   pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
        //   message: "必须填写电话号码"
        // }
      })
    }
  },
  data() {
    return {
      fireFacilityTypes: NaN, // **
      fireFacilityTypesList: [],

      numberOfFireLanes: "", // **
      numberOfExits: "", // **
      numberOfFireElevators: "", // **
      numberOfFireExtinguishers: "", // **

      hasPowder: true, // **
      hasExplosiveGas: false, // **
      hasHazardousChemical: false, // **
      hasFlammableStorage: false, // **

      mainEntrancePicNameUrls: [], // [{url:"http://tmp/wxbc47483790762e40.o6zAJszqP_lXqu7XQSPXvd2xEvoA.usqOIoH8OvoN86e2c3b5489f90803753c0c624ed10ae.jpg", name:"wxbc47483790762e40.o6zAJszqP_lXqu7XQSPXvd2xEvoA.usqOIoH8OvoN86e2c3b5489f90803753c0c624ed10ae.jpg"}]
      exitPicNameUrls: [],
      fireHydrantPicNameUrls: [],
      importanceSectionPicNameUrls: [],
      evacuationPlanPicNameUrls: [],

      fireFacilityTypesClass: "",
      numberOfFireLanesClass: "",
      numberOfExitsClass: "",
      numberOfFireElevatorsClass: "",
      numberOfFireExtinguishersClass: "",
      hasPowderClass: "",
      hasExplosiveGasClass: "",
      hasHazardousChemicalClass: "",
      hasFlammableStorageClass: "",
      errorClassStr: "hj-social-unit-fire-control-form--red-border-bottom"
    };
  },
  computed: {
    fireFacilityTypesStr() {
      if (
        this.fireFacilityTypesList &&
        this.fireFacilityTypesList.length &&
        !isNaN(this.fireFacilityTypes)
      ) {
        return this.fireFacilityTypesList[this.fireFacilityTypes].name;
      } else {
        return "请选择消防消防实施种类";
      }
    }
  },
  methods: {
    changeFireFacilityTypes(e) {
      console.log("changeFireFacilityTypes", e);
      this.fireFacilityTypes = e.mp.detail.value;
    },
    // changeHasPowder(e) {
    //   console.log("changeHasPowder", e.mp.detail.value);
    //   this.$nextTick(() => {
    //     wx.nextTick(() => {
    //       this.hasPower = e.mp.detail.value;
    //     });
    //   });
    // },
    // changeHasExplosiveGas(e) {
    //   console.log("changeHasExplosiveGas", e);
    //   this.$nextTick(() => {
    //     wx.nextTick(() => {
    //       this.hasExplosiveGas = e.mp.detail.value;
    //     });
    //   });
    // },
    // changeHasHazardousChemical(e) {
    //   console.log("changeHasHazardousChemical", e);
    //   this.$nextTick(() => {
    //     wx.nextTick(() => {
    //       this.hasHazardousChemical = e.mp.detail.value;
    //     });
    //   });
    // },
    // changeHasFlammableStorage(e) {
    //   console.log("changeHasFlammableStorage", e);
    //   this.$nextTick(() => {
    //     wx.nextTick(() => {
    //       this.hasFlammableStorage = e.mp.detail.value;
    //     });
    //   });
    // },
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
    getFormData() {
      // var fireFacilityTypes = this.getFireFacilityTypesIdByIndex(this.fireFacilityTypes);
      var formData = {
        fireFacilityTypes: this.getFireFacilityTypesIdByIndex(
          this.fireFacilityTypes
        ),
        numberOfFireLanes: this.$refs.numberOfFireLanes.getVal(),
        numberOfExits: this.$refs.numberOfExits.getVal(),
        numberOfFireElevators: this.$refs.numberOfFireElevators.getVal(),
        numberOfFireExtinguishers: this.$refs.numberOfFireExtinguishers.getVal(),
        hasPowder: this.$refs.hasPowder.getVal(),
        hasExplosiveGas: this.$refs.hasExplosiveGas.getVal(),
        hasHazardousChemical: this.$refs.hasHazardousChemical.getVal(),
        hasFlammableStorage: this.$refs.hasFlammableStorage.getVal()
      };

      return { ...formData, ...this.getPics() };
    },
    getPics() {
      return {
        addedMainEntrancePics: this.$refs.mainEntrancePicNameUrls.getAttachments(),
        addedExitPics: this.$refs.exitPicNameUrls.getAttachments(),
        addedFireHydrantPics: this.$refs.fireHydrantPicNameUrls.getAttachments(),
        addedImportanceSectionPics: this.$refs.importanceSectionPicNameUrls.getAttachments(),
        addedEvacuationPlanPics: this.$refs.evacuationPlanPicNameUrls.getAttachments(),
        existedMainEntrancePics: this.mainEntrancePicNameUrls.map(
          item => item.url
        ),
        existedExitPics: this.exitPicNameUrls.map(item => item.url),
        existedFireHydrantPics: this.fireHydrantPicNameUrls.map(
          item => item.url
        ),
        existedImportanceSectionPics: this.importanceSectionPicNameUrls.map(
          item => item.url
        ),
        existedEvacuationPlanPics: this.evacuationPlanPicNameUrls.map(
          item => item.url
        )
      };
    },
    // convertArrToStr(arr) {
    //   if (!Array.isArray(arr) || !arr.length) {
    //     return "";
    //   } else {
    //     return JSON.stringify(
    //       arr.map(item => {
    //         if (typeof item == "object") {
    //           return item.url;
    //         } else {
    //           return item;
    //         }
    //       })
    //     );
    //   }
    // },
    validateAndGetFormData() {
      return new Promise((resolve, reject) => {
        this.resetFormItemClass();
        var numberOfFireLanes = this.$refs.numberOfFireLanes.getVal();
        var numberOfExits = this.$refs.numberOfExits.getVal();
        var numberOfFireElevators = this.$refs.numberOfFireElevators.getVal();
        var numberOfFireExtinguishers = this.$refs.numberOfFireExtinguishers.getVal();

        this.validator({
          numberOfFireLanes: numberOfFireLanes === "" ? 0 : numberOfFireLanes,
          numberOfExits: numberOfExits === "" ? 0 : numberOfExits,
          numberOfFireElevators:
            numberOfFireElevators === "" ? 0 : numberOfFireElevators,
          numberOfFireExtinguishers:
            numberOfFireExtinguishers === "" ? 0 : numberOfFireExtinguishers
        })
          .then(res => {
            console.log(
              "social unit fire control form validated",
              this.getFormData()
            );
            resolve(this.getFormData());
          })
          .catch(res => {
            console.log("is not be validated", res);
            if (res && res.errors.length) {
              // if()
              // latitude
              // longitude
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
    resetFormItemClass() {
      this.fireFacilityTypesClass = "";
      this.numberOfFireLanesClass = "";
      this.numberOfExitsClass = "";
      this.numberOfFireElevatorsClass = "";
      this.numberOfFireExtinguishersClass = "";
      this.hasPowderClass = "";
      this.hasExplosiveGasClass = "";
      this.hasHazardousChemicalClass = "";
      this.hasFlammableStorageClass = "";
    },
    // setEmptyData() {},
    setEmptyDataAndInitByData(data) {
      this.reset();
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.setData(data);
        });
      });
    },
    reset() {
      this.resetFormItemClass();
      this.fireFacilityTypes = NaN;
      this.numberOfFireLanes = "";
      this.numberOfExits = "";
      this.numberOfFireElevators = "";
      this.numberOfFireExtinguishers = "";
      this.hasPowder = false;
      this.hasExplosiveGas = false;
      this.hasHazardousChemical = false;
      this.hasFlammableStorage = false;
      this.mainEntrancePicNameUrls = [];
      this.exitPicNameUrls = [];
      this.fireHydrantPicNameUrls = [];
      this.importanceSectionPicNameUrls = [];
      this.evacuationPlanPicNameUrls = [];
    },
    setData(data) {
      console.log("socialUnitFireControlFormIsReady", data);
      this.fireFacilityTypes = this.getFireFacilityTypesIndexById(
        data.fireFacilityTypes
      );
      this.numberOfFireLanes = data.numberOfFireLanes;
      this.numberOfExits = data.numberOfExits;
      this.numberOfFireElevators = data.numberOfFireElevators;
      this.numberOfFireExtinguishers = data.numberOfFireExtinguishers;
      this.hasPowder = data.hasPowder || false;
      this.hasExplosiveGas = data.hasExplosiveGas || false;
      this.hasHazardousChemical = data.hasHazardousChemical || false;
      this.hasFlammableStorage = data.hasFlammableStorage || false;
      this.mainEntrancePicNameUrls = this.getUrlsForPre(
        data.mainEntrancePicNameUrls
      );
      this.exitPicNameUrls = this.getUrlsForPre(data.exitPicNameUrls);
      this.fireHydrantPicNameUrls = this.getUrlsForPre(
        data.fireHydrantPicNameUrls
      );
      this.importanceSectionPicNameUrls = this.getUrlsForPre(
        data.importanceSectionPicNameUrls
      );
      this.evacuationPlanPicNameUrls = this.getUrlsForPre(
        data.evacuationPlanPicNameUrls
      );
    },
    getUrlsForPre(arr, pre) {
      var pre = pre || API.requestDomain;
      if (!Array.isArray(arr) || !arr.length) {
        return [];
      }
      return arr.map(item => {
        return {
          name: item.name,
          url: item.url.indexOf(pre) > -1 ? item.url : pre + item.url
        };
      });
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    },
    getFireFacilityTypesIdByIndex(index) {
      var result = "";
      this.fireFacilityTypesList.some((item, idx) => {
        if (index === idx) {
          result = item.id;
          return true;
        } else {
          return false;
        }
      });
      return result;
    },
    getFireFacilityTypesIndexById(id) {
      var result = NaN;
      this.fireFacilityTypesList.some((item, index) => {
        if (item.id == id) {
          result = index;
          return true;
        } else {
          return false;
        }
      });
      return result;
    },
    getFireFacilityTypesList() {
      this.$http("socialUnitsFireFacilityTypes", {}, { method: "get" }).then(
        res => {
          this.fireFacilityTypesList = res.data;
          this.$emit("be-readied");
        }
      );
    }
  },
  mounted() {
    this.getFireFacilityTypesList();
  }
};
</script>
<style lang="scss">
.hj-social-unit-fire-control-form {
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
      &--switch {
        text-align: right;
        padding-bottom: 5px;
        // justify-content: flex-end;
        // display: flex;
      }
    }
    &--switch {
      flex-direction: row;
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
