/**
 * Created by gmena on 07-26-14.
 */

'use strict';

//require ('../../../system/base/Syrup');
//require ('../../../system/base/Lib');
//require ('../../../system/base/MiddleWare');
//require ('../../../system/base/Require');
//require ('../../../system/base/Http');
//require ('../../../system/base/Repo');
//require ('../../../system/base/Workers');
//require ('../../../system/base/View');
//require ('../../../system/base/Model');
//require ('../../../system/base/App');

////Development
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
			// Until here the core do not change
			// Add all the necessary libs from here
			'system/lib/Router',
			'system/lib/Hash'
		]
	}
};
