<template>
  <div
    class="hj-social-unit-panel"
    @longpress="longpress"
    :class="hjClass"
    :style="hjStyle"
  >
    <div
      class="hj-social-unit-panel__hd"
      @click.stop="click"
    >
      <div class="hj-social-unit-panel__hd__title">
        {{title}}
      </div>
      <div class="hj-social-unit-panel__hd__suffix">
      </div>
    </div>
    <div
      class="hj-social-unit-panel__bd"
      @click.stop="click"
    >
      <div class="hj-social-unit-panel__bd__left">
        <img
          clss="hj-social-unit-panel__bd__left__img"
          :src="leftImage"
          alt="leftImage"
          lazy-load
          mode="aspectFit"
          style="width:100px;height:100px;"
        >
      </div>
      <div class="hj-social-unit-panel__bd__right">

        <div
          class="hj-social-unit-panel__bd__right__item"
          v-for="content in contentList"
          :key="content.value"
        >
          <span class="hj-social-unit-panel__bd__right__item__label">
            {{content.label}}
          </span>
          <span class="hj-social-unit-panel__bd__right__item__value">
            {{content.value}}
          </span>
        </div>
      </div>
    </div>
    <div class="hj-social-unit-panel__ft">
      <wux-icon
        type="ios-pin"
        size="18"
        color="#9a9a9a"
      ></wux-icon>
      <span style="font-size: 5px;">
        &nbsp;
      </span>
      {{suffix}}
    </div>
  </div>
</template>
<script>
// import hjPopupList from "./hj-popup-list.vue";

export default {
  name: "hj-social-unit-panel",
  components: {
    // hjPopupList
  },
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
            id: "delete",
            color: "#fff",
            fontsize: "20",
            width: 50,
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
  data() {
    return {};
  },
  methods: {
    longpress(e) {
      console.log("longpress", e);
      this.$emit("longpress", e);
    },
    change(e) {
      console.log("change", e);
      this.isShowAction = true;
      this.$emit("delete-action", e);
    },
    click(e) {
      console.log("click", e);
      this.$emit("iclick", e);
    }
  }
};
</script>
<style lang="scss">
.hj-social-unit-panel {
  // width: 100%;
  box-sizing: border-box;
  transition: transform 0.2s ease;
  font-size: 14px;
  text-indent: 5px;
  margin: 10px;
  padding: 10px;
  position: relative;
  // padding-bottom: 10px;
  // margin-right: 10px;
  // margin: -15px -20px;
  border: 1rpx solid #ddd;
  background-color: #fff;

  // padding: 10px;
  // box-sizing: border-box;

  // &__swipeout.hj-social-unit-panel__swipeout {
  //   width: 100%;
  //   box-sizing: border-box;
  //   transition: transform 0.2s ease;
  //   font-size: 14px;
  //   text-indent: 5px;
  // }
  &__swipeout {
    // width: 100%;
    // height: 300px;
  }
  &__hd {
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #ddd;
    padding-bottom: 5px;
    &__title {
      flex-grow: 1;
      line-height: 1.5;
      // font-size: 15px;
      // font-family: PingFang-SC-Bold;
      // font-weight: bold;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      font-size: 18px;
      color: #313131;
    }
    &__suffix {
      // flex-shrink: 0;
      // display: flex;
      // align-items: center;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #9a9a9a;
      // white-space: nowrap;
      // display: block;
      // color: #aaa;
    }
  }
  &__bd {
    display: flex;
    &__left {
      flex-shrink: 0;
      margin-right: 5rpx;
      &__img {
        width: 100px;
        height: 100px;
        //  calc(100vh - 50px);
      }
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
        color: #313131;
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
  &__ft {
    padding-top: 5px;
    border-top: 1rpx solid #ccc;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #9a9a9a;
    text-indent: 0px;
    // text-indent: 0;
    // white-space: nowrap;
  }
}
</style>
