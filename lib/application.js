const http = require('http');
const https = require('https');
const Koa = require('koa');
const views = require('koa-views');
const koaBody = require('koa-body');
const fs = require('fs');
const path = require('path');
const extend = require('extend');
const _ = require('lodash');
const {Sactive} = require('./di');
const {Route} = require('./route');
const Log = require('./logger');
const {
  responseTransform,
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor,
  FileProcessor,
  BaseProcessor
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
   * @param {Object} config - Configuration options for the `Application`.
   * @public
   */
  constructor(config = {}) {
    super();
    this.options = {
      port: 8080,
      host: 'localhost',
      tls: {
        key: '',
        cert: '',
        ca: ''
      },
      baseUrl: null,
      logLevel: 'info',
      view: {
        path: '',
        options: {}
      },
      responseTransform: null,
      enableTransform: false
    };
    extend(true, this.options, config);
    this.options.responseTransform = this.options.responseTransform || responseTransform.bind(this);
    if (!_.isFunction(this.options.responseTransform)) {
      throw new Error('ResponseTransform must be a function.');
    }
    this.binder = new Sactive();
    this.binder.bindClass('logger', Log);
    this.binder.bindClass('route', Route);
    this.binder.bindInstance('config', this.options);
    this.binder.bindClass('htmlProcessor', HtmlProcessor);
    this.binder.bindClass('jsonProcessor', JsonProcessor);
    this.binder.bindClass('fileProcessor', FileProcessor);
    this.binder.bindClass('baseProcessor', BaseProcessor);
    this.binder.bindClass('responseProcessor', ResponseProcessorFactory);
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
   * Initialize routers.
   *
   * @private
   */
  init() {
    if (this.options.view && this.options.view.path !== '') {
      this.use(views(this.options.view.path, this.options.view.options));
    }
    this.use(koaBody());
    this.use(this.router.routes());
    this.use(this.router.allowedMethods());
  }

  /**
   * Run the server.
   * @param {Number} port - Server port.
   * @public
   */
  run(port) {
    this.init();

    let server = http.createServer(this.callback());
    if (this.options.tls.cert !== '' && this.options.tls.key !== '') {
      let options = {
        key: fs.readFileSync(this.options.tls.key),
        cert: fs.readFileSync(this.options.tls.cert)
      };

      if (this.options.tls.ca !== '') {
        options.ca = [this.options.tls.ca];
      }
      server = https.createServer(options, this.callback());
    }
    if (port && _.isNumber(port)) {
      this.options.port = port;
    }
    return server.listen({
      host: this.options.host,
      port: this.options.port
    });
  }

  /**
   * Bind Class.
   *
   * @param {String} name - The name of the injected class.
   * @param {class} instance - Injected class.
   * @param {Object} opt - options for the instance.
   * @return {InstanceWrapper} - InstanceWrapper instance.
   * @public
   */
  bindClass(name, instance, opt) {
    return this.binder.bindClass(name, instance, opt);
  }

  /**
   * Bind Function.
   *
   * @param {String} name - The name of the injected function.
   * @param {Function} instance - Injected function.
   * @param {Object} opt - options for the instance.
   * @return {InstanceWrapper} - InstanceWrapper instance.
   * @public
   */
  bindFunction(name, instance, opt) {
    return this.binder.bindFunction(name, instance, opt);
  }

  /**
   * Bind Instance.
   *
   * @param {String} name - The name of the injected function.
   * @param {*} instance - Injected instance.
   * @param {Object} opt - options for the instance.
   * @return {InstanceWrapper} - InstanceWrapper instance.
   * @public
   */
  bindInstance(name, instance, opt) {
    return this.binder.bindInstance(name, instance, opt);
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