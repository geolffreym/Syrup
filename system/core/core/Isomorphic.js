/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';

export default class Isomorphic {

	/** Isomorphic class
	 *
	 * @constructor
	 */
	constructor() {
	}

	/** Check if can access via global environment
	 *
	 * @return {Boolean}
	 */
	isClient() {
		return typeof window === 'object';
	}

	/** Check if can access via CommonJs environment
	 *
	 * @return {Boolean}
	 */
	isServer() {
		return typeof module === 'object' &&
			typeof module.exports === 'object';
	}

	/** AMD with global, Node, or global
	 *
	 * @param {String} name
	 * @param {Object} Factory
	 * @return {void|Object}
	 */
	export(name, Factory) {

		Factory = typeof Factory === 'object' &&
			Factory || new Factory();

		//Only for client
		if (typeof window === 'object') {
			//Typeof window !== "undefined" ? window : this
			if (typeof define === 'function' && define.amd) {
				// AMD. Register as an anonymous module.
				define(function () {
					// Also create a global in case some scripts
					// that are loaded still are looking for
					// a global even when an AMD loader is in use.
					return (
						window[name] = Factory
					);
				});
			} else {
				// Browser globals (root is window)
				return (
					window[name] = Factory
				);
			}

		} else {
			// Node. Does not work with strict CommonJS, but
			// only CommonJS-like enviroments that support module.exports,
			// like Node.
			module.exports = Factory;
		}
	}

}
