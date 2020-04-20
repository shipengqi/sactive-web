const SactiveWeb = require('../lib/application');
const send = require('koa-send');

let app = new SactiveWeb({enableTransform: true});

// headers: {Accept: 'application/x-download'}
let example = {
  name: 'download',
  method: 'get',
  path: '/download',
  handler: async function(ctx, next) {
    let f = await send(ctx, `./foobar.zip`);
    return f;
  }
};

app.route(example);

app.run(8080);