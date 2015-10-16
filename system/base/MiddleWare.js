/**
 * Created by gmena on 10-13-15.
 */

(function (window) {
	var WARNING_MIDDLEWARE = {
		ERROR: {
			NOTFOUND: 'Interceptor not found'
		}
	};

	"use strict";
	function MiddleWare () {

	}

	/** Intercept signals in object
	 * @param {object} intercepted
	 * @param {function} result
	 * @return {object}
	 * */
	MiddleWare.add ('intercept', function (intercepted, result) {
		return new Promise (function (resolve, reject) {
			if ( 'interceptors' in intercepted ) {

				if ( _.isObject (result) ) {
					_.each (result, function (v, k) {
						//Intercepted has interceptors?
						if ( !(k in intercepted.interceptors) )
							intercepted.interceptors[k] = [];

						//New interceptor
						if ( _.isFunction (v) )
							intercepted.interceptors[k].push (v);

					}, true);

					//Resolve
					resolve (intercepted);
				}

			} else {
				//Not interceptors in intercepted
				reject (WARNING_MIDDLEWARE.ERROR.NOTFOUND)
			}
		})
	});

	/** Find signals in object
	 * @param {object} intercepted
	 * @param {string} find
	 * @return {object}
	 * */
	MiddleWare.add ('getInterceptors', function (intercepted, find) {
		if ( 'interceptors' in intercepted ) {
			if (
				find in intercepted.interceptors
				&& _.isArray (intercepted.interceptors[find])
				&& intercepted.interceptors[find].length > 0
			) {
				return intercepted.interceptors[find];
			}
		}
		return [];
	});

	/** Trigger the interceptors
	 * @param {object} intercepted
	 * @param {string} find
	 * */
	MiddleWare.add ('cleanInterceptor', function (intercepted, find) {
		if ( 'interceptors' in intercepted ) {
			if ( find in intercepted.interceptors ) {
				delete intercepted.interceptors[find];
			}
		}
	});

	/** Trigger the interceptors
	 * @param {object} intercepted
	 * @param {string} find
	 * */
	MiddleWare.add ('trigger', function (intercepted, interceptors) {
		_.each (interceptors, function (v) {
			if ( _.isFunction (v) )
				v (intercepted);
		}, true);
	});

	window.MiddleWare = new MiddleWare;
	window.MiddleWareClass = MiddleWare;
}) (window);