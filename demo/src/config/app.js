var config = {}

config.banner = 'This file is created by fooying@qq.com'

config.entries = {
  index: {
    entry: 'src/index.js',
    template: 'src/template/index.html',

    filename: 'index.html',
    title: 'PC端',
    description: '',
    keywords: ''
  }, 
  mobile: {
    entry: 'src/mobile.js',
    template: 'src/template/index.html',

    filename: 'mobile.html',
    title: '移动端',
    description: '',
    keywords: ''
  }
}

config.proxy = {
  '/web/sw_*/**': 'http://172.30.205.224:8080',
  '/api/*': 'http://172.30.205.224:8081'
}

module.exports = config;