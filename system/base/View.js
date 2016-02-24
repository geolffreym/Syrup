/**
 * @author Geolffrey Mena <gmjun2000@gmail.com>
 */

(function (window) {
	'use strict';

	/**
	 * Class for View handling.
	 *
	 * @class
	 *
	 */

	function View() {
		this.Repo = new Repo;
		this.key = '___templates';
		this.tpl = null;
	}

	/**Search for the template
	 * @param {string} template
	 * @return {object}
	 */
	View.add ('lookup', function (template) {
		//Http handler!!
		var _http = new Http;

		//MiddleWare
		_http.intercept ({
			request: function (config) {
				config.headers['Content-Type'] = 'text/plain';
			}
		});

		//The template request
		return _http.request (
			setting.app_path + '/templates/' + template
		);
	});

	/**Set the template
	 * @param {string} template
	 * @return {object}
	 * **/
	View.add ('seekTpl', function (template) {
		var _self = this,
			_repo = _self.Repo,
			_template = null, _save = {};

		//Not set templates in repo?
		if ( !_.isSet (_repo.get (_self.key)) ) {
			_repo.set (_self.key, {});
		}

		//Find template in repo
		_template = _repo.get (_self.key);

		return (new Promise (function (resolve, reject) {
			//Is template in repo?
			if ( template in _template ) {
				_self.tpl = _template[template];
				resolve (_self);

			} else {
				//Get the template
				_self.lookup (template).then (function (_tpl) {
					_self.tpl = _save[template] = _tpl;
					_repo.append (_self.key, _save);
					resolve (_self);

				}).catch (function () {
					reject (template);
					_.error (_.WARNING_SYRUP.ERROR.NONETWORK, '(View .seekTpl)');
				});
			}
		}));

	});

	/**Return to render html
	 * @return {string}
	 * **/
	View.add ('getTpl', function () {
		return this.tpl;
	});

	/**Clear View from Repo
	 * @return {object}
	 * **/
	View.add ('clear', function () {
		this.Repo.clear (this.key);
		return this;
	});

	/**Clear template from Repo
	 * @param {string} template
	 * @return {object}
	 * **/
	View.add ('cleanCache', function (template) {
		var old_templates = this.Repo.get (this.key);

		if (
			old_templates &&
			template in old_templates
		) {
			delete old_templates[template];
		}

		//Update repo templates
		this.Repo.set (this.key, old_templates);

		return this;
	});

	/**Render template
	 * @param {string} _template
	 * @param {object} _fields
	 * @return {object}
	 * **/
	View.add ('render', function (_template, _fields) {
		var _self = this,
			_worker = new Workers;

		return (new Promise (function (resolve) {
			_fields = _.isObject (_template) && _template || _fields;
			_template = !_.isObject (_template) && _.isString (_template) && _template || _self.tpl;

			//Interceptor
			_worker.intercept ({
				'message': function (e) {
					resolve (e.data);
				}
			}).run ('/workers/setting/Parser.min').then (function (worker) {
				//Worker running
				worker.toWork ({
					template: _template || _.emptyStr,
					fields: _fields || {}
				});
			});
		}));
	});

	//Global access
	window.View = View;

}) (window);
