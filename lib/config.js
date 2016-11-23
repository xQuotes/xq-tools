const path = require('path')

const version = process.env.VERSION || require('../package.json').version

const banner =
  '/*!\n' +
  ' * XQ.js v' + version + '\n' +
  ' * (c) 2016-' + new Date().getFullYear() + ' FuYin\n' +
  ' * Released under the MIT License.\n' +
  ' */'

// console.log(path.resolve(__dirname, './rollup.config.js'))

const builds = {
  start: {
    configPath: path.resolve(__dirname, './server/index.js')
  },
  build: {
    configPath: path.resolve(__dirname, './webpack.config.js')
  },
  dev: {
    configPath: path.resolve(__dirname, './webpack.server.dev.js')
  }
}

function getConfig (opts) {
  return builds[opts]
}

exports.getConfig = name => getConfig(name)