const extend = require('extend');
const _ = require('lodash');

class ValidationWrapper {
  constructor(name, validation = {}) {
    let options = {
      required: true,
      handler: function() {
        return true;
      },
      normalize: function(value) {
        return value;
      }
    };
    if (!_.isPlainObject(validation)) {
      throw new Error('Validation must be plain object.');
    }
    extend(true, options, validation);
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
    try {
      if (!this.options.handler(value)) {
        result.status = false;
        result.msg = this.options.errorMessage || `Key: ${this.name}, value: ${value}.`;
      }
    } catch (e) {
      result.status = false;
      result.msg = `Catch error: ${e.message}`;
    }
    return result;
  }
}

module.exports = ValidationWrapper;