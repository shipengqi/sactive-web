const SactiveWeb = require('../lib/application');
const koaBody = require('koa-body');

let app = new SactiveWeb();

app.router.post('/upload', koaBody({
  multipart: true,
  formidable: {
    uploadDir: __dirname
  }
}), ctx => {
  const files = ctx.request.files;
  console.log(files);
  return ctx.body = 'success';
});

app.run(8080);