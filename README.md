SlimRouter
======

Simple router module that can be used with or without require.js

# How it works
SlimRouter uses key/value pairs of regular expressions and callback events to route changes to ```window.location.hash``` to the appropriate action. For automated use, bind ```SlimRouter.route(window.location.hash)``` to the ```hashchange``` event using jQuery.

Optionally, routing can be called globally on-demand by instantiating SlimRouter as part of a global namespace.

# `API`
- [Constructor] (#constructor)

- Public Methods
	* [addRoute] (#addRoute)
	* [addRoutes] (#addRoutes)
	* [addXHRPool] (#addXHRPool)
	* [route] (#route)

## Constructor

```var router = new SlimRouter();```
Just like that, SlimRouter is instantiated.

Optionally, if you would like to pass a predefined route collection into SlimRouter's constructor, you can.
```
var routeCollection = {
	'#Items:query' : ItemController.queryItems,
	
	'#Items/Details/:id' : function(hash){
		//do something
		},
	
	'#Items/' : ItemController.itemIndex
}

var router = new SlimRouter(routeCollection);
```
SlimRouter is constructed, and the route collection is passed internally to SlimRouter's addRoutes method.


## Adding Routes After Construction

###addRoute
```router.addRoute(hash, callbackFunction);```

Adding routes can be done in a few ways, using the addRoute method.

addRoute takes two required parameters: 
- hash (required): the hash that will trigger the route method
- callbackFunction (required): a callback function to be executed when a hash is routed

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
The ```callback``` parameter should be defined as a callback function to be executed when a hash is matched.

-example 
``` 
router.addRoute('#Items:query',function(e, hash){
	...do stuff here
});
// when hash is matched, callback function is executed
```


###addRoutes
If you want to add multiple routes at a time, you can pass them in as an object literal using the ```addRoutes``` method.

-example
```
var routeCollection = {
	'#Items:query' : ItemController.queryItems,
	
	'#Items/Details/:id' : function(hash){
		//do something
		},
	
	'#Items/' : ItemController.itemIndex
}

router.addRoutes(routeCollection);
```

## XHR Pooling
As an optional feature, SlimRouter gives you the ability to abort XHR requests that may have been made prior to the current request. This feature may be advantageous if you have two requests that update the same page element, and may conflict or produce undesired results if both allowed to run to completion.

For this situation, XHR requests, such as $.ajax, can be added to pools, and those pools can be added to SlimRouter's pool collection. When a request is made, any existing requests that are active and in SlimRouter's pool collection will be aborted in favor of the current request.

When you'd like to control XHR requests using SlimRouter, the ```addXHRPool``` function is used.

- example

```
var router = new SlimRouter(); //instantiate SlimRouter

//add XHR Pool
router.addXHRPool(App.Helpers.XHRPool);

//add routes
router.addRoute('#Items:query', function(e,hash){
	var req = $.ajax({
		url: '/Items/FilteredQuery',
		type: 'GET',
		success: function(data){
			//do something with data
		}
	});

	App.Helpers.XHRPool.push(req);
});
router.addRoute('#Items/Details/:id', function(e,hash){
	var req = $.ajax({
		url: '/Items/Details',
		type: 'GET',
		dataType: 'html',
		data: {id: hash.split('/')[2]}
		success: function(data){
			//do something with data
		}
	});

	App.Helpers.XHRPool.push(req);
});
```

In the above example, when either hash is routed, the other route, whose callback belongs to App.Helpers.XHRPool, will be aborted immediately.

## Routing
Routing can be performed on demand, by calling SlimRouter's ```route``` method, or can be called by binding the document to the hashchange event in jQuery.

###route

- binding to the hashchange event

```
var slimRouter = new SlimRouter();
/*
 * add routes
 */

$(document).bind('hashchange', function(e)
{
	slimRouter.route(window.location.hash);
});
```

- calling route manually

```
var slimRouter = new SlimRouter();
slimRouter.route(window.location.hash);
```


