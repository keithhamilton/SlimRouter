(function (name, definition) {

    // AMD.
    if (typeof define == 'function') {
        define(definition);
    } 

        // Node.
    else if (typeof module != 'undefined') {
        module.exports = definition();
    }

        // Namespace.
    else {
        window[name] = definition();
    }
    
}('SlimRouter', function(routeCollection) {

    /* a route collection can be pre-defined and passed in to the SlimRouter contstructor,
     * or SlimRouter can be instantiated without parameters, and routes can be added later.
     */

    var _routes = {},
        _XHRPools = [];
    
    if(routeCollection) _addRoutes(routeCollection);

    function _route(hash)
    {
        /* uses window.location.hash value to find the appropriate
         * event handler to trigger from the routes object
         * if no hash is present, sets internal hash value to defined
         * default hash or blank string if both hash and default hash are undefined

         * on regular expression match, the route's callback function is triggered, with hash as the argument.
         */

        _abortPreviousXHRRequests();

        hash = hash ? hash : App.Helpers.DEFAULT_HASH ? App.Helpers.DEFAULT_HASH : "";

        for (var key in _routes)
        {
            var re = new RegExp(key);
            if (hash.match(re))
            {
                _routes[key](hash);

            }
        }

    };

    function _abortPreviousXHRRequests()
    {
        /* will iterate through XHRPools array finding any XHR requests
         * that are already being made and abort them in favor of the current
         * request that is being made
         */
        if (_XHRPools)
        {
            for (var i in _XHRPools)
            {
                if (_XHRPools[i].length > 0)
                {
                    reqs = _XHRPools[i].splice(0, _XHRPools[i].length);
                    for (var r in reqs)
                    {
                        reqs[r].abort();
                    }
                }
            }

        }
    };

    function _addRoute(hash, callbackFunction)
    {
        /* routes can be added in a few ways
         * a route hash can be given in a static form, such as #/Items/:id, where :id represents some number (matches #/Items/10, for example)
         * a route hash can also be expressed as a standard regular expression, such as #/[A-Z][a-z]+/[0-9]$ (which would also match against #/Items/10)
         * 
         * acceptable parameter substitutions
         * :id      - translates to some number
         * :guid    - translates to a string of mixed numbers and letters, with or without dashes
         * :string  - translates to a string of lower and/or upper case characters
         * :query   - translates to a parameterized query string that would match either of the following:
         *            #Items?filter=Parameter%20One&Parameter_Two
         *            #Items?Parameter%20One&Parameter_Two
         *
         * the callback parameter is the callback function that should be executed when the hash is matched in the router.
         */

        var param_substitions =
        {
            ':id': '[0-9]+',
            ':guid': '(\w+\-?)+',
            ':string': '[A-Za-z]+',
            ':query': '[?](.*\&?)+'
        }

        for (var key in param_substitions)
        {
            if (hash.indexOf(key) > -1) hash = hash.replace(key, param_substitions[key]);
        }

        //ensure string ends with hash pattern by adding $ to end of string if not present
        if (hash.charAt(hash.length - 1) !== '$') hash = hash + '$'

        _routes[hash] = callbackFunction;

    }

    function _addRoutes(routeCollection)
    {
        /*
         * multiple routes can be added in a single method call by calling addRoutes and passing a route collection object as the sole parameter.
         * the route collection should use the route's hash as the key, and its callback function for the value.

            routeCollection = {
                hash            : callbackFunction,
                other/hash      : otherCallbackFunction
            }
            
            router.addRoutes(routeCollection);

        */

        for (var key in routeCollection)
        {
            var hash = key;
            var callbackFunction = routeCollection[key];

            _addRoute(hash, callbackFunction);
        }
    }

    function _addXHRPool(xhrPool)
    {
        /* xhr pools are added as a convenience function, but not necessary to use
         * the purpose of the xhr pools are to provide a way to abort previous navigation requests
         * that may have been made prior to some hash change or callback event being raised
         *
         * if used, an xhr pool will receive XHR requests via push or unshift
         */

        if (!_XHRPools) _XHRPools = [];
        _XHRPools.push(xhrPool);
    }


    return {
        route: _route,
        addRoute: _addRoute,
        addRoutes: _addRoutes,
        addXHRPool: _addXHRPool
    }
}));
