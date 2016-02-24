/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';

export default class Util {
    /**
     * AMD with global, Node, or global

     * @param {object} root
     * @param {object} factory
     * @return {void}
     */
    static export(root, name, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(function () {
                // Also create a global in case some scripts
                // that are loaded still are looking for
                // a global even when an AMD loader is in use.
                return (root[name] = factory);
            });
        } else if (typeof exports === 'object') {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like enviroments that support module.exports,
            // like Node.
            module.exports = factory;
        } else {
            // Browser globals (root is window)
            root[name] = factory;
        }
    }

}
