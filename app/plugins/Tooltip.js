/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 25/11/13
 * Time: 12:22
 * To change this template use File | Settings | File Templates.
 */


_.$fn.add ( 'tooltip', function ( _conf ) {
	var _self = this,
		_tool = _$ ( '<div class="tooltip"></div>' );

	if ( !_$ ( '.tooltip' ).exist ) {
		_$ ( 'body' ).append ( _tool );
	}

	_self.fn ( 'Tooltip', {

		position: function ( ev ) {
			ev.stopPropagation ();
			var _cartesian = _.cartesianPlane ( ev.target ),
				_outHeight = window.outerHeight,
				_innerHeight = window.innerHeight,
				_x = _cartesian.left + 10,
				_y = _cartesian.top + 40;

			if ( _y > _innerHeight - 50 ) {
				_y -= (
					_outHeight - _cartesian.bottom
				);
				_tool.removeClass ( _config.basic_class );
				_tool.addClass ( _config.reverse_class );
			}

			_tool.offset ( { y: _y, x: _x } );
		}

	} );


	return this.each ( function ( elem ) {
		var _domObject = _$ ( elem ),
			_defaults = {
				ajax       : false,
				delegate   : null,
				transition : 'fast',
				basic_class: 'tooltip'
			},

			_config = _.extend ( _defaults, _conf );


		_domObject.addListener ( 'mousemove', function ( event ) {
			_self.Tooltip.position ( event );

		} ).addListener ( 'mouseenter', function ( e ) {
			var _dato = _domObject.data ( 'tooltip' );

			if ( !_.isEmpty ( _dato ) ) {
				_tool.html ( _dato ).show()
					.fadeIn ( _config.transition )
			}

		} ).addListener ( 'mouseleave', _config.delegate, function () {
			_tool.hide ();
		} )

	} );
} );

