const Koa = require('koa');
class Response extends Koa.response {
  constructor() {
    super();
  }
}

console.log(new Response())