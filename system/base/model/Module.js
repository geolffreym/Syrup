/**
 * Created by gmena on 07-31-14.
 */
"use strict";

function Module () {
	this.root = null;
	this.temp = null;
	this.scope = {};
	this.modules = {};
	this.onchange = {};
	this.onstop = {};
	this.ondrop = {};
	this.observer = {};
}

Module.add ( 'blend', function ( name, dependencies ) {
	Lib.blend ( name, dependencies );
	this.root = name;
	this.scope[name] = {};
	return this;
} );

Module.add ( 'recipe', function ( moduleId, module ) {
	if ( _.isSet ( this.root ) ) {
		var _self = this;
		if ( _.isSet ( module ) ) {
			_self.temp = moduleId;
			_self.modules[moduleId] = {
				creator:  module,
				instance: null,
				parent:   _self.root
			};
			_self._taste ( moduleId );
		}

	}
	return this;
} );

Module.add ( '_watch', function ( moduleId ) {
	var _self = this;

	_self.observer[moduleId] = Object.observe ( _self.scope[_self.modules[moduleId].parent], function ( change ) {
		_.each ( change, function ( v ) {

			if ( _.isSet ( _self.onchange[v.name] )
				&& _.getObjectSize ( v.object ) > 0
				&& moduleId === v.name
				) {
				_self.onchange[v.name] ( {name: v.name, old: v.oldValue, type: v.type, object: v.object[v.name]} );
			}
		} );
	} );

} );

Module.add ( '_add', function ( moduleId ) {
	var _self = this;

	if ( !_.isObject ( _self.scope[_self.modules[moduleId].parent][moduleId] ) )
		_self.scope[_self.modules[moduleId].parent][moduleId] = {};

} );

Module.add ( '_trigger', function ( moduleId ) {
	var _self = this;
	return _self.modules[moduleId].creator ( _, _$, _self.scope[_self.modules[moduleId].parent] );
} );

Module.add ( 'stopWatch', function () {
	var _self = this;
	Object.unobserve ( _self.scope[_self.root], function () {
		if ( _.isSet ( _self.onstop ) ) {
			_self.onstop ();
		}
	} )
} );

Module.add ( 'value', function () {

} );

Module.add ( 'setScope', function ( moduleId, object ) {
	if ( _.isSet ( this.scope[this.modules[moduleId].parent][moduleId] ) ) {
		this.scope[this.modules[moduleId].parent][moduleId] = object;
	}
} );

Module.add ( 'getScope', function ( moduleId ) {
	if ( _.isSet ( this.scope[this.modules[moduleId].parent][moduleId] ) ) {
		return this.scope[this.modules[moduleId].parent][moduleId];
	}
	return {};
} );

Module.add ( 'addEvent', function ( event, callback ) {
	var _self = this,
	    _callback,
	    _dom = _self.modules[_self.temp].instance.dom;

	_callback = _.isSet ( callback ) && _.isFunction ( callback )
		? callback : function ( e ) {
		e.dance = _.isString ( callback )
			? callback : false;
		_self._taste ( _$ ( e.target ).data ( 'shooter' ), e )
	};

	if ( _dom.exist ) {
		_dom.data ( 'shooter', _self.temp );
		_dom.addListener ( event, _callback );
	}
	return this;
} );

Module.add ( 'on', function ( event, name, callback ) {
	var self = this;
	return [{
		change: function () {
			self.onchange[name] = callback;
		},
		stop:   function () {
			self.onstop[name] = callback;
		},
		drop:   function () {
			self.ondrop[name] = callback;
		}
	}[event] ()]
} );

