/**
 * Created by gmena on 02-27-16.
 */
import Exception,{TypeErrorException} from './../Exceptions';
import Interface from './../interface/Interface';
import iD10s from './../interface/iD10s';

//Handle dependencies using ECMAScript 6 Module import
export default class D10s {

	/** Syrup dependencies injector
	 *
	 * @constructor
	 * @param {String} name
	 * @param {Object|Function} d10s
	 * @return {void}
	 */
	constructor(name, d10s) {

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

	/** Inject dependencies
	 *
	 * @constructor
	 * @param {Object} injectTo
	 * @param {Array} dependencies
	 * @return {void}
	 */
	inject(injectTo, dependencies = []) {

		if (typeof  injectTo !== 'object') {
			throw new TypeErrorException(
				'Expects first arguments to be Object.',
				'(D10s .inject)'
			);
		}

		//For each dependencie
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
		}
	}

}
