<template>
  <div class="hj-social-unit-form">

    <formItem
      ref="name"
      :hjClass="nameClass"
      label="社会单位名称"
      type="text"
      required
      orientation="vertical"
      name="name"
      placeholder="请输入社会单位名称"
      :value="name"
    >
    </formItem>

    <!-- <label
      class="hj-social-unit-form__item"
      for="name"
      :class="nameClass"
    >
      <div class="hj-social-unit-form__item__label">
        <span class="hj-social-unit-form__item__label__icon">*</span>
        <span class="hj-social-unit-form__item__label__label">
          社会单位名称:
        </span>
      </div>
      <input
        name="name"
        class="hj-social-unit-form__item__input"
        type="text"
        v-model="name"
        placeholder="请输入社会单位名称"
        @change="changeName"
      >
    </label> -->

    <label
      class="hj-social-unit-form__item--without-bottom"
      for="address"
    >
      <div class="hj-social-unit-form__item__label">
        <span class="hj-social-unit-form__item__label__icon">*</span>
        <span class="hj-social-unit-form__item__label__label">
          地址
        </span>
      </div>
      <div
        class="hj-social-unit-form__item__input hj-social-unit-form--blue-border-bottom hj-social-unit-form__item__input__addrwraper"
        :class="addrjsonClass"
        @click.stop="chooseLocationAct"
      >
        <picker
          class="hj-social-unit-form__item__input__model"
          mode="region"
          disabled
          name="address"
          v-model="address"
          :custom-item="customItem"
          @change="changeAddress"
        >
          <div>
            <div v-if="!isShowLocationAuth">
              {{addressStr}}
            </div>
            <div v-if="isShowLocationAuth">
              <!-- <button
                open-type="getUserLocation"
                size="mini"
                @click="authLocation"
              >授权查询地址信息</button> -->
              <!-- <button bindtap="openSetting">打开设置页</button> -->
              <button
                @tap="openSetting"
                size="mini"
              >打开设置页</button>
              <!-- <button
                open-type="openSetting"
                size="mini"
                @opensetting="authLocation"
                @click.stop="setLocationEnv"
              >打开设置页</button> -->
            </div>
          </div>
        </picker>
        <wux-icon
          class="hj-social-unit-form__item__input__icon"
          type="ios-arrow-forward"
          size="22"
        ></wux-icon>
      </div>
      <label
        class="hj-social-unit-form__item__remark hj-social-unit-form--blue-border-bottom"
        for="remark"
        :class="remarkClass"
      >
        <div class="hj-social-unit-form__item__label">
          <span class="hj-social-unit-form__item__label__icon">*</span>
          <span class="hj-social-unit-form__item__label__label">
            详细地址
          </span>
        </div>

        <input
          class="hj-social-unit-form__item__remark__input hj-social-unit-form__item__input"
          name="remark"
          type="text"
          v-model="remark"
          @change="changeRemark"
        >
      </label>
    </label>
    <label
      class="hj-social-unit-form__item"
      for="industry"
      :class="industryClass"
    >
      <div class="hj-social-unit-form__item__label">
        <span class="hj-social-unit-form__item__label__icon">*</span>
        <span class="hj-social-unit-form__item__label__label">
          行业
        </span>
      </div>
      <div class="hj-social-unit-form__item__input hj-social-unit-form__item__input__addrwraper">
        <picker
          class="hj-social-unit-form__item__input__model"
          name="industry"
          mode="selector"
          :range="industryList"
          range-key="name"
          v-model="industry"
          @change="changeIndustry"
        >
          <div>
            {{industryStr}}
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
      ref="safetyManName"
      :hjClass="safetyManNameClass"
      label="安全责任人姓名"
      type="text"
      required
      orientation="vertical"
      name="safetyManName"
      placeholder="请选择安全责任人姓名"
      :value="safetyManName"
    >
    </formItem>
    <!-- <label
      class="hj-social-unit-form__item"
      for="safetyManName"
      :class="safetyManNameClass"
    >
      <div class="hj-social-unit-form__item__label">
        <span class="hj-social-unit-form__item__label__icon">*</span>
        <span class="hj-social-unit-form__item__label__label">
          安全责任人姓名:
        </span>
      </div>
      <input
        class="hj-social-unit-form__item__input"
        name="safetyManName"
        type="text"
        v-model="safetyManName"
        placeholder="请选择安全责任人姓名"
      >
    </label> -->
    <formItem
      ref="safetyManTel"
      :hjClass="safetyManTelClass"
      label="安全责任人电话"
      type="number"
      required
      orientation="vertical"
      name="safetyManTel"
      placeholder="请输入安全责任人电话"
      :value="safetyManTel"
    >
    </formItem>

    <!-- <label
      class="hj-social-unit-form__item"
      for="safetyManTel"
      :class="safetyManTelClass"
    >
      <div class="hj-social-unit-form__item__label">
        <span class="hj-social-unit-form__item__label__icon">*</span>
        <span class="hj-social-unit-form__item__label__label">
          安全责任人电话:
        </span>
      </div>
      <input
        class="hj-social-unit-form__item__input"
        name="safetyManTel"
        type="number"
        v-model="safetyManTel"
        placeholder="请输入安全责任人电话"
      >
    </label> -->
  </div>
