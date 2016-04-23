/**
 * Created by gmena on 07-26-14.
 * Interceptor: ['request','progress','state','abort', 'complete', 'error','success']
 */

'use strict';

/**Http
 * @constructor
 */
(function (window) {

	function Http () {
		this.upload = null;
		this.config = {};
		this.interceptors = {
			default: {}
		};
	}

	/** Http Request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * **/
	Http.add ('request', function (url, data, naming) {
		var _self = this,
			_query = _.emptyStr,
			_data = data || null,
		//New XHR Object
			_xhr = new window.XMLHttpRequest
				   || new window.ActiveXObject ("Microsoft.XMLHTTP");

		//Make global conf
		_self.config = _.extend ({
			method : 'GET',
			timeout: 0xFA0,
			upload : false,
			cors   : false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			}
		}, _self.config, true);

		//Handle request interceptor
		_self._handleInterceptor ('request', _self.config, naming);
		_xhr.method = _self.config.method;

		//Promise execution
		return (new Promise (function (resolve, reject) {

			if ( !_.isSet (url) )
				_.error (_.WARNING_SYRUP.ERROR.NOURL, '(Http .request)');

			//If is Object and not formData
			//parse Object to querystring
			if ( !_.isFormData (_data)
				 && _.isObject (_data)
				 && _.getObjectSize (_data) > 0
			) {
				_data = _.jsonToQueryString (_data);
			}

			//If method is GET and data exists
			if ( _self.config.method === 'GET'
				 && _.isString (_data)
			) {
				_query += '?' + _data;
			}


			//Process url
			_query = url + (_query);
			_xhr.open (_self.config.method, _query, true);
			_xhr.timeout = _self.config.timeout;

			//Setting Headers
			//if ( !_.isFormData (_data) ) {
			_.each (_self.config.headers, function (value, header) {
				_xhr.setRequestHeader (header, value);
			});
			//}

			//Cors?
			_xhr.withCredentials = !!_self.config.cors;

			//If upload needed
			if ( _.isSet (_self.config.upload)
				 && _.isBoolean (_self.config.upload)
			) {
				_self.upload = _xhr.upload;
				_xhr = _self.upload;
			}

			//Event Listeners
			//Success
			_xhr.addEventListener ('load', function (e) {
				if ((this.status == 200 || this.status == 0 ) && this.readyState == 4) {
					//The response
					this.responseClean = _self._response (this);

					//Find a interceptor for success
					_self._handleInterceptor ('success', _xhr, naming);

					//Resolve
					resolve (this.responseClean);

				}
			});

			//Progress
			_xhr.addEventListener ('progress', function (e) {
				//Find a interceptor for progress
				_self._handleInterceptor ('progress', e, naming);

			});

			//State
			_xhr.addEventListener ('readystatechange', function (e) {
				if ( this.readyState ) {
					//Find a interceptor for state
					_self._handleInterceptor ('state', _xhr, naming);
				}
			});

			//Abort
			_xhr.addEventListener ('abort', function (e) {
				//Find a interceptor for abort
				_self._handleInterceptor ('abort', _xhr, naming);

			});

			//Complete
			_xhr.addEventListener ('loadend', function (e) {
				//The response
				this.responseClean = _self._response (this);

				//Find a interceptor for complete
				_self._handleInterceptor ('complete', _xhr, naming);
			});

			_xhr.addEventListener ('loadstart', function (e) {
				//Find a interceptor for  before
				_self._handleInterceptor ('before', _xhr, naming);
			});

			_xhr.addEventListener ('error', function (e) {
				//Find a interceptor for success
				_self._handleInterceptor ('error', _xhr, naming);

				reject (e);

			});

			//Send
			_xhr.send (
				_self.config.method !== 'GET'
					? _data : null
			);

		}));

	});

	/** Interceptors
	 * @param  {object} interceptors
	 * @return {object}
	 * */
	Http.add ('intercept', function (named, interceptors, extend) {
		var _self = this;

		//Naming interceptors!!
		extend = _.isArray (interceptors) && interceptors || _.isArray (extend) && extend || null;
		interceptors = _.isObject (named) && named || _.isObject (interceptors) && interceptors || {};
		named = !_.isObject (named) && _.isString (named) && named || 'default';

		//New named interceptor!!
		if ( !(named in _self.interceptors) )
			_self.interceptors[named] = {};

		//Extend interceptors?
		if ( extend ) {
			MiddleWare.extend (
				_self.interceptors,
				named, extend
			);
		}

		//Intercept!!!
		if ( _.isObject (interceptors) )
			MiddleWare.intercept (
				_self.interceptors[named],
				interceptors
			);

		return this;
	});

	/** Clean Interceptors
	 * @param  {string} type
	 * @return {object}
	 * */
	Http.add ('interceptClean', function (named, type) {
		//Naming interceptors!!
		named = named || 'default';

		//Clean the interceptor
		if ( type ) {
			MiddleWare.cleanInterceptor (this.interceptors[named], type);
		} else {
			if ( named in  this.interceptors )
				delete this.interceptors[named];
		}
		return this;
	});

	/** Handle the interceptors
	 * @param {string} type
	 * @param {object} param
	 * @return {void}
	 * */
	Http.add ('_handleInterceptor', function (type, param, naming) {

		//Has interceptors?
		if ( naming in this.interceptors ) {
			//Trigger Interceptors
			MiddleWare.trigger (
				MiddleWare.getInterceptors (
					this.interceptors[naming], type
				),
				[param, this]
			);
		}
		//Clean the interceptor
		//MiddleWare.cleanInterceptor (this, type);
	});

	/**Get request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * */
	Http.add ('get', function (url, data, naming) {
		return this._rest (url, 'GET', data, naming);
	});


	/**Post request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * */
	Http.add ('post', function (url, data, naming) {
		return this._rest (url, 'POST', data, naming);
	});


	/**Put request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * */
	Http.add ('put', function (url, data, naming) {
		return this._rest (url, 'PUT', data, naming);
	});


	/**Delete request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * */
	Http.add ('delete', function (url, data, naming) {
		return this._rest (url, 'DELETE', data, naming);
	});

	/** Rest handler
	 * @param {string} header
	 * @param {string} type
	 * @param {object} data
	 * @param {string} naming
	 * @return {object}
	 * **/
	Http.add ('_rest', function (url, type, data, naming) {
		//The method!!
		this.config.method = type;

		//The request
		return this.request (
			url, _.isObject (data) && data || {},
			_.isString (data) && data || naming || 'default'
		);
	});

	/** Handle response
	 * @param {object} xhr
	 * @return {object|string}
	 * **/
	Http.add ('_response', function (xhr) {
		var _response = xhr.response || xhr.responseText || xhr.responseXML;
		return _.isJson (_response) && _.toObject (_response) || _response;
	});


	//Global access
	window.Http = Http;


}) (window);