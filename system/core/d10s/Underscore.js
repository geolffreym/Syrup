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
//Handle dependencies using CommonJS
//Is Js module
var underscore = require('underscore');

//IsJs
//Exceptions
import is from './../adapter/IsJsAdapter';
import {TypeErrorException} from '../Exceptions';

//Enhanced Object Literals
//Decorators
export default {
	__proto__: underscore,

	/** Parse to Object
	 *
	 * @param {Object} element
	 * @param {Object} element2: optional
	 * @throws {TypeErrorException}
	 * @return {Object}
	 */

		toObject(element, element2 = []) {

		//Try convert JSON string
		try {
			return JSON.parse(element);
		} catch (err) {
			//Pass
		}

		//Is string or number?
		if (is.string(element) || is.number(element)) {
			return Object.prototype.valueOf.call(element);
		}

		//Is not array?
		if (!is.array(element)) {
			throw new TypeErrorException(
				'Expect the first parameter of type "String", "Number" or "Array"',
				'(Underscore .toObject)'
			);
		}

		//Is array first parameter, but invalid second parameter
		if (is.array(element) && !is.array(element2)) {
			throw new TypeErrorException(
				'Expect the second parameter of type "Array", to mix it',
				'(Underscore .toObject)'
			);
		}

		// Reduce object or mix it!!
		return element.reduce(function (o, v, i) {
			o[element2 && v || i] = element2 && element2[i] || v;
			return o;
		}, {});
	}

};

