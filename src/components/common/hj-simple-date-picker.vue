<template>
  <div class="hj-simple-date-picker" :class="hjClass">

    <!-- <wux-row>
      <wux-col span=3>
        <div class="hj-simple-date-picker__left">
          <wux-icon type="ios-arrow-back" size="11"></wux-icon>
        </div>
      </wux-col>
      <wux-col class="hj-simple-date-picker__center" span=6>
        <picker class="hj-simple-date-picker__center__label" mode="date" :value="date" @change="bindDateChange">
          <view class="picker">
          {{date}}
          </view>
        </picker>
      </wux-col>
      <wux-col span=3>
        <div class="hj-simple-date-picker__right">
          <wux-icon type="ios-arrow-forward" size=11></wux-icon>
        </div>
      </wux-col>
    </wux-row> -->

    <div class="hj-simple-date-picker__left" hover-class="hj-simple-date-picker--hover" @click="back">
      <wux-icon type="ios-arrow-back" size="11"></wux-icon>
    </div>
    <picker class="hj-simple-date-picker__center" mode="date" :value="date" @change="bindDateChange">
      <div class="hj-simple-date-picker__center__label">
        {{date}}
      </div>
    </picker>

    <div class="hj-simple-date-picker__right" hover-class="hj-simple-date-picker--hover" @click="forward">
      <wux-icon type="ios-arrow-forward" size=11></wux-icon>
    </div>
  </div>
</template>
<script>
export default {
  name: 'hj-simple-date-picker',
  props: {
    hjClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // date: this.$_dayjs().format('YYYY-MM-DD')
      date:''
    };
  },
  methods: {
    bindDateChange(e) {
      console.log('bindDateChange', e);
      this.date = e.mp.detail.value;
      this.triggerEvent();
    },
    back() {
      this.date = this.$_dayjs(this.date)
        .add(-1, 'day')
        .format('YYYY-MM-DD');
      this.triggerEvent();
    },
    forward() {
      this.date = this.$_dayjs(this.date)
        .add(1, 'day')
        .format('YYYY-MM-DD');
      this.triggerEvent();
    },
    triggerEvent() {
      this.$emit('changeDate', this.date);
    }
  }
};
</script>
<style lang="scss">
.hj-simple-date-picker {
  width: 100%;
  padding-bottom: 5px;
  background-color: #f4f7fb;
  display: flex;
  &--hover {
    background: rgba(144, 144, 144, 0.5);
  }
  &__left {
    text-align: center;
    flex-grow: 1;
    flex-basis: 100px;
    // line-height: 2;
  }
  &__center {
    flex-grow: 3;
    flex-basis: 100px;
    vertical-align: bottom;
    &__label {
      font-size: 11px;
      font-family: DIN-Regular;
      text-align: center;
      height: 100%;
      line-height: 2.55;
      vertical-align: center;
    }
  }
  &__right {
    flex-basis: 100px;
    flex-grow: 1;
    text-align: center;
    // line-height: 2;
  }
}
</style>

