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
		super('Core', {});
		this.d10s = [];
	}

	getD10s() {
		return this.d10s;
	}

	addD10s(name, iAdapterIn) {
		//Check for interface implementation
		Interface.implement(iAdapterIn, iAdapter);
		this.d10s.push(
			new D10s(name, iAdapterIn.getAdapter())
		);
	}

}
