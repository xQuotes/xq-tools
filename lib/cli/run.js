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
} else {
  switch(task) {
    case 'mydev':
      console.log('xq-tools run', task);
      var conf = config.getConfig(task);
      var exe = `set NODE_ENV=devlopment\
      && set NODE_ALIAS=true\
      && export NODE_ENV=devlopment\
      && export NODE_ALIAS=true\
      && babel-node ${conf.configPath}`;

      shell.exec(exe);
      break;
    case 'dev':
      console.log('xq-tools run', task);
      var conf = config.getConfig(task);
      var exe = `set NODE_ENV=devlopment \
      && export NODE_ENV=devlopment \
      && babel-node ${conf.configPath}`;

      shell.exec(exe);
      break;
    case 'build':
      console.log('xq-tools run', task);
      var conf = config.getConfig(task);
      var exe = `set NODE_ENV=production \
      && export NODE_ENV=production \
      && webpack --config ${conf.configPath}`;

      shell.exec(exe);
      break;
    case 'start':
      console.log('xq-tools run', task);
      var conf = config.getConfig(task);
      var exe = `babel-node ${conf.configPath}`;

      shell.exec(exe);
      break;
    default:
      ;
  }
}
