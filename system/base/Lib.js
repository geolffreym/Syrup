/**
 * Created by gmena on 08-06-14.
 */

"use strict";
(function (window) {
	function Libs () {
		this.breadcrumb = {};
		this.object = {};
		this.name = null;
	}

	/** Blend a method in global Syrup object
	 * @param {string} name
	 * @param {array} dependencies
	 * @return {object}
	 * **/
	Libs.add ('blend', function (name, dependencies) {
		var _anonymous = (
			Function.factory (name)
		) ();


		if ( !(name in this.breadcrumb) ) {
			_.Syrup.blend (_anonymous);
			this.name = name;
			this.object = _[name];
			this.breadcrumb[name] = this.object;
			this._dependencies (dependencies);
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
				_self.object.__proto__[v] = !(v in _self.object)
					? ( _[v] || (
						_.isFunction (window[v]) && new window[v]
						|| _.isFunction (window[v + 'Class']) && new window[v + 'Class']
				)) : _self.object[v];
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
			_self.object[i] = v;
		});

		return this;
	});

	/** Methods provider
	 * @param {object} supplier
	 * @return {object}
	 * **/
	Libs.add ('supply', function (supplier) {
		var _self = this;

		//Each elemento of supplier
		_.each (supplier, function (v, i) {
			if ( _.isFunction (v) )
				_self.cook (i, v);
		}, true);

		return this;
	});


	/**Append methods
	 * @param {string} name
	 * @param {function} callback
	 * @return {object}
	 * */
	Libs.add ('cook', function (name, callback) {
		if ( _.isFunction (callback) )
			this.object.__proto__[name] = callback;
		return this;
	});

	//The global object Lib
	window.Lib = new Libs;
	window.LibClass = Libs;
}) (window);
