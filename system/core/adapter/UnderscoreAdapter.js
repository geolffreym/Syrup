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
import is from './IsJsAdapter';
import {InvalidArray} from '../base/Exceptions';

//Enhanced Object Literals
export default {
    __proto__: underscore,
    
    /** Parse to Object
	 *
	 * @param {Object} element
	 * @param {Object} element2: optional
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
            throw new InvalidArray('(Underscore .toObject)');
        }
        
        // Reduce object or mix it!!
        return element.reduce(function (o, v, i) {
            o[element2 && v || i] = element2 && element2[i] || v;
            return o;
        }, {});
    }
    
};

