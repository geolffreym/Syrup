/**
 * Created by gmena on 03-01-16.
 */

export default class Builder {
	/** Syrup D10s "Build" class
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

	/** Build type
	 *
	 * @return {Object}
	 */
	build() {
		var _arguments = [];

		////Expect for parameters
		for (let x = 0, arg = arguments.length; x < arg; x++) {
			_arguments.push(arguments[x]);
		}

		var [a, b, c, d, e, f] = _arguments;

		////Return instance
		return new this.type(
			a, b, c, d, e, f
		);
	}
}