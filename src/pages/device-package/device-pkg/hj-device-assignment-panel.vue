<template>
  <div
    class="hj-assignment__panel"
    :class="hjClass"
    @click="click"
  >
    <div class="hj-assignment__panel__hd">
      <wux-row class="hj-assignment__panel__hd__title">
        <wux-col
          class="hj-assignment__panel__hd__title__primary"
          span=10
        >{{title}}</wux-col>
        <wux-col
          class="hj-assignment__panel__hd__title__post"
          span=2
        >{{postTitle}}</wux-col>
      </wux-row>
      <wux-white-space size="small"></wux-white-space>
      <wux-row class="hj-assignment__panel__hd__subtitle">
        <wux-col
          class="hj-assignment__panel__hd__subtitle__primary"
          span=7
        >发起人：{{subtitle}}</wux-col>
        <wux-col
          class="hj-assignment__panel__hd__subtitle__post"
          span=5
        >{{postsubtitle}}</wux-col>
      </wux-row>
    </div>

    <wux-white-space bodyStyle="border-bottom: 1rpx solid #ddd;"></wux-white-space>
    <wux-white-space></wux-white-space>

    <wux-row
      v-if="contentlist.length"
      class="hj-assignment__panel__bd"
    >
      <div
        v-for="(li, index) in contentlist"
        :key="index"
      >
        <div :class="{'hj-assignment__panel__bd--active': !index}">
          {{li.label}}：{{li.value}}
        </div>
        <wux-white-space
          v-if="index+1 !== contentlist.length"
          size="small"
        ></wux-white-space>
      </div>
      <!-- <div class="hj-assignment__panel__bd__number">工单编号：{{orderNumber}}</div>
      <wux-white-space size="small"></wux-white-space>
      <div class="hj-assignment__panel__bd__unit">社会单位：{{socialUnit}} </div>
      <wux-white-space size="small"></wux-white-space>
      <div class="hj-assignment__panel__bd__name">设备名称：{{deviceName}} </div> -->
    </wux-row>
    <wux-white-space bodyStyle="border-bottom: 1rpx solid #ddd;"></wux-white-space>
    <wux-white-space></wux-white-space>
    <wux-row class="hj-assignment__panel__ft">
      <wux-col
        class="hj-assignment__panel__ft__primary"
        span=7
      >
        <div style="position: relative;">
          <div @click.stop="toggleFootList">
            处理人：{{foot}}
            <span v-if="footList.length">
              {{'>'}}
            </span>
          </div>
          <ol
            v-if="footList.length"
            class="hj-assignment__panel__ft__primary__ol"
            :class="tgClass"
          >
            <li
              class="hj-assignment__panel__ft__primary__ol__li"
              v-for="ft in footList"
              :key="ft.id"
            >
              {{ft.name}}
            </li>
          </ol>
          <!-- <wux-popover
            placement="rightTop"
            :auto="auto"
            :visible="visible"
            :defaultVisible="visible"
          >
            <div @click.stop="toggleFootList">处理人：{{foot}} {{'>'}}</div>
            <div
              slot="title"
              style="color: red;"
            >Title</div>
            <div slot="content">
              <div
                v-if="footList.length"
                v-for="f in footList"
                :key="f.id"
              >
                {{f.name}}
              </div>

            </div>
          </wux-popover> -->

        </div>

        <!-- <div>处理人：{{foot}} {{'>'}}</div>  -->
        <!-- 处理人：{{foot}} {{'>'}} -->
      </wux-col>
      <wux-col
        class="hj-assignment__panel__ft__post"
        span=5
      >{{postfoot}}</wux-col>
    </wux-row>
  </div>
</template>
<script>
export default {
  onShow() {
    console.log("onShow hj-assignment-panel");
    this.visible = false;
  },
  name: "hj-assignment-panel",
  props: {
    hjClass: {
      type: String,
      default: ""
    },
    workOrderId: "",
    title: "",
    postTitle: "",
    subtitle: "",
    postsubtitle: "",
    contentlist: {
      type: Array,
      default: _ => []
    },
    // orderNumber: '',
    // socialUnit: '',
    // deviceName: '',

    foot: "",
    footList: {
      type: Array,
      default: _ => []
    },
    postfoot: ""
  },
  data() {
    return {
      auto: false,
      visible: false
    };
  },
  computed: {
    tgClass() {
      return this.visible
        ? "hj-assignment__panel__ft__primary__ol__active"
        : "hj-assignment__panel__ft__primary__ol__unactive";
    }
  },
  methods: {
    click() {
      this.$emit("click");
    },
    toggleFootList(e) {
      console.log("toggleFootList", e);
      this.visible = !this.visible;
    }
  }
};
</script>
<style lang="scss" scoped>
.hj-assignment {
  &__panel {
    box-sizing: border-box;
    margin-top: 10px;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 1px 6px 20px 0px rgba(10, 57, 115, 0.16);
    border-radius: 12px;
    padding: 10px;
    &__hd {
      &__title {
        &__primary {
          font-size: 15px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: rgba(49, 49, 49, 1);
        }
        &__post {
          text-align: right;
          font-size: 15px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: rgba(102, 120, 233, 1);
        }
      }
      &__subtitle {
        &__primary {
          font-size: 13px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(121, 121, 121, 1);
        }
        &__post {
          text-align: right;
          font-size: 11px;
          font-family: DIN-Regular;
          font-weight: 400;
          color: rgba(121, 121, 121, 1);
        }
      }
    }
    &__bd {
      font-size: 14px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(49, 49, 49, 1);
      // padding-bottom: 10px;
      // border-bottom: 2px solid #ddd;
      // padding-top: 10px;
      // border-top: 2px solid #ddd;
      &--active {
        font-size: 14px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: #6678e9;
      }
      &__number {
      }
      &__unit {
      }
      &__name {
      }
    }
    &__ft {
      &__primary {
        font-size: 13px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(121, 121, 121, 1);
        &__ol {
          padding: 8px;
          position: absolute;
          right: 20px;
          bottom: 0px;
          background: #f4f7fb;
          &__li {
            padding: 5px;
            border-bottom: 1rpx #ddd solid;
          }
          &__active {
            display: block;
          }
          &__unactive {
            display: none;
          }
        }
      }
      &__post {
        text-align: right;
        font-size: 11px;
        font-family: DIN-Regular;
        font-weight: 400;
        color: rgba(121, 121, 121, 1);
      }
    }
  }
}
</style>
