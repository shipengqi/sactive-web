const _ = require('lodash');
const extend = require('extend');
const {INSTANCE_BIND_TYPE} = require('./constants');

class InstanceWrapper {
  constructor(instance, opt) {
    let options = {
      singleton: true,
      type: INSTANCE_BIND_TYPE.INSTANCE
    };
    if (opt && _.isObject(opt)) {
      options = extend(true, {}, options, opt);
    }
    this.attribute = instance;
    this.options = options;
  }
}

module.exports = InstanceWrapper;