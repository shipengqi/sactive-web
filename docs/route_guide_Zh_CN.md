## Route 中文文档

### 定义route

```javascript

let example1 = {
  name: 'hello',
  method: 'get',
  path: '/api/hello',
  queryNormalizations: {
    id: function(value) {
      return Number(value);
    }
  },
  queryValidations: {
    id: {
      required: false,
      handler: function(value) {
        if (typeof (value) === 'string') {
          return false;
        }
        return true;
      }
    }
  },
  queryNormalizations: {},
  queryValidations: {},
  dataNormalizations: {},
  dataValidations: {},
  dependencies: ['$$student'],
  middlewares: [],
  template： null，
  config: {},
  handler: function(ctx, next) {
    return ctx.body = 'Hello SActive !!!';
  }
};

let app = new SactiveWeb();
//依赖必须先绑定才能注入
app.bindInstance('student', {name: 'xiaoming'});
app.route(example1);
```

#### name
路由的命名，是一个字符串。

#### method
路由方法，支持`get`，`post`，`delete`，`put`等常用方法，可以参考[koa-router](https://github.com/alexmingoia/koa-router)。

#### path
路由的path。

#### paramNormalizations, paramValidations
处理请求`url`中的参数。

`paramNormalizations`是一个`object`，对应`ctx.params`，也就是`url`中的参数,上面的代码，`paramNormalizations`有一个`key`是`id`对应`ctx,params.id`，
`function`用来处理`ctx,params.id`的值，上面将转为`ctx,params.id`的值`Number`。
`paramValidations`也是一个`object`，不一样的是它的每个`key`有一个`object`的值，包含了`required`和`handler`，`required`是个布尔值，表示这个值是否必需，
`handler`，是校验方法。上面校验`ctx,params.id`的值是否是一个`string`类型。

> `handler`方法要返回一个`true`或者`false`。

#### queryNormalizations, queryValidations
处理请求中的`query`:

- queryNormalizations：使用方法和`paramNormalizations`一样。
- queryValidations：使用方法和`paramValidations`一样。

#### dataNormalizations, dataValidations
处理`post`请求中的`formdata`:

- dataNormalizations：使用方法和`paramNormalizations`一样。
- dataValidations：使用方法和`paramValidations`一样。

#### dependencies

上面的代码，绑定了`student`实例，然后在定义路由时，加上了`dependencies`，这是一个数组，里面填入要注入的实例的名字。
**注意，实例绑定后会自动添加前缀`$$`，使用时要加上`$$`例如上面的`dependencies: ['$$student']`。**
在`handler`中通过`this.$$student`来使用注入的依赖，如上面的例子，将路由与业务解耦合。

注入的实例，可以是`class`，`string`等多种类型，具体参考[Application章节](https://github.com/sactive/sactive-web/wiki/Application)。

> 还有一点，`handler`，不可以是箭头函数，否则会报错，这是因为使用箭头函数，无法改变`this`的指向，依赖不能绑定到`this`上。

#### middlewares
`middlewares`，这是一个数组，数组中的路由中间件会在`handler`处理之前执行。

#### template
渲染页面时的模板。
参考[Response章节](https://github.com/sactive/sactive-web/wiki/Response)

#### config
支持所有 [Application](https://github.com/sactive/sactive-web/wiki/Application)的 `config`，
如果配置该选项，会覆盖 `Application` 的配置。

### 路由文件

路由文件可以返回一个数组：
```javascript
module.exports = [
  {
    name: 'demo1-route1',
    method: 'get',
    path: '/demo1/route1',
    handler: function(ctx, next) {
      ctx.body = 'Hello demo1-route1 !!!';
    }
  },
  {
    name: 'demo1-route2',
    method: 'get',
    path: '/demo1/route2',
    handler: function(ctx, next) {
      ctx.body = 'Hello demo1-route2 !!!';
    }
  }
];
```

路由文件可以返回一个函数，函数必须返回一个路由数组：
```javascript
module.exports = function() {
  // do something ...
  return [
    {
      name: 'demo2-route1',
      method: 'get',
      path: '/demo2/route1',
      handler: function(ctx, next) {
        ctx.body = 'Hello demo2-route1 !!!';
      }
    },
    {
      name: 'demo2-route2',
      method: 'get',
      path: '/demo2/route2',
      handler: function(ctx, next) {
        ctx.body = 'Hello demo2-route2 !!!';
      }
    }
  ];
};
```

### 使用原生的koa-router

以上传文件为例子，使用原生`koa-router`：
```javascript
const koaBody = require('koa-body');

let app = new SactiveWeb();

app.router.post('/upload', koaBody({
  multipart: true,
  formidable: {
    uploadDir: __dirname
  }
}), ctx => {
  const files = ctx.request.files;
  console.log(files);
  return ctx.body = 'success';
});
```

使用`sactive-web`路由：
```javascript
const koaBody = require('koa-body');

let example1 = {
  name: 'hello',
  method: 'post',
  path: '/upload',
  middlewares: [koaBody({
    multipart: true,
    formidable: {
      uploadDir: __dirname
    }
  })],
  handler: function(ctx, next) {
    const files = ctx.request.files;
    console.log(files);
    return ctx.body = 'success';
  }
};

let app = new SactiveWeb();
app.route(example1);
```

你还可以通过`app.router`继承了[koa-router的所有方法](https://github.com/alexmingoia/koa-router)。