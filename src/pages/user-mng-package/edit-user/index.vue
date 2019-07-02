<template>
  <div class="hj-edit-user">
    <form
      action=""
      @submit="onSubmit"
      @reset="onReset"
    >
      <editUserForm ref="editUserForm"></editUserForm>
      <div class="hj-edit-user__btn__container">
        <!-- <button
          class="hj-edit-user__btn--reset"
          @click.stop="reset"
        >重置
        </button> -->
        <button
          class="hj-edit-user__btn--next"
          formType="submit"
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
import editUserForm from "../components/edit-user-form.vue";
export default {
  onShareAppMessage,
  name: "hj-edit-user",
  mixins: [isMounted],
  components: { editUserForm },
  data() {
    return {
      isAuth: true,
      params: {
        userId: ""
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    onSubmit(e) {
      console.log("on submit", e);
    },
    onReset(e) {
      console.log("on reset", e);
    },
    reset(e) {
      console.log("reset", e);
      this.$refs.editUserForm.reset(false);
    },
    submit(e) {
      console.log("submit", e);
      this.$refs.editUserForm.validateAndGetFormData().then(res => {
        console.log("validateAndGetFormData res", res);
        if (res) {
          var params = { ...this.params, ...res };
          this.modifyData(params);
        }
      });
    },
    modifyData(params) {
      this.$http("userById", params, { method: "put" })
        .then(res => {
          console.log("userById modify", res);
          this.$refs.editUserForm.reset();
          wx.setStorageSync("editUser", true);
          wx.navigateBack({
            delta: 1
          });
        })
        .catch(res => {
          this.showToast(res.head.msg);
        });
    },
    queryData(params) {
      this.$http("userById", params, { method: "get" })
        .then(res => {
          console.log("userById success", res);
          // this.$refs.editUserForm.setData(res.data);
          var { tel, loginName, username, email } = res.data;
          this.$refs.editUserForm.reset(false, {
            tel,
            loginName,
            username,
            email,
            resetPasswordFlag: false
          });

          // "userId" : 1,
          // "tel" : "13012345678",
          // "userName" : "超级管理员",
          // "createTime" : "2016-01-01 00:00:00",
          // "updateTime" : "2018-10-31 14:09:09",
          // "remark" : "{}",
          // "loginName" : "hj_1301234567",
          // "isDisabled" : "false"
        })
        .catch(res => {
          console.log("catch res", res);
        });
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: "none",
        mask: true
      });
    },
    initData() {}
  },
  mounted() {
    console.log("edit user mounted", this, this.$mp.query);
    var query = this.$mp.query;

    // var { id: userId, name: username, tel, userType } = query;

    this.params.userId = query.userId;

    this.queryData({ userId: query.userId });
  }
};
</script>
<style lang="scss">
.hj-edit-user {
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
      width: 100%;
      color: #fff;
      background-color: rgba(102, 120, 233, 1);
    }
    &--reset {
    }
  }
}
</style>