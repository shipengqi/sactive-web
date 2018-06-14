const SactiveWeb = require('../lib/application');
const send = require('koa-send');

let app = new SactiveWeb();

let example1 = {
  name: 'download',
  method: 'get',
  path: '/download',
  handler: async function(ctx, next) {
    let f = await send(ctx, `./foobar.zip`);
    return f;
  }
};

app.route(example1);

app.init();
app.listen(8080);