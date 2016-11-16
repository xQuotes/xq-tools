#!/usr/bin/env node

'use strict'

var color = require('colorful')
var program = require('commander')
var pkg = require('../../package.json')

program
  .version(pkg.version)
  .command('run [name]', 'run specified task')
  .parse(process.argv)

console.log(program.runningCommand)

program.on('--help', function() {
  console.log('  Examples:')
  console.log('')
  console.log('    $ xq-tools --help')
  console.log('    $ xq-tools -h')
  console.log('')
})