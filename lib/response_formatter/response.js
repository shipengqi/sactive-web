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
    ctx.body = {
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
    ctx.body = result;
  }

  determine(ctx) {
    let contentType = ctx.request.type;
    if (_.isEmpty(contentType)) {
      return false;
    }
    return ctx.accepts('json') && ctx.is(contentType).includes('json');
  }
}

class HtmlProcessor {
  processSuccess(ctx, response, template) {
    if (!fs.existsSync(template)) {
      return this.processFail(new NotFoundError(`Template ${template} not existed`));
    }
    ctx.render('template', response);
  }

  processFail(ctx, response) {
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
    return ctx.accepts('html');
  }
}
module.exports = {
  ResponseProcessorFactory,
  JsonProcessor,
  HtmlProcessor
};