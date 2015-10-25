/**
 * Created by gmena on 07-26-14.
 */


(function (window) {

	var WARNING_ROUTE = {
		ERROR: {
			BADINSTANCE: 'App instance needed'
		}
	};

	'use strict';
	/**Router
	 * @constructor
	 */
	function Router () {
		this.routes = {};
		this.history = window.history;
		this.findParams = /(:[\w]+)/g;
		this.onpopstate = {};
		this.module = null;

		var _self = this;

		//Set Pop State
		window.addEventListener ('popstate', function (e) {
			if ( _.isSet (e.state) && 'route_name' in e.state ) {
				if ( e.state.route_name in _self.onpopstate ) {
					_.each (_self.onpopstate[e.state.route_name], function (v, i) {
						v (e.state, e);

						//Intercept pop state
						_self._handleInterceptor ('redirect', e);
					}, true);
				}
			}

			//Intercept pop state
			_self._handleInterceptor ('popstate', e);

		});

	}

	/**Set the target
	 * @param {object} routes
	 * @return {object}
	 * */
	Router.add ('connect', function (to_route) {
		if ( !(to_route instanceof AppClass) )
			_.error (WARNING_ROUTE.ERROR.BADINSTANCE, '(Router .route)');

		this.module = to_route;
		to_route.lazy = true;
		return this;
	});

	/**Set the routes
	 * @param {object} routes
	 * @return {object}
	 * */
	Router.add ('set', function (routes) {
		var _self = this;

		return (new Promise (function (resolve, reject) {
			_self.routes = _.extend (_self.routes, routes);
			resolve (_self);
		}))
	});

	/** Handle Tpl Skulls
	 * @param {string} tpl
	 * @param {function} callback
	 * @return {void}
	 */
	Router.add ('_handleSkull', function (conf, callback, params) {
		var _view = new View;
		//Clear cache
		_view.cleanCache (conf.tpl);
		_view.seekTpl (conf.tpl).then (function (view) {

			// Find main
			var _main = _$ ('[sp-app]');
			// Exist the skull?
			if ( _main.exist )
				_main.html (view.getTpl ());

			//Execute
			callback.apply (conf.app, params);
		});
	});

	/**Delega rutas
	 * @param {string} route_name
	 * @returns {object}
	 */
	Router.add ('when', function (route_name, conf) {
		_.assert (route_name, _.WARNING_SYRUP.ERROR.NOPARAM, '(Router .when)');
		var _self = this;

		//No app. Nothing to do!!
		if ( !(conf && 'app' in conf) )
			return;

		//No route?
		if ( !(route_name in _self.onpopstate) )
			_self.onpopstate[route_name] = [];

		//Append a new route
		_self.onpopstate[route_name].push (function (state, e) {
			//Handle tpl?
			_self._handleSkull (conf, function () {
				//On main tpl is handled, what to do?

				if ( conf.app in _self.module.appCollection ) {
					//Intercept init
					//Inject params
					_self.module.appCollection[conf.app].intercept ({
						'init': function (mod) {
							mod.uri = {
								params: state,
								title : route_name,
								route : _self.routes[route_name]
							}
						}
					});

					//Taste recipes
					_self.module.appCollection[conf.app].taste ();
				}

			}, [state, e])

		});

		//First action
		if ( conf.default ) {
			_self.redirect (route_name, {});
		}

		return _self;

	});

	/**Redirect to route
	 * @param {string} route_name
	 * @return {object}
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

	/** Interceptors
	 * @param  {object} interceptors
	 * @return {object}
	 * */
	Router.add ('intercept', function (interceptors) {
		if ( _.isObject (interceptors) )
			MiddleWare.intercept (this, interceptors);
		return this;
	});


	/** Handle the interceptors
	 * @param {string} type
	 * @param {object} param
	 * @return {void}
	 * */
	Router.add ('_handleInterceptor', function (type, param) {
		//Trigger Interceptors
		MiddleWare.trigger (
			MiddleWare.getInterceptors (this, type),
			[param, this]
		);

		//Clean the interceptor
		MiddleWare.cleanInterceptor (this, type);
	});


	/** Trigger the pop state
	 * @param {object} _params
	 * @param {string} route_name
	 * @param {string} _the_new_route
	 * @return {void}
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

	//Global access
	window.Router = new Router;
	window.RouterClass = Router;


}) (window);