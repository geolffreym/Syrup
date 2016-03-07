/**
 * Created by gmena on 02-27-16.
 */

//Handle dependencies using ECMAScript 6 Module import
import D10s from './../provider/D10s';
import iD10s from './../interface/iD10s';
import Interface from './../interface/Interface';

/**
 * D10s composite class for multiple dependencies handling
 * @class
 * @implements {iD10s}
 */
export default class D10sComposite extends D10s {

	/**
	 * D10s "Composite" dependencies injector
	 *
	 * @constructor
	 * @augments D10s
	 */
	constructor() {
		super('D10sComposite', {});
		/**
		 * Dependencies lists
		 * @type {Array}
		 * @protected
		 * **/
		this._d10s = [];
	}

	/**
	 * Return the d10s list size
	 *
	 * @return {Number}
	 */
	get length() {
		return this._d10s.length;
	}

	/**
	 * Return the d10s list
	 *
	 * @return {Object}
	 */
	getD10s() {
		return this._d10s;
	}

	/**
	 * Append iD10s from iAdapter
	 *
	 * @param {Object} D10s
	 */
	addD10s(D10s) {
		//Check for interface implementation
		Interface.implement(D10s, iD10s);
		this._d10s.push(D10s);
	}

}
