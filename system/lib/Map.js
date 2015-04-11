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
	_self.distanceCollection = {};
	_self.container = null;
	_self.mapa = null;
	_self.position = null;
	_self.mapType = 'roadmap';
	_self.animationType = 1;
	_self.travelType = 'DRIVING';
	_self.marker = null;
	_self.ruta = null;
	_self.mapObject = google.maps;
	_self.infoWindow = null;
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
	 * @param container
	 */
	_proto.setMapContainer = function ( container ) {
		if ( _.is$ ( container ) )
			container = container.object ()
		this.container = container;
	};

	//Return Map Position
	_proto.getMapPosition = function () {
		return this.position;
	};

	//Return Map
	_proto.getMap = function () {
		return this.mapa;
	};

	/**Event Handler
	 * @param elem Marker | Map | GoogleMapObject
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
            _.error(WARNING_GOOGLE_MAP.ERROR.NOMAP);

		_self.mapObject.event.addListener ( elem, event, callback );
	};

	/**Set Map Position
	 * @param latLong
	 */
	_proto.setMapPosition = function ( latLong ) {
		var self = this;
		if ( !_.isObject ( latLong ) ) {
			_.error ( WARNING_GOOGLE_MAP.ERROR.NOCONFIG );
		}
		self.position = new self.mapObject.LatLng (
			latLong.latitude,
			latLong.longitude
		);
	};

	/**Change Map Position
	 * @param latLong
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
	 * @param config
	 * @param callback
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
	 * @param position
	 * @param config
	 * @returns {}
	 */
    _proto.setMarker = function (position, config) {
        var self = this,
            conf = {
                position: self.position,
                map: self.mapa
            };

        if (!self.mapa)
            _.error(WARNING_GOOGLE_MAP.ERROR.NOMAP);

        if(!_.isObject(config))
            _.error(WARNING_SYRUP.ERROR.NOOBJECT);

        if (position && _.isObject(position)) {
            _self.setMapPosition(position);
        } else {
            if (!self.position) {
                _.error(WARNING_GOOGLE_MAP.ERROR.NOLOCATION);
            }
        }

        conf = _.extend(conf, config);

        self.marker = new self.mapObject.Marker(conf);
        self.marker.setAnimation(self.animationType);

        self.markersCollection.push(self.marker);
        self.coordsCollection.push(self.position);
        return self.marker;
    };


	_proto.setMarkerAnimationType = function ( animation ) {
		var self = this;
		self.animationType = [{
			fall:         self.mapObject.Animation.DROP,
			infinitejump: self.mapObject.Animation.BOUNCE
		}[animation]].toString () || self.animationType;
	};

	_proto.stopMarkerAnimation = function () {
		this.marker.setAnimation ( null );
	};

	_proto.showAllMarkers = function ( map ) {
		var x = this.markersCollection.length;
		while ( x-- ) {
			this.markersCollection[x].setMap ( map );
		}
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

	_proto.setMarkerInfo = function ( content, marker, config ) {
		var self = this;
		content = content
			? content : '';

		config = _.extend ( {content: content}, config );
		self.infoWindow = new self.mapObject.InfoWindow ( config );
		self.infoWindow.open ( self.mapa, marker );
		return self.infoWindow;
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
			self.position = position;
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
		self.routesCollection.push ( self.ruta );
		self.ruta.setMap ( self.mapa );

		_.callbackAudit ( callback, self.ruta );
	};

	_proto.showAllRoutes = function ( map ) {
		var x = this.routesCollection.length;
		while ( x-- ) {
			this.routesCollection[x].setMap ( map )
		}
	};

	_proto.getRoutes = function () {
		return this.routesCollection;
	};

	_proto.clearRoutes = function () {
		this.showAllRoutes ( null );
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
						self.distanceCollection[i][j]['origen'] = _destination[i];
						self.distanceCollection[i][j]['destino'] = _origin[j];
						self.distanceCollection[i][j]['distancia'] = _distance[i].elements[j].distance.text;
						self.distanceCollection[i][j]['tiempo'] = _distance[i].elements[j].duration.text
					} else {
						self.distanceCollection[i] = false;
					}
				}
			}
		}
		return self.distanceCollection;
	};

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

Syrup.blend ( GoogleMap );
