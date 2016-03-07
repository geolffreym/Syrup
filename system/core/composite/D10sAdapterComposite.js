/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';

//JQuery.js
import Adapter from './../adapter/Adapter';

export default class D10sAdapter extends Adapter {
	constructor(adapter) {
		super(adapter);
		this._adaptedList = [];
	}

	/**
	 * Return the d10s list
	 *
	 * @return {Object}
	 */
	getD10sAdapted() {
		return this._adaptedList;
	}

	/**
	 * Append iAdapter
	 *
	 * @param {Object} Adapter
	 */
	addD10sAdapter(Adapter) {
		//Check for interface implementation
		Interface.implement(Adapter, iD10s);
		this.d10s.push(D10s);
	}
}
