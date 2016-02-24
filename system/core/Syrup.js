/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';

//Jquery Dom Traversing -> https://github.com/jquery/jquery
//Underscore util -> https://github.com/jashkenas/underscore
//Is validation tool -> https://github.com/arasatasaygin/is.js
//Date helper -> https://github.com/moment/moment/

//Handle dependencies using ECMAScript 6 Module import
//import jquery from '../../node_modules/jquery';
//import underscore from '../../node_modules/underscore';
//import is_js from '../../node_modules/is_js';
//import moment_js from '../../node_modules/moment';

//Handle dependencies using CommonJs
var jquery = require ('jquery'),
	underscore = require ('underscore'),
	isJs = require ('is_js'),
	momentJs = require ('moment');

//Syrup class
export default class Syrup {
	constructor () {
		//Basic attributes
		this.emptyStr = '';

		//Dependencies
		this.$ = jquery; // Jquery jquery.js
		this.is = isJs; // Is is.js
		this.date = momentJs; // Moment moment.js
		this.u10s = underscore; // Underscore underscore.js

		//Init features
		this.i18n ({});
	}

	/**Set default locale i18n date format
	 * @param {object} setting
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
			this.error (
				this.is.truthy (msg) ?
					msg : 'Param needed', breakpoint
			);
		}
		//Return self
		return this;
	}

}

