<template>
  <div class="hj-bg-box">
    <div class="hj-bg-box__bgimg">
    </div>
    <div
      class="hj-bg-box__content-box"
      :class="contentBoxClass"
      :style="contentBoxStyle"
    >
      <slot></slot>
      <slot name="content">
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    scopedInfo: {
      type: Object,
      default: _ => {}
    },
    contentBoxClass: {
      type: String,
      default: ""
    },
    contentBoxStyle: {
      type: String,
      default: "" // height:30vh;
    }
  }
};
</script>
<style lang="scss">
.hj-bg-box {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  &__bgimg {
    height: 22vh;
    width: 100%;
    background: linear-gradient(#6678e9, #8364db);
  }
  &__content-box {
    width: 85%;
    min-height: 30vh;
    box-sizing: border-box;
    transform: translateY(-40%);
    // padding: 20px;
    padding: 10px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 24px 0px rgba(2, 25, 53, 0.14);
    border-radius: 5px;
    text-align: center;
  }
}
</style>
