/**
 * Created by gmena on 07-26-14.
 */


"use strict";

/**Dependencies
 * Ajax Lib
 * SocketLib
 * */


function Shortcuts () {
	this.Ajax = new Ajax;
	this.Socket = new Socket;
}

//Simple Ajax Get
Shortcuts.add ( 'ajaxGet', function ( url, data, callback ) {
	var _conf = {
		url: !!url ? url : '#',
		processData: true,
		data: !!data ? data : null
	};

	this.Ajax.kill ();
	this.Ajax.request ( _conf, callback );
} );

//Simple Ajax Post
Shortcuts.add ( 'ajaxPost', function ( url, data, callback ) {
	var _conf = {
		url: !!url ? url : '#',
		data: !!data ? data : null,
		method: 'POST'
	};

	this.Ajax.kill ();
	this.Ajax.request ( _conf, callback );
} );

//Simple Socket Send
Shortcuts.add ( 'socketSend', function ( send ) {
	var _self = this,
	    _conf = {
		    user: _.getEncodedId ( 8 )
	    };

	send = _.extend ( _conf, send );
	_self.Socket.set ( send );

	if ( !!send ) {
		_self.Socket.on ( 'open', function () {
			_self.Socket.send ( send );
			_self.Socket.clear ( _conf.protocol );
		} )
	}

} );

//Simple Socket Listen
Shortcuts.add ( 'socketListen', function ( conf, callback ) {
	var _self = this,
	    _conf = {
		    user: _.getEncodedId ( 8 )
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

} );
