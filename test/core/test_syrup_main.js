/**
 * Created by gmena on 02-26-16.
 */

//D10s
import IsJs from '../../system/core/d10s/IsJs';
import U10s from '../../system/core/d10s/Underscore';
import JQuery from '../../system/core/d10s/JQuery';
import M6s from '../../system/core/d10s/Moment';

//Adapters
import Adapter from '../../system/core/adapter/Adapter';
import JQueryAdapter from '../../system/core/adapter/jQueryAdapter';

//Core
import Builder from '../../system/core/builder/Builder';
import D10s from '../../system/core/provider/D10s';
import D10sBuilder from '../../system/core/builder/D10sBuilder';
import D10sComposite from '../../system/core/composite/D10sComposite';
import Core from '../../system/core/Core';

//Interface
import Interface from '../../system/core/interface/Interface';
import iD10sInjectable from '../../system/core/interface/iD10sInjectable';

describe('Syrup.core', function () {

	'use strict';
	//Adapters
	var _isJs = new Adapter(IsJs);
	var _moment = new Adapter(M6s);
	var _u10s = new Adapter(U10s);
	var _jquery = new JQueryAdapter(JQuery);

	//The Provider
	var _d10sBuilder = new D10sBuilder();
	var _d10sCore = new D10sComposite();

	//JQuery Builder
	_d10sBuilder.setName('$');
	_d10sBuilder.setD10s(_jquery);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//IsJs Builder
	_d10sBuilder.setName('is');
	_d10sBuilder.setD10s(_isJs);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Moment Builder
	_d10sBuilder.setName('m6s');
	_d10sBuilder.setD10s(_moment);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Underscore Builder
	_d10sBuilder.setName('u10s');
	_d10sBuilder.setD10s(_u10s);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//The core
	var _core;

	//Custom matcher
	beforeEach(function () {
		jasmine.addMatchers({
			toBeInstantiable: function (util, customEqualityTesters) {
				return {
					compare: function (Actual, expected) {
						try {
							new Actual;
							return {pass: true};
						} catch (e) {
							return {
								message: 'Expected ' + expected + ' be an instantiable type'
							};
						}
					}
				};
			}
		});
	});

	it('should be instantiable', function () {
		expect(Core).toBeInstantiable('CoreClass');
		_core = new Core();
	});

	it('should be iD10sInjectable', function () {
		var _implement = function () {
			Interface.implement(_core, iD10sInjectable);
		};

		expect(_implement).not.toThrow();
		_core.setD10s(_d10sCore);

	});

	it('should show version', function () {
		expect(_core.VERSION).toBeDefined();
		expect(_core.VERSION).toEqual(jasmine.any(String));
	});

	it('should have the attribute "this.nav" and is Object type', function () {
		expect(_core.nav).toBeDefined();
		expect(_core.nav).toEqual(jasmine.any(Object));
	});

	it('should have the attribute "this.is" and is Object type', function () {
		expect(_core.is).toBeDefined();
		expect(_core.is).toEqual(jasmine.any(Object));
	});

	it('should have the attribute "this.m6s" and is Object type', function () {
		expect(_core.m6s).toBeDefined();
		expect(_core.m6s).toEqual(jasmine.any(Object));
	});

	it('should have the attribute "this.u10s" and is Object type', function () {
		expect(_core.u10s).toBeDefined();
		expect(_core.u10s).toEqual(jasmine.any(Object));
	});

	it('should have the attribute "this.$" and is Function type', function () {
		expect(_core.$).toBeDefined();
		expect(_core.$).toEqual(jasmine.any(Function));
	});

});

describe('Syrup.core.setD10s()', function () {
	'use strict';
	//Adapters
	var _isJs = new Adapter(IsJs);
	var _moment = new Adapter(M6s);
	var _u10s = new Adapter(U10s);
	var _jquery = new JQueryAdapter(JQuery);

	//The Provider
	var _d10sBuilder = new D10sBuilder();
	var _d10sCore = new D10sComposite();

	//JQuery Builder
	_d10sBuilder.setName('$');
	_d10sBuilder.setD10s(_jquery);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//IsJs Builder
	_d10sBuilder.setName('is');
	_d10sBuilder.setD10s(_isJs);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Moment Builder
	_d10sBuilder.setName('m6s');
	_d10sBuilder.setD10s(_moment);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Underscore Builder
	_d10sBuilder.setName('u10s');
	_d10sBuilder.setD10s(_u10s);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//The core
	var _core = new Core();

	it('should be called with iD10sComposite type', function () {
		spyOn(_core, 'setD10s');
		//Call i18n
		_core.setD10s(_d10sCore);
		expect(_core.setD10s).toHaveBeenCalled();
		expect(_core.setD10s).toHaveBeenCalledWith(_d10sCore);
	});

	it('should throw error if is called without iD10Composite type', function () {
		//Call i18n
		var _throwTo = function() {
			_core.setD10s({});
		};

		expect(_throwTo).toThrow();
	});

});

