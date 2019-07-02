<template>
  <div
    class="hj-social-unit-panel-without-swipeout"
    :class="hjClass"
    :style="hjStyle"
    @click.stop="click"
  >
    <div class="hj-social-unit-panel-without-swipeout__hd">
      <div class="hj-social-unit-panel-without-swipeout__hd__title">
        {{title}}
      </div>
      <div class="hj-social-unit-panel-without-swipeout__hd__suffix">
        <wux-icon
          type="ios-pin"
          size="24"
          color="#ddd"
        ></wux-icon>
        {{suffix}}
      </div>
    </div>
    <div class="hj-social-unit-panel-without-swipeout__bd">
      <div class="hj-social-unit-panel-without-swipeout__bd__left">
        <img
          :src="leftImage"
          alt="leftImage"
          mode="aspectFit"
          style="width:100px;height:100px;"
        >
      </div>
      <div class="hj-social-unit-panel-without-swipeout__bd__right">

        <div
          class="hj-social-unit-panel-without-swipeout__bd__right__item"
          v-for="content in contentList"
          :key="content.value"
        >
          <span class="hj-social-unit-panel-without-swipeout__bd__right__item__label">
            {{content.label}}
          </span>
          <span class="hj-social-unit-panel-without-swipeout__bd__right__item__value">
            {{content.value}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "hj-social-unit-panel-without-swipeout",
  props: {
    hjClass: {
      type: String,
      default: "hj-social-unit-panel__swipeout"
    },
    hjStyle: {
      type: String,
      deafault: ""
    },
    id: {
      type: [String, Number],
      default: ""
    },
    title: {
      type: String,
      default: "title"
    },
    suffix: {
      type: String,
      default: "suffix"
    },
    actions: {
      type: Array,
      default: () => {
        return [
          {
            name: "删除",
            color: "#fff",
            fontsize: "20",
            width: 100,
            icon: "trash",
            background: "#E21918"
          }
        ];
      }
    },
    leftImage: {
      type: String,
      default: "../../../static/images/common/socialUnitSampleImg.jpg"
    },
    contentList: {
      type: Array,
      default: () => {
        return [
          {
            // id: "id0",
            label: "责任人",
            value: "弹力"
          },
          {
            // id: "id1",
            label: "联系方式",
            value: 13012345678
          },
          {
            // id: "id2",
            label: "安装日期",
            value: "2018-12-25 12:12:12"
          }
        ];
      }
    },
    extra: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    click(e) {
      console.log("click", e);
      this.$emit("iclick", e);
    }
  }
};
</script>
<style lang="scss">
.hj-social-unit-panel-without-swipeout {
  width: 100%;
  margin-top: 10px;
  border: 1rpx solid #ddd;
  padding: 10px;
  box-sizing: border-box;
  &__hd {
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #ddd;
    &__title {
      flex-grow: 1;
      // line-height: 3;
      // font-size: 15px;
      // font-family: PingFang-SC-Bold;
      // font-weight: bold;
      line-height: 1.5;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      font-size: 18px;
      color: rgba(49, 49, 49, 1);
    }
    &__suffix {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(154, 154, 154, 1);
    }
  }
  &__bd {
    display: flex;
    &__left {
      flex-shrink: 0;
      margin-right: 5rpx;
    }
    &__right {
      flex-grow: 1;
      margin-left: 5rpx;
      margin-right: 5rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &__item {
        font-size: 14px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(49, 49, 49, 1);
        display: flex;
        justify-content: space-between;
        &__label {
        }
        &__value {
          // color: #6677e9;
        }
      }
    }
  }
}
</style>
