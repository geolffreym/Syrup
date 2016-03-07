/**
 * Created by gmena on 02-27-16.
 */
import Exception,{TypeErrorException} from './../Exceptions';
import Interface from './../interface/Interface';
import iD10sInjectable from './../interface/iD10sInjectable';

//Handle dependencies using ECMAScript 6 Module import
export default class D10s {

	/**
	 * Syrup dependencies injector
	 *
	 * @constructor
	 * @this D10s
	 * @param {String} name
	 * @param {Object|Function} d10s
	 */
	constructor(name = 'D10s', d10s = {}) {

		if (typeof name !== 'string') {
			throw new TypeErrorException(
				'Expects name to be passed as a "String".',
				'(D10s .constructor)'
			);
		}

		if (typeof  d10s !== 'object' && typeof d10s !== 'function') {
			throw new TypeErrorException(
				'Expects first arguments to be instances of Object or Function.',
				'(Adapter .constructor)'
			);
		}

		this.name = name;
		this.d10s = d10s;
	}

	/**
	 * Inject dependencies
	 *
	 * @this D10s
	 * @param {Object} injectTo
	 * @param {Array} dependencies
	 */
	inject(injectTo, dependencies = []) {

		//Expects first arguments to be iD10sInjectable
		Interface.implement(injectTo, iD10sInjectable);

		/**
		 * Assign dependencies attribute
		 * @property {Array} iInjectable.dependencies
		 * **/
		injectTo._dependencies = [];

		//For each dependencies
		for (var at in dependencies) {

			//Check for valid interface!!
			if (!(dependencies[at] instanceof D10s)) {
				throw new TypeErrorException(
					'Expects arguments two and above to be instances of D10s.',
					'(D10s .inject)'
				);
			}

			//Inject dependencies
			injectTo[dependencies[at].name] = dependencies[at].d10s;
			injectTo._dependencies.push(dependencies[at].name);

		}
	}

}
