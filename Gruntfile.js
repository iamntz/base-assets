module.exports = function(grunt) {
  var extend = require( 'extend' );
  var args = process.argv;
  var isDev = args.indexOf('dev') > -1;

  require('time-grunt')(grunt);

  require('jit-grunt')(grunt, {
    sprite : 'grunt-spritesmith',
    jasmine: 'grunt-contrib-jasmine'
  });

  var assets   = grunt.file.readJSON('assets.json');
  var jsFiles  = require('./grunt-tasks/js-files.js')( assets.javascripts, extend, isDev );
  var cssFiles = require('./grunt-tasks/css-files.js')( assets.stylesheets, extend, isDev );
  var sprites  = require( './grunt-tasks/sprites-task.js' )( assets.stylesheets, extend, isDev );

  var package_json  = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: package_json,

    jshint: {
      files: jsFiles.lint,
      options: {
        reporter: require('jshint-stylish'),
        globals: {
          jQuery   : true,
          console : true,
          module  : true,
          document: true
        },
        laxcomma: true,
        laxbreak: true,
        sub     : true
      }
    },

    concat: jsFiles.concat,
    uglify: jsFiles.uglify,
    jasmine : jsFiles.tests,
    sass: cssFiles.sass,
    sprite: sprites.sprites,

    watch: require('./grunt-tasks/watch-task.js')( jsFiles.watch, cssFiles.watch ),

    jst: {
      {%= name %}: {
        options: {
          namespace: "{%= name %}Views",
          prettify: true,
          processName: function(src) {
            return src.replace( /(src\/javascripts\/{%= name %}\/app\/Templates\/)|(.html)/ig, '');
          }
        },
        files: {
          "dist/javascripts/templates.js": ["src/javascripts/{%= name %}/app/Templates/**/*.html"]
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma-config.js'
      },

      dev: {
        browsers: ['PhantomJS'],
        reporters: ['beep', 'dots']
      }
    },

    copy : {
      assets: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: [
              'images/**/*',
              'fonts/**/*',
              '!images/sprites/**/*',
            ],
            dest: 'dist/'
          }
        ]
      }
    },

    clean: {
      build: [ "src/stylesheets/sprites/", "dist" ]
    },
  });

  grunt.registerTask('default', []);

  grunt.registerTask('js', [ 'jst', 'jshint', 'concat' ]);
  grunt.registerTask('assets', [ 'copy' ]);
  grunt.registerTask('css', [ 'sass' ]);
  grunt.registerTask('default', [ 'clean', 'assets', 'css', 'js', 'uglify', 'jasmine' ]);
  grunt.registerTask('dev', [ 'default', 'watch' ]);
};