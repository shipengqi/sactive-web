const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const {UnifiedError, NotFoundError} = require('./errors');

class ResponseProcessorFactory {
  constructor($$htmlProcessor, $$jsonProcessor) {
    this.processors = [$$jsonProcessor, $$htmlProcessor];
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
  constructor($$config) {
    this.$$config = $$config;
  }

  processSuccess(ctx, response, template) {
    if (!this.$$config.view || this.$$config.view.path === '') {
      return this.processFail(ctx, new NotFoundError(`Template ${template} not existed`));
    }
    if (!fs.existsSync(path.join(this.$$config.view.path, template))) {
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