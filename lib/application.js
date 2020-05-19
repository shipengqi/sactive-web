const debug = require('debug')('active:application');
const https = require('https');
const Koa = require('koa');
const methods = require('methods');
const Di = require('./di');
const RouterGroup = require('./routergroup');
const Interceptor = require('./interceptor');

/**
 * Expose `Application` class.
 * Inherits from [`Koa`]{@link https://koajs.com/}.
 */
class Application extends Koa {
  /**
   * Initialize a new `Application`.
   * Inherits from [`Koa`]{@link https://koajs.com/}.
   * @example
   *
   * Basic usage:
   *
   * ```javascript
   * const App = require('sactive-web');
   *
   * var app = new App();
   *
   * app.get('/', (ctx, next) => {
   *   // ctx.router available
   * });
   *
   * app.listen(8080);
   * ```
   *
   * @class
   * @public
   * @param {Object} [options] - Application options.
   * @param {String} [options.env='development'] Environment
   * @param {String[]} [options.keys] Signed cookie keys
   * @param {Boolean} [options.proxy] Trust proxy headers
   * @param {Number} [options.subdomainOffset] Subdomain offset
   * @param {Boolean} [options.proxyIpHeader] proxy ip header, default to X-Forwarded-For
   * @param {Boolean} [options.maxIpsCount] max ips read from proxy ip header, default to 0 (means infinity)
   * @param {String} [options.prefix] prefix router paths
   */
  constructor(options = {}) {
    super(options);
    this.mstack = [];
    this.interceptors = {
      response: new Interceptor(),
      errors: new Interceptor()
    };
    this.i = new Di();
    this.router = new RouterGroup({prefix: this.calculatePrefixPath(options.prefix)}, this);
    this.routergroup = [this.router];
    this.init();
  }

  /**
   * Alias for koa-router verbs methods.
   *
   * @name GET|PUT|POST|PATCH|DELETE|DEL|ALL
   * @memberof Application.prototype
   * @param {String} path
   * @param {Function=} middleware route middleware(s)
   * @param {Function} callback route callback
   * @returns {RouterGroup}
   */

  /**
   * Alias for koa `use()`.
   *
   * @name USE
   * @memberof Application.prototype
   * @param {Function} fn
   */

  /**
   * Create router verbs methods, where *verb* is one of the HTTP verbs such
   * as `app.get()` or `app.post()`.
   *
   * @name get|put|post|patch|delete|del|all
   * @memberof Application.prototype
   * @param {String} path
   * @param {Function=} middleware route middleware(s)
   * @param {Function} callback route callback
   * @returns {RouterGroup}
   */

  /**
   * Initialize.
   *
   * @private
   */
  init() {
    methods.push('all', 'del'); // `app.del()` alias for `router.delete()`
    methods.forEach(method => {
      this[method] = (path, ...middleware) => {
        return this.router[method](path, ...middleware);
      };
      this[method.toUpperCase()] = (path, ...middleware) => {
        return this.router[method.toUpperCase()](path, ...middleware);
      };
    });
    // Alias for koa `app.use()`
    this['USE'] = super['use'];
  }

