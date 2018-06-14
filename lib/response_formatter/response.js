const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const {UnifiedError, NotFoundError} = require('./errors');

class ResponseProcessorFactory {
  constructor($$htmlProcessor, $$jsonProcessor, $$fileProcessor, $$baseProcessor) {
    this.processors = [
      $$jsonProcessor,
      $$htmlProcessor,
      $$fileProcessor,
      $$baseProcessor
    ];
  }

  determine(ctx) {
    return _.find(this.processors, processor => {
      return processor.determine(ctx);
    });
  }
}

class Processor {
  processSuccess(ctx, response) {
    ctx.response.body = response;
  }

  processFail(ctx, e) {
    let result = null;
    if (!e) {
      e = new UnifiedError();
    }
    if (e instanceof Error) {
      result = {
        code: e.status || 500,
        msg: e.message
      };
    }
    ctx.response.body = result;
  }

  determine(ctx) {
    return true;
  }
}

class JsonProcessor extends Processor {
  processSuccess(ctx, response) {
    ctx.response.body = {
      code: 200,
      msg: 'success.',
      data: response
    };
  }

  determine(ctx) {
    return ctx.request.type.includes('json');
  }
}

class FileProcessor extends Processor {
  processSuccess(ctx, response) {
    let fstat = fs.statSync(response);
    if (!fstat.isFile()) {
      return this.processFail(ctx, new UnifiedError(`${response} not existed.`));
    }
    ctx.response.type = path.extname(response);
    ctx.response.body = fs.createReadStream(response);
  }

  determine(ctx) {
    return ctx.accepts('gzip', 'identity', 'zip', 'br');
  }
}

class HtmlProcessor extends Processor {
  constructor($$config) {
    super();
    this.$$config = $$config;
  }

  processSuccess(ctx, response, template) {
    if (!this.$$config.view || this.$$config.view.path === '') {
      return this.processFail(ctx, new UnifiedError(`Render failed, config view option first.`));
    }
    if (!fs.existsSync(path.join(this.$$config.view.path, template))) {
      return this.processFail(ctx, new NotFoundError(`Template ${template} not existed`));
    }
    return ctx.render(template, response);
  }

  determine(ctx) {
    return ctx.accepts('html');
  }
}
module.exports = {
  ResponseProcessorFactory,
  JsonProcessor,
  HtmlProcessor,
  FileProcessor,
  Processor
};