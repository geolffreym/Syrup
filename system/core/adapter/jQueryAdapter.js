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

//JQuery.js
import Adapter from './Adapter';
/**
 * Class Jquery Adapter.
 *
 * @class
 * @implements {iAdapter}
 */
export default class JQueryAdapter extends Adapter {
	constructor(adapter) {
		super((q, c)=> adapter.$(q, c));
	}
}
