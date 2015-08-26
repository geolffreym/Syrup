/**
 * Created by gmena on 07-26-14.
 */

'use strict';

//Development
exports.files = {
	js: {
		output: 'app/include/init',
		src:    [
			'system/base/init', // Needed do not change
			'system/lib/Map',
			'system/lib/Ajax',
			'system/lib/Workers',
			'system/lib/Template'
			// Add all the necessary modules
		]

	}
};
