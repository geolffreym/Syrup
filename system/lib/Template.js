/**
 * Created by gmena on 07-26-14.
 */

'use strict';
/**Template
 * @constructor
 */

/**Dependencies
 * Ajax Lib
 * Worker Lib
 * Repository Lib
 * */

function Template () {
	this.Ajax = new Ajax;
	this.Repository = new Repository;
	this.Workers = new Workers;
	this.template = null;
}

//Search for the template
Template.add ( 'lookup', function ( template, callback ) {
	var _conf = {
		url:       setting.app_path + 'templates/' + template,
		dataType:  'text/plain',
		processor: '.html'
	};

	this.Ajax.request ( _conf, function ( response ) {
		_.callbackAudit ( callback, response );
	} )
} );

//Get the template
Template.add ( 'get', function ( template, callback ) {
	var _self = this,
	    _repo = _self.Repository,
	    _template = _repo.get ( 'templates' ),
	    _save = {};

	_self.template = template;
	if ( _.isSet ( _template ) ) {
		if ( _.isSet ( _template[template] ) ) {
			_.callbackAudit ( callback, _template[template] )
		} else {
			_self.lookup ( template, function ( temp ) {
				_save[template] = temp;
				_repo.append ( 'templates', _save );
				_.callbackAudit ( callback, temp );
			} )
		}
	} else {
		_repo.set ( 'templates', {} );
		this.get ( template, callback )
	}
} );

//Clear Template from Repository
Template.add ( 'remove', function () {
	this.Repository.clear ( this.template );
} );

//Parse the Template
Template.add ( 'parse', function ( _template, _fields, callback ) {
	var _self = this;
	_self.Workers.set ( 'system/workers/setting/Parser', function ( worker ) {
		_self.Workers.send ( {template: _template, fields: _fields} );
	} );

	_self.Workers.on ( 'message', function ( e ) {
		_.callbackAudit ( callback, e.data )
	} )
} );

