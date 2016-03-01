/**
 * Created by gmena on 02-27-16.
 */

//Handle dependencies using ECMAScript 6 Module import
import D10s from './D10s';
import Interface from './../interface/Interface';
import iD10s from './../interface/iD10s';

export default class D10sList extends D10s {

	/** Syrup "Composite" dependencies injector
	 *
	 * @constructor
	 */
	constructor() {
		super('D10sList', {});
		this.d10s = [];
	}

	/** Return the d10s list size
	 *
	 * @return {Number}
	 */
	get length() {
		return this.d10s.length;
	}

	/** Return the d10s list
	 *
	 * @return {Object}
	 */
	getD10s() {
		return this.d10s;
	}

	/** Append iD10s from iAdapter
	 *
	 * @param {iD10s} D10s
	 */
	addD10s(D10s) {
		//Check for interface implementation
		Interface.implement(D10s, iD10s);
		this.d10s.push(D10s);
	}

}
