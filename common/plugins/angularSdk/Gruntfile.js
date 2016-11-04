module.exports = function (grunt) {
    'use strict';
    //Requiring the helper file..
    var helper = require(__dirname + '/../../helper')();
    grunt.loadNpmTasks('grunt-loopback-sdk-angular');
    grunt.loadNpmTasks('grunt-docular');
    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-http-server');
    // Project configuration
    grunt.initConfig({
        loopback_sdk_angular: {
          services: {
            options: {
              input: helper.getServerPath(),
              output: 'client/js/lb-services.js'
            }
          }
        },
        docular: {
          groups: [
            {
              groupTitle: 'LoopBack',
              groupId: 'loopback',
              sections: [
                {
                  id: 'lbServices',
                  title: 'LoopBack Services',
                  scripts: [ 'client/js/lb-services.js' ]
                }
              ]
            }
          ]
        },
       'http-server': {
        'dev': {
            // the server root directory
            root: 'docular_generated',

            // the server port
            // can also be written as a function, e.g.
            // port: function() { return 8282; }
            port: 8282,

            // the host ip address
            // If specified to, for example, "127.0.0.1" the server will
            // only be available on that ip.
            // Specify "0.0.0.0" to be available everywhere
            host: "0.0.0.0",
            cache: 0,
            showDir : true,
            autoIndex: true,
            // server default file extension
            ext: "html",
            // run in parallel with other tasks
            runInBackground: false,
            // Tell grunt task to open the browser
            openBrowser : true
          }
        }
    });



    // Default task
    grunt.registerTask('default', ['loopback_sdk_angular', 'docular']);
    // Default task
    grunt.registerTask('serve', ['loopback_sdk_angular', 'docular', 'http-server']);
};

