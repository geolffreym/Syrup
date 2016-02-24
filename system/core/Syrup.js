/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

//Jquery Dom Traversing -> https://github.com/jquery/jquery
//Underscore util -> https://github.com/jashkenas/underscore
//Is validation tool -> https://github.com/arasatasaygin/is.js
//Date helper -> https://github.com/moment/moment/

//Handle dependencies using ECMAScript 6 Module import
//import jquery from '../../node_modules/jquery';
//import underscore from '../../node_modules/underscore';
//import moment_js from '../../node_modules/moment';

//Handle dependencies using CommonJs
var jquery = require('jquery'),
    momentjs = require('moment');

//Handle dependencies using ECMAScript 6 Module import
import isjs from './adapter/IsJsAdapter';
import underscore from './adapter/UnderscoreAdapter';

//Exceptions
import InvalidArray from './base/Exceptions';

export default class Syrup {
    /** Syrup class

     * @constructor
     */
    constructor() {
        
        //Basic attributes
        this.emptyStr = '';
        
        //Dependencies injection
        this.$ = jquery; // Jquery.js
        this.is = isjs; // Is.js
        this.date = momentjs; // Moment.js
        this.u10s = underscore; // Underscore.js
        
        //Init features
        this.i18n({});
        this.native = {
            'function': Function.prototype,
            'object': Object.prototype
        };
    }

    /**Set default locale i18n date format

     * @param {object} setting
     * @return {object}
     */
    i18n(setting) {
        var _setting = this.u10s.extend(
            {locale: 'en'}, setting
        );
        
        //Set default locale setting
        this.date.locale(_setting.locale);
        
        //Return self
        return this;
    }

    /**Parse to Object

     * @param {object} element
     * @param {object} element2: optional
     * @return {object}
     */
    toObject(element, element2 = {}) {
        try {
            //Is Json?
            if (this.is.json(element)) {
                return JSON.parse(element);
            }
            
            //Is string or number?
            if (this.is.string(element) || this.is.number(element)) {
                return this.native.object.valueOf.call(element);
            }
            
            //Is not array?
            if (!this.is.array(element)) {
                throw new InvalidArray('(Syrup .toObject)');
            }
            
            // Reduce object or mix it!!
            return element.reduce(function (o, v, i) {
                o[element2 && v || i] = element2 && element2[i] || v;
                return o;
            }, {});
            
        } catch (err) {
            //Log error
            err.log();
        }
    }

    /** Validate if param is set. If not, throw msg!

     * @param {object} param
     * @param {string} msg
     * @param {string} breakpoint
     * @return {bool|object}
     */
    assert(param, msg, breakpoint) {
        //Is set. not null or undefined and not false?
        if (this.is.not.truthy(param)) {
            this.error(
                this.is.truthy(msg) ?
                    msg : 'Param needed', breakpoint
            );
        }
        //Return self
        return this;
    }
}

