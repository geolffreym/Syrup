/**
 * Created by gmena on 02-27-16.
 */
import D10s from './../provider/D10s';
import Adapter from './../adapter/Adapter';

/**
 * Factory D10s
 * @class
 * @implements {iFactory}
 */
export default class D10sFactory {

	/**
	 * D10s "Factory" dependencies injector
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
