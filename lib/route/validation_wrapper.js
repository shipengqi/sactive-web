const extend = require('extend');
const _ = require('lodash');

class ValidationWrapper {
  constructor(name, valitdaion = {}) {
    let options = {
      required: true,
      handler: function() {
        return true;
      },
      normalize: function(value) {
        return value;
      }
    };
    if (!_.isPlainObject(valitdaion)) {
      throw new Error('Validation must be plain object.');
    }
    extend(true, options, valitdaion);
    if (!_.isFunction(options.handler)) {
      throw new Error('Validation handler must be a function.');
    }
    this.name = name;
    this.options = options;
  }

  validate(value) {
    let result = {
      status: true,
      msg: ''
    };
    if (this.options.required && !value) {
      result.status = false;
      result.msg = `Key: ${this.name}, is required.`;
      return result;
    }
    if (!this.options.handler(value)) {
      result.status = false;
      result.msg = this.options.errorMessage || `Validate failed, key: ${this.name}, value: ${value}.`;
    }
    return result;
  }
}

module.exports = ValidationWrapper;