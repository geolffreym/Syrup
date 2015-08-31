/**
 * Created by gmena on 05-12-14.
 */
/**Files
 * @param persist
 * @param bytes_amount
 * @constructor
 */

"use strict";
var Files,
	WARNING_FILE = {
		ERROR: {
			NO_PARAM          : 'Param needed',
			NO_CALLBACK       : 'Callback Needed',
			NO_DIRECTORY      : 'The directory mut be a string',
			NO_FILE           : 'The param mut be a [object FileEntry]',
			NO_DIRECTORY_ENTRY: 'The param must be [object DirectoryEntry]'
		}
	};
Files = function (persist, bytes_amount) {
	var _w = window,
		_n = navigator,
		_proto = this.__proto__;

	this.bytes = 0;
	this.callback = null;
	this.persist = +persist;
	this.unsupported = false;
	this.requestFile = (
						   _.isSet (_w.webkitRequestFileSystem)
						   && _w.webkitRequestFileSystem
					   )
					   || (
						   _.isSet (_w.mozRequestFileSystem)
						   && _w.mozRequestFileSystem
					   )
					   || (
						   _.isSet (_w.requestFileSystem)
						   && _w.requestFileSystem
					   );

	this.storageInfo = (
						   this.persist === 1
							   ? _n.webkitPersistentStorage
							   : _n.webkitTemporaryStorage
					   )
					   || _n.mozStorageInfo || _n.storageInfo;

	if ( !_.isSet (bytes_amount) ) {
		this.bytes = 0x5 * 0x400 * 0x400;
	}

	/**Callback File
	 *@param callback
	 */
	_proto.setCallback = function (callback) {
		_.assert (callback, WARNING_FILE.ERROR.NO_CALLBACK);
		this.callback = callback;
	};


	/**@private
	 * @param param
	 */
	_proto._ready = function (param) {
		_.assert (param, WARNING_FILE.ERROR.NO_PARAM);
		_.callbackAudit (this.callback, param);
	};

	/**Error Handler
	 * @param error
	 * @return String
	 */
	_proto.error = function (error) {

		var _error = {
			10: 'QUOTA_EXCEEDED_ERR',
			1 : 'NOT_FOUND_ERR',
			2 : 'SECURITY_ERR',
			9 : 'INVALID_MODIFICATION_ERR',
			7 : 'INVALID_STATE_ERR',
			0 : 'NOT_SUPPORT_FILE_SYSTEM'
		};

		_.callbackAudit (this.callback, _.isSet (_error[error.code])
			? _error[error.code] : 'UNKNOWN_ERROR');
	};

	/**Request File System
	 * @param callback
	 */
	_proto.request = function (callback) {
		var _self = this;
		_self.setCallback (callback);

		if ( !_.isSet (_self.storageInfo) || !_.isSet (_self.requestFile) ) {
			_self.unsupported = true;
			_self._ready ('NOT_SUPPORT_FILE_SYSTEM');
			return;
		}

		_self.storageInfo.requestQuota (_self.bytes, function (gbytes) {
			_self.requestFile.apply (window, [
				_self.persist, gbytes, function (fileSystem) {
					_self._ready (fileSystem);
				}, function (e) {
					_self.error (e)
				}
			]);
		}, function (e) {
			_self.error (e)
		})

	};

	/**Read Directory
	 * @param directoryEntry
	 * @param callback
	 */
	_proto.readDirectory = function (directoryEntry, callback) {
		var _self = this,
			_reader;

		_self.request (function (e) {
			_self.setCallback (callback);
			if ( !_.is_directory (directoryEntry) ) {
				if ( _.isFunction (directoryEntry) ) {
					callback = directoryEntry;
				}
				directoryEntry = e.root;
			}
			_reader = directoryEntry.createReader ();
			_reader.readEntries (function (e) {
				_self._ready (e);
			}, function (e) {
				_self.error (e)
			})
		});
	};

	/**Get Directory
	 * @param dirString
	 * @param conf
	 * @param callback
	 */
	_proto.getDirectory = function (dirString, conf, callback) {
		if ( !_.isString (dirString) ) {
			_.error (WARNING_FILE.ERROR.NO_DIRECTORY);
		}

		if ( _.isFunction (conf) ) {
			callback = conf;
			conf = {};
		}

		var _self = this;
		_self.request (function (e) {
			_self.setCallback (callback);
			if ( _self.unsupported ) {
				_self._ready (e);
			} else {
				if ( _.isSet (e.root) ) {
					e.root.getDirectory (dirString, conf, function (result) {
						_self._ready (result);
					}, function (e) {
						_self.error (e)
					});
				}
			}
		});
	};

	/**Create Directory
	 * @param name
	 * @param callback
	 */
	_proto.createDirectory = function (name, callback) {
		this.getDirectory (name, { create: true, exclusive: true }, callback)
	};

	/**Get File
	 * @param directoryEntry
	 * @param file
	 * @param conf
	 * @param callback
	 */
	_proto.getFile = function (directoryEntry, file, conf, callback) {
		var _self = this;

		_self.request (function (e) {
			if ( _.isFunction (conf) ) {
				callback = conf;
				conf = {};
			}

			if ( _.isFunction (file) ) {
				callback = file;
			}

			if ( !_.is_directory (directoryEntry) ) {
				file = directoryEntry;
				directoryEntry = e.root;
			}

			_self.setCallback (callback);
			directoryEntry.getFile (file, conf, function (e) {
				_self._ready (e);
			}, function (e) {
				_self.error (e)
			});
		})
	};

	/**Write File
	 * @param fileEntry
	 * @param content
	 * @param callback
	 */
	_proto.writeFile = function (fileEntry, content, callback) {
		if ( !_.is_file (fileEntry) ) {
			_.error (WARNING_FILE.ERROR.NOFILE);
		}
		var _self = this;
		_self.setCallback (callback);
		if ( _.isSet (content) ) {
			fileEntry.createWriter (function (writer) {
				var blob = new Blob ([content.data], { type: content.type });
				writer.write (blob);
				_self._ready (fileEntry);
			}, function (e) {
				_self.error (e)
			})
		}
	};

	/**Red File
	 * @param fileEntry
	 * @param callback
	 */
	_proto.readFile = function (fileEntry, callback) {
		if ( !_.is_file (fileEntry) ) {
			_.error (WARNING_FILE.ERROR.NOFILE);
		}

		var _reader = new FileReader;
		_reader.addEventListener ('load', callback);
		fileEntry.file (function (content) {
			_reader.readAsText (content)
		});

	};

	/**Move File
	 * @param fileEntry
	 * @param directoryString
	 * @param newName
	 * @param callback
	 */
	_proto.moveFile = function (fileEntry, directoryString, newName, callback) {
		if ( !_.is_file (fileEntry) ) {
			_.error (WARNING_FILE.ERROR.NOFILE);
		}

		if ( !_.isString (directoryString) ) {
			_.error (WARNING_FILE.ERROR.NO_DIRECTORY);
		}

		if ( _.isFunction (newName) ) {
			callback = newName;
			newName = 'new_file' + (
					new Date
				).getTime ();
		}

		var _self = this;
		_self.getDirectory (directoryString, function (directoryEntry) {
			_self.setCallback (callback);
			fileEntry.moveTo (directoryEntry, newName, callback, function (e) {
				_self.error (e)
			});
		}, false);
	};

	/**Create File
	 * @param directoryEntry
	 * @param name
	 * @param callback
	 */
	_proto.createFile = function (directoryEntry, name, callback) {
		if ( !_.is_directory (directoryEntry) ) {
			name = directoryEntry;
			directoryEntry = false;
		}
		var _self = this;
		_self.getFile (directoryEntry, name, {
			create   : true,
			exclusive: true
		}, function (e) {
			_self.setCallback (callback);
			_self._ready (e);
		})
	};

	/***Remove File or Directory
	 * @param Entry
	 * @param callback
	 */
	_proto.remove = function (Entry, callback) {
		if ( !_.is_file (Entry) && !_.is_directory (Entry) ) {
			_.error (WARNING_FILE.ERROR.NOFILE);
		}

		var _self = this;
		_self.setCallback (callback);
		Entry.remove (function (e) {
			_self._ready (e);
		}, function (e) {
			_self.error (e)
		});

	};

	/**Remove all in directory
	 * @param directoryEntry
	 * @param callback
	 * @param noDirectory
	 */
	_proto.removeAll = function (directoryEntry, callback, noDirectory) {
		if ( !_.is_directory (directoryEntry) ) {
			_.error (WARNING_FILE.ERROR.NO_DIRECTORY_ENTRY);
		}
		var _self = this;
		_self.setCallback (callback);
		if ( directoryEntry.fullPath === '/' || noDirectory ) {
			_self.readDirectory (directoryEntry, function (e) {
				_.each (e, function (entry) {
					_self.remove (entry, false);
				});
				_self._ready (e);
			});
			return;
		}

		directoryEntry.removeRecursively (function (e) {
			_self._ready (e);
		}, function (e) {
			_self.error (e)
		});
	};

};

Syrup.blend (Files);


