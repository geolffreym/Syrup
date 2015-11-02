/**
 * Created by gmena on 08-06-14.
 */

"use strict";
(function (window) {
	function Libs () {
		this.breadcrumb = {};
		this.object = null;
		this.name = null;
	}

	/** Blend a method in global Syrup object
	 * @param {string} name
	 * @param {array} dependencies
	 * @return {object}
	 * **/
	Libs.add ('blend', function (name, dependencies) {

		if ( !(name in this.breadcrumb) ) {

			//Factory
			this.name = name;
			this.object = Function.factory (name);
			this._dependencies (dependencies);

			//Blend global scope
			_.Syrup.blend (new this.object);

			//Save history
			this.breadcrumb[name] = _[name];
		}

		return this;

	});

	/** Return a method saved in breadcrumb
	 * @param {string} name
	 * @return {object}
	 * **/
	Libs.add ('get', function (name) {
		return (name in this.breadcrumb) && this.breadcrumb[name];
	});

	/**Dependencies gestor
	 * @param {array} dependencies
	 * @return {void}
	 * */
	Libs.add ('_dependencies', function (dependencies) {
		var _self = this;
		if ( _.isArray (dependencies) && _.isSet (_self.object) ) {
			_.each (dependencies, function (v) {
				_self.object.prototype[v] = !(v in _self.object)
					? ( _[v] || (
						_.isFunction (window[v]) && new window[v]
						|| _.isFunction (window[v + 'Class']) && new window[v + 'Class']
				)) : _self.object.prototype[v];
			})
		}
	});

	/**Attributes provider
	 * @param {object} attributes
	 * @return {object}
	 * */
	Libs.add ('make', function (attributes) {
		var _self = this;
		_.each (attributes, function (v, i) {
			_[_self.name][i] = v;
		});

		return this;
	});

	/** Methods provider
	 * @param {object} supplier
	 * @return {object}
	 * **/
	Libs.add ('supply', function (supplier) {
		var _self = this;

		//Each element of supplier
		_.each (supplier, function (v, i) {
			if ( _.isFunction (v) )
				_self.cook (i, v);
		});

		return this;
	});


	/**Append methods
	 * @param {string} name
	 * @param {function} callback
	 * @return {object}
	 * */
	Libs.add ('cook', function (name, callback) {
		if ( _.isFunction (callback) )
			this.object.prototype[name] = callback;
		return this;
	});

	//The global object Lib
	window.Lib = new Libs;
	window.LibClass = Libs;

}) (window);
