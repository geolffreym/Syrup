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
		this.type = type;
	}

	/** Set build name
	 *
	 * @param {string} name
	 * @return {void}
	 */

	setName(name) {
		this.name = name;
	}

	/**
	 * Build type
	 *
	 * @return {Object}
	 */
	build() {
		//Build instance
		return new this.type(
			...arguments
		);
	}
}