const App = require('..');

const app = new App();
app.bindAny('name', 'pooky');

app.use(($ctx, $name, $next) => {
  $ctx.testname1 = $name;
  $next();
});

app.group('v1')
  .get('/users/:name', ($ctx, $next, $name) => {
    $ctx.body = {'name': $ctx.params.name, 'testname1': $ctx.testname1, 'testname2': $name};
  });
app.group('v2/')
  .get('/users/:name', ($name, $ctx, $next) => {
    $ctx.response.body = {'name': $ctx.params.name, 'testname1': $ctx.testname1, 'testname2': $name};
  });
app.group('/v3/')
  .get('/users/:name', ($ctx, $name, $next) => {
    $ctx.body = {'name': $ctx.params.name, 'testname1': $ctx.testname1, 'testname2': $name};
  });
app.group('/v4/')
    .del('/users/:name', ($ctx, $name, $next) => {
        $ctx.body = `v4 delete user ${$ctx.params.name} success`;
    })
    .delete('/products/:name', ($ctx, $name, $next) => {
        $ctx.body = `v4 delete product ${$ctx.params.name} success`;
    });
app.delete('/users/:name', ($ctx, $name, $next) => {
    $ctx.body = `app delete user ${$ctx.params.name} success`;
})
app.del('/products/:name', ($ctx, $name, $next) => {
    $ctx.body = `app delete product ${$ctx.params.name} success`;
})

app.listen(8080);