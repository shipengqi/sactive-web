const _ = require('lodash');

class Sactive {
  constructor() {
    this.instancePool = new Map();
    this.instanceCache = new Map();
    this.instancePool.set('$$injector', new InstanceWrapper(this));
    this.instanceCache.set('$$injector', this);
  }

  bind(name, any, opt) {
    this.instancePool.set(name, new InstanceWrapper(any, opt));
  }

  bindInstance(name, any, opt) {
    if (opt && _.isObject(opt)) {
      opt.type = Sactive.BIND_TYPE.INSTANCE;
    }
    return this.bind(name, any, opt);
  }

  bindClass(name, any, opt) {
    if (opt && _.isObject(opt)) {
      opt.type = Sactive.BIND_TYPE.CLASS;
    }
    return this.bind(name, any, opt);
  }

  bindFunction(name, any, opt) {
    if (opt && _.isObject(opt)) {
      opt.type = Sactive.BIND_TYPE.FUNCTION;
    }
    return this.bind(name, any, opt);
  }

  getInstance(name) {
    if (!this.instancePool.has(name) && !this.instanceCache.has(name)) {
      return null;
    }
    if (this.instanceCache.has(name)) {
      return this.instanceCache.get(name);
    }
    let instanceReplicate = _.cloneDeep(this.instancePool.get(name));

    if (instanceReplicate.options.type === Sactive.BIND_TYPE.FUNCTION) {
      this.getInstanceAsFunction(name, instanceReplicate);
    } else if (instanceReplicate.options.type === Sactive.BIND_TYPE.CLASS) {
      this.getInstanceAsClass(name, instanceReplicate);
    } else {
      this.getInstanceAsInstance(name, instanceReplicate);
    }
  }

  getInstanceAsInstance(name, instanceReplicate) {
    let instance = instanceReplicate.attribute;
    if (instanceReplicate.options.singleton) {
      this.instanceCache.set(name, instance);
    }
    return instance;
  }

  getInstanceAsClass(name, instanceReplicate) {
    this.instanceCache.set();
  }

  getInstanceAsFunction(name, instanceReplicate) {
    let instance = instanceReplicate.attribute();
    if (instanceReplicate.options.singleton) {
      this.instanceCache.set(name, instance);
    }
    return instance;
  }
}

Sactive.BIND_TYPE = {
  CLASS: 0,
  FUNCTION: 1,
  INSTANCE: 2
};

class InstanceWrapper {
  constructor(instance, opt) {
    let options = {
      singleton: true,
      type: Sactive.BIND_TYPE.INSTANCE
    };
    if (opt && _.isObject(opt)) {
      options = Object.assign(options, opt);
    }
    this.attribute = instance;
    this.options = options;
  }
}

module.exports = Sactive;