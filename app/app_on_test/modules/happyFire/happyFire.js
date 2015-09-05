/**
 * Created by gmena on 08-06-14.
 */


Module.blend ( 'happyFire', [] ).service ( 'log', function ( string ) {
	_.warning ( string );
} );