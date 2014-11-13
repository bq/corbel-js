'use strict';

module.exports = function(grunt) {

    var mountFolder = function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    var path = require('path');

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
                            mountFolder(connect, 'src/'),
                            mountFolder(connect, 'bower_components/')
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
                            mountFolder(connect, 'test/webapp/'),
                            mountFolder(connect, 'src/'),
                            mountFolder(connect, 'bower_components/')
                        ];
                    }
                }

            }
        },
        watch: {
            options: {
                task: ['']
            },
            webapp: {
                files: [
                    'examples/webapp/**/*',
                    'src/**/*'
                ],
                // tasks: ['jshint'],
                options: {
                    livereload: 35729
                }
            },
            nodeapp: {
                files: [
                    'examples/nodeapp/**'
                ]
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
            nodeapp: {
                options: {
                    reporter: 'tap',
                    captureFile: 'target/nodeapp/test_results.dirty.tap', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/nodeapp/**/*.js']
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
            tap: {
                options: {
                    reporter: 'tap',
                    output: 'target/**/test_results.dirty.tap'
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
        }
    });

    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-line-remover');


    grunt.registerTask('server:webapp', [
        'express:load',
        'execute:nodeapp',
        'connect:webserver',
        'open:webapp',
        'watch:webapp'
    ]);

    grunt.registerTask('server:nodeapp', [
        'express:load',
        'execute:nodeapp',
        'watch:nodeapp'
    ]);

    grunt.registerTask('test:webapp', [
        'express:load',
        'connect:test_webserver',
        'mocha_phantomjs:tap',
        'lineremover:tap'
    ]);

    grunt.registerTask('test:nodeapp', [
        'express:load',
        'mochaTest:nodeapp',
        'lineremover:tap'
    ]);

    grunt.registerTask('test', [
        'express:load',
        'connect:test_webserver',
        'mocha_phantomjs:tap',
        'mochaTest:nodeapp',
        'lineremover:tap'
    ]);

    grunt.registerTask('build', [
        'test'
    ]);

};