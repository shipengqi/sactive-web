module.exports = [
  {
    name: 'demo1-route1',
    method: 'get',
    path: '/demo1/route1',
    handler: (ctx, next) => {
      ctx.body = 'Hello demo1-route1 !!!';
    }
  },
  {
    name: 'demo1-route2',
    method: 'get',
    path: '/demo1/route2',
    handler: (ctx, next) => {
      ctx.body = 'Hello demo1-route2 !!!';
    }
  }
];