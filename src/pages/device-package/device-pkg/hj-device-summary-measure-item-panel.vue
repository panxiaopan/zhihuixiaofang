<template>
  <div
    class="hj-device-summary-measure-item-panel"
    :class="hjClass"
    style="font-size: 14px;font-family: PingFang-SC-Bold;font-weight: bold;color: rgba(49, 49, 49, 1);"
  >
    <span>{{dataItem.measureName}}</span>
    <span
      class="hj-device-summary-measure-item-panel__right"
      style="font-size: 13px;font-family: PingFang-SC-Medium;font-weight: 500;color: rgba(80, 101, 234, 1);"
    >
      <span>{{dataItem.value}} </span>
      <span>{{dataItem.unit}}</span>
    </span>
  </div>
</template>
<script>
export default {
  name: "hj-device-summary-measure-item-panel",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    dataItem: {
      type: Object,
      default: () => ({
        dataId: "",
        measureName: "",
        value: "",
        unit: "",
        type: "",
        checked: "",
        children: []
      })
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.hj-device-summary-measure-item-panel {
  text-indent: 70px;
  // margin-top: 5px;
  margin-bottom: 5px;
  &__right {
    position: absolute;
    right: 25px;
  }
}
</style>