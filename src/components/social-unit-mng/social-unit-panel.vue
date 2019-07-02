<template>
  <div class="hj-social-unit-panel">
    <i-swipeout
      i-class="i-swipeout-demo-item"
      :actions="actions"
    >
      <div slot="content">
        fsdfsdfsdfsf
        <!-- <wux-card
          title="卡片标题"
          extra="额外内容"
          thumb="http://pbqg2m54r.bkt.clouddn.com/logo.png"
        >
          <view slot="body">卡片内容</view>
          <view slot="footer">尾部内容</view>
        </wux-card> -->
      </div>
    </i-swipeout>
  </div>
</template>
<script>
export default {
  name: "hj-social-unit-panel",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    hjStyle: {
      type: String,
      deafault: ""
    }
  },
  data() {
    return {
      actions: [
        {
          name: "喜欢",
          color: "#fff",
          fontsize: "20",
          width: 100,
          icon: "like",
          background: "#ed3f14"
        },
        {
          name: "返回",
          width: 100,
          color: "#80848f",
          fontsize: "20",
          icon: "undo"
        }
      ]
    };
  }
};
</script>
<style lang="scss">
.hj-social-unit-panel {
}
</style>
