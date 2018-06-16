## Response 中文文档

### 响应
```javascript
let app = new SactiveWeb({enableTransform: true});
```
`enableTransform`设置为`true`时，会开启`responseTransform`，如果`responseTransform`为`null`，则会调用默认的`responseTransform`方法。

#### json
```javascript
const app = new SactiveWeb(enableTransform: true});
app.route({
  name: 'demo-hello',
  method: 'get',
  path: '/demo/hello',
  handler: function(ctx, next) {
    return {'name': 'xiaoming'};
  }
});

app.init();
```
使用默认的`responseTransform`方法，可以直接在`handler`中返回`data`，`responseTransform`方法会自己封装响应。

##### 响应结构
```javascript
{
  code: 200,
  data: data,
  msg: 'success.'
}
```
- code：响应成功的状态
- data：响应数据，上面的例子中，`data` 就是 `{'name': 'xiaoming'}`。
- msg: 响应信息。

如果不喜欢这种响应结构可自行提供`responseTransform`方法。

#### render
```javascript
const app = new SactiveWeb({view: {path: `${__dirname}/template`}, enableTransform: true});
app.route({
  name: 'demo-render',
  method: 'get',
  path: '/demo/render',
  template: `test.pug`,
  handler: function(ctx, next) {
    return {'name': 'xiaoming'};
  }
});

app.init();
```

使用默认的`responseTransform`方法`render`页面，需要提供`template`，并且配置`view`选项。
`view`选项的具体配置可参考`koa-views`[官方文档](https://github.com/queckezz/koa-views)

#### 文件下载

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

#### 错误处理

错误处理也会使用下面的响应结构：
```json
{
  code: 500,
  data: data,
  msg: 'error message.'
}
```

定义router时，检验参数失败，也会使用这种响应结构返回。

#### 自定义 responseTransform
`responseTransform`函数会传入五个参数，如下：
```javascript
const responseTransform = function(error, response, ctx, next, template) {
  if (error) {
    //do something
  }
  //do something
};
```
- error：没有捕获到`error`时，`error`为`null`
- response：`route.handler`的返回值
- ctx：`koa`的`ctx`对象。
- next：`koa`的`next`对象。
- template：渲染模板，默认为`null`。

