/**
 * Created by gmena on 07-31-14.
 */
"use strict";
(function (window) {
	function Apps () {
		this.root = null; // Root name
		this.lib = null; // Lib handler
		this.app = null; // The main app
		this.after = null; // After recipes init execution

		this.model = null; // The model
		this.scope = {}; // Global scope
		this.modules = {}; // Modules list
		this.onchange = {}; // Change handler
	}

	/** Blend a method in global Syrup object
	 * @param name
	 * @param dependencies []
	 * @return object
	 * **/
	Apps.add ('blend', function (name, dependencies) {
		var _self = new Apps;
		_self.lib = new LibClass;
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

				//Constructor
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
					return false;
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
			return this.modules[moduleId].creator (_, this.scope);
		return {}
	});

	/**Provide a global initial config
	 * @param moduleId
	 * @return void
	 * **/
	Apps.add ('cook', function (callback) {
		if ( _.isFunction (callback) )
			callback (this.lib.get (this.root), _);
		return this;
	});


	/**Global attributes supplier
	 * @param moduleList
	 * @callback*/
	Apps.add ('spice', function (object) {
		if ( _.isObject (object) )
			this.lib.make (object);
		return this;
	});


	/**Add a custom trigger to execute after init
	 * @param moduleList
	 * @callback*/
	Apps.add ('afters', function (callback) {
		if ( _.isFunction (callback) )
			this.after = callback;
		return this;
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
		return event && (
			{
				change: ({
					then: (function (resolve) {
						self.onchange[name] = resolve;
					})
				})
			}[event] || { then: function () {} })
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
			var _this = this, _dom = null,
				_self = this.modules[moduleId].instance,
				_the_filter = enabled_events.join (' [sp-'),
				_mod = _$ ('[sp-recipe="' + moduleId + '"]');

			//Exist the module?
			if ( _mod.exist ) {

				//Find events listeners
				_mod.find (_the_filter, function (dom_list) {
					//Find the listener in attributes
					_.each ((_dom = dom_list.get ()).attributes, function (v) {
						if ( /sp-[a-z]+/.test (v.localName) ) {
							var _event = _.replace (v.localName, 'sp-', _.emptyStr),
								_attr = _dom.getAttribute (v.localName);

							//Is the attr value in module?
							if ( _attr in _self ) {
								//is Function the attr value?
								if ( _.isFunction (_self[_attr]) ) {
									_mod.listen (_event, '[' + v.localName + '="' + _attr + '"]', function (e) {
										//Param event and dependencies
										e.preventDefault ();
										_self[_attr] (_this.lib.get (_self.parent), e);
									});
								}
							}
						}
					});
				});
			}
		}
	});

	/** Prepare Model
	 * @param moduleId
	 */
	Apps.add ('_models', function (moduleId) {
		var _self = this,
			_model = new Model,
			_resource = _$ ('[sp-recipe="' + moduleId + '"] [sp-model]');

		//Exist the app and the model?
		if ( this.app.exist && _resource.exist ) {
			_self.modules[moduleId].instance.model = {
				object  : _model,
				resource: _resource,
				set     : function (obj) {
					_model.set (_resource, obj);
					return _self.modules[moduleId].instance;
				},
				send    : function () {
					if ( _.getObjectSize (_model.scope) > 0 )
						return _model.send ();
				},
				get     : function (item) {
					return new Promise (function (resolve, reject) {
						_model.get (_resource).then (function (e) {
							if (
								_.isSet (item)
								&& _.isArray (item)
								&& !_.isEmpty (item)
							) {
								var _result = {};
								_.each (item, function (v, i) {
									if ( v in e.scope )
										_result[v] = e.scope[v];
								});
								//If filter item
								resolve (_result);

							} else {
								//Else all the scope
								resolve (e.scope);
							}
						}).catch (reject);
					});

				}
			}
		}

	});

	/**Prepare Views
	 * @param moduleId
	 * */

	Apps.add ('_views', function (moduleId) {
		// Render view
		var _self = this;
		_self.modules[moduleId].instance.view = {
			render: function (_view) {
				_self._serve (moduleId, _view || null);
				return _self.modules[moduleId].instance;
			}
		};
	});

	/**Prepare Scopes
	 * @param moduleId
	 * */

	Apps.add ('_scopes', function (moduleId) {
		// Render view
		var _self = this;
		_self.modules[moduleId].instance.scope = {
			set: function (nModule, object) {
				var _moduleId = !_.isObject (nModule)
								&& _.isString (nModule) && nModule
								|| moduleId,
					_object = _.isObject (nModule) && nModule
							  || object;

				if ( _.isObject (_object) ) {
					_self.setScope (_moduleId, _object);
					return _self.modules[moduleId].instance;
				}
			},
			get: function (nModule) {
				var _moduleId = _.isString (nModule)
					? nModule : moduleId;

				return _self.getScope (_moduleId);
			}
		};
	});


	/**Prepare Recipes
	 * @param moduleId
	 * */
	Apps.add ('_recipes', function (moduleId) {
		// Render view
		var _self = this;
		_self.modules[moduleId].instance.recipe = {
			$   : _$ ('[sp-recipe="' + moduleId + '"]'),
			get : function (nModule) {
				var _moduleId = _.isString (nModule)
					? nModule : moduleId;

				return _self.getRecipe (_moduleId);
			},
			drop: function (nModule) {
				var _moduleId = _.isString (nModule)
					? nModule : moduleId;

				_self.drop (_moduleId);
				return _self.modules[moduleId].instance;
			}
		};
	});

	/** Render the View
	 * @param moduleId
	 * @param view
	 * @return object
	 */
	Apps.add ('_serve', function (moduleId, view) {
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
					if ( _.isSet (view) && _.isString (view) ) {
						var view_name = view.split ('/').pop (),
							view_dir = _.replace (view, '/' + view_name, _.emptyStr);

						//Require the view if needed
						Require.lookup (['view/' + view_dir]).then (function () {
							if ( view_name in _view.__proto__ )
								_view[view_name] (_, _scope, function (my_html) {
									_dom.html (my_html);
								})
						});

						//Exist inline tpl?
					} else if ( _dom_template.exist ) {
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

			// Initialize module
			_self._add (moduleId);
			_self.modules[moduleId].instance = _self._trigger (moduleId);
			_self.modules[moduleId].instance.name = moduleId;
			_self.modules[moduleId].instance.parent = _self.root;

			// Binding Methods
			// Event handler
			_self.modules[moduleId].instance.when = function (event) {
				return _self.when (event, moduleId);
			};

			// Custom listener for recipe
			_self.modules[moduleId].instance.listen = function (event, delegate) {
				var _recipe = _$ ('[sp-recipe="' + moduleId + '"]');

				return new Promise (function (resolve, reject) {
					if ( _recipe.exist ) {
						_recipe.listen (event, delegate, resolve);
					} else {
						reject (_recipe);
					}
				})
			};

			// Recipes
			_self._recipes (moduleId);

			// Scoping
			_self._scopes (moduleId);

			// Handle Model
			_self._models (moduleId);

			// Handle Views
			_self._views (moduleId);

			// Init the module?
			if (
				'init' in _self.modules[moduleId].instance
				&& _.isFunction (_self.modules[moduleId].instance.init)
			) {

				//Execution
				_self.modules[moduleId].instance.init (this.lib.get (_self.root));

				//After execute
				if ( _.isSet (_self.after) )
					_self.after (this.lib.get (_self.root), moduleId);

			}

			// Bind listeners
			_self._bindListener (moduleId);

			// Observe scope
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
	window.AppClass = Apps;

}) (window);
