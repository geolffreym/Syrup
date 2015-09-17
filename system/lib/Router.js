/**
 * Created by gmena on 07-26-14.
 */

'use strict';
/**Router
 * @constructor
 */
function Router () {
	this.routes = {};
	this.history = window.history;
	this.findParams = /(:[\w]+)/g;
	this.onpopstate = {};

	var _self = this;
	//Set Pop State
	window.addEventListener ('popstate', function (e) {
		if ( _.isSet (e.state) && 'route_name' in e.state ) {
			if ( e.state.route_name in _self.onpopstate ) {
				_self.onpopstate[e.state.route_name].forEach (function (v, i) {
					v (e.state, e);
				});
			}
		}
	});
}


/**Set the routes
 * @param routes
 * @return object
 * */
Router.add ('setRoutes', function (routes) {
	var _self = this;

	return (new Promise (function (resolve, reject) {
		_self.routes = _.extend (_self.routes, routes);
		resolve (_self.routes);
	}))
});

/**Delega rutas
 * @param path
 * @param callback
 * @returns {boolean}
 */
Router.add ('when', function (route_name) {
	_.assert (route_name, _.WARNING_SYRUP.ERROR.NOPARAM, '(Router .when)');
	var _self = this;

	return {
		then: function (callback) {
			if ( _.isFunction (callback) ) {
				if ( !(route_name in _self.onpopstate) )
					_self.onpopstate[route_name] = [];
				_self.onpopstate[route_name].push (callback);
			}
		}
	};

});

/**Redirect to route
 * @param route_name
 * */
Router.add ('redirect', function (route_name, params, config) {
	_.assert (route_name, _.WARNING_SYRUP.ERROR.NOPARAM, '(Router .redirect)');

	var _self = this,
		_the_new_route = null,
		_params = null, _config = {
			trigger: true
		};

	return (new Promise (function (resolve, reject) {

		//Not routing
		if ( !(route_name in _self.routes) ) {
			reject (route_name);
			return;
		}

		//Params and config
		_params = _.isObject (params)
			? params : {};

		_config = _.extend (_config, config || {}, true);

		//Set old regex in state object
		_params['route_name'] = route_name;
		_the_new_route = _self.routes[route_name];

		//Replace params?
		_the_new_route = _.isSet (params) && _.getObjectSize (params) > 0
			? _.replace (_the_new_route, _self.findParams, params)
			: _the_new_route;

		//Set state in history
		_self._triggerPopState (_params, route_name, _the_new_route, _config);

		//Resolve Promise
		resolve (_the_new_route);


	}));
});


/** Trigger the pop state
 * @param _params
 * @param route_name
 * @param _the_new_route
 * */
Router.add ('_triggerPopState', function (_params, route_name, _the_new_route, _config) {
	//Set state in history
	//Two times, for trigger "popstate"

	if ( _config.trigger ) {
		this.history.pushState (_params, route_name, _the_new_route);
		this.history.pushState (_params, route_name, _the_new_route);
		this.history.back ();
	}

});
