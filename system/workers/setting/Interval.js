/**
 * Created by Geolffrey on 13/02/14.
 */

addEventListener ( 'message', function ( e ) {
	var data = e.data, x = 0,
	    delay = parseInt ( data.delay ) || 1000,
	    limit = parseInt ( data.limit ) || x,
	    answer = function ( msg ) {
		    this.postMessage ( msg );
	    },
	    end = function () {
		    clearInterval ( _interval );
		    self.close ();
	    };

	var _interval = setInterval ( function () {
		if ( limit > 0 ) {
			answer ( limit );
			if ( --limit <= 0 ) {
				end ();
			}
		} else {
			answer ( ++x );
			if ( x === (limit * -1) && limit !== 0 ) {
				end ();
			}
		}
	}, delay )

} );