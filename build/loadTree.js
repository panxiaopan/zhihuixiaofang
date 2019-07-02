const fs = require('fs');
const path = require('path');

// let target = path.join(__dirname, '../');
let target = path.join(__dirname, '../dist');

//目标目录
function loadTree(target, deep, str) {
  let prev = new Array(deep).join(' |');
  // 前面| 字符串
  let dirinfo = fs.readdirSync(target);
  let files = [];
  let dirs = [];

  //保存文件或者是文件夹

  //遍历将文件或者文件夹分开存储
  for (let i = 0; i < dirinfo.length; i++) {
    // console.log(path.join(target,dirinfo[i]))
    let state = fs.statSync(path.join(target, dirinfo[i]));
    if (state.isFile()) {
      files.push(dirinfo[i])
    } else {
      dirs.push(dirinfo[i])
    }
  }

  // 文件夹操作
  for (let i = 0; i < dirs.length; i++) {
    str = str + `${prev} ├─ ${dirs[i]}\n`;
    console.log(`${prev} ├─ ${dirs[i]}`)
    // 递归
    let nextPath = path.join(target, dirs[i])
    let nextdeep = deep + 1;
    // 下一级的 文件目录 以及层级
    if (!/^(node_modules|node_moduless|dist|static|miniprogram_npm|\.git)$/g.test(dirs[i])) {
      str = loadTree(nextPath, nextdeep, str)
    }
    // 递归调用
  }

  // 文件操作
  for (let i = files.length - 1; i >= 0; i--) {
    if (i === 0) {
      str = str + `${prev} └─  ${files[i]}\n`;
      console.log(`${prev} └─  ${files[i]}`);
    } else {
      str = str + `${prev} ├─  ${files[i]}\n`;
      console.log(`${prev} ├─  ${files[i]}`);
    }
  }

  return str
}



fs.writeFileSync(path.resolve(__dirname, 'output.json'), loadTree(target, 1, ""));
