#! /usr/bin/env node

require('colorful').colorful()

var program = require('commander')
var shell = require("shelljs")
var path = require('path')

program.on('--help', () => {
  console.log('  usage:'.to.bold.blue.color)
  console.log('');
  console.log('   $', 'xq-tools git release'.to.magenta.color, '')
  console.log('   $', 'xq-tools git release_init'.to.magenta.color, '')
  console.log('');
})

program.parse(process.argv)
var task = program.args[0]

console.log(task)

if(!task) {
  program.help()
} else {
  switch(task) {
    case 'static_push':
      var exe = `cd dist && git init\
        && git remote add origin git@git.ifengidc.com:fuyin/web-deploy.git\
        && git add .\
        && git commit -m "deploy"\
        && git checkout -b cmdb-super\
        && git push origin HEAD -f`;

      shell.exec(exe);
      break;
    case 'push':
      var exe = `cd dist && git add .\
        && git commit -m "deploy"\
        && git push origin HEAD -f`;

      shell.exec(exe);
      break;
    case 'deploy':
      var exe = `set NODE_ENV=production \
      && export NODE_ENV=production \
      && webpack -p --config ${path.resolve('./webpack.config.js')}`;

      shell.exec(exe);
      break;
    case 'release':
      var exe = `xq-tools git deploy\
      && xq-tools git push`;

      shell.exec(exe);
      break;
    case 'release_init':
      var exe = `xq-tools git deploy\
      && xq-tools git static_push`;

      shell.exec(exe);
      break;
    default:
      ;
  }
}
