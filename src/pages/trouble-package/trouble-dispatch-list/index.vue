<template>
  <div class="hj-trouble-dispatch-list">
    <hjForm :config="config" @confirm="confirm" :isReset="isReset"></hjForm>
  </div>
</template>
<script>
// socialUnitId	是	int	关联社会单位ID
// deviceId	是	int	关联设备ID
// description	是	string	隐患描述
// foundTime	否	date	隐患发现时间
// attachments	否	file[]	附件列表
import hjForm from '@/components/common/hj-form.vue';
// import { $wuxToptips } from '@/utils/wux.js';
import isEmpty from 'lodash/isEmpty.js';

// import submitImage from '@/mixins/submitImage.js';
// import { $wuxSelect, $wuxToptips} from '@/utils/wux.js';
import { onShareAppMessage } from '@/mixins/pageRegisterFun.js';
import wuxToptips from '@/mixins/wuxToptips.js';
import isMounted from '@/mixins/isMounted.js';
export default {
  onShareAppMessage,
  onShow() {
    console.log('onShow', this.$options.name);
    console.log('onShow this.$root', this.$root);
    console.log('onShow this', this);
    console.log(
      "wx.getStorageSync('appIsHide')",
      wx.getStorageSync('appIsHide')
    );
    if (this.isMounted) {
      console.log('this.isMounted', this.isMounted);
      if (this.$root.$mp.appOptions.query.from == 'previewImage') {
        this.$root.$mp.appOptions.query.from = '';
        return;
      }

      if (this.$root.$mp.appOptions.query.from == 'addImage') {
        this.$root.$mp.appOptions.query.from = '';
        return;
      }
      console.log('appIsHide', wx.getStorageSync('appIsHide'));

      if (wx.getStorageSync('appIsHide')) {
        wx.setStorageSync('appIsHide', false);
        return;
      }

      this.isReset = true;
      console.log('isSet', this.isReset);
    }
  },
  onHide() {
    console.log('onHide', this.$options.name);
    this.isReset = false;
  },
  onUnload() {
    console.log('onUnload', this.$options.name);
    this.isReset = false;
  },
  name: 'troubleDispatchList',
  mixins: [isMounted, wuxToptips],
  components: {
    hjForm
  },
  data() {
    return {
      isReset: false,
      config: {
        socialUnitName: { value: '' },
        deviceName: { value: '' }
      },
      params: {}
    };
  },
  methods: {
    // validate(params) {
    //   if (!this.$wuxToptips) {
    //     this.$wuxToptips = $wuxToptips('#wux-toptips1', this.$root.$mp.page);
    //   }
    //   if (!params.title) {
    //     this.$wuxToptips &&
    //       this.$wuxToptips.error({ text: '请输入标题', duration: 3000 });
    //     return false;
    //   }
    //   if (!params.maintainers) {
    //     this.$wuxToptips &&
    //       this.$wuxToptips.error({ text: '请选择执行人', duration: 3000 });
    //     return false;
    //   }
    //   return true;
    // },
    confirm(params) {
      // params
      // socialUnitName
      // deviceName
      // title
      // description
      // maintainers
      // attachments

      // if (!this.validate(params)) {
      //   return;
      // }

      // var maintainers = [];
      // var attachments = [];
      // if (params.maintainers) {
      //   maintainers.push(this.actionner);
      // }
      // var params = { ...this.params, maintainers: this.actionner };
      // if (this.fileList && this.fileList.length) {
      //   attachments = this.fileList.map(item => item.url);
      //   params.attachments = attachments;
      // }
      var {
        socialUnitName,
        deviceName,
        title,
        description,
        maintainers,
        attachments
      } = params;

      this.submit({
        ...this.params,
        title,
        description,
        maintainers,
        attachments
      });
    },
    submit(params) {
      // 参数名	必选	类型	说明
      // title	是	string	标题，默认生成规则：描述[设备名称]
      // workOrderType	是	string	工单类型 // risk	消缺 patrol	巡检 maintenance	维保
      // sourceId	是	int	工单来源记录ID
      // sourceTime	是	string(date格式）	工单来源记录时间，当工单类型为隐患时，为必需参数
      // sourceType	是	string	工单来源类型，隐患、巡检、维保、工单  // risk	消缺 patrol	巡检 maintenance	维保 workorder	工单
      // maintainers	是	int数组	执行人ID数组
      // description	否	string	说明信息
      // attachments	否	file数组	附件数组

      // var uploadUrl = 'https://www.huajiecloud.com/efm-mp/workOrders';
      // this.isReset = false;
      this.$http('workOrders', params, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })
        .then(res => {
          // "multipart/form-data"   , "application/x-www-form-urlencoded"
          console.log('workOrders success res', res);
          // wx.navigateBack({ delta: 2 });
          this.wuxToptips(
            {
              text: '派单',
              success: () => {
                // wx.switch({ url: '/pages/me/main' });
                if (res.data) {
                  this.$root.$mp.appOptions.query.params = {
                    attachedWorkOrderId: res.data
                    // dealer:
                    // time:
                    // desc:
                  };
                }
                console.log('this, ', this);
                console.log(
                  'this.$root.$mp.appOptions.query',
                  this.$root.$mp.appOptions.query
                );
                // this.isReset = true;
                wx.navigateBack({ delta: -1 });
              }
            },
            res,
            // 'wux-toptips2',
            undefined,
            'success'
          );
        })
        .catch(res => {
          console.log('workOrders failed res', res);
          this.wuxToptips(
            {
              text: '派单',
              success: () => {
                // wx.redirectTo({ url: '/pages/me/main' });
                // wx.navigateBack({ delta: -1 });
              }
            },
            res,
            undefined
          );
        });
    }
  },
  mounted() {
    console.log(
      'trouble-dispatch-list this.$root.$mp.query',
      this.$root.$mp.query
    );
    // if (!this.isReset) {
    //   this.isReset = true;
    // }
    var query = this.$root.$mp.query;
    if (isEmpty(query) && process.env.NODE_ENV == 'development') {
      query = {
        deviceName: '1#PMC350F',
        from: 'trouble',
        sourceId: '2513',
        socialUnitName: '威氟化工制造工厂',
        sourceTime: '2018-10-23 23:47:00',
        desc: 'desc'
      };
    }

    this.params.workOrderType = 'risk';
    this.params.sourceType = 'risk';

    this.params.sourceId = query.sourceId;
    this.params.sourceTime = query.sourceTime;

    this.config = {
      deviceName: { value: query.deviceName },
      socialUnitName: { value: query.socialUnitName },
      title: { value: query.desc + '[' + query.deviceName + ']' }
    };

    // this.config.deviceName.value = query.deviceName;
    // this.config.socialUnitName.value = query.socialUnitName;
  }
};
</script>
<style lang="scss">
.hj-trouble-dispatch-list {
  // padding: 12px 12px 45px 12px;
  padding: 12px 12px 15px 12px;
  background-color: #f4f7fb;
  font-family: PingFang-SC-Medium;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  // width: 100wh;
  min-height: 100vh;
  box-sizing: border-box;
  // &__label {
  //   // margin-top: 10px;
  //   margin-bottom: 5px;
  //   font-size: 14px;
  //   font-family: PingFang-SC-Medium;
  //   font-weight: 500;
  //   color: rgba(99, 99, 99, 1);
  //   &--mark {
  //     color: red;
  //   }
  // }
  // &__input {
  //   width: 100%;
  //   border-bottom: 1px solid rgba(102, 120, 233, 1);
  //   margin-bottom: 20px;
  //   &__ft {
  //     font-size: 14px;
  //     font-family: PingFang-SC-Medium;
  //     font-weight: 500;
  //     color: rgba(99, 99, 99, 1);
  //     vertical-align: top;
  //   }
  // }
  // &__textarea {
  //   width: 100%;
  //   border: 1px solid rgba(102, 120, 233, 1);
  //   margin-bottom: 20px;
  // }
  // &__add {
  //   width: 44px;
  //   height: 44px;
  //   text-align: center;
  //   background-color: #fff;
  //   &__btn {
  //     text-align: center;
  //     width: 44px;
  //     height: 44px;
  //     line-height: 44px;
  //     vertical-align: middle;
  //     background-color: #fff;
  //   }
  //   &--active {
  //     background-color: rgba(144, 144, 144, 0.4);
  //   }
  // }
  // &__cancel_btn {
  //   background-color: #fff;
  //   color: rgba(102, 120, 233, 1);
  // }
  // &__confirm_btn {
  //   background-color: rgba(102, 120, 233, 1);
  //   color: #fff;
  // }
}
</style>
