<template>
  <div class="hj-new-user">
    <form
      action=""
      @submit="onSubmit"
      @reset="onReset"
    >
      <userForm ref="userForm"></userForm>
      <div class="hj-new-user__btn__container">
        <!-- <button
          class="hj-new-user__btn--reset"
          formType="reset"
          @click.stop="reset"
        >重置
        </button> -->
        <button
          class="hj-new-user__btn--next"
          formType="submit"
          :disabled="disabled"
          @click="submit"
        >确认
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import { onShareAppMessage } from "@/mixins/pageRegisterFun.js";
import isMounted from "@/mixins/isMounted.js";
import userForm from "../components/user-form.vue";
import md5 from "md5";
export default {
  onShareAppMessage,
  onShow() {
    if (this.isMounted) {
      // this.$refs.userForm.reset();
    }
  },
  onUnload() {
    console.log("onUnload");
    // this.isMounted = false;
  },
  name: "hj-new-user",
  mixins: [isMounted],
  components: { userForm },
  data() {
    return {
      isAuth: true,
      disabled: false
    };
  },
  computed: {},
  watch: {},
  methods: {
    onSubmit(e) {
      console.log("on submit", e);
      // this.$refs.userForm.reset();
    },
    onReset(e) {
      console.log("on reset", e);
      // this.$refs.userForm.reset();
    },
    reset(e) {
      console.log("reset", e);
      this.$refs.userForm.reset();
    },
    submit(e) {
      console.log("submit", e);
      this.$refs.userForm
        .validateAndGetFormData()
        .then(res => {
          console.log("validateAndGetFormData res", res);
          if (res) {
            this.addNewUser(res);
          }
        })
        .catch(res => {
          console.log("validateAndGetFormData", res);
        });
    },
    addNewUser(params) {
      this.disabled = true;
      params.userPassword = md5(params.userPassword);
      params.userRepassword = md5(params.userRepassword);
      this.$http("users", params, { method: "post" })
        .then(res => {
          this.disabled = false;
          wx.setStorageSync("addNewUser", true);
          this.$refs.userForm.reset();

          wx.showToast({
            title: "添加用户成功",
            icon: "none",
            mask: true,
            complete: () => {
              wx.navigateBack({
                delata: 1
              });
            }
          });
        })
        .catch(res => {
          this.disabled = false;
          this.showToast(res.head.msg);
        });
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    }
  },
  mounted() {
    console.log("new user", this);
  }
};
</script>
<style lang="scss">
.hj-new-user {
  min-width: 100vw;
  min-height: 100vh;
  background-color: #f4f7fb;
  padding: 10px;
  box-sizing: border-box;
  &__btn {
    &__container {
      margin-top: 30px;
      display: flex;
      justify-content: space-around;
    }
    &--next {
      background-color: rgba(102, 120, 233, 1);
      color: #fff;
      width: 100%;
    }
    &--reset {
    }
  }
}
</style>