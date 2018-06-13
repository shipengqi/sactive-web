## Classes

<dl>
<dt><a href="#Application">Application</a> ⇐ <code>Koa</code></dt>
<dd><p>Create a new <code>Application</code>.
Inherits from Koa.</p>
</dd>
<dt><a href="#Route">Route</a> ⇐ <code>Router</code></dt>
<dd><p>Create a <code>Route</code>.
Inherits from koa-router.</p>
</dd>
</dl>

<a name="Application"></a>

## Application ⇐ <code>Koa</code>
Create a new `Application`.Inherits from Koa.

**Kind**: global class  
**Extends**: <code>Koa</code>  
**Access**: public  
**See**: [https://koajs.com/](https://koajs.com/)  

* [Application](#Application) ⇐ <code>Koa</code>
    * [new Application(config)](#new_Application_new)
    * [.route(routerDefine)](#Application+route)
    * [.load(path)](#Application+load)
    * [.loadFile(filepath, filename)](#Application+loadFile)
    * [.init()](#Application+init)
    * [.bindClass(name, instance, opt)](#Application+bindClass) ⇒ <code>InstanceWrapper</code>
    * [.bindFunction(name, instance, opt)](#Application+bindFunction) ⇒ <code>InstanceWrapper</code>
    * [.bindInstance(name, instance, opt)](#Application+bindInstance) ⇒ <code>InstanceWrapper</code>
    * [.getInstance(name)](#Application+getInstance) ⇒ <code>\*</code>
    * [.getInstances(names)](#Application+getInstances) ⇒ <code>Array.&lt;\*&gt;</code>
    * [.deleteInstance(name)](#Application+deleteInstance)
    * [.deleteInstances(names)](#Application+deleteInstances)

<a name="new_Application_new"></a>

### new Application(config)

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Configuration options for the `Application`. |

<a name="Application+route"></a>

### application.route(routerDefine)
Register a router.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| routerDefine | <code>Object</code> | define a router. |

<a name="Application+load"></a>

### application.load(path)
Loads every route files in the given path.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | A String path on the filesystem. |

<a name="Application+loadFile"></a>

### application.loadFile(filepath, filename)
Loads route file in path.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>String</code> | A String path on the filesystem. |
| filename | <code>String</code> | A String filename in path on the filesystem. |

<a name="Application+init"></a>

### application.init()
Initialize application routes.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Access**: public  
<a name="Application+bindClass"></a>

### application.bindClass(name, instance, opt) ⇒ <code>InstanceWrapper</code>
Bind Class.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>InstanceWrapper</code> - - InstanceWrapper instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected class. |
| instance | <code>class</code> | Injected class. |
| opt | <code>Object</code> | options for the instance. |

<a name="Application+bindFunction"></a>

### application.bindFunction(name, instance, opt) ⇒ <code>InstanceWrapper</code>
Bind Function.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>InstanceWrapper</code> - - InstanceWrapper instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected function. |
| instance | <code>function</code> | Injected function. |
| opt | <code>Object</code> | options for the instance. |

<a name="Application+bindInstance"></a>

### application.bindInstance(name, instance, opt) ⇒ <code>InstanceWrapper</code>
Bind Instance.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>InstanceWrapper</code> - - InstanceWrapper instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected function. |
| instance | <code>\*</code> | Injected instance. |
| opt | <code>Object</code> | options for the instance. |

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

### application.getInstances(names) ⇒ <code>Array.&lt;\*&gt;</code>
Get Instance.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>Array.&lt;\*&gt;</code> - - instances.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| names | <code>String</code> | The names of the injected instances. |

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
| names | <code>String</code> | The names of the injected instances. |

<a name="Route"></a>

## Route ⇐ <code>Router</code>
Create a `Route`.Inherits from koa-router.

**Kind**: global class  
**Extends**: <code>Router</code>  
**Access**: public  
**See**: [https://www.npmjs.com/package/koa-router](https://www.npmjs.com/package/koa-router)  
<a name="new_Route_new"></a>

### new Route($$logger, $$config)

| Param | Type | Description |
| --- | --- | --- |
| $$logger | <code>Object</code> | logger. |
| $$config | <code>Object</code> | config. |

