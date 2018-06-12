const SactiveWeb = require('../lib/application');

let example1 = {
  name: 'hello',
  method: 'get',
  path: '/example/hello',
  handler: function(ctx, next) {
    ctx.body = 'Hello SActive !!!';
  }
};

let app = new SactiveWeb({baseUrl: '/api/test'});
app.route(example1);
app.load(`${__dirname}/routes`);

app.init();
app.listen(9000);