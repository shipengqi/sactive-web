const _ = require('lodash');
const Router = require('koa-router');
const RouterWrapper = require('./router_wrapper');

class Route {
  constructor() {
    this.routers = new Map();
  }

  add(routerDefine) {
    if (!_.isString(routerDefine.name)) {
      throw new Error('Router name must be a string.');
    }
    if (!_.isString(routerDefine.method)) {
      throw new Error('Router method must be a string.');
    }
    if (!_.isString(routerDefine.path)) {
      throw new Error('Router path must be a string.');
    }
    if (!_.isFunction(routerDefine.handler)) {
      throw new Error('Router handler must be a function.');
    }
    let method = routerDefine.method.toLowerCase();
    if (!Route.ROUTE_METHOD[method] || Route.ROUTE_METHOD[method] === 0) {
      throw new Error(`Unsupported method: ${method}.`);
    }
    this.routers.set(routerDefine.name, new RouterWrapper(routerDefine));
  }

  use(app, routerDefine) {
  }
}

Route.ROUTE_METHOD = {
  get: 1,
  put: 1,
  post: 1,
  patch: 1,
  delete: 1,
  all: 1,
  use: 1
};
module.exports = Route;