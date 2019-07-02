<template>
  <div class="hj-user-mng">
    <userSearch
      @click-li="clickLi"
      wxStorageStr="hjUserSimpleSearch"
    ></userSearch>
  </div>
</template>
<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import isMounted from "@/mixins/isMounted.js";
import userSearch from "@/components/user-search/index.vue";
export default {
  onShareAppMessage,
  onShow() {},
  name: "hj-user-mng",
  mixins: [isMounted],
  components: {
    userSearch
  },
  // onUnload() {
  //   this.isMounted = false;
  // },
  data() {
    return {
      isAuth: true
      // list: [
      //   {
      //     index: 0,
      //     name: "name",
      //     id: "id"
      //   }
      // ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    clickLi({ li, e }) {
      wx.setStorageSync("selectedUserIds", [li.id]);
      wx.navigateBack({
        delta: 1
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
.hj-user-mng {
  min-width: 100vw;
  min-height: 100vh;
  // background-color: #f4f7fb;
}
</style>