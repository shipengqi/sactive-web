const debug = require('debug')('sactive:web:debug');
const error = require('debug')('sactive:web:error');
const warn = require('debug')('sactive:web:warn');

class Logger {
  debug(...args) {
    debug(...args);
  }

  warn(...args) {
    warn(...args);
  }

  error(...args) {
    error(...args);
  }
}

module.exports = Logger;