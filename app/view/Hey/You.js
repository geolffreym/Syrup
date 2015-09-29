/**
 * Created by gmena on 01-27-14.
 */

//The view name
View.add ('myView', function (_, data, onReadyCallback) {
	//The template as relative path of config app_path
	//Hey/You in app/templates respects namespace
	this.seekTpl ('Hey/You.html').then (function (view) {
		//view.cleanCache();
		view.render (view.getTpl (), data)
			.then (onReadyCallback);

	});
});