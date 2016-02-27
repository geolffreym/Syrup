/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

//ECMA6 Support -> node --harmony
//Jquery Dom Traversing -> https://github.com/jquery/jquery
//Underscore util -> https://github.com/jashkenas/underscore
//Is validation tool -> https://github.com/arasatasaygin/is.js
//Date helper -> https://github.com/moment/moment/

//Handle dependencies using ECMAScript 6 Module import
//import jquery from '../../node_modules/jquery';
//import underscore from '../../node_modules/underscore';
//import moment_js from '../../node_modules/moment';

//Exceptions
import {Isomorphic as i8c} from './lib/Isomorphic';
import {InvalidParam} from './base/Exceptions';

export default class SyrupCore {
	/** Syrup Core class
	 *
	 * @constructor
	 * @param {Function} jQuery Adapter
	 * @param {Object} isJs Adapter
	 * @param {Object} momentJs Adapter
	 * @param {Object} underscore Adapter
	 */
	constructor(jQuery, isJs, momentJs, underscore) {

		//Basic attributes
		this.emptyStr = '';
		this.isClient = i8c.client;

		//Dependencies injection
		this.$ = null;
		this.is = isJs; // Is.js
		this.m6s = momentJs; // Moment.js
		this.u10s = underscore; // Underscore.js

		//Client access only for nav
		//Dom traversing tool (jQuery) needed only for client side
		//Dom traversing not needed in server side
		if (this.isClient) {
			// Jquery.js
			this.$ = ((q, c)=> {
				return jQuery.$(q, c);
			});
			//Navigator Info
			this.nav = {
				online: window.navigator.onLine,
				local: window.navigator.userAgent.toLowerCase(),
				cookies: window.navigator.cookieEnabled,
				javascript: window.navigator.javaEnabled(),
				unsupported: !window.localStorage
			};
		}

		//Version
		this.VERSION = 'v1.0.0-alpha';
		//Init features
		this.i18n('es');
	}

	/** Set default locale i18n date format
	 *
	 * @param {String} locale
	 * @param {Object} setting
	 * @return {Object}
	 */
	i18n(locale, setting = {}) {

		//Set default locale setting
		this.m6s.locale(
			locale,
			setting
		);

		//Return self
		return this;
	}

	/** Return full navigator information
	 *
	 * @return (Object)
	 */
	getNav() {

		//Basic object
		let _nav = {
			nav: null,
			version: null,
			platform: null
		};

		//Can't access if not client
		if (!this.isClient) return _nav;

		//Match navigator information
		let [_matches] = this.nav.local.match(
			/(?:trident\/(?=\w.+rv:)|(?:chrome\/|firefox\/|opera\/|msie\s|safari\/))[\w.]{1,4}/
		);

		//Can't access if not client
		//Not found match for navigator info
		if (!_matches) return _nav;

		//Agent and version
		let [_agent, _version] = _matches.split('/');

		_nav.nav = _agent.replace('trident', 'msie');
		_nav.version = _version;
		_nav.platform = window.navigator.platform.toLocaleLowerCase();

		//Return the nav information
		return _nav;

	}

	/** Validate if param is set. If not, throw msg!
	 *
	 * @param {Object} param
	 * @param {String|null} breakpoint
	 * @return {Object}
	 */
	assert(param, breakpoint = null) {
		//Is set. not null or undefined and not false?
		if (this.is.not.truthy(param)) {
			throw new InvalidParam(
				breakpoint
			);
		}

		//Return self
		return this;
	}
}

