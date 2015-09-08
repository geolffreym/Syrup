/**
 * Created by gmena on 07-26-14.
 */
'use strict';

function Storage () {

}

//Set registry to bucket
Storage.add ( 'set', function ( key, data) {
	localStorage.setItem ( key, JSON.stringify ( data ) );
} );


//Get registry from bucket
Storage.add ( 'get', function ( key ) {
	return _.isJson ( localStorage.getItem ( key ) )
		? JSON.parse ( localStorage.getItem ( key ) ) : null;
} );

//Append data to existing bucket
Storage.add ( 'append', function ( key, element) {
	var _existent = this.get ( key ),
	    _new = _.extend ( _.isSet ( _existent ) ? _existent : {}, element );

	this.set ( key, _new, false );
	return this;
} );

//Detroy all buckets
Storage.add ( 'destroy', function () {
	localStorage.clear ();
} );

//Clear a bucket
Storage.add ( 'clear', function ( key ) {
	localStorage.removeItem ( key );
	return this;
} );


//Return count buckets
Storage.add ( 'count', function () {
	return localStorage.length;
} );