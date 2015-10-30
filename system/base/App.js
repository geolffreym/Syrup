/**
 * Created by gmena on 07-31-14.
 */
"use strict";
(function (window) {
	function Apps () {
		this.root = null; // Root name
		this.lib = null; // Lib handler
		this.scope = null; // Global scope

		this.lazy = false; //Lazy execution?
		this.interceptors = {}; //Interceptors
		this.interceptClean = true; // Clan interceptors after execute?

		this.moduleCollection = {}; //Modules
		this.appCollection = {}; //Apps
		this.recipeCollection = {}; // Recipes
		this.onchange = {}; // Change handler
	}

	/** Handle recipeCollection to Apps
	 * @param name
	 * @param dependencies []
	 * @return object
	 * **/
	Apps.add ('module', function (name, dependencies) {
		//No app registered?
		if ( !(name in this.moduleCollection) ) {
			this.moduleCollection[name] = new Apps;
			this.moduleCollection[name].root = name; // Root name
			this.moduleCollection[name].moduled = true; // Flag to handle module app
			this.moduleCollection[name].lib = new LibClass;
			this.moduleCollection[name].lib.blend (name, dependencies)
		}

		//Return the app
		return this.moduleCollection[name];
	});

	/** Blend a method in global Syrup object
	 * @param name
	 * @param dependencies []
	 * @return object
	 * **/
	Apps.add ('blend', function (name, dependencies) {
		var _self = new Apps;

		_self.lib = new LibClass; //
		_self.root = name; // The root app name
		_self.parent = this.moduled && this || null; // Is module root set?
		_self.lazy = this.lazy; // Lazy execution?
		_self.scope = {}; // Main scope
		_self.blended = true; // Flag to handle blended app

		//Is module?
		if ( this.moduled ) {
			//Inherit
			dependencies = dependencies || [];
			dependencies.push (this.root);

			//History
			this.appCollection[name] = _self;
		}

		//Blend the libs
		_self.lib.blend (name, dependencies);

		return _self;
	});

	/** Make a recipe for blend
	 *  @param moduleId string
	 *  @param module function
	 *  @return object
	 * */
	Apps.add ('recipe', function (moduleId, module) {

		//Handled by blend?
		//Not blend, not recipe.. simple!!!
		if ( this.root && this.blended ) {
			if ( _.isSet (module) ) {
				var _self = this;
				_self.recipeCollection[moduleId] = {
					creator : module,
					instance: null
				};

				//Constructor
				//On document ready
				//Not lazy execution?
				if ( !this.lazy )
					_$ (function () {
						_self._taste (moduleId);
					});
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
					_self.onchange[v.name].call (
						_self.recipeCollection[moduleId].instance,
						{
							name  : v.name,
							old   : v.oldValue,
							type  : v.type,
							object: v.object[v.name]
						}
					);
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
		if ( !_.isObject (this.scope[moduleId]) ) {
			this.scope[moduleId] = {};
		}
	});

	/**Trigger code execution
	 * @param moduleId
	 * @return void
	 * **/
	Apps.add ('_trigger', function (moduleId) {
		if ( moduleId in this.recipeCollection )
			return this.recipeCollection[moduleId].creator (_, this.scope);
		return {}
	});

	/**Provide a global initial config
	 * @param moduleId
	 * @return void
	 * **/
	Apps.add ('cook', function (callback) {
		if ( _.isFunction (callback) )
			callback.call (
				this,
				this.lib.get (this.root),
				_
			);
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


	/** Append global services
	 * @param {object} object
	 * @return {void}
	 *
	 * */
	Apps.add ('service', function (object) {
		this.lib.supply (object);
		return this;
	});


	/**Return a recipe by name
	 * @param moduleId
	 * @return object
	 * */
	Apps.add ('_getRecipe', function (moduleId) {
		if ( moduleId in this.recipeCollection && _.isSet (this.root) )
			return this.recipeCollection[moduleId].instance;
		return null;
	});

	/**Set Scope
	 * @param moduleId
	 * @param object
	 * @return void
	 * **/
	Apps.add ('_setScope', function (moduleId, object) {
		if ( moduleId in this.scope ) {
			this.scope[moduleId] = object;
		}
		return this;
	});

	/**Get Scope
	 * @param moduleId
	 * @return object
	 * **/
	Apps.add ('_getScope', function (moduleId) {
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
			}[event] || {
				then: function () {
				}
			})
	});

	/**Bind Listeners
	 * @param moduleId
	 * */
	Apps.add ('_bindListener', function (moduleId) {
		var enabled_events = [
				'click', 'submit',
				'change', 'dblclick',
				'mousedown', 'mouseenter',
				'mouseleave', 'mousemove',
				'mouseover', 'mouseout', 'mouseup',
				'keydown', 'keypress', 'keyup', 'blur',
				'focus', 'input', 'select', 'reset'
			], _self = this, _recipe = this.recipeCollection[moduleId].instance,
			_mod = _$ ('[sp-recipe="' + moduleId + '"]');

		//Exist the module?
		if ( _mod.exist ) {

			//Bind enabled events
			_.each (enabled_events, function (v) {
				//Listen the events
				_mod.listen (v, function (e) {
					var _event = 'sp-' + e.type,
						_attr = e.target.getAttribute (_event);

					//Has sp-'event'?
					if ( _attr ) {
						//Is in recipe?
						if ( _attr in _recipe && _.isFunction (_recipe[_attr]) ) {
							e.preventDefault ();
							_recipe[_attr].call (
								_self.recipeCollection[moduleId].instance,
								_self.lib.get (_self.root), e
							);
						}
					}

				});
			});
		}
	});

	/** Prepare Model
	 * @param moduleId
	 */
	Apps.add ('_models', function (moduleId) {
		var _self = this,
			_model = new Model;

		//Exist the model?
		_self.recipeCollection[moduleId].instance.model = {
			object  : _model,
			resource: function () {
				return _$ ('[sp-recipe="' + moduleId + '"] [sp-model]');
			},
			set     : function (obj) {
				var _resource = this.resource ();
				//Exist resource?
				if ( _resource.exist )
					_model.set (_resource, obj);
				return _self.recipeCollection[moduleId].instance;
			},
			get     : function (item) {
				var _resource = this.resource ();

				//Exist resource?
				if ( _resource.exist ) {
					return {
						then: function (resolve) {
							return _model.get (_resource).then (function (e) {
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

									e.scope = _result;
								}

								// Call the resolve
								resolve.call (
									_self.recipeCollection[moduleId].instance, e
								)
							});
						}
					};
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
		_self.recipeCollection[moduleId].instance.view = {
			render: function (_view, _cache) {
				return _self._serve (moduleId, _view || null, _cache || false)
			}
		}
	});


	/**Prepare Scopes
	 * @param moduleId
	 * */
	Apps.add ('_scopes', function (moduleId) {
		// Render view
		var _self = this;

		_self.recipeCollection[moduleId].instance.scope = {
			global: _self.scope,
			object: _self.scope[moduleId],
			set   : function (nModule, object) {
				var _moduleId = !_.isObject (nModule)
								&& _.isString (nModule) && nModule
								|| moduleId,
					_object = _.isObject (nModule) && nModule
							  || object;

				if ( _.isObject (_object) ) {
					_self._setScope (_moduleId, _object);
					return _self.recipeCollection[moduleId].instance;
				}
			},
			get   : function (nModule) {
				var _moduleId = _.isString (nModule)
					? nModule : moduleId;

				return _self._getScope (_moduleId);
			}
		};
	});

	/**Prepare App
	 * @param moduleId
	 * */
	Apps.add ('_app', function (moduleId) {
		// Render view
		var _self = this;

		_self.recipeCollection[moduleId].instance.app = {
			object: _$ ('[sp-app]'),
			title : function (title) {
				var _title = _$ ('title');
				if ( _title.exist ) {
					_title.text (title)
				}
				return _self.recipeCollection[moduleId].instance;
			}
		};
	});


	/**Prepare Recipes
	 * @param moduleId
	 * */
	Apps.add ('_recipes', function (moduleId) {
		// Render view
		var _self = this;
		_self.recipeCollection[moduleId].instance.recipe = {
			$   : _$ ('[sp-recipe="' + moduleId + '"]'),
			get : function (nModule) {
				var _moduleId = _.isString (nModule)
					? nModule : moduleId;

				return _self._getRecipe (_moduleId);
			},
			drop: function (nModule) {
				var _moduleId = _.isString (nModule)
					? nModule : moduleId;

				_self.drop (_moduleId);
				return _self.recipeCollection[moduleId].instance;
			}
		};
	});

	/** Render the View
	 * @param moduleId
	 * @param view
	 * @return object
	 */
	Apps.add ('_serve', function (moduleId, view, cleanCache) {
		var _view = null,
			_scope = this.scope[moduleId];

		//Find the recipe
		var _dom = _$ ('[sp-recipe="' + moduleId + '"] [sp-view]'),
			_dom_template = _$ ('[sp-recipe="' + moduleId + '"] [sp-tpl]');
		return new Promise (function (resolve) {

			if ( _dom.exist ) { //Exist?

				//The view object
				_view = new View;

				//A view?
				if ( _.isSet (view) && _.isString (view) ) {
					var view_name = view.split ('/').pop (),
						view_dir = _.replace (view, '/' + view_name, _.emptyStr),
						view_template_dir = 'layout/' + view_dir + '/' + view_name;

					//Handle template?
					if ( /\.html$/.test (view_name) ) {

						//Clean cache?
						if ( cleanCache )
							_view.cleanCache (view_template_dir);

						//Seek for tpl
						_view.seekTpl (view_template_dir)
							.then (function (view) {
							view.render (_scope).then (function (res) {
								_dom.html (res);
								resolve (res);
							})
						})
					} else {
						//Handle view?
						//Require the view if needed
						Require.lookup (['view/' + view_dir]).then (function () {
							if ( view_name in _view.__proto__ )
								_view[view_name] (_, _scope, function (my_html) {
									_dom.html (my_html);
									resolve (my_html)
								})
						});
					}

					//Exist inline tpl?
				} else if ( _dom_template.exist ) {
					_view.render (_dom_template.html (), _scope)
						.then (function (result) {
						_dom.html (result);
						resolve (result)
					});
				}
			}
		});

	});

	/** Execute Module
	 *@param moduleId
	 * @return object
	 */
	Apps.add ('_taste', function (moduleId) {
		var _self = this;

		//Handle taste interceptor
		_self._handleInterceptor ('taste', _self);

		//Module registered?
		//Root exists?
		if ( moduleId in _self.recipeCollection
			 && _.isSet (_self.root)
		) {

			// Initialize module
			_self._add (moduleId);

			//Trigger creator
			_self.recipeCollection[moduleId].instance = _self._trigger (moduleId);

			//Not object return by creator?
			//Break!!!
			if ( !_.isObject (_self.recipeCollection[moduleId].instance) )
				return;

			//Recipe Name and Parent name
			_self.recipeCollection[moduleId].instance.name = moduleId;
			_self.recipeCollection[moduleId].instance.parent = _self;

			// Binding Methods
			// Event handler
			_self.recipeCollection[moduleId].instance.when = function (event) {
				return _self.when (event, moduleId);
			};

			// Recipes
			_self._recipes (moduleId);

			// Scoping
			_self._scopes (moduleId);

			// Handle Model
			_self._models (moduleId);

			// Handle App
			_self._app (moduleId);

			// Handle Views
			_self._views (moduleId);

			// Init the module?
			if (
				'init' in _self.recipeCollection[moduleId].instance
				&& _.isFunction (_self.recipeCollection[moduleId].instance.init)
			) {

				//Handle taste interceptor
				_self._handleInterceptor (
					'init', _self.recipeCollection[moduleId].instance
				);

				//Require Libs?
				if (
					'require' in _self.recipeCollection[moduleId].instance
					&& _.isArray (_self.recipeCollection[moduleId].instance.require)
				) {
					//LookUp for libs!!
					Require.lookup (_self.recipeCollection[moduleId].instance.require).then (function (e) {
						//Execution
						_self.lib._dependencies (e.getCleanDependencies ());
						_self.recipeCollection[moduleId].instance.init (
							_self.lib.get (_self.root)
						);
					});
				} else {
					//Execution
					_self.recipeCollection[moduleId].instance.init (
						_self.lib.get (_self.root)
					);
				}

				//Handle taste interceptor
				_self._handleInterceptor (
					'after', _self.recipeCollection[moduleId].instance
				);
			}

			// Bind listeners
			_self._bindListener (moduleId);

			// Observe scope
			_self._watch (moduleId);
		}

		return this;
	});

	/** Execute All or One Module
	 *@param moduleId
	 * @return object
	 */
	Apps.add ('taste', function (moduleId) {
		var _self = this,
			_moduleId = moduleId && [moduleId]
						|| _.getObjectKeys (_self.recipeCollection);

		//Reset lazy exec
		_self.lazy = false;
		//No clean interceptors
		_self.interceptClean = false;

		//Execute!!
		_.each (_moduleId, function (v) {
			_self._taste (v);
		});

		//After execute clean all
		MiddleWare.cleanInterceptor (_self, 'init');

		return this;
	});

	/** Interceptors
	 * @param  {object} interceptors
	 * @return {object}
	 * */
	Apps.add ('intercept', function (interceptors) {
		if ( _.isObject (interceptors) )
			MiddleWare.intercept (this, interceptors);
		return this;
	});


	/** Handle the interceptors
	 * @param {string} type
	 * @param {object} param
	 * @return {void}
	 * */
	Apps.add ('_handleInterceptor', function (type, param) {
		//Trigger Interceptors
		MiddleWare.trigger (
			MiddleWare.getInterceptors (this, type),
			[param, this]
		);

		//Clean the interceptor
		if ( this.interceptClean ) {
			MiddleWare.cleanInterceptor (this, type);
		}
	});


	/**Drop a Module
	 * @param moduleId
	 * @return object
	 * */
	Apps.add ('drop', function (moduleId) {
		if ( moduleId in this.recipeCollection ) {
			if ( this.recipeCollection[moduleId].instance ) {
				if ( 'destroy' in this.recipeCollection[moduleId].instance )
					this.recipeCollection[moduleId].instance.destroy (this.lib.get (this.root));
				this.recipeCollection[moduleId] = null;
			}
		}
		return this;
	});


	/**Drop all Modules
	 * @return object
	 * */
	Apps.add ('dropAll', function () {
		var _self = this;
		_.each (this.recipeCollection, function (module, id) {
			_self.drop (id);
		});
		return this;
	});

//The global object App
	window.App = new Apps;
	window.AppClass = Apps;

})
(window);
