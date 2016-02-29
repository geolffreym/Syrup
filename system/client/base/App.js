/**
 * Created by gmena on 07-31-14.
 * Interceptor : ['init', 'taste', 'after']
 */
'use strict';
(function (window) {
	function Apps() {
		this.root = null; // Root name
		this.lib = null; // Lib handler
		this.scope = null; // Global scope
		
		this.lazy = false; //Lazy execution?
		this.interceptors = {}; //Interceptors
		// this.interceptClean = true; // Clan interceptors after execute?
		
		this.moduleCollection = {}; //Modules
		this.appCollection = {}; //Apps
		this.recipeCollection = {}; // Recipes
		this.onchange = {}; // Change handler
	}
	
	/** Handle recipeCollection to Apps
	    	 * @param {string} name
	    	 * @param {array} dependencies
	    	 * @return {object}
	    	 * **/
	Apps.add ('module', function (name, dependencies) {
		//No app registered?
		if ( !(name in this.moduleCollection) ) {
			this.moduleCollection[name] = new Apps;
			this.moduleCollection[name].root = name; // Root name
			this.moduleCollection[name].moduled = true; // Flag to handle module app
			this.moduleCollection[name].lib = new LibClass;
			this.moduleCollection[name].lib.blend (name, dependencies);
		}
		
		//Return the app
		return this.moduleCollection[name];
	});
	
	/** Blend a method in global Syrup object
	    	 * @param {string} name
	    	 * @param {array} dependencies
	    	 * @return {object}
	    	 * **/
	Apps.add ('blend', function (name, dependencies) {
		var _this = new Apps;
		
		_this.lib = new LibClass; //
		_this.root = name; // The root app name
		_this.parent = this.moduled && this || null; // Is module root set?
		_this.lazy = this.lazy; // Lazy execution?
		_this.scope = {}; // Main scope
		_this.blended = true; // Flag to handle blended app
		
		//Is module?
		if ( this.moduled ) {
			//Inherit
			dependencies = dependencies || [];
			dependencies.push (this.root);
			
			//History
			this.appCollection[name] = _this;
		}
		
		//Blend the libs
		_this.lib.blend (name, dependencies);
		
		//Provide lib with tools
		_this.lib.provider (name, function () {
			return _this;
		});
		
		return _this;
	});
	
	/** Make a recipe for blend
	    	 *  @param {string} moduleId
	    	 *  @param {function} module
	    	 *  @return {object}
	    	 * */
	Apps.add ('recipe', function (moduleId, module) {
		
		//Handled by blend?
		//Not blend, not recipe.. simple!!!
		if ( this.root && this.blended ) {
			if ( _.isSet (module) ) {
				var _this = this;
				_this.recipeCollection[moduleId] = {
					creator: module,
					instance: null
				};
				
				//Constructor
				//On document ready
				//Not lazy execution?
				if ( !this.lazy )
					_$ (function () {
						_this._taste (moduleId);
					});
			}
		}
		return this;
	});
	
	/**Object Observer
	    	 * @param {string} moduleId
	    	 * @return {void}
	    	 * **/
	Apps.add ('_watch', function (moduleId) {
		var _this = this;
		Object.observe (_this.scope, function (change) {
			_.each (change, function (v, i) {
				if ( (v.name in _this.onchange) &&
				_.getObjectSize (v.object) > 0 &&
				moduleId === v.name
				) {
					//Break the loop
					this.break = true;
					
					//Event trigger!!
					_this.onchange[v.name].call (
					_this.recipeCollection[moduleId].instance,
						{
							name: v.name,
							old: v.oldValue,
							type: v.type,
							object: v.object[v.name]
						}
					);
				}
			});
		});
		
	});
	
	/**Add new child module
	    	 * @param {string} moduleId
	    	 * @return {void}
	    	 * **/
	Apps.add ('_add', function (moduleId) {
		if ( !_.isObject (this.scope[moduleId]) ) {
			this.scope[moduleId] = {};
		}
	});
	
	/**Trigger code execution
	    	 * @param {string} moduleId
	    	 * @return {object}
	    	 * **/
	Apps.add ('_trigger', function (moduleId) {
		if ( moduleId in this.recipeCollection )
		return this.recipeCollection[moduleId].creator (_, this.scope);
	});
	
	/**Provide a global initial config
	    	 * @param {string} moduleId
	    	 * @return {object}
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
	    	 * @param {object} moduleList
	    	 * @return {object} */
	Apps.add ('spice', function (object) {
		if ( _.isObject (object) )
		this.lib.make (object);
		return this;
	});
	
	/** Append global object provider
	    	 * @param {name} string
	    	 * @param {function} callback
	    	 * @return {object}
	    	 *
	    	 * */
	Apps.add ('provider', function (name, callback) {
		//Self
		var _this = this;
		
		//Service supplier
		if ( _.isObject (name) ) {
			_.each (name, function (v, i) {
				_this.lib.provider (i, v);
			});
		}
		
		//Cook service
		if ( _.isString (name) && _.isFunction (callback) ) {
			_this.lib.provider (name, callback);
		}
		
		return _this;
	});
	
	/** Append global service object
	    	 * @param {string} name
	    	 * @param {function} callback
	    	 * @return {object}
	    	 *
	    	 * */
	Apps.add ('service', function (name, callback) {
		//Service supplier
		if ( _.isObject (name) ) {
			this.lib.supply (name);
		}
		
		//Cook service
		if ( _.isString (name) && _.isFunction (callback) ) {
			this.lib.cook (name, callback);
		}
		
		return this;
	});
	
	/**Return a recipe by name
	    	 * @param {string} moduleId
	    	 * @param {object} object
	    	 * @return {object}
	    	 * */
	Apps.add ('getRecipe', function (moduleId) {
		if ( moduleId in this.recipeCollection && _.isSet (this.root) )
		return this.recipeCollection[moduleId].instance;
		return null;
	});
	
	/**Set Scope
	    	 * @param {string} moduleId
	    	 * @param {object} object
	    	 * @return {object}
	    	 * **/
	Apps.add ('setScope', function (moduleId, object) {
		if ( moduleId in this.scope ) {
			this.scope[moduleId] = object;
		}
		return this;
	});
	
	/**Get Scope
	    	 * @param {string} moduleId
	    	 * @return {object}
	    	 * **/
	Apps.add ('getScope', function (moduleId) {
		if ( moduleId in this.scope ) {
			return this.scope[moduleId];
		}
		return {};
	});
	
	/**Event handler
	    	 * @param {string} event
	    	 * @param {string} name
	    	 * @param {function} resolve
	    	 * @return {object}
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
			});
	});
	
	/**Bind Listeners
	    	 * @param {string} moduleId
	    	 * @return {void}
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
		], _this = this, _recipe = this.recipeCollection[moduleId].instance,
		_mod = _$ ('[sp-recipe="' + moduleId + '"]');
		
		//Exist the module?
		if ( _mod.exist ) {
			//Bind enabled events
			_.each (enabled_events, function (v) {
				//Listen the events
				_mod.listen (v, function (e) {
					var _event = 'sp-' + e.type,
					_dom = null, _attr = e.target.getAttribute (_event);
					
					//Has sp-'event'?
					if ( _attr ) {
						//Is in recipe?
						if ( _attr in _recipe && _.isFunction (_recipe[_attr]) ) {
							//No prevent to keyboard
							if ( !(/key/.test (e.type)) )
							e.preventDefault ();
							
							//Object
							_dom = _$ (this);
							_dom.event = e;
							
							//Call method
							_recipe[_attr].call (
							_this.recipeCollection[moduleId].instance,
							_this.lib.get (_recipe.parent.root), _dom
							);
						}
					}
					
				});
			});
		}
	});
	
	/** Prepare Model
	    	 * @param {string} moduleId
	    	 * @return {void}
	    	 */
	Apps.add ('_models', function (moduleId) {
		//Self and Model Object
		var _this = this,
		_model = new Model;
		
		//The model Object?
		_this.recipeCollection[moduleId].instance.model = {
			object: _model,
			resource: function (_model) {
				return _$ ('[sp-recipe="' + moduleId + '"] ' +
				((_model && '[sp-model="' + _model + '"]') || '[sp-model]'));
			},
			set: function (obj, _res) {
				//Resource model
				var _resource = _.is$ (_res) && _res || this.resource (_res);
				
				//Exist resource?
				if ( _resource.exist )
				_model.set (_resource, obj);
				
				//Return object reference
				return _this.recipeCollection[moduleId].instance;
			},
			get: function (item, _res) {
				//Resource model
				var _resource = _.is$ (_res) && _res || this.resource (_res);
				
				//Exist resource?
				if ( _resource.exist ) {
					
					//Return object reference
					return {
						then: function (resolve) {
							return _model.get (_resource).then (function (e) {
								if (
								_.isSet (item) &&
								_.isArray (item) &&
								!_.isEmpty (item)
								) {
									var _result = {};
									_.each (item, function (v, i) {
										if ( v in e.scope )
										_result[v] = e.scope[v];
									});
									
									//Scope
									e.scope = _result;
								}
								
								// Call the resolve
								resolve.call (
								_this.recipeCollection[moduleId].instance, e
								);
							});
						}
					};
				}
				//Not resource
				//Do nothing!!
				return { then: function () {} };
			}
		};
	});
	
	/**Prepare Views
	    	 * @param {string} moduleId
	    	 * @return {void}
	    	 * */
	Apps.add ('_views', function (moduleId) {
		// Render view
		var _this = this;
		
		//The view object
		_this.recipeCollection[moduleId].instance.view = {
			render: function (_view, _cache) {
				//Rend
				var _rend = _this._serve (
				moduleId, _view || null,
				_cache || false
				);
				//Async
				return {
					then: function (resolve) {
						return _rend.then (function (m) {
							// Call the resolve
							resolve.call (
							_this.recipeCollection[moduleId].instance, m
							);
						});
					}
				};
			}
		};
	});
	
	/**Prepare Scopes
	    	 * @param {string} moduleId
	    	 * @return {void}
	    	 * */
	Apps.add ('_scopes', function (moduleId) {
		// Self
		var _this = this;
		
		//The scope object
		_this.recipeCollection[moduleId].instance.scope = {
			global: _this.scope, object: _this.scope[moduleId],
			set: function (nModule, object) {
				var _moduleId = !_.isObject (nModule) &&
				_.isString (nModule) && nModule ||
				moduleId,
				_object = _.isObject (nModule) && nModule ||
				object;
				
				if ( _.isObject (_object) ) {
					_this.setScope (_moduleId, _object);
					return _this.recipeCollection[moduleId].instance;
				}
			},
			get: function (nModule) {
				var _moduleId = _.isString (nModule) ?
				nModule : moduleId;
				
				return _this.getScope (_moduleId);
			}
		};
	});
	
	/**Prepare App
	    	 * @param {string} moduleId
	    	 * @return {void}
	    	 * */
	Apps.add ('_app', function (moduleId) {
		// Self
		var _this = this;
		
		//The app object
		_this.recipeCollection[moduleId].instance.app = {
			window: window, $: _$, object: _$ ('[sp-app]'),
			title: function (title) {
				var _title = _$ ('title');
				if ( _title.exist ) {
					_title.text (title);
				}
				return _this.recipeCollection[moduleId].instance;
			}
		};
	});
	
	/**Prepare Recipes
	    	 * @param {string} moduleId
	    	 * @return {void}
	    	 * */
	Apps.add ('_recipes', function (moduleId) {
		// Self
		var _this = this;
		
		//The recipe object
		_this.recipeCollection[moduleId].instance.recipe = {
			$: _$ ('[sp-recipe="' + moduleId + '"]'),
			node: function (node) {
				return _$ ('[sp-recipe="' + moduleId + '"] [sp-node=' + node + ']');
			},
			get: function (nModule) {
				var _moduleId = _.isString (nModule) ?
				nModule : moduleId;
				
				return _this.getRecipe (_moduleId);
			},
			drop: function (nModule) {
				var _moduleId = _.isString (nModule) ?
				nModule : moduleId;
				
				_this.drop (_moduleId);
				return _this.recipeCollection[moduleId].instance;
			}
		};
	});
	
	/** Render the View
	    	 * @param {string} moduleId
	    	 * @param {string} view
	    	 * @param {bool} cleanCache
	    	 * @return {object}
	    	 */
	Apps.add ('_serve', function (moduleId, view, cleanCache) {
		var _view = null,
		_scope = this.scope[moduleId];
		
		//Find the recipe
		var _dom = _$ ('[sp-recipe="' + moduleId + '"] [sp-view]'),
		_dom_template = _$ ('[sp-recipe="' + moduleId + '"] [sp-tpl]');
		
		//The render
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
								});
							});
					} else {
						//Handle view?
						//Require the view if needed
						Require.lookup (['view/' + view_dir]).then (function () {
							if ( view_name in _view.__proto__ )
								_view[view_name] (_, _scope, function (my_html) {
									_dom.html (my_html);
									resolve (my_html);
								});
						});
					}
					
					//Exist inline tpl?
				} else if ( _dom_template.exist ) {
					_view.render (_dom_template.html (), _scope).then (function (result) {
						_dom.html (result);
						resolve (result);
					});
				}
			}
		});
		
	});
	
	/** Execute Module
	    	 * @param {string} moduleId
	    	 * @return {object}
	    	 */
	Apps.add ('_taste', function (moduleId) {
		var _this = this;
		
		//Handle taste interceptor
		_this._handleInterceptor ('taste', _this);
		
		//Module registered?
		//Root exists?
		if ( moduleId in _this.recipeCollection &&
		_.isSet (_this.root)
		) {
			
			// Initialize module in scope
			_this._add (moduleId);
			
			//Trigger creator
			_this.recipeCollection[moduleId].instance = _this._trigger (moduleId);
			
			//Not object return by creator?
			//Break!!!
			if ( !_.isObject (_this.recipeCollection[moduleId].instance) )
			return;
			
			//Recipe Name and Parent name
			_this.recipeCollection[moduleId].instance.name = moduleId;
			_this.recipeCollection[moduleId].instance.parent = _this;
			
			// Binding Methods
			// Event handler
			_this.recipeCollection[moduleId].instance.when = function (event) {
				return _this.when (event, moduleId);
			};
			
			// Recipes
			_this._recipes (moduleId);
			
			// Scoping
			_this._scopes (moduleId);
			
			// Handle Model
			_this._models (moduleId);
			
			// Handle App
			_this._app (moduleId);
			
			// Handle Views
			_this._views (moduleId);
			
			// Init the module?
			if (
			'init' in _this.recipeCollection[moduleId].instance &&
			_.isFunction (_this.recipeCollection[moduleId].instance.init)
			) {
				
				//Handle taste interceptor
				_this._handleInterceptor (
				'init', _this.recipeCollection[moduleId].instance
				);
				
				//Require Libs?
				if (
				'require' in _this.recipeCollection[moduleId].instance &&
				_.isArray (_this.recipeCollection[moduleId].instance.require)
				) {
					//LookUp for libs!!
					Require.lookup (_this.recipeCollection[moduleId].instance.require).then (function (e) {
						//Execution
						_this.lib._dependencies (e.getCleanDependencies ());
						_this.recipeCollection[moduleId].instance.init (
						_this.lib.get (_this.root)
						);
					});
				} else {
					//Execution
					_this.recipeCollection[moduleId].instance.init (
					_this.lib.get (_this.root)
					);
				}
				
				//Handle taste interceptor
				_this._handleInterceptor (
				'after', _this.recipeCollection[moduleId].instance
				);
			}
			
			// Bind listeners
			_this._bindListener (moduleId);
			
			// Observe scope
			_this._watch (moduleId);
		}
		
		return this;
	});
	
	/** Execute All or One Module
	    	 * @param {string} moduleId
	    	 * @return {object}
	    	 */
	Apps.add ('taste', function (moduleId) {
		var _this = this,
		_moduleId = moduleId && [moduleId] ||
		_.getObjectKeys (_this.recipeCollection);
		
		//Reset lazy exec
		_this.lazy = false;
		//No clean interceptors
		//_this.interceptClean = false;
		
		//Execute!!
		_.each (_moduleId, function (v) {
			_this._taste (v);
		});
		
		//After execute clean all
		MiddleWare.cleanInterceptor (_this, 'init');
		
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
	
	/** Clean Interceptors
	    	 * @param  {string} type
	    	 * @return {object}
	    	 * */
	Apps.add ('interceptClean', function (type) {
		//Clean the interceptor
		MiddleWare.cleanInterceptor (this, type);
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
		
		////Clean the interceptor
		//if (this.interceptClean) {
		//    MiddleWare.cleanInterceptor(this, type);
		//}
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
		var _this = this;
		_.each (this.recipeCollection, function (module, id) {
			_this.drop (id);
		});
		return this;
	});
	
	//The global object App
	window.App = new Apps;
	window.AppClass = Apps;
	
})
(window);
