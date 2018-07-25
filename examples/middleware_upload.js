const SactiveWeb = require('../lib/application');
const koaBody = require('koa-body');

let example1 = {
  name: 'hello',
  method: 'post',
  path: '/upload',
  middlewares: [koaBody({
    multipart: true,
    formidable: {
      uploadDir: __dirname
    }
  })],
  handler: function(ctx, next) {
    const files = ctx.request.files;
    console.log(files);
    return ctx.body = 'success';
  }
};

let app = new SactiveWeb();
app.route(example1);

app.init();
app.listen(8080);
