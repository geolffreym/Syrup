/**
 * Created by gmena on 07-26-14.
 */
'use strict';
/**CSRF
 * @constructor
 */
function CSRF () {
	this.storage = new Repository;
	this.name = 'csrf';
	this.tokenAt = null;
}

/**Retorna el token almacenado
 * @param key
 * @returns {*}
 */
CSRF.add ( 'get', function ( key ) {
	var _db = this.storage.get ( this.name );
	if ( !!_db ) {
		if ( _.isSet ( key ) && _.isSet ( _db[ key ] ) ) {
			return _db[ key ];
		} else {
			return _db;
		}
	}
	return null;
} );

/**Guarda el token
 * @param key
 */
CSRF.add ( 'save', function ( key ) {
	var _db = this.get ( this.name ),
		_tokens = !!_db ? _db : {};

	_tokens[ key ] = this.tokenAt;
	this.storage.set ( this.name, _tokens, false );
	return this;
} );

/**Valida si exsite una cookie almacenada y la retorna sino es false
 * @param name
 * @returns {null|*}
 */
CSRF.add ( 'token', function ( name ) {
	this.tokenAt = _.getCookie ( name );
	return this.tokenAt;
} );

/**Limpia session CSRF
 * @param key
 */
CSRF.add ( 'clear', function ( key ) {
	var _db = this.get ( false );
	if ( _db && _db[ key ] ) {
		_db[ key ] = null;
		this.storage.set ( this.name, _db, false );
	}
} );

//Destruye la session
CSRF.add ( 'destroy', function () {
	this.storage.clear ( this.name );
} );

/**Verifica si es necesario el csrf
 * @param method
 * @returns {*|boolean}
 */
CSRF.add ( 'isSafeMethod', function ( method ) {
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test ( method ));
} );



