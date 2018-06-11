const errors = require('./error');
const {
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor
} = require('./response');

module.exports = {
  errors,
  ResponseProcessorFactory,
  HtmlProcessor,
  JsonProcessor
};