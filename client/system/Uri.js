/**
 * Created by gmena on 03-01-16.
 * Controller class for MVC support
 * @class
 *
 */

import {TypeErrorException} from '../../system/core/Exceptions';
import Interface from '../../system/core/interface/Interface';
import iController from '../../system/core/interface/iController';

export default class URIFactory {

	/**
	 * Uri constructor
	 *
	 * @constructor
	 */
	constructor(myUri) {
		this._uri = myUri;
	}

	/**
	 * URL handler
	 *
	 * @constructor
	 * @this URL
	 * @param {String} regexp
	 * @param {Object} controller
	 * @borrows iController as controller
	 */
	static create(regexp, controller) {
		//Implement controller
		Interface.implement(controller, iController);
		
		//Uri object
		let _uri = new WeakMap();
		_uri.set(regexp, controller);
		return new URI(_uri);
	}

	get uri() {
		return this._uri;
	}

}
