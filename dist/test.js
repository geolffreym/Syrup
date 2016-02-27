/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by gmena on 11-27-15.
	 */
	'use strict'
	//Web parsing
	;

	var _SyrupCore = __webpack_require__(110);

	var _SyrupCore2 = _interopRequireDefault(_SyrupCore);

	var _Isomorphic = __webpack_require__(109);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//Isomorphic
	_Isomorphic.Isomorphic.export('_', _SyrupCore2.default);

/***/ },

/***/ 7:
/***/ function(module, exports) {

	/**
	 * Created with JetBrains WebStorm.
	 * User: Geolffrey Mena
	 * Date: 25/11/13
	 * Time: 12:22
	 */

	'use strict'
	//Constants
	;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ERROR = {
		INVALID_PARAM: 'One or more parameters are invalid in function',
		INVALID_NETWORK: 'Network Error',
		INVALID_OBJECT: 'An object is required as a parameter for the use of this function',
		INVALID_ARRAY: 'An array is required as a parameter for the use of this function',
		INVALID_STRING: 'An string is required as a parameter for the use of this function',
		INVALID_FUNCTION: 'An function is required as a parameter for the use of this function',
		INVALID_DATE: 'Invalid Date',
		INVALID_URL: 'URL is needed.'
	};

	var CoreExceptions = (function () {
		/** Syrup core exceptions
	  *
	  * @constructor
	  */

		function CoreExceptions(message) {
			var breakpoint = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			_classCallCheck(this, CoreExceptions);

			this.type = Error;
			this.name = 'CoreExceptions';
			this.message = message + (breakpoint && ' | Method: ' + breakpoint || '');
		}

		/** Throw error
	  *
	  * @return {void}
	  */

		_createClass(CoreExceptions, [{
			key: 'log',
			value: function log() {
				throw new this.type(this.message);
			}

			/** Show warning in console log
	  	 * @return {String}
	   */

		}, {
			key: 'toString',
			value: function toString() {
				return this.message;
			}
		}]);

		return CoreExceptions;
	})();

	exports.default = CoreExceptions;

	var InvalidArray = exports.InvalidArray = (function (_CoreExceptions) {
		_inherits(InvalidArray, _CoreExceptions);

		/** Invalid Array exception
	  *
	  * @constructor
	  */

		function InvalidArray(breakpoint) {
			_classCallCheck(this, InvalidArray);

			//Overloading attributes

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InvalidArray).call(this, ERROR.INVALID_ARRAY, breakpoint));

			_this.type = TypeError;
			_this.name = 'InvalidArray';

			return _this;
		}

		return InvalidArray;
	})(CoreExceptions);

	var InvalidParam = exports.InvalidParam = (function (_CoreExceptions2) {
		_inherits(InvalidParam, _CoreExceptions2);

		/**Invalid Array exception
	  *
	  * @constructor
	  */

		function InvalidParam(breakpoint) {
			_classCallCheck(this, InvalidParam);

			//Overloading attributes

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(InvalidParam).call(this, ERROR.INVALID_PARAM, breakpoint));

			_this2.type = ReferenceError;
			_this2.name = 'InvalidParam';

			return _this2;
		}

		return InvalidParam;
	})(CoreExceptions);

/***/ },

/***/ 11:
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },

/***/ 109:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/**
	 * Created with JetBrains WebStorm.
	 * User: Geolffrey Mena
	 * Date: 25/11/13
	 * Time: 12:22
	 */

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Isomorphic = exports.Isomorphic = (function () {
	    function Isomorphic() {
	        _classCallCheck(this, Isomorphic);
	    }

	    _createClass(Isomorphic, null, [{
	        key: 'export',

	        /** AMD with global, Node, or global
	         *
	         * @param {String} name
	         * @param {Object} Factory
	         * @return {void|Object}
	         */
	        value: function _export(name, Factory) {

	            Factory = (typeof Factory === 'undefined' ? 'undefined' : _typeof(Factory)) === 'object' && Factory || new Factory();

	            //Only for client
	            if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
	                //Typeof window !== "undefined" ? window : this
	                if (true) {
	                    // AMD. Register as an anonymous module.
	                    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	                        // Also create a global in case some scripts
	                        // that are loaded still are looking for
	                        // a global even when an AMD loader is in use.
	                        return window[name] = Factory;
	                    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	                } else {
	                    // Browser globals (root is window)
	                    return window[name] = Factory;
	                }
	            } else {
	                // Node. Does not work with strict CommonJS, but
	                // only CommonJS-like enviroments that support module.exports,
	                // like Node.
	                module.exports = Factory;
	            }
	        }
	    }, {
	        key: 'client',

	        /** Check if can access via global environment
	         *
	         * @return {Boolean}
	         */
	        get: function get() {
	            return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object';
	        }

	        /** Check if can access via CommonJs environment
	         *
	         * @return {Boolean}
	         */

	    }, {
	        key: 'server',
	        get: function get() {
	            return ( false ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object';
	        }
	    }]);

	    return Isomorphic;
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module)))

