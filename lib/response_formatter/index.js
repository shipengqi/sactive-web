const errors = require('./error');
const {
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor
} = require('./response');

const responseTransform = function(response, ctx, next) {
  next();
};

const errorTransform = function(response, ctx, next) {
  next();
};

module.exports = {
  errors,
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor,
  responseTransform,
  errorTransform
};