const AsctiveWeb = require('../lib/application');

let example1 = {
  name: 'hello',
  method: 'get',
  path: '/users/:id',
  handler: async function(ctx, next) {
    ctx.body = `Hello, ${this.$$test2.name}!!!`;
  },
  dependencies: ['$$test1', '$$test2'],
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
          console.log('value is string');
          return false;
        }
        return true;
      }
    }
  }
};

let app = new AsctiveWeb();
app.bindInstance('test1', {name: 'xiaoming'});
app.bindInstance('test2', {name: 'xiaoqiang'});
app.route(example1);
app.load(`${__dirname}/routes`);

app.init();
app.listen(9000);