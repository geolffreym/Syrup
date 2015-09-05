/**
 * Created by gmena on 01-27-14.
 */

//The recipe name is needed
Template.add ('Hey.You', function (data, callback) {
	var _self = this;
	//The template as relative path of config app_path
	_self.get ('Hey/You', function (template) {
		if ( _.isSet (callback) ) {
			_self.parse (template, data, callback);
		}
	});
});
