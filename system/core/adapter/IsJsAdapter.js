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

//JQuery
import jQuery  from './JQueryAdapter';

//Enhanced Object Literals
export default {
	__proto__: isJs,
	
	get not() {
		this.is_not = true;
		return this;
	},
	
	/**Is html?
	     * @param {string} html
	     * @return {boolean}
	     */
	html(html)    {
		let result = /(<([^>]+)>)/ig.test(html);
		return this.is_not ? !result : result;
	},
	
	/**Is Jquery Object?
	     * @param obj
	     * @returns {boolean}
	     */
	$(obj = {}) {
		let result = (jQuery.constructor === obj.constructor);
		return this.is_not ? !result : result;
	}
};

