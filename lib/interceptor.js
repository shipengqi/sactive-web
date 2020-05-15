module.exports = class Interceptor {
  constructor() {
    this.fn = null;
    this.enabled = false;
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('interceptor must be a function!');
    this.enabled = true;
    this.fn = fn;
  }

  do(...arg) {
    this.fn(...arg);
  }
};