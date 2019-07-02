// API

var isProduct = process.env.NODE_ENV == 'production';

//var requestDomain = isProduct ? 'https://www.huajiecloud.com' : 'http://192.168.1.99';
//服务器地址，测试服务器或者阿里云服务器

var requestDomain = 'http://zyt1003.oicp.net:16319/fp-mp';

// var requestDomain = 'https://www.huajiecloud.com/fp-mp';

// var summaryInfo = requestDomain + '/efm-mp/index';
// var riskTrend = requestDomain + '/efm-mp/index/riskTrend';
// var risks = '/efm-mp/risks';
var rawApi = {
  collectdata: '/fireProtection/index', //首页汇总
  requestDomain: '',
  summaryInfo: '/index',
  riskTrend: '/index/riskTrend',
  weChatAutoLogin: '/account/weChatAutoLogin',
  loginAndBindToWeChat: '/account/loginAndBindToWeChat',
  risks: '/risks',
  risksById: '/risks/{id}',
  reportArtificially: '/risks/reportArtificially',
  handlingOpinions: '/risks/{id}/handlingOpinions',
  maintenanceOrders: '/risks/{id}/maintenanceOrders',
  flowDetail: '/workOrders/{id}/flowDetail',
  workOrders: '/workOrders',
  users: '/auth/users',
  startedByMe: '/workOrders/startedByMe',
  toBeHandledByMe: '/workOrders/toBeHandledByMe',
  handledByMe: '/workOrders/handledByMe',
  applyForClose: '/workOrders/{id}/tasks/{taskId}/applyForClose',
  approveClose: '/workOrders/{id}/tasks/{taskId}/approveClose',
  claim: '/workOrders/{id}/tasks/{taskId}/claim',
  newReferOrder: '/workOrders/{id}/tasks/{taskId}/workOrders',
  commentAndAttachments: '/workOrders/{id}/tasks/{taskId}/commentAndAttachments',
  password: '/account/password',
  account: '/account',
  unbindToWeChat: '/account/unbindToWeChat',
  upload: '/files/upload',
  socialUnits: '/socialUnits/idName',
  devices: '/socialUnits/{id}/devices',
  reportArtificially: '/risks/reportArtificially',
  socialUnitsDetailList: '/socialUnits',
  statusStatistics: '/socialUnits/statusStatistics',
  socialUnitsDetail: '/socialUnits/{id}',
  socialUnitsRiskTrend: "/socialUnits/{id}/riskTrend",
  socialUnitsDevices: '/socialUnits/{id}/devices',
  socialUnitsDevice: '/socialUnits/{id}/devices/{deviceId}',
  socialUnitsDevicesRealtimeDataList: '/socialUnits/{id}/devices/{deviceId}/realtime',
  devicesDataByDataIds: '/socialUnits/{id}/devices/{deviceId}/history/dataIds/batch/{year}/{month}/{day}',
  devicesDataByDataId: '/socialUnits/{id}/devices/{deviceId}/history/dataIds/{dataId}/{year}/{month}/{day}',
  socialUnitsDevicesRisks: '/socialUnits/{id}/devices/{deviceId}/risks',
  socialUnitsRisks: '/socialUnits/{id}/risks',
  socialUnitsWorkOrders: '/socialUnits/{id}/workOrders',
  socialUnitsDeviceWorkOrders: '/socialUnits/{id}/devices/{deviceId}/workOrders',
  mapSocialUnits: '/map/socialUnits',
  mapSocialUnitsById: "/map/socialUnits/{id}",
  socialUnitsConfig: "/socialUnits/config",
  industries: "/socialUnits/industries",
  deviceBrandModelTree: "/common/deviceBrandModelTree",
  socialUnitsDeviceConfigById: '/socialUnits/{id}/devices/tree/config',
  socialUnitsConfigByID: "/socialUnits/{id}/config",
  socialUnitsConfigById: "/socialUnits/config",
  addSocialUnitsDevice: "/socialUnits/{id}/devices",
  deleteSocialUnitsDevice: "/socialUnits/{id}/devices/{deviceId}",
  socialUnitsNatures: '/socialUnits/natures',
  socialUnitsFireFacilityTypes: '/socialUnits/fireFacilityTypes',
  amapAdress: "/common/amap/address",
  users: '/auth/users',
  userById: '/auth/users/{userId}',
  // devicesDataByDataId: '/socialUnits/{id}/devices/{deviceId}/history/dataIds/batch/{year}/{month}/{day}'
  transferSocialUnits: '/auth/socialUnits/{socialUnitId}/owner/{userId}',
  controlConfigFile: '/socialUnits/{id}/devices/{deviceId}/controlConfigFile',
  paramSettings: '/socialUnits/{id}/devices/{deviceId}/paramSettings',
  settingParamByIdent: '/socialUnits/{id}/devices/{deviceId}/paramSettings/{ident}',
  userNicknameAndTel: '/auth/users/nicknameAndTel',
  telCode: '/account/telCode',
  emailCode: '/account/emailCode',
  passwordReset: '/account/passwordReset'

}

Object.keys(rawApi).forEach((key) => {
  rawApi[key] = requestDomain + rawApi[key]
})

const API = {
  // 公共服务
  'globalUrl.getProvince': 'https://h5-dev.iboxpay.com/hzui/static/data/province.json', // 获取省市
  ...rawApi
}

export default API
