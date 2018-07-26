const {
  UnifiedError,
  ValidateError,
  NotFoundError
} = require('./errors');
const {
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor,
  FileProcessor,
  Processor
} = require('./response');

const responseTransform = function(error, response = '', ctx, next, template) {
  let processer = this.getInstance('$$responseProcessor').determine(ctx, template);
  if (error) {
    return processer.processFail(ctx, error);
  }
  return processer.processSuccess(ctx, response, template);
};

module.exports = {
  responseTransform,
  errors: {
    UnifiedError,
    ValidateError,
    NotFoundError
  },
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor,
  FileProcessor,
  BaseProcessor: Processor
};