import {
  $wuxToptips
} from '@/utils/wux.js';
export default {
  methods: { // 使用此函数的前提是, 在 xml的模板中设置了  <wux-toptips id="wux-toptips1" /> 其中 id为xml指定的id值，另外，在main.json文件汇总引入了该组件
    wuxToptips(params, res, id, type) {
      id = id || '#wux-toptips1';
      type = type || 'error';
      // if (!this.$wuxToptips) {
      //   this.initWuxToptips(id)
      // }
      if (!params) {
        params = {
          text: '错误信息：'
        };
      }
      if (!params.text) {
        Object.assign(params, {
          text: '错误信息：'
        })
      }
      params.duration = params.duration || 2000;
      if (res && res.head && res.head.msg && typeof res.head.msg == 'string') {
        var text = params.text;
        text = text + ', ' + res.head.msg;
        params.text = text;
      }

      $wuxToptips(id, this.$root.$mp.page)[type](params)
      // (this.$wuxToptips && this.$wuxToptips[type](params))
    },
    // initWuxToptips(id) {
    //   if (!this.$wuxToptips) {
    //     this.$wuxToptips = $wuxToptips(id, this.$root.$mp.page);
    //   }
    // }
  },
  mounted() {
    // this.initWuxToptips()
  }
}
