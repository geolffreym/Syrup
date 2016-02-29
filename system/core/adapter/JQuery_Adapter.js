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
var jQuery = require('jquery');

//Enhanced Object Literals
export default {
    __proto__: {},
    
    /** Proxy method for Jquery
     *
     * @param {String} selector
     * @param {Object} context
     * @return {Object}
     */
    $(selector, context) {
        //Dom traversing
        let jY = jQuery(selector, context);
        
        //Exist element?
        jY.exists = jY.length > 0;
        return jY;
    },
    
    /** Default attr getter
     *
     * @return {Object}
     */
    get constructor() {
        return jQuery.fn.constructor;
    }
    
};

