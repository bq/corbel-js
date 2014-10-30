'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        open: {
            webserver: {
                path: 'localhost:8000/examples/webapp/',
                app: 'google-chrome'
            }
        },
        connect: {
            webserver: {
                options: {
                    port: 8000,
                    protocol: 'html',
                    hostname: 'localhost',
                    base: '.',
                    directory: './examples/webapp/',
                    open: {
                        target: 'http://localhost:8000/examples/webapp', // target url to open
                        appName: 'google-chrome', // name of the app that opens, ie: open, start, xdg-open
                        callback: function() {} // called when the app has opened
                    }
                }
            }
        }
    });

    // grunt.registerTask('dist', 'Bitbloq dist Task', [
    //     'test',
    //     'copy:blockly',
    //     'copy:clipboard',
    //     '_package'
    // ]);

    // grunt.registerTask('connect', function() {

    // });

    console.log('www-root' + 'examples/webapp');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('server', [
        //'open:webserver',
        'connect:webserver:keepalive'
    ]);
};