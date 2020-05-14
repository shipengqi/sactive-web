const debug = require('debug')('active:application');
const https = require('https');
const Koa = require('koa');
const Router = require('koa-router');
const methods = require('methods');
const Di = require('./di');

/**
 * Expose `Application` class.
 * Inherits from [`Koa`]{@link https://koajs.com/}.
 */
class Application extends Koa {
  /**
   * Initialize a new `Application`.
   * Inherits from [`Koa`]{@link https://koajs.com/}.
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
    this.i = new Di();
    this.router = new Router({prefix: options.prefix});
    this.init();
  }

  /**
   * Initialize.
   *
   * @private
   */
  init() {
    methods.push('all');
    methods.forEach(method => {
      this[method] = (path, ...middleware) => {
        return this.wrap(method, path, ...middleware);
      };
    });
  }

  /**
   * Wrap router.
   *
   * @private
   */
  wrap(method, path, ...middleware) {
    let stack = Array.isArray(middleware) ? middleware : [middleware];
    let wraped = [];
    // ensure middleware is a function
    stack.forEach(fn => {
      let type = (typeof fn);
      if (type !== 'function') {
        throw new Error(
          method + ' `' + path + '`: `middleware` ' +
            'must be a function, not `' + type + '`'
        );
      }
      let params = this.i.parse(fn);
      wraped.push((ctx, next) => {
        // for bind instance anywhere
        let instances = this.i.getInstancesMap(params);
        instances.$ctx = ctx;
        instances.$next = next;
        fn(...Object.values(instances));
      });
    }, this);
    this.router[method](path, ...wraped);
    debug('register %s %s', method, path);
    return this;
  }

  /**
   * Alias for:
   *   Koa app.use()
   *
   * @public
   */
  Use(fn) {
    debug('koa use');
    return super.use(fn);
  }

  /**
   * Overwrite Koa app.use()
   *
   * @override
   * @public
   */
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    let params = this.i.parse(fn);
    super.use((ctx, next) => {
      let instances = this.i.getInstancesMap(params);
      instances.$ctx = ctx;
      instances.$next = next;
      fn(...Object.values(instances));
    });
    debug('use %s', fn._name || fn.name || '-');
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
   * @override
   * @public
   */
  listen(...args) {
    debug('listen');
    super.use(this.router.routes());
    return super.listen(...args);
  }

  /**
   * Shorthand for:
   *   https.createServer(options, app.callback()).listen(...)
   *
   * @public
   */
  listenTLS(options, ...args) {
    debug('listenTLS');
    super.use(this.router.routes());
    const server = https.createServer(options, this.callback());
    return server.listen(...args);
  }

  /**
   * Parse function|class parameters.
   *
   * @param {Class|Function} [any]
   * @return {String[]}
   * @public
   */
  parse(any) {
    return this.i.parse(any);
  }

  /**
   * Bind Class.
   *
   * @param {String} [name] - The name of the injected class.
   * @param {Class} [instance] - Injected class.
   * @param {Boolean} [singleton].
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
   * @param {Boolean} [singleton].
   * @public
   */
  bindFunction(name, instance, singleton) {
    return this.i.bindFunction(name, instance, singleton);
  }

  /**
   * Bind Any.
   *
   * @param {String} [name] - The name of the injected function.
   * @param {*} [instance] - Injected instance.
   * @param {Boolean} [singleton].
   * @public
   */
  bindAny(name, instance, singleton) {
    return this.i.bindAny(name, instance, singleton);
  }

  /**
   * Get Instance.
   *
   * @param {String} [name] - The name of the injected instance.
   * @return {*} - instance.
   * @public
   */
  getInstance(name) {
    return this.i.getInstance(name);
  }

  /**
   * Get Instances.
   *
   * @param {String[]} [names] - The names of the injected instances.
   * @return {Array} - instances.
   * @public
   */
  getInstances(names) {
    return this.i.getInstances(names);
  }

  /**
   * Get Instances map.
   *
   * @param {String[]} [names] - The names of the injected instances.
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
}

module.exports = Application;