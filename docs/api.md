## Classes

<dl>
<dt><a href="#Application">Application</a></dt>
<dd><p>Expose <code>Application</code> class.
Inherits from <a href="https://koajs.com/"><code>Koa</code></a>.</p>
</dd>
<dt><a href="#RouterGroup">RouterGroup</a></dt>
<dd></dd>
</dl>

<a name="Application"></a>

## Application
Expose `Application` class.Inherits from [`Koa`](https://koajs.com/).

**Kind**: global class  

* [Application](#Application)
    * [new Application([options])](#new_Application_new)
    * [.get|put|post|patch|delete|del|all](#Application+get|put|post|patch|delete|del|all) ⇒ [<code>RouterGroup</code>](#RouterGroup)
    * [.Use(fn)](#Application+Use)
    * [.use(fn)](#Application+use)
    * [.Listen()](#Application+Listen)
    * [.listen(...args)](#Application+listen)
    * [.listenTLS(options, ...args)](#Application+listenTLS)
    * [.group(prefix)](#Application+group) ⇒ [<code>RouterGroup</code>](#RouterGroup)
    * [.parse(any)](#Application+parse) ⇒ <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code>
    * [.bindClass(name, instance)](#Application+bindClass)
    * [.bindFunction(name, instance)](#Application+bindFunction)
    * [.bindAny(name, instance)](#Application+bindAny)
    * [.getInstance(name)](#Application+getInstance) ⇒ <code>\*</code>
    * [.getInstances(names)](#Application+getInstances) ⇒ <code>Array</code>
    * [.getInstancesMap(names)](#Application+getInstancesMap) ⇒ <code>Object</code>
    * [.deleteInstance(name)](#Application+deleteInstance)
    * [.deleteInstances(names)](#Application+deleteInstances)
    * [.reset()](#Application+reset)

<a name="new_Application_new"></a>

### new Application([options])
Initialize a new `Application`.Inherits from [`Koa`](https://koajs.com/).


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Application options. |
| [options.env] | <code>String</code> | <code>&#x27;development&#x27;</code> | Environment |
| [options.keys] | <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code> |  | Signed cookie keys |
| [options.proxy] | <code>Boolean</code> |  | Trust proxy headers |
| [options.subdomainOffset] | <code>Number</code> |  | Subdomain offset |
| [options.proxyIpHeader] | <code>Boolean</code> |  | proxy ip header, default to X-Forwarded-For |
| [options.maxIpsCount] | <code>Boolean</code> |  | max ips read from proxy ip header, default to 0 (means infinity) |
| [options.prefix] | <code>String</code> |  | prefix router paths |

<a name="Application+get|put|post|patch|delete|del|all"></a>

### application.get\|put\|post\|patch\|delete\|del\|all ⇒ [<code>RouterGroup</code>](#RouterGroup)
Create router verbs methods, where *verb* is one of the HTTP verbs suchas `app.get()` or `app.post()`.

**Kind**: instance property of [<code>Application</code>](#Application)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> |  |
| [middleware] | <code>function</code> | route middleware(s) |
| callback | <code>function</code> | route callback |

<a name="Application+Use"></a>

### application.Use(fn)
Alias for:  Koa app.use()

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | middleware |

<a name="Application+use"></a>

### application.use(fn)
Register application level middleware.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | middleware |

<a name="Application+Listen"></a>

### application.Listen()
Alias for:  Koa app.listen()

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  
<a name="Application+listen"></a>

### application.listen(...args)
Overwrite Koa app.listen()

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>Mixed</code> | ... |

<a name="Application+listenTLS"></a>

### application.listenTLS(options, ...args)
Shorthand for:  https.createServer(options, app.callback()).listen(...)

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| ...args | <code>Mixed</code> | ... |

<a name="Application+group"></a>

### application.group(prefix) ⇒ [<code>RouterGroup</code>](#RouterGroup)
Group router.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| prefix | <code>String</code> | prefix router paths |

<a name="Application+parse"></a>

### application.parse(any) ⇒ <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code>
Parse function|class parameters.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type |
| --- | --- |
| any | <code>Class</code> \| <code>function</code> | 

<a name="Application+bindClass"></a>

### application.bindClass(name, instance)
Bind Class.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected class. |
| instance | <code>Class</code> | Injected class. |
| singleton. | <code>Boolean</code> |  |

<a name="Application+bindFunction"></a>

### application.bindFunction(name, instance)
Bind function.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected function. |
| instance | <code>function</code> | Injected function. |
| singleton. | <code>Boolean</code> |  |

<a name="Application+bindAny"></a>

### application.bindAny(name, instance)
Bind Any.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected function. |
| instance | <code>\*</code> | Injected instance. |
| singleton. | <code>Boolean</code> |  |

<a name="Application+getInstance"></a>

### application.getInstance(name) ⇒ <code>\*</code>
Get Instance.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>\*</code> - - instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected instance. |

<a name="Application+getInstances"></a>

### application.getInstances(names) ⇒ <code>Array</code>
Get Instances.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>Array</code> - - instances.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| names | <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code> | The names of the injected instances. |

<a name="Application+getInstancesMap"></a>

### application.getInstancesMap(names) ⇒ <code>Object</code>
Get Instances map.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>Object</code> - - instances.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| names | <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code> | The names of the injected instances. |

<a name="Application+deleteInstance"></a>

### application.deleteInstance(name)
Delete Instance.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected instance. |

<a name="Application+deleteInstances"></a>

### application.deleteInstances(names)
Delete Instances.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| names | <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code> | The names of the injected instances. |

<a name="Application+reset"></a>

### application.reset()
Reset instance pool.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  
<a name="RouterGroup"></a>

## RouterGroup
**Kind**: global class  
**Access**: public  

* [RouterGroup](#RouterGroup)
    * [new RouterGroup([options], app)](#new_RouterGroup_new)
    * [.get|put|post|patch|delete|del|all](#RouterGroup+get|put|post|patch|delete|del|all) ⇒ [<code>RouterGroup</code>](#RouterGroup)
    * [.use(fn)](#RouterGroup+use) ⇒ [<code>RouterGroup</code>](#RouterGroup)

<a name="new_RouterGroup_new"></a>

### new RouterGroup([options], app)
Initialize a new `RouterGroup`.Inherits from [`koa-router`](https://github.com/ZijianHe/koa-router).


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | Application options. |
| [options.prefix] | <code>String</code> | prefix router paths. |
| app | [<code>Application</code>](#Application) |  |

<a name="RouterGroup+get|put|post|patch|delete|del|all"></a>

### routerGroup.get\|put\|post\|patch\|delete\|del\|all ⇒ [<code>RouterGroup</code>](#RouterGroup)
Overwrite all router verbs methods of [`Router`](https://github.com/ZijianHe/koa-router).

**Kind**: instance property of [<code>RouterGroup</code>](#RouterGroup)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> |  |
| [middleware] | <code>function</code> | route middleware(s) |
| callback | <code>function</code> | route callback |

<a name="RouterGroup+use"></a>

### routerGroup.use(fn) ⇒ [<code>RouterGroup</code>](#RouterGroup)
Overwrite use.

**Kind**: instance method of [<code>RouterGroup</code>](#RouterGroup)  
**Access**: public  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

