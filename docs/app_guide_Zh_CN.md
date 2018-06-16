## Application 中文文档

`Application`继承了`koa2`的[application](https://koa.bootcss.com/#application)的所有方法。

### 创建实例
```javascript
const SactiveWeb = require('sactive-web');
let config = {
  baseUrl: '/api',
  logLevel: 'error',
};
let app = new SactiveWeb(config);
```

#### 配置 config

- baseUrl: `String`，`baseURL` 将自动加在`route path`前面，默认是`null`。
- logLevel: `String`，日志输出的级别，默认是`info`。
- view: `Object`，模板引擎配置，基于`koa-views`。
  - path: `String`，`view`文件夹的路径，默认是空字符串。
  - options: `Object`，配置模板引擎选项，默认是`{}`。具体配置可参考`koa-views`[官方文档](https://github.com/queckezz/koa-views)
- responseTransform：`Function`，处理`response`的函数，在`route.handler()`执行后调用。可用来统一处理和封装响应结果。默认是`null`。
**注意，要配合`enableTransform`一起使用，只有`enableTransform`为`true`时，才会启用`responseTransform`方法。**
- enableTransform：`Boolean`，默认是`false`。配合`enableTransform`一起使用，`enableTransform`为`true`，启用`responseTransform`方法。
如果`responseTransform`为`null`，则会调用默认的`responseTransform`方法。

关于默认的`responseTransform`方法，参考[Response章节](https://github.com/sactive/sactive-web/wiki/Response)

### 实例属性
```javascript
const SactiveWeb = require('sactive-web');
let config = {
  baseUrl: '/api',
  logLevel: 'error'
};
let app = new SactiveWeb(config);

console.log(app.options) // => {baseUrl: '/api', logLevel: 'error'}
```


- app.options：即实例的所有配置。
- app.binder：用于内部的依赖注入。
- app.logger：log模块，基于[log](https://www.npmjs.com/package/log)。
- app.router: 路由，基于[koa-router](https://github.com/alexmingoia/koa-router)。

### 实例方法

#### app.route

注册单个路由方法。

```javascript
let example1 = {
  name: 'hello',
  method: 'get',
  path: '/api/hello',
  handler: function(ctx, next) {
    return ctx.body = 'Hello SActive !!!';
  }
};

let app = new SactiveWeb();
app.route(example1);
```
定义路由，参考[Route章节](https://github.com/sactive/sactive-web/wiki/Route)

#### app.loadFile

注册路由文件。

```javascript
app.loadFile(`${__dirname}/routes/router1.js`);
```
路由，参考[Route章节](https://github.com/sactive/sactive-web/wiki/Route)

#### app.load

注册指定文件加下的所有路由文件。

```javascript
app.load(`${__dirname}/routes`);
```

#### app.init

初始化实例，在注册路由之后调用。

```javascript
let app = new SactiveWeb();
app.load(`${__dirname}/routes`);
app.init();
app.listen(9000);
```

#### app.bindClass

绑定类，类在调用该方法之后，可以使用`getInstance`获取到实例，用于依赖注入，继承于`app.binder`属性。

```javascript
app.bindClass(name, class, options);
```
- name：`String`，给绑定的类命名，使用`getInstance`获取实例时会用到。
- class：`Class`，要绑定的类。
- options：`Object`，选项：
  - singleton: `Boolean`，是否是单例，默认是`true`。

**注意，绑定的`name`会自动加上`$$`符号，获取时要加上`$$`。**

```javascript
class Logger {
  test() {
    return 'test';
  }
}

app.bindClass('logger', Logger);
let logger = app.getInstance('$$logger') //注意加上`$$`
logger.test() // => 'test'
```

#### app.bindFunction

绑定方法，可以使用`getInstance`获取到实例，用于依赖注入，继承于`app.binder`属性。
**这里获取到的实例并不是`function`本身，而是它的执行结果，如果只是绑定`function`，不需要执行它，使用`app.bindInstance`。**

```javascript
app.bindFunction(name, func, options);
```
- name：`String`，给绑定的方法命名，使用`getInstance`获取实例时会用到。
- func：`Function`，要绑定的方法。
- options：`Object`，选项：
  - singleton: `Boolean`，是否是单例，默认是`true`。

**注意，绑定的`name`会自动加上`$$`符号，获取时要加上`$$`。**

```javascript
async function asyncFunc() {
  return 'test';
}

function func() {
  return 'test';
}

const arrowFunc = () => {
  return 'test';
};

app.bindFunction('func', func);
app.bindFunction('async', asyncFunc);
app.bindFunction('arrow', arrowFunc);

app.getInstance('$$func') // => 'test'
app.getInstance('$$async') // => 'test'
app.getInstance('$$arrow') // => 'test'
```

#### app.bindInstance

绑定实例，可以使用`getInstance`获取实例，用于依赖注入，继承于`app.binder`属性。

```javascript
app.bindInstance(name, instance, options);
```
- name：`String`，给绑定的实例命名，使用`getInstance`获取实例时会用到。
- instance：`any`，要绑定的实例，实例可以是任意类型，`string`，`object`，`function`，`class`等。
- options：`Object`，选项：
  - singleton: `Boolean`，是否是单例，默认是`true`。

**注意，绑定的`name`会自动加上`$$`符号，获取时要加上`$$`。**

```javascript
function func() {
  return 'test';
}

class Logger {
  test() {
    return 'test';
  }
}

let student = {
  name: 'xiaoming'
};

let name = 'xiaoqiang';

app.bindInstance('func', func);
app.bindInstance('logger', Logger);
app.bindInstance('student', student);
app.bindInstance('name', name);

app.getInstance('$$student'); // => {name: 'xiaoming'}
app.getInstance('$$name'); // => 'xiaoming'
app.getInstance('$$func')(); // => 'test'
let logger = new app.getInstance('$$Logger')();
logger.test(); // => 'test'
```

#### app.getInstance

获取实例，用于依赖注入，继承于`app.binder`属性。
**注意，绑定的`name`会自动加上`$$`符号，获取时要加上`$$`。**

```javascript
app.getInstance(name);
```

- name：`String`，实例名，加上`$$`。

#### app.getInstances

获取多个实例，用于依赖注入，继承于`app.binder`属性。
**注意，绑定的`name`会自动加上`$$`符号，获取时要加上`$$`。**

```javascript
app.getInstances(names);
```
- names：`Array`，一组实例名，加上`$$`，例如：`app.getInstances(['$$logger', '$$test'])`。

#### app.deleteInstance

删除已经绑定的实例，继承于`app.binder`属性。
**注意，绑定的`name`会自动加上`$$`符号，获取时要加上`$$`。**

```javascript
app.deleteInstance(name);
```

- name：`String`，实例名，加上`$$`。

#### app.deleteInstances

删除已经绑定的多个实例，继承于`app.binder`属性。
**注意，绑定的`name`会自动加上`$$`符号，获取时要加上`$$`。**

```javascript
app.deleteInstances(names);
```
- names：`Array`，一组实例名，加上`$$`，例如：`app.deleteInstances(['$$logger', '$$test'])`。
