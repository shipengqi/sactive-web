const AsctiveWeb = require('../lib/application');
let example1 = {
  name: 'example1',
  method: 'get',
  path: '/example',
  handler: () => {
    console.log('example router');
  }
};

let app = new AsctiveWeb();
app.route(example1);
app.init();
app.listen('9000');