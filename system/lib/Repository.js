/**
 * Created by gmena on 07-26-14.
 */
'use strict';

function Repository () {

}

//Set registry to bucket
Repository.add ( 'set', function ( key, data, callback ) {
	localStorage.setItem ( key, JSON.stringify ( data ) );
	_.callbackAudit ( callback, data, this );
} );


//Get registry from bucket
Repository.add ( 'get', function ( key ) {
	return _.isJson ( localStorage.getItem ( key ) )
		? JSON.parse ( localStorage.getItem ( key ) ) : null;
} );

//Append data to existing bucket
Repository.add ( 'append', function ( key, element, callback ) {
	var _existent = this.get ( key ),
	    _new = _.extend ( _.isSet ( _existent ) ? _existent : {}, element );

	this.set ( key, _new, false );
	_.callbackAudit ( callback, _new );
} );

//Detroy all buckets
Repository.add ( 'destroy', function () {
	localStorage.clear ();
} );

//Clear a bucket
Repository.add ( 'clear', function ( key ) {
	localStorage.removeItem ( key );
} );


//Return count buckets
Repository.add ( 'count', function () {
	return localStorage.length;
} );