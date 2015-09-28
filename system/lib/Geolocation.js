/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 18/11/13
 * Time: 12:55
 * To change this template use File | Settings | File Templates.
 */

'use strict';
var WARNING_GEOLOCATION = {
	ERROR: {
		UNACTIVE: 'Your browser has disabled please select the location for the proper operation of the site.',
		NOLOCATE: 'It is not currently possible to track its location. Please try again.',
		NOWATCH : 'No watching location, can\'t stop it'
	}
};


function Geolocation () {
	this.location = null;
	this.watch = false;
	this.geolocation = window.navigator.geolocation;
	this.conf = {
		enableHighAccuracy: true,
		timeout           : 0x3E8,
		maximumAge        : 0xEA60
	}
}

/**Set the initial conf
 * @param {object} config
 * @return {object}
 * */
Geolocation.add ('set', function (config) {
	this.conf = _.extend (
		this.conf,
		config,
		true
	);
});

/**Get the location
 * @param {boolean} watch
 * @return {object}
 * */
Geolocation.add ('get', function (watch) {
	var _self = this,
		_whatToDo = watch && _self.geolocation.watchPosition
					|| _self.geolocation.getCurrentPosition;

	//Watching?
	_self.watch = watch;

	return (new Promise (function (resolve, reject) {
		_whatToDo (function (u) {
			_self.location = {
				latitude : u.coords.latitude,
				longitude: u.coords.longitude,
				altitude : u.coords.altitude
			};

			//Working, then resolve
			resolve (_self.location);

		}, function (e) {
			var _error = {
				1: WARNING_GEOLOCATION.ERROR.UNACTIVE,
				2: WARNING_GEOLOCATION.ERROR.NOLOCATE,
				3: (
					this[2]
				)
			};
			//Error, then reject
			reject (_error[e.code])
		}, _self.conf);
	}));

});

/**Stop watching
 * @return {void}
 * */
Geolocation.add ('watchStop', function () {
	var self = this;
	if ( !self.watch ) {
		_.error (WARNING_GEOLOCATION.ERROR.NOWATCH, '(Geolocation .watchStop)');
	}
	self.geolocation.clearWatch (self.watch);
});
