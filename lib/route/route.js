const _ = require('lodash');
const Router = require('koa-router');
const RouterWrapper = require('./router_wrapper');

class Route extends Router {
  constructor($$logger) {
    super();
    this.routersMap = new Map();
    this.logger = $$logger;
  }

  add($$injector, routerDefine) {
    if (this.routersMap.has(routerDefine.name)) {
      throw new Error(`Router name: ${routerDefine.name} has been registered.`);
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
    this.logger.debug(`Add route name: ${routerDefine.name}`);
    let router = new RouterWrapper(routerDefine);
    router.use($$injector);
    this.routersMap.set(routerDefine.name, router);
  }
}

module.exports = Route;