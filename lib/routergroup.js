const debug = require('debug')('active:router');
const Router = require('koa-router');
const methods = require('methods');

class RouterGroup extends Router {
  /**
   * Initialize a new `RouterGroup`.
   * Inherits from [`koa-router`]{@link https://github.com/ZijianHe/koa-router}.
   *
   * @class
   * @private
   * @param {Object} [options] - Application options.
   * @param {String} [options.prefix] prefix router paths.
   * @param {Application} [app]
   */
  constructor(options, app) {
    super(options);
    this.rstack = [];
    this.app = app;
    this.interceptors = this.app.interceptors;
    this.i = this.app.i;
    this.init();
  }

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
   * Overwrite routes.
   *
   * @private
   */
  routes() {
    this.rstack.forEach(r => {
      this.hack(r.method, r.path, r.stack);
    });
    return super.routes();
  }

  /**
   * Hack router.
   *
   * @private
   */
  hack(method, path, stack) {
    let hacked = [];
    // ensure middleware is a function
    stack.forEach((fn, index) => {
      let params = this.i.parse(fn);
      let instances = this.i.getInstancesMap(params);
      hacked.push(async (ctx, next) => {
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
    super[method](path, ...hacked);
    debug('register %s %s', method, path);
    return this;
  }
}

module.exports = RouterGroup;