/**
 * Created by Geolffrey on 31/12/13.
 */

_$ (function () {

	//The Module with Ajax dependencie
	var my_Lib = Module.blend ('Hey', ['Ajax']);

	//A global service
	my_Lib.service ('myConsole', function (msg) {
		console.log (msg)
	});

	//A new recipe for Hey
	my_Lib.recipe ('Hey.You', function (_, _$, scope) {
		return {
			init   : function (tools) {
				var _self = this;

				//tools has dependencies object
				// tools = {Ajax: AjaxObject}

				//The context in template as scope
				this.setScope ({
					'beatles': [
						{ "firstName": "John", "lastName": "Lennon" },
						{ "firstName": "Paul", "lastName": "McCartney" },
						{ "firstName": "George", "lastName": "Harrison" },
						{ "firstName": "Ringo", "lastName": "Starr" }
					]
				});


				//When Hey.You scope change
				this.when ('change', function (d) {

					//Render new data using the inline template
					//If "Hey.You" is not set, the view is needed app/view/Hey/You.js
					//The view's directory, respects namespace
					_self.serve ('Hey.You');

					// The global service
					_self.myConsole ('Done');
				})
			},
			destroy: function () {
				alert ('destroyed?')
			}
		}
	});

	//A new recipe for Hey
	my_Lib.recipe ('Hey.Do', function (_, _$, scope) {
		return {
			init   : function (tools) {

				_$ ('#click').listen ('click', function () {

					//Trigger change in Hey.You
					//Set scope to Hey.You
					my_Lib.setScope ('Hey.You', {
						'beatles': [
							{ "firstName": "Pedro", "lastName": "Lennon" }
						]
					});

					// OnDrop the recipe
					my_Lib.when ('drop', 'Hey.You', function () {
						console.log ('you are dead Hey.You');
					});

					// Drop the recipe
					my_Lib.drop ('Hey.You');
				});

			},
			destroy: function () {}
		}
	});


})