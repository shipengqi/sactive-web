<a name="Application"></a>

## Application
Expose `Application` class.
Inherits from [`Koa`](https://koajs.com/).

**Kind**: global class  

* [Application](#Application)
    * [new Application([options])](#new_Application_new)
    * [.Use()](#Application+Use)
    * [.use()](#Application+use)
    * [.Listen()](#Application+Listen)
    * [.listen()](#Application+listen)
    * [.listenTLS()](#Application+listenTLS)
    * [.parse([any])](#Application+parse) ⇒ <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code>
    * [.bindClass([name], [instance], [singleton])](#Application+bindClass)
    * [.bindFunction(name, instance, [singleton])](#Application+bindFunction)
    * [.bindAny([name], [instance], [singleton])](#Application+bindAny)
    * [.getInstance([name])](#Application+getInstance) ⇒ <code>\*</code>
    * [.getInstances([names])](#Application+getInstances) ⇒ <code>Array</code>
    * [.getInstancesMap([names])](#Application+getInstancesMap) ⇒ <code>Object</code>
    * [.deleteInstance(name)](#Application+deleteInstance)
    * [.deleteInstances(names)](#Application+deleteInstances)
    * [.reset()](#Application+reset)

<a name="new_Application_new"></a>

### new Application([options])
Initialize a new `Application`.
Inherits from [`Koa`](https://koajs.com/).


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

<a name="Application+Use"></a>

### application.Use()
Alias for:
  Koa app.use()

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  
<a name="Application+use"></a>

### application.use()
Overwrite Koa app.use()

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  
<a name="Application+Listen"></a>

### application.Listen()
Alias for:
  Koa app.listen()

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  
<a name="Application+listen"></a>

### application.listen()
Overwrite Koa app.listen()

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  
<a name="Application+listenTLS"></a>

### application.listenTLS()
Shorthand for:
  https.createServer(options, app.callback()).listen(...)

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  
<a name="Application+parse"></a>

### application.parse([any]) ⇒ <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code>
Parse function|class parameters.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type |
| --- | --- |
| [any] | <code>Class</code> \| <code>function</code> | 

<a name="Application+bindClass"></a>

### application.bindClass([name], [instance], [singleton])
Bind Class.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>String</code> | The name of the injected class. |
| [instance] | <code>Class</code> | Injected class. |
| [singleton] | <code>Boolean</code> |  |

<a name="Application+bindFunction"></a>

### application.bindFunction(name, instance, [singleton])
Bind function.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected function. |
| instance | <code>function</code> | Injected function. |
| [singleton] | <code>Boolean</code> |  |

<a name="Application+bindAny"></a>

### application.bindAny([name], [instance], [singleton])
Bind Any.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>String</code> | The name of the injected function. |
| [instance] | <code>\*</code> | Injected instance. |
| [singleton] | <code>Boolean</code> |  |

<a name="Application+getInstance"></a>

### application.getInstance([name]) ⇒ <code>\*</code>
Get Instance.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>\*</code> - - instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>String</code> | The name of the injected instance. |

<a name="Application+getInstances"></a>

### application.getInstances([names]) ⇒ <code>Array</code>
Get Instances.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>Array</code> - - instances.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [names] | <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code> | The names of the injected instances. |

<a name="Application+getInstancesMap"></a>

### application.getInstancesMap([names]) ⇒ <code>Object</code>
Get Instances map.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>Object</code> - - instances.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [names] | <code>[ &#x27;Array&#x27; ].&lt;String&gt;</code> | The names of the injected instances. |

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
