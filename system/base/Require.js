/**
 * Created by gmena on 08-31-15.
 */
"use strict";

function Require () {
	this.scriptCalls = {};
	this.waitingCalls = {};
}

/** Wait for a script to execute
 * @param script
 * @param callback
 * @param conf
 * @return bool
 * */
Require.add ('toWait', function (script, callback, conf) {
	var _self = this;

	if ( _.isSet (conf) ) {
		if ( 'wait' in conf ) {
			if ( _.isSet (_self.scriptCalls[conf.wait]) ) {

				if ( !_.isSet (_self.waitingCalls[conf.wait]) ) {
					_self.waitingCalls[conf.wait] = [];
				}

				if ( _self.waitingCalls[conf.wait] !== 'done' ) {
					_self.waitingCalls[conf.wait].push (function () {
						_self.request (script, callback)
					});
					return true;
				}
			}
		}
	}
	return false;
});

/** Request the file
 * @param script
 * @param callback
 * @param object
 * @return object
 * */
Require.add ('request', function (script, callback, conf) {
	var _self = this,
		_url = !_.isUrl (script)
			? setting.app_path + script + '.min.js'
			: script + '.min.js',
		_script = script
			.split ('/')
			.pop ();

	// Wait for a script
	if ( _self.toWait (script, callback, conf) )
		return false;


	// Is the script in the list?
	if ( _.isSet (_self.scriptCalls[_script]) ) {
		_.callbackAudit (callback);
		return false;
	}

	// Request the script
	_self.scriptCalls[_script] = script;
	_.getScript (_url, function (e) {
		if ( _.isSet (_self.waitingCalls[_script]) ) {
			if ( _.isArray (_self.waitingCalls[_script]) ) {
				var i = 0,
					max = _self.waitingCalls[_script].length;
				for ( ; i < max; i++ ) {
					_self.waitingCalls[_script][i] (e);
				}
				_self.waitingCalls[_script] = 'done';
			}
		}
		_.callbackAudit (callback);
	});

	return this;
});


window.Require = new Require;

