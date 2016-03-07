/**
 * Created by gmena on 02-08-14.
 */
addEventListener ( 'message', function ( e ) {
	var interval = setInterval ( function () {
		var now = new Date (),
		    sec = now.getSeconds (),
		    min = now.getMinutes (),
		    hour = now.getHours (),
		    meridian = 'am';

		if ( hour > 12 ) {
			hour -= 12;
			meridian = 'pm';
		}

		var secangle = sec * 6;
		var minangle = min * 6;
		var hourangle = (hour / 12 ) * 360;


		if ( min < 10 ) {
			min = '0' + min;
		}

		if ( sec < 10 ) {
			sec = '0' + sec;
		}

		if ( hour < 10 ) {
			hour = '0' + hour;
		}

		this.postMessage ( {
			                   'sec':        sec,
			                   'min':        min,
			                   'hour':       hour,
			                   'meridian':   meridian,
			                   'sec_angle':  secangle,
			                   'min_angle':  minangle,
			                   'hour_angle': hourangle
		                   } )
	}, 1000 );

	if ( e.data === 'stop' ) {
		clearInterval ( interval );
	}

} );