/***/ },

/***/ 110:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Created with JetBrains WebStorm.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * User: Geolffrey Mena
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Date: 25/11/13
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Time: 12:22
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */
	//ECMA6 Support -> node --harmony
	//Jquery Dom Traversing -> https://github.com/jquery/jquery
	//Underscore util -> https://github.com/jashkenas/underscore
	//Is validation tool -> https://github.com/arasatasaygin/is.js
	//Date helper -> https://github.com/moment/moment/

	//Handle dependencies using ECMAScript 6 Module import
	//import jquery from '../../node_modules/jquery';
	//import underscore from '../../node_modules/underscore';
	//import moment_js from '../../node_modules/moment';

	//Exceptions

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Isomorphic = __webpack_require__(109);

	var _Exceptions = __webpack_require__(7);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SyrupCore = (function () {
		/** Syrup Core class
	  *
	  * @constructor
	  * @param {Function} jQuery Adapter
	  * @param {Object} isJs Adapter
	  * @param {Object} momentJs Adapter
	  * @param {Object} underscore Adapter
	  */

		function SyrupCore(jQuery, isJs, momentJs, underscore) {
			_classCallCheck(this, SyrupCore);

			//Basic attributes
			this.emptyStr = '';
			this.isClient = _Isomorphic.Isomorphic.client;

			//Dependencies injection
			this.$ = null;
			this.is = isJs; // Is.js
			this.m6s = momentJs; // Moment.js
			this.u10s = underscore; // Underscore.js

			//Client access only for nav
			//Dom traversing tool (jQuery) needed only for client side
			//Dom traversing not needed in server side
			if (this.isClient) {
				// Jquery.js
				this.$ = function (q, c) {
					return jQuery.$(q, c);
				};
				//Navigator Info
				this.nav = {
					online: window.navigator.onLine,
					local: window.navigator.userAgent.toLowerCase(),
					cookies: window.navigator.cookieEnabled,
					javascript: window.navigator.javaEnabled(),
					unsupported: !window.localStorage
				};
			}

			//Version
			this.VERSION = 'v1.0.0-alpha';
			//Init features
			this.i18n({});
		}

		/** Set default locale i18n date format
	  *
	  * @param {Object} setting
	  * @return {Object}
	  */

		_createClass(SyrupCore, [{
			key: 'i18n',
			value: function i18n(setting) {
				var _setting = this.u10s.extend({ locale: 'en' }, setting);

				//Set default locale setting
				this.m6s.locale(_setting.locale);

				//Return self
				return this;
			}

			/** Return full navigator information
	   *
	   * @return (Object)
	   */

		}, {
			key: 'getNav',
			value: function getNav() {

				//Basic object
				var _nav = {
					nav: null,
					version: null,
					platform: null
				};

				//Can't access if not client
				if (!this.isClient) return _nav;

				//Match navigator information

				var _nav$local$match = this.nav.local.match(/(?:trident\/(?=\w.+rv:)|(?:chrome\/|firefox\/|opera\/|msie\s|safari\/))[\w.]{1,4}/);

				var _nav$local$match2 = _slicedToArray(_nav$local$match, 1);

				var _matches = _nav$local$match2[0];

				//Can't access if not client
				//Not found match for navigator info

				if (!_matches) return _nav;

				//Agent and version

				var _matches$split = _matches.split('/');

				var _matches$split2 = _slicedToArray(_matches$split, 2);

				var _agent = _matches$split2[0];
				var _version = _matches$split2[1];

				_nav.nav = _agent.replace('trident', 'msie');
				_nav.version = _version;
				_nav.platform = window.navigator.platform.toLocaleLowerCase();

				//Return the nav information
				return _nav;
			}

			/** Validate if param is set. If not, throw msg!
	   *
	   * @param {Object} param
	   * @param {String|null} breakpoint
	   * @return {Object}
	   */

		}, {
			key: 'assert',
			value: function assert(param) {
				var breakpoint = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

				//Is set. not null or undefined and not false?
				if (this.is.not.truthy(param)) {
					throw new _Exceptions.InvalidParam(breakpoint);
				}

				//Return self
				return this;
			}
		}]);

		return SyrupCore;
	})();

	exports.default = SyrupCore;

/***/ }

/******/ });