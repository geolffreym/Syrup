var path = require ('path'),
	env = require ('./app/config/init'),
	requires = require ('./app/config/' + env.setting.env + '/init');

//Fix dirs!!
for ( var x in requires.files.js.src ) {
	requires.files.js.src[x] = path.join (__dirname, requires.files.js.src[x]);
}

//Build
module.exports = {
	entry  : requires.files.js.src,
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