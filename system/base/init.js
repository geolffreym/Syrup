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
	}
	;

nativeFunction.blend = function (child) {
	var name = (
		child.prototype.constructor.name
		|| (
			child.toString ().match (regexConstructor)[0]
		).trim ()
	);
	this.prototype[name] = child;
};

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

/**Add method to class
 * @param name
 * @param fn
 */
nativeFunction.add = function (name, fn) {
	name = name.trim ();
	this.prototype[name] = fn;
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
			? document.querySelectorAll (_.replace (dom, '+', ''))
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
		v.innerHTML = '';
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
				), '')
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
		!input || input === '' || /^\s+$/.test (input)
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
		r = '', b = 0, e = 1, _tmp;
	
	
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
	var _text = "",
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
	if ( !!_mcookie && _mcookie !== '' ) {
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
	var _return = '',
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
 * @return (Boolean|null)
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
	
});


//Super Global Object Instance
window._ = (
	function () {
		return new Syrup ();
	}
) ();

_.VERSION = '1.1';
_.$fn = _$_;

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

window._$ = (
	function () {
		return (
			new _$_ ()
		).$;
	}
) ();

