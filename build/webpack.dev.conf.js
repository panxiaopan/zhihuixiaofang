var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
// var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// copy from ./webpack.prod.conf.js
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var CopyWebpackPlugin = require('copy-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var commandParams = process.argv[2] == 'true' || false;
const IS_EXCLUDE_PART_PAGES = commandParams;
// add hot-reload related code to entry chunks
// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
// })
var uglifyjsplugin = new UglifyJsPlugin({
  uglifyOptions: {
    compress: {
      warnings: false,
      drop_debugger: false,
      // drop_console: true
      // pure_funcs: ["console.log"]
    }
  },
  sourceMap: true
})

var plugins = [
  new webpack.DefinePlugin({
    'process.env': config.dev.env
  }),
  // copy from ./webpack.prod.conf.js
  // extract css into its own file
  new ExtractTextPlugin({
    // filename: utils.assetsPath('[name].[contenthash].css')
    filename: utils.assetsPath('[name].wxss')
  }),
  // Compress extracted CSS. We are using this plugin so that possible
  // duplicated CSS from different components can be deduped.
  new OptimizeCSSPlugin({
    cssProcessorOptions: {
      safe: true
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common/vendor',
    minChunks: function (module, count) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf('node_modules') >= 0
      ) || count > 1
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common/manifest',
    chunks: ['common/vendor']
  }),
  // copy custom static assets
  // new CopyWebpackPlugin([{
  //   from: path.resolve(__dirname, '../static'),
  //   to: config.build.assetsSubDirectory,
  //   ignore: ['.*']
  // }]),
  // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
  // new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  // https://github.com/ampedandwired/html-webpack-plugin
  // new HtmlWebpackPlugin({
  //   filename: 'index.html',
  //   template: 'index.html',
  //   inject: true
  // }),
  new FriendlyErrorsPlugin()
]

// if (!IS_EXCLUDE_PART_PAGES) { // 经过实验，开发时 npm run dev true 排出指定包的时候，当编译为二维码时，代码上传到微信服务器时还是会报包超过2M的限制
//   plugins.push(uglifyjsplugin);
// }
plugins.push(uglifyjsplugin);
module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      extract: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  // devtool: '#cheap-module-eval-source-map',
  // devtool: '#source-map',
  devtool: 'false',
  output: {
    path: config.build.assetsRoot,
    // filename: utils.assetsPath('[name].[chunkhash].js'),
    // chunkFilename: utils.assetsPath('[id].[chunkhash].js')
    filename: utils.assetsPath('[name].js'),
    chunkFilename: utils.assetsPath('[id].js')
  },
  plugins
})
