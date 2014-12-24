/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 18/11/13
 * Time: 12:55
 * To change this template use File | Settings | File Templates.
 */

"use strict";

Lib.blend ( 'Form', ['Ajax'] ).make ( function () {
	return {
		formData:   null,
		object:     {},
		url:        '/',
		type:       'GET',
		onbefore:   null,
		oncomplete: null,
		onerror:    null,
		form:       null,
		failed:     null
	}
} ).supply ( function () {
	return {
		action: function ( action ) {
			this.url = action;
		},

		method: function ( method ) {
			this.type = method.toUpperCase ();
		},

		attach: function ( name, attach ) {
			var self = this;
			_.assert ( self.formData, WARNING_SYRUP.ERROR.NOPACK );
			self.formData.append ( name, attach );
		},

		multiple: function ( name ) {
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
		},

		fail: function ( field, error ) {
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

		},

		pack: function ( form ) {
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

		},

		on:     function ( event, callback ) {
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
		},
		submit: function ( event ) {
			var self = this;

			if ( event ) {
				event.preventDefault ();
			}
			_.assert ( self.formData, WARNING_SYRUP.ERROR.NOPACK );

			if ( self.failed ) {
				return false;
			}

			var Ajax = {
				url:    self.url,
				method: self.type,
				data:   self.formData
			};

			self.Ajax.kill ();
			self.Ajax.on ( 'before', self.onbefore );
			self.Ajax.on ( 'error', self.onerror );
			self.Ajax.request ( Ajax, function ( response ) {
				if ( self.oncomplete ) {
					self.oncomplete ( response );
				}
			} )


		}
	}
} );
