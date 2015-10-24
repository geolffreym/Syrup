/**
 * Created by gmena on 07-26-14.
 */

'use strict';

/**Http
 * @constructor
 */
(function (window) {

	function Http () {
		this.xhr = new window.XMLHttpRequest
				   || new window.ActiveXObject ("Microsoft.XMLHTTP");
		this.xhr_list = [];
		this.upload = null;
		this.config = null;
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

		//Make global conf
		_self.config = {
			method : 'GET',
			timeout: 0xFA0,
			upload : false,
			cors   : false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			}
		};

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
					var _response = this.response || this.responseText;
					if ( _.isJson (_response) ) {
						_response = JSON.parse (_response);
					}
					//Find a interceptor for success
					_self._handleInterceptor ('success', _response);

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
					_self._handleInterceptor ('state', e);
				}
			});

			//Abort
			_self.xhr.addEventListener ('abort', function (e) {
				//Find a interceptor for abort
				_self._handleInterceptor ('abort', e);

			});

			//Complete
			_self.xhr.addEventListener ('loadend', function (e) {
				//Find a interceptor for complete
				_self._handleInterceptor ('complete', e);

			});

			_self.xhr.addEventListener ('loadstart', function (e) {
				//Find a interceptor for  before
				_self._handleInterceptor ('before', e);
			});

			_self.xhr.addEventListener ('error', function (e) {
				reject (e);

				//Find a interceptor for success
				_self._handleInterceptor ('error', e);
			});

			//Send
			_self.xhr_list.push (_self.xhr);
			_self.xhr.send (_self.config.method !== 'GET' ? _data : null);
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
		MiddleWare.cleanInterceptor (this, type);
	});

	/**Get request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * */
	Http.add ('get', function (url, data) {
		this.kill ();
		return this.request (url, data);
	});


	/**Post request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * */
	Http.add ('post', function (url, data) {

		//MiddleWare
		MiddleWare.intercept (this, {
			request: function (config, xhr) {
				config.method = 'POST';
			}
		});

		this.kill ();
		return this.request (url, data);
	});


	/**Put request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * */
	Http.add ('put', function (url, data) {

		//MiddleWare
		MiddleWare.intercept (this, {
			request: function (config, xhr) {
				config.method = 'PUT';
			}
		});


		this.kill ();
		return this.request (url, data);
	});


	/**Delete request
	 * @param {string} url
	 * @param {object} data
	 * @return {object}
	 * */
	Http.add ('delete', function (url, data) {

		//MiddleWare
		MiddleWare.intercept (this, {
			request: function (config, xhr) {
				config.method = 'DELETE';
			}
		});

		this.kill ();
		return this.request (url, data);
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

	/** Kill Http request
	 * @return {object}
	 * */
	Http.add ('kill', function () {
		_.each (this.xhr_list, function (xhr) {
			xhr.abort ();
		});

		this.xhr_list.length = 0;
		return this;
	});

	//Global access
	window.Http = Http;


}) (window);