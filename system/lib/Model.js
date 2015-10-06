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
"use strict";

var WARNING_MODEL = {
	ERROR: {
		NOPACK: 'Error packing model'
	}
};

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
	_.assert (self.modelData, WARNING_MODEL.ERROR.NOPACK, '(Model .attach)');
	self.modelData.append (name, attach);
	return this;
});

/**Getting a array of values name="input[]"
 * @param name
 * @return array
 */
Model.add ('multiple', function (name) {
	var _return = [],
		_model_obj = this.model.object ();

	if ( name in _model_obj.elements ) {
		_.each (_model_obj.elements[name], function (v, i) {
			_return.push (v.value);
		});
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
 * @param {string} url
 * @param {object} data
 * @return {object}*/
Model.add ('send', function (url, data) {
	var self = this;
	if ( _.isObject (url) || _.isFormData (data) ) {
		data = url;
		url = null;
	}

	if ( !_.isSet (data) && !_.isSet (self.modelData) )
		_.error (WARNING_MODEL.ERROR.NOPACK, '(Model .send)');

	var conf = {
		url   : url || self.model.attr ('action'),
		data  : data || self.modelData,
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
Model.add ('getData', function () {
	return this.modelData;
});


/**Pack the input files in ModelData
 * @param {object|string} input
 * @return {object}
 * */
Model.add ('file', function (input) {
	var _self = this,
		_formData = _.isSet (_self.modelData) ?
			_self.modelData : new FormData,
		_files = [],
		_field = _$ (input).get (0);

	return (new Promise (function (resolve, reject) {
		if ( _field.type === "file" ) {
			var _temp = _field.files,
				x = _temp.length;

			while ( x-- ) {
				_files[x] = _temp[x];
				_formData.append (_field.name, _temp[x]);
				_self.object[_field.name] = _temp[x];
			}
		}

		_self.modelData = _formData;
		resolve (_self);
	}));

});

/**Pack all the input files in ModelData
 * @param {object|string} model
 * @return {object}
 * */
Model.add ('files', function (model) {
	var _self = this;
	_self.model = _$ (model);

	return (new Promise (function (resolve, reject) {
		_self.model.find ('input[type="file"]', function (field) {
			_self.file (field.get (0)).then (resolve);
		});
	}));

});

/**Pack the inputs in ModelData Object
 * @param {object|string } model
 * @return {object}
 */
Model.add ('pack', function (model) {
	this.model = _$ (model);

	var _self = this,
		_modelData = _.isSet (_self.modelData) ?
			_self.modelData : new FormData,
		_field_array,
		_model_obj = _self.model.object (),
		_fields = _model_obj.querySelectorAll ('input, textarea, select'),
		x = _fields.length;

	_self.failed = false;

	return (new Promise (function (resolve, reject) {
		//Run over inputs
		while ( x-- ) {

			//Skip file type
			if ( _fields[x].type === 'file' || !_fields[x] ) {
				continue;
			}

			//Checked?
			if ( _fields[x].type === 'checkbox' || _fields[x].type === 'radio' ) {
				if ( !_fields[x].checked ) {
					continue;
				}
			}

			var field = _fields[x],
				fieldValue = field.value;

			//Skip?
			if ( !( _$ (field).data ('skip')) && _.isEmpty (fieldValue) ) {
				reject (_self.fail (field, 'empty'));
				break;
				//isMail?
			} else if ( _$ (field).data ('mail') && !_.isMail (fieldValue) ) {
				reject (_self.fail (field, 'invalid_mail'));
				break;
				//Overflow down?
			} else if ( _$ (field).data ('min') && (
					+_$ (field).data ('min') > fieldValue.length
				) ) {
				reject (_self.fail (field, 'minim_chars'));
				break;
				//Overflow?
			} else if ( _$ (field).data ('max') && (
					+_$ (field).data ('max') < fieldValue.length
				) ) {
				reject (_self.fail (field, 'overflow_chars'));
				break;
			} else {
				//Custom validation
				if ( _$ (field).data ('custom') ) {
					var Regex = new RegExp (_$ (field).data ('custom'), "g");
					if ( !Regex.test (fieldValue) ) {
						reject (_self.fail (field, 'invalid_custom'));
						break;
					}
				}

				//The field has name?
				if ( _.isSet (field.name) ) {

					//Has multiple?
					if ( !!(_field_array = _self.multiple (field.name)) )
						fieldValue = _field_array;

					//Append Data
					_modelData.append (field.name, fieldValue);
					_self.object[field.name] = fieldValue;
				}

			}
		}

		//The model data
		_self.modelData = _modelData;
		resolve (_self);
	}));

});
