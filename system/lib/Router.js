/**
 * Created by gmena on 07-26-14.
 */

'use strict';
/**Router
 * @constructor
 */
function Router () {
	this.routes = {}
}


/**Set the routes
 * @param routes
 * @return object
 * */
Router.add ('setRoutes', function (routes) {
	var _self = this;
	return (new Promise (function (resolve, reject) {
		_self.routes = routes;
	}))
});

/**Delega rutas
 * @param path
 * @param callback
 * @returns {boolean}
 */
Router.add ('route', function (path) {
	_.assert (path, WARNING_SYRUP.ERROR.NOPARAM);

	return (new Promise (function (resolve, reject) {

		var _location = window.location.pathname,
			_result = _.isArray (path)
				? _.matchInArray (_location, path)
				: new RegExp (path, 'g').test (_location);

		if ( !_result ) {
			reject (false);
			return;
		}

		resolve (_result);
	}));

});

Router.add ('parseQueryString', function () {

});