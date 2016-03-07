/**
 * Created by gmena on 03-01-16.
 * Controller class for MVC support
 * @class
 *
 */

import D10s from '../../system/core/factory/D10sFactory.js';
import D10sComposite from '../../system/core/composite/D10sComposite';

import Interface from '../../system/core/interface/Interface';
import iCore from '../../system/core/interface/iCore';
import iD10sComposite from '../../system/core/interface/iD10sComposite';

export default class Controller {

	/**
	 * Controller constructor
	 *
	 * @constructor
	 */
	constructor() {
		/**
		 * The core object
		 * @public
		 * @type {Object}
		 */
		this.c2e = null;
		this.d10sC = null;

	}

	static asView() {
		return this;
	}

	/**
	 * Set Core object
	 *
	 * @this Controller
	 * @param {Object} C2e
	 * @borrows iCore as C2e
	 */
	static setC2e(C2e) {
		Interface.implement(C2e, iCore);
		this.c2e = C2e;
	}

	/**
	 * Set d10sC object
	 *
	 * @this Controller
	 * @param {Object} d10sC
	 * @borrows iD10sComposite as d10sC
	 */
	static setD10sC(d10sC) {
		Interface.implement(d10sC, iD10sComposite);
		this.d10sC = d10sC;
	}

	static _build() {

	}
}
