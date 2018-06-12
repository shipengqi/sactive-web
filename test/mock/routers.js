module.exports = [
  {
    name: 'array-routes',
    method: 'get',
    path: '/array/route',
    handler: function(ctx, next) {
      ctx.response.body = '<h1>Hello demo1-route2 !!!</h1>';
    }
  }
];