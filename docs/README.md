# Usage Guide

- [安装](#%E5%AE%89%E8%A3%85)
- [创建 APP](#%E5%88%9B%E5%BB%BA-app)
- [依赖注入](#%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5)
  - [其他方法](#%E5%85%B6%E4%BB%96%E6%96%B9%E6%B3%95)
  - [$ctx, $next](#%24ctx%2C%20%24next)
  - [支持依赖注入的方法](#%e6%94%af%e6%8c%81%e4%be%9d%e8%b5%96%e6%b3%a8%e5%85%a5%e7%9a%84%e6%96%b9%e6%b3%95)
  - [使用原生方法](#%e4%bd%bf%e7%94%a8%e5%8e%9f%e7%94%9f%e6%96%b9%e6%b3%95)
  - [与原生方法混合使用](#%E4%B8%8E%E5%8E%9F%E7%94%9F%E6%96%B9%E6%B3%95%E6%B7%B7%E5%90%88%E4%BD%BF%E7%94%A8)
- [应用级中间件](#%E5%BA%94%E7%94%A8%E7%BA%A7%E4%B8%AD%E9%97%B4%E4%BB%B6)
- [路由](#%E8%B7%AF%E7%94%B1)
  - [路由分组](#%E8%B7%AF%E7%94%B1%E5%88%86%E7%BB%84)
  - [路由组中间件](#%E8%B7%AF%E7%94%B1%E7%BB%84%E4%B8%AD%E9%97%B4%E4%BB%B6)
  - [Multiple middleware](#multiple-middleware)
  - [路由前缀](#%E8%B7%AF%E7%94%B1%E5%89%8D%E7%BC%80)
- [拦截器](#%E6%8B%A6%E6%88%AA%E5%99%A8)
- [allowedMethods](#allowedMethods) 
- [API Reference](./api.md)
- [参考](#%E5%8F%82%E8%80%83)
  
## 安装

使用 [npm](https://www.npmjs.org/) 安装:

```sh
npm install sactive-web
```

## 创建 APP
```javascript
const App = require('sactive-web');

const app = new App();

app.use(($ctx, $next) => {
  // do something
  $next();
});

app.get('/users/:name', ($ctx, $next) => {
  // do something
  ctx.body = 'Hi, ' + $ctx.params.name;
});

app.listen(8080);
```

## 依赖注入
`Application` 提供了三个绑定对象的方法：
- `bindClass(name, class, singleton)` - 绑定一个**类**。
- `bindFunction(name, func, singleton)` - 绑定一个**函数**。
- `bingAny(name, any, singleton)` - 绑定任意类型的值 String，Number，Object 等

`singleton` - (Boolean) 可选，默认为 `true`。表示是否以单例模式绑定。

**已绑定的对象，在注册中间件函数，和路由函数时，可以通过加上 `$` 前缀的方式，获取实例**。框架会自动初始化实例，并注入依赖。
获取未绑定的对象，会返回 `null`。

```javascript
const App = require('sactive-web');

const app = new App();
app.bindAny('address', 'shanghai');
app.bindFunction('getAddress', $address => {
  return $address;
});

class Person {
  constructor($address) {
    this.address = $address;
  }
  getAddress() {
    return this.address;
  }
}

app.bindClass('person', Person);

// 注册路由函数，`$person` 参数，会被初始化并注入
app.get('/users/:name', ($ctx, $next, $person) => {
  $ctx.response.body = {'name': $ctx.params.name, address: $person.getAddress()};
  // 请求 /users/Pooky
  // => { name: "Pooky", address: "shanghai" }
});
```

### 其他方法
- `getInstance` - 获取实例对象
- `getInstances` - 获取多个实例对象
- `deleteInstance` - 删除已绑定的对象
- `deleteInstances` - 删除多个已绑定的对象
- `reset` - 重置实例池

具体的使用方法，参考 [API Reference](./api.md)。

### $ctx, $next
`$ctx`, `$next` 是 koa 中间件函数的 `ctx` 和 `next` 的别名。
```javascript
app.use(($ctx, $next) => {
  // do something
  $next();
});

// 等同于 koa 中的
app.use((ctx, next) => {
  // do something
  $next();
});
```

不同的是 `sactive-web` 注册的中间件函数 `$ctx`, `$next` 和依赖可以以任意顺序注入：
```javascript
app.use(($person, $next, $ctx) => {
  // do something
  $next();
});
```

注意中间件函数不要忘了调用 `$next()`。

### 支持依赖注入的方法
- `app.use`
- `app.get|put|post|patch|delete|del|all` 等路由方法

> **注意，如果你的中间件或者路由处理函数不需要注入依赖，使用 `app.USE`**。

### 使用原生方法
- `app.USE` 是 koa 原生 `use` 方法的别名
- `app.GET|PUT|POST|PATCH|DELETE|DEL|ALL` 是 koa-router 路由方法的别名

> **别名都是原生方法的大写形式**。

```javascript
const App = require('sactive-web');
const koaBody = require('koa-body');

const app = new App();
// 使用原生的 USE 方法
app.USE(koaBody());

app.group('v1').post('/users/:name', ($ctx, $next, $name) => {
  $ctx.body = $ctx.request.body;
});

app.listen(8080);
```

### 与原生方法混合使用
```javascript
app.group('/v3/')
  .get('/users/:name', ($ctx, $name, $next) => {
    $ctx.body = {'name': $ctx.params.name, 'testname': $name};
  })
  .POST('/users/:name', (ctx, next) => {
    ctx.body = ctx.request.body;
   })
```

## 应用级中间件
`app.use` 重写了 [koa](https://koajs.com/) 的 `use` 方法。

## 路由
`sactive-web` 的路由功能基于 [koa-router](https://github.com/alexmingoia/koa-router) 实现。
### app.get|put|post|patch|delete|del|all
重写了 koa-router `Router` 类的所有路由方法。

```javascript
app
  .get('/', ($ctx, $next) => {
    ctx.body = 'Hello World!';
  })
  .post('/users', ($ctx, $next) => {
    // ...
  })
  .put('/users/:id', ($ctx, $next) => {
    // ...
  })
  .del('/users/:id', ($ctx, $next) => {
    // ...
  })
  .all('/users/:id', ($ctx, $next) => {
    // ...
  });
```

### 路由分组
`app.group` 创建路由分组， `group` 方法返回路由对象：
```javascript
const App = require('..');

const app = new App();

app.group('v1')
  .get('/users/:name', ($ctx, $next) => {
    // do something
  });
app.group('v2/')
  .get('/users/:name', ($name, $ctx, $next) => {
    // do something
  });
app.group('/v3/')
  .get('/users/:name', ($ctx, $name, $next) => {
    // do something
  });

app.listen(8080);
```

### 路由组中间件
```javascript
let groupV1 = app.group('v1')
  .get('/users/:name', ($ctx, $next) => {

  });

groupV1.use(($ctx, $next) => {
  // do something
});
```

使用 `RouterGroup.use` 方法注册路由级中间件。

### Multiple middleware

`Application` 和 `RouterGroup` 支持注册多个路由函数：
```javascript
app.get(
  '/users/:id',
  ($ctx, $next) => {
    return User.findOne(ctx.params.id).then(function(user) {
      ctx.user = user;
      next();
    });
  },
  ($ctx, $next) => {
    console.log(ctx.user);
    // => { id: 17, name: "Alex" }
  }
);
```

### 路由前缀

应用路由前缀：
```javascript
var app = new App({
  prefix: '/users'
});

app.get('/', ...); // responds to "/users"
app.get('/:id', ...); // responds to "/users/:id"
```

## 拦截器

`app.interceptors` 包含两个拦截器：
- `errors` - 拦截所有路由处理函数中抛出的异常。`app.interceptors.errors.use` 方法注册异常拦截器，拦截器函数接受两个参数 `error` 
和 `ctx`，分别是捕获到的异常，和请求上下文对象。
- `response` - 拦截响应。`app.interceptors.response.use` 方法注册响应拦截器，拦截器函数接受一个参数 `ctx` ，请求上下文对象。



```javascript
app.get(
  '/users/:id',
  ($ctx, $next) => {
    return User.findOne(ctx.params.id).then(function(user) {
      ctx.user = user;
      // throw new Error('internal error');
      // 请求的响应： {code: 500, {}, msg: "internal error"}
      next();
    });
  },
  ($ctx, $next) => {
    console.log(ctx.user);
    // => { id: 17, name: "Alex" }
    $ctx.body = { id: 17, name: "Alex" };
    // 请求的响应： {code: 200, { id: 17, name: "Alex" }, msg: "ok"}
  }
);

app.interceptors.errors.use((err, ctx) => {
  ctx.body = {
    code: 500,
    data: {},
    msg: err.message
  };
});

app.interceptors.response.use(ctx => {
  let data = ctx.body;
  ctx.body = {
    code: 200,
    data: data,
    msg: 'ok'
  };
});
```

## allowedMethods

使用 `app.USE` 注册 koa-router 的 `allowedMethods` 中间件
```javascript
app.USE(app.router.allowedMethods());
```

`app.USE` 是 koa 原生 `use` 方法的别名，之所以必须使用 `app.USE` 方法，是因为 `allowedMethods` 的两个参数是 `ctx` 和 `next`，
如果使用 `app.use`，会尝试解析参数，并注入依赖，而 `ctx` 和 `next`，没有 `$` 前缀，所以注入的是 `null`。

> **如果你的中间件不需要注入依赖，使用 `app.USE`**。

## 参考
更多关于 koa 和 koa-router 的使用可以参考官方文档：

- [koa](https://koajs.com/)
- [koa-router](https://github.com/alexmingoia/koa-router)