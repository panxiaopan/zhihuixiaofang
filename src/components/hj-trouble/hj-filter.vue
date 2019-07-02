<template>
  <div class="hj-trouble__filter" :style="filterStyle" @touchstart="touchmove" @click.stop="clickDiv">
    <div class="hj-trouble__filter__btn">
      <!-- <div class="hj-trouble__filter__btn__item"><span class="hj-trouble__filter__btn__item__label">隐患等级</span><span class="hj-trouble__filter__btn__item__icon">{{'&lt;'}}</span> </div> -->
      <div class="hj-trouble__filter__btn__item" @click.stop="clickBtn('grade')" hover-class="hj-trouble__filter--hover">
        <div class="hj-trouble__filter__btn__item__label">隐患等级&nbsp;</div>
        <div class="hj-trouble__filter__btn__item__icon" :class="gradeActiveClass">{{'&lt;'}}</div>
      </div>
      <div class="hj-trouble__filter__btn__item" @click.stop="clickBtn('state')" hover-class="hj-trouble__filter--hover">
        <div class="hj-trouble__filter__btn__item__label">隐患状态&nbsp;</div>
        <div class="hj-trouble__filter__btn__item__icon" :class="stateActiveClass">{{'&lt;'}}</div>
      </div>
    </div>
    <!-- {heihgt: selectHeight} -->
    <div class="hj-trouble__filter__select" :style="selectStyle">

      <!-- <wux-row v-if="currentFilterBtn=='grade'" wux-class="hj-trouble__filter__select__option" v-for="item in gradeOptions" :key="item.id" @click.stop="clickOption(item, index)">
        <wux-col span=9 wux-class="hj-trouble__filter__select__option__label">
          {{item.label}}
        </wux-col>
        <wux-col span=3 v-if="item.show">
          <wux-icon type="ios-checkmark" size="14" color="#6777e9"></wux-icon>
          &nbsp;&nbsp;&nbsp;
        </wux-col>
      </wux-row> -->

      <div v-if="currentFilterBtn=='grade'" class="hj-trouble__filter__select__option" v-for="item in gradeOptions" :key="item.id" @click.stop="clickOption(item, index)">
        <div class="hj-trouble__filter__select__option__label">
          {{item.label}}
        </div>
        <div>
          <wux-icon v-if="item.show" type="ios-checkmark" size="28" color="#6777e9"></wux-icon>
          &nbsp;&nbsp;&nbsp;
        </div>
      </div>

      <div v-if="currentFilterBtn=='state'" class="hj-trouble__filter__select__option" v-for="item in stateOptions" :key="item.id" @click.stop="clickOption(item, index)">
        <div class="hj-trouble__filter__select__option__label">
          {{item.label}}
        </div>
        <div>
          <wux-icon v-if="item.show" type="ios-checkmark" size="28" color="#6777e9"></wux-icon>
          &nbsp;&nbsp;&nbsp;
        </div>
      </div>
      <!-- <div class="hj-trouble__filter__select__option">所有</div>
      <div class="hj-trouble__filter__select__option">信息</div>
      <div class="hj-trouble__filter__select__option">预警</div>
      <div class="hj-trouble__filter__select__option">告警</div> -->
      <div class="hj-trouble__filter__select__action">
        <div class="hj-trouble__filter__select__action__btn hj-trouble__filter__select__action--reset" @click.stop="reset">重置</div>
        <div class="hj-trouble__filter__select__action__btn hj-trouble__filter__select__action--confirm" @click.stop="confirm">确认</div>
      </div>
    </div>
  </div>
