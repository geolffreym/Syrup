/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 18/11/13
 * Time: 12:55
 * To change this template use File | Settings | File Templates.
 */

/**Dependencies
 * Http Lib
 * */

var WARNING_SYRUP_FORM = {
	ERROR: {
		NOPACK: 'Error packing model'
	}
};

"use strict";
function Model () {
	this.Http = new Http;
	this.modelData = null;
	this.object = {};
	this.url = '/';
	this.type = 'POST';
	this.onbefore = null;
	this.oncomplete = null;
	this.onerror = null;
	this.model = null;
	this.failed = null;
}

/**Set url to request
 * @param action
 * @return object
 */
Model.add ('action', function (action) {
	this.url = action;
	return this;
});

/**Set method request
 * @param method
 * @return object
 */
Model.add ('method', function (method) {
	this.type = method.toUpperCase ();
	return this;
});

/**Attach additional data to request
 * @param name
 * @param attach
 * @return object
 */
Model.add ('attach', function (name, attach) {
	var self = this;
	_.assert (self.modelData, WARNING_SYRUP_FORM.ERROR.NOPACK);
	self.modelData.append (name, attach);
});

/**Getting a array of values name="input[]"
 * @param name
 * @return array
 */
Model.add ('multiple', function (name) {
	var _top = 0, _input_array,
		_return = [],
		_model_obj = this.model.object ();


	if ( _.isSet (_model_obj.elements[name]) ) {
		if ( (
				_input_array = _model_obj.elements[name].length
			) ) {
			for ( ; _top < _input_array; _top++ ) {
				_return.push (_model_obj.elements[name][_top].value)
			}
		}
	}
	return _return.length > 0 ? _return : false;
});

/**Model fail what to do?
 * @param field
 * @param error
 *
 */
Model.add ('fail', function (field, error) {
	var self = this,
		_notify = {
			field : field,
			error : error,
			coords: _.cartesianPlane (field)
		};

	self.failed = true;
	if ( self.onerror ) {
		self.onerror (_notify);
	}

});

/**Model event handler
 * @param event
 * @param callback
 */
Model.add ('on', function (event, callback) {
	var self = this;

	return [
		{
			before  : function () {
				if ( callback ) {
					self.onbefore = callback;
				}
			},
			error   : function () {
				if ( callback ) {
					self.onerror = callback;
				}
			},
			complete: function () {
				if ( callback ) {
					self.oncomplete = callback;
				}
			}
		}[event] ()
	]
});

/**Submit action
 * @param event*/
Model.add ('send', function (event) {
	var self = this;

	if ( event ) {
		event.preventDefault ();
	}
	_.assert (self.modelData, WARNING_SYRUP.ERROR.NOPACK);

	if ( self.failed ) {
		return false;
	}

	var conf = {
		url   : self.url,
		method: self.type,
		data  : self.modelData
	};

	self.Http.kill ();
	self.Http.on ('error', self.onerror);
	self.Http.on ('before', self.onbefore);
	self.Http.request (conf, function (response) {
		if ( self.oncomplete ) {
			self.oncomplete (response);
		}
	});

	return this;
});

/**Pack the inputs in ModelData Object
 * @param model
 * @return object
 */
Model.add ('get', function (model) {
	var self = this;
	self.model = _$ (model);

	var _modelData = new FormData,
		_field_array,
		_model_obj = self.model.object (),
		_fields = _model_obj.querySelectorAll ('input, textarea, select'),
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

		//Skip?
		if ( !( _$ (field).data ('skip')) && _.isEmpty (fieldValue) ) {
			self.fail (field, 'empty');
			break;
			//isMail?
		} else if ( _$ (field).data ('mail') && !_.isMail (fieldValue) ) {
			self.fail (field, 'invalid_mail');
			break;
			//Overflow down?
		} else if ( _$ (field).data ('min') && (
				+_$ (field).data ('min') > fieldValue.length
			) ) {
			self.fail (field, 'minim_chars');
			break;
			//Overflow?
		} else if ( _$ (field).data ('max') && (
				+_$ (field).data ('max') < fieldValue.length
			) ) {
			self.fail (field, 'overflow_chars');
			break;
		} else {
			//Custom validation
			if ( _$ (field).data ('custom') ) {
				var Regex = new RegExp (_$ (field).data ('custom'), "g");
				if ( !Regex.test (fieldValue) ) {
					self.fail (field, 'invalid_custom');
					break;
				}
			}

			if ( !!(
					_field_array = self.multiple (field.name)
				) ) {
				fieldValue = _field_array
			}

			if ( _.isSet (field.name) ) {
				_modelData.append (field.name, fieldValue);
				self.object[field.name] = fieldValue;
			}

		}
	}

	self.modelData = _modelData;
	return self.object;

});
