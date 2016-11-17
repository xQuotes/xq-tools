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
  rollup: {
    configPath: path.resolve(__dirname, './rollup.config.js')
  },
  webpack: {
    configPath: path.resolve(__dirname, './webpack.config.js')
  },
  server: {
    configPath: path.resolve(__dirname, './server.js')
  }
}

function getConfig (opts) {
  return builds[opts]
}

exports.getConfig = name => getConfig(name)