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
		_self.routes = _.extend (_self.routes, routes);
		resolve (_self.routes);
	}))
});

/**Delega rutas
 * @param path
 * @param callback
 * @returns {boolean}
 */
Router.add ('route', function (route_name) {
	_.assert (route_name, WARNING_SYRUP.ERROR.NOPARAM);
	var _self = this;
	return (new Promise (function (resolve, reject) {

		//Not routing
		if ( !(route_name in _self.routes) )
			reject (route_name);


	}));

});

Router.add ('parseQueryString', function () {

});