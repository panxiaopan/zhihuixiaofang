export var onShareAppMessage = function (res) {
  // this.selectComponent('#hj_home__device-status');
  console.log('this.ecComponent', this, res);
  return {
    title: '华杰智慧消防云',
    path: '/pages/index/main',
    success: function () {},
    fail: function () {}
  };
}
