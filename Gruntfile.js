'use strict';

module.exports = function(grunt) {

    var mountFolder = function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    var getConcatBanner = function() {
        return '/* global module, require */ \n' +
            '/* jshint node: true */\n' +
            '\'use strict\'; \n \n' +
            '(function(root,factory){ \n \n';
    };

    var getConcatFooter = function() {
        return '\n \n })();';
    };

    var path = require('path');

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        execute: {
            nodeapp: {
                target: {
                    src: ['examples/nodeapp/main.js']
                }
            }
        },
        open: {
            webapp: {
                path: 'http://localhost:9000',
                app: 'google-chrome'
            },
            test: {
                path: 'http://localhost:8000',
                app: 'google-chrome'
            }
        },
        connect: {
            webserver: {
                options: {
                    port: 9000,
                    hostname: '0.0.0.0',
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, 'examples/webapp/'),
                            mountFolder(connect, 'dist/'),
                            mountFolder(connect, 'bower_components/'),
                            mountFolder(connect, 'vendor/')
                        ];
                    },
                    livereload: 35729
                }
            },
            'test_webserver': {
                options: {
                    port: 8000,
                    hostname: '0.0.0.0',
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, 'test/browser/'),
                            mountFolder(connect, 'dist/'),
                            mountFolder(connect, 'bower_components/'),
                            mountFolder(connect, 'vendor/')
                        ];
                    }
                }

            }
        },
        watch: {
            silkroad: {
                files: ['src/**/*']
            },
            webapp: {
                files: [
                    'examples/webapp/**/*',
                    'src/**/*'
                ],
                options: {
                    livereload: 35729
                }
            },
            nodeapp: {
                files: [
                    'examples/nodeapp/**'
                ]
            },
            test: {
                files: [
                    'test/browser/**',
                    'src/**/*'
                ],
                tasks: ['build']
            }
        },
        express: {
            load: {
                options: {
                    port: 3000,
                    server: path.resolve('./examples/express/express')
                }
            }
        },
        mochaTest: { //test for nodejs app with mocha
            tap: {
                options: {
                    reporter: 'tap',
                    captureFile: 'target/node/test_results.dirty.tap', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/node/**/*.js']
            },
            noreporter: {
                src: ['test/node/**/*.js']
            },
        }, //test for browser app with mocha and phanthom
        'mocha_phantomjs': {
            options: {
                urls: [
                    'http://localhost:8000' /*<%= connect.options.port %>*/
                ],
                setting: [
                    'webSecurityEnabled=false',
                    'remote-debugger-autorun=true',
                    'remote-debugger-port=9002',
                    'ignore-ssl-errors=true'
                ]
            },
            noreporter: {

            },
            tap: {
                options: {
                    reporter: 'tap',
                    output: 'target/browser/test_results.dirty.tap'
                }
            }
        },
        lineremover: {
            tap: {
                options: {
                    inclusionPattern: /^(((not )?ok \d)|# \w+ \d|\d..\d).*$/gm
                },
                files: [{
                    expand: true,
                    cwd: 'target',
                    src: [
                        '**/*.dirty.tap'
                    ],
                    dest: 'target/',
                    ext: '.tap'
                }]
            }
        },
        useminPrepare: {
            html: 'src/index.html',
            options: {
                flow: {
                    html: {
                        steps: {
                            js: ['concat']
                        },
                        post: {},
                        dest: 'dist/'
                    }
                }
            }
        },
        preprocess: {
            main: {
                src: 'src/build/main.js',
                dest: 'dist/silkroad.js'
            }
        }
    });

    grunt.loadTasks('tasks');


    grunt.registerTask('server:webapp', ['express:load', 'execute:nodeapp', 'connect:webserver', 'open:webapp', 'watch:webapp']);

    grunt.registerTask('server:nodeapp', ['express:load', 'execute:nodeapp', 'watch:nodeapp']);

    grunt.registerTask('test', ['test:browser', 'test:node']);

    grunt.registerTask('test:browser', ['express:load', 'connect:test_webserver', 'mocha_phantomjs:tap', 'lineremover:tap']);

    grunt.registerTask('test:node', ['express:load', 'mochaTest:tap', 'lineremover:tap']);

    grunt.registerTask('server:test', ['test:browser', 'open:test', 'watch:test']);

    grunt.registerTask('test:tap', ['express:load', 'connect:test_webserver', 'mocha_phantomjs:noreporter', 'mochaTest:noreporter', 'lineremover:tap']);



    grunt.registerTask('build', ['preprocess:main']);

};