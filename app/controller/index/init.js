//The controller
_$ (function () {

	//The Module with Http dependencie
	var my_Lib = App.blend ('Hey', ['Http', 'Form']);

	//A global service
	my_Lib.service ('myConsole', function (msg) {
		console.log (msg)
	});

	//The modules, templates, events, view are encapsulated in recipes
	//Recipes are declared as sp-recipe and is associated with the recipe's name

	//A new recipe for Hey
	my_Lib.recipe ('Hey.You', function (_, _$, scope) {
		return {
			init        : function ($) {
				var _self = this;


				//$ has dependencies object
				// $ = {Http: AjaxObject}

				//The context in template as scope
				this.setScope ({
					'beatles': [
						{ "firstName": "John", "lastName": "Lennon" },
						{ "firstName": "Paul", "lastName": "McCartney" },
						{ "firstName": "George", "lastName": "Harrison" },
						{ "firstName": "Ringo", "lastName": "Starr" }
					]
				}).serve ();


				//When Hey.You scope change
				this.when ('change', function (changes) {

					//Render new data using the inline template
					//If not serve param is set, template inline is used
					//Else if you set "Hey/You" "/app/view/Hey/You.js" view is used
					//_self.serve ('Hey/You');
					_self.serve ();

					// The global service in tools
					$.myConsole ('Done');
				})
			},
			process_form: function (e, $) {
				e.preventDefault ();
				console.log ($.Form)
			},
			destroy     : function ($) {
				alert ('destroyed?')
			}
		}
	});

	//A new recipe for Hey
	my_Lib.recipe ('Hey.Do', function (_, _$, scope) {
		return {
			init   : function (tools) {

			},
			method : function (e, $) {
				my_Lib.setScope ('Hey.You', {
					'beatles': [
						{ "firstName": "John", "lastName": "Lennon" },
					]
				});
//
//                    my_Lib.when ('drop', 'Hey.You', function () {
//                        console.log ('you are dead Hey.You');
//                    });

				// my_Lib.drop ('Hey.You');
			},
			destroy: function () {}
		}
	});


})