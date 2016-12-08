var webpack = require('webpack')
var path = require('path')
var shell = require('shelljs')
var WebpackMd5Hash = require('webpack-md5-hash')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin')
var TransferWebpackPlugin = require('transfer-webpack-plugin')
var OpenBrowserPlugin = require('open-browser-webpack-plugin')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

var node_modules_dir = path.resolve(__dirname, 'node_modules')

var appConfig = require(path.resolve('./src/config/app.js'))

var _ = require('lodash')
/* 
 * 用于分析模块的共用代码
 * https://github.com/webpack/docs/wiki/optimization#multi-page-app
 */
var httpUrl = 'http://localhost:3000'

var distDir = path.resolve('./dist')
shell.mkdir('-p', distDir)

var isProduction = function () {
  console.log(process.env.NODE_ENV || 'development')
  return process.env.NODE_ENV === 'production'
}

var aliasPath = {
  //后续直接 require('Utils') 即可
  Utils : path.resolve('./src/common/utils/utils.js'),
  Arr: path.resolve('./src/common/utils/array.js'),
  Str: path.resolve('./src/common/utils/string.js'),
  Obj: path.resolve('./src/common/utils/object.js'),
  Fetch: path.resolve('./src/common/utils/fetch.js'),
  Auth : path.resolve('./src/common/utils/auth.js'),
  Url : path.resolve('./src/route/url.js'),
  Api : path.resolve('./src/api/index.js'),
  Img : path.resolve('./src/common/img/index.js')
}

// entry
var entry = {}
entry.vendors = ['react', 'react-router']
// config.entry.common = ['Utils', 'Url', 'Api', 'Auth', 'Arr', 'Str', 'Obj', 'Fetch', 'Img']

// plugins
var plugins = [
  new LodashModuleReplacementPlugin({
    'collections': true,
    'shorthands': true
  }),
  new webpack.optimize.OccurrenceOrderPlugin,
  new webpack.ProvidePlugin({
      // _: 'lodash', // 使_变成全局变量,不用在自己文件require('lodash')了
      React: 'react',
      ReactDOM: 'react-dom',
      classNames: 'classnames'
  }),
  new WebpackCleanupPlugin({
    exclude: [".git/*", "dist/.git/*"]
  }),
  new webpack.BannerPlugin(appConfig.banner),
  new webpack.HotModuleReplacementPlugin(),
  new WebpackMd5Hash(),
  new ExtractTextPlugin("[name].[hash].css"), //合并css
  new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    filename: 'commons.[hash].js',
    minChunks: Infinity
  }), //用于分析模块的共用代码
  new webpack.NoErrorsPlugin(),
  // new TransferWebpackPlugin([
  //   {from: 'json'}
  // ], path.resolve(__dirname,'')),
  new OpenBrowserPlugin({ url: httpUrl })
]

// 添加其它入口文件

_.map(appConfig.entries, (v, k) => {
  entry[k] = [path.resolve(v.entry)]

  plugins.push(
    new HtmlWebpackPlugin({
      filename: v.filename,
      title: v.title,
      template: path.resolve(v.template),
      chunks: ['commons', 'vendors', k],
      inject: 'body'
    })
  );
  
  if (!isProduction()) {
    entry[k].push(
      'webpack/hot/dev-server',
      'webpack-dev-server/client?'+httpUrl
    )
  }
})

if( isProduction() ) {
  plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      test: /(\.jsx|\.js)$/,
      mangle: {
          except: ['exports', 'require']
      },
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      },
    })
  )
}

var public_path = isProduction() ? '/' : '/'

var config = {
  entry: entry,
  output: {
    path: distDir,
    publicPath: public_path, // 自动添加 css js 文件绝对路径 
    filename: '[name].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        // query:{
        //   "presets": [
        //     "es2015",
        //     "stage-0",
        //     "react"
        //   ],
        //   "plugins": [
        //     "transform-decorators-legacy",
        //     "transform-object-rest-spread",
        //     "lodash"
        //   ]
        // },
        exclude: [node_modules_dir]
      },{
        test: /\.(less|css)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css!less')
        // ?importLoaders=1!autoprefixer
        // importLoaders=1 解决autoprefixer css less 中存在的bug
      },
      {
        test: /\.(jpg|png|gif|ico)$/,
        loader: 'url?limit=8192'
      },
      { 
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      { 
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: 'file'
      }
    ]
  },
  resolve:{
    extensions:['','.js','.jsx'], // 可以忽略的后缀名
    alias: !!process.env.NODE_ALIAS ? aliasPath : {}
  },
  plugins: plugins,
  devtool: isProduction() ? null : 'source-map'
}

module.exports = config