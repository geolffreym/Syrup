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

//Moment.js
import Adapter from './Adapter';

export default class MomentAdapter extends Adapter {
	constructor(adapter) {
		super(adapter);
	}
}
