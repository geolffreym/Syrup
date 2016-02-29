/**
 * Created by gmena on 02-26-16.
 */
import isJs from '../../system/core/adapter/IsJs_Adapter';
import underscore from '../../system/core/adapter/Underscore_Adapter';
import jQuery from '../../system/core/adapter/JQuery_Adapter';
import momentJs from '../../system/core/adapter/Moment_Adapter';

import Isomorphic from '../../system/core/Isomorphic';
import SyrupProvider from '../../system/core/provider/SyrupProvider';
import Syrup from '../../system/core/Syrup';

describe('Syrup.core', function () {
	'use strict';
	var _ic8 = new Isomorphic();
	var _syrupProvider = new SyrupProvider(jQuery, isJs, momentJs, underscore);
	var _syrup = new Syrup(_syrupProvider, _ic8);

	//TODO escribir pruebas para instancia del objeto Syrup
	it('should be instantiable', function () {
		//expect(_syrup.VERSION).toBeDefined();
		//expect(_syrup.VERSION).toEqual(jasmine.any(String));
	});

	it('should show version', function () {
		expect(_syrup.VERSION).toBeDefined();
		expect(_syrup.VERSION).toEqual(jasmine.any(String));
	});

	it('should have the attribute "this.nav" and is Object type', function () {
		expect(_syrup.nav).toBeDefined();
		expect(_syrup.nav).toEqual(jasmine.any(Object));
	});

	it('should have the attribute "this.is" and is Object type', function () {
		expect(_syrup.is).toBeDefined();
		expect(_syrup.is).toEqual(jasmine.any(Object));
	});

	it('should have the attribute "this.m6s" and is Object type', function () {
		expect(_syrup.m6s).toBeDefined();
		expect(_syrup.m6s).toEqual(jasmine.any(Object));
	});

	it('should have the attribute "this.u10s" and is Object type', function () {
		expect(_syrup.u10s).toBeDefined();
		expect(_syrup.u10s).toEqual(jasmine.any(Object));
	});

	it('should have the attribute "this.$" and is Function type', function () {
		expect(_syrup.$).toBeDefined();
		expect(_syrup.$).toEqual(jasmine.any(Function));
	});

	it('should have the attribute "this.isClient" and is Boolean type', function () {
		expect(_syrup.isClient).toBeDefined();
		expect(_syrup.isClient).toEqual(jasmine.any(Boolean));

	});

});

describe('Syrup.core.getNav()', function () {
	'use strict';
	var _ic8 = new Isomorphic();
	var _syrupProvider = new SyrupProvider(jQuery, isJs, momentJs, underscore);
	var _syrup = new Syrup(_syrupProvider, _ic8);

	it('should be callable function', function () {
		spyOn(_syrup, 'getNav');
		//Call getNav
		_syrup.getNav();
		expect(_syrup.getNav).toHaveBeenCalled();
	});

	it('should call (this.nav.local)', function () {
		expect(_syrup.nav.local).toBeDefined();
	});

	it('match type "object" in the return', function () {
		expect(_syrup.getNav()).toEqual(jasmine.any(Object));
	});

	it('match {nav}, {version} and {platform}, in returned object keys', function () {
		expect(Object.keys(_syrup.getNav())).toEqual([
			'nav', 'version', 'platform'
		]);
	});
});

describe('Syrup.core.i18n()', function () {
	'use strict';
	var _ic8 = new Isomorphic();
	var _syrupProvider = new SyrupProvider(jQuery, isJs, momentJs, underscore);
	var _syrup = new Syrup(_syrupProvider, _ic8);

	it('should be callable function', function () {
		spyOn(_syrup, 'i18n');
		//Call i18n
		_syrup.i18n('es');
		expect(_syrup.i18n).toHaveBeenCalled();
		expect(_syrup.i18n).toHaveBeenCalledWith('es');
	});

	it('should can use (this.m6s.locale)', function () {
		expect(_syrup.m6s.locale).toBeDefined();
		spyOn(_syrup.m6s, 'locale');
		//Call i18n
		_syrup.m6s.locale('en');
		expect(_syrup.m6s.locale).toHaveBeenCalled();
		expect(_syrup.m6s.locale).toHaveBeenCalledWith('en');
	});

	it('should be called, with invalid second param', function () {
		spyOn(_syrup, 'i18n');
		//Call i18n
		_syrup.i18n('es', {});
		expect(_syrup.i18n).toHaveBeenCalledWith('es', {});
		_syrup.i18n('es', null);
		expect(_syrup.i18n).toHaveBeenCalledWith('es', null);
	});

	it('match type "object" in the return', function () {
		expect(_syrup.i18n('es', {})).toEqual(jasmine.any(Object));
	});

});
