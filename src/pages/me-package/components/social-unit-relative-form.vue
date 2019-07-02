<template>
  <div class="hj-social-unit-relative-form">
    <label
      class="hj-social-unit-relative-form__item"
      for="installDate"
      :class="installDateClass"
    >
      <div class="hj-social-unit-relative-form__item__label">
        <span class="hj-social-unit-relative-form__item__label__label">
          安装日期
        </span>
      </div>
      <input
        class="hj-social-unit-relative-form__item__input"
        name="installDate"
        type="text"
        v-model.trim="installDate"
        disabled
        placeholder="请选择安装日期"
      >
    </label>

    <formItem
      ref="installedCompany"
      :hjClass="installedCompanyClass"
      label="安装商名称"
      type="text"
      orientation="vertical"
      name="installedCompany"
      placeholder="请输入安装商名称"
      :value="installedCompany"
    >
    </formItem>

    <formItem
      ref="areaCovered"
      :hjClass="areaCoveredClass"
      label="占地面积（m2）"
      type="number"
      orientation="vertical"
      name="areaCovered"
      placeholder="请输入占地面积"
      :value="areaCovered"
    >
    </formItem>

    <formItem
      ref="grossFloorArea"
      :hjClass="grossFloorAreaClass"
      label="建筑面积（m2）"
      type="number"
      orientation="vertical"
      name="grossFloorArea"
      placeholder="请输入占地面积"
      :value="grossFloorArea"
    >
    </formItem>

    <label
      class="hj-social-unit-form__item"
      for="nature"
      :class="natureClass"
    >
      <div class="hj-social-unit-form__item__label">
        <span class="hj-social-unit-form__item__label__label">
          社会单位性质
        </span>
      </div>
      <div class="hj-social-unit-form__item__input hj-social-unit-form__item__input__addrwraper">
        <picker
          class="hj-social-unit-form__item__input__model"
          name="nature"
          mode="selector"
          :range="natureList"
          range-key="name"
          v-model="nature"
          @change="changeNature"
        >
          <div>
            {{natureStr}}
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
      ref="numberOfEmployees"
      :hjClass="numberOfEmployeesClass"
      label="从业人数"
      type="number"
      orientation="vertical"
      name="numberOfEmployees"
      placeholder="请输入从业人数"
      :value="numberOfEmployees"
    >
    </formItem>

    <formItem
      ref="contactNumber"
      :hjClass="contactNumberClass"
      label="单位联系电话"
      type="text"
      orientation="vertical"
      name="contactNumber"
      placeholder="请输入单位联系电话"
      :value="contactNumber"
    >
    </formItem>

    <formItem
      ref="contactEmail"
      :hjClass="contactEmailClass"
      label="单位邮箱"
      type="text"
      orientation="vertical"
      name="contactEmail"
      placeholder="请输入单位邮箱"
      :value="contactEmail"
    >
    </formItem>
  </div>
</template>
<script>
// id	是	int	社会单位ID,填充在URL中
// name	是	string	社会单位名称
// areaId	是	long	区域ID，城镇ID
// latitude	是	float	纬度
// longitude	是	float	经度
// addrjson	是	string	json格式地址
// industry	是	int	所属行业
// safetyManName	是	string	安全责任人姓名
// safetyManTel	是	string	安全责任人电话

// installedCompany	否	string	安装商
// areaCovered	否	float	占地面积
// grossFloorArea	否	float	建筑面积
// nature	否	int	社会单位性质
// numberOfEmployees	否	int	从业人数
// contactNumber	否	string	单位联系电话
// contactEmail	否	string	单位邮箱

import schema from "async-validator";
import formItem from "./form-item.vue";
//  {type: "string", required: true, pattern: schema.pattern.email}
// var descriptor = {
//   email: [
//     {type: "string", required: true, pattern: schema.pattern.email},
//     {validator(rule, value, callback, source, options) {
//       var errors = [];
//       // test if email address already exists in a database
//       // and add a validation error to the errors array if it does
//       callback(errors);
//     }}
//   ]
// }

// var validator = function(type) {
//   return function(rule, value, callback, source, options) {};
// };

