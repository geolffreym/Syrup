/**
 * Created by gmena on 01-05-16.
 */
var path = require ('path');

module.exports = function (grunt) {
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks ('grunt-webpack');

	// Project configuration.
	grunt.initConfig ({
		webpack: {
			entry  : './system/include/init.js',
			output : {
				path      : path.join (__dirname, './dist'),
				filename  : 'init.js', // or [name]
				publicPath: '/'
			},
			module : {
				loaders: [
					{
						test   : /\.js?$/,
						exclude: /node_modules/,
						loader : 'babel-loader',
						query  : {
							presets: [
								'es2015'
							]
						}
					}
				]
			},
			resolve: {
				modulesDirectories: [
					'node_modules'
				]
			}
		}
	});


	// Default task(s).
	grunt.registerTask ('default', ['webpack']);

};