/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */

'use strict';

export default class Isomorphic {
    /**
     * Check if can access via global environment

     * @return {boolean}
     */
    static client() {
        return typeof window === 'object';
    }

    /**
     * Check if can access via CommonJs environment

     * @return {boolean}
     */
    static server() {
        return typeof module === 'object' &&
        typeof module.exports === 'object';
    }

    /**
     * AMD with global, Node, or global

     * @param {string} name
     * @param {object} Factory
     * @return {void|object}
     */
    static export(name, Factory) {
        
        Factory = typeof Factory === 'object' &&
        Factory || new Factory();
        
        //Only for client
        if (this.client()) {
            //Typeof window !== "undefined" ? window : this
            if (typeof define === 'function' && define.amd) {
                // AMD. Register as an anonymous module.
                define(function () {
                    // Also create a global in case some scripts
                    // that are loaded still are looking for
                    // a global even when an AMD loader is in use.
                    return (
                    window[name] = Factory
                    );
                });
            } else {
                // Browser globals (root is window)
                return (
                window[name] = Factory
                );
            }
            
        } else {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like enviroments that support module.exports,
            // like Node.
            module.exports = Factory;
        }
    }

}
