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
    this.i = this.app.i;
    this.init();
  }
  /**
   * Alias for koa-router verbs methods.
   *
   * @name GET|PUT|POST|PATCH|DELETE|DEL|ALL
   * @memberof RouterGroup.prototype
   * @param {String} path
   * @param {Function=} middleware route middleware(s)
   * @param {Function} callback route callback
   * @returns {RouterGroup}
   */

  /**
   * Alias for koa-router `use()`.
   *
   * @name USE
   * @memberof RouterGroup.prototype
   * @param {String=} path
   * @param {Function} middleware
   * @param {Function=} ...
   * @returns {RouterGroup}
   */

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
      this[method.toUpperCase()] = super[method];
    });

    // Alias for `RouterGroup.delete()`
    this['del'] = this['delete'];

    // Alias for koa-router `use()` and `del()`
    this['USE'] = super['use'];
    this['DEL'] = super['delete'];
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
      let instances = this.i.getInstancesMap(this.i.parse(fn));
      super.use(async (ctx, next) => {
        instances.$ctx = ctx;
        instances.$next = next;
        try {
          await fn(...Object.values(instances));
        } catch (e) {
          // set ctx.ErrorIntercepted=true, avoid response interceptor handle the error
          ctx.ErrorIntercepted = true;
          return this.app.emit('ErrorIntercepted', e, ctx);
        }
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

      stack.forEach(fn => {
        let params = this.i.parse(fn);
        let instances = this.i.getInstancesMap(params);
        chain.push(async (ctx, next) => {
          instances.$ctx = ctx;
          instances.$next = next;
          try {
            await fn(...Object.values(instances));
          } catch (e) {
            // set ctx.ErrorIntercepted=true, avoid response interceptor handle the error
            ctx.ErrorIntercepted = true;
            return this.app.emit('ErrorIntercepted', e, ctx);
          }
        });
      }, this);

      return compose(chain)(ctx, next);
    };

    super[method](path, dispatch);
    return this;
  }
}

module.exports = RouterGroup;