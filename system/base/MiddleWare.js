/**
 * Created by gmena on 10-13-15.
 */

(function (window) {
	"use strict";
	function MiddleWare () {

	}

	MiddleWare.add ('intercept', function (intercepted, result) {
		if ( 'interceptors' in intercepted ) {
			if ( _.isFunction (result) ) {
				var _interceptor = result (intercepted),
					_clean_by_key = [];

				if ( _.isObject (_interceptor) ) {
					_.each (_interceptor, function (t, v) {
						console.log (v)
					}, true)
				}


				//intercepted.interceptors.push (_interceptor);
			}
		}
	});

	window.MiddleWare = new MiddleWare;
	window.MiddleWareClass = MiddleWare;
}) (window);