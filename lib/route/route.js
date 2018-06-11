const _ = require('lodash');
const Router = require('koa-router');
const RouterWrapper = require('./router_wrapper');

/**
 * Create a `Route`.
 * Inherits from koa-router.
 * @see {@link https://www.npmjs.com/package/koa-router}
 * @class
 * @public
 * @extends Router
 */
class Route extends Router {
  /**
   * @constructs Route
   * @param {Object} $$logger - logger.
   * @param {Object} $$config - config.
   * @public
   */
  constructor($$logger, $$config) {
    super();
    this.routersMap = new Map();
    this.logger = $$logger;
    this.config = $$config;
  }

  /**
   * @param {Object} $$injector - application.
   * @param {Object} routerDefine - define a router.
   * @private
   */
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
    if (!_.isEmpty(this.config.baseUrl)) {
      routerDefine.path = this.config.baseUrl + routerDefine.path;
    }
    let router = new RouterWrapper(routerDefine);
    router.use($$injector);
    this.routersMap.set(routerDefine.name, router);
  }
}

module.exports = Route;