<template>
  <div class="hj-trouble-dispatch-list">
    hj-trouble-dispatch-list
  </div>
</template>
<script>
import { onShareAppMessage } from '@/mixins/pageRegisterFun.js';
export default {
  onShareAppMessage,
  name: 'trouble-dispatch-list',
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="scss">
.hj-trouble-dispatch-list {
  padding: 12px 12px 45px 12px;
  background-color: #f4f7fb;
  font-family: PingFang-SC-Medium;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  // width: 100wh;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
