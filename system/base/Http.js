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
		this.interceptors = {};
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
				if ( this.status >= 0xC8 && this.status < 0x190 ) {

					//The response
					var _response = this.response || this.responseText;
					_response = _.isJson (_response) && _.toObject (_response) || _response;

					//Find a interceptor for success
					_self._handleInterceptor ('success', this);

					resolve (_response);

				}
			});

			//Progress
			_self.xhr.addEventListener ('progress', function (e) {
				//Find a interceptor for progress
				_self._handleInterceptor ('progress', e);

			}, false);

			//State
			_self.xhr.addEventListener ('readystatechange', function (e) {
				if ( this.readyState ) {
					//Find a interceptor for state
					_self._handleInterceptor ('state', {
						state : this.readyState,
						status: this.status
					});
				}
			});

			//Abort
			_self.xhr.addEventListener ('abort', function (e) {
				//Find a interceptor for abort
				_self._handleInterceptor ('abort', this);

			}, true);

			//Complete
			_self.xhr.addEventListener ('loadend', function (e) {
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
			_self.xhr.send (_self.config.method !== 'GET' ? _data : null);

			//Release name
			_self.name = 'default';
		}));

	});

	/** Interceptors
	 * @param  {object} interceptors
	 * @return {object}
	 * */
	Http.add ('intercept', function (interceptors) {
		if ( _.isObject (interceptors) )
			MiddleWare.intercept (this, interceptors);
		return this;
	});

	/** Clean Interceptors
	 * @param  {string} type
	 * @return {object}
	 * */
	Http.add ('interceptClean', function (type) {
		//Clean the interceptor
		MiddleWare.cleanInterceptor (this, type);
		return this;
	});

	/** Handle the interceptors
	 * @param {string} type
	 * @param {object} param
	 * @return {void}
	 * */
	Http.add ('_handleInterceptor', function (type, param) {
		//Trigger Interceptors
		MiddleWare.trigger (
			MiddleWare.getInterceptors (this, type),
			[param, this]
		);

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