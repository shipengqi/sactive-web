const extend = require('extend');
const _ = require('lodash');

class RouterWrapper {
  constructor(routerDefine) {
    routerDefine.method = routerDefine.method.toLowerCase();
    routerDefine.paramValidations = routerDefine.paramValidations ? routerDefine.paramValidations : {};
    routerDefine.queryValidations = routerDefine.queryValidations ? routerDefine.queryValidations : {};
    routerDefine.dataValidations = routerDefine.dataValidations ? routerDefine.dataValidations : {};
    if (!_.isPlainObject(routerDefine.paramValidations)) {
      throw new Error('ParamValidations must be plain object.');
    }
    if (!_.isPlainObject(routerDefine.queryValidations)) {
      throw new Error('QueryValidations must be plain object.');
    }
    if (!_.isPlainObject(routerDefine.dataValidations)) {
      throw new Error('DataValidations must be plain object.');
    }
    _.each(routerDefine.paramValidations, value => {
      if (!_.isFunction(value.handler)) {
        throw new Error('Validation handler must be a function.');
      }
    });
    _.each(routerDefine.dataValidations, value => {
      if (!_.isFunction(value.handler)) {
        throw new Error('Validation handler must be a function.');
      }
    });
    _.each(routerDefine.queryValidations, value => {
      if (!_.isFunction(value.handler)) {
        throw new Error('Validation handler must be a function.');
      }
    });
    extend(true, this, routerDefine);
  }

  use(Router) {
    Router[this.method](this.path, async (ctx, next) => {
      let validateResult = null;
      validateResult = this.validate(this.paramValidations, ctx.params);
      validateResult = this.validate(this.queryValidations, ctx.request.query);
      validateResult = this.validate(this.queryValidations, ctx.request.body);
      if (!validateResult.isValidate) {
        return validateResult;
      }
      return this.handler.call(this, ctx, next);
    });
  }

  validate(validations, data) {
    let result = {
      isValidate: true,
      msg: ''
    };
    _.each(validations, (validation, key) => {
      if (data && data[key]) {
        if (!validation.handler(data[key])) {
          result.isValidate = false;
          result.msg = validation.errorMessage || `Validate failed, key: ${key}, value: ${data[key]}.`;
          return false;
        }
      }
    });
    return result;
  }
}

module.exports = RouterWrapper;