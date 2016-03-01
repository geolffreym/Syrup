/**
 * Created by gmena on 02-27-16.
 */
import D10s from './../provider/D10s';

//Handle dependencies using ECMAScript 6 Module import
export default class D10sFactory {

	/** Syrup dependencies injector factory
	 *
	 * @constructor
	 * @param {String} name
	 * @param {Object|Function} d10s
	 * @return {Object}
	 */
	static create(name = 'D10s', d10s = {}) {
		return new D10s(name, d10s);
	}

}
