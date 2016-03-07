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
	 * @this Builder
	 */
	constructor(type) {
		//Handle adapter
		this.name = 'Builder';

		/**
		 * Type to build
		 * @type {Array}
		 * @protected
		 * **/
		this._type = type;
	}

	/** Set build name
	 *
	 * @this Builder
	 * @param {String} name
	 */

	setName(name) {
		this.name = name;
	}

	/**
	 * Build type
	 *
	 * @this Builder
	 * @returns {Object}
	 */
	build() {
		//Build instance
		return new this._type(
			...arguments
		);
	}
}
