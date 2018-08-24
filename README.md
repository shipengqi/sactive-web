<h1 align="center">
  SActive Web
</h1>

<h4 align="center">
  :rocket: A dependency injection web framework for Node.js.
</h4>

<p align="center">
  <a href="https://www.travis-ci.org/shipengqi/sactive-web">
    <img alt="Build Status" src="https://img.shields.io/travis/shipengqi/sactive-web/master.svg?style=flat-square">
  </a>
  <a href="https://codecov.io/gh/shipengqi/sactive-web">
    <img alt="Build Status" src="https://img.shields.io/codecov/c/github/shipengqi/sactive-web.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/sactive-web">
    <img alt="NPM version" src="https://img.shields.io/npm/v/sactive-web.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/sactive-web">
    <img alt="NPM Download" src="https://img.shields.io/npm/dw/sactive-web.svg?style=flat-square">
  </a>
  <a href="https://github.com/shipengqi/sactive-web/blob/master/LICENSE">
    <img alt="License" src="http://img.shields.io/npm/l/sactive-web.svg?style=flat-square">
  </a>
</p>



## Installation
```bash
npm install sactive-web
```

## Features

- Dependency injection.
- Routing, based on [koa-router](https://github.com/alexmingoia/koa-router).
- Support async Function, common function.
- Parameter validate and normalize.
- Query validate and normalize.
- FormData validate and normalize.
- Response transform.
- Support pug template engine, based on [koa-views](https://github.com/queckezz/koa-views).
- Based on [Koa](https://github.com/koajs/koa).

> async Function require node 7.6+.

## Example

```javascript
const SactiveWeb = require('sactive-web');

let demo = {
  name: 'hello',
  method: 'get',
  path: '/demo/hello',
  handler: function(ctx, next) {
    ctx.body = 'Hello SActive !!!';
  }
};

let app = new SactiveWeb();
app.route(demo);

app.init();
app.listen(8080);
```

## Documentation
- [Getting started 中文文档](https://github.com/shipengqi/sactive-web/wiki/Getting-started)
- [Application doc 中文文档](https://github.com/shipengqi/sactive-web/wiki/Application)
- [Route doc 中文文档](https://github.com/shipengqi/sactive-web/wiki/Route)
- [Response doc 中文文档](https://github.com/shipengqi/sactive-web/wiki/Response)
- [API](https://github.com/shipengqi/sactive-web/wiki/API)

> My English is poor, so my documents are all Chinese.

## Babel setup
If you're not using node `v7.6+`, you can use `babel`:

```javascript
//entry file
require('babel-register');
const app = require('./app');
```

Add the following to `.babelrc`:
```javascript
{
  "presets": [
    ["env", {
      "targets": {
        "node": true
      }
    }]
  ]
}
```


## Examples
```bash
git clone git@github.com:shipengqi/sactive-web.git
cd ./sactive-web
npm install
cd ./example
```

## Tests
Install the dependencies, then run `npm test`:
``` bash
npm install
npm test

#coverage
npm run test:cov
```

## TODO
- Engilsh Documentation
