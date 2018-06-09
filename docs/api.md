<a name="Application"></a>

## Application ⇐ <code>Koa</code>
Create a new `Application`.Inherits from Koa.

**Kind**: global class  
**Extends**: <code>Koa</code>  
**Access**: public  
**See**: [https://koa.bootcss.com/](https://koa.bootcss.com/)  

* [Application](#Application) ⇐ <code>Koa</code>
    * [.route(routerDefine)](#Application+route)
    * [.load(path)](#Application+load)
    * [.loadFile(filepath, filename)](#Application+loadFile)
    * [.init()](#Application+init)
    * [.bindClass(name, instance)](#Application+bindClass) ⇒ <code>InstanceWrapper</code>
    * [.bindFunction(name, instance)](#Application+bindFunction) ⇒ <code>InstanceWrapper</code>
    * [.bindInstance(name, instance)](#Application+bindInstance) ⇒ <code>InstanceWrapper</code>
    * [.getInstance(name)](#Application+getInstance) ⇒ <code>\*</code>
    * [.getInstances(names)](#Application+getInstances) ⇒ <code>Array.&lt;\*&gt;</code>
    * [.deleteInstance(name)](#Application+deleteInstance)
    * [.deleteInstances(names)](#Application+deleteInstances)

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

### application.bindClass(name, instance) ⇒ <code>InstanceWrapper</code>
Bind Class.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>InstanceWrapper</code> - - InstanceWrapper instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected class. |
| instance | <code>Object</code> | Injected class. |

<a name="Application+bindFunction"></a>

### application.bindFunction(name, instance) ⇒ <code>InstanceWrapper</code>
Bind Function.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>InstanceWrapper</code> - - InstanceWrapper instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected function. |
| instance | <code>function</code> | Injected function. |

<a name="Application+bindInstance"></a>

### application.bindInstance(name, instance) ⇒ <code>InstanceWrapper</code>
Bind Instance.

**Kind**: instance method of [<code>Application</code>](#Application)  
**Returns**: <code>InstanceWrapper</code> - - InstanceWrapper instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the injected function. |
| instance | <code>\*</code> | Injected instance. |

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

