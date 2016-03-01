/**
 * Created by gmena on 02-28-16.
 */
'use strict';

//Exceptions
import Exception, {TypeErrorException} from './../Exceptions';

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
	static implement(object) {

		if (arguments.length < 2) {
			throw new Exception(
				'Called with ' + arguments.length + 'arguments, but expected at least 2.',
				'(Interface .implement)'
			);
		}

		//For each interfaces!!!!!!!!
		for (let i = 1, len = arguments.length; i < len; i++) {

			//Check for valid interface!!
			if (!(arguments[i] instanceof Interface)) {
				throw new TypeErrorException(
					'Expects arguments two and above to be instances of Interface.',
					'(Interface .implement)'
				);
			}

			//Find method in object
			for (let j = 0, methodsLen = arguments[i].methods.length; j < methodsLen; j++) {
				if (typeof object[arguments[i].methods[j]] !== 'function') {
					throw new Exception(
						'Object does not implement the ' + arguments[i].name + ' interface. Method ' + arguments[i].methods[j] + ' was not found.',
						'(Interface .implement)'
					);
				}
			}
		}
	}

}
