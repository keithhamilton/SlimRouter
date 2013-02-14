SlimRouter
======

Simple router module that can be used with or without require.js

## `API`
- [instantiation] (#instantiation)	

- Public Methods
	* [addRoute] (#Adding Routes)
	* [addXHRPool] (#Adding XHR Pools)
	* [route] (#Routing)

## Instantiation
### var router = new SlimRouter();
Just like that, SlimRouter is instantiated.

## Adding Routes
```javascript router.addRoute(hash, callback);```

Adding routes can be done in a few ways, using the addRoute method.

addRoute takes two parameters: 
- hash: the hash that will trigger the route method
- callback: either an event to be raised when a hash is routed, or a callback function to be executed when a hash is routed

###hash
The ```javascript hash``` parameter can be entered as a static string, a regular expression, or can use path substitution keywords. 

Acceptable path substitution keywords are:
- :id - matches a int
- :string - matches a string of upper- and/or lower-case letters
- :guid - matches a string of mixed numbers and letters, with or without dashes
- :query - matches a parameterized query string such as '?filter=Photography&Black%20and%20White'

For example, the hash #Items/Details/10 can be passed into the addRoute method in a few ways:

- ```javascript #Items/Details/:id```
- ```javascript #:string/Details/:id```

The hash ```javascript #Items?filter=Photograhpy&Studio``` can be passed into the addRoute method in a few ways:

- ```javascript #Items:query```
- ```javascript :string:query```

###callback
The ```javascript callback``` parameter can be passed in either as a callback function or an event that should be raised when a hash is matched.

-example - callback as callback function
```javascript 
router.addRoute('#Items:query',function(e, hash){
	...do stuff here
});
// when hash is matched, callback function is executed
```

-example - callback as event
```javascript
router.addRoute('#Items:query', 'item.filteredquery')
// when hash is matched, $(document).trigger('item.filteredquery') is called.
```




