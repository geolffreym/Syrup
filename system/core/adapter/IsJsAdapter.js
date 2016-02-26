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
var isJs = require('is_js');

//Enhanced Object Literals
export default {
    __proto__: isJs,
    
    /**Is html?
     * @param {string} html
     * @return {boolean}
     */
    html(html)    {
        return /(<([^>]+)>)/ig.test(html);
    }
    
};

