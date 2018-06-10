const AsctiveWeb = require('../lib/application');

let example1 = {
  name: 'hello',
  method: 'get',
  path: '/users/:id',
  handler: (ctx, next) => {
    ctx.body = `Hello, ${ctx.params.id}!!!`;
  },
  paramValidations: {
    id: {
      required: true
    }
  }
};

let app = new AsctiveWeb();
app.route(example1);
app.load(`${__dirname}/routes`);

app.init();
app.listen(9000);