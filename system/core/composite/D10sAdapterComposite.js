/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';

//JQuery.js
import Interface from './../interface/Interface';
import iAdapter from './../interface/iAdapter';
import Adapter from './../adapter/Adapter';

/**
 * D10s composite adapters
 * @class
 * @implements {iD10sAdapterComposite}
 *
 * This class requires implement Adapter to addD10sAdapter
 * @requires module:Adapter
 */
export default class D10sAdapterComposite extends Adapter {
	constructor(adapter) {
		super(adapter);
		/**
		 * Adapted lists
		 * @protected
		 * **/
		this._adaptedList = [];
	}

	/**
	 * Return the d10s adapted list
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
		Interface.implement(Adapter, iAdapter);
		this._adaptedList.push(Adapter.getAdapted());
	}
}
