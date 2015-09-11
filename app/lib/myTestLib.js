/**
 * Created by gmena on 09-11-15.
 */

////Encapsulate
(function (libObj) {

	//Return Lib reference
	var myTestLib = libObj.blend ('myTestLib', []);

	//Provide attributes
	myTestLib.make ({ a: 0 });

	//Provide methods
	myTestLib.supply ({
		myFunc: function () {
			"use strict";
			alert (this.a);
		}
	});

}) (Lib);
