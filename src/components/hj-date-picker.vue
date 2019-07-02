<template>
  <div
    class="hj-date-picker-wrapper"
    :class="classStr"
  >
    <!-- <div class="hj_home__trouble__date_picker"> -->
    <div class="hj_home__trouble__date_picker__btn__container">
      <div class="hj_home__trouble__date_picker__btn__container hj-date-picker__all-border">
        <div
          v-if="isShowDay"
          class="hj_home__trouble__date_picker__btn"
          @click="clickDateTypeBtn('day')"
          :class="{'hj_home__trouble_btn--active': activeType=='day', 'hj-date-picker__left-border': isShowDay}"
          style=""
        >日</div>
        <div
          v-if="isShowWeek"
          class="hj_home__trouble__date_picker__btn"
          @click="clickDateTypeBtn('week')"
          :class="{'hj_home__trouble_btn--active': activeType=='week', 'hj-date-picker__left-border': isShowWeek&&!isShowDay, 'hj-date-picker__right-border': isShowWeek&&!isShowMonth&&!isShowYear&&!isShowTotal}"
          style=""
        >周</div>
        <div
          v-if="isShowMonth"
          class="hj_home__trouble__date_picker__btn"
          @click="clickDateTypeBtn('month')"
          :class="{'hj_home__trouble_btn--active': activeType=='month', 'hj-date-picker__left-border': isShowMonth&&!isShowWeek&&!isShowDay, 'hj-date-picker__right-border': !isShowYear&&!isShowTotal}"
          style=""
        >月</div>

        <!-- <div class="hj_home__trouble__date_picker__btn" @click="clickDateTypeBtn('month')" :class="{'hj_home__trouble_btn--active': activeType=='month'}" style="border-top:1px solid #6678E9;border-bottom:1px solid #6678E9;border-right:1px solid #6678E9;">月</div> -->
        <div
          v-if="isShowYear"
          class="hj_home__trouble__date_picker__btn"
          @click="clickDateTypeBtn('year')"
          :class="{'hj_home__trouble_btn--active': activeType=='year', 'hj-date-picker__right-border': isShowYear&&!isShowTotal}"
          style="border-top:1px solid #6678E9;border-bottom:1px solid #6678E9;"
        >年</div>
        <div
          v-if="isShowTotal"
          class="hj_home__trouble__date_picker__btn"
          @click="clickDateTypeBtn('total')"
          :class="{'hj_home__trouble_btn--active': activeType=='total', 'hj-date-picker__right-border': isShowTotal}"
          style="border-top:1px solid #6678E9;"
        >总</div>
      </div>

      <!-- <div class="hj_home__trouble__date_picker__btn" @click="clickDateTypeBtn('custom')" :class="{'hj_home__trouble_btn--active': activeType=='custom'}" style="padding-right: 22px;border-top-right-radius: 22px;border-bottom-right-radius: 22px;border:1px solid #6678E9;">自</div> -->
    </div>
    <div class="hj_home__trouble__input__container">
      <div
        style="flex-grow:1;display:flex;justify-content: center;"
        @click="prev"
      >
        <wux-icon
          type="ios-arrow-dropleft-circle"
          size="26"
          :color="arrowColor"
        />
        <!-- <button size="mini" style="background-color: #ccc;color: red; border-radius: 50%;padding:0;font-size:26px;height:26px;width:26px;text-align:center;">{{'<fsfsfsfsfsfs'}}</button> -->
      </div>
      <div
        class="hj_home__trouble__input"
        :style="inputStyleStr"
      >
        <div class="hj_home__trouble__input__label">
          <!-- <picker
            v-if="activeType=='week'"
            style="width:100%;"
            mode="date"
            :fields="fields"
            :value="weekValue"
          >
            <view>
              {{currentDisplayValues}} &nbsp;
            </view>
          </picker> -->
          <picker
            v-if="activeType=='month'||activeType=='year'||activeType=='week'||activeType=='day'"
            @change="bindPickerChange"
            :value="pickValue"
            :mode="mode"
            :fields="fields"
            style="width:100%;"
          >
            <view>
              {{currentDisplayValues}} &nbsp;
            </view>
          </picker>
          <div
            v-if="activeType=='custom'"
            @click="openCalendar2"
            style="width:100%;"
          >
            {{currentDisplayValues}} &nbsp;
          </div>
        </div>
        <div>
          <wux-icon
            type="md-grid"
            size="13"
            color="#BFBFBF"
          ></wux-icon>
          &nbsp;
        </div>
      </div>
      <div
        style="flex-grow:1;display:flex;justify-content: center;"
        @click="next"
      >
        <wux-icon
          style="vertical-align:middle;"
          type="ios-arrow-dropright-circle"
          size="26"
          :color="arrowColor"
        />
      </div>
    </div>
    <wux-calendar id="hj-date-picker__wux-calendar" />
  </div>
