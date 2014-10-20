/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 18/11/13
 * Time: 12:55
 * To change this template use File | Settings | File Templates.
 */


var Form,
WARNING_FORM = {
	ERROR: {
		NOPACK:   'Es necesario el paquete de archivos.',
		NOACTION: 'Es necesaria '
	}
};
Form = function () {

	var _proto = this.__proto__ || Form.prototype,
	    _self = this || _proto,
	    _ajax = new _.Ajax;

	_self.formData = null;
	_self.object = {};
	_self.url = '/';
	_self.type = 'GET';
	_self.onbefore = null;
	_self.oncomplete = null;
	_self.onerror = null;
	_self.form = null;
	_self.failed = false;

	_proto.action = function ( action ) {
		this.url = action;
	};

	_proto.method = function ( method ) {
		this.type = method.toUpperCase ();
	};

	_proto.attach = function ( name, attach ) {
		var self = this;
		_.assert ( self.formData, WARNING_FORM.ERROR.NOPACK );
		self.formData.append ( name, attach );
	};

	_proto.multiple = function ( name ) {
		var _top = 0,
		    _return = [],
		    _form_obj = this.form.object (),
		    _input_array = _form_obj.elements[name].length;

		if ( _input_array ) {
			for ( ; _top < _input_array; _top++ ) {
				_return.push ( _form_obj.elements[name][_top].value )
			}
		}

		return _return.length > 0 ? _return : false;
	};

	_proto.fail = function ( field, error ) {
		var self = this,
		    _notify = {
			    field:  field,
			    error:  error,
			    coords: _.cartesianPlane ( field )
		    };

		self.failed = true;
		if ( self.onerror ) {
			self.onerror ( _notify );
		}

	};

	_proto.pack = function ( form ) {
		var self = this;
		self.form = _$ ( form );

		var _formData = new FormData,
		    _field_array,
		    _fields = self.form.get ( 'input, textarea, select' ),
		    x = _fields.length;

		self.failed = false;
		while ( x-- ) {

			if ( _fields[x].type === 'file' || !_fields[x] ) {
				continue;
			}

			if ( _fields[x].type === 'checkbox' || _fields[x].type === 'radio' ) {
				if ( !_fields[x].checked ) {
					continue;
				}
			}

			var field = _fields[x],
			    fieldValue = field.value;

			if ( !(_$ ( field ).data ( 'skip' )) && _.isEmpty ( fieldValue ) ) {
				self.fail ( field, 'empty' );
				break;
			} else {
				if ( _$ ( field ).data ( 'mail' ) && !_.isMail ( fieldValue ) ) {
					self.fail ( field, 'invalid_mail' );
					break
				} else {
					if ( _$ ( field ).data ( 'max' ) && (+_$ ( field ).data ( 'max' ) > fieldValue.length) ) {
						self.fail ( field, 'overflow_chars' );
						break;
					} else {
						if ( _$ ( field ).data ( 'custom' ) ) {
							var Regex = new RegExp ( _$ ( field ).data ( 'custom' ), "g" );
							if ( !Regex.test ( fieldValue ) ) {
								self.fail ( field, 'invalid_custom' );
								break;
							}
						}

						if ( !!(_field_array = self.multiple ( field.name )) ) {
							fieldValue = _field_array
						}

						_formData.append ( field.name, fieldValue );
						self.object[field.name] = fieldValue;


					}
				}
			}
		}
		self.formData = _formData;
		return self.object;

	};

	_proto.on = function ( event, callback ) {
		var self = this;

		return [{
			before:   function () {
				if ( callback ) {
					self.onbefore = callback;
				}
			},
			error:    function () {
				if ( callback ) {
					self.onerror = callback;
				}
			},
			complete: function () {
				if ( callback ) {
					self.oncomplete = callback;
				}
			}
		}[event] ()]
	};


	_proto.submit = function ( event ) {
		var self = this;

		if ( event ) {
			event.preventDefault ();
		}
		_.assert ( self.formData, WARNING_FORM.ERROR.NOPACK );

		if ( self.failed ) {
			return false;
		}

		var Ajax = {
			url:    self.url,
			method: self.type,
			data:   self.formData
		};

		_ajax.kill ();
		_ajax.on ( 'before', self.onbefore );
		_ajax.on ( 'error', self.onerror );
		_ajax.request ( Ajax, function ( response ) {
			if ( self.oncomplete ) {
				self.oncomplete ( response );
			}
		} )


	};
};

Syrup.blend ( Form );
