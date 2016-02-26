/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';
//Constants
const ERROR = {
	INVALID_PARAM: 'One or more parameters are invalid in function',
	INVALID_NETWORK: 'Network Error',
	INVALID_OBJECT: 'An object is required as a parameter for the use of this function',
	INVALID_ARRAY: 'An array is required as a parameter for the use of this function',
	INVALID_STRING: 'An string is required as a parameter for the use of this function',
	INVALID_FUNCTION: 'An function is required as a parameter for the use of this function',
	INVALID_DATE: 'Invalid Date',
	INVALID_URL: 'URL is needed.'
};

export default class CoreExceptions {
    /** Syrup core exceptions

     * @constructor
     */
    constructor(message, breakpoint = null) {
	this.type = Error;
	this.name = 'CoreExceptions';
	this.message = (message
	) + (breakpoint && (' | Method: ' + breakpoint
	) || ''
	);
    }

    /**Throw error

     * @return {void}
     */
    log() {
	throw (new this.type(
	this.message
	)
	);
    }

    /**Show warning in console log

     * @return {string}
     */
    toString() {
	return this.message;
    }

}

export class InvalidArray extends CoreExceptions {
    /** Invalid Array exception

     * @constructor
     */
    constructor(breakpoint) {
	super(ERROR.INVALID_ARRAY, breakpoint);
	//Overloading attributes
	this.type = TypeError;
	this.name = 'InvalidArray';
	
}
}

export class InvalidParam extends CoreExceptions {
    /** Invalid Array exception

     * @constructor
     */
    constructor(breakpoint) {
	super(ERROR.INVALID_PARAM, breakpoint);
	//Overloading attributes
	this.type = ReferenceError;
	this.name = 'InvalidParam';
	
}
}

