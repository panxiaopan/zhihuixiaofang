import Vue from 'vue'
const state = {
  question: '最好别惹我'
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
  summaryInfo(payload) {
    commit('summaryInfo', payload)
  },
  riskTrend(payload) {
    commit('riskTrend', payload)
  },
  weChatAutoLogin(payload) {
    commit('weChatAutoLogin', payload)
  },
  loginAndBindToWeChat(payload) {
    commit('loginAndBindToWeChat', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
