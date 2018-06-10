const extend = require('extend');
const _ = require('lodash');

class ValidationWrapper {
  constructor(name, valitdaion = {}) {
    let options = {
      required: true
    };
    if (!_.isPlainObject(valitdaion)) {
      throw new Error('Validation must be plain object.');
    }
    if (!_.isFunction(valitdaion.handler)) {
      throw new Error('Validation handler must be a function.');
    }
    this.name = name;
    this.options = extend(true, options, valitdaion);
  }

  validate(value) {
    let result = {
      status: true,
      msg: ''
    };
    if (this.options.required && !value) {
      result.status = false;
      result.msg = `Key: ${this.name}, is required.`;
    }
    if (!this.options.handler(value)) {
      result.status = false;
      result.msg = this.options.errorMessage || `Validate failed, key: ${this.name}, value: ${value}.`;
    }
    return result;
  }
}

module.exports = ValidationWrapper;