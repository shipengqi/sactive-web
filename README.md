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

> **Note that 3.x.x is not compatible with 2.x.x and below** !!!

## Features

- Dependency injection.
- Router, based on [koa-router](https://github.com/alexmingoia/koa-router).
- Router group.
- Interceptors.
- Based on [Koa](https://github.com/koajs/koa).

## Example

```javascript
const App = require('..');

const app = new App();
app.bindAny('name', 'pooky');

app.use(($ctx, $name, $next) => {
  $ctx.testname1 = $name;
  $next();
});

app.group('v1')
  .get('/users/:name', ($ctx, $next, $name) => {
    $ctx.body = {'name': $ctx.params.name, 'testname1': $ctx.testname1, 'testname2': $name};
  });
app.group('v2/')
  .get('/users/:name', ($name, $ctx, $next) => {
    $ctx.response.body = {'name': $ctx.params.name, 'testname1': $ctx.testname1, 'testname2': $name};
  });
app.group('/v3/')
  .get('/users/:name', ($ctx, $name, $next) => {
    $ctx.body = {'name': $ctx.params.name, 'testname1': $ctx.testname1, 'testname2': $name};
  });

app.listen(8080);
```

## API Reference

[API Reference](https://www.shipengqi.top/sactive-web) .

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

## Debugging
sactive-web along with many of the libraries it's built with support the __DEBUG__ environment variable from [debug](https://github.com/visionmedia/debug) which provides simple conditional logging.

For example
to see all sactive-web debugging information just pass `DEBUG=active:*` and upon boot you'll see the list of middleware used, among other things.
```bash
  active:di bind class: injector, singleton: true +0ms
  active:di bind any: age, singleton: true +1ms
  active:application use - +0ms
  active:application use - +0ms
  active:application register get /users/:name +1ms
  active:application register get /users/ +0ms
  active:application use - +0ms
  active:di bind any: address, singleton: true +3ms
  active:di bind function: getAddress, singleton: true +1ms
  active:application listen +1ms
```

## Tests
Install the dependencies, then run `npm test`:
``` bash
npm install
npm test

# coverage
npm run test:cov
```

## TODO
- Documentations
- Benchmark test