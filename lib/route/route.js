const _ = require('lodash');
const Router = require('koa-router');
const RouterWrapper = require('./router_wrapper');
const {isArrowFunction} = require('./utils');

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
    routerDefine.dependencies = routerDefine.dependencies || [];
    routerDefine.middlewares = routerDefine.middlewares || [];
    routerDefine.config = routerDefine.config || {};
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
    if (isArrowFunction(routerDefine.handler)) {
      throw new Error('Router handler cannot be arrow function.');
    }
    if (!_.isArray(routerDefine.dependencies)) {
      throw new Error('Dependencies must be an array.');
    }
    if (!_.isArray(routerDefine.middlewares)) {
      throw new Error('Router middlewares must be an Array.');
    }
    _.each(routerDefine.middlewares, middleware => {
      if (!_.isFunction(middleware)) {
        throw new Error('Middleware must be a function.');
      }
    });
    this.logger.debug(`Add route name: ${routerDefine.name}`);
    let baseUrl = '';
    if (this.config && this.config.baseUrl && !_.isEmpty(this.config.baseUrl)) {
      baseUrl = this.config.baseUrl;
    }
    if (routerDefine.config.baseUrl && !_.isEmpty(routerDefine.config.baseUrl)) {
      baseUrl = routerDefine.config.baseUrl;
    }
    routerDefine.path = baseUrl + routerDefine.path;
    let router = new RouterWrapper(routerDefine);
    router.use($$injector);
    this.routersMap.set(routerDefine.name, router);
  }
}

module.exports = Route;