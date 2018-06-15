const {ERROR_CODE} = require('./constants');

class UnifiedError extends Error {
  constructor(message) {
    let msg = `Internal server error, reason: ${message}`;
    super(msg);
    this.status = ERROR_CODE.UNIFIED;
    this.message = msg;
  }
}

class ValidateError extends UnifiedError {
  constructor(message) {
    let msg = `Validate failed, reason: ${message}`;
    super(msg);
    this.status = ERROR_CODE.VALIFATE_FAIL;
    this.message = msg;
  }
}

class NotFoundError extends UnifiedError {
  constructor(message) {
    let msg = `Not Found: ${message}`;
    super(msg);
    this.status = ERROR_CODE.NOT_FOUNF;
    this.message = msg;
  }
}

module.exports = {
  UnifiedError,
  ValidateError,
  NotFoundError
};