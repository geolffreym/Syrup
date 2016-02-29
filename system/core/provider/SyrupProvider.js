/**
 * Created by gmena on 02-27-16.
 */

//Handle dependencies using ECMAScript 6 Module import
export default class SyrupProvider {

	/** Syrup class provider
	 *
	 * @constructor
	 * @param {Function} jQuery Adapter
	 * @param {Object} isJs Adapter
	 * @param {Object} momentJs Adapter
	 * @param {Object} underscore Adapter
	 */
	constructor(jQuery, isJs, momentJs, underscore) {
		//TODO verificar que cada parametro implemente una interfaz Adapter
		this._jQuery = jQuery;
		this._isJs = isJs;
		this._momentJs = momentJs;
		this._underscore = underscore;
	}

	getJQuery() {
		return this._jQuery;
	}

	getIsJs() {
		return this._isJs;
	}

	getM6s() {
		return this._momentJs;
	}

	getU10s() {
		return this._underscore;
	}
}
