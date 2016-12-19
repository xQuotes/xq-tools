#!/usr/bin/env node

'use strict'

var color = require('colorful')
var program = require('commander')
var pkg = require('../../package.json')

program
  .version(pkg.version)
  .command('git [name]', '执行一个部署任务')
  .command('run [name]', '执行一个任务')
  .command('exe [file] [func] [options]', '执行一个文件里面的功能,可传递多个参数')
  .parse(process.argv)

// console.log(program.runningCommand)

program.on('--help', function() {
  console.log('  Examples:')
  console.log('')
  console.log('    $ xq-tools --help')
  console.log('    $ xq-tools -h')
  console.log('')
})