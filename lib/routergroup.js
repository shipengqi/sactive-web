const debug = require('debug')('active:router');
const Router = require('koa-router');
const methods = require('methods');
const compose = require('koa-compose');

class RouterGroup extends Router {
  /**
   * Initialize a new `RouterGroup`.
   * Inherits from [`koa-router`]{@link https://github.com/ZijianHe/koa-router}.
   *
   * @class
   * @public
   * @param {Object} [options] - Application options.
   * @param {String} [options.prefix] prefix router paths.
   * @param {Application} app
   */
  constructor(options, app) {
    super(options);
    this.rstack = [];
    this.mstack = [];
    this.app = app;
    this.interceptors = this.app.interceptors;
    this.i = this.app.i;
    this.init();
  }

  /**
   * Overwrite all router verbs methods of [`Router`]{@link https://github.com/ZijianHe/koa-router}.
   *
   * @name get|put|post|patch|delete|del|all
   * @memberof RouterGroup.prototype
   * @param {String} path
   * @param {Function=} middleware route middleware(s)
   * @param {Function} callback route callback
   * @returns {RouterGroup}
   */

  /**
   * Initialize, overwrite all router methods.
   *
   * @private
   */
  init() {
    methods.push('all');
    methods.forEach(method => {
      this[method] = (path, ...middleware) => {
        let stack = Array.isArray(middleware) ? middleware : [middleware];
        stack.forEach(fn => {
          let type = (typeof fn);
          if (type !== 'function') {
            throw new Error(
              method + ' `' + path + '`: `middleware` ' +
                'must be a function, not `' + type + '`'
            );
          }
        });
        this.rstack.push({
          method: method,
          path: path,
          stack: stack
        });
        return this;
      };
    });
  }

  /**
   * Overwrite use.
   *
   * @param {Function} fn
   * @returns {RouterGroup}
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
   * Overwrite routes.
   *
   * @private
   */
  routes() {
    this.mstack.forEach(fn => {
      this.hackM(fn);
    });
    this.rstack.forEach(r => {
      this.hack(r.method, r.path, r.stack);
    });
    return super.routes();
  }

  /**
   * Hack middleware.
   *
   * @param {Function} fn
   * @private
   */
  hackM(fn) {
    this.mstack.forEach(fn => {
      let params = this.i.parse(fn);
      let instances = this.i.getInstancesMap(params);
      super.use((ctx, next) => {
        instances.$ctx = ctx;
        instances.$next = next;
        fn(...Object.values(instances));
      });
      debug('hack %s', fn._name || fn.name || '-');
    });
    return this;
  }

  /**
   * Hack router.
   *
   * @private
   */
  hack(method, path, stack) {
    let chain = [];

    let dispatch = (ctx, next) => {
      debug('%s %s', ctx.method, ctx.path);

      stack.forEach((fn, index) => {
        let params = this.i.parse(fn);
        let instances = this.i.getInstancesMap(params);
        chain.push(async (ctx, next) => {
          instances.$ctx = ctx;
          instances.$next = next;
          try {
            await fn(...Object.values(instances));
          } catch (e) {
            // set errorintercepted, if catch error
            ctx.errorintercepted = true;
            if (!this.interceptors.errors.enabled) {
              return Promise.reject(e);
            }
            debug('func %s, intercepted error', fn._name || fn.anem || '-');
            return this.interceptors.errors.do(e, ctx);
          }
          // ctx.errorintercepted=true, catch error, ignore response interceptor
          // index == stack.length - 1, avoid call response interceptor repeatedly
          if (!this.interceptors.response.enabled || ctx.errorintercepted || index < (stack.length - 1)) {
            return;
          }
          return this.interceptors.response.do(ctx);
        });
      }, this);

      return compose(chain)(ctx, next);
    };

    super[method](path, dispatch);
    return this;
  }
}

module.exports = RouterGroup;