/**
 * Created by gmena on 07-26-14.
 */


'use strict';
(function (window) {
	function Workers () {
		this.Worker = null;
		this.onsuccess = null;
	}

	//Worker event handler
	Workers.add ('on', function (event, callback) {
		var self = this;
		return event &&
			   ({
					message: function () {
						self.onsuccess = callback;
					}
				}[event] || function () {}) ()

	});

	//Set new Worker
	Workers.add ('set', function (url) {
		var self = this;
		return (new Promise (function (resolve, reject) {
			self.Worker = (new Worker (setting.system_path + url + '.min.js'));
			self.Worker.addEventListener ('message', function (e) {
				_.callbackAudit (self.onsuccess, e);
			}, false);
			resolve (self);
		}))
	});

	//Get Worker
	Workers.add ('get', function () {
		return this.Worker;
	});

	//Send Message to Worker
	Workers.add ('send', function (message) {
		this.Worker.postMessage (!!message ? message : '');
		return this;
	});

	//Kill Worker
	Workers.add ('kill', function () {
		if ( _.isSet (this.Worker) ) {
			this.Worker.terminate ();
			this.Worker = null;
		}

		return this;
	});

	//Global access
	window.Workers = Workers;

}) (window);