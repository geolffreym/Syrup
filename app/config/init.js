/**
 * Created by gmena on 07-26-14.
 */

//Basic Config

var setting = {
	ajax_processor: '',
	app_path      : '/Syrup/app',
	system_path   : '/Syrup/system',
	env: 'development'
};


//Please install Node and run the command `npm install` and `npm start` to execute
//Set Environment
if ( typeof exports !== 'undefined' )
	exports.setting = setting;
