#!/usr/bin/env node

require('colorful').colorful()

var program = require('commander')
var shell = require("shelljs")

var config = require('../config')

program.on('--help', () => {
  console.log('  usage:'.to.bold.blue.color)
  console.log('');
  console.log('   $', 'xq-tools run rollup'.to.magenta.color, 'rollup js')
  console.log('   $', 'xq-tools run webpack'.to.magenta.color, 'webpack source')
  console.log('');
})

program.parse(process.argv)
var task = program.args[0]

if(!task) {
  program.help()
} else if(task == 'server') {
  console.log('xq-tools run', task)
  var conf = config.getConfig(task)
  console.log(conf.configPath)
  var exe = `export NODE_ENV=devlopment && \
    node ${conf.configPath}`
  console.log(exe)
  shell.exec(exe)
} else if(task == 'rollup') {
  console.log('xq-tools run', task)
  var conf = config.getConfig(task)
  console.log(conf.configPath)
  var exe = `rollup \
    --c ${conf.configPath} `
  // console.log(exe)
  shell.exec(exe)
} else if(task == 'webpack') {
  console.log('xq-tools run', task)
  var conf = config.getConfig(task)
  var exe = `export NODE_ENV=production && webpack \
    --config ${conf.configPath} `
  console.log(exe)
  // console.log(exe)
  shell.exec(exe)
}