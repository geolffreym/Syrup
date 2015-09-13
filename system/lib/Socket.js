/**
 * Created by gmena on 07-26-14.
 * https://www.npmjs.com/package/b_wsserver
 */

"use strict";


//Constructor
function Socket () {
	this.socket = null;
	this.open = null;
	this.close = null;
	this.message = null;
	this.error = null;
	this.protocol = null;
	this.user = null;
	this.admin = null;
	this.host = location.host;
}

//Create a new Socket
Socket.add ('set', function (config) {
	var self = this;

	if ( !config && !(_.isObject (config)) ) {
		_.error (_.WARNING_SYRUP.ERROR.NOOBJECT);
	}

	var user = config.user || 'default',
		port = config.port || 0x1F90,
		query = '?';


	self.host = !!config.host
		? config.host : self.host;
	self.user = user;

	delete config['port'];
	delete config['host'];

	//Parse the config in url to Websocket
	query = query + _.parseJsonUrl (config);

	self.socket = new WebSocket ('ws://' + self.host + ':' + port + query);
	self.socket.addEventListener ('open', function (e) {
		if ( self.open ) {
			self.open (e)
		}
	});
	self.socket.addEventListener ('error', function (e) {
		if ( self.error ) {
			self.error (e)
		}
	});
	self.socket.addEventListener ('close', function (e) {
		if ( self.close ) {
			self.close (e)
		}
	});
	self.socket.addEventListener ('message', function (e) {
		if ( self.message ) {
			self.message (e);
		}
	});
	return self.socket;
});

//Socket Event Handler
Socket.add ('on', function (event, callback) {
	var self = this;
	return [
		{
			message: function () {
				self.message = callback;
			},
			open   : function () {
				self.open = callback;
			},
			close  : function () {
				self.close = callback;
			},
			error  : function () {
				self.error = callback;
			}
		}[event] ()
	]
});


//Socket send message
Socket.add ('send', function (config) {
	var _myconf = {};

	_myconf.all = false;
	_myconf.from = this.user;

	config = _.extend (_myconf, config);

	if ( this.socket ) {
		this.socket.send (JSON.stringify (config));
	}
});


//Kill Socket
Socket.add ('clear', function () {
	this.socket.close ();
});


