const App = require('./lib/application');

function run() {
  let app = new App();
  app.bindAny('age', 18);
  app.use(($age, $ctx, $next) => {
    console.log('app middleware1');
    console.log('age' + $age);
    $next();
  });
  app.use(($ctx, $age, $next, $address) => {
    console.log('app middleware2');
    console.log('age' + $age);
    console.log('address', $address);
    $next();
  });
  app.get('/users/:name', ($age, $ctx, $next, $address) => {
    console.log('users/name middleware1');
    console.log($ctx.params.name);
    console.log('age' + $age);
    console.log('address', $address);
    $ctx.params.id = 'user1';
    $next();
  }, ($age, $ctx, $next, $address) => {
    console.log('users/name middleware2');
    console.log($ctx.params.name, $ctx.params.id);
    console.log('age' + $age);
    console.log('address', $address);
    $ctx.body = 'hello, ' + $ctx.path;
  });
  app.get('/users/', ($age, $ctx, $next, $address) => {
    console.log('users middleware1');
    console.log('age' + $age);
    console.log('address', $address);
    $ctx.params.id = 'user1';
    $next();
  }, ($age, $ctx, $next, $address) => {
    console.log('users middleware2');
    console.log($ctx.params.id);
    console.log('age' + $age);
    $ctx.body = 'hello, ' + $ctx.path;
  });
  app.use(($address, $ctx, $next, $age, $getAddress) => {
    console.log('app middleware3');
    console.log('age' + $age);
    console.log('address', $address);
    console.log('getAddress', $getAddress);
    $next();
  });
  app.bindAny('address', 'shanghai');
  app.bindFunction('getAddress', $address => {
    return $address;
  });
  app.listen(8080);
}

run();