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

//Is Js module
var momentJs = require('moment');

//Enhanced Object Literals
export default {
    __proto__: {},
    /**Proxy for locale conf

     * @param {string} conf
     * @return {void}
     **/
    
    locale(conf) {
        momentJs.locale(conf);
    },
    
    /**Proxy for momentJs

     * @return {object}
     */
    
    get date() {
        return momentJs();
    },
    
    /**
     * Set date form for momentJs

     * @param {string} dA
     * @param {string} dB
     * @param {string} encode
     * @param {boolean} stric
     * @return {void}
     */
    moment(dA, dB, encode, stric) {
        return momentJs(dA, dB, encode, stric);
    }
    
};

