import Flyio from './interceptors'
import API from './apiUrl'
import Config from './config'
import isEmpty from 'lodash/isEmpty.js';
import merge from 'lodash/merge.js';


// 异常情况的错误处理
const errorFunction = (reqConfig, err) => {
  // 如果有异常需要提示
  if (!reqConfig.errorAction && reqConfig.isErrorDefaultTip) {
    Config.resError.tipShow(err)
  }
  throw (err)
}

let promises = [] // 接收接口请求的promise数组
let loadingTimer = [] // loading的定时器

// 接口请求封装函数
const handleRequest = (url = '', data = {}) => {
  let _url = API[url] || url || '';
  
  return (flyConfig = {}, defaultTipConfig = {}, isApendString) => {
    // 将header的内容改为 "content-type": "application/x-www-form-urlencoded" 就能实现new FormData();的效果了。
    // 如;
    //       header: {
    //         "content-type": "application/x-www-form-urlencoded"
    //       },
    //   错误示例：（微信小程序不能直接使用new FormData()）
    // var orderdet = new FormData();
    // orderdet.append("orderdet", JSON.stringify(submitOrder));
    // "content-type": "application/x-www-form-urlencoded"

    // 针对 request/api/{id} 占位符情况, 替换为 入参对象对应的属性值
    if (_url.match(/(\{\w+\})/g)) {
      // debugger
      var mergeData = merge({}, data);
      _url.match(/(\{\w+\})/g).forEach((item) => {
        var key = item.replace(/^\{(.+)\}$/g, '$1');
        if (data.hasOwnProperty(key)) {
          _url = _url.replace(item, data[key]);

          delete mergeData[key]
          // delete data[key]
        }
      })

      //将所有超过一个的反斜杆换成单斜杆，下文中的{2,}表示出现两次及其以上
      _url = _url.replace(/(\/){2,}/g, '/')
      //去掉结尾的反斜杆
      _url = _url.replace(/(\/)$/g, '')
      //将https: 单斜杆换成双斜杆
      _url = _url.replace(/(http[s]?:)\//g, '$1//')
      data = mergeData;
    }

    if (isApendString && !isEmpty(data)) {
      Object.keys(data).forEach((key, index) => {
        if (!index) {
          _url = _url + '?' + key + '=' + data[key]
        } else {
          _url = _url + '&' + key + '=' + data[key]
        }
      })
      data = {}
    }
    // console.log('isApendString', isApendString)
    // console.log('data', data)
    // console.log('_url', _url)

    // var  flyio = Flyio.request(_url, data, {
    //   ...Config.flyConfig,
    //   ...flyConfig
    // })

    // var tipConfig = {
    //   ...Config.reqConfig,
    //   ...defaultTipConfig
    // }

    var flyio = Flyio.request(_url, data, merge(merge({}, Config.flyConfig), flyConfig));

    var tipConfig = merge(merge({}, Config.reqConfig), defaultTipConfig);

    // 开启loading
    clearTimeout(loadingTimer) // 多个接口时需要清除上一个loading
    loadingTimer = setTimeout(() => {
      tipConfig.isLoading && Config.loading.loadingShow()
    }, Config.loading.limitTime)

    // 计算当前的promise是否全部加载完成
    promises.push(flyio.catch(e => {
      console.log('flyio.catch', e)
    }))
    // console.log('promises')
    Promise.all(promises).then(data => {
      console.log('Promises data', data);
      // if ((data && data.length) !== promises.length) return
      if ((data && data.length) !== (promises && promises.length)) {
        return;
      }
      promises = []; // 所有请求完后清除promise数组
      clearTimeout(loadingTimer); // 当请求在xxxms内完成则直接清除loading计时器
      tipConfig.isLoading && Config.loading.loadingHide() // 当promise全部加载完成则隐藏loading
    })

    return flyio.then(res => {
      console.log('handleRequest flyio', res)
      console.log(Config.resSuccess.key.split('.'))
      if (!Config.resSuccess.key) {
        return res
      }
      // 成功返回
      var resSuccessVal = '';
      Config.resSuccess.key.split('.').forEach((keyStr) => {
        if (resSuccessVal) {
          resSuccessVal = resSuccessVal[keyStr]
        } else {
          resSuccessVal = res[keyStr]
        }
      })
      console.log(resSuccessVal, typeof resSuccessVal)
      console.log('Config.resSuccess.value', Config.resSuccess.value)
      if (resSuccessVal === Config.resSuccess.value) {
        // if (res[Config.resSuccess.key] === Config.resSuccess.value) {
        return res
      } else {
        errorFunction(tipConfig, res)
      }
    }).catch(err => {
      console.log('handleRequest err', err)
      errorFunction(tipConfig, err)
    })
  }
}

// export default handleRequest
export default function (url, params = {}, flyConfig = {}, defaultTipConfig = {}, isApendString = false) {
  // console.log('requst wrapper this', this)
  // console.log('isApendString', isApendString)
  if (wx.getStorageSync('sessionId')) {
    var newFlyConfig = {
      headers: {
        sessionId: wx.getStorageSync('sessionId'),
        // "content-type": "application/x-www-form-urlencoded"
      }
    };
    var mergeFlyConfig = merge(newFlyConfig, flyConfig);
    flyConfig = mergeFlyConfig;
  }
  // console.log('flyConfig', flyConfig)

  return handleRequest(url, params)(merge({}, flyConfig), defaultTipConfig, isApendString)
}
