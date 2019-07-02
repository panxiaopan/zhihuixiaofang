<template>
  <div class="hj-trouble-dispatch-list">
    <hjForm :config="config" @confirm="confirm" :isReset="isReset"></hjForm>
    <!-- <wux-toptips id="wux-toptips1" /> -->
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
// import { $wuxSelect, $wuxToptips} from '@/utils/wux.js';
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
  name: 'assignmentNewComment',
  mixins: [wuxToptips, isMounted],
  components: {
    hjForm
  },
  data() {
    return {
      isReset: false,
      config: null,
      params: {}
    };
  },
  methods: {
    confirm(params) {
      // title
      // description
      // maintainers
      // attachments

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
      var { description: comment, attachments } = params;
      this.submit({ ...this.params, comment, attachments });
    },
    submit(params) {
      // 参数名	必选	类型	说明

      // id	是	string	工单ID，填充在URL中
      // taskId	是	string	任务ID，填充在URL中
      // title	是	string	标题，默认生成规则：隐患描述[设备名称]
      // description	否	string	说明信息
      // maintainers	是	int[]	执行人ID数组
      // attachments	否	file[]	附件文件列表
      // workOrderType	是	string	工单类型 // risk	消缺 patrol	巡检 maintenance	维保
      //  wx.uploadFile({url: this.uploadUrl, filePath: 'filePath', config: params, , name: 'attachments'})
      // this.isReset = false;
      this.$http('commentAndAttachments', params, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })
        .then(res => {
          // "multipart/form-data"   , "application/x-www-form-urlencoded"
          console.log('workOrders success res', res);
          // wx.navigateBack();
          this.wuxToptips(
            {
              text: '批注',
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
          console.log('workOrders failed res', res);
          this.wuxToptips(
            {
              text: '批注',
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
        id: '2513',
        taskId: '3324',
        workOrderType: 'risk',
        socialUnitName: '威氟化工制造工厂',
        deviceName: '1#PMC350F'
      };
    }

    // this.params.workOrderType = 'risk';
    // this.params.sourceType = 'risk';
    // this.params.sourceId = query.sourceId;
    // this.params.sourceTime = query.sourceTime;
    var { id, taskId, deviceName, socialUnitName } = query;
    this.params = { id, taskId };
    var config = {
      deviceName: {
        value: deviceName
      },
      socialUnitName: {
        value: socialUnitName
      },
      title: {
        show: false
      },
      maintainers: {
        show: false,
        require: false
      },
      description: {
        require: true,
        label: '添加批注意见',
        message: '请输入批注意见',
        placeholder: '请输入批注意见',
        value: ''
      }
    };
    this.config = config;
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
}
</style>
