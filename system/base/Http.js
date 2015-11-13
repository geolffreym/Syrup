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
		this.xhr = null;
		this.upload = null;
		this.config = {};
		this.name = 'default';
		this.interceptors = {
			default: {}
		};
	}

	/** Http Request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * **/
	Http.add ('request', function (url, data) {
		var _self = this,
			_query = _.emptyStr,
			_data = data || null;

		//New XHR Object
		_self.xhr = new window.XMLHttpRequest
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
		_self._handleInterceptor ('request', _self.config);

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
			_self.xhr.open (_self.config.method, _query, true);
			_self.xhr.timeout = _self.config.timeout;

			//Setting Headers
			if ( !_.isFormData (_data) ) {
				_.each (_self.config.headers, function (value, header) {
					_self._requestHeader (header, value);
				});
			}

			//Cors?
			_self.xhr.withCredentials = !!_self.config.cors;

			//If upload needed
			if ( _.isSet (_self.config.upload)
				 && _.isBoolean (_self.config.upload)
			) {
				_self.upload = _self.xhr.upload;
				_self.xhr = _self.upload;
			}

			//Event Listeners
			//Success
			_self.xhr.addEventListener ('load', function (e) {
				if ( this.status >= 0xC8 && this.status < 0x190 || this.status == 0 ) {
					//The response
					this.responseClean = _self._response (this);

					//Find a interceptor for success
					_self._handleInterceptor ('success', this);

					//Resolve
					resolve (this.responseClean);

				}
			});

			//Progress
			_self.xhr.addEventListener ('progress', function (e) {
				//Find a interceptor for progress
				_self._handleInterceptor ('progress', e);

			});

			//State
			_self.xhr.addEventListener ('readystatechange', function (e) {
				if ( this.readyState ) {
					//Find a interceptor for state
					_self._handleInterceptor ('state', this);
				}
			});

			//Abort
			_self.xhr.addEventListener ('abort', function (e) {
				//Find a interceptor for abort
				_self._handleInterceptor ('abort', this);

			});

			//Complete
			_self.xhr.addEventListener ('loadend', function (e) {
				//The response
				this.responseClean = _self._response (this);

				//Find a interceptor for complete
				_self._handleInterceptor ('complete', this);
			});

			_self.xhr.addEventListener ('loadstart', function (e) {
				//Find a interceptor for  before
				_self._handleInterceptor ('before', this);
			});

			_self.xhr.addEventListener ('error', function (e) {
				//Find a interceptor for success
				_self._handleInterceptor ('error', this);

				reject (e);

			});

			//Send
			_self.xhr.send (
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
		named = !_.isObject (named) && _.isString (named) && named || _self.name;


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
	Http.add ('interceptClean', function (type, named) {
		//Naming interceptors!!
		named = named || this.name;

		//Clean the interceptor
		MiddleWare.cleanInterceptor (this.interceptors[named], type);
		return this;
	});

	/** Handle the interceptors
	 * @param {string} type
	 * @param {object} param
	 * @return {void}
	 * */
	Http.add ('_handleInterceptor', function (type, param) {

		//Has interceptors?
		if ( this.name in this.interceptors ) {
			//Trigger Interceptors
			MiddleWare.trigger (
				MiddleWare.getInterceptors (
					this.interceptors[this.name], type
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


	/**Abort request
	 * @return {void}
	 * */
	Http.add ('abort', function () {
		this.xhr && this.xhr.abort ();
	});

	/** Rest handler
	 * @param {string} header
	 * @param {string} type
	 * @param {object} data
	 * @param {string} naming
	 * @return {object}
	 * **/
	Http.add ('_rest', function (url, type, data, naming) {

		this.config.method = type;//The method!!
		this.name = _.isString (data) && data
					|| naming || 'default'; // Naming request!!

		//The request
		return this.request (url, _.isObject (data) && data || {});
	});

	/** Handle response
	 * @param {object} xhr
	 * @return {object|string}
	 * **/
	Http.add ('_response', function (xhr) {
		var _response = xhr.response || xhr.responseText || xhr.responseXML;
		return _.isJson (_response) && _.toObject (_response) || _response;
	});

	/** Set Request Header
	 * @param {string} header
	 * @param {string} type
	 * @return {object}
	 * **/
	Http.add ('_requestHeader', function (header, type) {
		this.xhr.setRequestHeader (header, type);
		return this;
	});


	//Global access
	window.Http = Http;


}) (window);