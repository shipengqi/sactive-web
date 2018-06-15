## Getting started

`sactive-web`使用很简便。
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
这是最简单的例子。定义路由参考[Route章节](https://github.com/sactive/sactive-web/wiki/Route)。

### 使用依赖注入

#### 将依赖注入路由

```javascript
const app = new SactiveWeb({baseUrl: '/api'});
//依赖必须先绑定才能注入
app.bindInstance('student', {name: 'xiaoming'});

app.route({
  name: 'hello',
  method: 'get',
  path: '/demo/dependency',
  handler: async function(ctx, next) {
    return ctx.body = `Hello, ${this.$$student.name}!!!`;
  },
  dependencies: ['$$student']
});

app.init();
app.listen();
```

上面的代码，绑定了`student`实例，然后在定义路由时，加上了`dependencies`，这是一个数组，里面填入要注入的实例的名字。
**注意，实例绑定后会自动添加前缀`$$`，使用时要加上`$$`例如上面的`dependencies: ['$$student']`。**
在`handler`中通过`this.$$student`来使用注入的依赖，如上面的例子，将路由与业务解耦合。

注入的实例，可以是`class`，`string`等多种类型，具体参考[Application章节](https://github.com/sactive/sactive-web/wiki/Application)。

> 还有一点，`handler`，不可以是箭头函数，否则会报错，这是因为使用箭头函数，无法改变`this`的指向，依赖不能绑定到`this`上。


#### class的依赖注入
`sactive-web`的依赖注入目前只支持`class`。

```javascript
class Class1 {
  test() {
    return 'test';
  }
}

class Class2 {
  constructor($$class1) {
    this.$$class1 = $$class1;
  }
  test() {
    return 'test';
  }
}


async function asyncFunc() {
  return 'test';
}

class Class3 {
  constructor($$class1, $$class2, $$async) {
    this.$$class1 = $$class1;
    this.$$class2 = $$class2;
    this.$$async = $$async;
  }
}

const app = new SactiveWeb();
app.bindClass('class1', class1);
app.bindClass('class1', Class2);
app.bindClass('Class3', Class3);
app.bindFunction('async', asyncFunc);
let class3 = app.getInstance('$$class3');
class3.$$class2.test() // => 'test'
class3.$$class2.$$class1.test() // => 'test'
class3.$$class1.test() // => 'test'
class3.$$async.then(function(res) {
    console.log(res) // => 'test'
});
```

上面的例子，`Class3` 注入了三个依赖 `$$class1`，`$$class2`，`$$async`，`Class2` 注入了依赖 `$$class1`。
接下来还可以把`$$class3`，注入路由，这样可以很大程度将将`web`路由与业务逻辑解耦。

### 参数的 validate 和 normalize

参数校验使用一样简单。

#### parameter
处理请求`url`中的参数。

```javascript
const app = new SactiveWeb();
app.route({
  name: 'hello',
  method: 'get',
  path: '/demo/validate/:id',
  handler: async function(ctx, next) {
    return ctx.body = `Hello.`;
  },
  paramNormalizations: {
    id: function(value) {
      return Number(value);
    }
  },
  paramValidations: {
    id: {
      required: false,
      handler: function(value) {
        if (typeof (value) === 'string') {
          return false;
        }
        return true;
      }
    }
  }
});
app.init();
```

`paramNormalizations`是一个`object`，对应`ctx.params`，也就是`url`中的参数,上面的代码，`paramNormalizations`有一个`key`是`id`对应`ctx,params.id`，
`function`用来处理`ctx,params.id`的值，上面将转为`ctx,params.id`的值`Number`。
`paramValidations`也是一个`object`，不一样的是它的每个`key`有一个`object`的值，包含了`required`和`handler`，`required`是个布尔值，表示这个值是否必需，
`handler`，是校验方法。上面校验`ctx,params.id`的值是否是一个`string`类型。

> `handler`方法要返回一个`true`或者`false`。

#### query
处理请求中的`query`:

- queryNormalizations：使用方法和`paramNormalizations`一样。
- queryValidations：使用方法和`paramValidations`一样。

#### data
处理`post`请求中的`formdata`:

- dataNormalizations：使用方法和`paramNormalizations`一样。
- dataValidations：使用方法和`paramValidations`一样。


### 使用中间件

`sactive-web`的路由是基于[koa-router](https://github.com/alexmingoia/koa-router)实现的。使用路由中间件：

```javascript
const app = new SactiveWeb();
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

app.init();
app.listen(8080);
```

上面的代码实现了文件上传，多了一个`middlewares`，这是一个数组，数组中的路由中间件会在`handler`处理之前执行。

### 响应
```javascript
let app = new SactiveWeb({enableTransform: true});
```
`enableTransform`设置为`true`时，会开启`responseTransform`，如果`responseTransform`为`null`，则会调用默认的`responseTransform`方法。
更多参考[Response章节](https://github.com/sactive/sactive-web/wiki/Response)

### 渲染页面
`sactive-web`集成了[`koa-views`](https://github.com/queckezz/koa-views)，支持`pug`模板引擎。
```javascript
let app = new SactiveWeb({
  enableTransform: true,
  view: {
    path: 'view path',
    options: {}
  }
});
```

- view: `Object`，模板引擎配置，基于`koa-views`。
  - path: `String`，`view`文件夹的路径，默认是空字符串。
  - options: `Object`，配置模板引擎选项，默认是`{}`。具体配置可参考`koa-views`[官方文档](https://github.com/queckezz/koa-views)

> `enableTransform`必须设置为`true`，开启默认`responseTransform`时，才可以渲染，否则，请传入自己的`responseTransform`。

### 文件下载

这里给一个文件下载的例子：
```javascript
const SactiveWeb = new SactiveWeb();
const send = require('koa-send');

let app = new SactiveWeb({enableTransform: true});

// headers: {Accept: 'application/x-download'}
let example = {
  name: 'download',
  method: 'get',
  path: '/download',
  handler: async function(ctx, next) {
    let f = await send(ctx, `./foobar.zip`);
    return f;
  }
};

app.route(example);

app.init();
app.listen(8080);
```

> 开启默认`responseTransform`时，请求下载文件，请求的`headers`中的`Accept`必须设置为'application/x-download'。