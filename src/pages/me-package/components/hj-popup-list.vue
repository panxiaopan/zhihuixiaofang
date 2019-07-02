<template>
  <div
    class="hj-popup-list"
    :class="hjClass"
    :style="hjStyle"
    v-if="list&&list.length"
  >
    <div
      class="hj-popup-list__li"
      v-for="(li, index) in list"
      :key="li.name"
      :style="{ fontSize: li.fontsize}"
      @click.stop="click(li, index)"
    >
      <!-- backgroundColor: li.background
       borderBottom: index == list.lenth-1 ? '' : '1rpx solid #ccc'
    color:li.color, -->
      <!-- <wux-icon
        :type="'md-'+li.icon"
        size="22"
      >
      </wux-icon> -->
      {{li.name}}
    </div>
  </div>
</template>
<script>
export default {
  name: "hj-popup-list",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    list: {
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
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    click(li, index) {
      console.log("hj-popup-list click", index);
      this.$emit("change-action", { data: li, index });
    }
  }
};
</script>
<style lang="scss">
.hj-popup-list {
  padding: 5px;
  // margin: 10px;
  // background-color: #f4f7fb;
  min-width: 80px;
  // min-height: 100px;
  border: 1rpx solid #ddd;
  background-color: #fff;
  // box-shadow: 10rpx 10rpx 3rpx 3rpx #ccc;
  box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5);
  // #888
  &__li {
    padding: 10px;
    color: #000;
  }
}
</style>
