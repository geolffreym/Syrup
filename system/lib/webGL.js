/**
 * Created by gmena on 07-25-14.
 */
//Coming Soon
'use strict';

var WebGL;

WebGL = function () {
	var _proto = this.__proto__;

	this.canvas = null;
	this.ctx = null;

	_proto.init = function ( _canvas ) {
		var _self = this;
		_self.canvas = _.isString ( _canvas )
			? _$ ( canvas ).object () : _canvas;

		if ( !_.isObject ( _self.canvas ) ) {
			_.error ( WARNING_SYRUP.ERROR.NOOBJECT );
		}

	}
};