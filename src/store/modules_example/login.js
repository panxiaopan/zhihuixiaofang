import Vue from 'vue'
const state = {
  // question: '最好别惹我'
  code: ''
}

const mutations = {
  // updatequestion(state, question) {
  //   const obj = state
  //   obj.question = question
  // }
  updateCode(state, payload) {
    state.code = payload.code;
  }
}

const actions = {
  // updatequestion({
  //   commit
  // }) {
  //   commit('updatequestion')
  // }
  wxlogin({
    commit
  }, payload = {}) {
    return new Promise((resolve, reject) => {
      wxlogin.login({
        success: (res) => {
          if (payload.success && typeof payload.success == 'function') {
            payload.success(res)
          }
          commit('updateCode', {
            code: res.code
          })
          resolve(res)
        },
        fail: (res) => {
          if (payload.fail && typeof payload.fail == 'function') {
            payload.fail(res)
          }
          console.log('wx.login() fail')
          reject(res)
        }
      })
    })
  },
  wxGetSetting({
    commit
  }, payload = {}) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (payload.success && typeof payload.success == 'function') {
            payload.success(res)
          }
          resolve(res)
        },
        fail: (res) => {
          if (payload.fail && typeof payload.fail == 'function') {
            payload.fail(res)
          }
          console.log('wx.getSetting() fail')
          reject(res)
        }
      })
    })
  },
  wxGetUserInfo({
    commit
  }, payload = {}) {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: (res) => {
          if (payload.success && typeof payload.success == 'function') {
            payload.success(res)
          }
          resolve(res)
        },
        fail: (res) => {
          if (payload.fail && typeof payload.fail == 'function') {
            payload.fail(res)
          }
          console.log('wx.getUserInfo() fail')
          reject(res)
        }
      })
    })
  },
  wxGetPhoneNumber({
    commit
  }, payload = {}) {
    return new Promise((resolve, reject) => {
      wx.getPhoneNumber({
        success: (res) => {
          if (payload.success && typeof payload.success == 'function') {
            payload.success(res)
          }
          resolve(res)
        },
        fail: (res) => {
          if (payload.fail && typeof payload.fail == 'function') {
            payload.fail(res)
          }
          console.log('wx.getPhoneNumber() fail')
          reject(res)
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
