'use strict';

module.exports = function(grunt) {

    var mountFolder = function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    var path = require('path');

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                // 'src/{,**/}*.js',
                'test/{,**/}*.js',
                'examples/{,**/}*.js'
            ]
        },
        execute: {
            nodeapp: {
                src: ['examples/nodeapp/main.js']
            }
        },
        exec: {
            test: 'npm run test'
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
        'node-inspector': {
            options: {
                'web-port': 3000,
                'web-host': 'localhost',
                'debug-port': 5857,
                'node-debug': true,
                'save-live-edit': true,
                'no-preload': true,
                'stack-trace-limit': 4,
                'hidden': ['node_modules']
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
                    },
                    livereload: 35729
                }

            }
        },
        watch: {
            corbel: {
                files: ['src/**/*']
            },
            webapp: {
                files: [
                    'examples/webapp/**/*',
                    'src/**/*'
                ],
                tasks: ['dist'],
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
                tasks: ['dist', 'test:browser:reload'],
                options: {
                    livereload: 35729
                }
            },
            'test-node': {
                files: [
                    'test/browser/**',
                    'src/**/*'
                ],
                tasks: ['dist', 'test:node:reload'],
                options: {
                    livereload: 35729
                }
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
                    quiet: false // Optionally suppress output to standard out (defaults to false)
                },
                src: ['test/node/**/*.js']
            },
            noreporter: {
                src: ['test/node/**/*.js']
            }
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
            noreporter: {},
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
                dest: 'dist/corbel.js'
            },
            bundle: {
                src: 'src/build/bundle.js',
                dest: 'dist/corbel-bundle.js'
            },
            'test-browser': {
                src: 'test/browser/test-suite-pre.js',
                dest: 'test/browser/test-suite.js'
            }
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('server:webapp', ['dist', 'express:load', 'execute:nodeapp', 'connect:webserver', 'open:webapp', 'watch:webapp']);

    grunt.registerTask('server:webapp:debug', ['dist', 'execute:nodeapp', 'connect:webserver', 'open:webapp', 'watch:webapp']);

    grunt.registerTask('server:nodeapp', ['express:load', 'execute:nodeapp', 'watch:nodeapp']);

    grunt.registerTask('test', ['test:browser', 'test:node']);

    grunt.registerTask('test:browser', ['preprocess:test-browser', 'express:load', 'connect:test_webserver', 'mocha_phantomjs:noreporter']);

    grunt.registerTask('test:browser:reload', ['preprocess:test-browser', 'express:load', 'mocha_phantomjs:noreporter']); //mocha_phantomjs:tap, 'lineremover:tap'

    grunt.registerTask('test:node:reload', ['express:load', 'mocha_phantomjs:noreporter']); //mocha_phantomjs:tap, 'lineremover:tap'

    grunt.registerTask('test:node', ['express:load', 'mochaTest:noreporter']); //'mochaTest:tap', 'lineremover:tap'

    grunt.registerTask('server:test', ['test:browser', 'open:test', 'watch:test']);

    grunt.registerTask('server:test:node', ['test:node', 'open:test', 'watch:test-node']);

    grunt.registerTask('test:tap', ['express:load', 'connect:test_webserver', 'mocha_phantomjs:noreporter', 'mochaTest:noreporter', 'lineremover:tap']);



    grunt.registerTask('build', ['test', 'preprocess:main']);

    grunt.registerTask('dist', ['preprocess:main']);

    grunt.registerTask('build:bundle', ['preprocess:bundle']);

};