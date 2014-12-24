/**
 * Created by gmena on 07-26-14.
 */


Lib.blend ( 'Socket', [] ).make ( function () {
	return {
		socket:   {},
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
				self.socket[protocol] = new WebSocket ( 'ws://' + self.host + ':' + port + _query );
				self.socket[protocol].addEventListener ( 'open', function ( e ) {
					if ( self.open[protocol] ) {
						self.open[protocol] ( e )
					}
				} );
				self.socket[protocol].addEventListener ( 'error', function ( e ) {
					if ( self.error[protocol] ) {
						self.error[protocol] ( e )
					}
				} );
				self.socket[protocol].addEventListener ( 'close', function ( e ) {
					if ( self.close[protocol] ) {
						self.close[protocol] ( e )
					}
				} );
				self.socket[protocol].addEventListener ( 'message', function ( e ) {
					if ( self.message[protocol] ) {
						self.message[protocol] ( e );
					}
				} );
				return self.socket[protocol];
			} else {
				return false;
			}

		},
		on:    function ( event, callback ) {
			var self = this;
			return [{
				message: function () {
					self.message[self.protocol] = callback;
				},
				open:    function () {
					self.open[self.protocol] = callback;
				},
				close:   function () {
					self.close[self.protocol] = callback;
				},
				error:   function () {
					self.error[self.protocol] = callback;
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

			if ( this.socket[self.protocol] ) {
				this.socket[self.protocol].send ( JSON.stringify ( config ) );
			}
		},
		clear: function ( name ) {
			this.socket[name] = null;

		},
		get:   function ( name ) {
			return this.socket[name];

		},
		stop:  function ( name ) {
			this.socket[name].close ();

		}
	}

} );