Module.add ( '_serve', function ( moduleId, template ) {
	var _self = this,
	    _scope = _self.scope[_self.modules[moduleId].parent][moduleId],
	    _template = _.Template,
	    _dom = _$ ( '[syrup-controller="' + moduleId + '"]' );

	if ( _dom.exist && _.getObjectSize ( _scope ) > 0 ) {
		if ( _.isSet ( template ) ) {
			_.include ( 'app/view/' + _self.modules[moduleId].parent + '/' + moduleId, function () {
				_template[moduleId] ( _scope, function ( my_html ) {
					_dom.html ( my_html );
				} )
			} )
		} else {
			var _dom_copy = _dom.object ();

			if ( !_.isSet ( _self.modules[moduleId]['parse'] ) )
				_self.modules[moduleId]['parse'] = _.isSet ( _dom_copy.content )
					? _dom_copy.content.textContent : _dom_copy.textContent;

			if ( _.isSet ( _self.modules[moduleId]['parse'] ) ) {
				_template.parse ( _self.modules[moduleId]['parse'], _scope, function ( result ) {
					_dom.html ( result );
				} );
			}
		}
	}
} );


Module.add ( 'factory', function ( name, callback ) {
	var _self = this;
	Lib.cook ( name, function () {
		callback ( _self.scope[_self.root] );
	} )
} );

Module.add ( 'service', function ( name, callback ) {
	Lib.cook ( name, callback );
} );

Module.add ( 'services', function ( callback ) {
	Lib.supply ( callback );
} );


Module.add ( '_taste', function ( moduleId, event ) {
	var _self = this,
	    _dance = false,
	    _parent;

	if ( _.isSet ( _self.modules[moduleId] ) && _.isSet ( _self.modules[moduleId].parent ) ) {
		_parent = _self.modules[moduleId].parent.split ( '.' ).pop ();
		if ( !_.isSet ( event ) ) {
			_self._add ( moduleId );
			_self.modules[moduleId].instance = _self._trigger ( moduleId );
			_self.modules[moduleId].instance.name = moduleId;
			_self.modules[moduleId].instance.parent = _parent;
			_self.modules[moduleId].instance.dom = _$ ( '[syrup-event="' + moduleId + '"]+' );
			_self.modules[moduleId].instance.template = _.isSet ( _self.modules[moduleId].instance.template );

			_self.modules[moduleId].instance.setScope = function ( object ) {
				_self.setScope ( moduleId, object );
			};

			_self.modules[moduleId].instance.getScope = function () {
				return _self.getScope ( moduleId );
			};

			_self.modules[moduleId].instance.on = function ( event, callback ) {
				_self.on ( event, moduleId, callback );
			};
			_self.modules[moduleId].instance.serve = function ( _template ) {
				_self._serve ( moduleId, _template );
			};


			_self._watch ( moduleId );

		} else {
			if ( _.isSet ( event.dance ) ) {
				if ( _.isSet ( _self.modules[moduleId].instance[event.dance] ) ) {
					if ( _.isFunction ( _self.modules[moduleId].instance[event.dance] ) ) {
						_self.modules[moduleId].instance[event.dance] ( Lib.get ( _parent ), event );
						_dance = true;
					}
				}
			}
		}

		if ( _self.modules[moduleId].instance.init && !_dance ) {
			/**
			 * @param parentObject
			 * @param event
			 * */
			_self.modules[moduleId].instance.init ( Lib.get ( _parent ), event );
			_self._serve ( moduleId, _self.modules[moduleId].instance.template );
		}

	}
	return this;
} );

Module.add ( 'drop', function ( moduleId ) {
	if ( _.isSet ( this.modules[moduleId] ) ) {
		if ( this.modules[moduleId].instance ) {
			if ( this.modules[moduleId].instance.destroy )
				this.modules[moduleId].instance.destroy ( moduleId );

			if ( this.ondrop[moduleId] )
				this.ondrop[moduleId] ( moduleId );

			this.modules[moduleId] = null;
		}
	}
	return this;
} );


Module.add ( 'dropAll', function () {
	var _self = this;
	_.each ( this.modules, function ( module, id ) {
		_self.drop ( id );
	} );
	return this;
} );

window.Module = new Module;
