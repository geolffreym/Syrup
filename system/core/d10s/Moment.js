/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';
/**
 * IsJS adapter, to add additional features
 * */

//Is Js module
var momentJs = require('moment');

/**Enhanced Object Literals
 * @mixes momentJs
 */
const m6s = {
	__proto__: {},
	/**
	 * Proxy for locale conf
	 *
	 * @param {String} conf
	 * @return {void}
	 **/

		locale(conf) {
		momentJs.locale(conf);
	},

	/**
	 * Return momentJs object
	 *
	 * @return {Object}
	 */

	get date() {
		return momentJs();
	},

	/**
	 * Set date for momentJs
	 *
	 * @param {String} dA
	 * @param {String} dB
	 * @param {String} encode
	 * @param {Boolean} strict
	 * @return {void}
	 */

		moment(dA, dB, encode, strict) {
		return momentJs(dA, dB, encode, strict);
	}

};

//Export
export default m6s;
