/**
 * Builder abstract
 * @class
 * @implements {iBuilder}
 */
export default class Builder {
	/**
	 * Syrup D10s "Build" class
	 *
	 * @constructor
	 */
	constructor(type) {
		//Handle adapter
		this.name = 'Builder';

		/**
		 * Type to build
		 * @protected
		 * **/
		this._type = type;
	}

	/** Set build name
	 *
	 * @param {String} name
	 */

	setName(name) {
		this.name = name;
	}

	/**
	 * Build type
	 *
	 * @returns {Object}
	 */
	build() {
		//Build instance
		return new this._type(
			...arguments
		);
	}
}
