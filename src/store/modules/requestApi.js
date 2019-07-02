import Vue from 'vue'
const state = {
  question: '最好别惹我'
}
const baseRequestFun = function (url, params = {}, flyconfig = {}, tipConfig = {}, isApendString = false) {
  return new Promise((resolve, reject) => {
    Vue.iBox.http(url, params, flyconfig, tipConfig, isApendString).then((res) => {
      console.log('request url: ' + url + ', success', res)
      resolve(res)
    }).catch((res) => {
      reject(res)
      console.log('request url: ' + url + ', fail', res)
    })
  })
}

const mutations = {
  updatequestion(state, question) {
    const obj = state
    obj.question = question
  },
  summaryInfo(state, payload) {

  },
  riskTrend(state, payload) {

  },
  weChatAutoLogin(state, payload) {

  },
  loginAndBindToWeChat(state, payload) {

  },
}

const actions = {
  updatequestion({
    commit
  }) {
    commit('updatequestion')
  },
  summaryInfo({
    commit
  }, payload) {
    commit('summaryInfo', payload)
  },
  riskTrend({
    commit
  }, payload) {
    commit('riskTrend', payload)
  },
  weChatAutoLogin({
    commit
  }, payload) {
    commit('weChatAutoLogin', payload)
  },
  loginAndBindToWeChat({
    commit
  }, payload) {
    commit('loginAndBindToWeChat', payload)
  },
  risks({
    commit
  }, payload) {
    // commit('')
    return new Promise((resolve, reject) => {
      Vue.iBox.http('risks', payload, {
        method: 'get'
      }).then((res) => {
        console.log('query risk success res', res)
        // var processData;
        // if (res.data.rows.length) {
        //   processData = res.data.rows.map((item) => {
        //   })
        // }
        resolve(res)
      }).catch((res) => {
        console.log('query risk fail res ', res)
        reject(res)
      })
    })
  },
  risksById({
    commit
  }, payload) {
    return baseRequestFun('risksById', payload, {
      method: 'get'
    })
    // return new Promise((resolve, reject)=>{
    //   Vue.iBox.http('risksById', payload,{method: 'get'}).then((res)=>{
    //     resolve(res)
    //   }).catch((res)=>{
    //     reject(res)
    //   })
    // })

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
