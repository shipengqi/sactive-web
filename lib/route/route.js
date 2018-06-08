const _ = require('lodash');
const Router = require('koa-router');
const RouterWrapper = require('./router_wrapper');

class Route extends Router {
  constructor() {
    super();
    this.routersMap = new Map();
  }

  add(routerDefine) {
    if (this.routersMap.has(routerDefine.name)) {
      throw new Error(`Router name: ${routerDefine.name} is registered.`);
    }
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
    let router = new RouterWrapper(routerDefine);
    router.use(this);
    this.routersMap.set(routerDefine.name, router);
  }
}

module.exports = Route;