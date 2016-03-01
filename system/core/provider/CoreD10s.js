/**
 * Created by gmena on 02-27-16.
 */

//Handle dependencies using ECMAScript 6 Module import
import D10s from './D10s';
import Interface from './../interface/Interface';
import iAdapter from './../interface/iAdapter';

export default class CoreD10s extends D10s {

	/** Syrup "Composite" dependencies injector
	 *
	 * @constructor
	 */
	constructor() {
		super('CoreD10s', {});
		this.d10s = [];
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
	 * @param {String} name
	 * @param {iAdapter} iAdapterIn
	 */
	addD10s(name, iAdapterIn) {
		//Check for interface implementation
		Interface.implement(iAdapterIn, iAdapter);
		this.d10s.push(new D10s(name, iAdapterIn.getAdapter()));
	}

}
