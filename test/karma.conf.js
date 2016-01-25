// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-10-22 using
// generator-karma 0.8.3

module.exports = function(config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['mocha-debug', 'mocha', 'chai', 'chai-as-promised', 'sinon'],

        // list of files / patterns to load in the browser
        files: [
            'dist/corbel.with-polyfills.js',
           '.tmp/test/browser/**/*.js',
            'bower_components/',
            'vendor/'
        ],

        // list of files / patterns to exclude
        exclude: ['express/server.js'],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-mocha-debug',
            'karma-mocha-reporter',
            'karma-chai-plugins',
            'karma-sinon',
            'karma-tap-reporter'
        ],
        phantomjsLauncher: {
            flags: [
                '--web-security=no',
                '--ignore-ssl-errors=no'
            ]
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        browserNoActivityTimeout: 95000,

        client: {
            mocha: {
                reporter: 'html' // change Karma's debug.html to the mocha web reporter
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['tap', 'mocha'],

        tapReporter: {
          outputFile: '.report/report.tap'
        },

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
