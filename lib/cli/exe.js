#!/usr/bin/env node

require('colorful').colorful()

var program = require('commander')
var shell = require('shelljs')
var path = require('path')

var config = require('../config')

program.on('--help', () => {
  console.log('  usage:'.to.bold.blue.color)
  console.log('');
  console.log('   $', 'xq-tools exe ./tools.js add func'.to.magenta.color, '执行 tools.js 里面的add("func")功能')
  console.log('   $', 'xq-tools exe ./tools.js replace func'.to.magenta.color, '执行 tools.js 里面的add("replace")功能')
  console.log('   $', 'xq-tools exe ./tools.js delete func'.to.magenta.color, '执行 tools.js 里面的add("delete")功能')
  console.log('   $', 'more ...');
})

program.parse(process.argv)

// console.log(file, func, option)
var file = program.args[0]
var func = program.args[1]
var option = program.args.slice(2)

if (file && func && option) {
  option.map((v, k) => {
    var fun = v.split(':')
    require(path.resolve(file))[func](fun[0], fun[1])
  })
}
