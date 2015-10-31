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
				NOPARAM   : 'Param needed',
				NONETWORK : 'Network Error',
				NOOBJECT  : 'A object is needed.',
				NOARRAY   : 'A array is needed.',
				NOSTRING  : 'A string is needed',
				NOFUNCTION: 'A function is needed.',
				NODATE    : 'Invalid Date',
				NOURL     : 'URL is needed.'
			}
		};

	/**Clone a object
	 * @return object
	 * */
	nativeObject.clone = function () {
		return _.extend ({}, this);
	};

	/**Get a index
	 * @param index
	 * @return null|string|int
	 * */
	nativeObject.getIndex = function (index) {
		return index in this ? this[index] : null;
	};

	/** Extend a function
	 *  @param child
	 *  @return void
	 * **/
	nativeFunction.blend = function (child) {
		var name = (
			child.__proto__.constructor.name ||
			child.prototype.constructor.name ||
			( child.toString ().match (regexConstructor)[0]).trim ()
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
		) ()
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
	}

	/**_$_
	 * @constructor
	 */
	function _$_ () {
		this.collection = null;
		this.exist = null;
	}

	/**Dom Traversing
	 * @param dom
	 * @returns {_$_}
	 */
	_$_.add ('$', function (dom) {
		var _tmp, _dom = dom,
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
		_self.name = _dom.nodeName && _dom.nodeName.toLowerCase () || _dom;
		return _self;
	});

	/***Event Handler
	 * @param callback
	 */
	_$_.add ('ready', function (callback) {
		if ( _.isGlobal (this.collection) )
			this.collection.addEventListener (
				"DOMContentLoaded",
				callback.bind (this)
			);
		return this;
	});

	/***Event Load
	 * @param callback
	 */
	_$_.add ('load', function (callback) {
		if ( _.isGlobal (this.collection) ) {
			this.collection.onload = callback.bind (this);
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

				if ( _.isString (delegate) && !_.isFunction (delegate) ) {
					if ( _$ (_target).is (delegate) ) {
						_.callbackAudit (callback.bind (_target), e);
					}
				} else {
					_.callbackAudit (callback.bind (_target), e);
				}
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
	_$_.add ('listenOff', function (event) {
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
		//Not string.. pass!!
		if ( !_.isString (filter) )
			return this;

		return this.each (function (elem) {
			if ( elem.is (filter) ) {
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
		var _clones = [];
		this.each (function (v) {
			_clones.push (_$ (v.cloneNode (childs || false)));
		});
		//Speculate Array
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
			} else if ( _.isObject (_prop) ) {
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
			} else if ( _.isObject (attr) ) {
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
			} else if ( _.isObject (dom) ) {
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
		} else {
			return this.prop ('innerHTML');
		}
		return this;
	});

	/**Inner Text
	 * @param html
	 * @returns {_$_}
	 */
	_$_.add ('text', function (text) {
		if ( _.isString (text) ) {
			this.prop ({ 'textContent': text });
		} else {
			return this.prop ('textContent');
		}
		return this;
	});

	/**Set value
	 * @param html
	 * @returns {_$_}
	 */
	_$_.add ('val', function (text) {
		if ( _.isString (text) ) {
			this.prop ({ 'value': text });
		} else {
			return this.prop ('value');
		}
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
			if ( _elem.nextElementSibling ) {
				_.callbackAudit (callback, _$ (_elem.nextElementSibling));
			}
		});

	});

	/**Nexts Node
	 * @param callback
	 */
	_$_.add ('nexts', function (filter, callback) {
		var _sibling = null;
		callback = _.isFunction (filter) && filter || callback;

		return this.next (function (elem) {
			_sibling = elem;
			do {
				if ( _.isString (filter) && !_.isFunction (filter) ) {
					if ( _sibling.is (filter) ) {
						_.callbackAudit (callback, _sibling);
					}
				} else {
					_.callbackAudit (callback, _sibling);
				}
			} while ( _sibling.get (0).nextElementSibling
					  && (_sibling = _$ (_sibling.get (0).nextElementSibling)).exist )
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

	/**Find Elements recursive
	 * @param {string} filter
	 * @param {function} callback
	 * @return {object}
	 */
	_$_.add ('find', function (filter, callback) {
		//Not string.. pass!!
		if ( !_.isString (filter) )
			return this;

		return this.children (function (elem) {
			if ( elem.is (filter) ) {
				_.callbackAudit (callback, elem, filter);
			} else {
				elem.find (filter, callback);
			}
		});
	});

	/**Full Parent
	 * @param parent_class
	 * @param callback
	 * @return object
	 */
	_$_.add ('parents', function (parent_class, callback) {

		//Not string.. pass!!
		if ( !_.isString (parent_class) )
			return this;

		return this.each (function (_elem) {
			_$ (_elem).parent (function (_parent) {
				if ( _parent.is (parent_class) ) {
					_.callbackAudit (callback, _parent);
				} else {
					_parent.parents (parent_class, callback);
				}
			});
		});

	});

	/***Verify Class
	 * @param {string} cls
	 * @return {bool}
	 */
	_$_.add ('hasClass', function (cls) {
		_.assert (cls, WARNING_SYRUP.ERROR.NOPARAM, '($ .hasClass)');

		//One at time!!
		var elem = this.get (0);

		//ClassList and hasClass?
		return elem.classList
			   && Array.prototype.indexOf.call (
				elem.classList, cls || _.emptyStr
			) > -1;

	});

	/**AddClass Element
	 * @param {string} cls
	 * @return {object}
	 */
	_$_.add ('addClass', function (cls) {
		return this.each (function (elem) {
			if ( !_$ (elem).hasClass (cls) ) {
				if ( elem.classList ) {
					elem.classList.add (cls)
				} else {
					elem.className += ' ' + cls;
				}
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
						_.toRegExp (cls, 'g')
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
			_width.push ((_.cartesianPlane (elem)).width);
		});

		return _.specArray (_width);
	});

	/**Validate is
	 * @param context
	 * @retur object
	 * */
	_$_.add ('is', function (context) {
		_.assert (context, WARNING_SYRUP.ERROR.NOPARAM, '($ .is)');

		var _dom = this.get (0),
			_match = (_dom.matchesSelector ||
					  _dom.webkitMatchesSelector ||
					  _dom.mozMatchesSelector ||
					  _dom.oMatchesSelector ||
					  _dom.msMatchesSelector);

		return (context in _dom || _dom['type'] === context)
			   || _match.call (_dom, context);

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
			} else {
				v.parentNode.removeChild (v);
			}
		});
	});

	/***Each Element
	 * @param callback
	 * @return object
	 */
	_$_.add ('each', function (callback) {
		var _element = this.collection;
		if ( 'childNodes' in _element
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
	Syrup.add ('assert', function (obj, msg, breakpoint) {
		if ( !_.isSet (obj) ) {
			_.error (_.isSet (msg) ? msg : 'Param needed', breakpoint);
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
	Syrup.add ('isRegExp', function (regex) {
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
		if ( _.isObject (input) )
			return _.getObjectSize (input) == 0;

		if ( _.isArray (input) )
			return input.length === 0;


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
	Syrup.add ('warning', function (msg, breakpoint) {
		console.log (
			(msg) +
			(breakpoint ? ' | Method: ' + breakpoint : _.emptyStr)
		);
	});

	/**Console Log error con tiempo de ejecucion
	 * @param msg
	 */
	Syrup.add ('error', function (msg, breakpoint) {
		throw (
			(msg) +
			(breakpoint ? ' | Method: ' + breakpoint : _.emptyStr)
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

		//Regexp result?
		if ( _.isRegExp (_find) && _.isObject (_replace) ) {
			return _string.replace (_find, function (found) {
				if ( found in _replace ) {
					return _replace[found];
				}

				return found;
			})
		} else {
			//Is String?
			return _string.replace (
				_find, _replace
			)
		}
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
	 * @param {function} callback
	 * @param {object} conf -- delay:int, max:int, orientation:int
	 * @return {object}
	 */
	Syrup.add ('interval', function (callback, conf) {
		var _worker = new Workers;

		//Interceptor
		_worker.intercept ({
			'message': function (e) {
				_.callbackAudit (callback, e.data);
			}
		}).run ('/workers/setting/Interval').then (function (_worker) {
			//Worker Running
			_worker.toWork (conf);
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

	/**Retorna un match asociado a grupos
	 * @param {string} string
	 * @param {string} regexp
	 * @param {array} groups
	 * @return (object)
	 */
	Syrup.add ('getRegExpGroup', function (string, regexp, groups) {
		if ( _.isString (string) && _.isRegExp (regexp) ) {
			var _regex_exec = regexp.exec (string);
			return _regex_exec && _regex_exec.reduce (function (v, m, i) {
					if ( i > 0 ) {
						v[groups[i - 1]] = m;
					}

					return v;
				}, {}) || null;
		}
	});

	/** Find the ocurrences count
	 * @param {string} slashDir
	 * @return {int}
	 * **/
	Syrup.add ('oChars', function (string, find) {
		if ( _.isString (string) )
			return string.split (find).length - 1;
		return 0;
	});


	/** Simple split directory from slash to dots
	 * @param {string} slashDir
	 * **/
	Syrup.add ('simplifyDirectory', function (slashDir) {
		if ( _.isString (slashDir) ) {
			return slashDir.split ('/').join ('.')
		}
		return slashDir;
	});

	/** Simple split directory from dots to slash
	 * @param {string} dotDir
	 * **/
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

	/**Pasa Json a format URL
	 * @param _object
	 * @returns {string}
	 */
	Syrup.add ('queryStringToJson', function (_string) {
		var _return = {};

		if ( _.isString (_string) ) {
			//No '?' in query
			_string = _.replace (_string, '?', _.emptyStr).split ('&');

			_.each (_string, function (value) {
				value = value.split ('=');
				if ( !_.isEmpty (value[0]) )
					_return[value[0]] = value[1] || _.emptyStr;
			});
		}

		return _return;
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
	Syrup.add ('each', function (_object, callback, noFilterF) {
		var _p = { first: false, last: false };
		if ( _.isArray (_object) ) {
			var i = 0,
				max = _object.length;
			for ( ; i < max; i++ ) {
				_p.first = i === 0;
				_p.last = (
							  i + 1
						  ) === max;

				callback && noFilterF ? callback (_object[i], i, _p)
					: _.callbackAudit (callback, _object[i], i, _p);

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

					callback && noFilterF ? callback (_object[_keys[_i]], _keys[_i], _p)
						: _.callbackAudit (callback, _object[_keys[_i]], _keys[_i], _p);

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
		_dom = !_.is$ (_dom) && _$ (_dom).get () || _dom;

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

	/**Limpia el arreglo de elementos null, empty,
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
			_.error (WARNING_SYRUP.ERROR.NOARRAY, '(Syrup .specArray)');
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
	 * @param {String} find
	 * @param {Array} haystack
	 * @returns {boolean}
	 */
	Syrup.add ('matchInArray', function (find, haystack) {
		if ( _.isArray (haystack) ) {
			var needle = new RegExp (haystack.join ('|'), 'g');
			return needle.test (find);
		}
		return false;
	});

	/** Reemplaza elementos string en un arreglo por RegExp
	 * @param {String} find
	 * @param {Array} haystack
	 * @returns {boolean}
	 */
	Syrup.add ('replaceInArray', function (find, replace, haystack) {

		if ( this.matchInArray (haystack, [find]) ) {
			_.each (haystack, function (v, i) {
				if ( _.isString (v) )
					haystack[i] = _.replace (v, find, replace);
			});
		}

		return haystack;
	});


	/**Crea un arreglo unico de valores
	 * @param {Object} array
	 * @returns {Array}
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

	/** Parse to RegExp
	 * @param element object
	 * @return string
	 * */

	Syrup.add ('toRegExp', function (element, det) {
		if ( _.isString (element) )
			return new RegExp (element, det || 'g');
	});

	/**Parse to Object
	 * @param element
	 * @returns {Object}
	 */
	Syrup.add ('toObject', function (element, element2) {

		if ( _.isJson (element) )
			return JSON.parse (element);

		if ( _.isString (element) )
			return nativeObject.valueOf.call (element);

		if ( !_.isArray (element) )
			_.error (WARNING_SYRUP.ERROR.NOARRAY, '(Syrup .toObject)');


		return element.reduce (function (o, v, i) {
			o[element2 && v || i] = element2 && element2[i] || v;
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
		//Is syrup object?
		node = _.is$ (node) && node.get () || node;

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

	windowGlobal._$ = (function () {
		return (
			new _$_ ()
		).$;
	}) ();

	_.VERSION = '1.1.6';
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


}) (window);