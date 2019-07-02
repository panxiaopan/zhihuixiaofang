<template>
  <div class="hj_home__assignment" :class="wrapperClass">
    <div class="hj_home__assignment__title">
      <img class="hj_home__assignment__title--icon" :src="titleIcon" :alt="alt" />&nbsp;
      <span class="hj_home__assignment__title--label">{{title}}</span>
    </div>
    <div class="hj_home__assignment__content" :style="contentStyleStr">
      <div v-if="showDefaultContentChild" class="hj_home__assignment__content--item">
        <div
          class="hj_home__assignment__content--item hj_home__assignment__content--item__div hj_home__assignment__content--left"
          @click="click($event, 'left')"
        >
          <div class="hj_home__assignment__content__value">{{firstValue}}</div>
          <div class="hj_home__assignment__content__label">{{firstLabel}}</div>
        </div>
      </div>
      <div v-if="showDefaultContentChild" class="hj_home__assignment__content--item">
        <div
          class="hj_home__assignment__content--item hj_home__assignment__content--item__div hj_home__assignment__content--right"
          @click="click($event, 'right')"
        >
          <div class="hj_home__assignment__content__value">{{secondValue}}</div>
          <div class="hj_home__assignment__content__label">{{secondLabel}}</div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import hjPanelTroubleStasticSlot from "./home/hjPanelTroubleStasticSlot";
export default {
  components: {
    hjPanelTroubleStasticSlot
  },
  props: {
    wrapperClass: {
      type: String,
      default: ""
    },
    titleIcon: {
      type: String,
      default: ""
    },
    alt: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: "任务统计"
    },
    contentStyleStr: {
      type: String,
      default: ""
    },
    showDefaultContentChild: {
      type: Boolean,
      default: true
    },
    firstValue: {
      type: [String, Number],
      default: ""
    },
    firstLabel: {
      type: String,
      default: "未处理隐患"
    },
    secondValue: {
      type: [String, Number],
      default: ""
    },
    secondLabel: {
      type: String,
      default: "隐患处理中"
    }
  },
  data() {
    return {
      socailUnit: {}
    };
  },
  computed: {
    // contentStyleStr(){
    //   if(!this.contentHeight){
    //     return ''
    //   }else{
    //     return 'height:'+this.contentHeight + 'rpx;'
    //   }
    //}
  },
  methods: {
    click(e, val) {
      console.log("iclick", e);
      this.$emit("iclick", val);
    }
  },
  mounted() {
    console.log("mounted hjPanel risksByGrade", this.risksByGrade);
  }
};
</script>
<style scoped>
.hj_home__assignment {
  width: 100%;
}
.hj_home__assignment__title {
  border-bottom: 1rpx solid rgba(191, 191, 191, 1);
  line-height: 2.2;
  padding-bottom: 5px;
}
.hj_home__assignment__title--icon {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
.hj_home__assignment__title--label {
  font-size: 15px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(49, 49, 49, 1);
  vertical-align: middle;
}

.hj_home__assignment__content {
  height: 104px;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  /*align-items: center;stretch*/
}
.hj_home__assignment__content--item {
  /* width: 50%; */
  /* height: 100%; */
  flex-grow: 1; /* 作用于子元素，孙子可继承 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.hj_home__assignment__content--item__div {
  flex-direction: column;
  flex-grow: 0;
  width: 80%;
  height: 65%;
  border-radius: 3px;
}
.hj_home__assignment__content--left {
  background: linear-gradient(
    120deg,
    rgba(251, 169, 144, 1) 0%,
    rgba(243, 116, 141, 1) 100%
  );
}
.hj_home__assignment__content--right {
  background: linear-gradient(
    120deg,
    rgba(30, 199, 255, 1) 0%,
    rgba(102, 120, 233, 1) 100%
  );
}
.hj_home__assignment__content__value {
  font-size: 24px;
  font-family: DIN-Bold;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.hj_home__assignment__content__label {
  font-size: 14px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
</style>


