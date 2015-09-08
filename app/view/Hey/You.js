/**
 * Created by gmena on 01-27-14.
 */

//The recipe name is needed
View.add ('Hey.You', function (data, callback) {
	//The template as relative path of config app_path
	//Hey/You in app/templates respects namespace
	this.getTpl ('Hey/You').then (function (view) {
		if ( _.isSet (callback) ) {
			view.parse (view.tpl, data).then (callback);
		}
	});
});
