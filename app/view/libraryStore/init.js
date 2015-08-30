/**
 * Created by gmena on 01-27-14.
 */

//QUOTE VIEW
Template.add ('bookList', function ( data, callback ) {
	var _self = this;
	_self.get ('library/bookList', function ( template ) {
		if ( _.isSet (callback) ) {
			_self.parse (template, data, callback);
		}
	});
});
