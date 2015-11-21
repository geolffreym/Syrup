/**
 * Created by gmena on 10-13-15.
 */

(function (window) {
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
			if ( !( 'interceptors' in intercepted ) )
				intercepted['interceptors'] = {};

			if ( _.isObject (result) ) {
				_.each (result, function (v, k) {
					//Intercepted has interceptors?
					if ( !(k in intercepted.interceptors) )
						intercepted.interceptors[k] = [];

					//New interceptor
					if ( _.isFunction (v) )
						intercepted.interceptors[k].push (v);

				});

				//Resolve
				resolve (intercepted);
			}


		})
	});

	/** Extend interceptors!!
	 * @param {object} intercepted
	 * @param {string} to
	 * @param {array} extend
	 * @return {object}
	 * */
	MiddleWare.add ('extend', function (intercepted, to, extend) {

		//Not interceptors?
		if ( !( 'interceptors' in intercepted[to] ) )
			intercepted[to]['interceptors'] = {};

		//For each extension!!
		_.each (extend, function (v) {
			//v in intercepted?
			//v is not the same as target?
			if ( v !== to && v in intercepted ) {
				if ( 'interceptors' in intercepted[v] ) {
					_.each (intercepted[v].interceptors, function (r, i) {
						if ( !(i in intercepted[to].interceptors) )
							intercepted[to].interceptors[i] = [];

						//Extend interceptors
						intercepted[to].interceptors[i] = _.extend (
							intercepted[to].interceptors[i], r
						)
					})
				}
			}
		});

	});

	/** Find signals in object
	 * @param {object} intercepted
	 * @param {string} find
	 * @return {object}
	 * */
	MiddleWare.add ('getInterceptors', function (intercepted, find) {
		if ( intercepted && 'interceptors' in intercepted ) {
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
		if ( intercepted && 'interceptors' in intercepted ) {
			if ( find in intercepted.interceptors ) {
				delete intercepted.interceptors[find];
			}
		}
	});

	/** Trigger the interceptors
	 * @param {object} intercepted
	 * @param {string} find
	 * */
	MiddleWare.add ('trigger', function (interceptors, params) {
		if ( _.isArray (interceptors) && interceptors.length > 0 )
			_.each (interceptors, function (v) {
				if ( _.isFunction (v) )
					v.apply (null, params || []);
			});
	});

	window.MiddleWare = new MiddleWare;
	window.MiddleWareClass = MiddleWare;

}) (window);