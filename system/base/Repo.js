/**
 * Created by gmena on 07-26-14.
 */
'use strict';
(function (window) {
	function Repo() {}

	//Set registry to bucket
	Repo.add ('set', function (key, data) {
		localStorage.setItem (key, JSON.stringify (data));
	});

	//Get registry from bucket
	Repo.add ('get', function (key) {
		return _.isJson (localStorage.getItem (key)) ?
			JSON.parse (localStorage.getItem (key)) : null;
	});

	//Append data to existing bucket
	Repo.add ('append', function (key, element) {
		var _existent = this.get (key),
			_new = _.extend (_.isSet (_existent) ? _existent : {}, element);

		this.set (key, _new, false);
		return this;
	});

	//Detroy all buckets
	Repo.add ('destroy', function () {
		localStorage.clear ();
	});

	//Clear a bucket
	Repo.add ('clear', function (key) {
		localStorage.removeItem (key);
		return this;
	});

	//Return count buckets
	Repo.add ('count', function () {
		return localStorage.length;
	});

	//Global access
	window.Repo = Repo;

}) (window);
