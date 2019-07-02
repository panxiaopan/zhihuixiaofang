<template>
  <div
    class="hj-social-unit-panel-without-swipeout"
    :class="hjClass"
    :style="hjStyle"
    @click.stop="click"
  >
    <div
      v-if="contentList&&contentList.length"
      class="hj-social-unit-panel-without-swipeout__hd"
    >
      {{contentList[0].value}}
    </div>
    <div
      class="hj-social-unit-panel-without-swipeout__content"
      v-for="(content, index) in contentList"
      :key="content.value"
    >
      <div
        v-if="index"
        class="hj-social-unit-panel-without-swipeout__content__item"
      >
        <div class="hj-social-unit-panel-without-swipeout__content__item__label">
          {{content.label}}
        </div>
        <div class="hj-social-unit-panel-without-swipeout__content__item__value">
          {{content.value}}
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
      default: "" // hj-social-unit-panel__swipeout
    },
    hjStyle: {
      type: String,
      deafault: ""
    },
    id: {
      type: [String, Number],
      default: ""
    },
    contentList: {
      type: Array,
      default: () => {
        return [
          {
            // id: "id0",
            label: "设备名称",
            value: "飞洒发生沙发沙发"
          },
          {
            // id: "id2",
            label: "设备位置",
            value: "4楼406"
          },
          {
            // id: "id1",
            label: "注册码",
            value: "000223145645#4321fdsfsd"
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
  font-size: 16px;
  border: 1px solid #ddd;
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  // margin-top: 10px;
  // margin: -15px -20px;
  // padding: 10px;

  // display: flex;
  // flex-direction: column;
  // border: 1rpx solid #ddd;
  box-sizing: border-box;
  &__hd {
    // color: #6677e9;

    // font-size: 15px;
    // font-family: PingFang-SC-Bold;
    // font-weight: bold;
    line-height: 1.5;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    font-size: 18px;
    padding-bottom: 5px;
    border-bottom: 1rpx solid #ddd;
  }
  &__content {
    &__item {
      // transform: translateY(-9px);
      display: flex;
      margin-top: 10px;
      // margin-bottom: 5px;
      // line-height: 2;
      // flex-wrap: wrap;
      // justify-content: space-between;
      &__label {
        // white-space: pre-line;
        flex-basis: 80px;
        margin-right: 10px;
        flex-shrink: 0;

        font-family: PingFang-SC-Medium;
        font-weight: Medium;
        // font-family: PingFang-SC-Bold;
        // font-weight: Bold;
        color: #313131;
        font-size: 15px;
      }
      &__value {
        // white-space: pre-line;
        flex-grow: 1;
        font-family: PingFang-SC-Medium;
        font-weight: Medium;
        // color: #6677e9;
        font-size: 14px;

        // margin-left: 10px;
        // word-break: keep-all;
        // word-wrap: break-word;
        // overflow-wrap: break-word;
      }
    }
  }
}
</style>
