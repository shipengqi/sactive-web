const debug = require('debug')('active:di');
const extend = require('extend');
const getParameterNames = require('@captemulation/get-parameter-names');

const BIND_TYPE = {
  CLASS: 0,
  FUNCTION: 1,
  ANY: 2
};

const INJECTOR_PREFIX = '$';
const INJECTOR_NAME = 'injector';

module.exports = class Di {
  constructor() {
    this.pool = new Map();
    this.cache = new Map();
    this.bindClass(INJECTOR_NAME, this);
  }

  parse(fn) {
    return getParameterNames(fn);
  }

  bind(name, any, opt) {
    if (typeof name !== 'string') {
      throw new Error('instance name must be a string.');
    }
    if (!any) {
      throw new Error('instance cannot be null.');
    }
    let instanceName = INJECTOR_PREFIX + name;
    if (this.pool.has(instanceName)) {
      throw new Error(`instance: ${name} has already bound.`);
    }
    this.pool.set(instanceName, {
      attribute: any,
      options: opt
    });
  }

  bindAny(name, any, singleton = true) {
    debug(`bind any: ${name}, singleton: ${singleton}`);
    return this.bind(name, any, {
      type: BIND_TYPE.ANY,
      singleton: singleton
    });
  }

  bindClass(name, any, singleton = true) {
    debug(`bind class: ${name}, singleton: ${singleton}`);
    return this.bind(name, any, {
      type: BIND_TYPE.CLASS,
      singleton: singleton
    });
  }

  bindFunction(name, any, singleton = true) {
    debug(`bind function: ${name}, singleton: ${singleton}`);
    if (typeof any !== 'function') throw new TypeError('instance must be a function!');
    return this.bind(name, any, {
      type: BIND_TYPE.FUNCTION,
      singleton: singleton
    });
  }

  getInstances(names) {
    if (!Array.isArray(names)) {
      throw new Error('instance names must be an array.');
    }
    let instances = [];
    for (let i = 0; i < names.length; i ++) {
      instances.push(this.getInstance(names[i]));
    }
    return instances;
  }

  getInstancesMap(names) {
    if (!Array.isArray(names)) {
      throw new Error('instance names must be an array.');
    }
    let instances = {};
    for (let i = 0; i < names.length; i ++) {
      instances[names[i]] = this.getInstance(names[i]);
    }
    return instances;
  }

  getInstance(name) {
    debug(`get instance: ${name}`);
    if (this.cache.has(name)) {
      return this.cache.get(name);
    }
    if (!this.pool.has(name)) {
      return null;
    }
    let instance = null;
    let copy = extend(true, {}, this.pool.get(name));
    if (copy.options.type === BIND_TYPE.FUNCTION) {
      instance = this.getInstanceAsFunction(copy);
    } else if (copy.options.type === BIND_TYPE.CLASS) {
      instance = this.getInstanceAsClass(copy);
    } else {
      instance = this.getInstanceAsAny(copy);
    }
    if (copy.options.singleton === true) {
      this.cache.set(name, instance);
    }
    return instance;
  }

  getInstanceAsAny(any) {
    return any.attribute;
  }

  getInstanceAsClass(any) {
    let all = this.parse(any.attribute);
    let matched = this.match(all);
    return new any.attribute(...matched);
  }

  getInstanceAsFunction(any) {
    let all = this.parse(any.attribute);
    let matched = this.match(all);
    return any.attribute.apply(null, matched);
  }

  deleteInstance(name) {
    if (typeof name !== 'string') {
      throw new Error('instance name must be a string.');
    }
    if (name === '') {
      return;
    }
    this.cache.delete(name);
    this.pool.delete(name);
  }

  deleteInstances(names) {
    if (!Array.isArray(names)) {
      throw new Error('instance names must be an array.');
    }
    for (let i = 0; i < names.length; i ++) {
      this.deleteInstance(names[i]);
    }
  }

  reset() {
    debug('reset pool');
    this.pool = new Map();
    this.cache = new Map();
  }

  match(all) {
    let matched = [];
    for (let i = 0; i < all.length; i ++) {
      if (all[i] && all[i].startsWith(INJECTOR_PREFIX)) {
        matched.push(this.getInstance(all[i]));
      } else {
        matched.push(null);
      }
    }
    return matched;
  }
};
