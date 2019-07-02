<template>
  <div class="hj-edit-social-unit-form">
    <form
      @submit="onFormSubmit"
      @reset="onReset"
      @change="change"
    >
      <socialUnitForm
        ref="socialUnitForm"
        @be-readied="onSocialUnitFormReady"
      >
      </socialUnitForm>
      <div v-if="isShowMore">
        <div class="hj-edit-social-unit-form__title">
          <div
            class="hj-edit-social-unit-form__title__label"
            style="background-color: rgba(102, 119, 233, 1);"
          >
            关联信息
          </div>
        </div>
        <socialUnitRelativeForm
          ref="socialUnitRelativeForm"
          @be-readied="onSocialUnitRelativeFormReady"
        ></socialUnitRelativeForm>
        <div class="hj-edit-social-unit-form__title">
          <div class="hj-edit-social-unit-form__title__label">
            消防相关信息
          </div>
        </div>
        <socialUnitFireControlForm
          ref="socialUnitFireControlForm"
          @be-readied="onSocialUnitFireControlFormReady"
        ></socialUnitFireControlForm>
      </div>

      <div style="text-align:center;margin-top:20px;display:flex;align-items:center;justify-content:center;">
        <div @click.stop="showMore">
          <wux-icon
            v-if="!isShowMore"
            type="ios-arrow-down"
            color="#6678E9"
          >
          </wux-icon>
          <wux-icon
            v-if="isShowMore"
            type="ios-arrow-up"
            color="#6678E9"
          >
          </wux-icon>
        </div>

      </div>
      <div class="hj-edit-social-unit-form__btn__container">
        <button
          class="hj-edit-social-unit-form__btn--next"
          formType="submit"
          @click="save"
        > 保存
        </button>
      </div>
    </form>

  </div>
