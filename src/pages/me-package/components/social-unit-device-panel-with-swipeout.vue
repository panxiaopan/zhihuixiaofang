<template>
  <div
    class="hj-social-unit-panel-device-with-swipeout"
    @longpress="longpress"
  >
    <socialUnitDevicePanelWithoutSwipeout
      :contentList="contentList"
      :extra="extra"
      :id="id"
      @iclick.stop="iclick"
    >
    </socialUnitDevicePanelWithoutSwipeout>
    <!-- slot="default" -->
  </div>
</template>
<script>
import socialUnitDevicePanelWithoutSwipeout from "./social-unit-device-panel-without-swipeout.vue";
export default {
  name: "hj-social-unit-panel-device-with-swipeout",
  components: {
    socialUnitDevicePanelWithoutSwipeout
  },
  props: {
    hjClass: {
      type: String,
      default: "hj-social-unit-panel-device-with-swipeout__swipeout"
    },
    // hjStyle: {
    //   type: String,
    //   deafault: ""
    // }
    actions: {
      type: Array,
      default: () => {
        return [
          {
            name: "删除",
            color: "#fff",
            fontsize: "20",
            width: 75,
            icon: "trash",
            background: "#E21918"
          },
          {
            name: "参数",
            color: "#fff",
            fontsize: "20",
            width: 75,
            icon: "setup_fill",
            background: "#ccc"
          }
        ];
      }
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
            // id: "id1",
            label: "设备名称sds",
            value: "飞洒发生沙发沙发"
          },
          {
            // id: "id2",
            label: "设备位置dsds",
            value: "4楼406"
          },
          {
            // id: "id0",
            label: "注册码dsds",
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
  data() {
    return {
      isShowAction: false
    };
  },
  methods: {
    longpress(e) {
      this.$emit("longpress", e);
    },
    click(e) {
      console.log("click popover", e);
    },
    iclick(e) {
      console.log("click", e);
      console.log("this.isShowAction", this.isShowAction);
      if (this.isShowAction) {
        this.isShowAction = false;
      } else {
        this.$emit("iclick", e);
      }
    }
  }
};
</script>
<style lang="scss">
.hj-social-unit-panel-device-with-swipeout {
  box-sizing: border-box;
  transition: transform 0.2s ease;
  font-size: 14px;
  margin: 10px;
  // background-color: #fff;
  // padding: 10px;
  // border: 1rpx solid #ccc;
  &__swipeout {
    margin: 10px;
  }
}
</style>
