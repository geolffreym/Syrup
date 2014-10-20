/**
 * Created by gmena on 07-26-14.
 */
'use strict';

Lib.blend ( 'Repository', [] ).supply ( function () {
	return {
		set:     function ( key, data, callback ) {
			localStorage.setItem ( key, JSON.stringify ( data ) );
			_.callbackAudit ( callback, data, this );
		},
		get:     function ( key ) {
			return _.isJson ( localStorage.getItem ( key ) )
				? JSON.parse ( localStorage.getItem ( key ) ) : null;
		},
		append:  function ( key, element, callback ) {
			var _existent = this.get ( key ),
			    _new = _.extend ( _.isSet ( _existent ) ? _existent : {}, element );

			this.set ( key, _new, false );
			_.callbackAudit ( callback, _new );
		},
		destroy: function () {
			localStorage.clear ();
		},
		clear:   function ( key ) {
			localStorage.removeItem ( key );
		},
		count:   function () {
			return localStorage.length;
		}
	}
} );
