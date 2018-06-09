const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const {Sactive} = require('./di');
const {Route} = require('./route');
const logger = require('./logger');
const binder = new Sactive();
binder.bindClass('logger', logger);
binder.bindClass('route', Route);

class Application extends Koa {
  /**
   * Initialize a new `Application`.
   * @constructs Application
   * @api public
   */
  constructor() {
    super();
    this.logger = binder.getInstance('$$logger');
    this.router = binder.getInstance('$$route');
  }

  route(routerDefine) {
    this.router.add(binder, routerDefine);
  }

  load(path) {
    this.logger.debug(`Loading route files from ${path}`);
    if (fs.existsSync(path)) {
      fs.readdirSync(path).sort().map(file => this.loadFile(path, file));
    }
  }

  loadFile(filepath, filename) {
    let ext = path.extname(filename);
    let full = path.join(filepath, path.basename(filename, ext));

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
      process.exit(1);
    }
  }

  parseRoute(defines) {
    _.each(defines, define => {
      this.route(define);
    });
  }

  init() {
    this.use(this.router.routes());
  }

  bindClass(name, instance) {
    return binder.bindClass(instance);
  }

  bindFunction(name, instance) {
    return binder.bindFunction(instance);
  }

  bindInstance(name, instance) {
    return binder.bindInstance(instance);
  }

  getInstance(name) {
    return binder.getInstance(name);
  }

  getInstances(names) {
    return binder.getInstances(names);
  }

  deleteInstance(name) {
    binder.deleteInstance(name);
  }

  deleteInstances(names) {
    binder.deleteInstances(names);
  }
}
module.exports = Application;