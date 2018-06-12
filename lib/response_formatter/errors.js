class UnifiedError extends Error {
  constructor(message) {
    let msg = `Internal server error, reason: ${message}`;
    super(msg);
    this.status = 500;
    this.message = msg;
  }
}

class ValidateError extends UnifiedError {
  constructor(message) {
    let msg = `Validate failed, reason: ${message}`;
    super(msg);
    this.status = 400;
    this.message = msg;
  }
}

module.exports = {
  UnifiedError,
  ValidateError
};