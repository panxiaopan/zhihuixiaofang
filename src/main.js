import Vue from 'vue'
import App from './App'

// import Fly from 'flyio/dist/npm/wx';
// var fly = new Fly();
// Vue.prototype.$http = fly;

import handleRequest from '@/store/flyio/request';
Vue.prototype.$http = handleRequest;

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn' // 按需加载
dayjs.locale('zh-cn') // 全局使用西班牙语
import '@/plugins/extendDayjs.js'

// console.log('weekOfYear', dayjs('06/27/2018').week()) 
// import weekOfYear from 'dayjs/plugin/weekOfYear';
// dayjs.extend(weekOfYear);

Vue.prototype.$_dayjs = dayjs;

import IboxPlugin from './plugins/ibox'
Vue.use(IboxPlugin)

Vue.config.productionTip = false;
App.mpType = 'app'



import store from '@/store'
const app = new Vue({
  store,
  ...App
})

// const app = new Vue(App)
app.$mount()


// export default{
//   globalData: { // 无效
//     userInfo: null
//   }
// }
