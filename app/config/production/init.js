/**
 * Created by gmena on 07-26-14.
 */

'use strict';

//Config
exports.files = {
	js: {
		output: 'app/include/init',
		src:    [
			'app/config/init', // Needed do not change
			'system/base/init', // Needed do not change
			'system/base/model/Module', // Needed do not change
			// Add all the necessary scripts
		]

	}
};