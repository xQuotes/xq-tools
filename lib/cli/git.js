#! /usr/bin/env node

require('colorful').colorful()

var program = require('commander')
var shell = require("shelljs")

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
        cd dist && git remote add origin git@git.ifengidc.com:fuyin/web-deploy.git\
        cd dist && git add .\
        cd dist && git commit -m "deploy"\
        cd dist && git checkout -b cmdb-super\
        cd dist && git push origin HEAD -f`;

      shell.exec(exe);
      break;
    case 'push':
      var exe = `cd dist && git add .\
        cd dist && git commit -m "deploy"\
        cd dist && git push origin HEAD -f`;

      shell.exec(exe);
      break;
    case 'deploy':
      var exe = `set NODE_ENV=production \
      && export NODE_ENV=production \
      && webpack -p --config webpack.config.js`;

      shell.exec(exe);
      break;
    case 'release':
      var exe = `node release.js deploy\
      node release.js push`;

      shell.exec(exe);
      break;
    case 'release_init':
      var exe = `node release.js deploy\
      node release.js static_push`;

      shell.exec(exe);
      break;
    default:
      ;
  }
}
