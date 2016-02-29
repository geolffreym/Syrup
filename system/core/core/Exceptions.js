/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';
export default class Exception {
	/** Syrup core exceptions
	 *
	 * @constructor
	 */
	constructor(message, breakpoint = null) {
		this.type = Error;
		this.message = (message) + (breakpoint && (' | Method: ' + breakpoint) || ''   );
	}

	/** Throw error
	 *
	 * @return {void}
	 */
	log() {
		throw (new this.type(
			this.message
		));
	}

	/** Show warning in console log

	 * @return {String}
	 */
	toString() {
		return this.message;
	}

}

export class TypeErrorException extends Exception {
	/** Invalid Type exception
	 *
	 * @constructor
	 * @param {String} msg
	 * @param {String} breakpoint
	 * @return {void}
	 */
	constructor(msg, breakpoint) {
		super(msg, breakpoint);
		//Overloading attributes
		this.type = TypeError;

	}
}

export class ReferenceErrorException extends Exception {
	/**Invalid Reference exception
	 *
	 * @constructor
	 * @param {String} msg
	 * @param {String} breakpoint
	 * @return {void}
	 */
	constructor(msg, breakpoint) {
		super(msg, breakpoint);
		//Overloading attributes
		this.type = ReferenceError;
	}
}

