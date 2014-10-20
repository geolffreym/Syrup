/**
 * Created by gmena on 07-26-14.
 */

Lib.blend ( 'Shortcuts', ['Ajax', 'Socket'] ).supply ( function () {
	return {
		ajaxGet:      function ( url, data, callback ) {
			var _conf = {
				url: !!url ? url : '#',
				processData: true,
				data: !!data ? data : null
			};

			this.Ajax.kill ();
			this.Ajax.request ( _conf, callback );
		},
		ajaxPost:     function ( url, data, callback ) {
			var _conf = {
				url: !!url ? url : '#',
				data: !!data ? data : null,
				method: 'POST'
			};

			this.Ajax.kill ();
			this.Ajax.request ( _conf, callback );
		},
		socketSend:   function ( send ) {
			var _self = this,
			    _conf = {
				    user:     _.getEncodedId ( 8 ),
				    protocol: 'update',
				    admin:    'default'
			    };

			send = _.extend ( _conf, send );
			_self.Socket.set ( send );
			if ( !!send ) {
				_self.Socket.on ( 'open', function () {
					_self.Socket.send ( send );
				} )
			}

		},
		socketListen: function ( conf, callback ) {
			var _self = this,
			    _conf = {
				    user:     _.getEncodedId ( 8 ),
				    protocol: 'update',
				    admin:    'default'
			    };

			if ( _.isFunction ( conf ) ) {
				callback = conf;
				conf = {};
			}

			_conf = _.extend ( _conf, conf );
			_self.Socket.set ( _conf );
			if ( !!conf ) {
				_self.Socket.on ( 'message', function ( msg ) {
					_.callbackAudit ( callback, JSON.parse ( msg.data ) );
				} );
			}

		}
	}

} );
