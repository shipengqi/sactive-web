const _ = require('lodash');
const extend = require('extend');
const InstanceWrapper = require('./instance_wrapper');
const {getArgumentNames} = require('./utils');
const {
  INSTANCE_BIND_TYPE,
  INSTANCE_NAME_PREFIX,
  INSTANCE_INJECTOR_NAME
} = require('./constants');

class Sactive {
  constructor(config = {}) {
    this.instancePool = new Map();
    this.instanceCache = new Map();
    this.instancePool.set(INSTANCE_NAME_PREFIX + INSTANCE_INJECTOR_NAME, new InstanceWrapper(this));
    this.instancePool.set(INSTANCE_NAME_PREFIX + INSTANCE_INJECTOR_NAME, this);
  }

  bind(name, any, opt) {
    if (!_.isString(name)) {
      throw new Error('Instance name must be a string.');
    }
    if (!any) {
      throw new Error('Instance name cannot be null.');
    }
    let instanceName = INSTANCE_NAME_PREFIX + name;
    if (this.instancePool.has(instanceName)) {
      throw new Error(`Instance name: ${name} has been bound.`);
    }
    let wrapper = new InstanceWrapper(any, opt);
    this.instancePool.set(instanceName, wrapper);
    return wrapper;
  }

  bindInstance(name, any, opt = {}) {
    if (_.isObject(opt)) {
      opt.type = INSTANCE_BIND_TYPE.INSTANCE;
    }
    return this.bind(name, any, opt);
  }

  bindClass(name, any, opt = {}) {
    if (_.isObject(opt)) {
      opt.type = INSTANCE_BIND_TYPE.CLASS;
    }
    return this.bind(name, any, opt);
  }

  bindFunction(name, any, opt = {}) {
    if (_.isObject(opt)) {
      opt.type = INSTANCE_BIND_TYPE.FUNCTION;
    }
    return this.bind(name, any, opt);
  }

  getInstances(names) {
    if (!_.isArray(names)) {
      throw new Error('Instance names must be an array.');
    }
    let instances = [];
    _.each(names, name => {
      instances.push(this.getInstance(name));
    });
    return instances;
  }

  getInstance(name) {
    let instanceName = name;
    // auto binding
    // this.autoBinding(instanceName, name);
    let instance = null;
    if (!this.instancePool.has(instanceName) && !this.instanceCache.has(instanceName)) {
      return null;
    }
    if (this.instanceCache.has(instanceName)) {
      return this.instanceCache.get(instanceName);
    }
    let instanceReplicate = extend(true, {}, this.instancePool.get(instanceName));
    if (instanceReplicate.options.type === INSTANCE_BIND_TYPE.FUNCTION) {
      instance = this.getInstanceAsFunction(instanceName, instanceReplicate);
    } else if (instanceReplicate.options.type === INSTANCE_BIND_TYPE.CLASS) {
      instance = this.getInstanceAsClass(instanceName, instanceReplicate);
    } else {
      instance = this.getInstanceAsInstance(instanceName, instanceReplicate);
    }
    return instance;
  }

  getInstanceAsInstance(name, instanceReplicate) {
    let instance = instanceReplicate.attribute;
    if (instanceReplicate.options.singleton) {
      this.instanceCache.set(name, instance);
    }
    return instance;
  }

  getInstanceAsClass(name, instanceReplicate) {
    let argNames = getArgumentNames(instanceReplicate.attribute);
    let parameters = [];
    _.each(argNames, argName => {
      if (argName && argName.startsWith(INSTANCE_NAME_PREFIX)) {
        parameters.push(this.getInstance(argName));
      } else {
        parameters.push(null);
      }
    });
    let instance = new instanceReplicate.attribute(...parameters);
    if (instanceReplicate.options.singleton) {
      this.instanceCache.set(name, instance);
    }
    return instance;
  }

  getInstanceAsFunction(name, instanceReplicate) {
    let instance = instanceReplicate.attribute();
    if (instanceReplicate.options.singleton) {
      this.instanceCache.set(name, instance);
    }
    return instance;
  }

  deleteInstance(name) {
    if (!_.isString(name)) {
      throw new Error('Instance name must be a string.');
    }
    let instanceName = INSTANCE_NAME_PREFIX + name;
    this.instanceCache.delete(instanceName);
    this.instancePool.delete(instanceName);
  }

  deleteInstances(names) {
    if (!_.isArray(names)) {
      throw new Error('Instance names must be an array.');
    }
    _.each(names, name => {
      if (!_.isEmpty(name)) {
        this.deleteInstance(name);
      }
    });
  }

  autoBinding(instanceName, name) {
    if (_.isFunction(instanceName)) {
      instanceName = name.name;
      this.bindClass(instanceName, name, {
        singleton: (_.isBoolean(instanceName.singleton) && instanceName.singleton === true)
      });
    }
  }
}

module.exports = Sactive;