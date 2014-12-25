/**
 * Created by gmena on 07-26-14.
 */


Lib.blend ( 'Socket', [] ).make ( function () {
	return {
		socket:   null,
		open:     null,
		close:    null,
		message:  null,
		error:    null,
		protocol: null,
		user:     null,
		admin:    null,
		host:     window.location.host

	}
} ).supply ( function () {
	return {
		set:   function ( config ) {
			var self = this;

			if ( !config && !(_.isObject ( config )) ) {
				throw (WARNING_SYRUP.ERROR.NOOBJECT);
			}

			var protocol = !!config.protocol ? config.protocol : false,
			    user = !!config.user ? config.user : false,
			    port = !!config.port ? config.port : 0x1F90,
			    admin = !!config.admin ? config.admin : 'default';

			self.user = user;
			self.protocol = protocol;
			self.admin = admin;

			if ( !!protocol && !!user ) {
				var _query = '?protocol=' + protocol + '&user=' + user + '&admin=' + admin;
				self.socket = new WebSocket ( 'ws://' + self.host + ':' + port + _query );
				self.socket.addEventListener ( 'open', function ( e ) {
					if ( self.open ) {
						self.open ( e )
					}
				} );
				self.socket.addEventListener ( 'error', function ( e ) {
					if ( self.error ) {
						self.error ( e )
					}
				} );
				self.socket.addEventListener ( 'close', function ( e ) {
					if ( self.close ) {
						self.close ( e )
					}
				} );
				self.socket.addEventListener ( 'message', function ( e ) {
					if ( self.message ) {
						self.message ( e );
					}
				} );
				return self.socket;
			} else {
				return false;
			}

		},
		on:    function ( event, callback ) {
			var self = this;
			return [{
				message: function () {
					self.message = callback;
				},
				open:    function () {
					self.open = callback;
				},
				close:   function () {
					self.close = callback;
				},
				error:   function () {
					self.error = callback;
				}
			}[event] ()]
		},
		send:  function ( config ) {
			var _myconf = {};

			_myconf.all = false;
			_myconf.protocol = this.protocol;
			_myconf.from = this.user;
			_myconf.admin = this.admin;

			config = _.extend ( _myconf, config );


			if ( !config.protocol ) {
				throw (WARNING_SYRUP.ERROR.NOPROTOCOL);
			}

			if ( this.socket ) {
				this.socket.send ( JSON.stringify ( config ) );
			}
		},
		clear: function () {
			this.socket = null;

		},
		get:   function ( name ) {
			return this.socket;

		},
		stop:  function () {
			this.socket.close ();

		}
	}

} );