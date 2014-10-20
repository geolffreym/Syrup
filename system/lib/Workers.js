/**
 * Created by gmena on 07-26-14.
 */


Lib.blend ( 'Workers', [] ).make ( function () {
	return{
		Worker:    null,
		onsuccess: null
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
				_.callbackAudit ( self.onsuccess, e );
			}, false );
			_.callbackAudit ( callback );

		},
		get:  function () {
			return  this.Worker;
		},
		send: function ( message ) {
			this.Worker.postMessage ( !!message ? message : '' );
		},
		kill: function ( callback ) {
			if ( this.Worker ) {
				this.Worker.terminate ();
				this.Worker = null;
				_.callbackAudit ( callback );
			}
		}
	}
} );