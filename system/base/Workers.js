/**
 * Created by gmena on 07-26-14.
 */


'use strict';
(function (window) {
	function Workers () {
		this.Worker = null;
		this.interceptors = {};
	}


	/** Run worker
	 * @param {string} url
	 * @return {object}
	 * **/
	Workers.add ('run', function (url) {
		var self = this;
		return (new Promise (function (resolve, reject) {
			self.Worker = (new Worker (setting.system_path + url + '.min.js'));
			self.Worker.addEventListener ('message', function (e) {
				//Intercept message
				self._handleInterceptor ('message', e);
			}, false);
			resolve (self);
		}))
	});

	/**Get Worker
	 * @return {object}
	 * **/
	Workers.add ('get', function () {
		return this.Worker;
	});

	/** Interceptors
	 * @param  {object} interceptors
	 * @return {object}
	 * */
	Workers.add ('intercept', function (interceptors) {
		if ( _.isObject (interceptors) )
			MiddleWare.intercept (this, interceptors);
		return this;
	});

	/** Handle the interceptors
	 * @param {string} type
	 * @param {object} param
	 * @return {void}
	 * */
	Workers.add ('_handleInterceptor', function (type, param) {
		//Trigger Interceptors
		MiddleWare.trigger (
			MiddleWare.getInterceptors (this, type),
			[param, this]
		);

		//Clean the interceptor
		MiddleWare.cleanInterceptor (this, type);
	});


	/**Send Message to Worker
	 * @param {string} message
	 * @return {object}
	 * **/
	Workers.add ('toWork', function (message) {
		this.Worker.postMessage (message || null);
		return this;
	});

	/**Kill Worker
	 *@return {object}
	 * **/
	Workers.add ('kill', function () {
		if ( _.isSet (this.Worker) ) {
			this.Worker.terminate ();
			this.Worker = null;
		}

		return this;
	});

	//Global access
	window.Workers = Workers;

}) (window);