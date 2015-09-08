/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 11/12/13
 * Time: 12:25
 * To change this template use File | Settings | File Templates.
 */

'use strict';
var Upload,
	WARNING_UPLOAD_FILE = {
		ERROR: {
			NOURL : 'Url needed.',
			NOPACK: 'Files pack needed.'
		}
	};

Upload = function () {
	var _ajax = new Http,
		_proto = this.__proto__;


	this.url = null;
	this.formData = null;
	this.complete = null;
	this.progress = null;
	this.error = null;
	this.abort = null;


	_proto.action = function ( url ) {
		this.url = url;
	};

	_proto.pack = function ( file, callback ) {
		var self = this,
			_formData = new FormData (),
			_files = [],
			_campo = !!_.isString ( file )
				? document.querySelector ( file ) : file;

		if ( _campo.type === "file" ) {
			var _temp = _campo.files,
				x = _temp.length;

			while ( x-- ) {
				_files[ x ] = _temp[ x ];
				_formData.append ( _campo.name, _temp[ x ] );
			}
		}

		self.formData = _formData;
		if ( callback ) {
			callback ( _formData );
		}
		return _files;
	};

	_proto.packAll = function ( form ) {
		var self = this,
			_formData = new FormData (),
			_files = {}, _temp,
			_form = !!_.isObject ( form ) ? form : document,
			_campos = _form.querySelectorAll ( 'input[type="file"]' ),
			z = _campos.length;

		while ( z-- ) {
			_temp = self.pack ( _campos[ z ] );
			_files[ _campos[ z ].name ] = _temp;
			_formData.append ( _campos[ z ].name, _temp );
		}

		self.formData = _formData;
		return _files;
	};

	_proto.on = function ( event, callback ) {
		var self = this;
		if ( !callback ) {
			return false;
		}

		return [
			{
				start   : function () {
					_ajax.on ( 'before', callback );
				},
				complete: function () {
					self.complete = callback;
				},
				progress: function () {
					self.progress = callback;
				},
				error   : function () {
					self.error = callback;
				}
			}[ event ] ()
		]
	};

	_proto.upload = function ( _files ) {
		var self = this;
		if ( !_files ) {
			self.error ( WARNING_UPLOAD_FILE.ERROR.NOPACK );
		}

		if ( !self.url ) {
			self.error ( WARNING_UPLOAD_FILE.ERROR.NOURL );
		}


		var _request = {
			url        : self.url,
			method     : 'POST',
			data       : _files,
			upload     : true,
			contentType: 'auto'
		};

		_ajax.kill ();
		_ajax.on ( 'progress', function ( progress ) {
			if ( progress.lengthComputable && self.progress ) {
				var pct = Math.round ( (progress.loaded / progress.total) * 100 );
				self.progress ( pct );
			}
		} );

		_ajax.on ( 'abort', self.abort );
		_ajax.on ( 'error', self.error );

		_ajax.request ( _request, function ( response ) {
			if ( self.complete ) {
				self.complete ( response );
			}
		} )
	}


};