</template>
<script>
// hj-date-picker__left-border hj-date-picker__right-border hj-date-picker__all-border
import utils from "@/utils/index.js";
import { $wuxCalendar } from "@/utils/wux.js";
export default {
  name: "hj-date-picker",
  onReady() {
    console.log("hjPicker onReady", this, this.$mp);
  },
  props: {
    isShowDay: {
      type: Boolean,
      default: false
    },
    isShowWeek: {
      type: Boolean,
      default: false
    },
    isShowMonth: {
      type: Boolean,
      default: true
    },
    isShowYear: {
      type: Boolean,
      default: true
    },
    isShowTotal: {
      type: Boolean,
      default: true
    },
    dateType: {
      type: String,
      default: "week"
    },
    value: {
      type: [String],
      default: ""
    },
    classStr: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请选择日期"
    }
  },
  data() {
    return {
      activeType: "week",
      currentValue: "",
      displayValues: "",
      customValue: "customValue",
      totalValue: "totalValue",
      pickValue: this.$_dayjs().format("YYYY-MM-DD"),
      array: ["fsdfs", "fsfs"],
      mode: "date",
      // startDate: '2015-09-04',
      // endDate: utils.formatTime(new Date()),
      dayVal: this.$_dayjs().format("YYYY-MM-DD"),
      weekVal: this.$_dayjs().format("YYYY-MM-DD"),
      monthVal: this.$_dayjs().format("YYYY-MM"),
      yearVal: this.$_dayjs().format("YYYY"),
      totalVal: "",
      customVal: this.$_dayjs().format("YYYY-MM-DD"),
      value1: [],
      value2: [],
      value3: [],
      value4: []
    };
  },
  computed: {
    // hj-date-picker__left-border hj-date-picker__right-border hj-date-picker__all-border
    // weekBorderClass() {
    //   if (this.isShowWeek) {
    //     return "hj-date-picker__left-border";
    //   }
    //   return "hj-date-picker__left-border";
    // },
    // monthBorderClass() {
    //   if (this.isShowMonth) {
    //     if (!this.isShowWeek && !this.isShowYear && !this.isShowTotal) {
    //       return "hj-date-picker__all-border";
    //     }
    //     if (this.isShowWeek && !this.isShowYear && !this.isShowTotal) {
    //       return "hj-date-picker__right-border";
    //     }
    //     if (!this.isShowWeek) {
    //       return "hj-date-picker__left-border";
    //     }
    //   }

    //   return "";
    // },
    // yearBorderClass() {
    //   if (this.isShowYear) {
    //     if (!this.isShowWeek && !this.isShowMonth && !this.isShowTotal) {
    //       return "hj-date-picker__all-border";
    //     }
    //     if (!this.isShowTotal) {
    //       return "hj-date-picker__right-border";
    //     }
    //     if (!this.isShowWeek && !this.isShowMonth && this.isShowTotal) {
    //       return "hj-date-picker__left-border";
    //     }
    //     // if(!this.isShowDay&&!this.isShowWeek&&!this.isShowMonth){
    //     //   return "hj-date-picker__left-border";
    //     // }
    //   }
    //   return "";
    // },
    // totalBorderClass() {
    //   if (this.isShowTotal) {
    //     return "hj-date-picker__right-border";
    //   }
    //   return "hj-date-picker__right-border";
    // },
    inputStyleStr() {
      if (this.activeType === "total") {
        return "background-color: #ccc;";
      }
      return "";
    },
    // currentValueStr() {
    //   // return this.value === '' ? this.placeholder : this.currentDisplayValues;
    //   return this.currentDisplayValues;
    // },
    currentDisplayValues() {
      return this[this.activeType + "ValStr"];
    },
    dayValStr() {
      return this.dayVal;
    },
    weekValStr() {
      // return (
      //   (this.weekVal && this.$_dayjs(this.weekVal).week()) ||
      //   this.$_dayjs().week()
      // );
      return (
        this.$_dayjs(this.weekVal)
          .subtract(7, "day")
          .format("YYYY-MM-DD") +
        "~" +
        this.$_dayjs(this.weekVal).format("YYYY-MM-DD")
      );
    },
    monthValStr() {
      return (
        (this.monthVal && this.$_dayjs(this.monthVal).format("YYYY-MM")) ||
        this.$_dayjs().format("YYYY-MM")
      );
    },
    yearValStr() {
      return (
        (this.yearVal && this.$_dayjs(this.yearVal).format("YYYY")) ||
        this.$_dayjs().format("YYYY")
      );
    },
    customValStr() {
      return this.displayValues || this.$_dayjs().format("YYYY-MM-DD");
    },
    fields() {
      if (this.activeType == "week" || this.activeType == "custom") {
        return "day";
      } else {
        return this.activeType;
      }
    },
    arrowColor() {
      if (this.activeType == "custom" || this.activeType == "total") {
        return "#ccc";
      } else {
        return "#6678E9";
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (this.currentValue !== newVal) {
          this.currentValue = newVal;
          this.setPickerValueByDateType();
        }
      }
    },
    dateType: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (this.activeType !== newVal) {
          this.activeType = newVal;
        }
      }
    }
  },
  methods: {
    bindPickerChange(evt) {
      console.log("bindPickerChange", evt);
      var oldValue = this[this.activeType + "Val"];
      this.currentValue = evt.target.value;
      this[this.activeType + "Val"] = this.currentValue;
      this.$emit("input", evt.target.value);
      this.$emit("change", evt.target.value);
      this.$emit("change-date-type-value", {
        type: this.activeType,
        value: this[this.activeType + "Val"],
        oldType: this.activeType,
        oldValue
      });
    },
    clickDateTypeBtn(type) {
      console.log("clickDateTypeBtn", type, this.activeType);
      var oldType = this.activeType;
      var oldValue = this[type + "Val"];
      if (this.activeType !== type) {
        this.activeType = type;
        if (
          this.activeType == "month" ||
          this.activeType == "year" ||
          this.activeType == "week" ||
          this.activeType == "day"
        ) {
          this.pickValue = this[type + "Val"];
          this.$emit("change-date-type-value", {
            type,
            value: this[type + "Val"],
            oldType,
            oldValue
          });
        } else if (this.activeType == "total") {
          this.$emit("change-date-type-value", {
            type,
            value: "",
            oldType: oldType,
            oldValue: oldValue
          });
        }
        this.$emit("update:dateType", type);
      }
    },
    prev() {
      if (this.activeType == "custom" || this.activeType == "total") {
        return;
      }
      var oldType = this.activeType;
      var oldValue = this.currentValue;
      if (this.activeType == "month") {
        oldValue = this.monthVal;
        this.monthVal = this.$_dayjs(this.monthVal)
          .subtract(1, "month")
          .format("YYYY-MM");
        this.currentValue = this.pickValue = this.monthVal;
      }
      if (this.activeType == "year") {
        oldValue = this.yearVal;
        this.yearVal = this.$_dayjs(this.yearVal)
          .subtract(1, "year")
          .format("YYYY");
        this.currentValue = this.pickValue = this.yearVal;
      }
      if (this.activeType == "week") {
        oldValue = this.weekVal;
        this.weekVal = this.$_dayjs(this.weekVal)
          .subtract(7, "day")
          .format("YYYY-MM-DD");
        this.currentValue = this.pickValue = this.weekVal;
      }
      if (this.activeType == "day") {
        oldValue = this.dayVal;
        this.dayVal = this.$_dayjs(this.dayVal)
          .subtract(1, "day")
          .format("YYYY-MM-DD");
        this.currentValue = this.pickValue = this.dayVal;
      }
      this.$emit("prev", this.currentValue);
      this.$emit("input", this.currentValue);
      this.$emit("change", this.currentValue);
      this.$emit("change-date-type-value", {
        type: this.activeType,
        value: this[this.activeType + "Val"],
        oldType,
        oldValue
      });
    },
    next() {
      if (this.activeType == "custom" || this.activeType == "total") {
        return;
      }
      var oldType = this.activeType;
      var oldValue = this.currentValue;
      if (this.activeType == "month") {
        oldValue = this.monthVal;
        this.monthVal = this.$_dayjs(this.monthVal)
          .add(1, "month")
          .format("YYYY-MM");
        this.currentValue = this.pickValue = this.monthVal;
      }

      if (this.activeType == "year") {
        oldValue = this.yearVal;
        this.yearVal = this.$_dayjs(this.yearVal)
          .add(1, "year")
          .format("YYYY");
        this.currentValue = this.pickValue = this.yearVal;
      }
      if (this.activeType == "week") {
        oldValue = this.weekVal;
        this.weekVal = this.$_dayjs(this.weekVal)
          .add(7, "day")
          .format("YYYY-MM-DD");
        this.currentValue = this.pickValue = this.weekVal;
      }
      if (this.activeType == "day") {
        oldValue = this.dayVal;
        this.dayVal = this.$_dayjs(this.dayVal)
          .add(1, "day")
          .format("YYYY-MM-DD");
        this.currentValue = this.pickValue = this.dayVal;
      }
      // console.log('next', this.)
      this.$emit("prev", this.currentValue);
      this.$emit("input", this.currentValue);
      this.$emit("change", this.currentValue);
      this.$emit("change-date-type-value", {
        type: this.activeType,
        value: this[this.activeType + "Val"],
        oldType,
        oldValue
      });
    },
    setWuxCalendar() {
      // console.log('getCurrentPages', getCurrentPages());
      // console.log('this.$root.$mp.page', this.$root.$mp.page);
      if (!this.$wuxCalendar) {
        this.$wuxCalendar = $wuxCalendar(
          "#hj-date-picker__wux-calendar",
          this.$root.$mp.page
        );
      }
    },
    openCalendar1() {
      this.setWuxCalendar();
      this.$wuxCalendar.open({
        value: this.value1,
        onChange: (values, displayValues) => {
          console.log(
            this.value1 == values,
            "onChange",
            values,
            displayValues,
            "this.value1",
            this.value1
          );
          this.displayValues = displayValues;
          if (this.value1 !== values) {
            console.log("this.value1 !== values");
            this.value1 = values;
          }
          console.log("after this.value1", this.value1);
          this.displayValues = displayValues;
        }
      });
    },
    openCalendar2() {
      this.setWuxCalendar();
      this.$wuxCalendar.open({
        value: this.value2,
        multiple: true,
        onChange: (values, displayValues) => {
          console.log(
            this.value2 == values,
            "onChange",
            values,
            displayValues,
            "this.value2",
            this.value2
          );
          if (this.value2 !== values) {
            console.log("this.value2 !== values");
            this.value2 = values;
          }
          console.log("after this.value2", this.value2);
          this.displayValues = displayValues;
        }
      });
    },
    openCalendar3() {
      this.setWuxCalendar();
      this.$wuxCalendar.open({
        value: this.value3,
        direction: "vertical", // horizontal， vertical
        onChange: (values, displayValues) => {
          console.log(
            this.value3 == values,
            "onChange",
            values,
            displayValues,
            "this.value3",
            this.value3
          );
          this.displayValues = displayValues;
          if (this.value3 !== values) {
            console.log("this.value3 !== values");
            this.value3 = values;
          }
          console.log("after this.value3", this.value3);
          this.displayValues = displayValues;
        }
      });
    },
    openCalendar4() {
      this.setWuxCalendar();
      const now = new Date("2018-9-18-27");
      const minDate = now.getTime();
      const maxDate = now.setDate(now.getDate() + 7);
      console.log("new Date()", new Date("2018-10-11"));
      console.log("maxDate", maxDate, utils.formatDate(new Date(maxDate)));

      this.$wuxCalendar.open({
        value: this.value4,
        minDate,
        maxDate,
        onChange: (values, displayValues) => {
          console.log(
            this.value4 == values,
            "onChange",
            values,
            displayValues,
            "this.value4",
            this.value4
          );
          this.displayValues = displayValues;
          if (this.value4 !== values) {
            console.log("this.value4 !== values");
            this.value4 = values;
          }
          console.log("after this.value4", this.value4);

          this.displayValues = displayValues;
        }
      });
    },
    setPickerValueByDateType() {
      // this.activeType = this.dateType;
      console.log("setPickerValueByDateType start");
      switch (this.activeType) {
        case "day":
          this.dayVal =
            (this.value && this.$_dayjs(this.value).format("YYYY-MM-DD")) ||
            this.$_dayjs().format("YYYY-MM-DD");
          this.pickValue = this.dayVal;
        case "week":
          this.weekVal =
            (this.value && this.$_dayjs(this.value).format("YYYY-MM-DD")) ||
            this.$_dayjs().format("YYYY-MM-DD");
          this.pickValue = this.weekVal;
          break;
        case "month":
          this.monthVal =
            (this.value && this.$_dayjs(this.value).format("YYYY-MM")) ||
            this.$_dayjs().format("YYYY-MM");
          this.pickValue = this.monthVal;
          console.log(
            "setPickerValueByDateType",
            this.pickValue,
            this.monthVal
          );
          break;
        case "year":
          this.yearVal =
            (this.value && this.$_dayjs(this.value).format("YYYY")) ||
            this.$_dayjs().format("YYYY");
          this.pickValue = this.yearVal;
          break;
        case "custom":
          this.customVal =
            this.value &&
            this.$_dayjs(this.value).format(
              "YYYY-MM-DD" || this.$_dayjs().format("YYYY-MM-DD")
            );
          break;
        default:
          break;
      }

      console.log("setPickerValueByDateType end");
    }
  },
  mounted() {
    console.log("totalBorderClass", this.totalBorderClass);
    // this.$nextTick(() => {
    //   this.setPickerValueByDateType();
    //   console.log('mounted', this.pickValue, this.monthVal, this.currentValue);
    // });
    console.log("hjdatePickerDayjs", this.$_dayjs().format("YYYY-MM"));
    console.log("weekOfYear", this.$_dayjs("06/27/2018").week());
    console.log(this.$_dayjs().startOf("year"));
    console.log(this.$_dayjs().endOf("year"));
    console.log(this.$_dayjs().week());
    console.log(this.$_dayjs("2018-12-30").week());
    console.log(this.$_dayjs("2018-01-01").week());

    console.log(this.$_dayjs(this.$_dayjs()).week());

    // console.log('this.$mp', this.$root, this.$root.$mp.page);
  }
};
</script>
<style lang="scss">
.hj-date-picker-wrapper {
  margin-top: 10px;
  background: rgba(255, 255, 255, 1);
  width: 100%;
}
.hj_home__trouble__date_picker__btn__container {
  display: flex;
  justify-content: center;
  padding-top: 10px;
  padding-bottom: 5px;
}
.hj_home__trouble__date_picker__btn {
  /* background-color: #6678e9; */
  /* border-radius: 50%; */
  /* padding: 0; */
  /* flex-grow: 0; */
  /* border: none; */
  color: #000;
  height: 35px;
  width: 44px;
  text-align: center;
  line-height: 35px;
  text-indent: 0;
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  border: 1px solid #6678e9;
  /* PingFang-SC-Medium */
}

