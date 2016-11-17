#!/usr/bin/env node

require('colorful').colorful()

var program = require('commander')
var shell = require("shelljs")

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
console.log(process.argv)
var file = process.argv[0]
var func = process.argv[1]
var option = process.argv.slice(2)
if (file && func && option) {
  console.log(option)
  option.map((v, k) => {
    var fun = v.split(':')
    console.log(fun[0], fun[1])
    require(file)[func](Utils.firstToUpperCase(fun[0]), fun[1])
  })
}
