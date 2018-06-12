const _ = require('lodash');
const fs = require('fs');
const {UnifiedError, NotFoundError} = require('./errors');

class ResponseProcessorFactory {
  constructor(processors) {
    this.processors = processors;
  }

  determine(ctx) {
    return _.find(this.processors, processor => {
      return processor.determine(ctx);
    });
  }
}

class JsonProcessor {
  processSuccess(ctx, response) {
    ctx.response.body = {
      code: 200,
      msg: 'success.',
      data: response
    };
  }

  processFail(ctx, e) {
    let result = null;
    if (!e) {
      e = new UnifiedError();
    }
    if (e instanceof Error) {
      result = {
        code: e.status,
        msg: e.message
      };
    }
    ctx.response.status = result.code;
    ctx.response.body = result;
  }

  determine(ctx) {
    let contentType = ctx.request.type;
    if (_.isEmpty(contentType)) {
      return false;
    }
    return contentType.includes('json');
  }
}

class HtmlProcessor {
  processSuccess(ctx, response, template) {
    if (!fs.existsSync(template)) {
      return this.processFail(ctx, new NotFoundError(`Template ${template} not existed`));
    }
    return ctx.render(template, response);
  }

  processFail(ctx, e) {
    let result = null;
    if (!e) {
      e = new UnifiedError();
    }
    if (e instanceof Error) {
      result = {
        code: e.status,
        msg: e.message
      };
    }
    ctx.response.status = 500;
    ctx.response.body = result;
  }

  determine(ctx) {
    return true;
  }
}
module.exports = {
  ResponseProcessorFactory,
  JsonProcessor,
  HtmlProcessor
};