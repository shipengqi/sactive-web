const SactiveWeb = require('../lib/application');

let example1 = {
  name: 'hello',
  method: 'get',
  path: '/users/:id',
  handler: async function(ctx, next) {
    ctx.body = `Hello, ${ctx.params.id}!!!`;
  },
  paramNormalizations: {
    id: function(value) {
      return Number(value);
    }
  },
  paramValidations: {
    id: {
      required: false,
      handler: function(value) {
        if (typeof (value) === 'string') {
          return false;
        }
        return true;
      }
    }
  }
};

let app = new SactiveWeb({logLevel: 'info'});
app.route(example1);
app.load(`${__dirname}/routes`);

app.run(9000);