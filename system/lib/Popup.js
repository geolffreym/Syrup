/**
 * Created by gmena on 07-26-14.
 */

'use strict';
/**Popup
 * @constructor
 */
function Popup ( _conf ) {

	var _nav = _.getNav ();
	this.popup = null;
	this.popupClass = '.popupBox';
	this.overlay = null;
	this.overlayClass = '.overlayFondo';
	this.conf = {
		popup:   {
			'overflow':        'hidden',
			'backgroundColor': 'transparent',
			'position':        'absolute',
			'zIndex':          '1200'
		},
		overlay: {
			'backgroundColor': 'rgba(0, 0, 0, 0.7)',
			'height':          '100%',
			'width':           '100%',
			'position':        'fixed',
			'top':             '0',
			'left':            '0',
			'zIndex':          '1000'
		}
	};

	this.conf.popup[_nav.nav === 'firefox'
		? 'MozBoxSizing' : 'boxSizing'] = 'border-box';

	if ( _.isSet ( _conf.popup ) ) {
		_.extend ( this.conf.popup, _conf.popup, true );
	}


	if ( _.isSet ( _conf.overlay ) ) {
		_.extend ( this.conf.overlay, _conf.overlay, true );
	}

}

/** Create Popup
 * @param contenido
 * @param width
 * @param height
 * @returns {{top: number, left: number, width: *, height: *}}
 */
Popup.add ( 'create', function ( contenido, width, height ) {
	var _popup = _$ ( '<div class="popupBox"></div>' ),
	    _overlay = _$ ( '<div class="overlayFondo"></div>' ),
	    _top , _left,
	    _body = _$ ( 'body' ),
	    _window = _$ ( window ),
	    _windowWidth = _window.width (),
	    _windowHeigth = _window.height ();

	this.popup = _popup;
	this.overlay = _overlay;

	_overlay.css ( this.conf.overlay );
	_popup.css ( this.conf.popup );
	_body.append ( _popup );
	_body.append ( _overlay );
	_popup.html ( contenido );

	if ( !_.isSet ( height ) ) {
		height = _popup.height ();
	}

	if ( !_.isSet ( width ) ) {
		width = _popup.width ();
	}

	_top = Math.abs ( Math.ceil ( (_windowHeigth - height) / 2 ) );
	_left = Math.abs ( Math.ceil ( (_windowWidth - width) / 2 ) );

	if ( height > _windowHeigth ) {
		height = (_windowHeigth - (_top * 2));
	}

	if ( width > _windowWidth ) {
		width = (_windowWidth - (_left * 2));
	}

	_popup.width ( width );
	_popup.height ( height );
	_popup.offset ( {y: _top, x: _left} );
	return {top: _top, left: _left, width: width, height: height};
} );

//Remove Popup
Popup.add ( 'remove', function () {
	if ( !this.overlay || !this.popup ) {
		_.warning ( WARNING_SYRUP.ERROR.NOPOPUP );
		return;
	}

	this.overlay.remove ();
	this.popup.remove ();
	this.overlay = null;
	this.popup = null;
} );

Syrup.blend ( Popup );
