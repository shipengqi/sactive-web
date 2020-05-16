module.exports = class Interceptor {
  /**
   * Initialize a new `Interceptor`.
   *
   * @class
   * @public
   */
  constructor() {
    this.fn = null;
    this.enabled = false;
  }

  /**
   * Register a interceptor.
   *
   * @public
   */
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('interceptor must be a function!');
    this.enabled = true;
    this.fn = fn;
  }

  /**
   * Execute a interceptor.
   *
   * @private
   */
  do(...arg) {
    this.fn(...arg);
  }
};