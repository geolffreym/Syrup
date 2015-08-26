/**
 * Created by gmena on 07-26-14.
 */


'use strict';

function Workers () {
	this.Worker = null;
	this.onsuccess = null;
}

//Worker event handler
Workers.add ( 'on', function ( event, callback ) {
	var self = this;
	return [
		{
			message: function () {
				self.onsuccess = callback;
			}
		}[ event ] ()
	]
} );

//Set new Worker
Workers.add ( 'set', function ( url, callback ) {
	var self = this;
	self.Worker = (new Worker ( setting.system_path + url + '.min.js' ));
	self.Worker.addEventListener ( 'message', function ( e ) {
		_.callbackAudit ( self.onsuccess, e );
	}, false );
	_.callbackAudit ( callback, self.Worker );

	return this;

} );

//Get Worker
Workers.add ( 'get', function () {
	return this.Worker;
} );

//Send Message to Worker
Workers.add ( 'send', function ( message ) {
	this.Worker.postMessage ( !!message ? message : '' );
} );

//Kill Worker
Workers.add ( 'kill', function ( callback ) {
	if ( _.isSet ( this.Worker ) ) {
		this.Worker.terminate ();
		this.Worker = null;
		_.callbackAudit ( callback );
	}

	return this;
} );
