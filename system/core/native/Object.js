/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';

export default class ObjectAdapter extends Object {
    /**
     * Object adapter

     * @param {object} param
     */
    constructor(param) {
	super(param || {});
    }

}
