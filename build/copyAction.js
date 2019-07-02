var copyFold = require('./copyFold');
var path = require('path');
var fs = require('fs');

var toPath = path.resolve(__dirname, '../dist/node_modules');
var fromPath = path.resolve(__dirname, '../docs/node_moduless');

// try {
//   var exists = fs.existsSync(path.resolve(__dirname, '../dist/node_modules'))
// } catch (e) {
// }
function action(fromPath, toPath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(toPath)) {
      copyFold(fromPath, toPath).then((res) => {
        resolve(res)
        console.log('copy finish');
      }).catch((res) => {
        console.log('copy err', res);
        reject(res)
      })
    } else {
      resolve(toPath + '\"  is exists');
      console.log('\"' + toPath + '\"  is exists');
    }
  })

}
var to2 = path.resolve(__dirname, '../dist/miniprogram_npm');
var from2 = path.resolve(__dirname, '../docs/miniprogram_npm');

var pathArr = [{
  to: toPath,
  from: fromPath
}, {
  to: to2,
  from: from2
}];
async function allActions(pathArr) {
  var promiseArr = [];
  pathArr.forEach((item) => {
    promiseArr.push(action(item.from, item.to));
  })
  var result = Promise.all(promiseArr)
  return result;
}

allActions(pathArr).then((res) => {
  console.log('allActions res', res)
}).catch((res) => {
  console.log('allActions catch res', res)

})
