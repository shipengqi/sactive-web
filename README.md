# sactive-web

A dependency injection web framework for Node.js.

[![Build status][travis-image]][travis-url]
[![Coverage][cov-image]][cov-url]
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]

[![NPM](https://nodei.co/npm/sactive-web.png?downloads=true)](https://nodei.co/npm/sactive-web/)

## Installation
```bash
npm install sactive-web
```

## Features

- Dependency injection
- Routing
- Support async Function, common function
- Base on [Koa](https://github.com/koajs/koa)

> async Function require node 7.6+.

## Getting started

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
- Guide, todo
- [API](https://github.com/sactive/sactive-web/wiki/API)

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
git clone git@github.com:sactive/sactive-web.git
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
[npm-image]: https://img.shields.io/npm/v/sactive-web.svg
[npm-url]: https://www.npmjs.com/package/sactive-web
[travis-image]: https://travis-ci.org/sactive/sactive-web.svg?branch=master
[travis-url]: https://www.travis-ci.org/sactive/sactive-web
[cov-image]: https://codecov.io/gh/sactive/sactive-web/branch/master/graph/badge.svg
[cov-url]: https://codecov.io/gh/sactive/sactive-web
[license-image]: http://img.shields.io/npm/l/sactive-web.svg
[license-url]: ./LICENSE