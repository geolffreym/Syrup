/**
 * Created by gmena on 07-26-14.
 */

'use strict';

//Development
exports.files = {
	view: {
		output: 'app/view/include/init',
		src   : [
			'app/view/libraryStore/init'
		]
	},
	core: {
		output: 'app/include/init',
		src   : [
			'system/base/Syrup',
			'system/base/Observer',
			'system/base/Lib',
			'system/base/Module',
			// Until here needed do not change
			'system/lib/Map',
			'system/lib/Ajax',
			'system/lib/Repository',
			'system/lib/Workers',
			'system/lib/Template'
			// Add all the necessary modules
		]

	}
};
