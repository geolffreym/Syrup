var path = require ('path');

//Build
module.exports = {
	entry: [
		'./system/include/init.js'
	],
	output: {
		path: path.join (__dirname, './dist'),
		filename: 'init.js', // Or [name]
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
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
