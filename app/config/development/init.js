/**
 * Created by gmena on 07-26-14.
 */

'use strict';

//Development
exports.files = {
	js: {
		output: 'app/include/init',
		src   : [
			'system/base/Syrup',
			'system/base/Observer',
			'system/base/Require',
			'system/base/Lib',
			'system/base/App',
			'system/lib/Http',
			'system/lib/Repository',
			'system/lib/Workers',
			'system/lib/Template',
			// Until here needed do not change
			// Add all the necessary modules
			'system/lib/Map',
			'system/lib/Form'
		]
	}
};
