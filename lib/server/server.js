'use strict';

import path from 'path';
import views from 'co-views';
import koa from 'koa';
import logger from 'koa-logger';
import serve from 'koa-static';
import route from 'koa-route';

let serverPath = path.resolve('./dist')
let render = views(serverPath, {
  map: {html: 'ejs'}
})

var app = koa();

// Logger
app.use(logger());

// Routes
app.use(route.get('/', index));

function *index() {
  this.body = yield render('index', {
    // title: 'title'
  });
}

// Serve static files
app.use(serve(serverPath));

if (module.parent) {
  app.listen(3000);
  console.log('listening on port 3000...');
}