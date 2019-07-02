<template>
  <div v-if="risksByGrade" class="hj_home__trouble-statistics">
    <div class="hj_home__trouble-statistics__item" @click="clickInfo">
      <p class="hj_home__trouble-statistics__item--value hj_home__trouble-statistics__item--value__info">{{risksByGrade.info.count}}</p>
      <p class="hj_home__trouble-statistics__item--label hj_home__trouble-statistics__item--label__info">{{risksByGrade.info.desc}}</p>
    </div>
    <div class="hj_home__trouble-statistics__item" @click="clickBeforeWarning">
      <p class="hj_home__trouble-statistics__item--value hj_home__trouble-statistics__item--value__forewarning">{{risksByGrade.beforeWarning.count}}</p>
      <p class="hj_home__trouble-statistics__item--label hj_home__trouble-statistics__item--label__forewarning">{{risksByGrade.beforeWarning.desc}}</p>
    </div>
    <div class="hj_home__trouble-statistics__item" @click="clickWarning">
      <p class="hj_home__trouble-statistics__item--value hj_home__trouble-statistics__item--value__warning">{{risksByGrade.warning.count}}</p>
      <p class="hj_home__trouble-statistics__item--label hj_home__trouble-statistics__item--label__warning">{{risksByGrade.warning.desc}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'hjPanelTroubleStasticSlot',
  props: {
    risksByGrade: {
      type: [Object, Array, String],
      default: ''
    }
  },
  methods: {
    clickInfo() {
      this.$emit('iclick', 'info');
    },
    clickBeforeWarning() {
      this.$emit('iclick', 'earlyWarning');
    },
    clickWarning() {
      this.$emit('iclick', 'alarm');
    }
  }
};
</script>
<style scoped>
.hj_home__trouble-statistics {
  display: flex;
  justify-content: space-around;
  flex-grow: 1;
  width: 100%;
}
.hj_home__trouble-statistics__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.hj_home__trouble-statistics__item--value {
  font-size: 24px;
  font-family: DIN-Bold;
  font-weight: bold;
  color: rgba(49, 49, 49, 1);
}
.hj_home__trouble-statistics__item--label {
  font-size: 13px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(61, 61, 61, 1);
}
.hj_home__trouble-statistics__item--value__forewarning {
  color: rgba(79, 100, 233, 1);
}
.hj_home__trouble-statistics__item--label__forewarning {
  color: rgba(79, 100, 233, 1);
}

.hj_home__trouble-statistics__item--value__warning {
  color: rgba(251, 76, 102, 1);
}
.hj_home__trouble-statistics__item--label__warning {
  color: rgba(251, 76, 102, 1);
}
</style>