</template>
<script>
import socialUnitForm from "../components/social-unit-form.vue";
import socialUnitRelativeForm from "../components/social-unit-relative-form.vue";
import socialUnitFireControlForm from "../components/social-unit-fire-control-form.vue";
export default {
  onShow() {
    console.log('edit-social-unit-form onShow')
    console.log(
      "edit-social-unit-form onShow this.$root.$mp.appOptions.query.from",
      this.$root.$mp.appOptions.query, this.isMounted
    );
    if (this.isMounted) {
      if (this.$root.$mp.appOptions.query.from == "socialUnitMng") {
        this.init();
      }
      if (this.$root.$mp.appOptions.query.from) {
        this.$root.$mp.appOptions.query.from = "";
      }
    }
  },
  onUnload() {
    // this.isMounted = false;
  },
  name: "hj-edit-social-unit-form",
  components: {
    socialUnitForm,
    socialUnitRelativeForm,
    socialUnitFireControlForm
  },
  data() {
    return {
      isShowMore: false,
      isMounted: false,
      initialData: null,
      params: {
        id: ""
      },
      socialUnitFormIsReady: false,
      socialUnitRelativeFormIsReady: false
    };
  },
  methods: {
    onSocialUnitFormReady() {
      console.log("onSocialUnitFormReady", !!this.initialData);
      this.socialUnitFormIsReady = true;
      if (this.initialData) {
        this.$refs.socialUnitForm.setData(this.initialData);
      }
    },
    onSocialUnitRelativeFormReady() {
      console.log("onSocialUnitFormReady", !!this.initialData);
      this.socialUnitRelativeFormIsReady = true;
      if (this.initialData) {
        this.$refs.socialUnitRelativeForm.setData(this.initialData);
      }
    },
    onSocialUnitFireControlFormReady() {
      console.log("onSocialUnitFormReady", !!this.initialData);
      this.socialUnitFireControlFormIsReady = true;
      if (this.initialData) {
        this.$refs.socialUnitFireControlForm.setData(this.initialData.fireInfo);
      }
    },
    showMore() {
      this.isShowMore = !this.isShowMore;
    },
    change(e) {
      console.log("change form", e);
    },

    onFormSubmit(e) {
      console.log("onFormSubmit", e);
      if (this.isShowMore) {
        // 由于mpVue没有进行藏检查，导致 setData时把整个this.data中的属性值全部设置为page的data，导致页面出现数据设置不同步的问题。
        // var totalFormData = e.mp.detai.value;
        // var {
        //   hasExplosiveGas,
        //   hasFlammableStorage,
        //   hasHazardousChemical,
        //   hasPowder
        // } = totalFormData;
        // this.switchObj = {
        //   hasExplosiveGas,
        //   hasFlammableStorage,
        //   hasHazardousChemical,
        //   hasPowder
        // };
        // var {
        //   numberOfFireLanes,
        //   numberOfExits,
        //   numberOfFireElevators,
        //   numberOfFireExtinguishers
        // } = totalFormData;
        // this.relativeForm = {
        //   numberOfFireLanes,
        //   numberOfExits,
        //   numberOfFireElevators,
        //   numberOfFireExtinguishers
        // };
      }
    },
    onReset(e) {
      console.log("onReset", e);
    },
    reset(e) {
      console.log("reset", e);
    },
    save(e) {
      console.log("submit", e);
      var promiseArr = [this.$refs.socialUnitForm.validateAndGetFormData()];
      if (this.isShowMore) {
        promiseArr.push(
          this.$refs.socialUnitRelativeForm.validateAndGetFormData(),
          this.$refs.socialUnitFireControlForm.validateAndGetFormData()
        );
      }
      Promise.all(promiseArr)
        .then(res => {
          console.log("submit save promise all", res);
          var params = null;
          res.forEach(item => {
            if (item) {
              params = params ? { ...params, ...item } : { ...item };
            }
          });
          // if (this.isShowMore && this.switchObj) {
          //   params = { ...params, ...this.switchObj };
          //   if (this.relativeForm) {
          //     Object.keys(this.relativeForm).forEach(key => {
          //       if (!this.relativeForm[key] && this.relativeForm[key] !== 0) {
          //         params[key] = "";
          //       } else {
          //         params[key] = this.relativeForm[key];
          //       }
          //     });
          //   }
          // }

          console.log("all params", params);
          this.modifySocialUnit(params);
        })
        .catch(res => {
          console.log("submit edit social unit form", res);
        });
    },
    modifySocialUnit(params) {
      if (!params) {
        return;
      }
      params.id = this.$root.$mp.query.id;
      this.$http("socialUnitsDetail", params, { method: "put" })
        .then(res => {
          console.log("socialUnitsDetail", res);
          // this.showToast("修改社会单位成功");
          this.timer = setTimeout(() => {
              wx.showToast({
                title: "修改社会单位成功",
                icon: "success",
                mask: true,
                duration: 3000,
                complete: () => {
                  wx.setStorageSync("fromPage", "edit-social-unit");
                  wx.navigateBack({ delta: 1 });
                }
              });
            }, 1000);
        })
        .catch(res => {
          console.log("socialUnitsDetail catch", res);
          this.showToast("修改社会单位失败");
        });
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    },
    processData(data) {
      //      {
      //   "address": "深圳市南山区西丽街道办事处新能源创新产业园",
      //   "addrjson": {
      //     "country": "中国",
      //     "province": "广东省",
      //     "city": "深圳市",
      //     "county": "南山区",
      //     "town": "西丽街道办事处",
      //     "remark": "新能源创新产业园"
      //   },
      //   "areaCovered": 3200,
      //   "areaId": 440305009000,
      //   "contactEmail": "service@huajiesolar.com",
      //   "contactNumber": "0755-33258754",
      //   "fireInfo": {
      //     "evacuationPlanPicNameUrls": "",
      //     "exitPicNameUrls": "",
      //     "fireFacilityTypes": "",
      //     "fireHydrantPicNameUrls": "",
      //     "hasExplosiveGas": false,
      //     "hasFlammableStorage": false,
      //     "hasHazardousChemical": false,
      //     "hasPowder": false,
      //     "importanceSectionPicNameUrls": "",
      //     "mainEntrancePicNameUrls": [{
      //       "name": "康和生.jpg!m_fill,w_600,h_400,lg_south_east,lx_-15,ly_-5,l_beike_logo,ls_60,f_jpg",
      //       "url": "/files/filestream?type=efm-socialUnit&id=1&filename=康和生.jpg!m_fill,w_600,h_400,lg_south_east,lx_-15,ly_-5,l_beike_logo,ls_60,f_jpg",
      //     }],
      //     "numberOfExits": "",
      //     "numberOfFireElevators": "",
      //     "numberOfFireExtinguishers": "",
      //     "numberOfFireLanes": "",
      //   },
      //   "grossFloorArea": 12000.32,
      //   "id": 1,
      //   "industry": {
      //     "id": 8,
      //     "name": "工厂"
      //   },
      //   "installedCompany": "华杰电气",
      //   "installedDate": "2018-09-15",
      //   "latitude": 22.568636,
      //   "longitude": 113.95918,
      //   "manResponsibleForFireSecurity": {
      //     "name": "杨桂椿",
      //     "tel": "13378956412"
      //   },
      //   "name": "华杰电气技术有限公司",
      //   "nature": {
      //     "id": 1,
      //     "name": "国有企业"
      //   },
      //   "numberOfEmployees": 324,
      // }
      // socialUnitForm data
      // if(!data){
      //   return {}
      // }
      //   var {
      // name,
      // addrjson,
      // address,
      // remark,
      // latitude,
      // longitude,
      // industry,
      // safetyManName,
      // safetyManTel,
      //   } = data
      //       return {
      //       }
    },
    initData(params) {
      if (!params.id) {
        return console.error("params id must be exist");
      }
      this.$http("socialUnitsConfigByID", params, { method: "get" })
        .then(res => {
          console.log("socialUnitsConfigByID success", res);
          this.initialData = res.data;
          if (this.socialUnitFormIsReady) {
            this.$refs.socialUnitForm.setData(this.initialData);
          }

          if (this.socialUnitRelativeFormIsReady) {
            this.$refs.socialUnitRelativeForm.setData(this.initialData);
          }
          if (this.socialUnitFireControlFormIsReady) {
            this.$refs.socialUnitFireControlForm.setData(
              this.initialData.fireInfo
            );
          }
          // this.initialData = this.processData(res.data);
          // this.$refs.socialUnitForm.setData(data)
        })
        .catch(res => {
          console.log("socialUnitsConfigByID catch", res);
        });
    },
    init() {
      var query = this.$root.$mp.query;
      console.log("edit-social-unit-form query", query);
      this.params.id = query.id;
      console.log(
        "init this.isMounted",
        this.isMounted,
        this,
        this.$root.$mp.appOptions.query.from
      );

      if (query.id) {
        this.initData({ id: query.id });
      }
    }
  },
  mounted() {
    console.log("edit social unit form mounted", this);
    this.init();
    this.isMounted = true;
  }
};
</script>
<style lang="scss">
.hj-edit-social-unit-form {
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
  &__title {
    margin-top: 30px;
    margin-bottom: -10px;
    display: flex;
    &__label {
      flex-basis: 140px;
      border: 1rpx solid #ddd;
      line-height: 3;
      border-radius: 4px;
      font-size: 15px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      text-align: center;
      background-color: rgba(102, 119, 233, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>