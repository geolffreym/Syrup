/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 18/11/13
 * Time: 12:55
 * To change this template use File | Settings | File Templates.
 */

'use strict';
var Geolocation,
	WARNING_GEOLOCATION = {
		ERROR: {
			UNACTIVE: 'Your browser has disabled please select the location for the proper operation of the site.',
			NOLOCATE: 'It is not currently possible to track its location. Please try again.',
			NOWATCH : 'No watch unseted'
		}
	};

Geolocation = function (config) {
	//Variables
	var _proto = this.__proto__;

	//Atributos
	this.onlocation = null;
	this.onerror = null;
	this.location = null;
	this.watch = null;
	this.geolocation = navigator.geolocation;

	this.conf = _.extend ({
		enableHighAccuracy: true,
		timeout           : 0x3E8,
		maximumAge        : 0xEA60
	}, config);

	/** Event Handler
	 * @param event string
	 * @param callback function
	 * @return object
	 * */
	_proto.on = function (event, callback) {
		var self = this;

		return [
			{
				found: function () {
					if ( callback ) {
						self.onlocation = callback;
					}
				},
				error: function () {
					if ( callback ) {
						self.onerror = callback;
					}
				}
			}[event] ()
		]

	};

	/**Location Encontrada
	 * @param u object
	 * @return void
	 * */
	_proto.found = function (u) {
		var self = this;
		self.location = {
			latitude : u.coords.latitude,
			longitude: u.coords.longitude,
			altitude : u.coords.altitude
		};

		if ( self.onlocation ) {
			self.onlocation (self.location);
		}

	};

	/**Location Error
	 * @param e error
	 * @return void
	 * */
	_proto.error = function (e) {
		var self = this,
			_error = {
				1: WARNING_GEOLOCATION.ERROR.UNACTIVE,
				2: WARNING_GEOLOCATION.ERROR.NOLOCATE,
				3: (
					this[2]
				)
			};

		if ( self.onerror ) {
			self.onerror (_error[e.code]);
		}
	};

	/**Obtienela location actual
	 * @return void
	 * */
	_proto.get = function () {
		var self = this;
		self.geolocation.getCurrentPosition (self.found, self.error, self.conf);
	};

	/**Obtienela location actual periodicamente
	 * @return void
	 * */
	_proto.watch = function () {
		var self = this;
		self.watch = self.geolocation.watchPosition (self.found, self.error, self.conf);
	};

	/**Detiene el watch
	 * @return void
	 * */
	_proto.wstop = function () {
		var self = this;
		if ( !self.watch ) {
			self.error (WARNING_GEOLOCATION.ERROR.NOWATCH);
		}
		self.geolocation.clearWatch (self.watch);
	};

};

Syrup.blend (Geolocation);
