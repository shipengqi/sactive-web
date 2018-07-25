module.exports = function() {
  return [
    {
      name: 'demo2-route1',
      method: 'get',
      path: '/demo2/route1',
      handler: function(ctx, next) {
        ctx.body = 'Hello demo2-route1 !!!';
      }
    },
    {
      name: 'demo2-route2',
      method: 'get',
      path: '/demo2/route2',
      handler: function(ctx, next) {
        ctx.body = 'Hello demo2-route2 !!!';
      }
    }
  ];
};