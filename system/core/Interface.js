/**
 * Created by gmena on 02-28-16.
 */
'use strict';

//Exceptions
import Exception, {TypeErrorException} from './Exceptions';

export default class Interface {

	/** Interface class
	 *
	 * @constructor
	 * @param {String} name
	 * @param {Array} methods
	 * @throws {TypeErrorException}
	 * @return {void}
	 */
	constructor(name, methods = []) {

		this.name = name;
		this.methods = [];

		//For each method
		methods.forEach((m)=> {
			if (typeof m !== 'string') {
				throw new TypeErrorException(
					'Expects method names to be passed in "Array" as a "String".',
					'(Interface .constructor)'
				);
			}

			//Save methods
			this.methods.push(m);
		});

	}

	/** Ensure implement interface declaration.
	 *
	 * @param {Object} object
	 */
	implement(object) {

		if (arguments.length < 2) {
			throw new TypeErrorException(
				'Called with ' + arguments.length + 'arguments, but expected at least 2.',
				'(Interface .implement)'
			);
		}

		//Get first argument
		for (let i = 1, len = arguments.length; i < len; i++) {

			if (!( arguments[i] instanceof Interface)) {
				throw new TypeErrorException(
					'Expects arguments two and above to be instances of Interface.',
					'(Interface .implement)'
				);
			}

			for (let _method of  arguments[i].methods) {
				if (!object[_method] || typeof object[_method] !== 'function') {
					throw new Exception(
						'Object does not implement the ' + arguments[i].name + ' interface. Method ' + _method + ' was not found.',
						'(Interface .implement)'
					);
				}
			}
		}
	}

}
