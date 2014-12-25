/**
 * Created by gmena on 07-26-14.
 */


Lib.blend ( 'Workers', [] ).make ( function () {
	return {
		Worker:    {},
		onsuccess: {}
	}
} ).supply ( function () {
	return {
		on:   function ( event, callback ) {
			var self = this;
			return [{
				message: function () {
					self.onsuccess = callback;
				}
			}[event] ()]
		},
		set:  function ( url, callback ) {
			var self = this;
			self.Worker = (new Worker ( setting.app_path + url + '.min.js' ));
			self.Worker.addEventListener ( 'message', function ( e ) {
				_.callbackAudit ( self.onsuccess[name], e );
			}, false );
			_.callbackAudit ( callback, self.Worker );

		},
		get:  function () {
			return  this.Worker;
		},
		send: function ( message ) {
			self.Worker.postMessage ( !!message ? message : '' );
		},
		kill: function ( name, callback ) {
			if ( _.isSet ( this.Worker[name] ) ) {
				this.Worker.terminate ();
				this.Worker = null;
				_.callbackAudit ( callback );
			}
		}
	}
} );