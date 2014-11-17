/**
 * Created by gmena on 07-26-14.
 */

'use strict';

//Development
exports.files = {
	js: {
		output: 'app/include/init',
		src:    [
			'app/config/init', // Needed do not change
			'system/base/init', // Needed do not change
			'system/base/model/Lib', // Needed do not change
			'system/base/model/Module', // Needed do not change
			'system/lib/Ajax',
			'system/lib/Workers',
			'system/lib/Repository',
			'system/lib/Template', //Dependencies Workers and Repository
			'system/lib/Socket',
			'system/lib/Shortcuts',
		    'app/modules/happyFire' // Module example
			// Add all the necessary modules
		]

	}
};