</template>
<script>
// import isEmpty from 'lodash/isEmpty.js';
export default {
  name: 'hj-filter-btn',
  props: {
    options: {
      type: Array,
      default: () => [
        { label: '所有', id: 'info,earlyWarning,alarm', show: false },
        { label: '信息', id: 'info', show: false },
        { label: '预警', id: 'earlyWarning', show: false },
        { label: '告警', id: 'alarm', show: false }
      ]
    }
  },
  data() {
    return {
      // filterStyle: '',
      selectHeight: 0,
      selectStyle: '',
      currentFilterBtn: 'grade',
      alterOptions: [
        { label: '所有', id: 'info,earlyWarning,alarm', show: false },
        { label: '信息', id: 'info', show: false },
        { label: '预警', id: 'earlyWarning', show: false },
        { label: '告警', id: 'alarm', show: false }
      ],
      gradeOptions: [
        { label: '所有', id: 'info,earlyWarning,alarm', show: true },
        { label: '信息', id: 'info', show: false },
        { label: '预警', id: 'earlyWarning', show: false },
        { label: '告警', id: 'alarm', show: false }
      ],
      stateOptions: [
        { label: '所有', id: 'pending,processing,completed', show: true },
        { label: '未处理', id: 'pending', show: false },
        { label: '处理', id: 'processing', show: false },
        { label: '完成', id: 'completed', show: false }
      ]
    };
  },
  computed: {
    gradeActiveClass() {
      if (this.currentFilterBtn == 'grade' && this.selectStyle) {
        return 'hj-trouble__filter__btn__item__icon--active';
      } else {
        return '';
      }
    },
    stateActiveClass() {
      if (this.currentFilterBtn == 'state' && this.selectStyle) {
        return 'hj-trouble__filter__btn__item__icon--active';
      } else {
        return '';
      }
    },
    filterStyle() {
      if (this.selectStyle) {
        return 'height: 100%;background-color: rgba(144,144,144, 0.5);';
      } else {
        return '';
      }
    }
  },
  methods: {
    touchmove(e) {
      console.log('touchmove', e);
      // if (this.filterStyle) {
      //   e.stopPropagation();
      //   e.preventDefault();
      // }
    },
    clickDiv(e) {
      console.log('clickDiv', e);
    },
    clickBtn(mark) {
      // var oldMark = this.currentFilterBtn;
      if (this.currentFilterBtn == mark) {
        this.toggleSelectStyle();
      } else {
        if (!this.selectStyle) {
          this.setSelectStyle();
        }
        // this[oldMark + 'Options'] = this.alterOptions.map(item => {
        //   var it = {};
        //   Object.assign(it, item);
        //   return it;
        // });
        // this.alterOptions = this[mark + 'Options'].forEach(item => {
        //   var it = {};
        //   Object.assign(it, item);
        //   return it;
        // });
      }

      this.currentFilterBtn = mark;
      // this.selectHeight = 'auto';
      // this.selectHeight = '300px';
      console.log('click btn', mark);
    },
    toggleSelectStyle() {
      if (this.selectStyle) {
        this.setSelectStyle('');
      } else {
        this.setSelectStyle();
      }
    },
    setSelectStyle(val = {}) {
      if (typeof val == 'string') {
        this.selectStyle = val;
      }
      if (!val) {
        return;
      }
      // var defaultObj = { height: '192px' };
      // var defaultObj = { height: '171px' };
      // var defaultObj = { height: 'max-content' };
      var defaultObj = { height: 'auto' };
      Object.assign(defaultObj, val);
      var styleStr = '';
      Object.keys(defaultObj).forEach((key, index) => {
        console.log('key', key);
        styleStr =
          styleStr +
          key.replace(/([(A-Z)])/g, '-$1').toLowerCase() +
          ': ' +
          defaultObj[key] +
          ';';
        console.log('key', key);
      });
      console.log('styleStr', styleStr);
      this.selectStyle = styleStr;
    },
    // setSelectStyle(isSet){
    //   if(isSet){
    //     this.selectStyle = 'height: 192px;';
    //   }else{
    //     this.selectStyle = '';
    //   }
    // },
    clickOption(option, index) {
      console.log('clickOption', option, index);
      // 当选中所有，再点击所有时，return
      // if (index == 0 && this[this.currentFilterBtn + 'Options'][index].show) {
      //   return;
      // }

      // 当激活数量为1，且当前点击项为激活项时 则不能取消， return；
      var activeIndexNumber = 0; // 已选中的数量
      var activeIndex = 0;
      this[this.currentFilterBtn + 'Options'].forEach((item, i) => {
        if (item.show) {
          activeIndex = i;
          activeIndexNumber++;
        }
      });
      // if (this[this.currentFilterBtn + 'Options'][index].show)
      if (activeIndexNumber == 1 && activeIndex == index) {
        // &&this[this.currentFilterBtn + 'Options'][index]
        return;
      }

      // index 不为 0 可多选
      this[this.currentFilterBtn + 'Options'] = this[
        this.currentFilterBtn + 'Options'
      ].map((item, i) => {
        if (i == index) {
          item.show = !item.show;
        }
        if (index == 0 && i != 0) {
          item.show = false;
        }
        if (index !== 0 && i == 0) {
          item.show = false;
        }
        return item;
      });
    },
    reset() {
      this.selectStyle = '';
      var gradeStr = '';
      var stateStr = '';
      this.gradeOptions.map((item, index) => {
        if (!index) {
          item.show = true;
          gradeStr = item.id;
        } else {
          item.show = false;
        }
      });
      this.stateOptions.map((item, index) => {
        if (!index) {
          item.show = true;
          stateStr = item.id;
        } else {
          item.show = false;
        }
      });
      this.$emit('reset', { grade: gradeStr, state: stateStr });
    },
    confirm() {
      this.selectStyle = '';
      var gradeArr = [];
      this.gradeOptions.forEach(item => {
        if (item.show) {
          gradeArr.push(item.id);
        }
      });
      var stateArr = [];
      this.stateOptions.forEach(item => {
        if (item.show) {
          stateArr.push(item.id);
        }
      });
      this.$emit('confirm', {
        grade: gradeArr.join(','),
        state: stateArr.join(',')
      });
    }
  }
};
</script>
<style lang="scss">
.hj-trouble__filter {
  position: fixed;
  z-index: 2;
  width: 100%;
  //  box-sizing: border-box;
  margin-left: -12px;
  background-color: #fff;
  &--hover {
    background-color: #ddd;
  }
  &__btn {
    background-color: #fff;
    // margin-left: 12px;
    // margin-right: 12px;
    // border-bottom: 1rpx solid #ccc;
    display: flex;
    &__item {
      padding-top: 10px;
      padding-bottom: 10px;
      flex-grow: 1;
      text-align: center;
      color: #6777e9;
      display: flex;
      justify-content: center;
      align-items: center;
      &__icon {
        transition: transform 1s;
        transform: rotate(-90deg);
        font-weight: bold;
        vertical-align: middle;
        //
        font-size: 16px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(103, 119, 233, 1);
        //
        &--active {
          transform: rotate(90deg);
        }
        // -ms-transform: rotate(90deg); /* IE 9 */
        // -webkit-transform: rotate(90deg); /* Safari and Chrome */
      }
      &__label {
        //
        font-size: 16px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(103, 119, 233, 1);
        //
      }
    }
  }
  &__select {
    background-color: #fff;
    transition: height 1s;
    width: 100%;
    border-top: 1rpx solid #ddd;
    height: 0;
    overflow: hidden;
    // padding-left: 12px;
    // padding-right: 12px;
    text-indent: 30px;
    &__option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1rpx solid #ddd;
      line-height: 35px;
      &__label {
        //
        font-size: 14px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        //
        // color:rgba(102,120,233,1);
      }
    }
    &__action {
      display: flex;
      &__btn {
        flex-grow: 1;
        text-indent: 0;
        text-align: center;
        font-size: 20px;
        line-height: 2;
        //
        font-size: 14px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        //
        // color: rgba(102, 120, 233, 1);
      }
      &--reset {
        // border-right: 1px solid #ddd;
        background-color: #fff;
        color: #6777e9;
      }
      &--confirm {
        background-color: #6777e9;
        color: #fff;
      }
    }
  }
}
</style>

