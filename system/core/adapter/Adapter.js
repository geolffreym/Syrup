/**
 * Created by gmena on 02-27-16.
 */
import {TypeErrorException} from './../Exceptions';

//Handle dependencies using ECMAScript 6 Module import
export default class Adapter {

	/** Syrup "Adapter" class
	 *
	 * @constructor
	 * @param {Object|Function} adapter
	 */
	constructor(adapter) {
		//Validate type
		if (typeof  adapter !== 'object' && typeof adapter !== 'function') {
			throw new TypeErrorException(
				'Expects first arguments to be instances of Object or Function.',
				'(Adapter .constructor)'
			);
		}
		//Handle adapter
		this.adapter = adapter;
	}

	/** Return the adapter
	 *
	 * @constructor
	 * @return {Object|Function}
	 */
	get object() {
		return this.adapter;
	}
}
