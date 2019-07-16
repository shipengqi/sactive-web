const SactiveWeb = require('../lib/application');
const Path = require('path');
const serve = require('koa-static');

const app = new SactiveWeb({
  view: {path: Path.join(__dirname, './public')}, // set views dir
  options: {map: { html: 'ejs' }}, // ejs module is required, you should install ejs first, like `yarn add ejs`
  enableTransform: true
});
// set static dir
app.use(serve(Path.join(__dirname, './public')));
app.route({
  name: 'demo-render',
  method: 'get',
  path: '/demo/render/spa/',
  template: `index.html`,
  handler: function(ctx, next) {
    return {'name': 'xiaoming'};
  }
});

app.init();
app.listen(9000);