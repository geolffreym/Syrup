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
'use strict';
(function (window) {
	var WARNING_MODEL = {
		ERROR: {
			NOPACK: 'Error packing model',
			OBJECTNEEDED: 'Object need to set in model'
		}
	};

	function Model() {
		this.data = null;
		this.blob = null;
		this.scope = {};
		this.model = null;
		this.failed = null;
	}

	/**Attach additional data to request
	 * @param {string} name
	 * @param {object} attach
	 * @return {object}
	 */
	Model.add ('attach', function (name, attach) {
		var self = this;
		_.assert (self.data, WARNING_MODEL.ERROR.NOPACK, '(Model .attach)');
		self.data.append (name, attach);
		return this;
	});

	///**Getting a array of values name="input[]"
	// * @param {string} name
	// * @return {array}
	// */
	//Model.add('multiple', function (name) {
	//    var _return = [],
	//        _model_obj = this.model.get(0);
	//
	//    If (name in _model_obj.elements) {
	//        _.each(_model_obj.elements[name], function (v, i) {
	//            _return.push(v.value);
	//        });
	//    }
	//
	//    Return _return.length > 0 ? _return : false;
	//});

	/**Model fail what to do?
	 * @param {object} field
	 * @param {object} error
	 * @return {object}
	 */
	Model.add ('fail', function (field, error) {
		this.failed = true;
		return {
			field: field,
			code: error.code,
			error: error.error,
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
			_formData = new FormData, _files = [],
			_field = !_.is$ (input) && _$ (input).get (0) || input;

		//Not model.. pass!!
		if ( !_field.exist )
			return;

		return (new Promise (function (resolve, reject) {
			if (
				_field.type === 'file' &&
				_.isSet (_field.name)
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
				_self.file (field).then (resolve);
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
		_self.model = !_.is$ (model) &&
					  _$ (model) || model;

		//Not model.. pass!!
		if ( !_self.model.exist )
			return;

		// For each input fill with data
		_self.model.find ('input, select, textarea', function (e) {

			//Get the index name on input
			var _the_index = e.attr ('name'),
				_option_din = null,
				_select_out = _.emptyStr;

			//Is the index in object?
			if ( _the_index && _the_index in object ) {

				//Update scope
				_self.scope[_the_index] = object[_the_index];

				//Is Select?
				if ( e.name === 'select' ) {

					//It's options data an array?
					if ( _.isArray (_self.scope[_the_index]) ) {

						//For Each options data
						_.each (_self.scope[_the_index], function (v) {
							//Dynamic option
							_option_din = _$ ('<option/>');

							_option_din.text ('content' in v && v.content || _.emptyStr);
							_option_din.val ('value' in v && v.value || _.emptyStr);

							//Just string!!
							_select_out += _option_din.object ().outerHTML;
						});

						//Output!!
						e.html (_select_out);
					}

				} else {
					//Work normally!!
					e.val (_self.scope[_the_index]);
				}
			}
		});
	});

	/**Pack the inputs in ModelData Object
	 * @param {object|string } model
	 * @return {object}

	 * CODES:
	 * 001: Required
	 * 002: Type error
	 * 003: Overflow Length
	 * 004: Bad step
	 * 005: Underflow value
	 * 006: Overflow value
	 * 007: Bad pattern
	 * */

	Model.add ('get', function (model) {
		this.model = !_.is$ (model) && _$ (model) || model;

		//Not model.. pass!!
		if ( !this.model.exist )
			return;

		var _self = this,
			_modelData = new FormData,
			_model_obj = _self.model.get (0),
			_fields = _model_obj.querySelectorAll ('input, textarea, select'),
			x = _fields.length, _codes = null;

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

				//Valid field?
				if ( !field.checkValidity () ) {

					//Codes List
					_codes = {
						'valueMissing': '001',
						'typeMismatch': '002',
						'tooLong': '003',
						'stepMismatch': '004',
						'rangeUnderFlow': '005',
						'rangeOverFlow': '006',
						'patternMismatch': '007'
					};

					//Find the error code!!
					_.each (_codes, function (v, i) {
						//Validity found?
						//Invalid?
						if ( field.validity[i] ) {
							//Break loop
							this.break = true;

							//Reject!!! Error found..
							reject (_self.fail (field, {
								code: v, error: field.validationMessage
							}));

						}

					});

					//Error? .. Pass!!
					return;
				}

				//The field has name?
				if ( _.isSet (field.name) ) {

					//Has multiple?
					//if (!!(_field_array = _self.multiple(field.name)))
					//    fieldValue = _field_array;

					//Append Data
					_modelData.append (field.name, fieldValue);
					_self.scope[field.name] = fieldValue;
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
