/**
 * Created by gmena on 07-26-14.
 */

'use strict';

/**Ajax
 * @constructor
 */

Lib.blend ( 'Ajax', [] ).make ( function () {
	return {
		xhr:      new window.XMLHttpRequest
			|| new window.ActiveXObject ( "Microsoft.XMLHTTP" ),
		xhr_list: [],
		upload:   null,
		before:   null,
		complete: null,
		progress: null,
		state:    null,
		abort:    null,
		error:    null,
		time_out: null
	}
} ).supply ( function () {
	return {
		on: function ( event, callback ) {
			var self = this;
			return [{
				before:   function () {
					self.before = callback;
				},
				complete: function () {
					self.complete = callback;
				},
				error:    function () {
					self.error = callback;
				},
				abort:    function () {
					self.abort = callback;
				},
				state:    function () {
					self.state = callback;
				},
				timeout:  function () {
					self.time_out = callback;
				},
				progress: function () {
					self.progress = callback;
				}
			}[event] ()]

		},

		request: function ( config, callback ) {
			if ( !_.isObject ( config ) ) {
				throw (WARNING_SYRUP.ERROR.NOOBJECT)
			}

			var _self = this,
			    _xhr = _self.xhr,
			    _async = true,
			    _timeout = config.timeout || 4000,
			    _processor = config.processor || setting.ajax_processor || '',
			    _token = config.token || true,
			    _contentType = config.contentType || 'application/x-www-form-urlencoded;charset=utf-8',
			    _data = config.data
				    ? config.data : null,
			    _contentHeader = config.contentHeader ||
				    [
					    {
						    header: 'Content-Type',
						    value:  _contentType
					    }
				    ]
				, _type = config.method || 'GET';

			if ( !_.isSet ( config.url ) ) {
				throw (WARNING_SYRUP.ERROR.NOURL);
			}

			if ( !_.isFormData ( _data )
				&& _.isSet ( _data )
				&& _contentHeader !== 'auto' ) {
				_data = _.parseJsonUrl ( _data );
			}

			if ( _type === 'GET' && _.isSet ( _data ) ) {
				_processor += '?' + _data;
			}

			_processor = config.url + (_processor || '');
			_xhr.open ( _type, _processor, _async );
			_xhr.timeout = _timeout;

			//Setting Headers
			if ( !_.isFormData ( _data ) && _contentHeader !== 'auto' ) {
				_.each ( _contentHeader, function ( v ) {
					_self.requestHeader ( v.header, v.value );
				} )

			}

			//Using Token
			if ( _.isSet ( _token ) )
				_self.requestHeader ( "X-CSRFToken", _.getCookie ( _.isBoolean ( _token ) ? 'csrftoken' : _token ) );

			//If upload needed
			if ( _.isSet ( config.upload ) && _.isBoolean ( config.upload ) ) {
				_self.upload = _self.xhr.upload;
				_xhr = _self.upload;
			}

			//Event Listeners
			_xhr.addEventListener ( 'load', function ( e ) {
				if ( this.status >= 0xC8 && this.status < 0x190 ) {
					var _response = this.response || this.responseText;
					if ( _.isJson ( _response ) ) {
						_response = JSON.parse ( _response );
					}
					_.callbackAudit ( callback, _response, e );

				}
			} );

			_xhr.addEventListener ( 'progress', function ( e ) {
				if ( _self.progress ) {
					_self.progress ( e );
				}
			}, false );

			_xhr.addEventListener ( 'readystatechange', function ( e ) {
				if ( this.readyState ) {
					if ( !!_self.state ) {
						_self.state ( this.readyState, e );
					}
				}
			} );

			_xhr.addEventListener ( 'abort', function ( e ) {
				if ( !!_self.abort ) {
					_self.abort ( e );
				}
			} );

			_xhr.addEventListener ( 'timeout', function ( e ) {
				if ( !!_self.time_out ) {
					_self.time_out ( e );
				}
			} );

			_xhr.addEventListener ( 'loadend', function ( e ) {
				if ( !!_self.complete ) {
					_self.complete ( e );
				}
			} );

			_xhr.addEventListener ( 'loadstart', function ( e ) {
				if ( !!_self.before ) {
					_self.before ( e );
				}
			} );

			_xhr.addEventListener ( 'error', function ( e ) {
				if ( !!_self.error ) {
					_self.error ( e );
				}
			} );


			//Send
			_self.xhr_list.push ( _self.xhr );
			_xhr.send ( _type !== 'GET' ? _data : null );

			return _self.xhr;
		},

		requestHeader: function ( header, type ) {
			this.xhr.setRequestHeader ( header, type );
		},

		kill: function () {
			var i = this.xhr_list.length;
			while ( i-- ) {
				if ( !!this.xhr_list[i] )
					this.xhr_list[i].abort ();
			}
			this.xhr_list.length = 0;
		}
	}

} );

