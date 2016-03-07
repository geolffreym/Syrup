/**
 * Created by gmena on 03-07-16.
 */

//D10s
import IsJs from '../system/core/d10s/IsJs';
import U10s from '../system/core/d10s/Underscore';
import JQuery from '../system/core/d10s/JQuery';
import M6s from '../system/core/d10s/Moment';

//Adapters
import Adapter from '../system/core/adapter/Adapter';
import JQueryAdapter from '../system/core/adapter/jQueryAdapter';

//Core
import Builder from '../system/core/builder/Builder';
import D10s from '../system/core/provider/D10s';
import D10sBuilder from '../system/core/builder/D10sBuilder';
import D10sComposite from '../system/core/composite/D10sComposite';
import Core from '../system/core/Core';

//Interface
import Interface from '../system/core/interface/Interface';
import iD10sInjectable from '../system/core/interface/iD10sInjectable';

//URLS and CONF
import conf from './config/setting';
import uri from './config/uri';

/*******************
 **** START CORE ***
 * *****************/
(function () {

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


	console.log(location);
	uri['^customers$'].forEach((e)=> {
		console.log(e.uri.get('/list/$'));
	});




})(this);

