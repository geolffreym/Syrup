/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey Mena
 * Date: 18/11/13
 * Time: 12:55
 * To change this template use File | Settings | File Templates.
 */

'use strict';
var GoogleMap,
    WARNING_GOOGLE_MAP = {
	    ERROR: {
		    NOLOCATION:  'No coordinates seted.',
		    NOMAP:       'No map seted.',
		    NOCONTAINER: 'No map container seted.',
		    NOCONFIG:    'The configuration object is necessary.',
		    NOROUTES:    'No mapped routes',
		    NODISTANCE:  'You need the source and target to measure the distance.'

	    }
    };

GoogleMap = function () {
	var _proto = this.__proto__ || GoogleMap.prototype,
	    _self = this || _proto;

	/**Atributos*/
	_self.markersCollection = [];
	_self.coordsCollection = [];
	_self.routesCollection = [];
	_self.infoLabels = [];
	_self.distanceCollection = {};
	_self.container = null;
	_self.mapa = null;
	_self.position = null;
	_self.mapType = 'roadmap';
	_self.travelType = 'DRIVING';
	_self.marker = null;
	_self.ruta = null;
	_self.mapObject = google.maps;
	_self.infoWindow = null;
	_self.animationType = _self.mapObject.Animation.DROP;
	_self.geocoder = new _self.mapObject.Geocoder ();
	_self.distance = new _self.mapObject.DistanceMatrixService ();

	/**Map Config
	 * @param map
	 */
	_proto.setMapType = function ( map ) {
		var self = this;
		self.mapType = [{
			road:      self.mapObject.MapTypeId.ROADMAP,
			satellite: self.mapObject.MapTypeId.SATELLITE,
			hybrid:    self.mapObject.MapTypeId.HYBRID,
			terrain:   self.mapObject.MapTypeId.TERRAIN
		}[map]].toString () || self.mapType;
	};

	/**Set Container of Map
	 * @param container DOM
	 */
	_proto.setMapContainer = function ( container ) {
		if ( _.is$ ( container ) )
			container = container.object ();
		this.container = container;
	};

	//Return Map Position
	_proto.getMapPosition = function () {
		return this.position;
	};

	/**Parse event object google.maps.event to coordinates
	 *  @param e object Event Class
	 * */
	_proto.parseLatLngEvent = function ( e ) {
		if ( e.latLng ) {
			return {
				latitude:  e.latLng.lat (),
				longitude: e.latLng.lng ()
			}
		}
		return null;
	};

	//Return Map
	_proto.getMap = function () {
		return this.mapa;
	};

	//Return coords Collection
	_proto.getCoords = function () {
		return this.coordsCollection;
	};

	//Clean Coords
	_proto.cleanCoords = function () {
		this.coordsCollection = [];
	};

	//Return the center point of a coords collection
	_proto.getCoordsCenterPoint = function () {
		var coords = this.coordsCollection,
		    x = 0.0,
		    y = 0.0,
		    z = 0.0,
		    lat = 0,
		    long = 0;

		_.each ( coords, function ( v ) {
			lat = (v.lat () * Math.PI) / 180;
			long = (v.lng () * Math.PI) / 180;

			x += (Math.cos ( lat ) * Math.cos ( long ));
			y += (Math.cos ( lat ) * Math.sin ( long ));
			z += (Math.sin ( lat ));

		} );

		x /= coords.length;
		y /= coords.length;
		z /= coords.length;

		long = Math.atan2 ( y, x );
		lat = Math.atan2 ( z, Math.sqrt ( x * x + y * y ) );

		return {
			latitude:  lat * 180 / Math.PI,
			longitude: long * 180 / Math.PI
		}

	};


	/**Append a coord to collection
	 * @param ltnLgn LatLng Class
	 * */
	_proto.appendCoord = function ( ltnLgn ) {
		this.coordsCollection.push ( ltnLgn );
	};

	/**Event Handler
	 * @param elem Marker Class | Map Class
	 * @param event
	 * @param callback
	 * */
	_proto.on = function ( elem, event, callback ) {
		if ( _.isString ( elem ) ) {
			callback = event;
			event = elem;
			if ( _.isSet ( this.mapa ) )
				elem = this.mapa;
		}

		if ( !_.isFunction ( callback ) )
			_.error ( WARNING_SYRUP.ERROR.NOFUNCTION );

		if ( !_.isObject ( elem ) )
			_.error ( WARNING_GOOGLE_MAP.ERROR.NOMAP );

		_self.mapObject.event.addListener ( elem, event, callback );
	};

	/** Make a google map position with coords latitude, longitude
	 * @param latLong object {latitude:int, longitude:int}
	 * */
	_proto.makePosition = function ( latLong ) {

		if ( !_.isObject ( latLong ) ) {
			_.error ( WARNING_GOOGLE_MAP.ERROR.NOCONFIG );
		}

		return new this.mapObject.LatLng (
			latLong.latitude,
			latLong.longitude
		);
	};

	/**Set Map Position
	 * @param latLong object {latitude:int, longitude:int}
	 */
	_proto.setMapPosition = function ( latLong ) {
		if ( !_.isObject ( latLong ) ) {
			_.error ( WARNING_GOOGLE_MAP.ERROR.NOCONFIG );
		}
		this.position = this.makePosition ( latLong );
	};

	/**Change Map Position
	 * @param latLong object {latitude:int, longitude:int}
	 */
	_proto.changeMapPosition = function ( latLong ) {
		var self = this;
		if ( !_.isObject ( latLong ) ) {
			_.error ( WARNING_GOOGLE_MAP.ERROR.NOCONFIG );
		}

		if ( !self.mapa ) {
			_.error ( WARNING_GOOGLE_MAP.ERROR.NOMAP );
		}

		self.setMapPosition ( latLong );
		self.mapa.setCenter ( self.position );
	};

	/**Create a new map object
	 * @param config object
	 * @param callback function
	 */
	_proto.createMap = function ( config, callback ) {
		var self = this;
		if ( !self.position ) {
			_.error ( WARNING_GOOGLE_MAP.ERROR.NOLOCATION );
		}

		if ( !self.container ) {
			_.error ( WARNING_GOOGLE_MAP.ERROR.NOCONTAINER );
		}

		var mapOptionsDefault = {
			zoom:      10,
			center:    self.position,
			mapTypeId: self.mapType
		}, options;

		if ( !_.isFunction ( config ) ) {
			options = _.extend ( config, mapOptionsDefault );
		} else {
			options = mapOptionsDefault;
			callback = arguments[0];
		}

		self.mapa = new self.mapObject.Map ( self.container, options );
		_.callbackAudit ( callback, self.mapa );
	};


	/**Markers Create
	 * https://developers.google.com/maps/documentation/javascript/3.exp/reference?hl=es#Marker
	 * @param position object {latitude:int, longitude:int}
	 * @param config object
	 * @returns object
	 */
	_proto.setMarker = function ( position, config ) {

		if ( !this.mapa )
			_.error ( WARNING_GOOGLE_MAP.ERROR.NOMAP );

		if ( !_.isObject ( config ) )
			config = {};

		if ( position && _.isObject ( position ) ) {
			this.setMapPosition ( position );
		} else {
			if ( !this.position ) {
				_.error ( WARNING_GOOGLE_MAP.ERROR.NOLOCATION );
			}
		}

		var conf = _.extend ( {position: this.position, map: this.mapa}, config );

		this.marker = new this.mapObject.Marker ( conf );
		this.marker.setAnimation ( this.animationType );

		this.markersCollection.push ( this.marker );
		this.coordsCollection.push ( this.position );

		return this.marker;
	};


	/** Set Marker ANimation Type
	 *  @param animation string fall|infinitejump
	 * */
	_proto.setMarkerAnimationType = function ( animation ) {
		var self = this;
		self.animationType = [{
			fall:         self.mapObject.Animation.DROP,
			infinitejump: self.mapObject.Animation.BOUNCE
		}[animation]].toString () || self.animationType;
	};

	//Stop Marker Animation
	_proto.stopMarkerAnimation = function () {
		this.marker.setAnimation ( null );
	};

	/**Show all Markers
	 *  @param map object Map Class
	 * */
	_proto.showAllMarkers = function ( map ) {
		_.each ( this.markersCollection, function ( v ) {
			v.setMap ( map );
		} );
	};

	_proto.clearMarkers = function () {
		this.showAllMarkers ( null );
	};

	_proto.deleteMarkers = function () {
		this.markersCollection = [];
	};

	_proto.getMarkers = function () {
		return this.markersCollection;
	};

	/**Create a info label in marker
	 * https://developers.google.com/maps/documentation/javascript/reference?hl=es#InfoWindowOptions
	 * @param content string
	 * @param marker object Marker Class
	 * @param config object
	 * */
	_proto.setMarkerInfo = function ( content, marker, config ) {
		var self = this;
		config = _.extend ( {content: content}, config );

		var info = this.createInfoLabel ( content, config );
		info.open ( self.mapa, marker );

		return info;
	};

	/**Create a info label in map
	 * https://developers.google.com/maps/documentation/javascript/reference?hl=es#InfoWindow
	 * @param content string
	 * @param config object
	 * */
	_proto.createInfoLabel = function ( content, config ) {
		var self = this;
		config = _.extend ( {content: content}, config );

		self.infoWindow = new self.mapObject.InfoWindow ( config );
		self.infoLabels.push ( self.infoWindow );
		return self.infoWindow;
	};

	//Clear all info labels
	_proto.clearInfoLabels = function () {
		_.each ( this.infoLabels, function ( v ) {
			v.close ();
		} )
	};

	//Clear actual Info Label
	_proto.clearInfoLabel = function () {
		self.infoWindow.close ()
	};

	_proto.geoCodeRequest = function ( object, callback ) {
		this.geocoder.geocode ( object, callback );
	};

	/**Location String Info
	 * @param position
	 * @param callback
	 */
	_proto.getLocationInfo = function ( position, callback ) {
		var self = this;
		if ( _.isSet ( position ) && _.isObject ( position ) ) {
			self.setMapPosition ( position );
		} else {
			if ( !_.isSet ( self.position ) ) {
				self.error ( WARNING_GOOGLE_MAP.ERROR.NOLOCATION );
			}

			if ( _.isFunction ( position ) ) {
				callback = arguments[0];
			}
		}

		this.geoCodeRequest ( {'latLng': self.position}, function ( result, status ) {
			if ( status === self.mapObject.GeocoderStatus.OK ) {
				_.callbackAudit ( callback, {
					street: _.isSet ( result[0].address_components[0] )
						? result[0].address_components[0].long_name : null,
					city: _.isSet ( result[0].address_components[1] )
						? result[0].address_components[1].long_name : null,
					state: _.isSet ( result[0].address_components[2] )
						? result[0].address_components[2].long_name : null,
					country: _.isSet ( result[0].address_components[3] )
						? result[0].address_components[3].long_name : null

				} );
			}
		} );

	};

	/**Return Lat, Long from string position
	 * @param query
	 * @param callback
	 */
	_proto.getLocationBySearch = function ( query, callback ) {
		this.geoCodeRequest ( {'address': query}, function ( results, status ) {
			if ( status == google.maps.GeocoderStatus.OK ) {
				var data = results[0].geometry.location;
				_.callbackAudit ( callback, {
					latitude:  data.lat (),
					longitude: data.lng (),
					altitude:  0
				} );
			}
		} );
	};

	/**Rutas*/
	_proto.drawRoute = function ( config, callback ) {
		var self = this;
		if ( self.coordsCollection.length == 0 ) {
			self.error ( WARNING_GOOGLE_MAP.ERROR.NOROUTES );
		}

		if ( _.isFunction ( config ) ) {
			callback = arguments[0];
		}

		var _Conf = _.extend ( {
			                       path:          self.coordsCollection,
			                       geodesic:      true,
			                       strokeColor:   '#FF0000',
			                       strokeOpacity: 1.0,
			                       strokeWeight:  2
		                       }, config, true );

		self.ruta = new self.mapObject.Polyline ( _Conf );

		self.ruta.setMap ( self.mapa );
		self.appendRoute ( self.ruta );
		_.callbackAudit ( callback, self.ruta );
	};

	/**Append Route
	 * @param route PoliLyne Class
	 * */
	_proto.appendRoute = function ( route ) {
		this.routesCollection.push ( route );
	};

	_proto.getRoutes = function () {
		return this.routesCollection;
	};

	_proto.clearRoutes = function () {
		_.each ( this.routesCollection, function ( v ) {
			v.setMap ( null );
		} );
	};

	_proto.deleteRoutes = function () {
		this.routesCollection = [];
	};

	/**Distances*/
	_proto.setTravelMode = function ( type ) {
		var self = this;
		self.travelType = [{
			'drive': self.mapObject.TravelMode.DRIVING,
			'walk':  self.mapObject.TravelMode.WALKING,
			'bike':  self.mapObject.TravelMode.BICYCLING,
			'bus':   self.mapObject.TravelMode.TRANSIT
		}[type]] || self.travelType;
	};

	_proto.packDistances = function ( object ) {
		var self = this,
		    _destination = object.destinationAddresses,
		    _origin = object.originAddresses,
		    _distance = object.rows;

		for ( var i in _destination ) {
			self.distanceCollection[i] = {};
			for ( var j in _origin ) {
				if ( _destination[i] != _origin[j] ) {
					if ( _distance[i].elements[j].status == 'OK' ) {
						self.distanceCollection[i][j] = {};
						self.distanceCollection[i][j]['from'] = _destination[i];
						self.distanceCollection[i][j]['destiny'] = _origin[j];
						self.distanceCollection[i][j]['distance'] = _distance[i].elements[j].distance.text;
						self.distanceCollection[i][j]['time'] = _distance[i].elements[j].duration.text
					} else {
						self.distanceCollection[i] = false;
					}
				}
			}
		}
		return self.distanceCollection;
	};

	/**Get the distance of a collection of routes
	 *  @param routes | routes object LatLng Class Collection
	 *  @param config
	 *  @param callback
	 * */
	_proto.getDistance = function ( routes, config, callback ) {
		var self = this;
		if ( !routes || _.isObject ( routes ) ) {
			self.error ( WARNING_GOOGLE_MAP.ERROR.NODISTANCE );
		}

		if ( _.isFunction ( config ) ) {
			callback = arguments[1];
		}

		var _Conf = _.extend ( {
			                       origins:      routes,
			                       destinations: routes,
			                       travelMode:   self.travelType
		                       }, config ), _Distances = false;

		self.distance.getDistanceMatrix ( _Conf, function ( result, status ) {
			if ( status == 'OK' ) {
				_Distances = self.packDistances ( result );
			}

			if ( callback ) {
				callback ( _Distances );
			}
		} );

	}

};
