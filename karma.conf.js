var TRAVIS_WITHOUT_BS = process.env.TRAVIS_SECURE_ENV_VARS === 'false';

var launchers = {
    bs_chrome: {
        base: 'BrowserStack',
        browser: 'chrome',
        os: 'Windows',
        os_version: '10'
    },
    bs_firefox: {
        base: 'BrowserStack',
        browser: 'firefox',
        os: 'Windows',
        os_version: '10'
    },
    bs_safari: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '9.0',
        os_version: 'El Capitan',
        os: 'OS X'
    },
    bs_ie_11: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '10'
    },
    bs_ie_10: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '10.0',
        os: 'Windows',
        os_version: '8'
    },
    bs_ie_9: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '9.0',
        os: 'Windows',
        os_version: '7'
    }
    // TODO: Figure out why these fail on browserstack
    // ,
    // bs_ie_8: {
    //   base: 'BrowserStack',
    //   browser: 'ie',
    //   browser_version: '8.0',
    //   os: 'Windows',
    //   os_version: '7'
    // },
    // bs_ie_7: {
    //   base: 'BrowserStack',
    //   browser: 'ie',
    //   browser_version: '7.0',
    //   os: 'Windows',
    //   os_version: 'XP'
    // }
};

var browsers = [
    'PhantomJS',
    'Chrome',
    'Firefox'
];

module.exports = function (config) {
    config.set({
        // Base path, that will be used to resolve files and exclude
        basePath: './test/',
        
        frameworks: ['jasmine'],
        
        // List of files / patterns to load in the browser
        files: [
            'core/test_syrup_main.js'
        ],
        
        // List of files to exclude
        exclude: [],
        
        preprocessors: {
            'core/*.js': ['webpack', 'sourcemap']
        },
        
        webpack: {
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
            }
        },
        
        // Use dots reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress'
        // CLI --reporters progress
        reporters: ['progress', 'junit'],
        
        junitReporter: {
            // Will be resolved to basePath (in the same way as files/exclude patterns)
            outputFile: 'test-results.xml'
        },
        
        // Web server port
        // CLI --port 9876
        port: 9876,
        
        // Enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors: true,
        
        // Level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // CLI --log-level debug
        logLevel: config.LOG_INFO,
        
        // Enable / disable watching file and executing tests whenever any file changes
        // CLI --auto-watch --no-auto-watch
        autoWatch: true,
        
        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        browsers: browsers,
        
        customLaunchers: launchers,
        
        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 5000
        captureTimeout: 50000,
        
        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun: false,
        
        // Report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500,
        
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-junit-reporter',
            'karma-phantomjs-launcher',
            'karma-firefox-launcher'
        ],
        
        concurrency: 3,
        
        forceJSONP: true,
        
        browserStack: {
            project: 'Karma'
        }
    });
};