describe('Syrup.core.getD10s()', function () {
	'use strict';
	//Adapters
	var _isJs = new Adapter(IsJs);
	var _moment = new Adapter(M6s);
	var _u10s = new Adapter(U10s);
	var _jquery = new JQueryAdapter(JQuery);

	//The Provider
	var _d10sBuilder = new D10sBuilder();
	var _d10sCore = new D10sComposite();

	//JQuery Builder
	_d10sBuilder.setName('$');
	_d10sBuilder.setD10s(_jquery);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//IsJs Builder
	_d10sBuilder.setName('is');
	_d10sBuilder.setD10s(_isJs);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Moment Builder
	_d10sBuilder.setName('m6s');
	_d10sBuilder.setD10s(_moment);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Underscore Builder
	_d10sBuilder.setName('u10s');
	_d10sBuilder.setD10s(_u10s);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//The core
	var _core = new Core();
	_core.setD10s(_d10sCore);

	it('should have access to the attribute Core._dependencies', function () {
		expect(_core._dependencies).toBeDefined();
		expect(_core._dependencies).toEqual(jasmine.any(Array));
	});

	it('match type "array" in the return', function () {
		expect(_core.getD10s()).toEqual(jasmine.any(Array));
	});

});

describe('Syrup.core.getNav()', function () {

	'use strict';
	//Adapters
	var _isJs = new Adapter(IsJs);
	var _moment = new Adapter(M6s);
	var _u10s = new Adapter(U10s);
	var _jquery = new JQueryAdapter(JQuery);

	//The Provider
	var _d10sBuilder = new D10sBuilder();
	var _d10sCore = new D10sComposite();

	//JQuery Builder
	_d10sBuilder.setName('$');
	_d10sBuilder.setD10s(_jquery);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//IsJs Builder
	_d10sBuilder.setName('is');
	_d10sBuilder.setD10s(_isJs);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Moment Builder
	_d10sBuilder.setName('m6s');
	_d10sBuilder.setD10s(_moment);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Underscore Builder
	_d10sBuilder.setName('u10s');
	_d10sBuilder.setD10s(_u10s);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//The core
	var _core = new Core();
	_core.setD10s(_d10sCore);

	it('should be callable function', function () {
		spyOn(_core, 'i18n');
		//Call i18n
		_core.i18n('es');
		expect(_core.i18n).toHaveBeenCalled();
		expect(_core.i18n).toHaveBeenCalledWith('es');
	});

	it('should be callable function', function () {
		spyOn(_core, 'getNav');
		//Call getNav
		_core.getNav();
		expect(_core.getNav).toHaveBeenCalled();
	});

	it('should call (this.nav.local)', function () {
		expect(_core.nav.local).toBeDefined();
	});

	it('match type "object" in the return', function () {
		expect(_core.getNav()).toEqual(jasmine.any(Object));
	});

	it('match {nav}, {version} and {platform}, in returned object keys', function () {
		expect(Object.keys(_core.getNav())).toEqual([
			'nav', 'version', 'platform'
		]);
	});
});

describe('Syrup.core.i18n()', function () {

	'use strict';
	//Adapters
	var _isJs = new Adapter(IsJs);
	var _moment = new Adapter(M6s);
	var _u10s = new Adapter(U10s);
	var _jquery = new JQueryAdapter(JQuery);

	//The Provider
	var _d10sBuilder = new D10sBuilder();
	var _d10sCore = new D10sComposite();

	//JQuery Builder
	_d10sBuilder.setName('$');
	_d10sBuilder.setD10s(_jquery);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//IsJs Builder
	_d10sBuilder.setName('is');
	_d10sBuilder.setD10s(_isJs);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Moment Builder
	_d10sBuilder.setName('m6s');
	_d10sBuilder.setD10s(_moment);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//Underscore Builder
	_d10sBuilder.setName('u10s');
	_d10sBuilder.setD10s(_u10s);
	_d10sCore.addD10s(
		_d10sBuilder.buildD10s()
	);

	//The core
	var _core = new Core();
	_core.setD10s(_d10sCore);

	it('should be callable function', function () {
		spyOn(_core, 'i18n');
		//Call i18n
		_core.i18n('es');
		expect(_core.i18n).toHaveBeenCalled();
		expect(_core.i18n).toHaveBeenCalledWith('es');
	});

	it('should can use (this.m6s.locale)', function () {
		expect(_core.m6s.locale).toBeDefined();
		spyOn(_core.m6s, 'locale');
		//Call i18n
		_core.m6s.locale('en');
		expect(_core.m6s.locale).toHaveBeenCalled();
		expect(_core.m6s.locale).toHaveBeenCalledWith('en');
	});

	it('should can be called, with invalid second param', function () {
		spyOn(_core, 'i18n');
		//Call i18n
		_core.i18n('es', {});
		expect(_core.i18n).toHaveBeenCalledWith('es', {});
		_core.i18n('es', null);
		expect(_core.i18n).toHaveBeenCalledWith('es', null);
	});

	it('match type "object" in the return', function () {
		expect(_core.i18n('es', {})).toEqual(jasmine.any(Object));
	});

});
