/**
 * Created by gmena on 07-26-14.
 */

'use strict';

//Development
exports.files = {
	js: {
		output: 'dist/init',
		src   : [
			'system/base/Syrup',
			'system/base/Observer',
			'system/base/Require',
			'system/base/Lib',
			'system/base/App',
			// Until here the core
			'system/lib/Http',
			'system/lib/Storage',
			'system/lib/Workers',
			'system/lib/View',
			// Until here libs needed do not change
			// Add all the necessary modules
			'system/lib/Map',
			'system/lib/Model'
		]
	}
};
