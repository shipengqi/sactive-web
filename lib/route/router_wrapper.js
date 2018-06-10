const extend = require('extend');
const _ = require('lodash');
const ValidationWrapper = require('./validation_wrapper');

class RouterWrapper {
  constructor(routerDefine) {
    routerDefine.method = routerDefine.method.toLowerCase();
    routerDefine.dependencies = routerDefine.dependencies ? routerDefine.dependencies : [];
    routerDefine.paramValidations = this.validationsToWrap(routerDefine.paramValidations);
    routerDefine.queryValidations = this.validationsToWrap(routerDefine.queryValidations);
    routerDefine.dataValidations = this.validationsToWrap(routerDefine.dataValidations);
    if (!_.isArray(routerDefine.dependencies)) {
      throw new Error('Dependencies must be an array.');
    }
    extend(true, this, routerDefine);
  }

  use($$injector) {
    _.each(this.dependencies, dependency => {
      let instance = $$injector.getInstance(dependency);
      if (instance) {
        this[dependency] = instance;
      }
    });
    $$injector.getInstance('$$route')[this.method](this.path, async (ctx, next) => {
      let validateResult = null;
      validateResult = this.validate(ctx);
      if (!validateResult.status) {
        return validateResult;
      }
      this.handler.call(this, ctx, next);
    });
  }

  validationsToWrap(validations = {}) {
    let wrappers = {};
    if (!_.isPlainObject(validations)) {
      throw new Error('Validations must be plain object.');
    }
    _.each(validations, (value, key) => {
      wrappers[key] = new ValidationWrapper(key, value);
    });
    return wrappers;
  }

  validate(ctx) {
    let params = ctx.params || {};
    let query = ctx.request.query || {};
    let body = ctx.request.body || {};
    let result = {
      status: true,
      msg: ''
    };
    _.each(this.paramValidations, (validation, key) => {
      result = validation.validate(params[key]);
      if (!result.status) {
        return false;
      }
    });
    _.each(this.queryValidations, (validation, key) => {
      result = validation.validate(query[key]);
      if (!result.status) {
        return false;
      }
    });
    _.each(this.dataValidations, (validation, key) => {
      result = validation.validate(body[key]);
      if (!result.status) {
        return false;
      }
    });
    return result;
  }
}

module.exports = RouterWrapper;