/**
 * Created by gmena on 02-27-16.
 */

import Interface from '../core/Interface'
import Provider from '../core/Provider'

//Handle dependencies using ECMAScript 6 Module import
export default class CoreProvider extends Provider {

	/** Syrup provider
	 *
	 * @constructor
	 */
	constructor() {
		this._dom = null;
		this._validation = null;
		this._date = null;
		this._helper = null;
	}

	setDom(_dom){

	}

	setValidation(_validation){

    }

    setDate(_date){

    }

    setHelper(_helper){

    }

	getDom() {
		return this._dom;
	}

	getValidation() {
		return this._validation;
	}

	getDate() {
		return this._date;
	}

	getHelpers() {
		return this._helper;
	}
}
