/**
 * Created by gmena on 02-26-16.
 */

//D10s
import IsJs from '../../system/core/d10s/IsJs';
import U10s from '../../system/core/d10s/Underscore';
import JQuery from '../../system/core/d10s/JQuery';
import M6s from '../../system/core/d10s/Moment';

//Adapters
import IsAdapter from '../../system/core/adapter/IsJsAdapter';
import UAdapter from '../../system/core/adapter/UnderscoreAdapter';
import JAdapter from '../../system/core/adapter/jQueryAdapter';
import MAdapter from '../../system/core/adapter/MomentAdapter';

//Core
import D10s from '../../system/core/factory/D10sFactory';
import D10sList from '../../system/core/provider/D10sList';
import Core from '../../system/core/Core';

describe('Syrup.core', function () {

	'use strict';
	//Adapters
	var _jquery = new JAdapter(IsJs);
	var _isJs = new IsAdapter(JQuery);
	var _moment = new MAdapter(M6s);
	var _u10s = new UAdapter(U10s);

	var _jqueryD = D10s.create('$', _jquery.getAdapter());
	var _isJsD = D10s.create('is', _isJs.getAdapter());
	var _momentD = D10s.create('m6s', _moment.getAdapter());
	var _u10sD = D10s.create('u10s', _u10s.getAdapter());

	//The Provider
	var _coreDependencies = new D10sList();
	_coreDependencies.addD10s(_jqueryD);
	_coreDependencies.addD10s(_isJsD);
	_coreDependencies.addD10s(_u10sD);
	_coreDependencies.addD10s(_momentD);

	//The core
	var _core = new Core();
	_core.setD10s(_coreDependencies);
	
	//TODO escribir pruebas para instancia del objeto Syrup
	it('should be instantiable', function () {

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

describe('Syrup.core.getNav()', function () {
	'use strict';
	//Adapters
	var _jquery = new JAdapter(IsJs);
	var _isJs = new IsAdapter(JQuery);
	var _moment = new MAdapter(M6s);
	var _u10s = new UAdapter(U10s);

	var _jqueryD = D10s.create('$', _jquery.getAdapter());
	var _isJsD = D10s.create('is', _isJs.getAdapter());
	var _momentD = D10s.create('m6s', _moment.getAdapter());
	var _u10sD = D10s.create('u10s', _u10s.getAdapter());

	//The Provider
	var _coreDependencies = new D10sList();
	_coreDependencies.addD10s(_jqueryD);
	_coreDependencies.addD10s(_isJsD);
	_coreDependencies.addD10s(_u10sD);
	_coreDependencies.addD10s(_momentD);
	
	//The core
	var _core = new Core();
	_core.setD10s(_coreDependencies);
	
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
	var _jquery = new JAdapter(IsJs);
	var _isJs = new IsAdapter(JQuery);
	var _moment = new MAdapter(M6s);
	var _u10s = new UAdapter(U10s);

	var _jqueryD = D10s.create('$', _jquery.getAdapter());
	var _isJsD = D10s.create('is', _isJs.getAdapter());
	var _momentD = D10s.create('m6s', _moment.getAdapter());
	var _u10sD = D10s.create('u10s', _u10s.getAdapter());

	//The Provider
	var _coreDependencies = new D10sList();
	_coreDependencies.addD10s(_jqueryD);
	_coreDependencies.addD10s(_isJsD);
	_coreDependencies.addD10s(_u10sD);
	_coreDependencies.addD10s(_momentD);

	//The core
	var _core = new Core();
	_core.setD10s(_coreDependencies);

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

	it('should be called, with invalid second param', function () {
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
