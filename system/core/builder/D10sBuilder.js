/**
 * Created by gmena on 02-27-16.
 */

//Handle dependencies using ECMAScript 6 Module import
import Builder from './../builder/Builder';
import D10s from './../provider/D10s';

export default class D10sBuilder extends Builder {

	/**
	 * Syrup D10s "Build" class
	 *
	 * @constructor
	 */
	constructor() {
		//Handle adapter
		super(D10s);
		this.d10s = {};
	}

	setD10s(d10s) {
		this.d10s = d10s;
	}

	buildD10s() {
		return this.build(
			this.name, this.d10s
		);
	}

}
