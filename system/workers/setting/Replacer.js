/**
 * Created by gmena on 04-30-14.
 */

//TODO pasarlo a worker
addEventListener ( 'message', function ( e ) {
	var _fields = e.data,
	    _find = _fields.find,
	    _replace = _fields.replace,
	    _s = _fields.s,
	    _r = _fields.r,
	    _b = _fields.b,
	    _o = _fields.o,
	    _e = _fields.e,
	    _i = _find.length;

	while ( _i > 0 ? _i-- : ((_e = s.indexOf ( _find )) > -1) ) {
		if ( typeof  _find === 'object' ) {
			this.postMessage ( {
				                   s:        _s,
				                   _find:    _find[i],
				                   _replace: _replace[_find[i]],
				                   _object:  true
			                   } );
		} else {
			_r += _o.substring ( _b, _b + _e ) + _replace;
			_s = _s.substring ( _e + _find.length, _s.length );
			_b += _e + _find.length;
		}

		this.postMessage ( {
			                   r: _r,
			                   s: _s,
			                   b: _b
		                   } );

	}
} );