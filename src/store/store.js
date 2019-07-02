import Vue from 'vue'
import merge from 'lodash/merge.js'
import lodashSet from 'lodash/set.js';
var systemInfo = wx.getSystemInfoSync();
const state = {
  systemInfo,
  count: 0,
  sessionId: '',
  loginTime: '',
  isLogin: false,
  isAutoLogin: true,
  home: {},
  login: {},
  permissionsMap: {
    mp_index_group: false,
    mp_risk_group: false,
    mp_task_group: false,
    mp_realtime_monitoring_group: false,
    mp_mine_group: false,
    mp_risk_start_work_order: false,
    mp_risk_risk_detail_view: false,
    mp_risk_add_handling_opinions: false,
    mp_risk_start_maintenance_order: false,
    mp_task_task_view: false,
    mp_task_task_operate: false,
    mp_task_related_work_order_add: false,
    mp_realtime_monitoring_single_social_unit_detail: false,
    mp_realtime_monitoring_map_view: false,
    mp_realtime_monitoring_single_social_unit_detail_risk_view: false,
    mp_realtime_monitoring_single_social_unit_detail_work_order_view: false,
    mp_realtime_monitoring_single_social_unit_detail_device_control: false,
    mp_mine_social_unit_device_manage_group: false,
    mp_mine_social_unit_device_manage_social_unit_update: false,
    mp_mine_social_unit_device_manage_social_unit_delete: false,
    mp_mine_social_unit_device_manage_device_update: false,
    mp_mine_social_unit_device_manage_device_delete: false,
    mp_mine_work_order_manage: false,
    mp_mine_risk_manual_report: false,
  },
  userPermissionsMap: null,
  troubleStore: {
    requestBy: 'default', // default,  store,  
    params: {
      grade: '', // info,earlyWarning,alarm
      state: '', // pending,processing,completed
    }
  },
  assignment: {},
  socialUnit: {
    tab: 'summary'
  },
  device: {
    tab: 'summary'
  }
}

const mutations = {
  INCREMENT: (state) => {
    const obj = state
    obj.count += 1
  },
  DECREMENT: (state) => {
    const obj = state
    obj.count -= 1
  },
  SETSESSIONID: (state, payload) => {
    state.sessionId = payload;
  },
  SETLOGINTIME: (state, payload) => {
    state.loginTime = payload;
  },
  SETAUTOLOGIN: (state, payload) => {
    state.isAutoLogin = payload
  },
  SET_TROUBLE_STORE_PARAMS: (state, payload) => {
    var newObj = merge({}, state.troubleStore.params);

    merge(newObj, payload);
    state.troubleStore.params = newObj;

    // console.log('SET_TROUBLE_PARAMS payload', payload);
    // console.log('SET_TROUBLE_PARAMS params before', state, state.troubleStore.params);
    // var newObj = {};
    // console.log('merge newObj', merge(newObj, state.troubleStore.params));
    // console.log('newObj', newObj)

    // console.log(merge(state.trouble.params, payload));


    console.log('SET_TROUBLE_PARAMS after', state.troubleStore.params, payload, newObj);
  },
  SET_REQUEST_BY: (state, payload) => {
    console.log('SET_REQUEST_BY before')
    state.troubleStore.requsetBy = payload
    console.log('SET_REQUEST_BY after', state.troubleStore.requsetBy)

  },
  SET_USER_PERMISSIONS_MAP: (state, payload = []) => {
    var userPermissionsMap = merge({}, state.permissionsMap);

    payload.forEach((item) => {
      userPermissionsMap[item] = true
    })

    state.userPermissionsMap = userPermissionsMap
    // permissionsMap
  },
  CHANGE_VAL_BY_PATH: (state, payload) => {
    lodashSet(state, payload.path, payload.value)
  },
  SET_IS_LOGIN(state, payload) {
    state.isLogin = payload
  }
}

const actions = {
  setIsLogin({
    commit
  }, payload) {
    commit('SET_IS_LOGIN', payload)
  },
  increment({
    commit
  }) {
    commit('INCREMENT')
  },
  decrement({
    commit
  }) {
    commit('DECREMENT')
  },
  getProvince({
    commit
  }, params = {}) {
    return Vue.iBox.http('globalUrl.getProvince', params, {
      method: 'get'
    })
  },
  setSessionId({
    commit
  }, {
    sessionId
  }) {
    commit('SETSESSIONID', sessionId)
  },
  setLoginTime({
    commit
  }, {
    loginTime
  }) {
    commit('SETLOGINTIME', loginTime)

  },
  setAutoLogin({
    commit
  }, {
    isAutoLogin
  }) {
    commit('SETAUTOLOGIN', isAutoLogin)
  },
  setTroubleStoreParams({
    commit
  }, {
    params
  }) {
    console.log('commit SET_TROUBLE_STORE_PARAMS', params)
    commit('SET_TROUBLE_STORE_PARAMS', params)
  },
  setRequestBy({
    commit
  }, {
    requestBy
  }) {
    commit('SET_REQUEST_BY', requestBy)
  },
  setUserPermissions({
    commit
  }, {
    permissions = []
  }) {
    console.log('SET_USER_PERMISSIONS_MAP permissions', permissions)
    commit('SET_USER_PERMISSIONS_MAP', permissions)
  },
  isAuth({
    commit,
    state
  }, permission) {
    if (!state.userPermissionsMap) {
      console.error('state.userPermissionsMap is null')
      return false
    }
    if (!permission) {
      return false
    }

    // if(Array.isArray(permission)&&permission.length){
    //    if(typeof permission[0] == 'string'){
    //      return permission.every((item)=>{
    //        return state.userPermissionsMap[item]
    //      })
    //    }else if(typeof permission[0] == 'object'){
    //     permission
    //      return permission
    //    }
    // }

    if (typeof permission == 'string') {
      return !!state.userPermissionsMap[permission]
    }
  },
  getAuthObjByArr({
    state,
    commit
  }, pemission) {
    if (!state.userPermissionsMap) {
      console.error('state.userPermissionsMap is null')
      return false
    }
    if (!Array.isArray(permission) || !permission.length) {
      return false
    }

    var result = {};
    pemission.forEach((item) => {
      if (state.userPermissionsMap[item]) {
        result[item] = true;
      } else {
        result[item] = false;
      }
    })

    return result
  },
  changeValByStatePath({
    state,
    commit
  }, payload) {
    commit('CHANGE_VAL_BY_PATH', payload)
  },
  showToast({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      wx.showToast({
        title: payload.title || '',
        icon: "none",
        mask: true,
        complete: function () {
          resolve()
        }
      });
    })

  },
}

export default {
  state,
  mutations,
  actions
}
