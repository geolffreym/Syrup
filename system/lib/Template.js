/**
 * Created by gmena on 07-26-14.
 */

'use strict';
/**Template
 * @constructor
 */

/**Dependencies
 * Http Lib
 * Worker Lib
 * Repository Lib
 * */

function Template () {
	this.Http = new Http;
	this.Repository = new Repository;
	this.Workers = new Workers;
	this.template = null;
}

//Search for the template
Template.add ( 'lookup', function ( template, callback ) {
	var _conf = {
		url      : setting.app_path + '/templates/' + template,
		dataType : 'text/plain',
		processor: '.html'
	};

	this.Http.request ( _conf, function ( response ) {
		_.callbackAudit ( callback, response );
	} );

	return this;
} );

//Get the template
Template.add ( 'get', function ( template, callback ) {
	var _self = this,
		_repo = _self.Repository,
		_template = _repo.get ( 'templates' ),
		_save = {};

	_self.template = template;
	if ( _.isSet ( _template ) ) {
		if ( _.isSet ( _template[ template ] ) ) {
			_.callbackAudit ( callback, _template[ template ] )
		} else {
			_self.lookup ( template, function ( temp ) {
				_save[ template ] = temp;
				_repo.append ( 'templates', _save );
				_.callbackAudit ( callback, temp );
			} )
		}
	} else {
		_repo.set ( 'templates', {} );
		this.get ( template, callback )
	}

	return this;
} );

//Clear Template from Repository
Template.add ( 'clear', function () {
	this.Repository.clear ( 'templates' );
	return this;
} );

//Clear Template from Repository
Template.add ( 'remove', function () {
	if ( this.template ) {
		var old_templates = this.Repository.get ( 'templates' );
		if ( old_templates ) {
			delete old_templates[ this.template ]
		}

		this.Repository.set ( 'templates', old_templates );
		this.template = null;
	}

	return this;
} );

//Parse the Template
Template.add ( 'parse', function ( _template, _fields, callback ) {
	var _self = this;
	_self.Workers.set ( '/workers/setting/Parser', function ( worker ) {
		_self.Workers.send ( { template: _template, fields: _fields } );
	} ).on ( 'message', function ( e ) {
		_.callbackAudit ( callback, e.data )
	} );

	return this;
} );

