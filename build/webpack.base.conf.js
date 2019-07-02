var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');
var MpvuePlugin = require('webpack-mpvue-asset-plugin');
var glob = require('glob');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var relative = require('relative');
var commandParams = process.argv[2] == 'true' || false;
const IS_EXCLUDE_PART_PAGES = commandParams;

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

function getEntry(rootSrc, pageSrc, options) {
  var map = {};
  options = options || {};
  // console.log('ignore options', options)
  // glob.sync(rootSrc + '/pages/**/main.js')
  glob.sync(rootSrc + pageSrc, options).forEach(file => {
    // console.log('getEntry file', file)
    // if(file.includes(options))
    var key = relative(rootSrc, file).replace('.js', '');
    // console.log('relative key', key);
    map[key] = file;
  });
  return map;
}

function getEntries(rootSrc, pageSrcArr, options) {
  var map = {};
  options = options || {};
  if (Array.isArray(pageSrcArr)) {
    pageSrcArr.forEach((pageSrc) => {
      Object.assign(map, getEntry(rootSrc, pageSrc, options))
    })
  } else {
    Object.assign(map, getEntry(rootSrc, pageSrcArr, options))
  }
  return map;
}

function getPageUrlByJson(appObj) {
  var subPkgPages = [];
  var appPages = [];
  if (Array.isArray(appObj.subPackages)) {
    subPkgPages = appObj.subPackages.map(item => {
      return item.pages.map(page => {
        return item.root + '/' + page;
      });
    });
  }

  if (Array.isArray(appObj.pages) && appObj.pages.length) {
    appPages = appObj.pages;
  }
  appPages = appObj.pages.concat.apply(appObj.pages, subPkgPages);
  return appPages;
}

function getPagesAndPkgMap(obj) {
  var result = {};
  if (Array.isArray(obj.pages)) {
    obj.pages.forEach((page) => {
      result[page] = page;
    })
  }
  if (Array.isArray(obj.subPackages)) {
    obj.subPackages.forEach((subPkg) => {
      result[subPkg.root] = subPkg.root;
    })
  }
  return result;
}

function getIgnoreReg({
  pre,
  postfix,
  obj,
  defaultVal
}) {
  if (!obj) {
    return defaultVal;
  }
  var pagesRegStr = getIgnoreRegStr({
    arr: obj.pages
  });

  var subPkgRegStr = getIgnoreRegStr({
    arr: obj.subPackages,
    itemKey: 'root'
  });

  var regStr = '';
  if (pagesRegStr && subPkgRegStr) {
    regStr = pagesRegStr.concat('|', subPkgRegStr);
  } else if (pagesRegStr && !subPkgRegStr) {
    regStr = pagesRegStr;
  } else if (!pagesRegStr && subPkgRegStr) {
    regStr = subPkgRegStr;
  }
  if (regStr) {
    var result = pre + '/' + '!(' + regStr + ')' + '/**/' + postfix;
    // (postfix.indexOf('.') == 0 ? '*' + postfix : postfix);
    return result;
  } else {
    return defaultVal;
  }
}

function getIgnoreRegStr({
  arr,
  itemKey
}) {
  var regStr = '';
  if (!arr || !Array.isArray(arr) || !arr.length) {
    return regStr;
  }
  regStr = arr.map((item) => {
    if (typeof item == 'string') {
      return item.split('/')[1]
    } else {
      if (!itemKey) {
        throw new Error('itemKey must be set')
      }
      return item[itemKey].split('/')[1]
    }
  }).join('|');

  return regStr;
}



var ignoreAppObj = require('../src/ignore.json');

var ignoreAppObjPageMap = getPagesAndPkgMap(ignoreAppObj);

// if (process.env.NODE_ENV == 'production' || !IS_EXCLUDE_PART_PAGES) {
if (!IS_EXCLUDE_PART_PAGES) {
  ignoreAppObj = null;
  ignoreAppObjPageMap = {};
}

// var appObj = require('../src/app.json');

var regJsStr = getIgnoreReg({
  pre: 'pages',
  postfix: 'main.js',
  obj: ignoreAppObj,
  defaultVal: 'pages/**/main.js'
});

var regJsonStr = getIgnoreReg({
  pre: 'pages',
  postfix: '*.json',
  obj: ignoreAppObj,
  defaultVal: '**/*.json'
});

pagesEntry = getEntries(resolve('./src/'), regJsStr);

var transform = function (content, path) {
  if (path.includes('app.json')) {
    var appContentObj = JSON.parse(content.toString());
    // if (process.env.NODE_ENV == 'development' && IS_EXCLUDE_PART_PAGES) {
    if (IS_EXCLUDE_PART_PAGES) {
      appContentObj.pages = appContentObj.pages.filter(function (page) {
        return !ignoreAppObjPageMap[page]
      })
      appContentObj.subPackages = appContentObj.subPackages.filter(function (subPkg) {
        return !ignoreAppObjPageMap[subPkg.root]
      })
      content = JSON.stringify(appContentObj);
    }
  }
  return content
}

var copyWebpackPluginJsonArr = process.env.NODE_ENV == 'development' ? [{
    from: regJsonStr,
    to: '',
  },
  {
    from: 'app.json',
    to: '',
    transform
  }
] : [{
  from: '**/*.json',
  to: ''
}];



// if (process.env.NODE_ENV == 'development') {
//   // 如果当前环境是开发环境则，根据 app.json 的相关配置区加载
//   var pagesEntries = {};
//   var rootSrc = resolve('./src/');
//   appPages.forEach(page => {
//     var key = relative(rootSrc, resolve('./src/' + page));
//     // var file = path.win32.resolve(path.join(__dirname, '..', './src/' + page));
//     var file = path.join(__dirname, '..', './src/' + page + '.js');
//     pagesEntries[key] = file;
//     return pagesEntries;
//   });
//   pagesEntry = pagesEntries;
// }

const appEntry = {
  app: resolve('./src/main.js')
};
const entry = Object.assign({}, appEntry, pagesEntry);

module.exports = {
  // 如果要自定义生成的 dist 目录里面的文件路径，
  // 可以将 entry 写成 {'toPath': 'fromPath'} 的形式，
  // toPath 为相对于 dist 的路径, 例：index/demo，则生成的文件地址为 dist/index/demo.js
  entry,
  target: require('mpvue-webpack-target'),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue: 'mpvue',
      '@': resolve('src')
      // 'flyio': 'flyio/dist/npm/wx',
    },
    symlinks: false,
    aliasFields: ['mpvue', 'weapp', 'browser'],
    mainFields: ['browser', 'module', 'main']
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'mpvue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        include: [resolve('src'), resolve('test')],
        use: [
          'babel-loader',
          {
            loader: 'mpvue-loader',
            options: {
              checkMPEntry: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    new MpvuePlugin(),
    new CopyWebpackPlugin(copyWebpackPluginJsonArr, {
      context: 'src/',
      ignore: ['ignore.json']
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      // to: path.resolve(__dirname, '../dist/static'),
      to: path.resolve(__dirname, '../dist/static'),
      ignore: ['.*']
    }]),
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, '../docs/node_moduless'),
    //   // to: path.resolve(__dirname, '../dist/static'),
    //   to: path.resolve(__dirname, '../dist/node_modules'),
    //   ignore: ['.*']
    // }])

  ]
};
