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
import SyrupProviderInterface from './interface/Interface_SyrupAdapter';
import IsomorphicInterface from './interface/Interface_Isomorphic';
import SyrupProvider from './provider/SyrupProvider';
import Isomorphic from './Isomorphic';

export default class Syrup {
	/** Syrup Syrup class
	 *
	 * @constructor
	 * @param {Object} sProvider
	 * @param {Object} i8c
	 */
	constructor(sProvider, i8c) {
		//Check for interface implementation
		SyrupProviderInterface.implement(sProvider, SyrupProvider);
		IsomorphicInterface.implement(i8c, Isomorphic);

		//Basic attributes
		//Is client or server?
		this.isClient = i8c.isClient();

		//Dependencies injection
		this.$ = null;
		this.is = sProvider.getIsJs(); // Is.js
		this.m6s = sProvider.getM6s(); // Moment.js
		this.u10s = sProvider.getU10s(); // Underscore.js

		//Client access only for nav
		//Dom traversing tool (jQuery) needed only for client side
		//Dom traversing not needed in server side
		if (this.isClient) {
			// Jquery.js
			this.$ = ((q, c)=> {
				return sProvider.getJQuery().$(q, c);
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

