/**
 * Created by gmena on 02-27-16.
 */

//Handle dependencies using ECMAScript 6 Module import
import Builder from './../builder/Builder';
import D10s from './../provider/D10s';
import iAdapter from './../interface/iAdapter';
import Interface from './../interface/Interface';

/**
 * D10s builder
 * @class
 * @implements {iBuilder}
 *
 * This class requires implement iAdapter to setD10s
 * @requires module:Adapter
 */
export default class D10sBuilder extends Builder {

	/**
	 * Syrup D10s "Build" class
	 *
	 * @constructor
	 * @augments Builder
	 */
	constructor() {
		//Handle adapter
		super(D10s);
		this.d10s = {};
	}

	setD10s(Adapter) {
		Interface.implement(Adapter, iAdapter);
		this.d10s = Adapter.getAdapted();
	}

	buildD10s() {
		return this.build(
			this.name, this.d10s
		);
	}

}
