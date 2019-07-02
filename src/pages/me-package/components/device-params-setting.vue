<template>
  <div class="hj-device-params-setting">
    <div class="hj-device-params-setting__title">{{title}}</div>
    <!-- class="hj-device-params-setting__cell"
      wux-class="hj-device-params-setting__cell" -->
    <wux-cell
      v-for="li in list"
      :key="li.ident"
      :isLink="li.isLink"
      :title="li.name"
      :extra="li.data"
      class="hj-device-params-setting__cell"
      wux-class="hj-device-params-setting__wux_cell"
      @click="click(li)"
    >
    </wux-cell>
  </div>
</template>
<script>
export default {
  name: "hj-device-params-setting",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjClass: {
      type: String,
      default: ""
    },
    list: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    return {};
  },
  methods: {
    click(li) {
      this.$emit("click-cell", li);
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
.hj-device-params-setting {
  box-sizing: border-box;
  // width: 100%;

  // width: calc(100% + 20px);
  // margin-left: -10px;
  // margin-right: -10px;

  padding-bottom: 10px;
  &__title {
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
  &__cell {
    // margin-left: -10px;
    // margin-right: -10px;
    // background-color: #fff;
    // width: calc(100% + 20px);
  }
  &__wux_cell {
    // width: calc(100% + 20px);
  }
}
</style>
