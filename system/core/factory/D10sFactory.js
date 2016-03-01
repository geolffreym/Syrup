/**
 * Created by gmena on 02-27-16.
 */
import D10s from './../provider/D10s';
import Adapter from './../adapter/Adapter';

//Handle dependencies using ECMAScript 6 Module import
export default class D10sFactory {

	/** Syrup "Factory" dependencies injector
	 *
	 * @constructor
	 * @param {String} name
	 * @param {Object|Function} d10s
	 * @return {Object}
	 */
	static create(name = 'D10s', d10s = {}) {
		//Return new object
		return new D10s(
			name, d10s
		);
	}

}
