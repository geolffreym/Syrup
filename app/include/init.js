/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 25/11/13
 * Time: 12:22
 * To change this template use File | Settings | File Templates.
 */

'use strict';

/**Modificando el objeto Function
 * @param child
 */

var
	nativeFunction = Function.prototype,
	nativeObject = Object.prototype,
	regexConstructor = /(([^function])([a-zA-z])+(?=\())/g,
	regexUrl = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
	regexMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
	WARNING_SYRUP = {
		ERROR: {
			NOPARAM              : 'Param needed',
			NOOBJECT             : 'An object param is necessary.',
			NOARRAY              : 'An array necessary.',
			NOFUNCTION           : 'An function necessary.',
			NODATE               : 'Invalid Date',
			NOSTRING             : 'String is required',
			NODOM                : ' not exist in the DOM document',
			NOCALLBACK           : 'Callback error on execution time.',
			NOURL                : 'URL is required for the request.',
			NOHTML               : 'Html string is required',
			NOOBJECTREPLACEREGEXP: 'A object replace param is needed to replace a regexp ex: {match:replace}'
		}
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
	this.scriptCalls = {};
	this.waitingCalls = {};
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
_$_.add ('addListener', function (event, delegate, callback) {
	if ( _.isFunction (delegate) ) {
		callback = delegate;
	}
	
	var _self = this,
		_target = null,
		_event = function (e) {
			e = e || window.event;
			_target = event.srcElement || e.target;

			if ( _.isSet (delegate) && !_.isFunction (delegate) ) {
				_$ (_target).filter (delegate, function () {
					_.callbackAudit (callback, e);
				});
			} else { _.callbackAudit (callback, e); }
		};

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
_$_.add ('removeListener', function (event) {
	this.each (function (elem) {

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
	this.each (function (elem) {
		var match = elem.matchesSelector ||
					elem.webkitMatchesSelector ||
					elem.mozMatchesSelector ||
					elem.oMatchesSelector ||
					elem.msMatchesSelector;
		
		if ( match.call (elem, filter) ) {
			_.callbackAudit (callback, _$ (elem));
		} else if ( _.isFunction (e_handler) ) {
			_.callbackAudit (e_handler, elem);
		}
	});
	
	return this;
});

/**Empty Dom
 * @return void
 * */
_$_.add ('empty', function () {
	this.each (function (v) {
		v.innerHTML = _.emptyStr;
	});
	return this;
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
	
	return _.specArray (_props);
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
	return _.specArray (_attr);
});

/***Remove Atributes
 * @param _attr
 * @return object
 */
_$_.add ('removeAttr', function (attr) {
	this.each (function (v) {
		if ( v[attr] ) {
			v[attr] = false;
		} else {
			v.removeAttr (attr);
		}
	});
	return this;
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
			var _style = window.getComputedStyle (dom, null);
			_css.push (_style.getPropertyValue (css));
		} else {
			_.each (css, function (value, index) {
				dom.style[index] = value;
			});
		}
	});
	
	return _.specArray (_css);
});

/***Insert After
 * @param elem
 */

_$_.add ('after', function (elem) {
	if ( _.isHtml (elem) || !_.is$ (elem) ) {
		elem = _$ (elem);
	}

	this.each (function (obj) {
		elem.each (function (v) {
			obj.parentNode.insertBefore (v, obj.nextSibling)
		})
	});
	return this;
});

/***Insert Before
 * @param elem
 * @return object
 */

_$_.add ('before', function (elem) {
	if ( _.isHtml (elem) || !_.is$ (elem) ) {
		elem = _$ (elem);
	}

	this.each (function (obj) {
		elem.each (function (v) {
			obj.parentNode.insertBefore (v, obj)
		})
	});
	
	return this;
});
/**Append Element or Html
 * @param childs
 * @return object
 */
_$_.add ('append', function (childs) {
	if ( _.isHtml (childs) || !_.is$ (childs) ) {
		childs = _$ (childs);
	}
	
	this.each (function (p) {
		childs.each (function (elm) {
			p.appendChild (elm)
		});
	});
	
	return this;
});

/**Prepend Element or Html
 * @param childs
 * @return object
 */
_$_.add ('prepend', function (childs) {
	if ( _.isHtml (childs) || !_.is$ (childs) ) {
		childs = _$ (childs);
	}
	
	this.each (function (p) {
		childs.each (function (elm) {
			p.insertBefore (elm, p.firstChild)
		});
	});
	
	return this;
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

//Hide Element
_$_.add ('hide', function () {
	this.each (function (_elem) {
		_elem.style.display = 'none';
	});
	return this;
});

//Show Element
_$_.add ('show', function () {
	this.each (function (_elem) {
		_elem.style.display = 'block';
	});
	return this;
});

/**Parent Node
 * @param callback
 */
_$_.add ('parent', function (callback) {
	this.each (function (_elem) {
		if ( _elem.parentNode )
			_.callbackAudit (callback, _$ (_elem.parentNode))
	});
	return this;
});

/**Childs Nodes
 * @param callback
 */
_$_.add ('children', function (callback) {
	this.each (function (_elem) {
		if ( _elem.children.length > 0 ) {
			_.each (_elem.children, function (v, i) {
				if ( _.isNumber (i) )
					_.callbackAudit (callback, _$ (v))
			})
		}
	});
	return this;
});

/**Next Node
 * @param callback
 */
_$_.add ('next', function (callback) {
	this.each (function (_elem) {
		_.callbackAudit (callback, _$ (_elem.nextElementSibling));
	});
	
	return this;
});

/**Nexts Node
 * @param callback
 */
_$_.add ('nexts', function (filter, callback) {
	var _sibling = null;
	callback = _.isFunction (filter)
		? filter : callback;

	this.next (function (elem) {
		_sibling = elem;
		do {
			if ( _.isSet (filter) && !_.isFunction (filter) ) {
				_sibling.filter (filter, function (elem) {
					_.callbackAudit (callback, elem);
				})
			} else { _.callbackAudit (callback, _sibling); }
		} while ( (
			_sibling = _$ (_sibling.collection.nextElementSibling)
		).exist )
	});
	
	return this;
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
	this.children (function (elem) {
		elem.filter (filter, function (e) {
			_.callbackAudit (callback, e);
		}, function () {
			elem.find (filter, callback);
		})
	});
	
	return this;
});

/**Full Parent
 * @param parent_class
 * @param callback
 * @return object
 */
_$_.add ('parents', function (parent_class, callback) {

	this.each (function (_elem) {
		_$ (_elem).parent (function (_parent) {
			_parent.filter (parent_class, function (parent) {
				_.callbackAudit (callback, parent);
			}, function () {
				_parent.parents (parent_class, callback);
			});
		});
	});

	return this;
});

/***Veriy Class
 * @param elem
 * @param cls
 */
_$_.add ('hasClass', function (elem, cls) {
	return (
		new RegExp ('(\\s|^)' + cls + '(\\s|$)')
	).test (elem.className);
});

/**AddClass Element
 * @param elem
 * @param cls
 */
_$_.add ('addClass', function (cls) {
	var _self = this;
	_self.each (function (elem) {
		if ( !_self.hasClass (elem, cls) ) {
			if ( elem.classList ) {
				elem.classList.add (cls)
			} else { elem.className += ' ' + cls; }
		}
	});
	return this;
});

/**ToggleClass Element
 * @param elem
 * @param cls
 */
_$_.add ('toggleClass', function (cls) {
	var _self = this;
	_self.each (function (elem) {
		if ( _self.hasClass (elem, cls) )
			elem.classList.toggle (cls)

	});
	return this;
});

/**Remove Class
 * @param cls
 */
_$_.add ('removeClass', function (cls) {
	var _self = this;
	_self.each (function (elem) {
		if ( _self.hasClass (elem, cls) ) {
			if ( elem.classList ) {
				elem.classList.remove (cls)
			} else {
				elem.className = _.replace (elem.className, (
					new RegExp (cls, 'g')
				), _.emptyStr)
			}
		}
	});
	return this;
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
		this.css ({
			'height': _.isNumber (height)
				? height + 'px' : height
		});
		return this;
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
		this.css ({
			'width': _.isNumber (width)
				? width + 'px' : width
		});
		return this;
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
	var _return = false;
	this.each (function (v) {
		_$ (v).filter (context, function () {
			_return = true;
		}, function () {
			_return = v[context] || v['type'] === context;
		});
		
		if ( _return )
			return false;
	});
	
	return _return;
});

/***Get Child Element
 * @param find
 * @return array
 * */
_$_.add ('get', function (find) {
	var _return = [];
	
	this.children (function (node) {
		if ( node.is (find) )
			_return.push (node);
	});
	
	return _.specArray (_return);
});

/***Remove Element*/
_$_.add ('remove', function () {
	this.each (function (v) {
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
_$_.add ('sort', function (_prop, _desc, _object) {
	if ( _.isBoolean (_prop) ) {
		_desc = arguments[0];
		_prop = false;
	}
	
	_desc = !_desc ? 1 : -1;
	_prop = _prop ? _prop : 'innerHTML';
	_object = _.isObject (_object) ? _object : this.collection;
	_object = _.toArray (_object);
	
	return _object.sort (function (a, b) {
		
		var _a = a[_prop],
			_b = b[_prop];
		
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

	this.each (function (elem) {
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
	return this;
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
		platform: navigator.platform.toLocaleLowerCase ()
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

	_worker.set ('/workers/setting/Interval', function () {
		_worker.send (conf);
	}).on ('message', function (e) {
		_.callbackAudit (callback, e.data);
	});
	
	return _worker;
});

/**Prepare animation
 * @param callback
 * @return function
 */
Syrup.add ('requestAnimationFrame', function (callback) {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function (call) {
			window.setTimeout (call, 0x3E8 / 0x3C);
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
		_return += key + '=' + value;
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
		_.error (WARNING_SYRUP.ERROR.NOCALLBACK);
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


/**Include
 * @param script
 * @param wait
 * @param callback
 * @return object
 */
Syrup.add ('include', function (script, wait, callback) {
	var _url = !_.isUrl (script)
			? setting.app_path + script + '.min.js'
			: script + '.min.js',
		_script = script
			.split ('/')
			.pop ();
	
	if ( _.isFunction (wait) ) {
		callback = arguments[1];
		wait = false;
	}
	
	if ( wait && _.isSet (_.scriptCalls[wait]) ) {
		if ( !_.isSet (_.waitingCalls[wait]) ) {
			_.waitingCalls[wait] = [];
		}
		if ( _.waitingCalls[wait] !== 'done' ) {
			_.waitingCalls[wait].push (function () {
				_.include (script, callback)
			});
			return false;
		}
	}
	
	
	if ( _.isSet (_.scriptCalls[_script]) ) {
		_.callbackAudit (callback);
		return false;
	}
	
	_.scriptCalls[_script] = script;
	_.getScript (_url, function (e) {
		if ( _.isSet (_.waitingCalls[_script]) ) {
			if ( _.isArray (_.waitingCalls[_script]) ) {
				var i = 0,
					max = _.waitingCalls[_script].length;
				for ( ; i < max; i++ ) {
					_.waitingCalls[_script][i] (e);
				}
				_.waitingCalls[_script] = 'done';
			}
		}
		_.callbackAudit (callback);
	});
	return this;
	
});


//Super Global Object Instance
window._ = (function () {
		return new Syrup ();
	}) ();

_.VERSION = '1.1';
_.$fn = _$_;
_.emptyStr = '';

_.nav = {};
_.nav.unsupported =
	!window.localStorage
	|| !window.File
	|| !window.FileReader
	|| !window.FileList
	|| !window.Blob
	|| !window.Worker
	|| !window.WebSocket;
_.nav.cookies = navigator.cookieEnabled;
_.nav.javascript = navigator.javaEnabled ();
_.nav.online = navigator.onLine;
_.nav.local = navigator.userAgent.toLowerCase ();

window._$ = (function () {
		return (
			new _$_ ()
		).$;
	}) ();


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
if(!Object.observe){
	(function(extend, global){
		"use strict";
		var isCallable = (function(toString){
			var s = toString.call(toString),
				u = typeof u;
			return typeof global.alert === "object" ?
				function isCallable(f){
					return s === toString.call(f) || (!!f && typeof f.toString == u && typeof f.valueOf == u && /^\s*\bfunction\b/.test("" + f));
				}:
				function isCallable(f){
					return s === toString.call(f);
				}
				;
		})(extend.prototype.toString);
		// isNode & isElement from http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
		//Returns true if it is a DOM node
		var isNode = function isNode(o){
			return (
				typeof Node === "object" ? o instanceof Node :
				o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
			);
		};
		//Returns true if it is a DOM element
		var isElement = function isElement(o){
			return (
				typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
			);
		};
		var _isImmediateSupported = (function(){
			return !!global.setImmediate;
		})();
		var _doCheckCallback = (function(){
			if(_isImmediateSupported){
				return function _doCheckCallback(f){
					return setImmediate(f);
				};
			}else{
				return function _doCheckCallback(f){
					return setTimeout(f, 10);
				};
			}
		})();
		var _clearCheckCallback = (function(){
			if(_isImmediateSupported){
				return function _clearCheckCallback(id){
					clearImmediate(id);
				};
			}else{
				return function _clearCheckCallback(id){
					clearTimeout(id);
				};
			}
		})();
		var isNumeric=function isNumeric(n){
			return !isNaN(parseFloat(n)) && isFinite(n);
		};
		var sameValue = function sameValue(x, y){
			if(x===y){
				return x !== 0 || 1 / x === 1 / y;
			}
			return x !== x && y !== y;
		};
		var isAccessorDescriptor = function isAccessorDescriptor(desc){
			if (typeof(desc) === 'undefined'){
				return false;
			}
			return ('get' in desc || 'set' in desc);
		};
		var isDataDescriptor = function isDataDescriptor(desc){
			if (typeof(desc) === 'undefined'){
				return false;
			}
			return ('value' in desc || 'writable' in desc);
		};

		var validateArguments = function validateArguments(O, callback, accept){
			if(typeof(O)!=='object'){
				// Throw Error
				throw new TypeError("Object.observeObject called on non-object");
			}
			if(isCallable(callback)===false){
				// Throw Error
				throw new TypeError("Object.observeObject: Expecting function");
			}
			if(Object.isFrozen(callback)===true){
				// Throw Error
				throw new TypeError("Object.observeObject: Expecting unfrozen function");
			}
			if (accept !== undefined) {
				if (!Array.isArray(accept)) {
					throw new TypeError("Object.observeObject: Expecting acceptList in the form of an array");
				}
			}
		};

		var Observer = (function Observer(){
			var wraped = [];
			var Observer = function Observer(O, callback, accept){
				validateArguments(O, callback, accept);
				if (!accept) {
					accept = ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"];
				}
				Object.getNotifier(O).addListener(callback, accept);
				if(wraped.indexOf(O)===-1){
					wraped.push(O);
				}else{
					Object.getNotifier(O)._checkPropertyListing();
				}
			};

			Observer.prototype.deliverChangeRecords = function Observer_deliverChangeRecords(O){
				Object.getNotifier(O).deliverChangeRecords();
			};

			wraped.lastScanned = 0;
			var f = (function f(wrapped){
				return function _f(){
					var i = 0, l = wrapped.length, startTime = new Date(), takingTooLong=false;
					for(i=wrapped.lastScanned; (i<l)&&(!takingTooLong); i++){
						if(_indexes.indexOf(wrapped[i]) > -1){
							Object.getNotifier(wrapped[i])._checkPropertyListing();
							takingTooLong=((new Date())-startTime)>100; // make sure we don't take more than 100 milliseconds to scan all objects
						}else{
							wrapped.splice(i, 1);
							i--;
							l--;
						}
					}
					wrapped.lastScanned=i<l?i:0; // reset wrapped so we can make sure that we pick things back up
					_doCheckCallback(_f);
				};
			})(wraped);
			_doCheckCallback(f);
			return Observer;
		})();

		var Notifier = function Notifier(watching){
			var _listeners = [], _acceptLists = [], _updates = [], _updater = false, properties = [], values = [];
			var self = this;
			Object.defineProperty(self, '_watching', {
				enumerable: true,
				get: (function(watched){
					return function(){
						return watched;
					};
				})(watching)
			});
			var wrapProperty = function wrapProperty(object, prop){
				var propType = typeof(object[prop]), descriptor = Object.getOwnPropertyDescriptor(object, prop);
				if((prop==='getNotifier')||isAccessorDescriptor(descriptor)||(!descriptor.enumerable)){
					return false;
				}
				if((object instanceof Array)&&isNumeric(prop)){
					var idx = properties.length;
					properties[idx] = prop;
					values[idx] = object[prop];
					return true;
				}
				(function(idx, prop){
					properties[idx] = prop;
					values[idx] = object[prop];
					function getter(){
						return values[getter.info.idx];
					}
					function setter(value){
						if(!sameValue(values[setter.info.idx], value)){
							Object.getNotifier(object).queueUpdate(object, prop, 'update', values[setter.info.idx]);
							values[setter.info.idx] = value;
						}
					}
					getter.info = setter.info = {
						idx: idx
					};
					Object.defineProperty(object, prop, {
						get: getter,
						set: setter
					});
				})(properties.length, prop);
				return true;
			};
			self._checkPropertyListing = function _checkPropertyListing(dontQueueUpdates){
				var object = self._watching, keys = Object.keys(object), i=0, l=keys.length;
				var newKeys = [], oldKeys = properties.slice(0), updates = [];
				var prop, queueUpdates = !dontQueueUpdates, propType, value, idx, aLength;

				if(object instanceof Array){
					aLength = self._oldLength;//object.length;
					//aLength = object.length;
				}

				for(i=0; i<l; i++){
					prop = keys[i];
					value = object[prop];
					propType = typeof(value);
					if((idx = properties.indexOf(prop))===-1){
						if(wrapProperty(object, prop)&&queueUpdates){
							self.queueUpdate(object, prop, 'add', null, object[prop]);
						}
					}else{
						if(!(object instanceof Array)||(isNumeric(prop))){
							if(values[idx] !== value){
								if(queueUpdates){
									self.queueUpdate(object, prop, 'update', values[idx], value);
								}
								values[idx] = value;
							}
						}
						oldKeys.splice(oldKeys.indexOf(prop), 1);
					}
				}

				if(object instanceof Array && object.length !== aLength){
					if(queueUpdates){
						self.queueUpdate(object, 'length', 'update', aLength, object);
					}
					self._oldLength = object.length;
				}

				if(queueUpdates){
					l = oldKeys.length;
					for(i=0; i<l; i++){
						idx = properties.indexOf(oldKeys[i]);
						self.queueUpdate(object, oldKeys[i], 'delete', values[idx]);
						properties.splice(idx,1);
						values.splice(idx,1);
						for(var i=idx;i<properties.length;i++){
							if(!(properties[i] in object))
								continue;
							var getter = Object.getOwnPropertyDescriptor(object,properties[i]).get;
							if(!getter)
								continue;
							var info = getter.info;
							info.idx = i;
						}
					};
				}
			};
			self.addListener = function Notifier_addListener(callback, accept){
				var idx = _listeners.indexOf(callback);
				if(idx===-1){
					_listeners.push(callback);
					_acceptLists.push(accept);
				}
				else {
					_acceptLists[idx] = accept;
				}
			};
			self.removeListener = function Notifier_removeListener(callback){
				var idx = _listeners.indexOf(callback);
				if(idx>-1){
					_listeners.splice(idx, 1);
					_acceptLists.splice(idx, 1);
				}
			};
			self.listeners = function Notifier_listeners(){
				return _listeners;
			};
			self.queueUpdate = function Notifier_queueUpdate(what, prop, type, was){
				this.queueUpdates([{
					type: type,
					object: what,
					name: prop,
					oldValue: was
				}]);
			};
			self.queueUpdates = function Notifier_queueUpdates(updates){
				var self = this, i = 0, l = updates.length||0, update;
				for(i=0; i<l; i++){
					update = updates[i];
					_updates.push(update);
				}
				if(_updater){
					_clearCheckCallback(_updater);
				}
				_updater = _doCheckCallback(function(){
					_updater = false;
					self.deliverChangeRecords();
				});
			};
			self.deliverChangeRecords = function Notifier_deliverChangeRecords(){
				var i = 0, l = _listeners.length,
				//keepRunning = true, removed as it seems the actual implementation doesn't do this
				// In response to BUG #5
					retval;
				for(i=0; i<l; i++){
					if(_listeners[i]){
						var currentUpdates;
						if (_acceptLists[i]) {
							currentUpdates = [];
							for (var j = 0, updatesLength = _updates.length; j < updatesLength; j++) {
								if (_acceptLists[i].indexOf(_updates[j].type) !== -1) {
									currentUpdates.push(_updates[j]);
								}
							}
						}
						else {
							currentUpdates = _updates;
						}
						if (currentUpdates.length) {
							if(_listeners[i]===console.log){
								console.log(currentUpdates);
							}else{
								_listeners[i](currentUpdates);
							}
						}
					}
				}
				_updates=[];
			};
			self.notify = function Notifier_notify(changeRecord) {
				if (typeof changeRecord !== "object" || typeof changeRecord.type !== "string") {
					throw new TypeError("Invalid changeRecord with non-string 'type' property");
				}
				changeRecord.object = watching;
				self.queueUpdates([changeRecord]);
			};
			self._checkPropertyListing(true);
		};

		var _notifiers=[], _indexes=[];
		extend.getNotifier = function Object_getNotifier(O){
			var idx = _indexes.indexOf(O), notifier = idx>-1?_notifiers[idx]:false;
			if(!notifier){
				idx = _indexes.length;
				_indexes[idx] = O;
				notifier = _notifiers[idx] = new Notifier(O);
			}
			return notifier;
		};
		extend.observe = function Object_observe(O, callback, accept){
			// For Bug 4, can't observe DOM elements tested against canry implementation and matches
			if(!isElement(O)){
				return new Observer(O, callback, accept);
			}
		};
		extend.unobserve = function Object_unobserve(O, callback){
			validateArguments(O, callback);
			var idx = _indexes.indexOf(O),
				notifier = idx>-1?_notifiers[idx]:false;
			if (!notifier){
				return;
			}
			notifier.removeListener(callback);
			if (notifier.listeners().length === 0){
				_indexes.splice(idx, 1);
				_notifiers.splice(idx, 1);
			}
		};
	})(Object, this);
}
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


	if ( !_.isSet (this.breadcrumb[name]) ) {
		Syrup.blend (_anonymous);
		this.name = name;
		this.object = _[name];
		this.breadcrumb[name] = this.object;
	} else if ( !_.isSet (_[this.name][name]) ) {
		name = _split.pop ();
		_[this.name][name] = {};
		this.object = _[this.name][name];
		this.breadcrumb[name] = this.object;
	}

	this._dependencies (dependencies);

	return this;

});

/** Return a method saved in breadcrumb
 * @param name
 * @return object
 * **/
Libs.add ('get', function (name) {
	return _.isSet (this.breadcrumb[name]) && this.breadcrumb[name];
});

/**Dependencies gestor
 * @param dependencies []
 * @return void
 * */
Libs.add ('_dependencies', function (dependencies) {
	var _self = this;
	if ( _.isArray (dependencies) && _.isSet (_self.object) ) {
		_.each (dependencies, function (v) {
			_self.object.__proto__[v] = !_.isSet (_self.object[v])
				? new window[v] : _self.object[v];
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


window.Lib = new Libs;

/**
 * Created by gmena on 07-31-14.
 */
"use strict";

function Modules () {
	this.root = null;
	this.lib = null;
	this.scope = {};
	this.modules = {};
	this.onchange = {};
	this.onstop = {};
	this.ondrop = {};
}

/** Blend a method in global Syrup object
 * @param name
 * @param dependencies []
 * @return object
 * **/
Modules.add ('blend', function (name, dependencies) {
	var _self = new Modules;
	_self.lib = new Libs;
	_self.root = name;
	_self.scope = {};
	_self.lib.blend (name, dependencies);

	return _self;
});

/** Make a recipe for blend
 *  @param moduleId string
 *  @param module function
 *  @return object
 * */
Modules.add ('recipe', function (moduleId, module) {
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
Modules.add ('_watch', function (moduleId) {
	var _self = this;
	Object.observe (_self.scope, function (change) {
		_.each (change, function (v) {
			if ( _.isSet (_self.onchange[v.name])
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
Modules.add ('_add', function (moduleId) {
	if ( !_.isObject (this.scope[moduleId]) )
		this.scope[moduleId] = {};
});

/**Trigger code execution
 * @param moduleId
 * @return void
 * **/
Modules.add ('_trigger', function (moduleId) {
	if ( _.isSet (this.modules[moduleId]) )
		return this.modules[moduleId].creator (_, _$, this.scope);
	return {}
});

/**Object UnObserver
 * @return void
 * **/
Modules.add ('stopWatch', function () {
	var _self = this;
	Object.unobserve (_self.scope, function () {
		if ( _.isSet (_self.onstop) ) {
			_self.onstop ();
		}
	})
});

/** Append global service
 * @param name
 * @param callback function
 * @return void
 *
 * */
Modules.add ('service', function (name, callback) {
	this.lib.cook (name, callback);
});

/** Append global services
 * @param object
 * @return void
 *
 * */
Modules.add ('services', function (object) {
	this.lib.supply (object);
});


Modules.add ('value', function () {

});

/**Set Scope
 * @param moduleId
 * @param object
 * @return void
 * **/
Modules.add ('setScope', function (moduleId, object) {
	if ( _.isSet (this.scope[moduleId]) ) {
		this.scope[moduleId] = object;
	}
});

/**Get Scope
 * @param moduleId
 * @return object
 * **/
Modules.add ('getScope', function (moduleId) {
	if ( _.isSet (this.scope[moduleId]) ) {
		return this.scope[moduleId];
	}
	return {};
});

Modules.add ('when', function (event, name, callback) {
	var self = this;
	return [
		{
			change: function () {
				self.onchange[name] = callback;
			},
			stop  : function () {
				self.onstop[name] = callback;
			},
			drop  : function () {
				self.ondrop[name] = callback;
			}
		}[event] ()
	]
});

Modules.add ('_serve', function (moduleId, template) {
	var _self = this,
		_template = new Template,
		_scope = _self.scope[moduleId],
		_dom = _$ ('[sp-controller="' + moduleId + '"]');

	if ( _dom.exist && _.getObjectSize (_scope) > 0 ) {
		if ( _.isBoolean (template) ) {
			//TODO use cache lib
			_.include ('/app/view/' + _self.root + '/' + _.replace (moduleId, /\./g, '_'), function () {
				_template[moduleId] (_scope, function (my_html) {
					_dom.html (my_html);
				})
			})
		} else {
			var _dom_template = _$ ('[sp-template="' + template + '"]'),
				_parse = _dom_template.exist ? _dom_template.html () : _dom.html ();

			if ( _.isSet (_parse) ) {
				_template.parse (_parse, _scope, function (result) {
					_dom.html (result);
				});
			}
		}
	}
});

Modules.add ('_taste', function (moduleId) {
	var _self = this;

	if ( _.isSet (_self.modules[moduleId]) && _.isSet (_self.root) ) {

		//Initialize module
		_self._add (moduleId);
		_self.modules[moduleId].instance = _self._trigger (moduleId);
		_self.modules[moduleId].instance.name = moduleId;
		_self.modules[moduleId].instance.parent = _self.root;

		//Binding Methods
		_self.modules[moduleId].instance.setScope = function (object) {
			if ( _.isObject (object) ) {
				_self.setScope (moduleId, object);
			}
		};

		_self.modules[moduleId].instance.getScope = function () {
			return _self.getScope (moduleId);
		};

		_self.modules[moduleId].instance.when = function (event, callback) {
			_self.when (event, moduleId, callback);
		};

		_self.modules[moduleId].instance.serve = function (_template) {
			_self._serve (moduleId, _.isSet (_template) ? _template : this.template);
		};

		//Observe scope
		_self._watch (moduleId);

		//Init the module
		if ( _.isSet (self.modules[moduleId].instance.init) ) {
			_self.modules[moduleId].instance.init (this.lib.get (_self.root));
			_self._serve (moduleId, _self.modules[moduleId].instance.template);
		}
	}

	return this;
});

Modules.add ('drop', function (moduleId) {
	if ( _.isSet (this.modules[moduleId]) ) {
		if ( this.modules[moduleId].instance ) {
			if ( this.modules[moduleId].instance.destroy )
				this.modules[moduleId].instance.destroy (moduleId);

			if ( this.ondrop[moduleId] )
				this.ondrop[moduleId] (moduleId);

			this.modules[moduleId] = null;
		}
	}
	return this;
});


Modules.add ('dropAll', function () {
	var _self = this;
	_.each (this.modules, function (module, id) {
		_self.drop (id);
	});
	return this;
});

window.Module = new Modules;

/**
 * Created by gmena on 07-26-14.
 */

'use strict';

/**Ajax
 * @constructor
 */


function Ajax () {
	this.xhr = new window.XMLHttpRequest
			   || new window.ActiveXObject ( "Microsoft.XMLHTTP" );
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
Ajax.add ( 'on', function ( event, callback ) {
	var self = this;
	return [
		{
			before  : function () {
				self.before = callback;
			},
			complete: function () {
				self.complete = callback;
			},
			error   : function () {
				self.error = callback;
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
		}[ event ] ()
	]

} );

/** Ajax Request
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
 *	contentHeader: (object) the content header request,
 *	data: (object) the request data,
 *	upload: (bool) is upload process?
 *
 * }
 * **/
Ajax.add ( 'request', function ( config, callback ) {
	if ( !_.isObject ( config ) ) {
		throw (WARNING_SYRUP.ERROR.NOOBJECT)
	}

	var _self = this,
		_xhr = _self.xhr,
		_async = true,
		_type = config.method || 'GET',
		_timeout = config.timeout || 4000,
		_processor = config.processor || setting.ajax_processor || '',
		_token = config.token || false,
		_contentType = config.contentType || 'application/x-www-form-urlencoded;charset=utf-8',
		_data = config.data
			? config.data : null,
		_contentHeader = config.contentHeader ||
						 [
							 {
								 header: 'Content-Type',
								 value : _contentType
							 }
						 ]
		;

	if ( !_.isSet ( config.url ) ) {
		throw (WARNING_SYRUP.ERROR.NOURL);
	}

	if ( !_.isFormData ( _data )
		 && _.isSet ( _data )
		 && _contentHeader !== 'auto' ) {
		_data = _.parseJsonUrl ( _data );
	}

	if ( _type === 'GET' && _.isSet ( _data ) ) {
		_processor += '?' + _data;
	}

	_processor = config.url + (_processor || '');
	_xhr.open ( _type, _processor, _async );
	_xhr.timeout = _timeout;

	//Setting Headers
	if ( !_.isFormData ( _data ) && _contentHeader !== 'auto' ) {
		_.each ( _contentHeader, function ( v ) {
			_self.requestHeader ( v.header, v.value );
		} )

	}

	//Using Token
	if ( _.isSet ( _token ) )
		_self.requestHeader ( "X-CSRFToken", _.getCookie ( _.isBoolean ( _token ) ? 'csrftoken' : _token ) );

	//If upload needed
	if ( _.isSet ( config.upload ) && _.isBoolean ( config.upload ) ) {
		_self.upload = _self.xhr.upload;
		_xhr = _self.upload;
	}

	//Event Listeners
	_xhr.addEventListener ( 'load', function ( e ) {
		if ( this.status >= 0xC8 && this.status < 0x190 ) {
			var _response = this.response || this.responseText;
			if ( _.isJson ( _response ) ) {
				_response = JSON.parse ( _response );
			}
			_.callbackAudit ( callback, _response, e );

		}
	} );

	_xhr.addEventListener ( 'progress', function ( e ) {
		if ( _self.progress ) {
			_self.progress ( e );
		}
	}, false );

	_xhr.addEventListener ( 'readystatechange', function ( e ) {
		if ( this.readyState ) {
			if ( !!_self.state ) {
				_self.state ( this.readyState, e );
			}
		}
	} );

	_xhr.addEventListener ( 'abort', function ( e ) {
		if ( !!_self.abort ) {
			_self.abort ( e );
		}
	} );

	_xhr.addEventListener ( 'timeout', function ( e ) {
		if ( !!_self.time_out ) {
			_self.time_out ( e );
		}
	} );

	_xhr.addEventListener ( 'loadend', function ( e ) {
		if ( !!_self.complete ) {
			_self.complete ( e );
		}
	} );

	_xhr.addEventListener ( 'loadstart', function ( e ) {
		if ( !!_self.before ) {
			_self.before ( e );
		}
	} );

	_xhr.addEventListener ( 'error', function ( e ) {
		if ( !!_self.error ) {
			_self.error ( e );
		}
	} );


	//Send
	_self.xhr_list.push ( _self.xhr );
	_xhr.send ( _type !== 'GET' ? _data : null );

	return _self.xhr;
} );

/** Set Request Header
 * @param header
 * @param type
 * @return object
 * **/
Ajax.add ( 'requestHeader', function ( header, type ) {
	this.xhr.setRequestHeader ( header, type );
	return this;
} );

//Kill Ajax
Ajax.add ( 'kill', function () {
	var i = this.xhr_list.length;
	while ( i-- ) {
		if ( !!this.xhr_list[ i ] )
			this.xhr_list[ i ].abort ();
	}
	this.xhr_list.length = 0;

	return this;
} );



/**
 * Created by gmena on 07-26-14.
 */
'use strict';

function Repository () {

}

//Set registry to bucket
Repository.add ( 'set', function ( key, data, callback ) {
	localStorage.setItem ( key, JSON.stringify ( data ) );
	_.callbackAudit ( callback, data, this );
} );


//Get registry from bucket
Repository.add ( 'get', function ( key ) {
	return _.isJson ( localStorage.getItem ( key ) )
		? JSON.parse ( localStorage.getItem ( key ) ) : null;
} );

//Append data to existing bucket
Repository.add ( 'append', function ( key, element, callback ) {
	var _existent = this.get ( key ),
	    _new = _.extend ( _.isSet ( _existent ) ? _existent : {}, element );

	this.set ( key, _new, false );
	_.callbackAudit ( callback, _new );
	return this;
} );

//Detroy all buckets
Repository.add ( 'destroy', function () {
	localStorage.clear ();
} );

//Clear a bucket
Repository.add ( 'clear', function ( key ) {
	localStorage.removeItem ( key );
	return this;
} );


//Return count buckets
Repository.add ( 'count', function () {
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
Workers.add ( 'on', function ( event, callback ) {
	var self = this;
	return [
		{
			message: function () {
				self.onsuccess = callback;
			}
		}[ event ] ()
	]
} );

//Set new Worker
Workers.add ( 'set', function ( url, callback ) {
	var self = this;
	self.Worker = (new Worker ( setting.system_path + url + '.min.js' ));
	self.Worker.addEventListener ( 'message', function ( e ) {
		_.callbackAudit ( self.onsuccess, e );
	}, false );
	_.callbackAudit ( callback, self.Worker );

	return this;

} );

//Get Worker
Workers.add ( 'get', function () {
	return this.Worker;
} );

//Send Message to Worker
Workers.add ( 'send', function ( message ) {
	this.Worker.postMessage ( !!message ? message : '' );
	return this;
} );

//Kill Worker
Workers.add ( 'kill', function ( callback ) {
	if ( _.isSet ( this.Worker ) ) {
		this.Worker.terminate ();
		this.Worker = null;
		_.callbackAudit ( callback );
	}

	return this;
} );

/**
 * Created by gmena on 07-26-14.
 */

'use strict';
/**Template
 * @constructor
 */

/**Dependencies
 * Ajax Lib
 * Worker Lib
 * Repository Lib
 * */

function Template () {
	this.Ajax = new Ajax;
	this.Repository = new Repository;
	this.Workers = new Workers;
	this.template = null;
}

//Search for the template
Template.add ( 'lookup', function ( template, callback ) {
	var _conf = {
		url      : setting.app_path + '/templates/' + template,
		dataType : 'text/plain',
		processor: '.html'
	};

	this.Ajax.request ( _conf, function ( response ) {
		_.callbackAudit ( callback, response );
	} );

	return this;
} );

//Get the template
Template.add ( 'get', function ( template, callback ) {
	var _self = this,
		_repo = _self.Repository,
		_template = _repo.get ( 'templates' ),
		_save = {};

	_self.template = template;
	if ( _.isSet ( _template ) ) {
		if ( _.isSet ( _template[ template ] ) ) {
			_.callbackAudit ( callback, _template[ template ] )
		} else {
			_self.lookup ( template, function ( temp ) {
				_save[ template ] = temp;
				_repo.append ( 'templates', _save );
				_.callbackAudit ( callback, temp );
			} )
		}
	} else {
		_repo.set ( 'templates', {} );
		this.get ( template, callback )
	}

	return this;
} );

//Clear Template from Repository
Template.add ( 'clear', function () {
	this.Repository.clear ( 'templates' );
	return this;
} );

//Clear Template from Repository
Template.add ( 'remove', function () {
	if ( this.template ) {
		var old_templates = this.Repository.get ( 'templates' );
		if ( old_templates ) {
			delete old_templates[ this.template ]
		}

		this.Repository.set ( 'templates', old_templates );
		this.template = null;
	}

	return this;
} );

//Parse the Template
Template.add ( 'parse', function ( _template, _fields, callback ) {
	var _self = this;
	_self.Workers.set ( '/workers/setting/Parser', function ( worker ) {
		_self.Workers.send ( { template: _template, fields: _fields } );
	} ).on ( 'message', function ( e ) {
		_.callbackAudit ( callback, e.data )
	} );

	return this;
} );


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
			_.error (WARNING_SYRUP.ERROR.NOFUNCTION);

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

/**
 * Created by gmena on 07-26-14.
 */

//Basic Config

var setting = {
	ajax_processor: '',
	app_path      : '/Syrup/app',
	system_path   : '/Syrup/system',
	env: 'development'
};


//Please install Node and run the command `npm install` and `npm start` to execute
//Set Environment
if ( typeof exports !== 'undefined' )
	exports.setting = setting;
