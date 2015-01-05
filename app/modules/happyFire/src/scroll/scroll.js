/**
 * Created by gmena on 08-06-14.
 */

//Module name -> Controller and Event Syrup
Module.recipe ( 'happyFire.scroll', function ( _, _$, globalScope ) {
	return {
		init: function ( tools ) {

		},
		goTo: function ( tools, event ) {
			event.preventDefault ();
			var _go = _$ ( event.target ).data ( 'go' ),
			    _destiny = _$ ( _go ),
			    _scroll, _level;

			if ( _destiny.exist ) {
				_scroll = +_destiny.prop ( 'scrollHeight' );
				_level = +_destiny.data ( 'level' );

				_scroll = ((_scroll * _level) - 150);
				_.windowScrollTo ( {
					                   delay: 40,
					                   limit: _scroll, //Max limit
					                   hold:  true, //Hold position
					                   step:  2 //Step iteration
				                   } );
			}
		}
	}
} ).addEvent ( 'click', 'goTo' );