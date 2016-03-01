/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

//ECMA Script 6 Support -> node --harmony
//Jquery Dom Traversing -> https://github.com/jquery/jquery
//Underscore util -> https://github.com/jashkenas/underscore
//Is validation tool -> https://github.com/arasatasaygin/is.js
//Date helper -> https://github.com/moment/moment/

//Handle dependencies using ECMAScript 6 Module import
//Exceptions
import {ReferenceErrorException} from './Exceptions';

//Interface
import Interface from './interface/Interface';
import iCoreD10s from './interface/iCoreD10s';

export default class Core {
	/** Syrup Core
	 *
	 * @constructor
	 */
	constructor() {
		//Navigator Info
		this.nav = {
			online: window.navigator.onLine,
			local: window.navigator.userAgent.toLowerCase(),
			cookies: window.navigator.cookieEnabled,
			javascript: window.navigator.javaEnabled(),
			unsupported: !window.localStorage
		};

		//Version
		this.VERSION = 'v1.0.0-alpha';
	}

	/** Set dependencies
	 *
	 * @param {iCoreD10s} sD10s
	 * @return {void}
	 */
	setD10s(sD10s) {
		//Check for interface implementation
		Interface.implement(sD10s, iCoreD10s);

		//Dependencies injection
		sD10s.inject(this, sD10s.getD10s());

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
	 * @param {String|null} msg
	 * @param {String|null} breakpoint
	 * @throws {ReferenceErrorException}
	 * @return {Object}
	 */
	assert(param, msg, breakpoint = null) {
		//Is set. not null or undefined and not false?
		if (this.is.not.truthy(param)) {
			throw new ReferenceErrorException(
				msg, breakpoint
			);
		}

		//Return self
		return this;
	}
}

