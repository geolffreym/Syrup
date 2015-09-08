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

var WARNING_SYRUP_MODEL = {
	ERROR: {
		NOPACK: 'Error packing model'
	}
};

"use strict";
function Model () {
	this.Http = new Http;
	this.modelData = null;
	this.object = {};
	this.type = 'POST';
	this.model = null;
	this.failed = null;
}


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
	this.failed = true;
	return {
		field : field,
		error : error,
		coords: _.cartesianPlane (field)
	};
});

/**Submit action
 * @param event*/
Model.add ('send', function (url, data) {
	var self = this;
	_.assert (data, WARNING_SYRUP_MODEL.ERROR.NOPACK);

	var conf = {
		url   : url,
		data  : data,
		method: self.type
	};

	return (new Promise (function (resolve, reject) {
		if ( self.failed )
			reject (data);

		self.Http.kill ();
		self.Http.request (conf).then (function (response) {
			resolve (response)
		}).catch (reject);
	}))
});

//Return object
Model.add ('getObject', function () {
	return this.object;
});

//Return formdata
Model.add ('getModelData', function () {
	return this.modelData;
});

/**Pack the inputs in ModelData Object
 * @param model
 * @return object
 */
Model.add ('pack', function (model) {
	var self = this;
	self.model = _$ (model);

	var _modelData = new FormData,
		_field_array,
		_model_obj = self.model.object (),
		_fields = _model_obj.querySelectorAll ('input, textarea, select'),
		x = _fields.length;

	self.failed = false;

	return (new Promise (function (resolve, reject) {
		//Run over inputs
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
				reject (self.fail (field, 'empty'));
				break;
				//isMail?
			} else if ( _$ (field).data ('mail') && !_.isMail (fieldValue) ) {
				reject (self.fail (field, 'invalid_mail'));
				break;
				//Overflow down?
			} else if ( _$ (field).data ('min') && (
					+_$ (field).data ('min') > fieldValue.length
				) ) {
				reject (self.fail (field, 'minim_chars'));
				break;
				//Overflow?
			} else if ( _$ (field).data ('max') && (
					+_$ (field).data ('max') < fieldValue.length
				) ) {
				reject (self.fail (field, 'overflow_chars'));
				break;
			} else {
				//Custom validation
				if ( _$ (field).data ('custom') ) {
					var Regex = new RegExp (_$ (field).data ('custom'), "g");
					if ( !Regex.test (fieldValue) ) {
						reject (self.fail (field, 'invalid_custom'));
						break;
					}
				}

				//Has multiple?
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

		//The model data
		self.modelData = _modelData;
		resolve (self);
	}));

});
