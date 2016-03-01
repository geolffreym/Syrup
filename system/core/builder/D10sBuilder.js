/**
 * Created by gmena on 02-27-16.
 */

//Handle dependencies using ECMAScript 6 Module import
import D10s from './../provider/D10s';

export default class D10sBuilder {

	/** Syrup D10s "Build" class
	 *
	 * @constructor
	 */
	constructor() {
		//Handle adapter
		this.name = 'D10sBuild';
		this.d10s = {};
	}

	setD10sName(name) {
		this.name = name;
	}

	setD10s(d10s) {
		this.d10s = d10s;
	}

	build() {
		return new D10s(
			this.name, this.d10s
		);
	}

}
