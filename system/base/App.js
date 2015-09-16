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
Apps.add ('beforeInit', function (moduleList, callback) {
	return this._triggerOn (moduleList, callback, this.triggerBefore);
});


/**Add a custom trigger to execute after the given modules
 * @param moduleList
 * @callback*/
Apps.add ('afterInit', function (moduleList, callback) {
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


/**Return a recipe by name
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
Apps.add ('when', function (event, name) {
	var self = this;
	return {
		change: ({
			then: (function (resolve) {
				self.onchange[name] = resolve;
			})
		})
	}[event]
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

		_self.modules[moduleId].instance.when = function (event) {
			return _self.when (event, moduleId);
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

			//Execution
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
