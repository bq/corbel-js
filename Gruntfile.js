'use strict'

module.exports = function (grunt) {
  var mountFolder = function (connect, dir) {
    return serveStatic(dir)
  }

  var path = require('path')
  var serveStatic = require('serve-static')

  require('load-grunt-tasks')(grunt)

  var ports = {
    server: 9000,
    test: 8000,
    livereload: 35729,
    express: 3000
  }

  function jsdocTask () {
    var exec = require('child_process').exec
    var done = this.async()

    var jsdocCmd = './node_modules/jsdoc/jsdoc'

    var src = ' -r src'
    var dest = ' -d doc'
    var config = ' -c .jsdoc'
    var template = ' -t node_modules/jaguarjs-jsdoc'

    exec(jsdocCmd + src + dest + config + template, function (err, stdout, stderr) {
      console.log(stdout)
      console.log(stderr)
      done(err === null)
    })
  }

  grunt.registerTask('jsdoc', 'Generates JSDoc', jsdocTask)

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),

    clean: {
      all: ['.tmp', 'dist', 'doc'],
      tap: ['.tmp/**/*.dirty.tap']
    },

    copy: {
      coverage: {
        expand: true,
        src: [
          'test/**'
        ],
        dest: '.tmp/coverage/'
      },
      'test-browser': {
        src: ['test/browser/index.html'],
        dest: '.tmp/'
      }
    },

    jsbeautifier: {
      files: ['dist/**/*.js'],
      options: {}
    },

    blanket: {
      coverage: {
        src: ['dist/'],
        dest: '.tmp/coverage/dist/'
      }
    },

    execute: {
      nodeapp: {
        src: ['examples/nodeapp/main.js']
      }
    },
    open: {
      webapp: {
        path: 'http://localhost:' + ports.server,
        app: 'google-chrome'
      },
      test: {
        path: 'http://localhost:' + ports.test,
        app: 'google-chrome'
      }
    },

    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        client: {
          mocha: {
            timeout: 90000
          }
        }
      },
      unit: {
        singleRun: true
      },
      serve: {
        singleRun: false,
        browsers: [
          'Chrome'
        ]
      }
    },

    'node-inspector': {
      options: {
        'web-port': 3001,
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
      options: {
        hostname: '0.0.0.0',
        livereload: ports.livereload
      },
      webserver: {
        options: {
          port: ports.server,
          middleware: function (connect) {
            return [
              mountFolder(connect, 'examples/webapp/'),
              mountFolder(connect, 'dist/'),
              mountFolder(connect, 'bower_components/'),
              mountFolder(connect, 'vendor/')
            ]
          }
        }
      },
      'test_webserver': {
        options: {
          port: ports.test,
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp/test/browser/'),
              mountFolder(connect, 'dist/'),
              mountFolder(connect, 'bower_components/'),
              mountFolder(connect, 'vendor/')
            ]
          }
        }

      },
      'jsdoc_webserver': {
        options: {
          port: ports.test,
          middleware: function (connect) {
            return [
              mountFolder(connect, 'doc/')
            ]
          }
        }

      }
    },

    standard: {
      lint: {
        src: [
          './{src,test}/**/*.js',
          '*.js'
        ]
      },
      format: {
        options: {
          format: true,
          lint: true
        },
        src: [
          './{src,test}/**/*.js',
          '*.js'
        ]
      }
    },

    watch: {
      options: {
        nospawn: true,
        livereload: ports.livereload
      },
      corbel: {
        files: ['src/**/*']
      },
      webapp: {
        files: [
          'examples/webapp/**/*',
          'src/**/*'
        ],
        tasks: ['build']
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
        tasks: ['build', 'test:browser:reload']
      },
      'test-node': {
        files: [
          'test/browser/**',
          'src/**/*'
        ],
        tasks: ['build', 'test:node:reload']
      },
      'jsdoc': {
        files: [
          'src/**/*.js'
        ],
        tasks: ['clean', 'jsdoc']
      }
    },
    express: {
      options: {
        port: ports.express,
        server: path.resolve('./examples/express/app')
      },
      load: {}
    },
    mochaTest: { // test for nodejs app with mocha
      testCoverage: {
        options: {
          reporter: 'spec'
        },
        src: ['.tmp/coverage/test/node/test-suite.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: '.tmp/coverage.html'
        },
        src: ['.tmp/coverage/test/node/test-suite.js']
      },
      coveralls: {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: '.tmp/lcov.info'
        },
        src: ['.tmp/coverage/test/node/test-suite.js']
      },
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['.tmp/coverage/test/node/test-suite.js']
      },
      tap: {
        options: {
          reporter: 'tap',
          captureFile: '.tmp/test/report/node/test_results.dirty.tap', // Optionally capture the reporter output to a file
          quiet: false // Optionally suppress output to standard out (defaults to false)
        },
        src: ['test/node/test-suite.js']
      },
      ci: {
        src: ['test/node/test-suite.js']
      }
    }, // test for browser app with mocha and phanthom
    'mocha_phantomjs': {
      options: {
        urls: [
          'http://localhost:' + ports.test /* <%= connect.options.port %>*/
        ],
        setting: [
          'webSecurityEnabled=false',
          'remote-debugger-autorun=true',
          'remote-debugger-port=9002',
          'ignore-ssl-errors=true'
        ]
      },
      ci: {},
      tap: {
        options: {
          reporter: 'tap',
          output: '.tmp/test/report/browser/test_results.dirty.tap'
        }
      }
    },
    coveralls: {
      'default': {
        src: '.tmp/lcov.info'
      }
    },
    lineremover: {
      tap: {
        options: {
          inclusionPattern: /^(((not )?ok \d)|# \w+ \d|\d..\d).*$/gm
        },
        files: [{
          expand: true,
          cwd: '.tmp',
          src: [
            '**/*.dirty.tap'
          ],
          dest: '.tmp/',
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
      'default': {
        src: 'src/build/default.js',
        dest: 'dist/corbel.js'
      },
      'polyfills': {
        src: 'src/build/with-polyfills.js',
        dest: 'dist/corbel.with-polyfills.js'
      },
      'test-browser': {
        src: 'test/browser/test-suite.js',
        dest: '.tmp/test/browser/test-suite.js'
      }
    },
    release: {
      /* For more options: https://github.com/geddski/grunt-release#options */
      options: {
        additionalFiles: ['bower.json'],
        indentation: '\t', // default: '  ' (two spaces)
        commitMessage: 'Release v<%= version %>', // default: 'release <%= version %>'
        tagMessage: 'v<%= version %>', // default: 'Version <%= version %>',
        tagName: 'v<%= version %>'
      }
    },

    versioncheck: {
      options: {
        skip: ['angular', 'angular-mocks'],
        hideUpToDate: true
      }
    }

  })

  grunt.registerTask('serve:webapp', [
    'build',
    'express:load',
    'execute:nodeapp',
    'connect:webserver',
    'open:webapp',
    'watch:webapp'
  ])

  grunt.registerTask('serve:webapp:debug', [
    'build',
    'execute:nodeapp',
    'connect:webserver',
    'open:webapp',
    'watch:webapp'
  ])

  grunt.registerTask('serve:nodeapp', [
    'express:load',
    'execute:nodeapp',
    'watch:nodeapp'
  ])

  grunt.registerTask('test', [
    'test:browser',
    'mochaTest:ci'
  ])

  grunt.registerTask('test:browser', [
    'standard:format',
    'build',
    'standard:lint',
    'copy:test-browser',
    'preprocess:test-browser',
    'express:load',
    'connect:test_webserver',
    'karma:unit'
  ])

  grunt.registerTask('test:node', [
    'standard:format',
    'build',
    'standard:lint',
    'express:load',
    'mochaTest:ci'
  ]) // 'mochaTest:tap', 'lineremover:tap'

  grunt.registerTask('test:browser:reload', [
    'copy:test-browser',
    'preprocess:test-browser',
    'express:load',
    'mocha_phantomjs:ci'
  ]) // mocha_phantomjs:tap, 'lineremover:tap'

  grunt.registerTask('test:node:reload', [
    'express:load',
    'mocha_phantomjs:ci'
  ]) // mocha_phantomjs:tap, 'lineremover:tap'

  grunt.registerTask('serve:test', [
    'standard:format',
    'build',
    'copy:test-browser',
    'preprocess:test-browser',
    'express:load',
    'karma:serve',
    'watch:test'
  ])

  grunt.registerTask('serve:test:node', [
    'test:node',
    'open:test',
    'watch:test-node'
  ])

  grunt.registerTask('test:tap', [
    'test:browser',
    'mocha_phantomjs:tap',
    'mochaTest:tap'
  // 'lineremover:tap'
  ])

  grunt.registerTask('coverage:node', [
    'clean',
    'build',
    'blanket',
    'copy:coverage',
    'express:load',
    'mochaTest:testCoverage',
    'mochaTest:coverage',
    'mochaTest:coveralls',
    'mochaTest:travis-cov'
  ])

  grunt.registerTask('serve:jsdoc', [
    'clean',
    'jsdoc',
    'connect:jsdoc_webserver',
    'open:test',
    'watch:jsdoc'
  ])

  grunt.registerTask('build', ['versioncheck', 'preprocess:default', 'preprocess:polyfills', 'jsbeautifier'])

  grunt.registerTask('dist', ['test'])

  grunt.registerTask('default', ['dist'])
}
