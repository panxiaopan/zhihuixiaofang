// iBoxPlugin
import handleRequest from '@/store/flyio/request';
import utils from './utils';

export default {
  /**
   * 自定义方法
   * 组件内使用： this.$iBox.validator
   * 全局使用：Vue.iBox.validator
   */
   install (Vue) {
    const iBox = {
      http: handleRequest,
      ...utils
    }

    Vue.iBox = iBox
    Vue.prototype.$iBox = iBox
  }
}
