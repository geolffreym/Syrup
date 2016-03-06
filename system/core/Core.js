/**
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 *
 * @license GNU/GPL-3.0
 * {@link https://github.com/geolffreym/Syrup GitHub}
 */

//Handle dependencies using ECMAScript 6 Module import
//Exceptions
import {ReferenceErrorException} from './Exceptions';

//Interface
import Interface from './interface/Interface';
import iD10sComposite from './interface/iD10sComposite';

/**
 * Core class for internal handling
 * @class
 * @namespace
 * @version 1.0.0-alpha
 * @implements {iD10sInjectable}
 *
 * This class requires implement iD10Composite to setD10s
 * @requires module:D10sComposite
 */
export default class Core {
	/**
	 * Syrup Core
	 *
	 * @constructor
	 * @property {Object} Core.nav
	 * @property {String} Core.VERSION
	 */
	constructor() {
		/**
		 * Navigator Info
		 * @public
		 * **/
		this.nav = {
			online: window.navigator.onLine,
			local: window.navigator.userAgent.toLowerCase(),
			cookies: window.navigator.cookieEnabled,
			javascript: window.navigator.javaEnabled(),
			unsupported: !window.localStorage
		};

		/**
		 * Version
		 * @public
		 * **/
		this.VERSION = 'v1.0.0-alpha';
	}

	/**
	 * Set dependencies
	 *
	 * @this Core
	 * @param {Object} sD10s
	 * @borrows iD10sComposite as sD10s
	 */
	setD10s(sD10s) {
		//Check for interface implementation
		Interface.implement(sD10s, iD10sComposite);

		//Dependencies injection
		sD10s.inject(this, sD10s.getD10s());

	}

	/**
	 * Return dependencies
	 *
	 * @this Core
	 * @returns {Array<String>}
	 */
	getD10s() {
		return this.dependencies;
	}
	
	/**
	 * Set default locale i18n date format
	 *
	 * @this Core
	 * @param {String} locale
	 * @param {Object} setting
	 * @returns {Object}
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

	/**
	 * Return full navigator information
	 *
	 * @this Core
	 * @returns {Object}
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

	/**
	 * Validate if param is set. If not, throw msg!
	 * @this Core
	 * @param {Object} param
	 * @param {String|null} msg
	 * @param {String|null} breakpoint
	 * @throws {ReferenceErrorException}
	 * @returns {Object}
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

