<template>
  <div
    class="hj-map-social-unit-panel"
    :class="hjClass"
    :style="hjStyle"
    @click.stop="click"
  >
    <div class="hj-map-social-unit-panel__icon">
      &nbsp;
      <wux-icon
        type="ios-search"
        size="22"
        color="#6677e9"
      ></wux-icon>
      &nbsp;
    </div>
    <div class="hj-map-social-unit-panel__content">
      <div class="hj-map-social-unit-panel__content__title">
        {{name}}
      </div>
      <div class="hj-map-social-unit-panel__content__subtitle">
        {{address}}
      </div>
    </div>
    <div
      v-if="isShowPostfix"
      class="hj-map-social-unit-panel__postfix"
    >
      附近的单位
    </div>
  </div>
</template>
<script>
export default {
  name: "hj-map-social-unit-panel",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      default: ""
    },
    id: {
      type: [String, Number],
      default: 0
    },
    latitude: {
      type: [String, Number],
      default: 0
    },
    longitude: {
      type: [String, Number],
      default: 0
    },
    name: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    isShowPostfix: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    click(e) {
      this.$emit("iclick", e);
    }
  }
};
</script>
<style lang="scss">
.hj-map-social-unit-panel {
  display: flex;
  box-sizing: border-box;
  border-bottom: 1rpx solid #ddd;
  padding: 5px;
  &__icon {
  }
  &__content {
    flex-grow: 1;
    &__title {
      font-size: 22px;
    }
    &__subtitle {
      font-size: 16px;
    }
  }
  &__postfix {
    flex-shrink: 0;
    font-size: 12px;
    color: rgba(168, 162, 162, 0.5);
  }
}
</style>