</template>
<script>
// 参数名	必选	类型	说明
// registCode	是	string	注册码
// name	是	string	社会单位名称
// areaId	是	long	区域ID，城镇ID
// latitude	是	float	纬度
// longitude	是	float	经度
// addrjson	是	string	json格式地址
// industry	是	int	所属行业
// safetyManName	是	string	安全责任人姓名
// safetyManTel	是	string	安全责任人电话
// deviceName	是	string	设备名称
// deviceClassId	是	string	设备类型
// deviceBrandId	是	int	设备品牌
// deviceTypeId	是	int	设备型号
// commId	是	int	通信ID，默认为1
// location	是	string	设备位置
// mainCircuitCurrent	是	float	电流互感器规格，100、200等

// import Fly from "flyio/dist/npm/wx";
// const request = new Fly();
import coordtransform from "coordtransform";
import schema from "async-validator";
import formItem from "./form-item.vue";
export default {
  name: "hj-social-unit-form",
  components: {
    formItem
  },
  props: {
    // name: {
    //   type: String,
    //   default: ""
    // },
    // latitude: {
    //   type: Number,
    //   default: 0
    // },
    // longitude: {
    //   type: Number,
    //   default: 0
    // },
    // industry: {
    //   type: String,
    //   default: ""
    // },
    // safetyManName: {
    //   type: String,
    //   default: ""
    // },
    // safetyManTel: {
    //   type: [String, Number],
    //   default: ""
    // }
    descriptor: {
      type: Object,
      default: () => ({
        name: {
          type: "string",
          required: true,
          message: "必须填写社会单位名称"
        },
        addrjson: [
          {
            type: "object",
            required: true,
            message: "必须填写地址"
          }
          // {
          //   type: "enum",
          //   required: true,
          //   enum: [
          //     "country",
          //     "province",
          //     "city",
          //     "county",
          //     "town",
          //     "remark",
          //     "areaId"
          //   ],
          //   message:
          //     "该对象必须包含 country， province， city， county， town 等属性"
          // }
        ],
        latitude: {
          type: "float",
          required: true,
          message: "必须填写经纬度"
        },
        longitude: {
          type: "float",
          required: true,
          message: "必须填写经纬度"
        },
        remark: {
          type: "string",
          required: true,
          message: "必须填写详细地址"
        },
        industry: {
          type: "integer",
          required: true,
          message: "必须填写所属行业"
        },
        safetyManName: {
          type: "string",
          required: true,
          message: "必须填写安全负责人"
        },
        safetyManTel: {
          pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
          required: true,
          message: "必须填写电话号码"
        }
      })
    }
  },
  data() {
    return {
      name: "", // **
      addrjson: null, // **
      address: [],
      customItem: "全部",
      remark: "",
      latitude: "", // **
      longitude: "", // **
      industry: NaN, // **
      industryList: [],
      safetyManName: "", // **
      safetyManTel: "", // **

      nameClass: "",
      addrjsonClass: "",
      remarkClass: "",
      industryClass: "",
      safetyManNameClass: "",
      safetyManTelClass: "", // hj-social-unit-form--red-border-bottom
      errorClassStr: "hj-social-unit-form--red-border-bottom",
      isShowLocationAuth: false
    };
  },
  computed: {
    addressStr() {
      if (!this.address || !this.address.length) {
        return "请选择地址";
      } else {
        return `${this.address[0]}，${this.address[1]}，${this.address[2]}`;
      }
    },
    industryStr() {
      if (!isNaN(+this.industry) && this.industryList) {
        return this.industryList[this.industry].name;
      } else {
        return "请选择行业";
      }
    }
  },
  methods: {
    changeName(e) {
      console.info("changeName", e, this.name);
      // this.name = e.mp.detail.value;
    },
    openSetting() {
      this.$root.$mp.appOptions.query.from = "open-setting";
      wx.openSetting({
        success: res => {
          console.log("openSetting success", res);
        },
        fail: res => {
          console.log("openSetting fail", res);
        },
        complete: res => {
          console.log("openSetting complete", res);
          this.isShowLocationAuth = !res.authSetting["scope.userLocation"];
        }
      });
    },
    setLocationEnv() {
      this.$root.$mp.appOptions.query.from = "open-setting";
    },
    authLocation(e) {
      console.log("authLocation", e);
      this.isShowLocationAuth = e.mp.detail.authSetting["scope.userLocation"];
    },
    changeAddress(e) {
      console.info("changeAddress", e);
      // e.mp.detail.code   // array
      // e.mp.detail.postcode //number
      // e.mp.detail.value // array
      this.address = e.mp.detail.value;
    },
    changeRemark(e) {
      console.log("changeRemark", e);
      // this.remark = e.mp.detail.value;
    },
    changeIndustry(e) {
      console.log("changeIndustry", e);
      console.log("changeIndustry", this.industry);
      this.industry = +e.mp.detail.value;
    },
    chooseIndustry(e) {
      console.log("chooseIndustry", e);
      this.$http(
        "industries",
        {},
        {
          method: "get",
          headers: {
            "content-type": "application/json"
          }
        }
      ).then(res => {
        console.log("chooseIndustry res", res);
        this.industryList = res.data;

        console.log("emit be-readied");
        this.$emit("be-readied");

        // this.$nextTick(() => {
        //   wx.nextTick(() => {
        //     console.log("emit be-readied");
        //     this.$emit("be-readied");
        //   });
        // });
      });
    },
    chooseLocation(e) {
      console.info("chooseLocation", e);

      this.$root.$mp.appOptions.query.from = "choose-location";
      this.$emit("hj-choose-location");
      wx.chooseLocation({
        success: e => {
          console.info("chooseLocation success", e);
          if (e.address || e.name) {
            var addressStr = e.address;
            this.latitude = e.latitude;
            this.longitude = e.longitude;
            this.mapJsonp(e.latitude, e.longitude).then(res => {
              console.log('chooseLocation mapJsonp', res)
              if (res) {
                // res.remark = res.remark + e.name;
                this.addrjson = res;
                this.remark = res.remark;
                this.address = [res.province, res.city, res.county];
              }
            });
          }
        },
        fail: e => {
          console.info("chooseLocation fail", e);
          // wx.authorize({
          //   scope: "scope.userLocation",
          //   success: res => {
          //     console.info("authorize", res);
          //   },
          //   fail: res => {
          //     console.info("get scope userInfo", res);
          //   }
          // });
        },
        complete: e => {
          console.info("chooseLocation complete", e, e.errMsg);
          console.log("this", this.$root.$mp.appOptions.query);
        }
      });
    },
    chooseLocationAct(e) {
      wx.getSetting({
        success: res => {
          console.log("res.authSetting", res.authSetting);
          if (res.authSetting["scope.userLocation"]) {
            this.chooseLocation(e);
          } else {
            wx.authorize({
              scope: 'scope.userLocation',
              success: res =>{
                console.log('获取位置权限成功');
                this.chooseLocation(res);
              },
              fail: res => {
                console.log('获取位置权限失败');
              },
              complete: res => {
                console.log('获取位置权限完成');
              }
            });
          }
        }
      });
    },
    mapJsonp(lat, lng) {
      console.info("mapJsonp", lat, lng);
      // 高德火星坐标
      // var locationObj = bdToGc(lat, lng); // locationObj.lng + "," + locationObj.lat
      // var getDataUrl =
      //   "https://restapi.amap.com/v3/geocode/regeo?output=json&key=0ccbdaff7f5e64f5de6ffaa933fa5f85&location=经纬度";
      // getDataUrl = getDataUrl.replace("经纬度", "" + lng + "," + lat);

      return new Promise((resolve, reject) => {
        var gdApiUrl =
          // "https://restapi.amap.com/v3/geocode/regeo?output=json&key=0ccbdaff7f5e64f5de6ffaa933fa5f85";
          "amapAdress";
        this.$http(
          gdApiUrl,
          {
            // location: "" + lng + "," + lat
            lng,
            lat
          },
          {
            method: "get",
            headers: {
              "content-type": "application/json"
            }
          }
        )
          .then(res => {
            console.info("mapJsonp success", res);
            var regeocode = res.data.regeocode;
            var formatted_address = regeocode.formatted_address;
            var addressComponent = regeocode.addressComponent; // {adcode:"440305",city:"深圳市",citycode:"0755",country:"中国",district:"南山区",province:"广东省",streetNumber:{  direction:"南",  distance:"34.223",  location:"113.930479,22.5330189",  number:"2号B座",  street:"桃园路"},towncode:"440305001000",township:"南头街道",}
            var {
              country,
              province,
              city,
              district: county,
              township: town,
              towncode: areaId
            } = addressComponent;
            var remarkLen = formatted_address.indexOf(town) + town.length;
            var remark = formatted_address.slice(remarkLen);
            var addrjson = {
              country,
              province,
              city,
              county,
              town,
              remark,
              areaId
            };
            console.info("addrjson", addrjson);
            resolve(addrjson);
          })
          .catch(res => {
            console.info("mapJsonp fail", res);
            reject(res);
          });
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
    getFormDataObj() {
      var gcj02tobd09 = coordtransform.gcj02tobd09(
        this.latitude,
        this.longitude
      );
      var latitude = gcj02tobd09[0];
      var longitude = gcj02tobd09[1];
      this.addrjson && (this.addrjson.remark = this.remark);
      console.log(" this.$refs.name.getVal()", this.$refs.name.getVal());
      var formData = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        addrjson: JSON.stringify(this.addrjson),
        areaId: this.addrjson.areaId,
        name: this.$refs.name.getVal(),
        industry: this.industryList[this.industry].id,
        safetyManName: this.$refs.safetyManName.getVal(),
        safetyManTel: this.$refs.safetyManTel.getVal()
      };
      return formData;
    },
    validateAndGetFormData() {
      return new Promise((resolve, reject) => {
        this.resetFormItemClass();
        console.log(
          "validateAndGetFormData",
          this.latitude,
          this.longitude,
          (this.addrjson && { ...this.addrjson }) || null,
          this.addrjson
        );
        var name = this.$refs.name.getVal();
        var safetyManName = this.$refs.safetyManName.getVal();
        var safetyManTel = this.$refs.safetyManTel.getVal();
        console.log("this.$refs.name.getVal()", this.$refs.name.getVal());
        this.validator({
          latitude: (this.latitude && parseFloat(this.latitude)) || NaN,
          longitude: (this.longitude && parseFloat(this.longitude)) || NaN,
          addrjson: (this.addrjson && { ...this.addrjson }) || null,
          remark: this.remark || NaN,
          name: name || NaN,
          industry:
            (isNaN(this.industry) && "--") ||
            (this.industryList[this.industry] &&
              this.industryList[this.industry].id),
          safetyManName: safetyManName || NaN,
          safetyManTel: (safetyManTel && parseInt(safetyManTel)) || NaN
        })
          .then(res => {
            console.log("social unit form validated", this.getFormDataObj());
            resolve(this.getFormDataObj());
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
                if (item.field != "latitude" && item.field != "longitude") {
                  this[item.field + "Class"] = this.errorClassStr;
                }
              });
            }
            reject(false);
          });
      });
    },
    resetFormItemClass() {
      this.nameClass = "";
      this.addrjsonClass = "";
      this.remarkClass = "";
      this.industryClass = "";
      this.safetyManNameClass = "";
      this.safetyManTelClass = "";
    },
    // setEmptyData() {},
    reset() {
      this.name = " ";
      this.safetyManName = " ";
      this.safetyManTel = " ";
      // this.resetBlankData();
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.resetBlankData();
        });
      });
    },
    resetDataAndInitByData(data) {
      this.reset();
      this.$nextTick(() => {
        wx.nextTick(() => {
          this.setData(data);
        });
      });
    },
    resetBlankData() {
      this.resetFormItemClass();
      this.name = "";
      this.addrjson = null;
      this.address = [];
      this.remark = "";
      this.latitude = "";
      this.longitude = "";
      this.industry = NaN;
      this.safetyManName = "";
      this.safetyManTel = "";
    },
    setData(data) {
      this.resetFormItemClass();
      this.name = data.name;
      this.addrjson = { ...data.addrjson, areaId: data.areaId };
      this.remark = data.addrjson.remark;
      this.latitude = data.latitude;
      this.longitude = data.longitude;
      this.safetyManName = data.manResponsibleForFireSecurity.name;
      this.safetyManTel = data.manResponsibleForFireSecurity.tel;
      this.address = [
        data.addrjson.province,
        data.addrjson.city,
        data.addrjson.county
      ];

      this.industry = this.getIndustryIndexById(data.industry.id);
      // name
      // addrjson
      // address
      // remark
      // latitude
      // longitude
      // industry
      // safetyManName
      // safetyManTel
    },
    getIndustryIndexById(id) {
      var result = 0;
      this.industryList.some((item, index) => {
        if (item.id == id) {
          result = index;
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
    // wx.getSetting({
    //   success: res => {
    //     console.log("res.authSetting", res.authSetting);
    //     // res.authSetting = {
    //     //   "scope.userInfo": true,
    //     //   "scope.userLocation": true
    //     // }
    //     this.isShowLocationAuth = !res.authSetting["scope.userLocation"];
    //   }
    // });
    this.chooseIndustry();
  }
};
</script>
<style lang="scss">
.hj-social-unit-form {
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
