var path = require ('path'),
	env = require ('./app/config/init');

module.exports = {
	entry  : path.join (__dirname, './app/config/' + env.setting.env + '/init.js'),
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
};