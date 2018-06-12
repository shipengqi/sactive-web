module.exports = function() {
  return [
    {
      name: 'func-routes',
      method: 'post',
      path: '/func/route/:id',
      handler: function(ctx, next) {
        ctx.response.body = {
          code: '200',
          data: {
            id: ctx.params.id
          },
          msg: `Hello /func/route: ${ctx.params.id} !!!`
        };
      }
    }
  ];
};