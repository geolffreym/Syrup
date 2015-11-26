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
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Created with JetBrains PhpStorm.
	 * User: Geolffrey
	 * Date: 25/11/13
	 * Time: 12:22
	 * To change this template use File | Settings | File Templates.
	 */
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	(function (window) {
		var Function = (function (_Function) {
			_inherits(Function, _Function);

			function Function() {
				_classCallCheck(this, Function);

				return _possibleConstructorReturn(this, Object.getPrototypeOf(Function).apply(this, arguments));
			}

			_createClass(Function, [{
				key: 'clone',
				value: function clone() {}
			}]);

			return Function;
		})(Function);

		var Syrup = function Syrup() {
			_classCallCheck(this, Syrup);

			var nativeFunction = Function.prototype,
			    nativeObject = Object.prototype,
			    regexConstructor = /(([^function])([a-zA-z])+(?=\())/,
			    regexMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

			/**Clone a object
	   * @return object
	   * */
			nativeObject.clone = function () {
				return _.extend({}, this);
			};

			/**Get a index
	   * @param index
	   * @return null|string|int
	   * */
			nativeObject.getIndex = function (index) {
				return index in this ? this[index] : null;
			};

			/** Extend a function
	   *  @param child
	   *  @return void
	   * **/
			nativeFunction.blend = function (child) {
				var name = child.__proto__.constructor.name || child.prototype.constructor.name || child.toString().match(regexConstructor)[0].trim();
				this.prototype[name] = child;
			};

			/** Create a custom function
	   *  @param name
	   *  @return object
	   * **/
			nativeFunction.factory = function (name) {
				return new Function('return function ' + name + '(){}')();
			};
		};

		//export default Syrup;

		module.exports = Syrup;
	})(window);

/***/ }
/******/ ]);