  /**
   * Register application level middleware.
   *
   * @param {Function} fn middleware
   * @override
   * @public
   */
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    debug('use %s', fn._name || fn.name || '-');
    this.mstack.push(fn);
    return this;
  }

  /**
   * Hack middleware.
   *
   * @override
   * @private
   */
  hack(fn) {
    let params = this.i.parse(fn);
    let instances = this.i.getInstancesMap(params);
    super.use((ctx, next) => {
      instances.$ctx = ctx;
      instances.$next = next;
      fn(...Object.values(instances));
    });
    debug('hack %s', fn._name || fn.name || '-');
    return this;
  }

  /**
   * Alias for:
   *   Koa app.listen()
   *
   * @public
   */
  Listen(...args) {
    debug('koa listen');
    return super.listen(...args);
  }

  /**
   * Overwrite Koa app.listen()
   *
   * @param {Mixed} args ...
   * @override
   * @public
   */
  listen(...args) {
    debug('listen');
    this.mstack.forEach(m => {
      this.hack(m);
    });
    this.routergroup.forEach(rg => {
      super.use(rg.routes());
    });
    // super.use(this.router.routes());
    return super.listen(...args);
  }

  /**
   * Shorthand for:
   *   https.createServer(options, app.callback()).listen(...)
   *
   * @param {Object} options
   * @param {Mixed} args ...
   * @public
   */
  listenTLS(options, ...args) {
    debug('listenTLS');
    this.routergroup.forEach(rg => {
      super.use(rg.routes());
    });
    const server = https.createServer(options, this.callback());
    return server.listen(...args);
  }

  /**
   * Group router.
   *
   * @param {String} prefix prefix router paths
   * @return {RouterGroup}
   * @public
   */
  group(prefix) {
    if (typeof prefix !== 'string') throw new TypeError('prefix must be a string!');
    if (prefix === '') throw new Error('prefix cannot be a empty!');
    debug('group path - %s', prefix);
    let rg = new RouterGroup({prefix: this.calculatePrefixPath(prefix)}, this);
    this.routergroup.push(rg);
    return rg;
  }

  /**
   * Parse function|class parameters.
   *
   * @param {Class|Function} any
   * @return {String[]}
   * @public
   */
  parse(any) {
    return this.i.parse(any);
  }

  /**
   * Bind Class.
   *
   * @param {String} name - The name of the injected class.
   * @param {Class} instance - Injected class.
   * @param {Boolean} singleton.
   * @public
   */
  bindClass(name, instance, singleton) {
    return this.i.bindClass(name, instance, singleton);
  }

  /**
   * Bind function.
   *
   * @param {String} name - The name of the injected function.
   * @param {Function} instance - Injected function.
   * @param {Boolean} singleton.
   * @public
   */
  bindFunction(name, instance, singleton) {
    return this.i.bindFunction(name, instance, singleton);
  }

  /**
   * Bind Any.
   *
   * @param {String} name - The name of the injected function.
   * @param {*} instance - Injected instance.
   * @param {Boolean} singleton.
   * @public
   */
  bindAny(name, instance, singleton) {
    return this.i.bindAny(name, instance, singleton);
  }

  /**
   * Get Instance.
   *
   * @param {String} name - The name of the injected instance.
   * @return {*} - instance.
   * @public
   */
  getInstance(name) {
    return this.i.getInstance(name);
  }

  /**
   * Get Instances.
   *
   * @param {String[]} names - The names of the injected instances.
   * @return {Array} - instances.
   * @public
   */
  getInstances(names) {
    return this.i.getInstances(names);
  }

  /**
   * Get Instances map.
   *
   * @param {String[]} names - The names of the injected instances.
   * @return {Object} - instances.
   * @public
   */
  getInstancesMap(names) {
    return this.i.getInstancesMap(names);
  }

  /**
   * Delete Instance.
   *
   * @param {String} name - The name of the injected instance.
   * @public
   */
  deleteInstance(name) {
    this.i.deleteInstance(name);
  }

  /**
   * Delete Instances.
   *
   * @param {String[]} names - The names of the injected instances.
   * @public
   */
  deleteInstances(names) {
    this.i.deleteInstances(names);
  }

  /**
   * Reset instance pool.
   *
   * @public
   */
  reset() {
    this.i.reset();
  }

  /**
   * Calculate router prefix paths.
   *
   * @private
   */
  calculatePrefixPath(relativePath) {
    if (!relativePath || relativePath === '') {
      return '';
    }
    if (!relativePath.startsWith('/')) {
      relativePath = '/' + relativePath;
    }
    if (relativePath.endsWith('/')) {
      relativePath = relativePath.substr(0, relativePath.length - 1);
    }
    debug('router prefix - %s', relativePath);
    return relativePath;
  }
}

module.exports = Application;