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


			//Clean # from hash
			var _hash = _self._cleanHash (location.hash),
				_params = _self._getParams (location.hash);

			//Intercept pop state
			_self._handleInterceptor ('change', _params);

			if ( _hash in _self.onhashchange ) {
				_.each (_self.onhashchange[_hash], function (v) {
					v (_params);
				});
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

		//No route?. Create it!!
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
		var _hash = _.replace (hash, '#', _.emptyStr),
			_split = _hash.split ('/');

		return (_split.length > 1 && _split || _hash.split ('?'))[0];
	});

	/**Clean # hash
	 * @param {string} hash
	 * @returns {object}
	 */
	Hash.add ('_getParams', function (hash) {
		var _split = hash.split ('/');
		_split = (_split.length > 1 && _split || hash.split ('?')).splice (1);

		return _split.length > 0
			   && _.queryStringToJson (_split[0]) || {};
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

	/** Clean Interceptors
	 * @param  {string} type
	 * @return {object}
	 * */
	Hash.add ('interceptClean', function (type) {
		//Clean the interceptor
		MiddleWare.cleanInterceptor (this, type);
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
		//MiddleWare.cleanInterceptor(this, type);
	});

	//Global access
	window.Hash = Hash;


}) (window);