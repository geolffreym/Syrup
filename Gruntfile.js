/**
 * Created by gmena on 01-05-16.
 */
var path = require('path');

module.exports = function (grunt) {
    
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-jscs');
    
    // Project configuration.
    grunt.initConfig({
        webpack: {
            syrup: {
                entry: './system/server/init.js',
                output: {
                    path: path.join(__dirname, './dist'),
                    filename: 'init.js', // Or [name]
                    publicPath: '/'
                },
                stats: {
                    // Configure the console output
                    colors: true,
                    modules: true,
                    reasons: true
                },
                // Stats: false disables the stats output
                
                watch: true, // Use webpacks watcher
                // You need to keep the grunt process alive
                
                keepalive: true, // Don't finish the grunt task
                // Use this in combination with the watch option
                
                failOnError: false, // Don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue
                
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
            }
        },
        jscs: {
            src: './system/*/*.js',
            options: {
                config: '.jscsrc',
                esnext: true, // If you use ES6 http://jscs.info/overview.html#esnext
                verbose: true, // If you need output with rule names http://jscs.info/overview.html#verbose
                fix: true // Autofix code style violations when possible.
            }
        }
    });
    
    // Default task(s).
    grunt.registerTask('default', [
        'webpack'
    ]);
    
};
