module.exports = [
  {
    name: 'demo1-route1',
    method: null,
    path: '/demo1/route1',
    handler: function(ctx, next) {
      ctx.body = 'Hello demo1-route1 !!!';
    }
  },
  {
    name: 'demo1-route2',
    method: 'get',
    path: '/demo1/route2',
    handler: function(ctx, next) {
      ctx.body = 'Hello demo1-route2 !!!';
    }
  }
];