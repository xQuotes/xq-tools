var webpack = require('webpack')
var path = require('path')
var shell = require('shelljs')
var WebpackMd5Hash = require('webpack-md5-hash')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin')
var TransferWebpackPlugin = require('transfer-webpack-plugin')
var OpenBrowserPlugin = require('open-browser-webpack-plugin')

var node_modules_dir = path.resolve(__dirname, 'node_modules')

/* 
 * 用于分析模块的共用代码
 * https://github.com/webpack/docs/wiki/optimization#multi-page-app
 */

var httpUrl = 'http://localhost:3000'

var source = {
  entryAppJS: path.resolve('./demo/index.js')
}

shell.mkdir('-p', 'dist')
var build = {
  dir: 'dist',
  HTML1: {
    filename: 'index.html',
    title: 'DEMO',
    template: path.resolve(__dirname, '../tmp/index.ejs')
  }
}

var isProduction = function () {
  console.log(process.env.NODE_ENV)
  console.log(process.env.DEVICE)
  return process.env.NODE_ENV === 'production'
}

var plugins = [
  new webpack.ProvidePlugin({
      _: 'lodash', // 使_变成全局变量,不用在自己文件require('lodash')了
      React: 'react',
      ReactDOM: 'react-dom',
      classNames: 'classnames'
  }),
  new WebpackCleanupPlugin({
    exclude: [".git/*", "dist/.git/*"]
  }),
  new webpack.BannerPlugin('This file is created by fooying@qq.com'),
  new webpack.HotModuleReplacementPlugin(),
  new WebpackMd5Hash(),
  new ExtractTextPlugin("[name].[hash].css"), //合并css
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    filename: 'vendors.[hash].js',
    minChunks: Infinity
  }), //用于分析模块的共用代码
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    filename: build.HTML1.filename,
    title: build.HTML1.title,
    template: build.HTML1.template,
    chunks: ['vendors', 'app'],
    inject: 'body'
  }),
  new TransferWebpackPlugin([
    {from: 'json'}
  ], path.resolve(__dirname,'')),
  new OpenBrowserPlugin({ url: httpUrl })
]

var entryApp = [
    path.resolve(__dirname, source.entryAppJS)
  ]

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
} else {
  entryApp.push(
    'webpack/hot/dev-server',
    'webpack-dev-server/client?'+httpUrl
  )
}

var public_path = isProduction() ? '/' : '/'

var config = {
  entry: {
    app: entryApp
  },
  output: {
    path: path.resolve(__dirname, build.dir),
    publicPath: public_path, // 自动添加 css js 文件绝对路径 
    filename: '[name].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        query:{
          "presets": [
            "es2015",
            "stage-2",
            "react"
          ],
          "plugins": [
            "transform-decorators-legacy",
            "transform-object-rest-spread"
          ]
        },
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
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      umd: 'react',
      // amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      umd: 'react',
      // amd: 'react-dom',
    },
  },
  resolve:{
    extensions:['','.js','.jsx'], // 可以忽略的后缀名
  },
  plugins: plugins,
  devtool: isProduction() ? null : 'source-map'
}

module.exports = config