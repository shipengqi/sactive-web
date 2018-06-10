const _ = require('lodash');

class NormalizationWrapper {
  constructor(name, normalization) {
    this.name = name;
    this.handler = function(value) {
      return value;
    };
    if (!_.isFunction(normalization)) {
      throw new Error('Normalization handler must be a function.');
    }
    this.handler = normalization;
  }

  normalize(value) {
    let result = value;
    try {
      result = this.handler(value);
    } catch (e) {
      // ignore
    }
    return result;
  }
}

module.exports = NormalizationWrapper;