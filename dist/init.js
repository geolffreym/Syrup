/**
 * Created by gmena on 07-26-14.
 */

//Basic Config

var setting = {
	processor  : '',
	app_path   : '/syrup/app',
	system_path: '/syrup/system',
	env        : 'development'
};


//Please install Node and run the command `npm install` and `npm start` to execute
//Set Environment
if ( typeof exports !== 'undefined' )
	exports.setting = setting;

/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 25/11/13
 * Time: 12:22
 * To change this template use File | Settings | File Templates.
 */

'use strict';

(function (windowGlobal) {
	var
		nativeFunction = Function.prototype,
		nativeObject = Object.prototype,
		regexConstructor = /(([^function])([a-zA-z])+(?=\())/g,
		regexUrl = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
		regexMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		WARNING_SYRUP = {
			ERROR: {
				NOPARAM              : 'Param needed',
				NONETWORK            : 'Network Error',
				NOOBJECT             : 'An object param is needed.',
				NOARRAY              : 'An array necessary.',
				NOFUNCTION           : 'An function needed.',
				NODATE               : 'Invalid Date',
				NOSTRING             : 'String is required',
				NOPACK               : 'Error packing model',
				NOCALLBACK           : 'Callback error on execution time.',
				NOURL                : 'URL is required for the request.',
				NOHTML               : 'Html string is required',
				NOOBJECTREPLACEREGEXP: 'A object replace param is needed to replace a regexp ex: {match:replace}'
			}
		};

	/**Clone a object
	 * @return object
	 * */
	nativeObject.clone = function () {
		return _.extend ({}, this);
	};

	/** Extend a function
	 *  @param child
	 *  @return void
	 * **/
	nativeFunction.blend = function (child) {
		var name = (
			child.prototype.constructor.name
			|| (
				child.toString ().match (regexConstructor)[0]
			).trim ()
		);
		this.prototype[name] = child;
	};

	/** Create a custom function
	 *  @param name
	 *  @return object
	 * **/
	nativeFunction.factory = function (name) {
		return (
			new Function (
				'return function ' + name + '(){}'
			)
		)
	};

	/** Remove extend
	 * @param child
	 * @reutn bool
	 * */
	nativeFunction.drop = function (child) {
		var name = (
			child.prototype.constructor.name
			|| (
				child.toString ().match (regexConstructor)[0]
			).trim ()
		);
		if ( _[name] ) {
			_[name] = null;
			return true;
		}
		return false;
	};


	/**Add method to function
	 * @param name
	 * @param fn
	 */
	nativeFunction.add = function (name, fn) {
		this.prototype[name.trim ()] = fn;
	};


	/**Modelo Base
	 * @constructor
	 */

	function Syrup () {
		this.recursiveStr = false;
	}

	/**_$_
	 * @constructor
	 */
	function _$_ () {
		this.collection = null;
		this.exist = null;
		this.state = null;
	}

	/**Dom Traversing
	 * @param dom
	 * @returns {_$_}
	 */
	_$_.add ('$', function (dom) {
		var _tmp,
			_self = new _$_;

		if ( _.isFunction (dom) ) {
			_$ (document).ready (dom);
			return;
		}

		if ( _.isHtml (dom) ) {
			_tmp = document.createElement ('div');
			_tmp.innerHTML = dom;
			_self.collection = _tmp.children.length > 1
				? _tmp.children
				: _tmp.firstChild;

		} else {
			_self.collection = !_.isObject (dom) && _.isString (dom)
				? dom.indexOf ('+') > -1
				? document.querySelectorAll (_.replace (dom, '+', _.emptyStr))
				: document.querySelector (dom)
				: dom;

		}

		_self.exist = _.isSet (_self.collection);
		_self.name = dom;
		return _self;
	});

	/***Add fn to object
	 * @param callback
	 */
	_$_.add ('fn', function (name, fn) {
		return this.__proto__[name] = fn;
	});

	/***Event Handler
	 * @param callback
	 */
	_$_.add ('ready', function (callback) {
		var _self = this;
		if ( _.isGlobal (_self.collection) )
			_self.collection.addEventListener (
				"DOMContentLoaded",
				callback
			);
		return this;
	});

	/***Event Load
	 * @param callback
	 */
	_$_.add ('load', function (callback) {
		var _self = this;
		if ( _.isGlobal (_self.collection) ) {
			_self.collection.onload = callback;
		}
	});


	/**Event Listener
	 * @param event
	 * @param delegate
	 * @param callback
	 * @return object
	 */
	_$_.add ('listen', function (event, delegate, callback) {
		if ( _.isFunction (delegate) ) {
			callback = delegate;
		}

		var _self = this,
			_target = null,
			_event = function (e) {
				e = e || windowGlobal.event;
				_target = event.srcElement || e.target;

				if ( _.isSet (delegate) && !_.isFunction (delegate) ) {
					_$ (_target).filter (delegate, function () {
						_.callbackAudit (callback, e);
					});
				} else { _.callbackAudit (callback, e); }
			};

		// For each element
		_self.each (function (elem) {

			if ( elem.addEventListener ) {
				elem.addEventListener (event, _event, true)
			} else if ( elem.attachEvent ) {
				elem.attachEvent ('on' + event, _event);
			}

			if ( !_.isSet (elem['listListener']) ) {
				elem['listListener'] = {}
			}

			elem.listListener[event] = _event;
		});

		return this;
	});

	/**Remove Event Listener
	 * @param event
	 * @param delegate
	 * @param callback
	 * @return object
	 */
	_$_.add ('unlisten', function (event) {
		return this.each (function (elem) {

			if ( _.isSet (elem.listListener) ) {

				if ( event in elem.listListener ) {
					if ( elem.removeEventListener ) {
						elem.removeEventListener (event, elem.listListener[event], true);
					} else if ( elem.detachEvent ) {
						elem.detachEvent ('on' + event, elem.listListener[event]);
					}
					delete elem.listListener[event];
				}
			}
		})

	});

	/**Filter Pattern match
	 *@param filter
	 *@param callback
	 *@return Object
	 */
	_$_.add ('filter', function (filter, callback, e_handler) {
		return this.each (function (elem) {
			var match = elem.matchesSelector ||
						elem.webkitMatchesSelector ||
						elem.mozMatchesSelector ||
						elem.oMatchesSelector ||
						elem.msMatchesSelector;

			if ( match.call (elem, filter) ) {
				_.callbackAudit (callback, _$ (elem));
			} else if ( _.isFunction (e_handler) ) {
				_.callbackAudit (e_handler, _$ (elem));
			}
		});
	});

	/**Empty Dom
	 * @return void
	 * */
	_$_.add ('empty', function () {
		return this.each (function (v) {
			v.innerHTML = _.emptyStr;
		});
	});

	/**Clone Objects
	 * @param childs
	 * @return array
	 */
	_$_.add ('clone', function (childs) {
		childs = _.isSet (childs);
		var _clones = [];
		this.each (function (v) {
			_clones.push (_$ (v.cloneNode (childs)));
		});
		return _.specArray (_clones);

	});


	/***Data set
	 * @param name
	 * @param value
	 * @return array
	 */
	_$_.add ('data', function (name, value) {
		var _self = this,
			_data_set,
			_values = [];

		_self.each (function (dom, i) {
			_data_set = dom.dataset;
			if ( _.isSet (value) || _.isNumber (value) ) {
				_data_set[name] = _.isArray (value) ? value[i] : value;
			} else if ( _.isSet (_data_set[name]) ) {
				_values.push (_data_set[name])
			}

		});

		return _.specArray (_values);
	});

	/***Assign Properties
	 * @param _prop
	 * @return array
	 */
	_$_.add ('prop', function (_prop) {
		var _props = [];
		this.each (function (v) {
			if ( _.isString (_prop) ) {
				_props.push (v[_prop]);
			} else {
				_.each (_prop, function (value, index) {
					v[index] = value;
				});
			}
		});

		return _.isString (_prop)
			? _.specArray (_props) : this;
	});

	/***Assign Atributes
	 * @param _attr
	 * @return array
	 */
	_$_.add ('attr', function (attr) {
		var _attr = [];
		this.each (function (v) {
			if ( _.isString (attr) ) {
				_attr.push (v.getAttribute (attr));
			} else {
				_.each (attr, function (value, index) {
					v.setAttribute (index, value);
				});
			}
		});
		return _.isString (attr)
			? _.specArray (_attr) : this;
	});

	/***Remove Atributes
	 * @param _attr
	 * @return object
	 */
	_$_.add ('removeAttr', function (attr) {
		return this.each (function (v) {
			if ( v[attr] ) {
				v[attr] = false;
			} else {
				v.removeAttr (attr);
			}
		});
	});

	/**CSS
	 * @param _css
	 * @returns {_$_}
	 */
	_$_.add ('css', function (css) {
		var _css = [],
			_self = this;

		_self.each (function (dom) {
			if ( _.isString (css) ) {
				var _style = windowGlobal.getComputedStyle (dom, null);
				_css.push (_style.getPropertyValue (css));
			} else {
				_.each (css, function (value, index) {
					dom.style[index] = value;
				});
			}
		});

		return _.isString (css)
			? _.specArray (_css) : this;
	});

	/***Insert After
	 * @param elem
	 */
	_$_.add ('after', function (elem) {
		if ( _.isHtml (elem) || !_.is$ (elem) ) {
			elem = _$ (elem);
		}

		return this.each (function (obj) {
			elem.each (function (v) {
				obj.parentNode.insertBefore (v, obj.nextSibling)
			})
		});
	});

	/***Insert Before
	 * @param elem
	 * @return object
	 */
	_$_.add ('before', function (elem) {
		if ( _.isHtml (elem) || !_.is$ (elem) ) {
			elem = _$ (elem);
		}

		return this.each (function (obj) {
			elem.each (function (v) {
				obj.parentNode.insertBefore (v, obj)
			})
		});
	});

	/**Append Element or Html
	 * @param childs
	 * @return object
	 */
	_$_.add ('append', function (childs) {
		if ( _.isHtml (childs) || !_.is$ (childs) ) {
			childs = _$ (childs);
		}

		return this.each (function (p) {
			childs.each (function (elm) {
				p.appendChild (elm)
			});
		});

	});

	/**Prepend Element or Html
	 * @param childs
	 * @return object
	 */
	_$_.add ('prepend', function (childs) {
		if ( _.isHtml (childs) || !_.is$ (childs) ) {
			childs = _$ (childs);
		}

		return this.each (function (p) {
			childs.each (function (elm) {
				p.insertBefore (elm, p.firstChild)
			});
		});

	});

	/**Inner HTML
	 * @param html
	 * @returns object
	 */
	_$_.add ('html', function (html) {
		if ( _.isHtml (html) || _.isString (html) ) {
			this.prop ({ 'innerHTML': html });
		} else { return this.prop ('innerHTML'); }
		return this;
	});

	/**Inner Text
	 * @param html
	 * @returns {_$_}
	 */
	_$_.add ('text', function (text) {
		if ( _.isString (text) ) {
			this.prop ({ 'textContent': text });
		} else { return this.prop ('textContent'); }
		return this;
	});

	/**Set value
	 * @param html
	 * @returns {_$_}
	 */
	_$_.add ('val', function (text) {
		if ( _.isString (text) ) {
			this.prop ({ 'value': text });
		} else { return this.prop ('value'); }
		return this;
	});

	/**Hide Element**/
	_$_.add ('hide', function () {
		return this.each (function (_elem) {
			_elem.style.display = 'none';
		});
	});

	/**Show Element**/
	_$_.add ('show', function () {
		return this.each (function (_elem) {
			_elem.style.display = 'block';
		});
	});

	/**Parent Node
	 * @param callback
	 */
	_$_.add ('parent', function (callback) {
		return this.each (function (_elem) {
			if ( _elem.parentNode )
				_.callbackAudit (callback, _$ (_elem.parentNode))
		});
	});

	/**Childs Nodes
	 * @param callback
	 */
	_$_.add ('children', function (callback) {
		return this.each (function (_elem) {
			if ( _elem.children.length > 0 ) {
				_.each (_elem.children, function (v, i) {
					if ( _.isNumber (i) )
						_.callbackAudit (callback, _$ (v))
				})
			}
		});
	});

	/**Next Node
	 * @param callback
	 */
	_$_.add ('next', function (callback) {
		return this.each (function (_elem) {
			_.callbackAudit (callback, _$ (_elem.nextElementSibling));
		});

	});

	/**Nexts Node
	 * @param callback
	 */
	_$_.add ('nexts', function (filter, callback) {
		var _sibling = null;
		callback = _.isFunction (filter)
			? filter : callback;

		return this.next (function (elem) {
			_sibling = elem;
			do {
				if ( _.isSet (filter) && !_.isFunction (filter) ) {
					_sibling.filter (filter, function (elem) {
						_.callbackAudit (callback, elem);
					})
				} else { _.callbackAudit (callback, _sibling); }
			} while ( (
				_sibling = _$ (_sibling.get (0).nextElementSibling)
			).exist )
		});
	});

	/**Trigger
	 * @param event
	 */
	_$_.add ('trigger', function (event, callback) {
		var _event = new CustomEvent (event, {
			bubbles   : true,
			cancelable: true
		});

		if ( document.createEvent ) {
			_event = document.createEvent ('Event');
			_event.initEvent (event, true, false);
			//_event.eventType = event;
		}

		this.each (function (v) {
			v.dispatchEvent (_event);
		});

		_.callbackAudit (callback, _event);

		return this;
	});

	/**Find Elements
	 * @param filter
	 * @param callback
	 * @return object
	 */
	_$_.add ('find', function (filter, callback) {
		return this.children (function (elem) {
			elem.filter (filter, function (e) {
				_.callbackAudit (callback, e, filter);
			}, function () {
				elem.find (filter, callback);
			})
		});
	});

	/**Full Parent
	 * @param parent_class
	 * @param callback
	 * @return object
	 */
	_$_.add ('parents', function (parent_class, callback) {

		return this.each (function (_elem) {
			_$ (_elem).parent (function (_parent) {
				_parent.filter (parent_class, function (parent) {
					_.callbackAudit (callback, parent);
				}, function () {
					_parent.parents (parent_class, callback);
				});
			});
		});

	});

	/***Veriy Class
	 * @param elem
	 * @param cls
	 */
	_$_.add ('hasClass', function (cls) {
		_.assert (cls, WARNING_SYRUP.ERROR.NOPARAM);
		var elem = this.get (0);
		if ( _.isSet (elem.classList) ) {
			if ( Array.prototype.indexOf.call (elem.classList, cls) > -1 ) {
				return true;
			}
		}
		return false;
	});

	/**AddClass Element
	 * @param elem
	 * @param cls
	 */
	_$_.add ('addClass', function (cls) {
		return this.each (function (elem) {
			if ( !_$ (elem).hasClass (cls) ) {
				if ( elem.classList ) {
					elem.classList.add (cls)
				} else { elem.className += ' ' + cls; }
			}
		});
	});

	/**ToggleClass Element
	 * @param elem
	 * @param cls
	 */
	_$_.add ('toggleClass', function (cls) {
		return this.each (function (elem) {
			elem.classList.toggle (cls);
		});
	});

	/**Remove Class
	 * @param cls
	 */
	_$_.add ('removeClass', function (cls) {
		return this.each (function (elem) {
			if ( _$ (elem).hasClass (cls) ) {
				if ( elem.classList ) {
					elem.classList.remove (cls)
				} else {
					elem.className = _.replace (elem.className, (
						new RegExp (cls, 'g')
					), _.emptyStr)
				}
			}
		});
	});

	/**Fade Out
	 * @param delay
	 * @return object
	 */
	_$_.add ('fadeOut', function (delay, callback) {
		this.animate ([
			{ opacity: '1' },
			{ opacity: '0' }
		], {
			delay   : 0,
			duration: _.isNumber (delay) ? delay : 50
		}, _.isFunction (delay) ? delay : callback);

		return this;
	});

	/**Fade In
	 * @param delay
	 * @return object
	 */
	_$_.add ('fadeIn', function (delay, callback) {
		this.animate ([
			{ opacity: '0' },
			{ opacity: '1' }
		], {
			delay   : 0,
			duration: _.isNumber (delay) ? delay : 50
		}, _.isFunction (delay) ? delay : callback);
		return this;
	});


	/**Return and set Heigth of DOM
	 * @param height
	 * @return object
	 */
	_$_.add ('height', function (height) {
		if ( _.isSet (height) ) {
			return this.css ({
				'height': _.isNumber (height)
					? height + 'px' : height
			});
		}

		var _height = [];
		this.each (function (elem) {
			_height.push ((
							  _.cartesianPlane (elem)
						  ).height);
		});
		return _.specArray (_height);
	});

	/**Return and set width of DOM
	 * @param width
	 * @return object
	 */
	_$_.add ('width', function (width) {
		if ( _.isSet (width) ) {
			return this.css ({
				'width': _.isNumber (width)
					? width + 'px' : width
			});
		}
		var _width = [];
		this.each (function (elem) {
			_width.push ((
							 _.cartesianPlane (elem)
						 ).width);
		});

		return _.specArray (_width);
	});

	/**Validate is
	 * @param context
	 * @retur object
	 * */
	_$_.add ('is', function (context) {
		_.assert (context, WARNING_SYRUP.ERROR.NOPARAM);
		var v = this.get (0),
			_return = false;

		_$ (v).filter (context, function () {
			_return = true;
		}, function () {
			_return = v[context] || v['type'] === context;
		});

		return _return;
	});

	/***Get Child Element
	 * @param find
	 * @return array
	 * */
	_$_.add ('get', function (find) {
		if (
			_.objectAsString (this.collection) == '[object NodeList]'
			&& _.isNumber (find)
		) {
			if ( _.isSet (this.collection[find]) )
				return this.collection[find];
		}

		return this.collection
	});

	/***Remove Element*/
	_$_.add ('remove', function () {
		return this.each (function (v) {
			if ( v.remove ) {
				v.remove ();
			} else { v.parentNode.removeChild (v); }
		});
	});

	/***Each Element
	 * @param callback
	 * @return object
	 */
	_$_.add ('each', function (callback) {
		var _element = this.collection;
		if ( _.isSet (_element.childNodes)
			 || _.isGlobal (_element) ) {
			_.callbackAudit (callback, _element, 0);
		} else {
			_.each (_element, function (v, i, p) {
				if ( _.isObject (v) && _.isSet (v) ) {
					_.callbackAudit (callback, v, i, p);
				}
			});
		}
		return this;
	});

	/**Return and set offset of DOM
	 * @param _object
	 * @return object
	 * */
	_$_.add ('offset', function (_object) {
		var _offset = [];
		this.each (function (elem) {
			var _cartesian = _.cartesianPlane (elem);
			if ( _.isObject (_object) ) {

				if ( _.isSet (_object.top) )
					elem.style.top = _.isNumber (_object.top)
						? _object.top + 'px' : _object.top;


				if ( _.isSet (_object.left) )
					elem.style.left = _.isNumber (_object.left)
						? _object.left + 'px' : _object.left;


				if ( _.isSet (_object.bottom) )
					elem.style.bottom = _.isNumber (_object.bottom)
						? _object.bottom + 'px' : _object.bottom;


				if ( _.isSet (_object.right) )
					elem.style.right = _.isNumber (_object.right)
						? _object.right + 'px' : _object.right;

			}

			_offset.push ({
				top   : _cartesian.top,
				left  : _cartesian.left,
				bottom: _cartesian.bottom,
				right : _cartesian.right
			})
		});

		return _.specArray (_offset);
	});


	/**Ordena Elementos
	 * @param _prop
	 * @param _desc
	 * @param _object
	 * @returns {*|Array}
	 */
	_$_.add ('sort', function (_prop, _desc) {
		if ( _.isBoolean (_prop) ) {
			_desc = arguments[0];
			_prop = false;
		}

		_desc = !_desc ? 1 : -1;
		_prop = _prop ? _prop : 'innerHTML';


		return _.toArray (this.collection).sort (function (a, b) {
			var _a = _$ (a).attr (_prop) || _$ (a).prop (_prop),
				_b = _$ (b).attr (_prop) || _$ (b).prop (_prop);

			if ( _.isSet (_a) && _.isSet (_b) ) {
				a = !isNaN (+_a) ? +_a : _a.toLowerCase ();
				b = !isNaN (+_b) ? +_b : _b.toLowerCase ();
			}

			return (
				a > b
			)
				? _desc : (
				_desc * -1
			);
		});

	});


	/**Animate element
	 * @param prop
	 * @param conf
	 * @return Object
	 */
	_$_.add ('animate', function (prop, conf, callback) {

		return this.each (function (elem) {
			if ( _.isSet (elem.animate) ) {

				if ( _.isFunction (conf) )
					callback = conf;

				conf = (
					(
						!_.isObject (conf) && !_.isNumber (conf)
					)
				) ? {} : conf;


				conf.iterations = _.isSet (conf.iterations)
					? conf.iterations : 1;

				conf.duration = _.isSet (conf.duration)
					? conf.duration : 1000;

				conf.delay = _.isSet (conf.delay)
					? conf.delay : 300;

				var _animation = elem.animate (prop, conf);
				_animation.addEventListener ('finish', function () {
					_.callbackAudit (callback, _$ (elem));
				})
			}
		});
	});

	/**Return object
	 * @returns {Object|Array}
	 */
	_$_.add ('object', function () {
		return this.collection;
	});

	/** No Conflict
	 * @return _$ object
	 * **/
	Syrup.add ('noConflict', function () {
		return _$;
	});


	/**Valida si esta seteado un elemento y envia un mensaje
	 * @param obj
	 * @param msg
	 * @returns {object}
	 */
	Syrup.add ('assert', function (obj, msg) {
		if ( !_.isSet (obj) ) {
			_.error (_.isSet (msg) ? msg : 'Param needed');
		}
		return this;
	});


	/**Valida si un elemento es un arreglo
	 * @param obj
	 * @returns {boolean}
	 */
	Syrup.add ('isArray', function (obj) {
		return _.objectAsString (obj) === '[object Array]';
	});

	/**Valida si un elemento es un object
	 * @param obj
	 * @returns {boolean}
	 */
	Syrup.add ('isObject', function (obj) {
		return (
			_.objectAsString (obj) === '[object Object]' || (
				typeof obj === 'object' && _.objectAsString (obj) !== '[object Null]'
			)
		);
	});

	/**Valida si un elemento es un object
	 * @param obj
	 * @returns {boolean}
	 */
	Syrup.add ('isGlobal', function (obj) {
		return (
			_.objectAsString (obj) === "[object global]"
			|| _.objectAsString (obj) === "[object Window]"
			|| _.objectAsString (obj) === "[object HTMLDocument]"
			|| _.objectAsString (obj) === "[object Document]"
		);
	});
	/**Valida si un elemento es un object _$_
	 * @param obj
	 * @returns {boolean}
	 */
	Syrup.add ('is$', function (obj) {
		return (
			obj instanceof _$_
		);
	});

	/**Valida si es un FormData
	 * @param obj
	 * @returns {boolean}
	 */
	Syrup.add ('isFormData', function (obj) {
		return _.objectAsString (obj) === "[object FormData]";
	});

	/**Valida si es un String
	 * @param obj
	 * @returns {boolean}
	 */
	Syrup.add ('isString', function (obj) {
		return _.objectAsString (obj) === '[object String]';
	});

	/**Valida si un elemento es ua funcion
	 * @param obj
	 * @returns {boolean}
	 */
	Syrup.add ('isFunction', function (obj) {
		return _.objectAsString (obj) === '[object Function]';
	});

	/**Comprueba si la estring es un html
	 * @param html
	 * @returns {boolean}
	 */
	Syrup.add ('isHtml', function (html) {
		return /(<([^>]+)>)/ig.test (html);
	});

	/**Comprueba si es booleano
	 * @param bool
	 * @returns {boolean}
	 */
	Syrup.add ('isBoolean', function (bool) {
		return this.objectAsString (bool) === '[object Boolean]';
	});

	/**Comprueba si es una expresion regular
	 * @param regex
	 * @returns {boolean}
	 */
	Syrup.add ('isRegexp', function (regex) {
		return this.objectAsString (regex) === '[object RegExp]';
	});

	/**Verifica si un elemento esta seteado
	 * @param elm
	 * @return Boolean
	 */
	Syrup.add ('isSet', function (elm) {
		return typeof elm !== 'undefined' && elm !== null && !!elm;
	});

	/**Valida Input
	 * @param input
	 * @returns {boolean}
	 */
	Syrup.add ('isEmpty', function (input) {
		if ( _.isArray (input) ) {
			return input.length === 0;
		}

		return (
			!input || input === _.emptyStr || /^\s+$/.test (input)
		)
	});

	/**Validar Url
	 * @param url
	 * @returns {boolean}
	 */
	Syrup.add ('isUrl', function (url) {
		return regexUrl.test (url);
	});

	/**Valida Correo
	 * @param mail
	 * @returns {boolean}
	 */
	Syrup.add ('isMail', function (mail) {
		return regexMail.test (mail);
	});

	/**Valida JSON
	 * @param str
	 * @returns {boolean}
	 */
	Syrup.add ('isJson', function (str) {
		try {
			JSON.parse (str);
		}
		catch ( e ) {
			return false;
		}
		return true;
	});

	/**Valida Numero
	 * @param number
	 * @returns {boolean}
	 */
	Syrup.add ('isNumber', function (number) {
		return !isNaN (number);
	});

	/**Console Log con tiempo de ejecucion
	 * @param msg
	 */
	Syrup.add ('warning', function (msg) {
		var date = _.getDate (false);
		console.log (date.hour + ':' + date.minutes + ':' + date.seconds + ' ' + date.meridian + ' -> ' + msg);
	});

	/**Console Log error con tiempo de ejecucion
	 * @param msg
	 */
	Syrup.add ('error', function (msg) {
		var date = _.getDate (false);
		throw (
			date.hour + ':' + date.minutes + ':' + date.seconds + ' ' + date.meridian + ' -> ' + msg
		);
	});


	/**Html entities
	 * @param str
	 * @returns {String}
	 */
	Syrup.add ('htmlEntities', function (str) {
		var match = {
			'<' : '&lt',
			'>' : '&gt;',
			'"' : '&quot;',
			'\'': '&#39;',
			'&' : '&amp;'
		};
		return _.replace (str, /<|>|&|"|'/g, match);
	});

	/**Split String
	 * @param str
	 * @returns {String}
	 */
	Syrup.add ('splitString', function (str, match) {
		if ( str.indexOf (match) > -1 ) {
			return str.split (match)
		}
		return str;
	});


	/**Truncate String
	 * @param string
	 * @param limit
	 * @returns {String}
	 */
	Syrup.add ('truncateString', function (string, limit) {
		return _.toObject (string).slice (0, limit);
	});

	/**Replace String
	 * @param _string
	 * @param _find
	 * @param _replace
	 * @return String
	 */
	Syrup.add ('replace', function (_string, _find, _replace) {
		var o = _string.toString (),
			s = o.toLowerCase (),
			r = _.emptyStr, b = 0, e = 1, _tmp;


		if ( !_.isRegexp (_find) ) {
			_find = _find.toLowerCase ();
		} else {
			_find = o.match (_find);
			this.recursiveStr = s;
		}

		if ( _.isArray (_find) ) {
			if ( _.isObject (_replace) ) {
				if ( _find.length > 0 ) {
					_tmp = _find.pop ();
					this.recursiveStr = _.replace (
						this.recursiveStr, _tmp,
						_replace[_tmp]
					);
				}
			} else {
				_.error (WARNING_SYRUP.ERROR.NOOBJECTREPLACEREGEXP);
			}
		} else {

			while ( (
				(
					e = s.indexOf (_find)
				) > -1
			) ) {
				r += o.substring (b, b + e) + _replace;
				s = s.substring (e + _find.length, s.length);
				b += e + _find.length;
			}

			if ( !_.isEmpty (s) > 0 ) {
				r += o.substring (o.length - s.length, o.length);
			}

			if ( !_.isEmpty (r) ) {
				this.recursiveStr = r;
			}
		}

		return this.recursiveStr;
	});


	/**Retorna la fecha en un objeto
	 * @param fecha
	 * @returns {*}
	 */
	Syrup.add ('getDate', function (fecha) {
		var _fecha = new Date (),
			meridiano_,
			mes_ = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			minutos_ = _fecha.getMinutes (),
			hora_ = _fecha.getHours (),
			segundos_ = _fecha.getSeconds (),
			dia_ = _fecha.getDate ();

		_fecha = _.isSet (fecha)
			? new Date (fecha) : _fecha;

		if ( _fecha === 'Invalid Date' ) {
			_.error (_fecha);
		}

		dia_ = dia_ < 0xA
			? '0' + dia_ : dia_;

		meridiano_ = hora_ > 0xC
			? 'PM' : 'AM';

		hora_ = hora_ > 0xC
			? (
				  hora_ - 0xC
			  ) === 0
			? 0xC : (
			hora_ - 0xC
		) : hora_ < 0xA
			? '0' + hora_ : hora_;

		minutos_ = minutos_ < 0xA
			? '0' + minutos_ : minutos_;

		segundos_ = segundos_ < 0xA
			? '0' + segundos_ : segundos_;

		return {
			day     : dia_,
			month   : mes_[_fecha.getMonth ()],
			year    : _fecha.getFullYear (),
			hour    : hora_,
			minutes : minutos_,
			seconds : segundos_,
			meridian: meridiano_
		}
	});

	/**Retorna informacion del navegador
	 * @returns (Object|null)
	 */
	Syrup.add ('getNav', function () {
		var _regex = /(?:trident\/(?=\w.+rv:)|(?:chrome\/|firefox\/|opera\/|msie\s|safari\/))[\w.]{1,4}/,
			_matches = _.nav.local.match (_regex),
			_split = _.isSet (_matches) ? _matches[0].split ('/') : false;

		return _split ? {
			nav     : !!_split[0] ? _.replace (_split[0], 'trident', 'msie') : false,
			version : !!_split[1] ? _split[1] : false,
			platform: windowGlobal.navigator.platform.toLocaleLowerCase ()
		} : false;
	});


	/**Genera un id
	 * @param longitud
	 * @returns {string}
	 */
	Syrup.add ('getEncodedId', function (longitud) {
		var _text = _.emptyStr,
			_longitud = !!longitud ? longitud : 5,
			_possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=_";

		for ( var i = 0; i < _longitud; i++ )
			_text += _possible.charAt (Math.floor (Math.random () * _possible.length));

		return _text;
	});

	/**Devuelve las llaves de un objeto
	 * @param obj
	 * return {Boolean|Array}
	 */
	Syrup.add ('getObjectKeys', function (obj) {
		if ( _.isObject (obj) ) {
			return Object.keys (obj);
		}
		return [];

	});

	/**Devuelve el tamano de un objeto
	 * @param obj
	 * @returns (Number|null|Boolean)
	 */
	Syrup.add ('getObjectSize', function (obj) {
		if ( _.isObject (obj) ) {
			return _.getObjectKeys (obj).length;
		}
		return 0;
	});

	/**Devuelve el los valores del objeto
	 * @param obj
	 * @returns (Number|null|Boolean)
	 */
	Syrup.add ('getObjectValues', function (obj) {
		if ( _.isObject (obj) ) {
			return _.getObjectKeys (obj).map (function (k) {
				return obj[k];
			})
		}
		return [];
	});

	/**Retorna un objeto en String
	 * @param obj
	 * @returns {string}
	 */
	Syrup.add ('objectAsString', function (obj) {
		return nativeObject.toString.call (obj);
	});

	/**Immutable Object
	 * @param obj
	 */
	Syrup.add ('objectImmutable', function (obj) {
		if ( _.isObject (obj) )
			return Object.freeze (obj);

		return obj;
	});

	/**Watch Object
	 * @param obj
	 */
	Syrup.add ('objectWatch', function (obj, callback, conf) {
		if ( _.isObject (obj) && _.isSet (callback) )
			Object.observe (obj, callback, conf ? conf : []);

		return obj;
	});

	/** Interval Manager
	 * @param callback
	 * @param delay
	 * @param max
	 * @param orientation
	 */
	Syrup.add ('interval', function (callback, conf) {
		var _worker = new Workers;
		_worker.set ('/workers/setting/Interval').then (function (_worker) {
			_worker.send (conf);
			_worker.on ('message', function (e) {
				_.callbackAudit (callback, e.data);
			})
		});
		return _worker;
	});

	/**Prepare animation
	 * @param callback
	 * @return function
	 */
	Syrup.add ('requestAnimationFrame', function (callback) {
		return (
			windowGlobal.requestAnimationFrame ||
			windowGlobal.webkitRequestAnimationFrame ||
			windowGlobal.mozRequestAnimationFrame ||
			function (call) {
				windowGlobal.setTimeout (call, 0x3E8 / 0x3C);
			}
		) (callback);
	});

	/**Devuelve la cookie segun el nombre
	 * @param name
	 * @returns {*}
	 */
	Syrup.add ('getCookie', function (name) {
		var _mcookie = document.cookie,
			_cookie = null;
		if ( !!_mcookie && _mcookie !== _.emptyStr ) {
			var cookies = _mcookie.split (';');
			_.each (cookies, function (cookie) {
				cookie = cookie.split ('=');
				var _pre = cookie[0].trim (),
					_pos = cookie[1].trim ();
				if ( _pre === name ) {
					_cookie = _pos;
					return false;
				}
			})
		}
		return _cookie;
	});

	/****/
	Syrup.add ('simplifyDirectory', function (slashDir) {
		if ( _.isString (slashDir) ) {
			return slashDir.split ('/').join ('.')
		}
		return slashDir;
	});

	Syrup.add ('dotDirectory', function (dotDir) {
		if ( _.isString (dotDir) ) {
			return dotDir.split ('.').join ('/')
		}
		return dotDir;
	});


	/**Pasa Json a format URL
	 * @param _object
	 * @returns {string}
	 */
	Syrup.add ('jsonToQueryString', function (_object) {
		var _return = _.emptyStr,
			_size = _.isObject (_object)
				? _.getObjectSize (_object)
				: 0;

		_.each (_object, function (value, key) {
			_return += encodeURI (key + '=' + value);
			if ( _size > 1 ) {
				_return += '&';
			}
		});

		return _return.lastIndexOf ('&') > -1
			? _return.slice (0, -1) : _return;
	});

	/**Pasa Json a String
	 * @param json object
	 * @return string | null
	 * */
	Syrup.add ('jsonToString', function (json) {
		if ( _.isObject (json) )
			return JSON.stringify (json);
		return null;
	});


	/**Get Script
	 * @param url
	 * @param callback
	 */
	Syrup.add ('getScript', function (url, callback) {
		var _script = document.createElement ('script'),
			_body = document.body,
			_loaded = function () {
				_$ (_script).remove ();
				_.callbackAudit (callback);
			};

		if ( _.isSet (_script.readyState) ) {
			_script.addEventListener ('readystatechange', function () {
				if ( _script.readyState == 'loaded'
					 || _script.readyState == 'complete' ) {
					_loaded ();
				}
			}, false);
		} else {
			_script.addEventListener ('load', _loaded, false);
		}

		_script.src = url;
		_script.async = true;
		_body.appendChild (_script);
	});

	/**Simple Each
	 * @param _object
	 * @param callback
	 * @returns {boolean}
	 */
	Syrup.add ('each', function (_object, callback) {
		var _p = { first: false, last: false };
		if ( _.isArray (_object) ) {
			var i = 0,
				max = _object.length;
			for ( ; i < max; i++ ) {
				_p.first = i === 0;
				_p.last = (
							  i + 1
						  ) === max;
				_.callbackAudit (callback, _object[i], i, _p);
			}
		} else {
			if ( _.isObject (_object) ) {
				var _keys = Object.keys (_object),
					_tmp, _i = _tmp = _keys.length;

				while ( _i-- ) {
					_p.first = (
								   _i + 1
							   ) === _tmp;
					_p.last = _i === 0;
					_.callbackAudit (callback, _object[_keys[_i]], _keys[_i], _p);


				}
			}
		}

		return this;
	});

	/**Retorna la pocision exacta de un elemento y sus caracteristicas
	 * @param _dom
	 * @param all
	 * @returns {*}
	 */
	Syrup.add ('cartesianPlane', function (_dom, all) {
		_dom = _.is$ (_dom)
			? _$ (_dom).object ()
			: _dom;

		if ( _.isGlobal (_dom) ) {
			return {
				top   : _dom.pageYOffset,
				left  : _dom.pageXOffset,
				width : _dom.outerWidth,
				height: _dom.outerHeight
			}
		}

		return !!all
			? _dom.getClientRects ()
			: _dom.getBoundingClientRect ();

	});

	/**Verifica el callback y sirve de auditor
	 * @param callback
	 * @returns {boolean}
	 */
	Syrup.add ('callbackAudit', function (callback) {
		try {
			if ( !_.isSet (callback) ) {
				return false;
			}

			var _args = _.toArray (arguments);
			_args = _.filterArray (_args, function (v, i) {
				return !_.isFunction (v);
			});

			callback.apply (null, _args.length > 0
				? _args : null);

		}
		catch ( e ) {
			_.error (e);
		}
		return true;
	});

	/**Elimina elementos falsos de un Array
	 * @param arr

	 */
	Syrup.add ('compactArray', function (arr) {
		return _.filterArray (arr, function (i) {
			return !!i ? i : false;
		});
	});

	/**Elimina elementos falsos de un Array
	 * @param arr
	 * @param callback
	 */
	Syrup.add ('specArray', function (arr) {
		if ( !_.isArray (arr) ) {
			_.error (WARNING_SYRUP.ERROR.NOARRAY);
		}

		return arr.length > 1
			? arr : _.isSet (arr[0])
			? arr[0] : null;
	});


	Syrup.add ('repeatString', function (str, times) {
		return Array (times + 1).join (str);
	});

	/**Filtra Arreglos
	 * @param array
	 * @param filter
	 * @returns {Array}
	 */
	Syrup.add ('filterArray', function (array, filter) {
		return array.filter (filter);
	});

	/**Busca un elemento en un arreglo
	 * @param needle
	 * @param haystack
	 * @returns {boolean}
	 */
	Syrup.add ('inObject', function (needle, haystack) {
		var _exist = false;
		_.each (haystack, function (v, i) {
			if ( _.isObject (v) ) {
				_exist = _.inObject (needle, v);
				if ( _exist ) {
					return false;
				}
			} else {
				if ( v === needle ) {
					_exist = i;
					return false;
				}
			}
		});
		return _exist === 0
			? true : _exist;
	});

	/**Busca un elemento en un arreglo por RegExp
	 * @param find
	 * @param haystack
	 * @returns {boolean}
	 */
	Syrup.add ('matchInArray', function (find, haystack) {
		var needle = new RegExp (haystack.join ('|'), 'g');
		return needle.test (find);
	});

	/**Crea un arreglo unico de valores
	 * @param object
	 * @returns Array
	 */
	Syrup.add ('uniqueArray', function (array) {
		var _new = [];
		return array.filter (function (v) {
			if ( _new.indexOf (v) == -1 ) {
				_new.push (v);
				return v;
			}
		});
	});

	/**Parse to Array
	 * @param element
	 * @returns {Array}
	 */
	Syrup.add ('toArray', function (element) {

		if ( _.isObject (element) ) {
			return [].slice.apply (element);
		} else if ( _.isString (element) ) {
			return _.toObject (element);
		}
	});


	/** Parse to String
	 * @param element object
	 * @return string
	 * */

	Syrup.add ('toString', function (element) {
		if ( _.isObject (element) )
			return JSON.stringify (element);
	});

	/**Parse to Object
	 * @param element
	 * @returns {Object}
	 */
	Syrup.add ('toObject', function (element) {

		if ( _.isJson (element) )
			return JSON.parse (element);

		if ( _.isString (element) )
			return nativeObject.valueOf.call (element);

		if ( !_.isArray (element) )
			_.error (WARNING_SYRUP.ERROR.NOARRAY);


		return element.reduce (function (o, v, i) {
			o[i] = v;
			return o;
		}, {});


	});

	/**Distribute Array by index
	 * @param obj
	 * @param index
	 * @return {Object}
	 */

	Syrup.add ('objectDistribute', function (obj, index) {
		var _new = {};

		if ( !_.isObject (obj[index]) ) {
			_new[obj[index]] = obj;
		} else {
			_.each (obj[index], function (v, i) {
				_new[v] = {};
				_.each (obj, function (r, j) {
					if ( j !== index ) {
						_new[v][j].push (r[i]);
					}
				});

			});
		}

		return _new;
	});


	/**Get Element Index
	 * @param node
	 * @returns {number}
	 */
	Syrup.add ('getElementIndex', function (node) {
		var i = 1,
			prop = document.body.previousElementSibling
				? 'previousElementSibling' : 'previousSibling';
		while ( node = node[prop] ) {
			++i
		}
		return i;
	});

	/**Extend
	 * @param target
	 * @param source
	 * @returns {*}
	 */
	Syrup.add ('extend', function (target, source, overwrite) {
		if ( !_.isObject (target) || !source ) {
			return target;
		}

		if ( _.isFunction (source) ) {
			source = new source;
			target = target.__proto__
		}

		_.each (source, function (v, i) {
			if ( !target.hasOwnProperty (i)
				 || _.isSet (overwrite) ) {
				target[i] = v;
			}
		});
		return target;
	});


	//Super Global Object Instance
	windowGlobal._ = (function () {
		return new Syrup ();
	}) ();

	_.VERSION = '1.1';
	_.$fn = _$_;
	_.emptyStr = '';
	_.Syrup = Syrup;
	_.WARNING_SYRUP = WARNING_SYRUP;

	_.nav = {};
	_.nav.unsupported =
		!windowGlobal.localStorage
		|| !windowGlobal.File
		|| !windowGlobal.FileReader
		|| !windowGlobal.FileList
		|| !windowGlobal.Blob
		|| !windowGlobal.Worker
		|| !windowGlobal.WebSocket;
	_.nav.cookies = windowGlobal.navigator.cookieEnabled;
	_.nav.javascript = windowGlobal.navigator.javaEnabled ();
	_.nav.online = windowGlobal.navigator.onLine;
	_.nav.local = windowGlobal.navigator.userAgent.toLowerCase ();

	windowGlobal._$ = (function () {
		return (
			new _$_ ()
		).$;
	}) ();

}) (window);
/*
 Tested against Chromium build with Object.observe and acts EXACTLY the same,
 though Chromium build is MUCH faster
 Trying to stay as close to the spec as possible,
 this is a work in progress, feel free to comment/update
 Specification:
 http://wiki.ecmascript.org/doku.php?id=harmony:observe
 Built using parts of:
 https://github.com/tvcutsem/harmony-reflect/blob/master/examples/observer.js
 Limits so far;
 Built using polling... Will update again with polling/getter&setters to make things better at some point
 TODO:
 Add support for Object.prototype.watch -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
 */
if ( !Object.observe ) {
	(function (extend, global) {
		"use strict";
		var isCallable = (function (toString) {
			var s = toString.call (toString),
				u = typeof u;
			return typeof global.alert === "object" ?
				function isCallable (f) {
					return s === toString.call (f) || (!!f && typeof f.toString == u && typeof f.valueOf == u && /^\s*\bfunction\b/.test ("" + f));
				} :
				function isCallable (f) {
					return s === toString.call (f);
				}
				;
		}) (extend.prototype.toString);
		// isNode & isElement from
		// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
		// Returns true if it is a DOM node
		var isNode = function isNode (o) {
			return (
				typeof Node === "object" ? o instanceof Node :
				o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
			);
		};
		//Returns true if it is a DOM element
		var isElement = function isElement (o) {
			return (
				typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
			);
		};
		var _isImmediateSupported = (function () {
			return !!global.setImmediate;
		}) ();
		var _doCheckCallback = (function () {
			if ( _isImmediateSupported ) {
				return function _doCheckCallback (f) {
					return setImmediate (f);
				};
			} else {
				return function _doCheckCallback (f) {
					return setTimeout (f, 10);
				};
			}
		}) ();
		var _clearCheckCallback = (function () {
			if ( _isImmediateSupported ) {
				return function _clearCheckCallback (id) {
					clearImmediate (id);
				};
			} else {
				return function _clearCheckCallback (id) {
					clearTimeout (id);
				};
			}
		}) ();
		var isNumeric = function isNumeric (n) {
			return !isNaN (parseFloat (n)) && isFinite (n);
		};
		var sameValue = function sameValue (x, y) {
			if ( x === y ) {
				return x !== 0 || 1 / x === 1 / y;
			}
			return x !== x && y !== y;
		};
		var isAccessorDescriptor = function isAccessorDescriptor (desc) {
			if ( typeof(desc) === 'undefined' ) {
				return false;
			}
			return ('get' in desc || 'set' in desc);
		};
		var isDataDescriptor = function isDataDescriptor (desc) {
			if ( typeof(desc) === 'undefined' ) {
				return false;
			}
			return ('value' in desc || 'writable' in desc);
		};

		var validateArguments = function validateArguments (O, callback, accept) {
			if ( typeof(O) !== 'object' ) {
				// Throw Error
				throw new TypeError ("Object.observeObject called on non-object");
			}
			if ( isCallable (callback) === false ) {
				// Throw Error
				throw new TypeError ("Object.observeObject: Expecting function");
			}
			if ( Object.isFrozen (callback) === true ) {
				// Throw Error
				throw new TypeError ("Object.observeObject: Expecting unfrozen function");
			}
			if ( accept !== undefined ) {
				if ( !Array.isArray (accept) ) {
					throw new TypeError ("Object.observeObject: Expecting acceptList in the form of an array");
				}
			}
		};

		var Observer = (function Observer () {
			var wraped = [];
			var Observer = function Observer (O, callback, accept) {
				validateArguments (O, callback, accept);
				if ( !accept ) {
					accept = ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"];
				}
				Object.getNotifier (O).addListener (callback, accept);
				if ( wraped.indexOf (O) === -1 ) {
					wraped.push (O);
				} else {
					Object.getNotifier (O)._checkPropertyListing ();
				}
			};

			Observer.prototype.deliverChangeRecords = function Observer_deliverChangeRecords (O) {
				Object.getNotifier (O).deliverChangeRecords ();
			};

			wraped.lastScanned = 0;
			var f = (function f (wrapped) {
				return function _f () {
					var i = 0, l = wrapped.length, startTime = new Date (), takingTooLong = false;
					for ( i = wrapped.lastScanned; (i < l) && (!takingTooLong); i++ ) {
						if ( _indexes.indexOf (wrapped[i]) > -1 ) {
							Object.getNotifier (wrapped[i])._checkPropertyListing ();
							takingTooLong = ((new Date ()) - startTime) > 100; // make sure we don't take more than 100
																			   // milliseconds to scan all objects
						} else {
							wrapped.splice (i, 1);
							i--;
							l--;
						}
					}
					wrapped.lastScanned = i < l ? i : 0; // reset wrapped so we can make sure that we pick things back
														 // up
					_doCheckCallback (_f);
				};
			}) (wraped);
			_doCheckCallback (f);
			return Observer;
		}) ();

		var Notifier = function Notifier (watching) {
			var _listeners = [], _acceptLists = [], _updates = [], _updater = false, properties = [], values = [];
			var self = this;
			Object.defineProperty (self, '_watching', {
				enumerable: true,
				get       : (function (watched) {
					return function () {
						return watched;
					};
				}) (watching)
			});
			var wrapProperty = function wrapProperty (object, prop) {
				var propType = typeof(object[prop]), descriptor = Object.getOwnPropertyDescriptor (object, prop);
				if ( (prop === 'getNotifier') || isAccessorDescriptor (descriptor) || (!descriptor.enumerable) ) {
					return false;
				}
				if ( (object instanceof Array) && isNumeric (prop) ) {
					var idx = properties.length;
					properties[idx] = prop;
					values[idx] = object[prop];
					return true;
				}
				(function (idx, prop) {
					properties[idx] = prop;
					values[idx] = object[prop];
					function getter () {
						return values[getter.info.idx];
					}

					function setter (value) {
						if ( !sameValue (values[setter.info.idx], value) ) {
							Object.getNotifier (object).queueUpdate (object, prop, 'update', values[setter.info.idx]);
							values[setter.info.idx] = value;
						}
					}

					getter.info = setter.info = {
						idx: idx
					};
					Object.defineProperty (object, prop, {
						get: getter,
						set: setter
					});
				}) (properties.length, prop);
				return true;
			};
			self._checkPropertyListing = function _checkPropertyListing (dontQueueUpdates) {
				var object = self._watching, keys = Object.keys (object), i = 0, l = keys.length;
				var newKeys = [], oldKeys = properties.slice (0), updates = [];
				var prop, queueUpdates = !dontQueueUpdates, propType, value, idx, aLength;

				if ( object instanceof Array ) {
					aLength = self._oldLength;//object.length;
					//aLength = object.length;
				}

				for ( i = 0; i < l; i++ ) {
					prop = keys[i];
					value = object[prop];
					propType = typeof(value);
					if ( (idx = properties.indexOf (prop)) === -1 ) {
						if ( wrapProperty (object, prop) && queueUpdates ) {
							self.queueUpdate (object, prop, 'add', null, object[prop]);
						}
					} else {
						if ( !(object instanceof Array) || (isNumeric (prop)) ) {
							if ( values[idx] !== value ) {
								if ( queueUpdates ) {
									self.queueUpdate (object, prop, 'update', values[idx], value);
								}
								values[idx] = value;
							}
						}
						oldKeys.splice (oldKeys.indexOf (prop), 1);
					}
				}

				if ( object instanceof Array && object.length !== aLength ) {
					if ( queueUpdates ) {
						self.queueUpdate (object, 'length', 'update', aLength, object);
					}
					self._oldLength = object.length;
				}

				if ( queueUpdates ) {
					l = oldKeys.length;
					for ( i = 0; i < l; i++ ) {
						idx = properties.indexOf (oldKeys[i]);
						self.queueUpdate (object, oldKeys[i], 'delete', values[idx]);
						properties.splice (idx, 1);
						values.splice (idx, 1);
						for ( var i = idx; i < properties.length; i++ ) {
							if ( !(properties[i] in object) )
								continue;
							var getter = Object.getOwnPropertyDescriptor (object, properties[i]).get;
							if ( !getter )
								continue;
							var info = getter.info;
							info.idx = i;
						}
					}
					;
				}
			};
			self.addListener = function Notifier_addListener (callback, accept) {
				var idx = _listeners.indexOf (callback);
				if ( idx === -1 ) {
					_listeners.push (callback);
					_acceptLists.push (accept);
				}
				else {
					_acceptLists[idx] = accept;
				}
			};
			self.removeListener = function Notifier_removeListener (callback) {
				var idx = _listeners.indexOf (callback);
				if ( idx > -1 ) {
					_listeners.splice (idx, 1);
					_acceptLists.splice (idx, 1);
				}
			};
			self.listeners = function Notifier_listeners () {
				return _listeners;
			};
			self.queueUpdate = function Notifier_queueUpdate (what, prop, type, was) {
				this.queueUpdates ([
					{
						type    : type,
						object  : what,
						name    : prop,
						oldValue: was
					}
				]);
			};
			self.queueUpdates = function Notifier_queueUpdates (updates) {
				var self = this, i = 0, l = updates.length || 0, update;
				for ( i = 0; i < l; i++ ) {
					update = updates[i];
					_updates.push (update);
				}
				if ( _updater ) {
					_clearCheckCallback (_updater);
				}
				_updater = _doCheckCallback (function () {
					_updater = false;
					self.deliverChangeRecords ();
				});
			};
			self.deliverChangeRecords = function Notifier_deliverChangeRecords () {
				var i = 0, l = _listeners.length,
				//keepRunning = true, removed as it seems the actual implementation doesn't do this
				// In response to BUG #5
					retval;
				for ( i = 0; i < l; i++ ) {
					if ( _listeners[i] ) {
						var currentUpdates;
						if ( _acceptLists[i] ) {
							currentUpdates = [];
							for ( var j = 0, updatesLength = _updates.length; j < updatesLength; j++ ) {
								if ( _acceptLists[i].indexOf (_updates[j].type) !== -1 ) {
									currentUpdates.push (_updates[j]);
								}
							}
						}
						else {
							currentUpdates = _updates;
						}
						if ( currentUpdates.length ) {
							if ( _listeners[i] === console.log ) {
								console.log (currentUpdates);
							} else {
								_listeners[i] (currentUpdates);
							}
						}
					}
				}
				_updates = [];
			};
			self.notify = function Notifier_notify (changeRecord) {
				if ( typeof changeRecord !== "object" || typeof changeRecord.type !== "string" ) {
					throw new TypeError ("Invalid changeRecord with non-string 'type' property");
				}
				changeRecord.object = watching;
				self.queueUpdates ([changeRecord]);
			};
			self._checkPropertyListing (true);
		};

		var _notifiers = [], _indexes = [];
		extend.getNotifier = function Object_getNotifier (O) {
			var idx = _indexes.indexOf (O), notifier = idx > -1 ? _notifiers[idx] : false;
			if ( !notifier ) {
				idx = _indexes.length;
				_indexes[idx] = O;
				notifier = _notifiers[idx] = new Notifier (O);
			}
			return notifier;
		};
		extend.observe = function Object_observe (O, callback, accept) {
			// For Bug 4, can't observe DOM elements tested against canry implementation and matches
			if ( !isElement (O) ) {
				return new Observer (O, callback, accept);
			}
		};
		extend.unobserve = function Object_unobserve (O, callback) {
			validateArguments (O, callback);
			var idx = _indexes.indexOf (O),
				notifier = idx > -1 ? _notifiers[idx] : false;
			if ( !notifier ) {
				return;
			}
			notifier.removeListener (callback);
			if ( notifier.listeners ().length === 0 ) {
				_indexes.splice (idx, 1);
				_notifiers.splice (idx, 1);
			}
		};
	}) (Object, this);
}
/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.20 Copyright (c) 2010-2015, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

//http://requirejs.org/docs/api.html
//Fallback
function Required () {
	var requirejs, require, define;
	(function (global) {
		var req, s, head, baseElement, dataMain, src,
			interactiveScript, currentlyAddingScript, mainScript, subPath,
			version = '2.1.20',
			commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
			cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
			jsSuffixRegExp = /\.js$/,
			currDirRegExp = /^\.\//,
			op = Object.prototype,
			ostring = op.toString,
			hasOwn = op.hasOwnProperty,
			ap = Array.prototype,
			isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
			isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
		//PS3 indicates loaded and complete, but need to wait for complete
		//specifically. Sequence is 'loading', 'loaded', execution,
		// then 'complete'. The UA check is unfortunate, but not sure how
		//to feature test w/o causing perf issues.
			readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
				/^complete$/ : /^(complete|loaded)$/,
			defContextName = '_',
		//Oh the tragedy, detecting opera. See the usage of isOpera for reason.
			isOpera = typeof opera !== 'undefined' && opera.toString () === '[object Opera]',
			contexts = {},
			cfg = {},
			globalDefQueue = [],
			useInteractive = false;

		function isFunction (it) {
			return ostring.call (it) === '[object Function]';
		}

		function isArray (it) {
			return ostring.call (it) === '[object Array]';
		}

		/**
		 * Helper function for iterating over an array. If the func returns
		 * a true value, it will break out of the loop.
		 */
		function each (ary, func) {
			if ( ary ) {
				var i;
				for ( i = 0; i < ary.length; i += 1 ) {
					if ( ary[i] && func (ary[i], i, ary) ) {
						break;
					}
				}
			}
		}

		/**
		 * Helper function for iterating over an array backwards. If the func
		 * returns a true value, it will break out of the loop.
		 */
		function eachReverse (ary, func) {
			if ( ary ) {
				var i;
				for ( i = ary.length - 1; i > -1; i -= 1 ) {
					if ( ary[i] && func (ary[i], i, ary) ) {
						break;
					}
				}
			}
		}

		function hasProp (obj, prop) {
			return hasOwn.call (obj, prop);
		}

		function getOwn (obj, prop) {
			return hasProp (obj, prop) && obj[prop];
		}

		/**
		 * Cycles over properties in an object and calls a function for each
		 * property value. If the function returns a truthy value, then the
		 * iteration is stopped.
		 */
		function eachProp (obj, func) {
			var prop;
			for ( prop in obj ) {
				if ( hasProp (obj, prop) ) {
					if ( func (obj[prop], prop) ) {
						break;
					}
				}
			}
		}

		/**
		 * Simple function to mix in properties from source into target,
		 * but only if target does not already have a property of the same name.
		 */
		function mixin (target, source, force, deepStringMixin) {
			if ( source ) {
				eachProp (source, function (value, prop) {
					if ( force || !hasProp (target, prop) ) {
						if ( deepStringMixin && typeof value === 'object' && value && !isArray (value) && !isFunction (value) && !(value instanceof RegExp) ) {

							if ( !target[prop] ) {
								target[prop] = {};
							}
							mixin (target[prop], value, force, deepStringMixin);
						} else {
							target[prop] = value;
						}
					}
				});
			}
			return target;
		}

		//Similar to Function.prototype.bind, but the 'this' object is specified
		//first, since it is easier to read/figure out what 'this' will be.
		function bind (obj, fn) {
			return function () {
				return fn.apply (obj, arguments);
			};
		}

		function scripts () {
			return document.getElementsByTagName ('script');
		}

		function defaultOnError (err) {
			throw err;
		}

		//Allow getting a global that is expressed in
		//dot notation, like 'a.b.c'.
		function getGlobal (value) {
			if ( !value ) {
				return value;
			}
			var g = global;
			each (value.split ('.'), function (part) {
				g = g[part];
			});
			return g;
		}

		/**
		 * Constructs an error with a pointer to an URL with more information.
		 * @param {String} id the error ID that maps to an ID on a web page.
		 * @param {String} message human readable error.
		 * @param {Error} [err] the original error, if there is one.
		 *
		 * @returns {Error}
		 */
		function makeError (id, msg, err, requireModules) {
			var e = new Error (msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
			e.requireType = id;
			e.requireModules = requireModules;
			if ( err ) {
				e.originalError = err;
			}
			return e;
		}

		if ( typeof define !== 'undefined' ) {
			//If a define is already in play via another AMD loader,
			//do not overwrite.
			return;
		}

		if ( typeof requirejs !== 'undefined' ) {
			if ( isFunction (requirejs) ) {
				//Do not overwrite an existing requirejs instance.
				return;
			}
			cfg = requirejs;
			requirejs = undefined;
		}

		//Allow for a require config object
		if ( typeof require !== 'undefined' && !isFunction (require) ) {
			//assume it is a config object.
			cfg = require;
			require = undefined;
		}

		function newContext (contextName) {
			var inCheckLoaded, Module, context, handlers,
				checkLoadedTimeoutId,
				config = {
					//Defaults. Do not set a default for map
					//config to speed up normalize(), which
					//will run faster if there is no default.
					waitSeconds: 7,
					baseUrl    : './',
					paths      : {},
					bundles    : {},
					pkgs       : {},
					shim       : {},
					config     : {}
				},
				registry = {},
			//registry of just enabled modules, to speed
			//cycle breaking code when lots of modules
			//are registered, but not activated.
				enabledRegistry = {},
				undefEvents = {},
				defQueue = [],
				defined = {},
				urlFetched = {},
				bundlesMap = {},
				requireCounter = 1,
				unnormalizedCounter = 1;

			/**
			 * Trims the . and .. from an array of path segments.
			 * It will keep a leading path segment if a .. will become
			 * the first path segment, to help with module name lookups,
			 * which act like paths, but can be remapped. But the end result,
			 * all paths that use this function should look normalized.
			 * NOTE: this method MODIFIES the input array.
			 * @param {Array} ary the array of path segments.
			 */
			function trimDots (ary) {
				var i, part;
				for ( i = 0; i < ary.length; i++ ) {
					part = ary[i];
					if ( part === '.' ) {
						ary.splice (i, 1);
						i -= 1;
					} else if ( part === '..' ) {
						// If at the start, or previous value is still ..,
						// keep them so that when converted to a path it may
						// still work when converted to a path, even though
						// as an ID it is less than ideal. In larger point
						// releases, may be better to just kick out an error.
						if ( i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..' ) {
							continue;
						} else if ( i > 0 ) {
							ary.splice (i - 1, 2);
							i -= 2;
						}
					}
				}
			}

			/**
			 * Given a relative module name, like ./something, normalize it to
			 * a real name that can be mapped to a path.
			 * @param {String} name the relative name
			 * @param {String} baseName a real name that the name arg is relative
			 * to.
			 * @param {Boolean} applyMap apply the map config to the value. Should
			 * only be done if this normalization is for a dependency ID.
			 * @returns {String} normalized name
			 */
			function normalize (name, baseName, applyMap) {
				var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex,
					foundMap, foundI, foundStarMap, starI, normalizedBaseParts,
					baseParts = (baseName && baseName.split ('/')),
					map = config.map,
					starMap = map && map['*'];

				//Adjust any relative paths.
				if ( name ) {
					name = name.split ('/');
					lastIndex = name.length - 1;

					// If wanting node ID compatibility, strip .js from end
					// of IDs. Have to do this here, and not in nameToUrl
					// because node allows either .js or non .js to map
					// to same file.
					if ( config.nodeIdCompat && jsSuffixRegExp.test (name[lastIndex]) ) {
						name[lastIndex] = name[lastIndex].replace (jsSuffixRegExp, '');
					}

					// Starts with a '.' so need the baseName
					if ( name[0].charAt (0) === '.' && baseParts ) {
						//Convert baseName to array, and lop off the last part,
						//so that . matches that 'directory' and not name of the baseName's
						//module. For instance, baseName of 'one/two/three', maps to
						//'one/two/three.js', but we want the directory, 'one/two' for
						//this normalization.
						normalizedBaseParts = baseParts.slice (0, baseParts.length - 1);
						name = normalizedBaseParts.concat (name);
					}

					trimDots (name);
					name = name.join ('/');
				}

				//Apply map config if available.
				if ( applyMap && map && (baseParts || starMap) ) {
					nameParts = name.split ('/');

					outerLoop: for ( i = nameParts.length; i > 0; i -= 1 ) {
						nameSegment = nameParts.slice (0, i).join ('/');

						if ( baseParts ) {
							//Find the longest baseName segment match in the config.
							//So, do joins on the biggest to smallest lengths of baseParts.
							for ( j = baseParts.length; j > 0; j -= 1 ) {
								mapValue = getOwn (map, baseParts.slice (0, j).join ('/'));

								//baseName segment has config, find if it has one for
								//this name.
								if ( mapValue ) {
									mapValue = getOwn (mapValue, nameSegment);
									if ( mapValue ) {
										//Match, update name to the new value.
										foundMap = mapValue;
										foundI = i;
										break outerLoop;
									}
								}
							}
						}

						//Check for a star map match, but just hold on to it,
						//if there is a shorter segment match later in a matching
						//config, then favor over this star map.
						if ( !foundStarMap && starMap && getOwn (starMap, nameSegment) ) {
							foundStarMap = getOwn (starMap, nameSegment);
							starI = i;
						}
					}

					if ( !foundMap && foundStarMap ) {
						foundMap = foundStarMap;
						foundI = starI;
					}

					if ( foundMap ) {
						nameParts.splice (0, foundI, foundMap);
						name = nameParts.join ('/');
					}
				}

				// If the name points to a package's name, use
				// the package main instead.
				pkgMain = getOwn (config.pkgs, name);

				return pkgMain ? pkgMain : name;
			}

			function removeScript (name) {
				if ( isBrowser ) {
					each (scripts (), function (scriptNode) {
						if ( scriptNode.getAttribute ('data-requiremodule') === name &&
							 scriptNode.getAttribute ('data-requirecontext') === context.contextName ) {
							scriptNode.parentNode.removeChild (scriptNode);
							return true;
						}
					});
				}
			}

			function hasPathFallback (id) {
				var pathConfig = getOwn (config.paths, id);
				if ( pathConfig && isArray (pathConfig) && pathConfig.length > 1 ) {
					//Pop off the first array value, since it failed, and
					//retry
					pathConfig.shift ();
					context.require.undef (id);

					//Custom require that does not do map translation, since
					//ID is "absolute", already mapped/resolved.
					context.makeRequire (null, {
						skipMap: true
					}) ([id]);

					return true;
				}
			}

			//Turns a plugin!resource to [plugin, resource]
			//with the plugin being undefined if the name
			//did not have a plugin prefix.
			function splitPrefix (name) {
				var prefix,
					index = name ? name.indexOf ('!') : -1;
				if ( index > -1 ) {
					prefix = name.substring (0, index);
					name = name.substring (index + 1, name.length);
				}
				return [prefix, name];
			}

			/**
			 * Creates a module mapping that includes plugin prefix, module
			 * name, and path. If parentModuleMap is provided it will
			 * also normalize the name via require.normalize()
			 *
			 * @param {String} name the module name
			 * @param {String} [parentModuleMap] parent module map
			 * for the module name, used to resolve relative names.
			 * @param {Boolean} isNormalized: is the ID already normalized.
			 * This is true if this call is done for a define() module ID.
			 * @param {Boolean} applyMap: apply the map config to the ID.
			 * Should only be true if this map is for a dependency.
			 *
			 * @returns {Object}
			 */
			function makeModuleMap (name, parentModuleMap, isNormalized, applyMap) {
				var url, pluginModule, suffix, nameParts,
					prefix = null,
					parentName = parentModuleMap ? parentModuleMap.name : null,
					originalName = name,
					isDefine = true,
					normalizedName = '';

				//If no name, then it means it is a require call, generate an
				//internal name.
				if ( !name ) {
					isDefine = false;
					name = '_@r' + (requireCounter += 1);
				}

				nameParts = splitPrefix (name);
				prefix = nameParts[0];
				name = nameParts[1];

				if ( prefix ) {
					prefix = normalize (prefix, parentName, applyMap);
					pluginModule = getOwn (defined, prefix);
				}

				//Account for relative paths if there is a base name.
				if ( name ) {
					if ( prefix ) {
						if ( pluginModule && pluginModule.normalize ) {
							//Plugin is loaded, use its normalize method.
							normalizedName = pluginModule.normalize (name, function (name) {
								return normalize (name, parentName, applyMap);
							});
						} else {
							// If nested plugin references, then do not try to
							// normalize, as it will not normalize correctly. This
							// places a restriction on resourceIds, and the longer
							// term solution is not to normalize until plugins are
							// loaded and all normalizations to allow for async
							// loading of a loader plugin. But for now, fixes the
							// common uses. Details in #1131
							normalizedName = name.indexOf ('!') === -1 ?
								normalize (name, parentName, applyMap) :
								name;
						}
					} else {
						//A regular module.
						normalizedName = normalize (name, parentName, applyMap);

						//Normalized name may be a plugin ID due to map config
						//application in normalize. The map config values must
						//already be normalized, so do not need to redo that part.
						nameParts = splitPrefix (normalizedName);
						prefix = nameParts[0];
						normalizedName = nameParts[1];
						isNormalized = true;

						url = context.nameToUrl (normalizedName);
					}
				}

				//If the id is a plugin id that cannot be determined if it needs
				//normalization, stamp it with a unique ID so two matching relative
				//ids that may conflict can be separate.
				suffix = prefix && !pluginModule && !isNormalized ?
				'_unnormalized' + (unnormalizedCounter += 1) :
					'';

				return {
					prefix      : prefix,
					name        : normalizedName,
					parentMap   : parentModuleMap,
					unnormalized: !!suffix,
					url         : url,
					originalName: originalName,
					isDefine    : isDefine,
					id          : (prefix ?
								  prefix + '!' + normalizedName :
						normalizedName) + suffix
				};
			}

			function getModule (depMap) {
				var id = depMap.id,
					mod = getOwn (registry, id);

				if ( !mod ) {
					mod = registry[id] = new context.Module (depMap);
				}

				return mod;
			}

			function on (depMap, name, fn) {
				var id = depMap.id,
					mod = getOwn (registry, id);

				if ( hasProp (defined, id) &&
					 (!mod || mod.defineEmitComplete) ) {
					if ( name === 'defined' ) {
						fn (defined[id]);
					}
				} else {
					mod = getModule (depMap);
					if ( mod.error && name === 'error' ) {
						fn (mod.error);
					} else {
						mod.on (name, fn);
					}
				}
			}

			function onError (err, errback) {
				var ids = err.requireModules,
					notified = false;

				if ( errback ) {
					errback (err);
				} else {
					each (ids, function (id) {
						var mod = getOwn (registry, id);
						if ( mod ) {
							//Set error on module, so it skips timeout checks.
							mod.error = err;
							if ( mod.events.error ) {
								notified = true;
								mod.emit ('error', err);
							}
						}
					});

					if ( !notified ) {
						req.onError (err);
					}
				}
			}

			/**
			 * Internal method to transfer globalQueue items to this context's
			 * defQueue.
			 */
			function takeGlobalQueue () {
				//Push all the globalDefQueue items into the context's defQueue
				if ( globalDefQueue.length ) {
					each (globalDefQueue, function (queueItem) {
						var id = queueItem[0];
						if ( typeof id === 'string' ) {
							context.defQueueMap[id] = true;
						}
						defQueue.push (queueItem);
					});
					globalDefQueue = [];
				}
			}

			handlers = {
				'require': function (mod) {
					if ( mod.require ) {
						return mod.require;
					} else {
						return (mod.require = context.makeRequire (mod.map));
					}
				},
				'exports': function (mod) {
					mod.usingExports = true;
					if ( mod.map.isDefine ) {
						if ( mod.exports ) {
							return (defined[mod.map.id] = mod.exports);
						} else {
							return (mod.exports = defined[mod.map.id] = {});
						}
					}
				},
				'module' : function (mod) {
					if ( mod.module ) {
						return mod.module;
					} else {
						return (mod.module = {
							id     : mod.map.id,
							uri    : mod.map.url,
							config : function () {
								return getOwn (config.config, mod.map.id) || {};
							},
							exports: mod.exports || (mod.exports = {})
						});
					}
				}
			};

			function cleanRegistry (id) {
				//Clean up machinery used for waiting modules.
				delete registry[id];
				delete enabledRegistry[id];
			}

			function breakCycle (mod, traced, processed) {
				var id = mod.map.id;

				if ( mod.error ) {
					mod.emit ('error', mod.error);
				} else {
					traced[id] = true;
					each (mod.depMaps, function (depMap, i) {
						var depId = depMap.id,
							dep = getOwn (registry, depId);

						//Only force things that have not completed
						//being defined, so still in the registry,
						//and only if it has not been matched up
						//in the module already.
						if ( dep && !mod.depMatched[i] && !processed[depId] ) {
							if ( getOwn (traced, depId) ) {
								mod.defineDep (i, defined[depId]);
								mod.check (); //pass false?
							} else {
								breakCycle (dep, traced, processed);
							}
						}
					});
					processed[id] = true;
				}
			}

			function checkLoaded () {
				var err, usingPathFallback,
					waitInterval = config.waitSeconds * 1000,
				//It is possible to disable the wait interval by using waitSeconds of 0.
					expired = waitInterval && (context.startTime + waitInterval) < new Date ().getTime (),
					noLoads = [],
					reqCalls = [],
					stillLoading = false,
					needCycleCheck = true;

				//Do not bother if this call was a result of a cycle break.
				if ( inCheckLoaded ) {
					return;
				}

				inCheckLoaded = true;

				//Figure out the state of all the modules.
				eachProp (enabledRegistry, function (mod) {
					var map = mod.map,
						modId = map.id;

					//Skip things that are not enabled or in error state.
					if ( !mod.enabled ) {
						return;
					}

					if ( !map.isDefine ) {
						reqCalls.push (mod);
					}

					if ( !mod.error ) {
						//If the module should be executed, and it has not
						//been inited and time is up, remember it.
						if ( !mod.inited && expired ) {
							if ( hasPathFallback (modId) ) {
								usingPathFallback = true;
								stillLoading = true;
							} else {
								noLoads.push (modId);
								removeScript (modId);
							}
						} else if ( !mod.inited && mod.fetched && map.isDefine ) {
							stillLoading = true;
							if ( !map.prefix ) {
								//No reason to keep looking for unfinished
								//loading. If the only stillLoading is a
								//plugin resource though, keep going,
								//because it may be that a plugin resource
								//is waiting on a non-plugin cycle.
								return (needCycleCheck = false);
							}
						}
					}
				});

				if ( expired && noLoads.length ) {
					//If wait time expired, throw error of unloaded modules.
					err = makeError ('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
					err.contextName = context.contextName;
					return onError (err);
				}

				//Not expired, check for a cycle.
				if ( needCycleCheck ) {
					each (reqCalls, function (mod) {
						breakCycle (mod, {}, {});
					});
				}

				//If still waiting on loads, and the waiting load is something
				//other than a plugin resource, or there are still outstanding
				//scripts, then just try back later.
				if ( (!expired || usingPathFallback) && stillLoading ) {
					//Something is still waiting to load. Wait for it, but only
					//if a timeout is not already in effect.
					if ( (isBrowser || isWebWorker) && !checkLoadedTimeoutId ) {
						checkLoadedTimeoutId = setTimeout (function () {
							checkLoadedTimeoutId = 0;
							checkLoaded ();
						}, 50);
					}
				}

				inCheckLoaded = false;
			}

			Module = function (map) {
				this.events = getOwn (undefEvents, map.id) || {};
				this.map = map;
				this.shim = getOwn (config.shim, map.id);
				this.depExports = [];
				this.depMaps = [];
				this.depMatched = [];
				this.pluginMaps = {};
				this.depCount = 0;

				/* this.exports this.factory
				 this.depMaps = [],
				 this.enabled, this.fetched
				 */
			};

			Module.prototype = {
				init: function (depMaps, factory, errback, options) {
					options = options || {};

					//Do not do more inits if already done. Can happen if there
					//are multiple define calls for the same module. That is not
					//a normal, common case, but it is also not unexpected.
					if ( this.inited ) {
						return;
					}

					this.factory = factory;

					if ( errback ) {
						//Register for errors on this module.
						this.on ('error', errback);
					} else if ( this.events.error ) {
						//If no errback already, but there are error listeners
						//on this module, set up an errback to pass to the deps.
						errback = bind (this, function (err) {
							this.emit ('error', err);
						});
					}

					//Do a copy of the dependency array, so that
					//source inputs are not modified. For example
					//"shim" deps are passed in here directly, and
					//doing a direct modification of the depMaps array
					//would affect that config.
					this.depMaps = depMaps && depMaps.slice (0);

					this.errback = errback;

					//Indicate this module has be initialized
					this.inited = true;

					this.ignore = options.ignore;

					//Could have option to init this module in enabled mode,
					//or could have been previously marked as enabled. However,
					//the dependencies are not known until init is called. So
					//if enabled previously, now trigger dependencies as enabled.
					if ( options.enabled || this.enabled ) {
						//Enable this module and dependencies.
						//Will call this.check()
						this.enable ();
					} else {
						this.check ();
					}
				},

				defineDep: function (i, depExports) {
					//Because of cycles, defined callback for a given
					//export can be called more than once.
					if ( !this.depMatched[i] ) {
						this.depMatched[i] = true;
						this.depCount -= 1;
						this.depExports[i] = depExports;
					}
				},

				fetch: function () {
					if ( this.fetched ) {
						return;
					}
					this.fetched = true;

					context.startTime = (new Date ()).getTime ();

					var map = this.map;

					//If the manager is for a plugin managed resource,
					//ask the plugin to load it now.
					if ( this.shim ) {
						context.makeRequire (this.map, {
							enableBuildCallback: true
						}) (this.shim.deps || [], bind (this, function () {
							return map.prefix ? this.callPlugin () : this.load ();
						}));
					} else {
						//Regular dependency.
						return map.prefix ? this.callPlugin () : this.load ();
					}
				},

				load: function () {
					var url = this.map.url;

					//Regular dependency.
					if ( !urlFetched[url] ) {
						urlFetched[url] = true;
						context.load (this.map.id, url);
					}
				},

				/**
				 * Checks if the module is ready to define itself, and if so,
				 * define it.
				 */
				check: function () {
					if ( !this.enabled || this.enabling ) {
						return;
					}

					var err, cjsModule,
						id = this.map.id,
						depExports = this.depExports,
						exports = this.exports,
						factory = this.factory;

					if ( !this.inited ) {
						// Only fetch if not already in the defQueue.
						if ( !hasProp (context.defQueueMap, id) ) {
							this.fetch ();
						}
					} else if ( this.error ) {
						this.emit ('error', this.error);
					} else if ( !this.defining ) {
						//The factory could trigger another require call
						//that would result in checking this module to
						//define itself again. If already in the process
						//of doing that, skip this work.
						this.defining = true;

						if ( this.depCount < 1 && !this.defined ) {
							if ( isFunction (factory) ) {
								//If there is an error listener, favor passing
								//to that instead of throwing an error. However,
								//only do it for define()'d  modules. require
								//errbacks should not be called for failures in
								//their callbacks (#699). However if a global
								//onError is set, use that.
								if ( (this.events.error && this.map.isDefine) ||
									 req.onError !== defaultOnError ) {
									try {
										exports = context.execCb (id, factory, depExports, exports);
									} catch ( e ) {
										err = e;
									}
								} else {
									exports = context.execCb (id, factory, depExports, exports);
								}

								// Favor return value over exports. If node/cjs in play,
								// then will not have a return value anyway. Favor
								// module.exports assignment over exports object.
								if ( this.map.isDefine && exports === undefined ) {
									cjsModule = this.module;
									if ( cjsModule ) {
										exports = cjsModule.exports;
									} else if ( this.usingExports ) {
										//exports already set the defined value.
										exports = this.exports;
									}
								}

								if ( err ) {
									err.requireMap = this.map;
									err.requireModules = this.map.isDefine ? [this.map.id] : null;
									err.requireType = this.map.isDefine ? 'define' : 'require';
									return onError ((this.error = err));
								}

							} else {
								//Just a literal value
								exports = factory;
							}

							this.exports = exports;

							if ( this.map.isDefine && !this.ignore ) {
								defined[id] = exports;

								if ( req.onResourceLoad ) {
									req.onResourceLoad (context, this.map, this.depMaps);
								}
							}

							//Clean up
							cleanRegistry (id);

							this.defined = true;
						}

						//Finished the define stage. Allow calling check again
						//to allow define notifications below in the case of a
						//cycle.
						this.defining = false;

						if ( this.defined && !this.defineEmitted ) {
							this.defineEmitted = true;
							this.emit ('defined', this.exports);
							this.defineEmitComplete = true;
						}

					}
				},

				callPlugin: function () {
					var map = this.map,
						id = map.id,
					//Map already normalized the prefix.
						pluginMap = makeModuleMap (map.prefix);

					//Mark this as a dependency for this plugin, so it
					//can be traced for cycles.
					this.depMaps.push (pluginMap);

					on (pluginMap, 'defined', bind (this, function (plugin) {
						var load, normalizedMap, normalizedMod,
							bundleId = getOwn (bundlesMap, this.map.id),
							name = this.map.name,
							parentName = this.map.parentMap ? this.map.parentMap.name : null,
							localRequire = context.makeRequire (map.parentMap, {
								enableBuildCallback: true
							});

						//If current map is not normalized, wait for that
						//normalized name to load instead of continuing.
						if ( this.map.unnormalized ) {
							//Normalize the ID if the plugin allows it.
							if ( plugin.normalize ) {
								name = plugin.normalize (name, function (name) {
										return normalize (name, parentName, true);
									}) || '';
							}

							//prefix and name should already be normalized, no need
							//for applying map config again either.
							normalizedMap = makeModuleMap (map.prefix + '!' + name,
														   this.map.parentMap);
							on (normalizedMap,
								'defined', bind (this, function (value) {
									this.init ([], function () { return value; }, null, {
										enabled: true,
										ignore : true
									});
								}));

							normalizedMod = getOwn (registry, normalizedMap.id);
							if ( normalizedMod ) {
								//Mark this as a dependency for this plugin, so it
								//can be traced for cycles.
								this.depMaps.push (normalizedMap);

								if ( this.events.error ) {
									normalizedMod.on ('error', bind (this, function (err) {
										this.emit ('error', err);
									}));
								}
								normalizedMod.enable ();
							}

							return;
						}

						//If a paths config, then just load that file instead to
						//resolve the plugin, as it is built into that paths layer.
						if ( bundleId ) {
							this.map.url = context.nameToUrl (bundleId);
							this.load ();
							return;
						}

						load = bind (this, function (value) {
							this.init ([], function () { return value; }, null, {
								enabled: true
							});
						});

						load.error = bind (this, function (err) {
							this.inited = true;
							this.error = err;
							err.requireModules = [id];

							//Remove temp unnormalized modules for this module,
							//since they will never be resolved otherwise now.
							eachProp (registry, function (mod) {
								if ( mod.map.id.indexOf (id + '_unnormalized') === 0 ) {
									cleanRegistry (mod.map.id);
								}
							});

							onError (err);
						});

						//Allow plugins to load other code without having to know the
						//context or how to 'complete' the load.
						load.fromText = bind (this, function (text, textAlt) {
							/*jslint evil: true */
							var moduleName = map.name,
								moduleMap = makeModuleMap (moduleName),
								hasInteractive = useInteractive;

							//As of 2.1.0, support just passing the text, to reinforce
							//fromText only being called once per resource. Still
							//support old style of passing moduleName but discard
							//that moduleName in favor of the internal ref.
							if ( textAlt ) {
								text = textAlt;
							}

							//Turn off interactive script matching for IE for any define
							//calls in the text, then turn it back on at the end.
							if ( hasInteractive ) {
								useInteractive = false;
							}

							//Prime the system by creating a module instance for
							//it.
							getModule (moduleMap);

							//Transfer any config to this other module.
							if ( hasProp (config.config, id) ) {
								config.config[moduleName] = config.config[id];
							}

							try {
								req.exec (text);
							} catch ( e ) {
								return onError (makeError ('fromtexteval',
														   'fromText eval for ' + id +
														   ' failed: ' + e,
														   e,
														   [id]));
							}

							if ( hasInteractive ) {
								useInteractive = true;
							}

							//Mark this as a dependency for the plugin
							//resource
							this.depMaps.push (moduleMap);

							//Support anonymous modules.
							context.completeLoad (moduleName);

							//Bind the value of that module to the value for this
							//resource ID.
							localRequire ([moduleName], load);
						});

						//Use parentName here since the plugin's name is not reliable,
						//could be some weird string with no path that actually wants to
						//reference the parentName's path.
						plugin.load (map.name, localRequire, load, config);
					}));

					context.enable (pluginMap, this);
					this.pluginMaps[pluginMap.id] = pluginMap;
				},

				enable: function () {
					enabledRegistry[this.map.id] = this;
					this.enabled = true;

					//Set flag mentioning that the module is enabling,
					//so that immediate calls to the defined callbacks
					//for dependencies do not trigger inadvertent load
					//with the depCount still being zero.
					this.enabling = true;

					//Enable each dependency
					each (this.depMaps, bind (this, function (depMap, i) {
						var id, mod, handler;

						if ( typeof depMap === 'string' ) {
							//Dependency needs to be converted to a depMap
							//and wired up to this module.
							depMap = makeModuleMap (depMap,
													(this.map.isDefine ? this.map : this.map.parentMap),
													false,
													!this.skipMap);
							this.depMaps[i] = depMap;

							handler = getOwn (handlers, depMap.id);

							if ( handler ) {
								this.depExports[i] = handler (this);
								return;
							}

							this.depCount += 1;

							on (depMap, 'defined', bind (this, function (depExports) {
								if ( this.undefed ) {
									return;
								}
								this.defineDep (i, depExports);
								this.check ();
							}));

							if ( this.errback ) {
								on (depMap, 'error', bind (this, this.errback));
							} else if ( this.events.error ) {
								// No direct errback on this module, but something
								// else is listening for errors, so be sure to
								// propagate the error correctly.
								on (depMap, 'error', bind (this, function (err) {
									this.emit ('error', err);
								}));
							}
						}

						id = depMap.id;
						mod = registry[id];

						//Skip special modules like 'require', 'exports', 'module'
						//Also, don't call enable if it is already enabled,
						//important in circular dependency cases.
						if ( !hasProp (handlers, id) && mod && !mod.enabled ) {
							context.enable (depMap, this);
						}
					}));

					//Enable each plugin that is used in
					//a dependency
					eachProp (this.pluginMaps, bind (this, function (pluginMap) {
						var mod = getOwn (registry, pluginMap.id);
						if ( mod && !mod.enabled ) {
							context.enable (pluginMap, this);
						}
					}));

					this.enabling = false;

					this.check ();
				},

				on: function (name, cb) {
					var cbs = this.events[name];
					if ( !cbs ) {
						cbs = this.events[name] = [];
					}
					cbs.push (cb);
				},

				emit: function (name, evt) {
					each (this.events[name], function (cb) {
						cb (evt);
					});
					if ( name === 'error' ) {
						//Now that the error handler was triggered, remove
						//the listeners, since this broken Module instance
						//can stay around for a while in the registry.
						delete this.events[name];
					}
				}
			};

			function callGetModule (args) {
				//Skip modules already defined.
				if ( !hasProp (defined, args[0]) ) {
					getModule (makeModuleMap (args[0], null, true)).init (args[1], args[2]);
				}
			}

			function removeListener (node, func, name, ieName) {
				//Favor detachEvent because of IE9
				//issue, see attachEvent/addEventListener comment elsewhere
				//in this file.
				if ( node.detachEvent && !isOpera ) {
					//Probably IE. If not it will throw an error, which will be
					//useful to know.
					if ( ieName ) {
						node.detachEvent (ieName, func);
					}
				} else {
					node.removeEventListener (name, func, false);
				}
			}

			/**
			 * Given an event from a script node, get the requirejs info from it,
			 * and then removes the event listeners on the node.
			 * @param {Event} evt
			 * @returns {Object}
			 */
			function getScriptData (evt) {
				//Using currentTarget instead of target for Firefox 2.0's sake. Not
				//all old browsers will be supported, but this one was easy enough
				//to support and still makes sense.
				var node = evt.currentTarget || evt.srcElement;

				//Remove the listeners once here.
				removeListener (node, context.onScriptLoad, 'load', 'onreadystatechange');
				removeListener (node, context.onScriptError, 'error');

				return {
					node: node,
					id  : node && node.getAttribute ('data-requiremodule')
				};
			}

			function intakeDefines () {
				var args;

				//Any defined modules in the global queue, intake them now.
				takeGlobalQueue ();

				//Make sure any remaining defQueue items get properly processed.
				while ( defQueue.length ) {
					args = defQueue.shift ();
					if ( args[0] === null ) {
						return onError (makeError ('mismatch', 'Mismatched anonymous define() module: ' +
															   args[args.length - 1]));
					} else {
						//args are id, deps, factory. Should be normalized by the
						//define() function.
						callGetModule (args);
					}
				}
				context.defQueueMap = {};
			}

			context = {
				config       : config,
				contextName  : contextName,
				registry     : registry,
				defined      : defined,
				urlFetched   : urlFetched,
				defQueue     : defQueue,
				defQueueMap  : {},
				Module       : Module,
				makeModuleMap: makeModuleMap,
				nextTick     : req.nextTick,
				onError      : onError,

				/**
				 * Set a configuration for the context.
				 * @param {Object} cfg config object to integrate.
				 */
				configure: function (cfg) {
					//Make sure the baseUrl ends in a slash.
					if ( cfg.baseUrl ) {
						if ( cfg.baseUrl.charAt (cfg.baseUrl.length - 1) !== '/' ) {
							cfg.baseUrl += '/';
						}
					}

					//Save off the paths since they require special processing,
					//they are additive.
					var shim = config.shim,
						objs = {
							paths  : true,
							bundles: true,
							config : true,
							map    : true
						};

					eachProp (cfg, function (value, prop) {
						if ( objs[prop] ) {
							if ( !config[prop] ) {
								config[prop] = {};
							}
							mixin (config[prop], value, true, true);
						} else {
							config[prop] = value;
						}
					});

					//Reverse map the bundles
					if ( cfg.bundles ) {
						eachProp (cfg.bundles, function (value, prop) {
							each (value, function (v) {
								if ( v !== prop ) {
									bundlesMap[v] = prop;
								}
							});
						});
					}

					//Merge shim
					if ( cfg.shim ) {
						eachProp (cfg.shim, function (value, id) {
							//Normalize the structure
							if ( isArray (value) ) {
								value = {
									deps: value
								};
							}
							if ( (value.exports || value.init) && !value.exportsFn ) {
								value.exportsFn = context.makeShimExports (value);
							}
							shim[id] = value;
						});
						config.shim = shim;
					}

					//Adjust packages if necessary.
					if ( cfg.packages ) {
						each (cfg.packages, function (pkgObj) {
							var location, name;

							pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;

							name = pkgObj.name;
							location = pkgObj.location;
							if ( location ) {
								config.paths[name] = pkgObj.location;
							}

							//Save pointer to main module ID for pkg name.
							//Remove leading dot in main, so main paths are normalized,
							//and remove any trailing .js, since different package
							//envs have different conventions: some use a module name,
							//some use a file name.
							config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
									.replace (currDirRegExp, '')
									.replace (jsSuffixRegExp, '');
						});
					}

					//If there are any "waiting to execute" modules in the registry,
					//update the maps for them, since their info, like URLs to load,
					//may have changed.
					eachProp (registry, function (mod, id) {
						//If module already has init called, since it is too
						//late to modify them, and ignore unnormalized ones
						//since they are transient.
						if ( !mod.inited && !mod.map.unnormalized ) {
							mod.map = makeModuleMap (id, null, true);
						}
					});

					//If a deps array or a config callback is specified, then call
					//require with those args. This is useful when require is defined as a
					//config object before require.js is loaded.
					if ( cfg.deps || cfg.callback ) {
						context.require (cfg.deps || [], cfg.callback);
					}
				},

				makeShimExports: function (value) {
					function fn () {
						var ret;
						if ( value.init ) {
							ret = value.init.apply (global, arguments);
						}
						return ret || (value.exports && getGlobal (value.exports));
					}

					return fn;
				},

				makeRequire: function (relMap, options) {
					options = options || {};

					function localRequire (deps, callback, errback) {
						var id, map, requireMod;

						if ( options.enableBuildCallback && callback && isFunction (callback) ) {
							callback.__requireJsBuild = true;
						}

						if ( typeof deps === 'string' ) {
							if ( isFunction (callback) ) {
								//Invalid call
								return onError (makeError ('requireargs', 'Invalid require call'), errback);
							}

							//If require|exports|module are requested, get the
							//value for them from the special handlers. Caveat:
							//this only works while module is being defined.
							if ( relMap && hasProp (handlers, deps) ) {
								return handlers[deps] (registry[relMap.id]);
							}

							//Synchronous access to one module. If require.get is
							//available (as in the Node adapter), prefer that.
							if ( req.get ) {
								return req.get (context, deps, relMap, localRequire);
							}

							//Normalize module name, if it contains . or ..
							map = makeModuleMap (deps, relMap, false, true);
							id = map.id;

							if ( !hasProp (defined, id) ) {
								return onError (makeError ('notloaded', 'Module name "' +
																		id +
																		'" has not been loaded yet for context: ' +
																		contextName +
																		(relMap ? '' : '. Use require([])')));
							}
							return defined[id];
						}

						//Grab defines waiting in the global queue.
						intakeDefines ();

						//Mark all the dependencies as needing to be loaded.
						context.nextTick (function () {
							//Some defines could have been added since the
							//require call, collect them.
							intakeDefines ();

							requireMod = getModule (makeModuleMap (null, relMap));

							//Store if map config should be applied to this require
							//call for dependencies.
							requireMod.skipMap = options.skipMap;

							requireMod.init (deps, callback, errback, {
								enabled: true
							});

							checkLoaded ();
						});

						return localRequire;
					}

					mixin (localRequire, {
						isBrowser: isBrowser,

						/**
						 * Converts a module name + .extension into an URL path.
						 * *Requires* the use of a module name. It does not support using
						 * plain URLs like nameToUrl.
						 */
						toUrl: function (moduleNamePlusExt) {
							var ext,
								index = moduleNamePlusExt.lastIndexOf ('.'),
								segment = moduleNamePlusExt.split ('/')[0],
								isRelative = segment === '.' || segment === '..';

							//Have a file extension alias, and it is not the
							//dots from a relative path.
							if ( index !== -1 && (!isRelative || index > 1) ) {
								ext = moduleNamePlusExt.substring (index, moduleNamePlusExt.length);
								moduleNamePlusExt = moduleNamePlusExt.substring (0, index);
							}

							return context.nameToUrl (normalize (moduleNamePlusExt,
																 relMap && relMap.id, true), ext, true);
						},

						defined: function (id) {
							return hasProp (defined, makeModuleMap (id, relMap, false, true).id);
						},

						specified: function (id) {
							id = makeModuleMap (id, relMap, false, true).id;
							return hasProp (defined, id) || hasProp (registry, id);
						}
					});

					//Only allow undef on top level require calls
					if ( !relMap ) {
						localRequire.undef = function (id) {
							//Bind any waiting define() calls to this context,
							//fix for #408
							takeGlobalQueue ();

							var map = makeModuleMap (id, relMap, true),
								mod = getOwn (registry, id);

							mod.undefed = true;
							removeScript (id);

							delete defined[id];
							delete urlFetched[map.url];
							delete undefEvents[id];

							//Clean queued defines too. Go backwards
							//in array so that the splices do not
							//mess up the iteration.
							eachReverse (defQueue, function (args, i) {
								if ( args[0] === id ) {
									defQueue.splice (i, 1);
								}
							});
							delete context.defQueueMap[id];

							if ( mod ) {
								//Hold on to listeners in case the
								//module will be attempted to be reloaded
								//using a different config.
								if ( mod.events.defined ) {
									undefEvents[id] = mod.events;
								}

								cleanRegistry (id);
							}
						};
					}

					return localRequire;
				},

				/**
				 * Called to enable a module if it is still in the registry
				 * awaiting enablement. A second arg, parent, the parent module,
				 * is passed in for context, when this method is overridden by
				 * the optimizer. Not shown here to keep code compact.
				 */
				enable: function (depMap) {
					var mod = getOwn (registry, depMap.id);
					if ( mod ) {
						getModule (depMap).enable ();
					}
				},

				/**
				 * Internal method used by environment adapters to complete a load event.
				 * A load event could be a script load or just a load pass from a synchronous
				 * load call.
				 * @param {String} moduleName the name of the module to potentially complete.
				 */
				completeLoad: function (moduleName) {
					var found, args, mod,
						shim = getOwn (config.shim, moduleName) || {},
						shExports = shim.exports;

					takeGlobalQueue ();

					while ( defQueue.length ) {
						args = defQueue.shift ();
						if ( args[0] === null ) {
							args[0] = moduleName;
							//If already found an anonymous module and bound it
							//to this name, then this is some other anon module
							//waiting for its completeLoad to fire.
							if ( found ) {
								break;
							}
							found = true;
						} else if ( args[0] === moduleName ) {
							//Found matching define call for this script!
							found = true;
						}

						callGetModule (args);
					}
					context.defQueueMap = {};

					//Do this after the cycle of callGetModule in case the result
					//of those calls/init calls changes the registry.
					mod = getOwn (registry, moduleName);

					if ( !found && !hasProp (defined, moduleName) && mod && !mod.inited ) {
						if ( config.enforceDefine && (!shExports || !getGlobal (shExports)) ) {
							if ( hasPathFallback (moduleName) ) {
								return;
							} else {
								return onError (makeError ('nodefine',
														   'No define call for ' + moduleName,
														   null,
														   [moduleName]));
							}
						} else {
							//A script that does not call define(), so just simulate
							//the call for it.
							callGetModule ([moduleName, (shim.deps || []), shim.exportsFn]);
						}
					}

					checkLoaded ();
				},

				/**
				 * Converts a module name to a file path. Supports cases where
				 * moduleName may actually be just an URL.
				 * Note that it **does not** call normalize on the moduleName,
				 * it is assumed to have already been normalized. This is an
				 * internal API, not a public one. Use toUrl for the public API.
				 */
				nameToUrl: function (moduleName, ext, skipExt) {
					var paths, syms, i, parentModule, url,
						parentPath, bundleId,
						pkgMain = getOwn (config.pkgs, moduleName);

					if ( pkgMain ) {
						moduleName = pkgMain;
					}

					bundleId = getOwn (bundlesMap, moduleName);

					if ( bundleId ) {
						return context.nameToUrl (bundleId, ext, skipExt);
					}

					//If a colon is in the URL, it indicates a protocol is used and it is just
					//an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
					//or ends with .js, then assume the user meant to use an url and not a module id.
					//The slash is important for protocol-less URLs as well as full paths.
					if ( req.jsExtRegExp.test (moduleName) ) {
						//Just a plain path, not module name lookup, so just return it.
						//Add extension if it is included. This is a bit wonky, only non-.js things pass
						//an extension, this method probably needs to be reworked.
						url = moduleName + (ext || '');
					} else {
						//A module that needs to be converted to a path.
						paths = config.paths;

						syms = moduleName.split ('/');
						//For each module name segment, see if there is a path
						//registered for it. Start with most specific name
						//and work up from it.
						for ( i = syms.length; i > 0; i -= 1 ) {
							parentModule = syms.slice (0, i).join ('/');

							parentPath = getOwn (paths, parentModule);
							if ( parentPath ) {
								//If an array, it means there are a few choices,
								//Choose the one that is desired
								if ( isArray (parentPath) ) {
									parentPath = parentPath[0];
								}
								syms.splice (0, i, parentPath);
								break;
							}
						}

						//Join the path parts together, then figure out if baseUrl is needed.
						url = syms.join ('/');
						url += (ext || (/^data\:|\?/.test (url) || skipExt ? '' : '.js'));
						url = (url.charAt (0) === '/' || url.match (/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
					}

					return config.urlArgs ? url +
											((url.indexOf ('?') === -1 ? '?' : '&') +
											config.urlArgs) : url;
				},

				//Delegates to req.load. Broken out as a separate function to
				//allow overriding in the optimizer.
				load: function (id, url) {
					req.load (context, id, url);
				},

				/**
				 * Executes a module callback function. Broken out as a separate function
				 * solely to allow the build system to sequence the files in the built
				 * layer in the right sequence.
				 *
				 * @private
				 */
				execCb: function (name, callback, args, exports) {
					return callback.apply (exports, args);
				},

				/**
				 * callback for script loads, used to check status of loading.
				 *
				 * @param {Event} evt the event from the browser for the script
				 * that was loaded.
				 */
				onScriptLoad: function (evt) {
					//Using currentTarget instead of target for Firefox 2.0's sake. Not
					//all old browsers will be supported, but this one was easy enough
					//to support and still makes sense.
					if ( evt.type === 'load' ||
						 (readyRegExp.test ((evt.currentTarget || evt.srcElement).readyState)) ) {
						//Reset interactive script so a script node is not held onto for
						//to long.
						interactiveScript = null;

						//Pull out the name of the module and the context.
						var data = getScriptData (evt);
						context.completeLoad (data.id);
					}
				},

				/**
				 * Callback for script errors.
				 */
				onScriptError: function (evt) {
					var data = getScriptData (evt);
					if ( !hasPathFallback (data.id) ) {
						return onError (makeError ('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
					}
				}
			};

			context.require = context.makeRequire ();
			return context;
		}

		/**
		 * Main entry point.
		 *
		 * If the only argument to require is a string, then the module that
		 * is represented by that string is fetched for the appropriate context.
		 *
		 * If the first argument is an array, then it will be treated as an array
		 * of dependency string names to fetch. An optional function callback can
		 * be specified to execute when all of those dependencies are available.
		 *
		 * Make a local req variable to help Caja compliance (it assumes things
		 * on a require that are not standardized), and to give a short
		 * name for minification/local scope use.
		 */
		req = requirejs = function (deps, callback, errback, optional) {

			//Find the right context, use default
			var context, config,
				contextName = defContextName;

			// Determine if have config object in the call.
			if ( !isArray (deps) && typeof deps !== 'string' ) {
				// deps is a config object
				config = deps;
				if ( isArray (callback) ) {
					// Adjust args if there are dependencies
					deps = callback;
					callback = errback;
					errback = optional;
				} else {
					deps = [];
				}
			}

			if ( config && config.context ) {
				contextName = config.context;
			}

			context = getOwn (contexts, contextName);
			if ( !context ) {
				context = contexts[contextName] = req.s.newContext (contextName);
			}

			if ( config ) {
				context.configure (config);
			}

			return context.require (deps, callback, errback);
		};

		/**
		 * Support require.config() to make it easier to cooperate with other
		 * AMD loaders on globally agreed names.
		 */
		req.config = function (config) {
			return req (config);
		};

		/**
		 * Execute something after the current tick
		 * of the event loop. Override for other envs
		 * that have a better solution than setTimeout.
		 * @param  {Function} fn function to execute later.
		 */
		req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
			setTimeout (fn, 4);
		} : function (fn) { fn (); };

		/**
		 * Export require as a global, but only if it does not already exist.
		 */
		if ( !require ) {
			require = req;
		}

		req.version = version;

		//Used to filter out dependencies that are already paths.
		req.jsExtRegExp = /^\/|:|\?|\.js$/;
		req.isBrowser = isBrowser;
		s = req.s = {
			contexts  : contexts,
			newContext: newContext
		};

		//Create default context.
		req ({});

		//Exports some context-sensitive methods on global require.
		each ([
			'toUrl',
			'undef',
			'defined',
			'specified'
		], function (prop) {
			//Reference from contexts instead of early binding to default context,
			//so that during builds, the latest instance of the default context
			//with its config gets used.
			req[prop] = function () {
				var ctx = contexts[defContextName];
				return ctx.require[prop].apply (ctx, arguments);
			};
		});

		if ( isBrowser ) {
			head = s.head = document.getElementsByTagName ('head')[0];
			//If BASE tag is in play, using appendChild is a problem for IE6.
			//When that browser dies, this can be removed. Details in this jQuery bug:
			//http://dev.jquery.com/ticket/2709
			baseElement = document.getElementsByTagName ('base')[0];
			if ( baseElement ) {
				head = s.head = baseElement.parentNode;
			}
		}

		/**
		 * Any errors that require explicitly generates will be passed to this
		 * function. Intercept/override it if you want custom error handling.
		 * @param {Error} err the error object.
		 */
		req.onError = defaultOnError;

		/**
		 * Creates the node for the load command. Only used in browser envs.
		 */
		req.createNode = function (config, moduleName, url) {
			var node = config.xhtml ?
				document.createElementNS ('http://www.w3.org/1999/xhtml', 'html:script') :
				document.createElement ('script');
			node.type = config.scriptType || 'text/javascript';
			node.charset = 'utf-8';
			node.async = true;
			return node;
		};

		/**
		 * Does the request to load a module for the browser case.
		 * Make this a separate function to allow other environments
		 * to override it.
		 *
		 * @param {Object} context the require context to find state.
		 * @param {String} moduleName the name of the module.
		 * @param {Object} url the URL to the module.
		 */
		req.load = function (context, moduleName, url) {
			var config = (context && context.config) || {},
				node;
			if ( isBrowser ) {
				//In the browser so use a script tag
				node = req.createNode (config, moduleName, url);
				if ( config.onNodeCreated ) {
					config.onNodeCreated (node, config, moduleName, url);
				}

				node.setAttribute ('data-requirecontext', context.contextName);
				node.setAttribute ('data-requiremodule', moduleName);

				//Set up load listener. Test attachEvent first because IE9 has
				//a subtle issue in its addEventListener and script onload firings
				//that do not match the behavior of all other browsers with
				//addEventListener support, which fire the onload event for a
				//script right after the script execution. See:
				//https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
				// UNFORTUNATELY Opera implements attachEvent but does not follow the script script execution mode.
				if ( node.attachEvent &&
					 //Check if node.attachEvent is artificially added by custom script or
					 //natively supported by browser
					 //read https://github.com/jrburke/requirejs/issues/187
					 //if we can NOT find [native code] then it must NOT natively supported.
					 //in IE8, node.attachEvent does not have toString()
					 //Note the test for "[native code" with no closing brace, see:
					 //https://github.com/jrburke/requirejs/issues/273
					 !(node.attachEvent.toString && node.attachEvent.toString ().indexOf ('[native code') < 0) && !isOpera ) {
					//Probably IE. IE (at least 6-8) do not fire
					//script onload right after executing the script, so
					//we cannot tie the anonymous define call to a name.
					//However, IE reports the script as being in 'interactive'
					//readyState at the time of the define call.
					useInteractive = true;

					node.attachEvent ('onreadystatechange', context.onScriptLoad);
					//It would be great to add an error handler here to catch
					//404s in IE9+. However, onreadystatechange will fire before
					//the error handler, so that does not help. If addEventListener
					//is used, then IE will fire error before load, but we cannot
					//use that pathway given the connect.microsoft.com issue
					//mentioned above about not doing the 'script execute,
					//then fire the script load event listener before execute
					//next script' that other browsers do.
					//Best hope: IE10 fixes the issues,
					//and then destroys all installs of IE 6-9.
					//node.attachEvent('onerror', context.onScriptError);
				} else {
					node.addEventListener ('load', context.onScriptLoad, false);
					node.addEventListener ('error', context.onScriptError, false);
				}
				node.src = url;

				//For some cache cases in IE 6-8, the script executes before the end
				//of the appendChild execution, so to tie an anonymous define
				//call to the module name (which is stored on the node), hold on
				//to a reference to this node, but clear after the DOM insertion.
				currentlyAddingScript = node;
				if ( baseElement ) {
					head.insertBefore (node, baseElement);
				} else {
					head.appendChild (node);
				}
				currentlyAddingScript = null;

				return node;
			} else if ( isWebWorker ) {
				try {
					//In a web worker, use importScripts. This is not a very
					//efficient use of importScripts, importScripts will block until
					//its script is downloaded and evaluated. However, if web workers
					//are in play, the expectation that a build has been done so that
					//only one script needs to be loaded anyway. This may need to be
					//reevaluated if other use cases become common.
					importScripts (url);

					//Account for anonymous modules
					context.completeLoad (moduleName);
				} catch ( e ) {
					context.onError (makeError ('importscripts',
												'importScripts failed for ' +
												moduleName + ' at ' + url,
												e,
												[moduleName]));
				}
			}
		};

		function getInteractiveScript () {
			if ( interactiveScript && interactiveScript.readyState === 'interactive' ) {
				return interactiveScript;
			}

			eachReverse (scripts (), function (script) {
				if ( script.readyState === 'interactive' ) {
					return (interactiveScript = script);
				}
			});
			return interactiveScript;
		}

		//Look for a data-main script attribute, which could also adjust the baseUrl.
		if ( isBrowser && !cfg.skipDataMain ) {
			//Figure out baseUrl. Get it from the script tag with require.js in it.
			eachReverse (scripts (), function (script) {
				//Set the 'head' where we can append children by
				//using the script's parent.
				if ( !head ) {
					head = script.parentNode;
				}

				//Look for a data-main attribute to set main script for the page
				//to load. If it is there, the path to data main becomes the
				//baseUrl, if it is not already set.
				dataMain = script.getAttribute ('data-main');
				if ( dataMain ) {
					//Preserve dataMain in case it is a path (i.e. contains '?')
					mainScript = dataMain;

					//Set final baseUrl if there is not already an explicit one.
					if ( !cfg.baseUrl ) {
						//Pull off the directory of data-main for use as the
						//baseUrl.
						src = mainScript.split ('/');
						mainScript = src.pop ();
						subPath = src.length ? src.join ('/') + '/' : './';

						cfg.baseUrl = subPath;
					}

					//Strip off any trailing .js since mainScript is now
					//like a module name.
					mainScript = mainScript.replace (jsSuffixRegExp, '');

					//If mainScript is still a path, fall back to dataMain
					if ( req.jsExtRegExp.test (mainScript) ) {
						mainScript = dataMain;
					}

					//Put the data-main script in the files to load.
					cfg.deps = cfg.deps ? cfg.deps.concat (mainScript) : [mainScript];

					return true;
				}
			});
		}

		/**
		 * The function that handles definitions of modules. Differs from
		 * require() in that a string for the module should be the first argument,
		 * and the function to execute after dependencies are loaded should
		 * return a value to define the module corresponding to the first argument's
		 * name.
		 */
		define = function (name, deps, callback) {
			var node, context;

			//Allow for anonymous modules
			if ( typeof name !== 'string' ) {
				//Adjust args appropriately
				callback = deps;
				deps = name;
				name = null;
			}

			//This module may not have dependencies
			if ( !isArray (deps) ) {
				callback = deps;
				deps = null;
			}

			//If no name, and callback is a function, then figure out if it a
			//CommonJS thing with dependencies.
			if ( !deps && isFunction (callback) ) {
				deps = [];
				//Remove comments from the callback string,
				//look for require calls, and pull them into the dependencies,
				//but only if there are function args.
				if ( callback.length ) {
					callback
						.toString ()
						.replace (commentRegExp, '')
						.replace (cjsRequireRegExp, function (match, dep) {
						deps.push (dep);
					});

					//May be a CommonJS thing even without require calls, but still
					//could use exports, and module. Avoid doing exports and module
					//work though if it just needs require.
					//REQUIRES the function to expect the CommonJS variables in the
					//order listed below.
					deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat (deps);
				}
			}

			//If in IE 6-8 and hit an anonymous define() call, do the interactive
			//work.
			if ( useInteractive ) {
				node = currentlyAddingScript || getInteractiveScript ();
				if ( node ) {
					if ( !name ) {
						name = node.getAttribute ('data-requiremodule');
					}
					context = contexts[node.getAttribute ('data-requirecontext')];
				}
			}

			//Always save off evaluating the def call until the script onload handler.
			//This allows multiple modules to be in a file without prematurely
			//tracing dependencies, and allows for anonymous module support,
			//where the module name is not known until the script onload event
			//occurs. If no context, use the global queue, and get it processed
			//in the onscript load callback.
			if ( context ) {
				context.defQueue.push ([name, deps, callback]);
				context.defQueueMap[name] = true;
			} else {
				globalDefQueue.push ([name, deps, callback]);
			}
		};

		define.amd = {
			jQuery: true
		};

		/**
		 * Executes the text. Normally just uses eval, but can be modified
		 * to use a better, environment-specific call. Only used for transpiling
		 * loader plugins, not for plain JS modules.
		 * @param {String} text the text to execute/evaluate.
		 */
		req.exec = function (text) {
			/*jslint evil: true */
			return eval (text);
		};

		//Set up with config info.
		req (cfg);
	} (window));

	this.require = require;
	this.define = define;

}

Required.add ('setConf', function (conf) {
	"use strict";
	this.require.config (_.extend ({
		baseUrl: setting.app_path,
		paths  : {
			system: setting.system_path
		}

	}, conf || {}, true));
});

Required.add ('getRequire', function () {
	"use strict";
	return this.require;
});

Required.add ('getDefine', function () {
	"use strict";
	return this.define;
});

Required.add ('lookup', function (dependencies) {
	"use strict";
	var _self = this;
	return (new Promise (function (resolve, reject) {
		_self.require (dependencies, function () {
			resolve ();
		});
	}));
});

//The global object Require
window.Require = new Required;
Require.setConf ();


/**
 * Created by gmena on 08-06-14.
 */

"use strict";

function Libs () {
	this.breadcrumb = {};
	this.object = {};
	this.name = null;
}

/** Blend a method in global Syrup object
 * @param name
 * @param dependencies []
 * @return object
 * **/
Libs.add ('blend', function (name, dependencies) {
	var _split = _.splitString (name, '.');
	if ( _.isArray (_split) ) {
		name = _split[0];
	}

	var _anonymous = (
		Function.factory (name)
	) ();


	if ( !(name in this.breadcrumb) ) {
		_.Syrup.blend (_anonymous);
		this.name = name;
		this.object = _[name];
		this.breadcrumb[name] = this.object;
		this._dependencies (dependencies);
	}

	return this;

});

/** Return a method saved in breadcrumb
 * @param name
 * @return object
 * **/
Libs.add ('get', function (name) {
	return (name in this.breadcrumb) && this.breadcrumb[name];
});

/**Dependencies gestor
 * @param dependencies []
 * @return void
 * */
Libs.add ('_dependencies', function (dependencies) {
	var _self = this;
	if ( _.isArray (dependencies) && _.isSet (_self.object) ) {
		_.each (dependencies, function (v) {
			_self.object.__proto__[v] = !(v in _self.object)
				? ( _[v] || new window[v]) : _self.object[v];
		})
	}
});

/**Attributes provider
 * @param attributes object
 * @return object
 * */
Libs.add ('make', function (attributes) {
	var _self = this;
	_.each (attributes, function (v, i) {
		_self.object[i] = v;
	});

	return this;
});

/** Methods provider
 * @param supplier
 * @return object
 * **/
Libs.add ('supply', function (supplier) {
	var _self = this,
		_k = _.getObjectKeys (supplier),
		_i = _k.length;

	while ( _i-- ) {
		if ( _.isFunction (supplier[_k[_i]]) )
			_self.cook (_k[_i], supplier[_k[_i]]);
	}

	return this;
});


/**Append methods
 * @param name
 * @param callback
 * @return object
 * */
Libs.add ('cook', function (name, callback) {
	this.object.__proto__[name] = callback;
	return this;
});

//The global object Lib
window.Lib = new Libs;

/**
 * Created by gmena on 07-31-14.
 */
"use strict";

function Apps () {
	this.root = null;
	this.lib = null;
	this.app = null;
	this.triggerAfter = {};
	this.triggerBefore = {};
	this.scope = {};
	this.modules = {};
	this.onchange = {};
	this.ondrop = {};
}

/** Blend a method in global Syrup object
 * @param name
 * @param dependencies []
 * @return object
 * **/
Apps.add ('blend', function (name, dependencies) {
	var _self = new Apps;
	_self.lib = new Libs;
	_self.root = name;
	_self.scope = {};
	_self.app = _$ ('[sp-app="' + name + '"]');
	_self.lib.blend (name, dependencies);

	return _self;
});

/** Make a recipe for blend
 *  @param moduleId string
 *  @param module function
 *  @return object
 * */
Apps.add ('recipe', function (moduleId, module) {
	if ( _.isSet (this.root) ) {
		if ( _.isSet (module) ) {
			this.temp = moduleId;
			this.modules[moduleId] = {
				creator : module,
				instance: null
			};
			this._taste (moduleId);
		}
	}
	return this;
});

/**Object Observer
 * @param moduleId
 * **/
Apps.add ('_watch', function (moduleId) {
	var _self = this;
	Object.observe (_self.scope, function (change) {
		_.each (change, function (v) {
			if ( (v.name in _self.onchange)
				 && _.getObjectSize (v.object) > 0
				 && moduleId === v.name
			) {
				_self.onchange[v.name] ({
					name  : v.name,
					old   : v.oldValue,
					type  : v.type,
					object: v.object[v.name]
				});

			}
		});
	});

});

/**Add new child module
 * @param moduleId
 * @return void
 * **/
Apps.add ('_add', function (moduleId) {
	if ( !_.isObject (this.scope[moduleId]) )
		this.scope[moduleId] = {};
});

/**Trigger code execution
 * @param moduleId
 * @return void
 * **/
Apps.add ('_trigger', function (moduleId) {
	if ( moduleId in this.modules )
		return this.modules[moduleId].creator (_, _$, this.scope);
	return {}
});

/**Trigger Helper
 * @param moduleList
 * @param callback
 * @param toList**/
Apps.add ('_triggerOn', function (moduleList, callback, toList) {
	if ( _.isArray (moduleList) ) {
		_.each (moduleList, function (moduleId) {
			if ( !(moduleId in toList) )
				toList[moduleId] = callback;
		});

	}
	return this;
});


/**Add a custom trigger to execute before the given modules
 * @param moduleList
 * @callback*/
Apps.add ('beforeServe', function (moduleList, callback) {
	return this._triggerOn (moduleList, callback, this.triggerBefore);
});


/**Add a custom trigger to execute after the given modules
 * @param moduleList
 * @callback*/
Apps.add ('afterServe', function (moduleList, callback) {
	return this._triggerOn (moduleList, callback, this.triggerAfter);
});

/** Append global service
 * @param name
 * @param callback function
 * @return void
 *
 * */
Apps.add ('service', function (name, callback) {
	this.lib.cook (name, callback);
	return this;
});

/** Append global services
 * @param object
 * @return void
 *
 * */
Apps.add ('services', function (object) {
	this.lib.supply (object);
	return this;
});


/**Return a recipe by param given
 * @param moduleId
 * @return object
 * */
Apps.add ('getRecipe', function (moduleId) {
	if ( moduleId in this.modules && _.isSet (this.root) )
		return this.modules[moduleId].instance;
	return null;
});

/**Set Scope
 * @param moduleId
 * @param object
 * @return void
 * **/
Apps.add ('setScope', function (moduleId, object) {
	if ( moduleId in this.scope ) {
		this.scope[moduleId] = object;
	}
	return this;
});

/**Get Scope
 * @param moduleId
 * @return object
 * **/
Apps.add ('getScope', function (moduleId) {
	if ( moduleId in this.scope ) {
		return this.scope[moduleId];
	}
	return {};
});

/**Event handler
 * @param event
 * @param name
 * @param callback
 * @return object
 */
Apps.add ('when', function (event, name, callback) {
	var self = this;
	return [
		{
			change: function () {
				self.onchange[name] = callback;
			},
			drop  : function () {
				self.ondrop[name] = callback;
			}
		}[event] ()
	]
});

/**Bind Listeners
 * @param moduleId
 * */
Apps.add ('_bindListener', function (moduleId) {
	var enabled_events = [
		'[sp-click], ', 'submit], ',
		'change], ', 'dblclick], ',
		'mousedown], ', 'mouseenter], ',
		'mouseleave], ', 'mousemove], ',
		'mouseover], ', 'mouseout], ', 'mouseup], ',
		'keydown], ', 'keypress], ', 'keyup], ', 'blur], ',
		'focus], ', 'input], ', 'select], ', 'reset]'
	];

	if ( this.app.exist ) {
		var _this = this,
			_self = this.modules[moduleId].instance,
			_the_filter = enabled_events.join (' [sp-'),
			_mod = _$ ('[sp-recipe="' + moduleId + '"]');

		//Find events listeners
		_mod.find (_the_filter, function (dom_list) {

			//The dom object
			dom_list.each (function (i) {

				//Fint the listener in attributes
				_.each (i.attributes, function (v) {
					if ( /sp-[a-z]+/.test (v.localName) ) {
						var _event = _.replace (v.localName, 'sp-', _.emptyStr),
							_attr = i.getAttribute (v.localName);

						//Is the attr value in module?
						if ( _attr in _self ) {
							//is Function the attr value?
							if ( _.isFunction (_self[_attr]) ) {
								_mod.listen (_event, '[' + v.localName + '="' + _attr + '"]', function (e) {
									//Param event and dependencies
									_self[_attr] (e, _this.lib.get (_self.parent));
								});
							}
						}
					}
				});
			})
		});
	}
});

/** Render the View
 * @param moduleId
 * @param template
 * @return object
 */
Apps.add ('_serve', function (moduleId, template) {
	var _view = null,
		_scope = this.scope[moduleId];

	//Is set the app
	if ( this.app.exist ) {
		//Find the recipe
		var _dom = _$ ('[sp-recipe="' + moduleId + '"] [sp-view]'),
			_dom_template = _$ ('[sp-recipe="' + moduleId + '"] [sp-tpl]');

		if ( _dom.exist ) { //Exist?
			if ( _.getObjectSize (_scope) > 0 ) {

				//The view object
				_view = new View;

				//A view?
				if ( _.isSet (template) && _.isString (template) ) {
					var view_name = template.split ('/').pop (),
						view_dir = _.replace (template, '/' + view_name, _.emptyStr);

					//Require th view if needed
					Require.lookup (['view/' + view_dir]).then (function () {
						if ( view_name in _view.__proto__ )
							_view[view_name] (_scope, function (my_html) {
								_dom.html (my_html);
							})
					})
				} else if ( _dom_template.exist ) {
					//Exist inline tpl?
					var _parse = _dom_template.html ();
					if ( _.isSet (_parse) ) {
						_view.render (_parse, _scope).then (function (result) {
							_dom.html (result);
						});
					}
				}
			}
		}
	}

	return this;
});

/** Execute Module
 *@param moduleId
 * @return object
 */

Apps.add ('_taste', function (moduleId) {
	var _self = this;

	if ( moduleId in _self.modules && _.isSet (_self.root) ) {

		//Initialize module
		_self._add (moduleId);
		_self.modules[moduleId].instance = _self._trigger (moduleId);
		_self.modules[moduleId].instance.name = moduleId;
		_self.modules[moduleId].instance.parent = _self.root;
		//_self.modules[moduleId].instance.dom = _$ ('[sp-recipe="' + moduleId + '"]');

		//Binding Methods
		_self.modules[moduleId].instance.setScope = function (object) {
			if ( _.isObject (object) ) {
				_self.setScope (moduleId, object);
				return this;
			}
		};

		_self.modules[moduleId].instance.getScope = function () {
			return _self.getScope (moduleId);
		};

		_self.modules[moduleId].instance.when = function (event, callback) {
			_self.when (event, moduleId, callback);
			return this;
		};

		_self.modules[moduleId].instance.getRecipe = function () {
			return _self.getRecipe (moduleId);
		};

		_self.modules[moduleId].instance.serve = function (_template) {
			_self._serve (moduleId, _template || null);
			return this;
		};

		_self.modules[moduleId].instance.listen = function (event, callback) {
			_$ ('[sp-recipe="' + moduleId + '"]').listen (event, '[sp-' + event + ']', callback);
			return this;
		};


		//Init the module
		if ( 'init' in _self.modules[moduleId].instance ) {

			//Before execute
			if ( moduleId in this.triggerBefore )
				_self.triggerBefore[moduleId] (moduleId, this.lib.get (_self.root));

			_self.modules[moduleId].instance.init (this.lib.get (_self.root));
			_self._bindListener (moduleId);

			//After execute
			if ( moduleId in _self.triggerAfter )
				_self.triggerAfter[moduleId] (moduleId, this.lib.get (_self.root));
		}

		//Observe scope
		_self._watch (moduleId);
	}

	return this;
});


/**Drop a Module
 * @param moduleId
 * @return object
 * */
Apps.add ('drop', function (moduleId) {
	if ( moduleId in this.modules ) {
		if ( this.modules[moduleId].instance ) {
			if ( 'destroy' in this.modules[moduleId].instance )
				this.modules[moduleId].instance.destroy (this.lib.get (this.root));

			if ( this.ondrop[moduleId] )
				this.ondrop[moduleId] (moduleId);

			this.modules[moduleId] = null;
		}
	}
	return this;
});


/**Drop all Modules
 * @return object
 * */
Apps.add ('dropAll', function () {
	var _self = this;
	_.each (this.modules, function (module, id) {
		_self.drop (id);
	});
	return this;
});

//The global object App
window.App = new Apps;

/**
 * Created by gmena on 07-26-14.
 */

'use strict';

/**Http
 * @constructor
 */


function Http () {
	this.xhr = new window.XMLHttpRequest
			   || new window.ActiveXObject ("Microsoft.XMLHTTP");
	this.xhr_list = [];
	this.upload = null;
	this.before = null;
	this.complete = null;
	this.progress = null;
	this.state = null;
	this.abort = null;
	this.error = null;
	this.time_out = null;
}

/*** Event handler
 * @param event
 * @param callback
 * @return void
 * */
Http.add ('on', function (event, callback) {
	var self = this;
	return [
		{
			before  : function () {
				self.before = callback;
			},
			complete: function () {
				self.complete = callback;
			},
			abort   : function () {
				self.abort = callback;
			},
			state   : function () {
				self.state = callback;
			},
			timeout : function () {
				self.time_out = callback;
			},
			progress: function () {
				self.progress = callback;
			}
		}[event] ()
	]

});

/** Http Request
 * @param config
 * @param callback
 * @return object
 *
 * Config object {
 *  url: (string) the request url
 *  type: (string) the request type GET or POST
 *	async: bool,
 *	timeout: (int) request timeout,
 *	processor: (string) ajax server side processor file extension,
 *	token: (string or bool) CSRF token needed?,
 *	contentType: (string) the content type,
 *	data: (object) the request data,
 *	upload: (bool) is upload process?
 *
 * }
 * **/
Http.add ('request', function (config) {
	if ( !_.isObject (config) ) {
		throw (_.WARNING_SYRUP.ERROR.NOOBJECT)
	}

	var _self = this,
		_xhr = _self.xhr,
		_async = config.async || true,
		_type = (config.method || 'GET').toUpperCase (),
		_timeout = config.timeout || 0xFA0,
		_cors = config.cors || false,
		_processor = config.processor || setting.processor,
		_token = config.token || null,
		_contentType = config.contentType || 'application/x-www-form-urlencoded;charset=utf-8',
		_data = config.data || null,
		_contentHeader = {
			header: 'Content-Type',
			value : _contentType
		};


	return (new Promise (function (resolve, reject) {

		if ( !_.isSet (config.url) )
			reject (_.WARNING_SYRUP.ERROR.NOURL);

		if ( !_.isFormData (_data)
			 && _.isSet (_data)
			 && _contentType !== 'auto'
		) {
			_data = _.jsonToQueryString (_data);
		}

		if ( _type === 'GET' && _.isSet (_data) ) {
			_processor += '?' + _data;
		}

		//Process url
		_processor = config.url + (_processor || '');
		_xhr.open (_type, _processor, _async);
		_xhr.timeout = _timeout;

		//Setting Headers
		if ( !_.isFormData (_data) && _contentType !== 'auto' ) {
			_self.requestHeader (
				_contentHeader.header,
				_contentHeader.value
			);
		}

		//Cors?
		if ( _.isSet (_cors) )
			_xhr.withCredentials = true;

		//Using Token
		if ( _.isSet (_token) )
			_self.requestHeader ("X-CSRFToken", _token);

		//If upload needed
		if ( _.isSet (config.upload) && _.isBoolean (config.upload) ) {
			_self.upload = _self.xhr.upload;
			_xhr = _self.upload;
		}

		//Event Listeners
		_xhr.addEventListener ('load', function (e) {
			if ( this.status >= 0xC8 && this.status < 0x190 ) {
				var _response = this.response || this.responseText;
				if ( _.isJson (_response) ) {
					_response = JSON.parse (_response);
				}
				resolve (_response);
			}
		});

		_xhr.addEventListener ('progress', function (e) {
			if ( _self.progress ) {
				_self.progress (e);
			}
		}, false);

		_xhr.addEventListener ('readystatechange', function (e) {
			if ( this.readyState ) {
				if ( !!_self.state ) {
					_self.state (this.readyState, e);
				}
			}
		});

		_xhr.addEventListener ('abort', function (e) {
			if ( !!_self.abort ) {
				_self.abort (e);
			}
		});

		_xhr.addEventListener ('timeout', function (e) {
			if ( !!_self.time_out ) {
				_self.time_out (e);
			}
		});

		_xhr.addEventListener ('loadend', function (e) {
			if ( !!_self.complete ) {
				_self.complete (e);
			}
		});

		_xhr.addEventListener ('loadstart', function (e) {
			if ( !!_self.before ) {
				_self.before (e);
			}
		});

		_xhr.addEventListener ('error', function (e) {
			reject (e);
		});


		//Send
		_self.xhr_list.push (_self.xhr);
		_xhr.send (_type !== 'GET' ? _data : null);
	}));

});


/**Get request
 * @param url
 * @param data
 * @param callback
 * */
Http.add ('get', function (url, data) {
	var _conf = {
		url : url || location.href,
		data: data || {}
	};

	this.kill ();
	return this.request (_conf);
});


/**Post request
 * @param url
 * @param data
 * @param callback
 * */
Http.add ('post', function (url, data) {
	var _conf = {
		method: 'POST',
		url   : url || location.href,
		data  : data || {}
	};

	this.kill ();
	return this.request (_conf);
});


/**Put request
 * @param url
 * @param data
 * @param callback
 * */
Http.add ('put', function (url, data) {
	var _conf = {
		method: 'PUT',
		url   : url || location.href,
		data  : data || {}
	};

	this.kill ();
	return this.request (_conf);
});


/**Delete request
 * @param url
 * @param data
 * @param callback
 * */
Http.add ('delete', function (url, data) {
	var _conf = {
		method: 'DELETE',
		url   : url || location.href,
		data  : data || {}
	};

	this.kill ();
	return this.request (_conf);
});



/** Set Request Header
 * @param header
 * @param type
 * @return object
 * **/
Http.add ('requestHeader', function (header, type) {
	this.xhr.setRequestHeader (header, type);
	return this;
});

//Kill Http
Http.add ('kill', function () {
	_.each (this.xhr_list, function (xhr) {
		xhr.abort ();
	});

	this.xhr_list.length = 0;
	return this;
});



/**
 * Created by gmena on 07-26-14.
 */

'use strict';
/**Router
 * @constructor
 */
function Router () {
	this.routes = {}
}


/**Set the routes
 * @param routes
 * @return object
 * */
Router.add ('setRoutes', function (routes) {
	var _self = this;
	return (new Promise (function (resolve, reject) {
		_self.routes = _.extend (_self.routes, routes);
		resolve (_self.routes);
	}))
});

/**Delega rutas
 * @param path
 * @param callback
 * @returns {boolean}
 */
Router.add ('when', function (route_name) {
	_.assert (route_name, _.WARNING_SYRUP.ERROR.NOPARAM);
	var _self = this;
	return (new Promise (function (resolve, reject) {

		//Not routing
		if ( !(route_name in _self.routes) )
			reject (route_name);

		var _the_regexp = _self.routes[route_name],
			_to_route = window.location.pathname,
			_result = _to_route.match ((new RegExp (_the_regexp, 'g')));

		//Improve router result params
		if ( _result )
			resolve (_result)

	}));

});

Router.add ('parseQueryString', function () {

});
/**
 * Created by gmena on 07-26-14.
 */
'use strict';

function Storage () {

}

//Set registry to bucket
Storage.add ( 'set', function ( key, data) {
	localStorage.setItem ( key, JSON.stringify ( data ) );
} );


//Get registry from bucket
Storage.add ( 'get', function ( key ) {
	return _.isJson ( localStorage.getItem ( key ) )
		? JSON.parse ( localStorage.getItem ( key ) ) : null;
} );

//Append data to existing bucket
Storage.add ( 'append', function ( key, element) {
	var _existent = this.get ( key ),
	    _new = _.extend ( _.isSet ( _existent ) ? _existent : {}, element );

	this.set ( key, _new, false );
	return this;
} );

//Detroy all buckets
Storage.add ( 'destroy', function () {
	localStorage.clear ();
} );

//Clear a bucket
Storage.add ( 'clear', function ( key ) {
	localStorage.removeItem ( key );
	return this;
} );


//Return count buckets
Storage.add ( 'count', function () {
	return localStorage.length;
} );
/**
 * Created by gmena on 07-26-14.
 */


'use strict';

function Workers () {
	this.Worker = null;
	this.onsuccess = null;
}

//Worker event handler
Workers.add ('on', function (event, callback) {
	var self = this;
	return [
		{
			message: function () {
				self.onsuccess = callback;
			}
		}[event] ()
	]
});

//Set new Worker
Workers.add ('set', function (url) {
	var self = this;
	return (new Promise (function (resolve, reject) {
		self.Worker = (new Worker (setting.system_path + url + '.min.js'));
		self.Worker.addEventListener ('message', function (e) {
			_.callbackAudit (self.onsuccess, e);
		}, false);
		resolve (self);
	}))
});

//Get Worker
Workers.add ('get', function () {
	return this.Worker;
});

//Send Message to Worker
Workers.add ('send', function (message) {
	this.Worker.postMessage (!!message ? message : '');
	return this;
});

//Kill Worker
Workers.add ('kill', function () {
	if ( _.isSet (this.Worker) ) {
		this.Worker.terminate ();
		this.Worker = null;
	}

	return this;
});

/**
 * Created by gmena on 07-26-14.
 */

'use strict';
/**View
 * @constructor
 */

/**Dependencies
 * Http Lib
 * Worker Lib
 * Storage Lib
 * */

function View () {
	this.Http = new Http;
	this.Storage = new Storage;
	this.dir = null;
	this.tpl = null;
}

//Search for the template
View.add ('lookup', function (template) {
	var _conf = {
		url        : setting.app_path + '/templates/' + template,
		contentType: 'text/plain',
		processor  : '.html'
	};

	return this.Http.request (_conf);
});

//Set the template
View.add ('seekTpl', function (template) {
	var _self = this,
		_repo = _self.Storage,
		_template = null, _save = {};

	if ( !_.isSet (_repo.get ('templates')) ) {
		_repo.set ('templates', {});
	}

	_template = _repo.get ('templates');
	_self.dir = template;

	return (new Promise (function (resolve, reject) {
		if ( template in _template ) {
			_self.tpl = _template[template];
			resolve (_self)
		} else {
			//Get the template
			_self.lookup (template).then (function (temp) {
				_save[template] = temp;
				_repo.append ('templates', _save);
				_self.tpl = temp;
				resolve (_self);
			}).catch (function () {
				reject (_.WARNING_SYRUP.ERROR.NONETWORK);
			});
		}
	}));

});

//Return to render html
View.add ('getTpl', function () {
	return this.tpl;
});

//Clear View from Storage
View.add ('clear', function () {
	this.Storage.clear ('templates');
	return this;
});

//Clear View from Storage
View.add ('remove', function () {
	if ( this.dir ) {
		var old_templates = this.Storage.get ('templates');
		if ( old_templates ) {
			delete old_templates[this.dir]
		}

		this.Storage.set ('templates', old_templates);
		this.dir = null;
	}

	return this;
});

//Parse the View
View.add ('render', function (_template, _fields) {
	return (new Promise (function (resolve, reject) {
		(new Workers).set ('/workers/setting/Parser').then (function (worker) {
			worker.send ({ template: _template, fields: _fields });
			worker.on ('message', function (e) {
				resolve (e.data)
			})
		});
	}));
});


/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 18/11/13
 * Time: 12:55
 * To change this template use File | Settings | File Templates.
 */

/**Dependencies
 * Http Lib
 * */

"use strict";
function Model () {
	this.Http = new Http;
	this.modelData = null;
	this.object = {};
	this.type = 'POST';
	this.model = null;
	this.failed = null;
}


/**Set method request
 * @param method
 * @return object
 */
Model.add ('method', function (method) {
	this.type = method.toUpperCase ();
	return this;
});

/**Attach additional data to request
 * @param name
 * @param attach
 * @return object
 */
Model.add ('attach', function (name, attach) {
	var self = this;
	_.assert (self.modelData, _.WARNING_SYRUP.ERROR.NOPACK);
	self.modelData.append (name, attach);
});

/**Getting a array of values name="input[]"
 * @param name
 * @return array
 */
Model.add ('multiple', function (name) {
	var _return = [],
		_model_obj = this.model.object ();

	if ( name in _model_obj.elements ) {
		_.each (_model_obj.elements[name], function (v, i) {
			_return.push (v.value);
		});
	}

	return _return.length > 0 ? _return : false;
});

/**Model fail what to do?
 * @param field
 * @param error
 *
 */
Model.add ('fail', function (field, error) {
	this.failed = true;
	return {
		field : field,
		error : error,
		coords: _.cartesianPlane (field)
	};
});

/**Submit action
 * @param event*/
Model.add ('send', function (url, data) {
	var self = this;
	_.assert (data, _.WARNING_SYRUP.ERROR.NOPACK);

	var conf = {
		url   : url,
		data  : data,
		method: self.type
	};

	return (new Promise (function (resolve, reject) {
		if ( self.failed )
			reject (data);

		self.Http.kill ();
		self.Http.request (conf).then (function (response) {
			resolve (response)
		}).catch (reject);
	}))
});

//Return object
Model.add ('getObject', function () {
	return this.object;
});

//Return formdata
Model.add ('getData', function () {
	return this.modelData;
});

/**Pack the inputs in ModelData Object
 * @param model
 * @return object
 */
Model.add ('pack', function (model) {
	var self = this;
	self.model = _$ (model);

	var _modelData = new FormData,
		_field_array,
		_model_obj = self.model.object (),
		_fields = _model_obj.querySelectorAll ('input, textarea, select'),
		x = _fields.length;

	self.failed = false;

	return (new Promise (function (resolve, reject) {
		//Run over inputs
		while ( x-- ) {

			//Skip file type
			if ( _fields[x].type === 'file' || !_fields[x] ) {
				continue;
			}

			//Checked?
			if ( _fields[x].type === 'checkbox' || _fields[x].type === 'radio' ) {
				if ( !_fields[x].checked ) {
					continue;
				}
			}

			var field = _fields[x],
				fieldValue = field.value;

			//Skip?
			if ( !( _$ (field).data ('skip')) && _.isEmpty (fieldValue) ) {
				reject (self.fail (field, 'empty'));
				break;
				//isMail?
			} else if ( _$ (field).data ('mail') && !_.isMail (fieldValue) ) {
				reject (self.fail (field, 'invalid_mail'));
				break;
				//Overflow down?
			} else if ( _$ (field).data ('min') && (
					+_$ (field).data ('min') > fieldValue.length
				) ) {
				reject (self.fail (field, 'minim_chars'));
				break;
				//Overflow?
			} else if ( _$ (field).data ('max') && (
					+_$ (field).data ('max') < fieldValue.length
				) ) {
				reject (self.fail (field, 'overflow_chars'));
				break;
			} else {
				//Custom validation
				if ( _$ (field).data ('custom') ) {
					var Regex = new RegExp (_$ (field).data ('custom'), "g");
					if ( !Regex.test (fieldValue) ) {
						reject (self.fail (field, 'invalid_custom'));
						break;
					}
				}

				//The field has name?
				if ( _.isSet (field.name) ) {

					//Has multiple?
					if ( !!(_field_array = self.multiple (field.name)) )
						fieldValue = _field_array;

					//Append Data
					_modelData.append (field.name, fieldValue);
					self.object[field.name] = fieldValue;
				}

			}
		}

		//The model data
		self.modelData = _modelData;
		resolve (self);
	}));

});

/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey Mena
 * Date: 18/11/13
 * Time: 12:55
 * To change this template use File | Settings | File Templates.
 */

'use strict';
var GoogleMap,
	WARNING_GOOGLE_MAP = {
		ERROR: {
			NOLOCATION : 'No coordinates seted.',
			NOMAP      : 'No map seted.',
			NOCONTAINER: 'No map container seted.',
			NOCONFIG   : 'The configuration object is necessary.',
			NOROUTES   : 'No mapped routes',
			NODISTANCE : 'You need the source and target to measure the distance.'

		}
	};

GoogleMap = function () {
	var _proto = this.__proto__ || GoogleMap.prototype,
		_self = this || _proto;

	/**Atributos*/
	_self.markersCollection = [];
	_self.coordsCollection = [];
	_self.routesCollection = [];
	_self.infoLabels = [];
	_self.distanceCollection = {};
	_self.container = null;
	_self.mapa = null;
	_self.position = null;
	_self.mapType = 'roadmap';
	_self.travelType = 'DRIVING';
	_self.marker = null;
	_self.ruta = null;
	_self.mapObject = google.maps;
	_self.infoWindow = null;
	_self.animationType = _self.mapObject.Animation.DROP;
	_self.geocoder = new _self.mapObject.Geocoder ();
	_self.distance = new _self.mapObject.DistanceMatrixService ();

	/**Map Config
	 * @param map
	 */
	_proto.setMapType = function (map) {
		var self = this;
		self.mapType = [
						   {
							   road     : self.mapObject.MapTypeId.ROADMAP,
							   satellite: self.mapObject.MapTypeId.SATELLITE,
							   hybrid   : self.mapObject.MapTypeId.HYBRID,
							   terrain  : self.mapObject.MapTypeId.TERRAIN
						   }[map]
					   ].toString () || self.mapType;
	};

	/**Set Container of Map
	 * @param container DOM
	 */
	_proto.setMapContainer = function (container) {
		if ( _.is$ (container) )
			container = container.object ();
		this.container = container;
	};

	//Return Map Position
	_proto.getMapPosition = function () {
		return this.position;
	};

	/**Parse event object google.maps.event to coordinates
	 *  @param e object Event Class
	 * */
	_proto.parseLatLngEvent = function (e) {
		if ( e.latLng ) {
			return {
				latitude : e.latLng.lat (),
				longitude: e.latLng.lng ()
			}
		}
		return null;
	};

	//Return Map
	_proto.getMap = function () {
		return this.mapa;
	};

	//Return coords Collection
	_proto.getCoords = function () {
		return this.coordsCollection;
	};

	//Clean Coords
	_proto.cleanCoords = function () {
		this.coordsCollection = [];
	};

	//Return the center point of a coords collection
	_proto.getCoordsCenterPoint = function () {
		var coords = this.coordsCollection,
			x = 0.0,
			y = 0.0,
			z = 0.0,
			lat = 0,
			long = 0;

		_.each (coords, function (v) {
			lat = (
					  v.lat () * Math.PI
				  ) / 180;
			long = (
					   v.lng () * Math.PI
				   ) / 180;

			x += (
				Math.cos (lat) * Math.cos (long)
			);
			y += (
				Math.cos (lat) * Math.sin (long)
			);
			z += (
				Math.sin (lat)
			);

		});

		x /= coords.length;
		y /= coords.length;
		z /= coords.length;

		long = Math.atan2 (y, x);
		lat = Math.atan2 (z, Math.sqrt (x * x + y * y));

		return {
			latitude : lat * 180 / Math.PI,
			longitude: long * 180 / Math.PI
		}

	};


	/**Append a coord to collection
	 * @param ltnLgn LatLng Class
	 * */
	_proto.appendCoord = function (ltnLgn) {
		this.coordsCollection.push (ltnLgn);
	};

	/**Event Handler
	 * @param elem Marker Class | Map Class
	 * @param event
	 * @param callback
	 * */
	_proto.on = function (elem, event, callback) {
		if ( _.isString (elem) ) {
			callback = event;
			event = elem;
			if ( _.isSet (this.mapa) )
				elem = this.mapa;
		}

		if ( !_.isFunction (callback) )
			_.error (_.WARNING_SYRUP.ERROR.NOFUNCTION);

		if ( !_.isObject (elem) )
			_.error (WARNING_GOOGLE_MAP.ERROR.NOMAP);

		_self.mapObject.event.addListener (elem, event, callback);
	};

	/** Make a google map position with coords latitude, longitude
	 * @param latLong object {latitude:int, longitude:int}
	 * */
	_proto.makePosition = function (latLong) {

		if ( !_.isObject (latLong) ) {
			_.error (WARNING_GOOGLE_MAP.ERROR.NOCONFIG);
		}

		return new this.mapObject.LatLng (
			latLong.latitude,
			latLong.longitude
		);
	};

	/**Set Map Position
	 * @param latLong object {latitude:int, longitude:int}
	 */
	_proto.setMapPosition = function (latLong) {
		if ( !_.isObject (latLong) ) {
			_.error (WARNING_GOOGLE_MAP.ERROR.NOCONFIG);
		}
		this.position = this.makePosition (latLong);
	};

	/**Change Map Position
	 * @param latLong object {latitude:int, longitude:int}
	 */
	_proto.changeMapPosition = function (latLong) {
		var self = this;
		if ( !_.isObject (latLong) ) {
			_.error (WARNING_GOOGLE_MAP.ERROR.NOCONFIG);
		}

		if ( !self.mapa ) {
			_.error (WARNING_GOOGLE_MAP.ERROR.NOMAP);
		}

		self.setMapPosition (latLong);
		self.mapa.setCenter (self.position);
	};

	/**Create a new map object
	 * @param config object
	 * @param callback function
	 */
	_proto.createMap = function (config, callback) {
		var self = this;
		if ( !self.position ) {
			_.error (WARNING_GOOGLE_MAP.ERROR.NOLOCATION);
		}

		if ( !self.container ) {
			_.error (WARNING_GOOGLE_MAP.ERROR.NOCONTAINER);
		}

		var mapOptionsDefault = {
			zoom     : 10,
			center   : self.position,
			mapTypeId: self.mapType
		}, options;

		if ( !_.isFunction (config) ) {
			options = _.extend (config, mapOptionsDefault);
		} else {
			options = mapOptionsDefault;
			callback = arguments[0];
		}

		self.mapa = new self.mapObject.Map (self.container, options);
		_.callbackAudit (callback, self.mapa);
	};


	/**Markers Create
	 * https://developers.google.com/maps/documentation/javascript/3.exp/reference?hl=es#Marker
	 * @param position object {latitude:int, longitude:int}
	 * @param config object
	 * @returns object
	 */
	_proto.setMarker = function (position, config) {

		if ( !this.mapa )
			_.error (WARNING_GOOGLE_MAP.ERROR.NOMAP);

		if ( !_.isObject (config) )
			config = {};

		if ( position && _.isObject (position) ) {
			this.setMapPosition (position);
		} else {
			if ( !this.position ) {
				_.error (WARNING_GOOGLE_MAP.ERROR.NOLOCATION);
			}
		}

		var conf = _.extend ({ position: this.position, map: this.mapa }, config);

		this.marker = new this.mapObject.Marker (conf);
		this.marker.setAnimation (this.animationType);

		this.markersCollection.push (this.marker);
		this.coordsCollection.push (this.position);

		return this.marker;
	};


	/** Set Marker ANimation Type
	 *  @param animation string fall|infinitejump
	 * */
	_proto.setMarkerAnimationType = function (animation) {
		var self = this;
		self.animationType = [
								 {
									 fall        : self.mapObject.Animation.DROP,
									 infinitejump: self.mapObject.Animation.BOUNCE
								 }[animation]
							 ].toString () || self.animationType;
	};

	//Stop Marker Animation
	_proto.stopMarkerAnimation = function () {
		this.marker.setAnimation (null);
	};

	/**Show all Markers
	 *  @param map object Map Class
	 * */
	_proto.showAllMarkers = function (map) {
		_.each (this.markersCollection, function (v) {
			v.setMap (map);
		});
	};

	_proto.clearMarkers = function () {
		this.showAllMarkers (null);
	};

	_proto.deleteMarkers = function () {
		this.markersCollection = [];
	};

	_proto.getMarkers = function () {
		return this.markersCollection;
	};

	/**Create a info label in marker
	 * https://developers.google.com/maps/documentation/javascript/reference?hl=es#InfoWindowOptions
	 * @param content string
	 * @param marker object Marker Class
	 * @param config object
	 * */
	_proto.setMarkerInfo = function (content, marker, config) {
		var self = this;
		config = _.extend ({ content: content }, config);

		var info = this.createInfoLabel (content, config);
		info.open (self.mapa, marker);

		return info;
	};

	/**Create a info label in map
	 * https://developers.google.com/maps/documentation/javascript/reference?hl=es#InfoWindow
	 * @param content string
	 * @param config object
	 * */
	_proto.createInfoLabel = function (content, config) {
		var self = this;
		config = _.extend ({ content: content }, config);

		self.infoWindow = new self.mapObject.InfoWindow (config);
		self.infoLabels.push (self.infoWindow);
		return self.infoWindow;
	};

	//Clear all info labels
	_proto.clearInfoLabels = function () {
		_.each (this.infoLabels, function (v) {
			v.close ();
		})
	};

	//Clear actual Info Label
	_proto.clearInfoLabel = function () {
		self.infoWindow.close ()
	};

	_proto.geoCodeRequest = function (object, callback) {
		this.geocoder.geocode (object, callback);
	};

	/**Location String Info
	 * @param position
	 * @param callback
	 */
	_proto.getLocationInfo = function (position, callback) {
		var self = this;
		if ( _.isSet (position) && _.isObject (position) ) {
			self.setMapPosition (position);
		} else {
			if ( !_.isSet (self.position) ) {
				self.error (WARNING_GOOGLE_MAP.ERROR.NOLOCATION);
			}

			if ( _.isFunction (position) ) {
				callback = arguments[0];
			}
		}

		this.geoCodeRequest ({ 'latLng': self.position }, function (result, status) {
			if ( status === self.mapObject.GeocoderStatus.OK ) {
				_.callbackAudit (callback, {
					street : _.isSet (result[0].address_components[0])
						? result[0].address_components[0].long_name : null,
					city   : _.isSet (result[0].address_components[1])
						? result[0].address_components[1].long_name : null,
					state  : _.isSet (result[0].address_components[2])
						? result[0].address_components[2].long_name : null,
					country: _.isSet (result[0].address_components[3])
						? result[0].address_components[3].long_name : null

				});
			}
		});

	};

	/**Return Lat, Long from string position
	 * @param query
	 * @param callback
	 */
	_proto.getLocationBySearch = function (query, callback) {
		this.geoCodeRequest ({ 'address': query }, function (results, status) {
			if ( status == google.maps.GeocoderStatus.OK ) {
				var data = results[0].geometry.location;
				_.callbackAudit (callback, {
					latitude : data.lat (),
					longitude: data.lng (),
					altitude : 0
				});
			}
		});
	};

	/**Rutas*/
	_proto.drawRoute = function (config, callback) {
		var self = this;
		if ( self.coordsCollection.length == 0 ) {
			self.error (WARNING_GOOGLE_MAP.ERROR.NOROUTES);
		}

		if ( _.isFunction (config) ) {
			callback = arguments[0];
		}

		var _Conf = _.extend ({
			path         : self.coordsCollection,
			geodesic     : true,
			strokeColor  : '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight : 2
		}, config, true);

		self.ruta = new self.mapObject.Polyline (_Conf);

		self.ruta.setMap (self.mapa);
		self.appendRoute (self.ruta);
		_.callbackAudit (callback, self.ruta);
	};

	/**Append Route
	 * @param route PoliLyne Class
	 * */
	_proto.appendRoute = function (route) {
		this.routesCollection.push (route);
	};

	_proto.getRoutes = function () {
		return this.routesCollection;
	};

	_proto.clearRoutes = function () {
		_.each (this.routesCollection, function (v) {
			v.setMap (null);
		});
	};

	_proto.deleteRoutes = function () {
		this.routesCollection = [];
	};

	/**Distances*/
	_proto.setTravelMode = function (type) {
		var self = this;
		self.travelType = [
				{
					'drive': self.mapObject.TravelMode.DRIVING,
					'walk' : self.mapObject.TravelMode.WALKING,
					'bike' : self.mapObject.TravelMode.BICYCLING,
					'bus'  : self.mapObject.TravelMode.TRANSIT
				}[type]
			] || self.travelType;
	};

	_proto.packDistances = function (object) {
		var self = this,
			_destination = object.destinationAddresses,
			_origin = object.originAddresses,
			_distance = object.rows;

		for ( var i in _destination ) {
			self.distanceCollection[i] = {};
			for ( var j in _origin ) {
				if ( _destination[i] != _origin[j] ) {
					if ( _distance[i].elements[j].status == 'OK' ) {
						self.distanceCollection[i][j] = {};
						self.distanceCollection[i][j]['from'] = _destination[i];
						self.distanceCollection[i][j]['destiny'] = _origin[j];
						self.distanceCollection[i][j]['distance'] = _distance[i].elements[j].distance.text;
						self.distanceCollection[i][j]['time'] = _distance[i].elements[j].duration.text
					} else {
						self.distanceCollection[i] = false;
					}
				}
			}
		}
		return self.distanceCollection;
	};

	/**Get the distance of a collection of routes
	 *  @param routes | routes object LatLng Class Collection
	 *  @param config
	 *  @param callback
	 * */
	_proto.getDistance = function (routes, config, callback) {
		var self = this;
		if ( !routes || _.isObject (routes) ) {
			self.error (WARNING_GOOGLE_MAP.ERROR.NODISTANCE);
		}

		if ( _.isFunction (config) ) {
			callback = arguments[1];
		}

		var _Conf = _.extend ({
			origins     : routes,
			destinations: routes,
			travelMode  : self.travelType
		}, config), _Distances = false;

		self.distance.getDistanceMatrix (_Conf, function (result, status) {
			if ( status == 'OK' ) {
				_Distances = self.packDistances (result);
			}

			if ( callback ) {
				callback (_Distances);
			}
		});

	}

};