export default {
  name: "hj-social-unit-relative-form",
  components: {
    formItem
  },
  props: {
    descriptor: {
      type: Object,
      default: () => ({
        // installedCompany: {
        //   type: "string",
        //   message: ""
        // },
        // areaCovered: {
        //   type: "float", // number
        //   message: "占地面积必须是浮点数"
        // },
        // grossFloorArea: {
        //   type: "float", // number
        //   message: "建筑面积"
        // },
        // nature: {
        //   type: "integer", // number
        //   message: ""
        // },
        // numberOfEmployees: {
        //   type: "integer", //number
        //   message: ""
        // },
        contactNumber: {
          pattern: /^(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-?[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})$/,
          message: "请输入正确的电话"
        },
        contactEmail: {
          type: "email",
          message: "请输入正确的邮箱"
        }
      })
    }
  },
  data() {
    return {
      installDate: "", // 仅展示
      installedCompany: "", // **
      areaCovered: "", // **
      grossFloorArea: "", // **
      nature: NaN, // **
      numberOfEmployees: "", // **
      contactNumber: "", // **
      contactEmail: "", // **

      natureList: [],

      installDateClass: "",
      installedCompanyClass: "",
      areaCoveredClass: "",
      grossFloorAreaClass: "",
      natureClass: "",
      numberOfEmployeesClass: "",
      contactNumberClass: "",
      contactEmailClass: "",
      errorClassStr: "hj-social-unit-relative-form--red-border-bottom"
    };
  },
  computed: {
    natureStr() {
      if (
        this.natureList &&
        this.natureList.length &&
        !Number.isNaN(this.nature)
      ) {
        return this.natureList[this.nature].name;
      } else {
        return "请选择社会性质";
      }
    }
  },
  methods: {
    changeContactNumber(e) {
      // if (e.mp.detail.value !== this.contactNumber) {
      //     var isTelAndMobile = /^(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})$/;
      //     var isTel = /^0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4}$/;
      //     var isMobile = /^1[3|4|5|6|7|8][0-9]{9}$/;
      //     if(!isTelAndMobile.test(e.mp.detail.value)) {
      //       this.contactNumber =  e.mp.detail.value.replace('/([^-\d])/g')
      //     }
      // }
    },
    changeNature(e) {
      console.log("changeNature", e);
      this.nature = +e.mp.detail.value;
    },
    getNatureList() {
      this.$http("socialUnitsNatures", {}, { method: "get" }).then(res => {
        console.log("socialUnitsNatures", res);
        this.natureList = res.data;
        this.$emit("be-readied");
      });
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
    getFormData() {
      var formData = {
        installedCompany: this.$refs.installedCompany.getVal(),
        areaCovered: this.$refs.areaCovered.getVal(),
        grossFloorArea: this.$refs.grossFloorArea.getVal(),
        nature: this.getNatrueIdByIndex(this.nature), //
        numberOfEmployees: this.$refs.numberOfEmployees.getVal(),
        contactNumber: this.$refs.contactNumber.getVal(), // -
        contactEmail: this.$refs.contactEmail.getVal()
      };

      return formData;
    },
    validateAndGetFormData() {
      return new Promise((resolve, reject) => {
        this.resetFormItemClass();
        var contactNumber = this.$refs.contactNumber.getVal();
        var contactEmail = this.$refs.contactEmail.getVal();

        if (!contactNumber && !contactEmail) {
          resolve(this.getFormData());
        } else {
          var descriptor = {};
          var formData = {};
          if (contactNumber) {
            formData.contactNumber = contactNumber;
            descriptor.contactNumber = this.descriptor.contactNumber;
          }
          if (contactEmail) {
            formData.contactEmail = contactEmail;
            descriptor.contactEmail = this.descriptor.contactEmail;
          }

          this.validator(formData, descriptor)
            .then(res => {
              console.log(
                "social unit relative  form validated",
                this.getFormData()
              );
              resolve(this.getFormData());
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
        }
      });
    },
    resetFormItemClass() {
      this.installDateClass = "";
      this.installedCompanyClass = "";
      this.areaCoveredClass = "";
      this.grossFloorAreaClass = "";
      this.natureClass = "";
      this.numberOfEmployeesClass = "";
      this.contactNumberClass = "";
      this.contactEmailClass = "";
    },
    reset() {
      this.resetFormItemClass();
    },
    setData(data) {
      console.log("socialUnitRelativeForm init data", data);
      this.resetFormItemClass();
      this.installDate = data.installedDate;
      this.installedCompany = data.installedCompany;
      this.areaCovered = data.areaCovered;
      this.grossFloorArea = data.grossFloorArea;
      this.nature = this.getNatureIndexById(data.nature.id);
      this.numberOfEmployees = data.numberOfEmployees;
      this.contactNumber = data.contactNumber;
      this.contactEmail = data.contactEmail;
    },
    getNatureIndexById(id) {
      var result = NaN;
      this.natureList.some((item, index) => {
        if (item.id == id) {
          result = index;
          return true;
        } else {
          return false;
        }
      });
      return result;
    },
    getNatrueIdByIndex(index) {
      var result = "";
      this.natureList.some((item, idx) => {
        if (index == idx) {
          result = item.id;
          return true;
        } else {
          return false;
        }
      });
      return result;
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
    this.getNatureList();
  }
};
</script>
<style lang="scss">
.hj-social-unit-relative-form {
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
