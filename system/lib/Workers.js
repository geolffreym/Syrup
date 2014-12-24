/**
 * Created by gmena on 07-26-14.
 */


Lib.blend ( 'Workers', [] ).make ( function () {
	return {
		Worker:    {},
		WorkerName:      null,
		onsuccess: {}
	}
} ).supply ( function () {
	return {
		on:   function ( event, callback ) {
			var self = this;
			return [{
				message: function () {
					self.onsuccess[self.WorkerName] = callback;
				}
			}[event] ()]
		},
		set:  function ( name, url, callback ) {
			var self = this;
			self.WorkerName = name;
			self.Worker[name] = (new Worker ( setting.app_path + url + '.min.js' ));
			self.Worker[name].addEventListener ( 'message', function ( e ) {
				_.callbackAudit ( self.onsuccess[name], e );
			}, false );
			_.callbackAudit ( callback, self.Worker[name] );

		},
		get:  function ( name ) {
			return  this.Worker[name];
		},
		send: function ( message ) {
			self.Worker[self.WorkerName].postMessage ( !!message ? message : '' );
		},
		kill: function ( name, callback ) {
			if ( _.isSet ( this.Worker[name] ) ) {
				this.Worker[name].terminate ();
				this.Worker[name] = null;
				_.callbackAudit ( callback );
			}
		}
	}
} );