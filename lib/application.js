const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const {Sactive} = require('./di');
const {Route} = require('./route');
const logger = require('./logger');

class Application extends Koa {
  constructor() {
    super();
    this.binder = new Sactive();
    this.binder.bindClass('logger', logger);
    this.binder.bindClass('route', Route);
    this.logger = this.binder.getInstance('$$logger');
    this.router = this.binder.getInstance('$$route');
  }

  route(routerDefine) {
    this.router.add(this.binder, routerDefine);
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
}
module.exports = Application;