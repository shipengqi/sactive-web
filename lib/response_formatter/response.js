const _ = require('lodash');
const {UnifiedError} = require('./error');

class responseProcessorFactory {
  constructor(processors) {
    this.processors = processors;
  }

  determine(ctx) {
    ctx.accepts('text/html');
    return _.find(this.processors, processor => {
      return processor.determine(ctx);
    });
  }
}

class JsonProcessor {
  processSuccess(response, ctx) {
    ctx.body = {
      code: 200,
      msg: 'success.',
      data: response
    };
  }

  processFail(response, ctx) {
    let result = null;
    if (!response) {
      response = new UnifiedError();
    }
    if (response instanceof Error) {
      result = {
        code: response.status,
        msg: response.message
      };
    }
    ctx.body = result;
  }

  determine(ctx) {
    let contentType = ctx.request.type;
    if (_.isEmpty(contentType)) {
      return false;
    }
    return ctx.is(contentType).includes('json');
  }
}

class HtmlProcessor {
  processSuccess(response, ctx) {
    ctx.body = response;
  }

  processFail(response, ctx) {
    let result = null;
    if (!response) {
      response = new UnifiedError();
    }
    if (response instanceof Error) {
      result = {
        code: response.status,
        msg: response.message
      };
    }
    ctx.response.status = 500;
    ctx.body = result;
  }

  determine(ctx) {
    return true;
  }
}
module.exports = {
  responseProcessorFactory,
  JsonProcessor,
  HtmlProcessor
};