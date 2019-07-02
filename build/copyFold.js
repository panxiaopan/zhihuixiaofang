var fs = require('fs');
var path = require('path');

async function copyFold(fromPath, toPath) {
  mkdirsSync(toPath);
  try {
    // var result = await readFile();
    var files = fs.readdirSync(fromPath);
    var prArr = [];
    files.forEach((file) => {
      console.log('file', file)
      var from = path.join(fromPath, file);
      var to = path.join(toPath, file);
      var stat = fs.statSync(from);
      if (stat.isFile()) {
        prArr.push(copyFile(from, to))
      } else if (stat.isDirectory()) {
        prArr.push(copyFold(from, to))
      }
    })
  } catch (e) {
    throw e;
  }

  return Promise.all(prArr)
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function (err, data) {
      if (err) {
        console.log('err', err);
        reject(err)
      }
      resolve(data.toString());
    })
  })
}

function copyFile(fromPath, toPath) {
  return new Promise((resolve, reject) => {
    // 创建一个可读流
    var readerStream = fs.createReadStream(fromPath);

    // 创建一个可写流
    var writerStream = fs.createWriteStream(toPath);

    // 管道读写操作
    // 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
    readerStream.pipe(writerStream);
    // 处理流事件 --> data, end, and error
    writerStream.on('finish', function () {
      console.log("写入完成。");
      resolve(true);
    });

    writerStream.on('error', function (err) {
      console.log(err.stack);
      reject(err);
    });

    console.log("程序执行完毕");
  })

}

function stat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, function (err, stats) {
      if (err) {
        reject(err);
      }
      resolve(stats);
    })
  })
}

function exists(path) {
  return new Promise((resolve, reject) => {
    fs.exists(path, (exists) => {
      resolve(exists)
    })
  })
}

//同步递归创建方法
function mkdirsSync(dirname, mode) {
  console.log(dirname);
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname), mode)) {
      fs.mkdirSync(dirname, mode);
      return true;
    }
  }
}

// copyFold(__dirname, path.resolve(__dirname, '../sss'))

// export default copyFold
module.exports = copyFold;





















// function spawn(genF) {
//   return new Promise(function (resolve, reject) {
//     const gen = genF();
//     function step(nextF) {
//       let next;
//       try {
//         next = nextF();
//       } catch (e) {
//         return reject(e);
//       }
//       if (next.done) {
//         return resolve(next.value);
//       }
//       Promise.resolve(next.value).then(function (v) {
//         step(function () {
//           return gen.next(v);
//         });
//       }, function (e) {
//         return gen.throw(e);
//       });
//     }
//     step(function () {
//       return function () {
//         return gen.next(undefined);
//       }
//     });
//   })
// }
