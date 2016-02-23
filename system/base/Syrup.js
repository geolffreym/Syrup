/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 25/11/13
 * Time: 12:22
 * To change this template use File | Settings | File Templates.
 */

"use strict";

//Handle dependencies
import jquery from '../../node_modules/jquery'; //Jquery Dom Traversing -> https://github.com/jquery/jquery
import underscore from '../../node_modules/underscore'; //Underscore util -> https://github.com/jashkenas/underscore
import is_js from '../../node_modules/is_js'; //Is tool helper -> https://github.com/arasatasaygin/is.js
import moment_js from '../../node_modules/moment'; //Date helper -> https://github.com/moment/moment/

//Syrup class
export default class Syrup {
	constructor () {
		//Basic attributes
		this.emptyStr = '';

		//Dependencies
		this.$ = jquery; //jquery.js
		this.is = is_js; //is.js
		this.date = moment_js; //moment.js
		this.u10s = underscore; //underscore.js

		//Native features
		this.i18n ({});
		this.native = {
			'function': Function.prototype,
			'object'  : Object.prototype
		};
	}

	/**Set default locale i18n date format
	 * @param {string} setting
	 * @return {object}
	 */
	i18n (setting) {
		var _setting = this.u10s.extend (
			{ locale: 'en' }, setting
		);

		//Set default locale setting
		this.date.locale (_setting.locale);

		//Return self
		return this;
	}


	/**Throw error
	 * @param {string} msg
	 * @param {string} breakpoint
	 * @return {void}
	 */
	error (msg, breakpoint) {
		throw (new Error (
			(msg) + (breakpoint ? ' | Method: ' + breakpoint : this.emptyStr) +
			' ( ' + this.date ().format ('MMMM Do YYYY, h:mm:ss a') + ' )'
		));
	}


	/** Validate if param is set. If not, throw msg!
	 * @param {object} param
	 * @param {string} msg
	 * @param {string} breakpoint
	 * @return {bool|object}
	 */
	assert (param, msg, breakpoint) {
		//Is set. not null or undefined and not false?
		if ( this.is.not.truthy (param) ) {
			this.error (this.is.truthy (msg) ?
							msg : 'Param needed', breakpoint
			);
		}
		//Return self
		return this;
	}

}






