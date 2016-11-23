var path = require('path')
var config = require("./webpack.config.js")
var webpack = require("webpack")
var webpackDevServer=require("webpack-dev-server")
var _ = require('lodash')

var compiler = webpack(config)

var appConfig = require(path.resolve('./src/config/app.js'))

var proxyConfig = _.mapValues(appConfig.proxy, (v, k) => {
  return {
    target: v,
    crossOrigin: true,
    secure: false
  }
})

var server = new webpackDevServer(compiler, {
  contentBase: "dist",
  hot: true,
  inline: true,
  historyApiFallback: true,
  proxy: proxyConfig
});


server.listen(3000);
