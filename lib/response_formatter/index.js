const {
  UnifiedError,
  ValidateError
} = require('./errors');
const {
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor
} = require('./response');

const responseTransform = function(error, response, ctx, next, template) {
  let processer = this.getInstance('$$responseProcessor').determine(ctx);
  if (error) {
    return processer.processFail(ctx, error);
  }
  return processer.processSuccess(ctx, response, template);
};

module.exports = {
  responseTransform,
  errors: {
    UnifiedError,
    ValidateError
  },
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor
};