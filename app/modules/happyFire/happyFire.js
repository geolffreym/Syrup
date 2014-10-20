/**
 * Created by gmena on 08-06-14.
 */


Module.blend ( 'happyFire', [
	'accordion'
] ).service ( 'log', function ( string ) {
	_.warning ( string );
} );