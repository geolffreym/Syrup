/**
 * Created by Geolffrey on 13/02/14.
 */
importScripts ( 'Mustache.js' );
addEventListener ( 'message', function ( e ) {

	var data = e.data,
		fields = data.fields,
		template = data.template;



	this.postMessage ( new_template );
} )
;