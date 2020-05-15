const App = require('..');
const app = new App();

app.bindAny('name1', 'name' + 1);

app.use(($ctx, $name1, $next) => {
  $ctx.name1 = $name1;
  $next();
});

app.bindAny('name2', 'name' + 2);

app.group('v1')
  .get('/users/:name', ($ctx, $next, $name2) => {
    $ctx.body = {'name': $ctx.params.name, 'name1': $ctx.name1, 'name2': $name2};
    $next();
  }, ($ctx, $next, $name3) => {
    $ctx.body.name3 = $name3;
    $next();
  }, ($ctx, $next, $name4) => {
    $ctx.name4 = $name4;
    if ($ctx.params.name === CONSTANT_MOCK.URL_NAME) {
      throw new Error($ctx.params.name);
    }
    $next();
  }, ($ctx, $next, $name5) => {
    $ctx.body.name4 = $ctx.name4;
    $ctx.body.name5 = $name5;
    if ($ctx.params.name === 'name') {
      throw new Error($ctx.params.name);
    }
  });

app.bindAny('name3', 'name' + 3);
app.bindAny('name4', 'name' + 4);
app.bindAny('name5', 'name' + 5);

app.interceptors.errors.use((err, ctx) => {
  ctx.body = {
    code: 500,
    data: {},
    msg: err.message
  };
});

app.interceptors.response.use(ctx => {
  let data = ctx.body;
  ctx.body = {
    code: 200,
    data: data,
    msg: 'ok'
  };
});

app.listen(8080);