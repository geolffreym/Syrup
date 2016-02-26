/**
 * Created with JetBrains WebStorm.
 * User: Geolffrey Mena
 * Date: 25/11/13
 * Time: 12:22
 */
//ECMA6 Support -> node --harmony
//Jquery Dom Traversing -> https://github.com/jquery/jquery
//Underscore util -> https://github.com/jashkenas/underscore
//Is validation tool -> https://github.com/arasatasaygin/is.js
//Date helper -> https://github.com/moment/moment/

//Handle dependencies using ECMAScript 6 Module import
//import jquery from '../../node_modules/jquery';
//import underscore from '../../node_modules/underscore';
//import moment_js from '../../node_modules/moment';

//Handle dependencies using CommonJS
var momentjs = require('moment');

//Handle dependencies using ECMAScript 6 Module import
//Adapter for is.js library
//Adapter for underscore.js
import isJs from './adapter/IsJsAdapter';
import underscore from './adapter/UnderscoreAdapter';
import JQuery from './adapter/JQueryAdapter';

//Exceptions
import Isomorphic from './lib/Isomorphic';
import {InvalidParam} from './base/Exceptions';

export default class Syrup {
    /** Syrup class

     * @constructor
     */
    constructor() {

        //Basic attributes
        this.emptyStr = '';
        this.isClient = Isomorphic.client();
        this.isServer = Isomorphic.server();

        //Dependencies injection
        this.is = isJs; // Is.js
        this.date = momentjs; // Moment.js
        this.u10s = underscore; // Underscore.js

        //Client access only for nav
        //Dom traversing tool (jQuery) needed only for client side
        //Dom traversing not needed in server side
        if (this.isClient) {
            // Jquery.js
            this.$ = ((q, c)=> {
                return JQuery.$(q, c);
            });
            //Navigator Info
            this.nav = {
                online: window.navigator.onLine,
                local: window.navigator.userAgent.toLowerCase(),
                cookies: window.navigator.cookieEnabled,
                javascript: window.navigator.javaEnabled(),
                unsupported: !window.localStorage
            };
        }

        //Version
        this.VERSION = 'v1.0.0-alpha';
        //Init features
        this.i18n({});
        //Native features
        this.native = {
            'function': Function.prototype,
            'object': Object.prototype
        };
    }

    /**Set default locale i18n date format

     * @param {object} setting
     * @return {object}
     */
    i18n(setting) {
        var _setting = this.u10s.extend(
            {locale: 'en'}, setting
        );

        //Set default locale setting
        this.date.locale(_setting.locale);

        //Return self
        return this;
    }

    /**Return full navigator information

     * @return (Object|null)
     */
    getNav() {

        //Can't access if not client
        if (!this.isClient) {
            return null;
        }

        //Match navigator information
        let [_matches] = this.nav.local.match(
            /(?:trident\/(?=\w.+rv:)|(?:chrome\/|firefox\/|opera\/|msie\s|safari\/))[\w.]{1,4}/
        );

        //Found match for navigator info
        if (_matches) {

            //Agent and version
            let [_agent, _version] = _matches.split('/');

            //Return the nav information
            return {
                nav: _agent.replace('trident', 'msie'),
                version: _version,
                platform: window.navigator.platform.toLocaleLowerCase()
            };
        }

    }

    /** Validate if param is set. If not, throw msg!

     * @param {object} param
     * @param {string|null} breakpoint
     * @return {object}
     */
    assert(param, breakpoint = null) {
        //Is set. not null or undefined and not false?
        if (this.is.not.truthy(param)) {
            throw new InvalidParam(
                breakpoint
            );
        }

        //Return self
        return this;
    }
}