.hj_home__trouble__input__container {
  text-indent: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border-top: 1px solid #ccc; */
  padding-top: 10px;
  padding-bottom: 10px;
}
.hj_home__trouble__input {
  display: flex;
  justify-content: space-between;
  /* width: 167px; */
  flex-grow: 1;
  height: 24px;
  /* color: '#BFBFBF'; */
  border: 1px solid rgba(191, 191, 191, 1);
  border-radius: 4px;
  font-size: 13px;
  line-height: 2;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(171, 171, 171, 1);
}
.hj_home__trouble__input__label {
  text-indent: 10px;
  min-width: 167px;
}
.hj-date-picker {
  &__left-border {
    border-top-left-radius: 22px;
    border-bottom-left-radius: 22px;
    // border: 1px solid #6678e9;
    padding-left: 22px;
    /* border-top-left-radius: 22px;border-bottom-left-radius: 22px; */
  }
  &__right-border {
    // border: 1px solid #6678e9;
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;
    padding-right: 22px;
  }
  &__all-border {
    // border: 1rpx solid #6678e9;
    border-top-left-radius: 22px;
    border-bottom-left-radius: 22px;
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;
    // padding-left: 22px;
    // padding-right: 22px;
  }
}
</style>
<style>
.hj_home__trouble_btn--active.hj_home__trouble_btn--active {
  color: rgba(102, 120, 233, 1);
  background-color: rgba(102, 120, 233, 0.2);
  font-weight: bold;
}
</style>

