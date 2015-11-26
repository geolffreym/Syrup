/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 25/11/13
 * Time: 12:22
 * To change this template use File | Settings | File Templates.
 */
'use strict';

(function (window) {

	class Function extends Function {
		clone () {

		}

		getIndex (index) {

		}
	}

	class Syrup {
		constructor () {
			var nativeFunction = Function.prototype,
				nativeObject = Object.prototype,
				regexConstructor = /(([^function])([a-zA-z])+(?=\())/,
				regexMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;


			/**Clone a object
			 * @return object
			 * */
			nativeObject.clone = function () {
				return _.extend ({}, this);
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
				var name = (
					child.__proto__.constructor.name ||
					child.prototype.constructor.name ||
					( child.toString ().match (regexConstructor)[0]).trim ()
				);
				this.prototype[name] = child;
			};

			/** Create a custom function
			 *  @param name
			 *  @return object
			 * **/
			nativeFunction.factory = function (name) {
				return (
					new Function (
						'return function ' + name + '(){}'
					)
				) ()
			};


		}

	}

	//export default Syrup;
	module.exports = Syrup;

}) (window);
