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
(function (window) {
	var WARNING_MODEL = {
		ERROR: {
			NOPACK      : 'Error packing model',
			OBJECTNEEDED: 'Object need to set in model'
		}
	};

	function Model () {
		this.data = null;
		this.blob = null;
		this.scope = {};
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
		_.assert (self.data, WARNING_MODEL.ERROR.NOPACK, '(Model .attach)');
		self.data.append (name, attach);
		return this;
	});

	/**Getting a array of values name="input[]"
	 * @param name
	 * @return array
	 */
	Model.add ('multiple', function (name) {
		var _return = [],
			_model_obj = this.model.get (0);

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

	//Return object
	Model.add ('getScope', function () {
		return this.scope;
	});

	//Return formdata
	Model.add ('getData', function () {
		return this.data;
	});

	//Return formdata
	Model.add ('getBinaries', function () {
		return this.blob;
	});


	/**Pack the input files in ModelData
	 * @param {object|string} input
	 * @return {object}
	 * */
	Model.add ('file', function (input) {
		var _self = this,
			_formData = new FormData,
			_files = [],
			_field = !_.is$ (input)
					 && _$ (input).get (0) || input;

		//Not model.. pass!!
		if ( !_field.exist )
			return;

		return (new Promise (function (resolve, reject) {
			if (
				_field.type === "file"
				&& _.isSet (_field.name)
			) {
				var _temp = _field.files,
					x = _temp.length;

				while ( x-- ) {
					_files[x] = _temp[x];
					_formData.append (_field.name, _temp[x]);
				}
			}

			_self.scope['_files'] = _files;
			_self.blob = _formData;
			resolve (_self);
		}));

	});

	/**Pack all the input files in ModelData
	 * @param {object|string} model
	 * @return {object}
	 * */
	Model.add ('binary', function (model) {
		var _self = this;
		_self.model = !_.is$ (model) && _$ (model) || model;

		//Not model.. pass!!
		if ( !_self.model.exist )
			return;

		return (new Promise (function (resolve, reject) {
			_self.model.find ('input[type="file"]', function (field) {
				_self.file (field.get (0)).then (resolve);
			});
		}));

	});

	/**Set data to inputs from Object
	 * @param {object|string } model
	 * @return {void}
	 */
	Model.add ('set', function (model, object) {

		if ( !_.isObject (object) )
			_.error (WARNING_MODEL.ERROR.OBJECTNEEDED, '(Model .set)');

		var _self = this;
		_self.model = !_.is$ (model)
					  && _$ (model) || model;

		//Not model.. pass!!
		if ( !_self.model.exist )
			return;

		// For each input fill with data
		_.each (object, function (v, i) {
			_self.model.find ('input[name=' + i + ']', function (e) {
				_self.scope[i] = v;
				e.val (v);
			})
		})

	});

	/**Pack the inputs in ModelData Object
	 * @param {object|string } model
	 * @return {object}
	 */
	Model.add ('get', function (model) {
		this.model = !_.is$ (model)
					 && _$ (model) || model;

		//Not model.. pass!!
		if ( !this.model.exist )
			return;

		var _self = this,
			_modelData = new FormData,
			_field_array, _model_obj = _self.model.get (0),
			_fields = _model_obj.querySelectorAll ('input, textarea, select'),
			x = _fields.length;

		_self.failed = false;

		return (new Promise (function (resolve, reject) {
			//Run over inputs
			while ( x-- ) {

				//Skip none type
				if ( !_fields[x] )
					continue;

				//If file pack it
				if ( _fields[x].type === 'file' ) {
					_self.file (_fields[x]);
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
						_self.scope[field.name] = fieldValue;
					}

				}
			}

			//The model data
			_self.data = _modelData;
			resolve (_self);
		}));

	});

	//Global access
	window.Model = Model;

}) (window);
