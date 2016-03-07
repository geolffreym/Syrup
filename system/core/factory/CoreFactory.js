/**
 * Created by gmena on 02-27-16.
 */

//D10s
import IsJs from '../../system/core/d10s/IsJs';
import U10s from '../../system/core/d10s/Underscore';
import JQuery from '../../system/core/d10s/JQuery';
import M6s from '../../system/core/d10s/Moment';

//Adapters
import Adapter from '../../system/core/adapter/Adapter';
import JQueryAdapter from '../../system/core/adapter/jQueryAdapter';

//Core
import Builder from '../../system/core/builder/Builder';
import D10s from '../../system/core/provider/D10s';
import D10sBuilder from '../../system/core/builder/D10sBuilder';
import D10sComposite from '../../system/core/composite/D10sComposite';
import Core from '../../system/core/Core';

/**
 * Factory Core
 * @class
 * @implements {iFactory}
 */
export default class CoreFactory {

	/**
	 * D10s "Factory" dependencies injector
	 *
	 * @constructor
	 * @returns {Object}
	 */
	static create() {
		'use strict';
		return new Core();
	}

}
