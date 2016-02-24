/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';
//Constants
const ERROR = {
    INVALID_PARAM: 'Param needed',
    INVALID_NETWORK: 'Network Error',
    INVALID_OBJECT: 'A object is needed.',
    INVALID_ARRAY: 'An array is needed.',
    INVALID_STRING: 'A string is needed',
    INVALID_FUNCTION: 'A function is needed.',
    INVALID_DATE: 'Invalid Date',
    INVALID_URL: 'URL is needed.'
};

class CoreExceptions {
    /** Syrup core exceptions

     * @constructor
     */
    constructor(message, breakpoint = null) {
        this.name = 'CoreExceptions';
        this.type = Error;
        this.message = (message) + (breakpoint && (' | Method: ' + breakpoint) || '');
    }

    /**
     * Handle error by type

     * @returns {Error|*}
     * @private
     */
    _getError() {
        return new this.type(
            this.message
        );
    }

    /**Throw error

     * @return {void}
     */
    log() {
        throw (this._getError());
    }

    /**Show warning in console log

     * @return {string}
     */
    toString() {
        return this.message;
    }

}

export default class InvalidArray extends CoreExceptions {
    /** Invalid Array exception

     * @constructor
     */
    constructor(breakpoint) {
        super(ERROR.INVALID_ARRAY, breakpoint);
        //Overloading attributes
        this.name = 'InvalidArray';
        this.type = TypeError;
    }
}
