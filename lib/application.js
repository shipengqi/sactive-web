const Koa = require('koa');
const views = require('koa-views');
const fs = require('fs');
const path = require('path');
const extend = require('extend');
const _ = require('lodash');
const {Sactive} = require('./di');
const {Route} = require('./route');
const Log = require('./logger');
const {
  responseTransform
} = require('./response_formatter');

/**
 * Create a new `Application`.
 * Inherits from Koa.
 * @see {@link https://koajs.com/}
 * @class
 * @public
 * @extends Koa
 */

class Application extends Koa {
  /**
   * @constructs Application
   * @param {Object} config - plain object, application config.
   * @property {object} router - class Route.
   * @public
   */
  constructor(config = {}) {
    super();
    this.options = {
      baseUrl: null,
      logLevel: 'debug',
      viewPath: null,
      responseTransform: responseTransform.bind(this)
    };
    extend(true, this.options, config);
    if (this.options.viewPath) {
      this.use(views(this.options.viewPath, {extension: 'pug'}));
    }
    this.binder = new Sactive();
    this.binder.bindClass('logger', Log);
    this.binder.bindClass('route', Route);
    this.binder.bindInstance('config', this.options);
    this.logger = this.binder.getInstance('$$logger');
    this.router = this.binder.getInstance('$$route');
  }

  /**
   * Register a router.
   *
   * @param {Object} routerDefine - define a router.
   * @public
   */
  route(routerDefine) {
    this.router.add(this, routerDefine);
  }

  /**
   * Loads every route files in the given path.
   *
   * @param {String} path - A String path on the filesystem.
   * @public
   */
  load(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).sort().map(file => this.loadFile(path, file));
    }
  }

  /**
   * Loads route file in path.
   *
   * @param {String} filepath - A String path on the filesystem.
   * @param {String} filename - A String filename in path on the filesystem.
   * @public
   */

  loadFile(filepath, filename) {
    let ext = path.extname(filename);
    let full = path.join(filepath, path.basename(filename, ext));
    this.logger.debug(`Loading route file from ${full}`);
    if (ext !== '.js') {
      return false;
    }

    try {
      let routerDefine = require(full);
      let defines = routerDefine;
      if (_.isFunction(routerDefine)) {
        defines = routerDefine(this);
      }
      if (_.isArray(defines)) {
        this.parseRoute(defines);
      } else {
        this.logger.warn(`Expected ${full} to assign a function or an array to module.exports, got ${typeof routerDefine}`);
      }
    } catch (error) {
      this.logger.error(`Unable to load ${full}: ${error.stack}`);
      process.exit();
    }
  }

  /**
   * Parse route defines.
   *
   * @param {String} defines - Router defines.
   * @private
   */
  parseRoute(defines) {
    _.each(defines, define => {
      this.route(define);
    });
  }

  /**
   * Initialize application routes.
   *
   * @public
   */
  init() {
    this.use(this.router.routes());
    this.use(this.router.allowedMethods());
  }

  /**
   * Bind Class.
   *
   * @param {String} name - The name of the injected class.
   * @param {Object} instance - Injected class.
   * @return {InstanceWrapper} - InstanceWrapper instance.
   * @public
   */
  bindClass(name, instance) {
    return this.binder.bindClass(name, instance);
  }

  /**
   * Bind Function.
   *
   * @param {String} name - The name of the injected function.
   * @param {Function} instance - Injected function.
   * @return {InstanceWrapper} - InstanceWrapper instance.
   * @public
   */
  bindFunction(name, instance) {
    return this.binder.bindFunction(name, instance);
  }

  /**
   * Bind Instance.
   *
   * @param {String} name - The name of the injected function.
   * @param {*} instance - Injected instance.
   * @return {InstanceWrapper} - InstanceWrapper instance.
   * @public
   */
  bindInstance(name, instance) {
    return this.binder.bindInstance(name, instance);
  }

  /**
   * Get Instance.
   *
   * @param {String} name - The name of the injected instance.
   * @return {*} - instance.
   * @public
   */
  getInstance(name) {
    return this.binder.getInstance(name);
  }

  /**
   * Get Instance.
   *
   * @param {String} names - The names of the injected instances.
   * @return {Array.<*>} - instances.
   * @public
   */
  getInstances(names) {
    return this.binder.getInstances(names);
  }

  /**
   * Delete Instance.
   *
   * @param {String} name - The name of the injected instance.
   * @public
   */
  deleteInstance(name) {
    this.binder.deleteInstance(name);
  }

  /**
   * Delete Instances.
   *
   * @param {String} names - The names of the injected instances.
   * @public
   */
  deleteInstances(names) {
    this.binder.deleteInstances(names);
  }
}
module.exports = Application;