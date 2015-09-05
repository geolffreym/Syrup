/**
 * Created by gmena on 08-31-15.
 */
Syrup.add ('include', function (script, wait, callback) {
	var _url = !_.isUrl (script)
			? setting.app_path + script + '.min.js'
			: script + '.min.js',
		_script = script
			.split ('/')
			.pop ();

	if ( _.isFunction (wait) ) {
		callback = arguments[1];
		wait = false;
	}

	if ( wait && _.isSet (_.scriptCalls[wait]) ) {
		if ( !_.isSet (_.waitingCalls[wait]) ) {
			_.waitingCalls[wait] = [];
		}
		if ( _.waitingCalls[wait] !== 'done' ) {
			_.waitingCalls[wait].push (function () {
				_.include (script, callback)
			});
			return false;
		}
	}


	if ( _.isSet (_.scriptCalls[_script]) ) {
		_.callbackAudit (callback);
		return false;
	}

	_.scriptCalls[_script] = script;
	_.getScript (_url, function (e) {
		if ( _.isSet (_.waitingCalls[_script]) ) {
			if ( _.isArray (_.waitingCalls[_script]) ) {
				var i = 0,
					max = _.waitingCalls[_script].length;
				for ( ; i < max; i++ ) {
					_.waitingCalls[_script][i] (e);
				}
				_.waitingCalls[_script] = 'done';
			}
		}
		_.callbackAudit (callback);
	});
	return this;

});

