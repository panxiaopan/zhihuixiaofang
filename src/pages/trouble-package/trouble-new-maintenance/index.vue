<template>
  <div class="hj-trouble-new-maintenance">
    <hjForm :config="config" @confirm="confirm" :isReset="isReset"></hjForm>
    <!-- <wux-toptips id="wux-toptips1" /> -->
  </div>
</template>
<script>
import hjForm from '@/components/common/hj-form.vue';
// import { $wuxToptips } from '@/utils/wux.js';
import isEmpty from 'lodash/isEmpty.js';
import merge from 'lodash/merge.js';
import { onShareAppMessage } from '@/mixins/pageRegisterFun.js';
import wuxToptips from '@/mixins/wuxToptips.js';
import isMounted from '@/mixins/isMounted.js';
export default {
  onShareAppMessage,
  onShow() {
    console.log('onShow', this.$options.name);
    if (this.isMounted) {
      if (this.$root.$mp.appOptions.query.from == 'previewImage') {
        this.$root.$mp.appOptions.query.from = '';
        return;
      }
      if (this.$root.$mp.appOptions.query.from == 'addImage') {
        this.$root.$mp.appOptions.query.from = '';
        return;
      }
      if (wx.getStorageSync('appIsHide')) {
        wx.setStorageSync('appIsHide', false);
        return;
      }
      this.isReset = true;
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
  name: 'hj-trouble-new-maintenance',
  mixins: [wuxToptips, isMounted],
  components: {
    hjForm
  },
  data() {
    return {
      isReset: false,
      descriptionLabel: '维保原因',
      config: null,
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
    //   if (!params.description) {
    //     this.$wuxToptips &&
    //       this.$wuxToptips.error({ text: '请输入维保原因', duration: 3000 });
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
      // title
      // description
      // maintainers
      // attachments
      // if (!this.validate(params)) {
      //   return;
      // }
      var { title, description, maintainers, attachments } = params;
      this.submit({
        ...this.params,
        title,
        description,
        maintainers,
        attachments
      });
    },
    submit(params) {
      // id	是	int	隐患记录ID，填充在URL中
      // eventTime	是	string(date格式）	隐患记录时间
      // title	是	string	标题，默认生成规则：设备名称+描述+类型（消缺、巡检、维保）
      // description	是	string	说明信息
      // maintainers	是	int[]	执行人ID数组
      // attachments	否	file[]	附件数组

      // this.isReset = false;
      this.$http('maintenanceOrders', params)
        .then(res => {
          console.log('maintenanceOrders success res', res);
          // wx.navigateBack();
          this.wuxToptips(
            {
              text: '新建隐患维保工单',
              success: ress => {
                console.log('ress', ress);
                // wx.switch({ url: '/pages/me/main' });
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
          console.log('maintenanceOrders fail res', res);
          this.wuxToptips(
            {
              text: '新建隐患维保工单',
              success: ress => {
                console.log('ress', ress);
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

    this.params.id = query.sourceId;
    this.params.eventTime = query.sourceTime;

    var config = {
      socialUnitName: {
        value: ''
      },
      deviceName: {
        value: ''
      },
      title: {
        value: query.deviceName + '-' + query.desc + '-维保'
      },
      description: {
        require: true,
        label: '维保原因',
        message: '请输入维保原因',
        placeholder: '请输入维保原因',
        value: ''
      }
    };
    config.deviceName.value = query.deviceName;
    config.socialUnitName.value = query.socialUnitName;
    this.config = merge({}, config);
    // var config = {
    //   deviceName: query.deviceName,
    //   socialUnitName: query.socialUnitName
    // }
    // this.config = merge();
  }
};
</script>
<style lang="scss">
.hj-trouble-new-maintenance {
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
