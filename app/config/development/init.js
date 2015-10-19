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
			'system/base/Lib',
			'system/base/MiddleWare',
			'system/base/Observer',
			'system/base/Require',
			'system/base/Http',
			'system/base/Repo',
			'system/base/Workers',
			'system/base/View',
			'system/base/Model',
			'system/base/App',
			'system/base/Router'
			// Until here the core do not change
			// Add all the necessary libs from here
			//'system/lib/Map'
		]
	}
};
