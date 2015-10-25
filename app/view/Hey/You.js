/**
 * Created by gmena on 01-27-14.
 */

//The view name
View.add ('myView', function (_, scope, onReadyCallback) {
	//The template as relative path of config app_path
	//Hey/You in app/templates respects namespace

	this.clear();
	this.seekTpl ('layout/Hey/You.html').then (function (view) {

		view.render (scope)
			.then (onReadyCallback);

	});
});