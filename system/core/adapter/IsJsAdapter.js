/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';
/**
 * IsJS adapter, to add additional features
 * */

//Is.js
import Adapter from './Adapter';

export default class IsJsAdapter extends Adapter {
	constructor(adapter) {
		super(adapter);
	}
}
