<template>
  <div class="hj-accordion">
    <wux-accordion-group :title="groupTitle">
      <wux-accordion
        v-for="(li, index) in contentList"
        :key="index"
        :title="li.title"
      >
        <div class="hj-accordion__content">
          <div class="hj-accordion__content__left">
            {{li.content}}
            <!-- &nbsp;&nbsp; -->
          </div>

          <div
            class="hj-accordion__content__right"
            @click="clickIcon(li)"
          >
            <wux-icon
              wux-class="hj-accordion__content__right__icon"
              :type="li.icon||'md-videocam'"
              size="33"
              color="#6678e9"
              style="width:35px;"
            ></wux-icon>
          </div>

        </div>
      </wux-accordion>
    </wux-accordion-group>
  </div>
</template>
<script>
export default {
  name: "hj-accordion",
  props: {
    groupTitle: {
      type: String,
      default: "【使用须知】"
    },
    icon: {
      type: String,
      defualt: "md-videocam"
    },
    contentList: {
      type: Array,
      default: () => [
        {
          title: "1.如何登陆小程序",
          content:
            "首先需要通过微信搜索并添加”安全用电云小程序，然后授予用户信息进行登录(手机号或账号登录).详情请用力戳右侧视频",
          vid: "x0854l5fctb"
        }
      ]
    }
  },
  data() {
    return {};
  },
  methods: {
    clickIcon(li) {
      this.$emit("click-icon", li);
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
.hj-accordion {
  &__content {
    display: flex;
    align-items: cneter;
    &__left {
    }
    &__right {
      width: 33px;
      display: flex;
      &__icon {
        width: 33px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>