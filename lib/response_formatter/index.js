const {
  UnifiedError,
  ValidateError
} = require('./errors');
const {
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor
} = require('./response');

const jsonprocesser = new JsonProcessor();
const htmlprocessor = new HtmlProcessor();
const responseprocessor = new ResponseProcessorFactory([jsonprocesser, htmlprocessor]);

const responseTransform = function(error, response, ctx, next) {
  let processer = responseprocessor.determine(ctx);
  if (error) {
    return processer.processFail(ctx, error);
  }
  return processer.processSuccess(ctx, response);
};

module.exports = {
  responseTransform,
  errors: {
    UnifiedError,
    ValidateError
  },
  private: {
    ResponseProcessorFactory,
    HtmlProcessor,
    JsonProcessor
  }
};