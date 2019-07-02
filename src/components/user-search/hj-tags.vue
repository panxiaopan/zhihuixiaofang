<template>
  <div
    class="hj-tags"
    :class="hjClass"
    :style="hjStyle"
    @click="click"
  >
    <wux-tag
      :wux-class="combineWuxClass"
      style="margin-left: 5px;margin-right: 5px;font-size: 22px;"
      v-for="hisLi in historySearchList"
      :key="hisLi"
      @click.stop="clickTag(hisLi)"
    >
      {{hisLi}}
    </wux-tag>
  </div>
</template>
<script>
export default {
  name: "hj-tags",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    wuxClass: {
      type: String,
      default: ""
    },
    historySearchList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    combineWuxClass() {
      var defaultClass = "hj-tags__tag";
      if (this.wuxClass) {
        defaultClass = defaultClass + " " + this.wuxClass;
      }
      return defaultClass;
    }
  },
  methods: {
    click(e) {
      this.$emit("click", e);
    },
    clickTag(hisLi) {
      this.$emit("click-tag", hisLi);
    }
  }
};
</script>
<style lang="scss">
.hj-tags {
  &__tag {
    margin-left: 5px;
    margin-right: 5px;
    font-size: 22px;
  }
}
</style>
