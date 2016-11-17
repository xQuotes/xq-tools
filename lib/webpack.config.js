var webpack = require('webpack')
var path = require('path')
var shell = require('shelljs')
// var WebpackMd5Hash = require('webpack-md5-hash')
// var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin')
// var TransferWebpackPlugin = require('transfer-webpack-plugin')

var node_modules_dir = path.resolve(__dirname, 'node_modules')

const version = process.env.VERSION || require('../package.json').version

const banner =
  'XQ.js v' + version + '\n' +
  '(c) 2016-' + new Date().getFullYear() + ' FuYin\n' +
  'Released under the MIT License.\n' +
  '/'

var source = {
  entryJS: './src/index.jsx'
}
var build = {
  dir: 'dist'
}

shell.mkdir('-p', 'dist')

var isProduction = function () {
  console.log(process.env.NODE_ENV)
  return process.env.NODE_ENV === 'production'
}

var plugins = [
  new webpack.BannerPlugin(banner),
  // new WebpackMd5Hash(),
  new ExtractTextPlugin("[name].css"), //合并css
  // new OpenBrowserPlugin({ url: httpUrl })
]

var entryApp = [
    path.resolve(source.entryJS) //__dirname, 
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
}

var public_path = isProduction() ? '/' : '/'

var config = {
  entry: {
    index: entryApp
  },
  output: {
    path: path.resolve(build.dir), //__dirname, 
    publicPath: public_path, // 自动添加 css js 文件绝对路径 
    filename: '[name].js'
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
  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
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
  },
  plugins: plugins,
  devtool: isProduction() ? null : 'source-map'
}

module.exports = config
