const extend = require('extend');
const _ = require('lodash');
const ValidationWrapper = require('./validation_wrapper');
const NormalizationWrapper = require('./normalization_wrapper');
const {ValidateError} = require('../response_formatter').errors;

class RouterWrapper {
  constructor(routerDefine) {
    routerDefine.method = routerDefine.method.toLowerCase();
    routerDefine.dependencies = routerDefine.dependencies ? routerDefine.dependencies : [];
    routerDefine.paramValidations = this.validationsToWrap(routerDefine.paramValidations);
    routerDefine.queryValidations = this.validationsToWrap(routerDefine.queryValidations);
    routerDefine.dataValidations = this.validationsToWrap(routerDefine.dataValidations);
    routerDefine.paramNormalizations = this.normalizationsToWrap(routerDefine.paramNormalizations);
    routerDefine.queryNormalizations = this.normalizationsToWrap(routerDefine.queryNormalizations);
    routerDefine.dataNormalizations = this.normalizationsToWrap(routerDefine.dataNormalizations);
    if (!_.isArray(routerDefine.dependencies)) {
      throw new Error('Dependencies must be an array.');
    }
    routerDefine.dependencies.push('$$responseTransform');
    extend(true, this, routerDefine);
  }

  use($$injector) {
    let self = this;
    _.each(self.dependencies, dependency => {
      let instance = $$injector.getInstance(dependency);
      if (instance) {
        self[dependency] = instance;
      }
    });
    self.$$config = $$injector.getInstance('$$config');
    $$injector.getInstance('$$route')[self.method](self.path, async (ctx, next) => {
      self.normalize(ctx);
      let validateResult = self.validate(ctx);
      if (!validateResult.status) {
        return self.$$config.responseTransform(new ValidateError(validateResult.msg), null, ctx, next);
      }
      try {
        let response = await self.handler.call(self, ctx, next);
        if (response) {
          return self.$$config.responseTransform(null, response, ctx, next, self.template);
        }
        return response;
      } catch (e) {
        return self.$$config.responseTransform(e, null, ctx, next);
      }
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

  normalizationsToWrap(normalizations = {}) {
    let wrappers = {};
    if (!_.isPlainObject(normalizations)) {
      throw new Error('Validations must be plain object.');
    }
    _.each(normalizations, (value, key) => {
      wrappers[key] = new NormalizationWrapper(key, value);
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

  normalize(ctx) {
    let params = ctx.params || {};
    let query = ctx.request.query || {};
    let body = ctx.request.body || {};
    _.each(this.paramNormalizations, (normalization, key) => {
      ctx.params[key] = normalization.normalize(params[key]);
    });
    _.each(this.queryNormalizations, (normalization, key) => {
      ctx.request.query[key] = normalization.normalize(query[key]);
    });
    _.each(this.dataNormalizations, (normalization, key) => {
      ctx.request.body[key] = normalization.normalize(body[key]);
    });
  }
}

module.exports = RouterWrapper;