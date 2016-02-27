/**
 * Created by gmena on 02-27-16.
 */

//Handle dependencies using ECMAScript 6 Module import
//Adapter for is.js library
//Adapter for underscore.js
import isJs from './adapter/IsJsAdapter';
import underscore from './adapter/UnderscoreAdapter';
import jQuery from './adapter/JQueryAdapter';
import momentJs from './adapter/MomentAdapter';
import SyrupCore from './SyrupCore';

export default class Syrup extends SyrupCore {

	/** Syrup class
	 *
	 * @constructor
	 */
	constructor() {
		super(
			jQuery, isJs,
			momentJs, underscore
		);
	}

}
