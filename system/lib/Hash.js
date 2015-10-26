/**
 * Created by gmena on 10-25-15.
 */

(function (window) {


	'use strict';
	/**Hash
	 * @constructor
	 */
	function Hash () {
		this.interceptors = {};
		this.onhashchange = {};


		var _self = this;
		//Set Hash Change
		window.addEventListener ('hashchange', function (e) {
			//Intercept pop state
			_self._handleInterceptor ('change', e);

			//Clean # from hash
			var _hash = _self._cleanHash (location.hash),
				_params = _self._getParams (location.hash);

			if ( _hash in _self.onhashchange ) {
				_.each (_self.onhashchange[_hash], function (v) {
					v (_params);
				}, true);
			}

		});

	}

	/**Delegate hash
	 * @param {string} hash
	 * @returns {object}
	 */
	Hash.add ('when', function (hash) {
		_.assert (hash, _.WARNING_SYRUP.ERROR.NOPARAM, '(Router .when)');
		var _self = this;

		//No route?
		if ( !(hash in _self.onhashchange) )
			_self.onhashchange[hash] = [];

		return {
			then: function (resolve) {
				//Append a new route
				_self.onhashchange[hash].push (resolve);
				return _self;
			}
		}

	});

	/**Clean # hash
	 * @param {string} hash
	 * @returns {string}
	 */
	Hash.add ('_cleanHash', function (hash) {
		return _.replace (hash, '#', _.emptyStr).split ('/')[0];
	});

	/**Clean # hash
	 * @param {string} hash
	 * @returns {object}
	 */
	Hash.add ('_getParams', function (hash) {
		var _split = hash.split ('/');
		_split = (_split.length > 1 && _split || hash.split ('?')).splice (1);
		return _.isString (hash)
			   && _split.length
			   && _.queryStringToJson (_split.pop ()) || {};
	});

	/** Interceptors
	 * @param  {object} interceptors
	 * @return {object}
	 * */
	Hash.add ('intercept', function (interceptors) {
		if ( _.isObject (interceptors) )
			MiddleWare.intercept (this, interceptors);
		return this;
	});


	/** Handle the interceptors
	 * @param {string} type
	 * @param {object} param
	 * @return {void}
	 * */
	Hash.add ('_handleInterceptor', function (type, param) {
		//Trigger Interceptors
		MiddleWare.trigger (
			MiddleWare.getInterceptors (this, type),
			[param, this]
		);

		//Clean the interceptor
		MiddleWare.cleanInterceptor (this, type);
	});


	/**Set the target
	 * @param {object} routes
	 * @return {object}
	 * */
	Hash.add ('connect', function (to_route) {
		if ( !(to_route instanceof AppClass) )
			_.error (WARNING_ROUTE.ERROR.BADINSTANCE, '(Router .route)');

		this.module = to_route;
		to_route.lazy = true;
		return this;
	});


	//Global access
	window.Hash = Hash;


}) (window);