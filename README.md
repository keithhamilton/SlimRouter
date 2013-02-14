SlimRouter
======

Simple router module that can be used with or without require.js

# How it works
SlimRouter uses key/value pairs of regular expressions and callback events to route changes to ```window.location.hash``` to the appropriate action. For automated use, bind ```SlimRouter.route(window.location.hash)``` to the ```hashchange``` event using jQuery.

Optionally, routing can be called globally on-demand by instantiating SlimRouter as part of a global namespace.

# `API`
- [instantiation] (#instantiation)	

- Public Methods
	* [addRoute] (#Adding Routes)
	* [addXHRPool] (#Adding XHR Pools)
	* [route] (#Routing)

## Instantiation
### var router = new SlimRouter();
Just like that, SlimRouter is instantiated.

## Adding Routes
```router.addRoute(hash, callback, callbackTarget);```

Adding routes can be done in a few ways, using the addRoute method.

addRoute takes two required parameters and one optional parameter: 
- hash (required): the hash that will trigger the route method
- callback (required): either an event to be raised when a hash is routed, or a callback function to be executed when a hash is routed
- callbackTarget (optional): if callback is a function, this parameter should be omitted. If specified, callbackTarget the selector of the document element on which to trigger the callback event. If omitted, ```document``` will be the recipient of the raised callback event.

###hash
The ```hash``` parameter can be entered as a static string, a regular expression, or can use path substitution keywords. 

Acceptable path substitution keywords are:
- :id - matches a int
- :string - matches a string of upper- and/or lower-case letters
- :guid - matches a string of mixed numbers and letters, with or without dashes
- :query - matches a parameterized query string such as '?filter=Photography&Black%20and%20White'

For example, the hash #Items/Details/10 can be passed into the addRoute method in a few ways:

- ```#Items/Details/:id```
- ```#:string/Details/:id```

The hash ```#Items?filter=Photograhpy&Studio``` can be passed into the addRoute method in a few ways:

- ```#Items:query```
- ```:string:query```

###callback
The ```callback``` parameter can be passed in either as a callback function or an event that should be raised when a hash is matched.

-example - callback as callback function
``` 
router.addRoute('#Items:query',function(e, hash){
	...do stuff here
});
// when hash is matched, callback function is executed
```

-example - callback as event
```
router.addRoute('#Items:query', 'item.filteredquery')
// when hash is matched, $(document).trigger('item.filteredquery') is called.
```

###callbackTarget - selector of target for callback event
The ```callbackTarget``` parameter is optional and should only be passed if ```callback``` is defined as an event to be raised upon a hash match. If omitted from ```addRoute```, or a route collection object used with ```addRoutes```, the document will be the target of the callback event.

-example:
router.addRoute('#Items:query', 'item.filteredquery', '#someElement');





